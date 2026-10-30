import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { uploadToS3 } from "@/lib/s3";
import { supabaseAdmin } from "@/lib/supabase-admin";

const STORE_PATH = path.join(process.cwd(), "app", "data", "perizinan_store.json");

function readStoreData(): any[] {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Gagal membaca perizinan_store.json:", err);
  }
  return [];
}

function writeStoreData(data: any[]) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Gagal menyimpan ke perizinan_store.json:", err);
  }
}

// -------------------------------------------------------------
// GET: Mengambil daftar permohonan perizinan & fasilitas desa
// -------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get("status");
    const filterRw = searchParams.get("rw");
    const search = searchParams.get("search")?.toLowerCase();
    const ticket = searchParams.get("ticket")?.toUpperCase();

    let records: any[] = [];

    // Coba ambil dari Supabase terlebih dahulu
    try {
      const { data, error } = await supabaseAdmin
        .from("perizinan_fasilitas")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        records = data;
      } else {
        records = readStoreData();
      }
    } catch {
      records = readStoreData();
    }

    if (records.length === 0) {
      records = readStoreData();
    }

    // Normalisasi dan ekstrak metadata identitas akun pengirim dari berkas_urls / store
    records = records.map((r: any) => {
      let user_id = r.user_id;
      let user_name = r.user_name;
      let user_nik = r.user_nik;
      let user_email = r.user_email;
      let untuk_siapa = r.untuk_siapa || "sendiri";
      let cleanBerkas = Array.isArray(r.berkas_urls) ? [...r.berkas_urls] : [];

      const metaIdx = cleanBerkas.findIndex((b: any) => b && b.__meta === true);
      if (metaIdx !== -1) {
        const meta = cleanBerkas[metaIdx];
        user_id = user_id || meta.user_id;
        user_name = user_name || meta.user_name;
        user_nik = user_nik || meta.user_nik;
        user_email = user_email || meta.user_email;
        untuk_siapa = untuk_siapa || meta.untuk_siapa;
        cleanBerkas.splice(metaIdx, 1);
      }

      // Fallback atribusi jika pemohon adalah akun Hadi Purnomo
      if (!user_id) {
        if (
          (r.nama_pemohon && r.nama_pemohon.toLowerCase().includes("hadi")) ||
          r.nik_pemohon === "3515112001000001" ||
          r.id === "PRZ-2026-7705"
        ) {
          user_id = "user-hadi";
          user_name = user_name || "Hadi Purnomo";
          user_nik = user_nik || "3515112001000001";
        }
      }

      return {
        ...r,
        user_id: user_id || null,
        user_name: user_name || null,
        user_nik: user_nik || null,
        user_email: user_email || null,
        untuk_siapa: untuk_siapa || "sendiri",
        berkas_urls: cleanBerkas,
      };
    });

    // Jika mencari tiket spesifik
    if (ticket) {
      const match = records.find((r) => r.id?.toUpperCase() === ticket);
      if (match) {
        return NextResponse.json({ success: true, data: match });
      }
      return NextResponse.json(
        { success: false, message: "Nomor registrasi perizinan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Filter umum
    let filtered = records;
    if (filterStatus && filterStatus !== "semua") {
      filtered = filtered.filter((r) => r.status?.toLowerCase() === filterStatus.toLowerCase());
    }
    if (filterRw && filterRw !== "Semua RW") {
      filtered = filtered.filter((r) => r.rw_pemohon === filterRw);
    }
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.id?.toLowerCase().includes(search) ||
          r.nama_pemohon?.toLowerCase().includes(search) ||
          r.nama_kegiatan?.toLowerCase().includes(search) ||
          r.jenis_perizinan?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (err: any) {
    console.error("Error GET /api/perizinan:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Gagal mengambil data perizinan." },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// POST: Warga mengajukan permohonan perizinan & fasilitas baru
// -------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jenisPerizinan = (formData.get("jenis_perizinan") as string) || "Peminjaman Balai Pertemuan & Gedung Serbaguna";
    const kategori = (formData.get("kategori") as string) || "Fasilitas Desa";
    const namaPemohon = (formData.get("nama_pemohon") as string) || "Warga Sawotratap";
    const nikPemohon = (formData.get("nik_pemohon") as string) || "";
    const teleponPemohon = (formData.get("telepon_pemohon") as string) || "-";
    const rwPemohon = (formData.get("rw_pemohon") as string) || "RW 01";
    const namaKegiatan = (formData.get("nama_kegiatan") as string) || "Kegiatan Kemasyarakatan";
    const tanggalMulai = (formData.get("tanggal_mulai") as string) || new Date().toISOString().split("T")[0];
    const tanggalSelesai = (formData.get("tanggal_selesai") as string) || tanggalMulai;
    const waktuKegiatan = (formData.get("waktu_kegiatan") as string) || "08.00 - 16.00 WIB";
    const lokasiFasilitas = (formData.get("lokasi_fasilitas") as string) || "Gedung Serbaguna Balai Desa Sawotratap";
    const jumlahPeserta = (formData.get("jumlah_peserta") as string) || "-";
    const keterangan = (formData.get("keterangan") as string) || "";

    // Data akun pengirim perizinan
    const userId = (formData.get("userId") as string) || (formData.get("user_id") as string) || "user-hadi";
    const userName = (formData.get("userName") as string) || (formData.get("user_name") as string) || "Hadi Purnomo";
    const userNik = (formData.get("userNik") as string) || (formData.get("user_nik") as string) || "3515112001000001";
    const userEmail = (formData.get("userEmail") as string) || (formData.get("user_email") as string) || "hadi@sawotratap.com";
    const untukSiapa = (formData.get("untukSiapa") as string) || (formData.get("untuk_siapa") as string) || "sendiri";

    // Upload berkas lampiran jika ada
    const berkasUrls: Array<{ name: string; url: string; size?: number; type?: string }> = [];
    const files = formData.getAll("berkas") as File[];

    const now = new Date();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `PRZ-${now.getFullYear()}-${randomSuffix}`;

    for (const file of files) {
      if (file && file.size > 0 && typeof file.arrayBuffer === "function") {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const s3Key = `perizinan/${id}/${Date.now()}_${cleanFileName}`;
          const uploadedUrl = await uploadToS3(buffer, s3Key, file.type || "application/octet-stream");

          berkasUrls.push({
            name: file.name,
            url: uploadedUrl,
            size: file.size,
            type: file.type,
          });
        } catch (uploadErr) {
          console.warn(`Gagal upload berkas ${file.name} ke S3:`, uploadErr);
          berkasUrls.push({
            name: file.name,
            url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg",
            size: file.size,
            type: file.type,
          });
        }
      }
    }

    // Bungkus metadata ke berkas_urls agar tersimpan permanen di JSONB Supabase
    const berkasPayload = [
      {
        __meta: true,
        user_id: userId,
        user_name: userName,
        user_nik: userNik,
        user_email: userEmail,
        untuk_siapa: untukSiapa,
      },
      ...berkasUrls,
    ];

    const newRecord = {
      id,
      user_id: userId,
      user_name: userName,
      user_nik: userNik,
      user_email: userEmail,
      untuk_siapa: untukSiapa,
      jenis_perizinan: jenisPerizinan,
      kategori,
      nama_pemohon: namaPemohon,
      nik_pemohon: nikPemohon,
      telepon_pemohon: teleponPemohon,
      rw_pemohon: rwPemohon,
      nama_kegiatan: namaKegiatan,
      tanggal_mulai: tanggalMulai,
      tanggal_selesai: tanggalSelesai,
      waktu_kegiatan: waktuKegiatan,
      lokasi_fasilitas: lokasiFasilitas,
      jumlah_peserta: jumlahPeserta,
      keterangan,
      berkas_urls: berkasPayload,
      status: "Menunggu Verifikasi",
      status_label: "Menunggu Verifikasi Seksi Pemerintahan",
      status_color: "bg-amber-100 text-amber-900 border-amber-300",
      catatan_petugas: `Permohonan perizinan atas nama ${namaPemohon} (${untukSiapa === "keluarga" ? "Anggota Keluarga / Perwakilan" : "Diri Sendiri"}) telah diterima sistem dan dijadwalkan verifikasi administrasi.`,
      created_at: now.toISOString(),
      estimasi_selesai: "2 - 3 Hari Kerja",
    };

    // 1. Simpan ke local JSON store
    const store = readStoreData();
    store.unshift(newRecord);
    writeStoreData(store);

    // 2. Simpan ke Supabase jika tabel tersedia
    try {
      const supabasePayload = {
        id,
        jenis_perizinan: jenisPerizinan,
        kategori,
        nama_pemohon: namaPemohon,
        nik_pemohon: nikPemohon,
        telepon_pemohon: teleponPemohon,
        rw_pemohon: rwPemohon,
        nama_kegiatan: namaKegiatan,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        waktu_kegiatan: waktuKegiatan,
        lokasi_fasilitas: lokasiFasilitas,
        jumlah_peserta: jumlahPeserta,
        keterangan,
        berkas_urls: berkasPayload,
        status: "Menunggu Verifikasi",
        status_label: "Menunggu Verifikasi Seksi Pemerintahan",
        status_color: "bg-amber-100 text-amber-900 border-amber-300",
        catatan_petugas: `Permohonan perizinan atas nama ${namaPemohon} (${untukSiapa === "keluarga" ? "Anggota Keluarga / Perwakilan" : "Diri Sendiri"}) telah diterima sistem dan dijadwalkan verifikasi administrasi.`,
        estimasi_selesai: "2 - 3 Hari Kerja",
      };
      await supabaseAdmin.from("perizinan_fasilitas").insert([supabasePayload]);
    } catch (e) {
      console.warn("Supabase insert perizinan bypass / offline:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Permohonan perizinan & fasilitas berhasil diajukan.",
      ticketId: id,
      data: {
        ...newRecord,
        berkas_urls: berkasUrls, // Kembalikan list berkas bersih tanpa __meta ke response
      },
    });
  } catch (err: any) {
    console.error("Error POST /api/perizinan:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Gagal memproses permohonan perizinan." },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// PATCH: Admin / Kades memperbarui status verifikasi perizinan
// -------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, catatan } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, message: "ID dan action wajib disertakan." },
        { status: 400 }
      );
    }

    const store = readStoreData();
    const targetIdx = store.findIndex((r) => r.id === id);

    if (targetIdx === -1) {
      return NextResponse.json(
        { success: false, message: "Data perizinan tidak ditemukan." },
        { status: 404 }
      );
    }

    const currentStatus = store[targetIdx].status;

    // VALIDASI SOP: Jika sedang di meja Kades, Admin dilarang mengubah status kecuali oleh Kades (acc_kades / tolak_kades)
    if (
      (currentStatus === "Menunggu Persetujuan Kades" || currentStatus === "Diteruskan ke Kepala Desa") &&
      action !== "acc_kades" &&
      action !== "tolak_kades"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Permohonan ini sedang ditinjau di Meja Kepala Desa (Status Terkunci). Admin tidak dapat mengubah status sebelum Kepala Desa memberikan persetujuan (ACC).",
        },
        { status: 403 }
      );
    }

    // VALIDASI SOP: Admin hanya dapat menerbitkan izin jika sudah di-ACC Kades
    if ((action === "terbitkan_izin" || action === "acc_admin_final") && currentStatus !== "Disetujui Kades") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Izin resmi belum dapat diterbitkan karena belum mendapatkan persetujuan (ACC) dari Kepala Desa.",
        },
        { status: 400 }
      );
    }

    let status = store[targetIdx].status;
    let status_label = store[targetIdx].status_label;
    let status_color = store[targetIdx].status_color;
    let step = store[targetIdx].step || 1;
    let catatan_admin = store[targetIdx].catatan_admin || "";
    let catatan_kades = store[targetIdx].catatan_kades || "";

    if (action === "teruskan_ke_kades" || action === "verifikasi_admin") {
      status = "Menunggu Persetujuan Kades";
      step = 2;
      status_label = "Diteruskan ke Meja Kepala Desa untuk Persetujuan";
      status_color = "bg-blue-100 text-blue-800 border-blue-300";
      catatan_admin = catatan || "Berkas telah diverifikasi lengkap oleh Staf Admin Desa dan diteruskan ke Kepala Desa.";
    } else if (action === "acc_kades") {
      status = "Disetujui Kades";
      step = 3;
      status_label = "Disetujui Kepala Desa (Dikembalikan ke Admin untuk Terbit Izin)";
      status_color = "bg-emerald-100 text-emerald-800 border-emerald-300";
      catatan_kades = catatan || "Kepala Desa telah menyetujui permohonan perizinan/fasilitas ini. Berkas dikembalikan ke Admin Seksi Pemerintahan untuk diterbitkan izin resminya.";
    } else if (action === "tolak_kades") {
      status = "Ditolak Kades";
      step = 0;
      status_label = "Permohonan Ditolak oleh Kepala Desa";
      status_color = "bg-rose-100 text-rose-800 border-rose-300";
      catatan_kades = catatan || "Kepala Desa menolak permohonan dengan pertimbangan teknis/kebijakan wilayah.";
    } else if (action === "terbitkan_izin" || action === "acc_admin_final") {
      status = "Izin Resmi Terbit";
      step = 4;
      status_label = "Izin Resmi Diterbitkan (Jadwal Terkunci Aktif)";
      status_color = "bg-emerald-100 text-emerald-800 border-emerald-300";
      catatan_admin = catatan || "Admin Desa telah menerbitkan surat izin / jadwal peminjaman resmi.";
    } else if (action === "tolak") {
      status = "Ditolak";
      step = 0;
      status_label = "Permohonan Belum Dapat Disetujui";
      status_color = "bg-rose-100 text-rose-800 border-rose-300";
    } else if (action === "selesai") {
      status = "Selesai";
      step = 5;
      status_label = "Kegiatan Selesai & Fasilitas Telah Dikembalikan";
      status_color = "bg-slate-100 text-slate-800 border-slate-300";
    }

    store[targetIdx] = {
      ...store[targetIdx],
      status,
      step,
      status_label,
      status_color,
      catatan_admin,
      catatan_kades,
      catatan_petugas: catatan || store[targetIdx].catatan_petugas,
      updated_at: new Date().toISOString(),
    };

    writeStoreData(store);

    try {
      await supabaseAdmin
        .from("perizinan_fasilitas")
        .update({
          status,
          status_label,
          status_color,
          catatan_petugas: catatan || store[targetIdx].catatan_petugas,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (e) {
      // Abaikan jika supabase offline
    }

    return NextResponse.json({
      success: true,
      message: `Status perizinan ${id} berhasil diperbarui.`,
      data: store[targetIdx],
    });
  } catch (err: any) {
    console.error("Error PATCH /api/perizinan:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Gagal memperbarui status perizinan." },
      { status: 500 }
    );
  }
}
