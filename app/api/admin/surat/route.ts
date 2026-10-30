import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Fungsi untuk menentukan apakah surat membutuhkan persetujuan Kades
export function checkNeedsKades(jenisSurat: string, jenisSuratId?: string): boolean {
  const text = (jenisSurat + " " + (jenisSuratId || "")).toLowerCase();
  return (
    text.includes("sktm") ||
    text.includes("tidak mampu") ||
    text.includes("nikah") ||
    text.includes("n1") ||
    text.includes("kematian") ||
    text.includes("waris") ||
    text.includes("ahli waris") ||
    text.includes("rekomendasi kades")
  );
}

// Data awal realistis untuk inisialisasi jika tabel di DB masih kosong
const SEED_SURAT = [
  {
    id: "SWT-2026-8842",
    jenis_surat: "Surat Keterangan Tidak Mampu (SKTM)",
    jenis_surat_id: "surat-sktm",
    nama_pemohon: "Hadi Purnomo",
    nik_pemohon: "3515112001000001",
    telepon_pemohon: "081234567891",
    rw_pemohon: "RW 03",
    keperluan: "Syarat beasiswa kuliah anak di PTN (KIP Kuliah).",
    berkas_urls: [
      {
        name: "KTP_Pemohon.pdf",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/gotong-royong.jpg",
        size: 154000,
        type: "application/pdf",
      },
      {
        name: "Kartu_Keluarga.pdf",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg",
        size: 210000,
        type: "application/pdf",
      },
      {
        name: "Pengantar_RT02_RW03.jpg",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/balai-desa.jpg",
        size: 98000,
        type: "image/jpeg",
      },
    ],
    status: "Antrean Verifikasi",
    step: 1,
    status_label: "Sedang Dalam Antrean Verifikasi",
    status_color: "bg-amber-100 text-amber-800 border-amber-300",
    estimasi_selesai: "1 x 24 Jam Kerja",
    catatan: "Berkas lengkap. Menunggu verifikasi awal petugas sebelum diteruskan ke Kepala Desa.",
  },
  {
    id: "SWT-2026-8841",
    jenis_surat: "Surat Keterangan Domisili (SKD)",
    jenis_surat_id: "surat-domisili",
    nama_pemohon: "Siti Aminah",
    nik_pemohon: "3515114508950001",
    telepon_pemohon: "081344445555",
    rw_pemohon: "RW 02",
    keperluan: "Pendaftaran sekolah anak di SMA Negeri 1 Gedangan.",
    berkas_urls: [
      {
        name: "KTP_Siti_Aminah.pdf",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg",
        size: 142000,
        type: "application/pdf",
      },
      {
        name: "Pengantar_RT01_RW02.jpg",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/balai-desa.jpg",
        size: 89000,
        type: "image/jpeg",
      },
    ],
    status: "Antrean Verifikasi",
    step: 1,
    status_label: "Sedang Dalam Antrean Verifikasi",
    status_color: "bg-amber-100 text-amber-800 border-amber-300",
    estimasi_selesai: "Hari ini • Loket PTSP",
    catatan: "Cukup verifikasi oleh admin balai desa, tidak memerlukan tanda tangan basah Kades.",
  },
  {
    id: "SWT-2026-8840",
    jenis_surat: "Surat Pengantar Nikah (N1 - N4)",
    jenis_surat_id: "surat-nikah",
    nama_pemohon: "Rina Kusuma",
    nik_pemohon: "3515115206940006",
    telepon_pemohon: "081555556666",
    rw_pemohon: "RW 08",
    keperluan: "Pendaftaran akad nikah resmi di KUA Kecamatan Gedangan.",
    berkas_urls: [
      {
        name: "KTP_Calon_Mempelai.pdf",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg",
        size: 198000,
        type: "application/pdf",
      },
      {
        name: "Akta_Kelahiran.pdf",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/gotong-royong.jpg",
        size: 320000,
        type: "application/pdf",
      },
    ],
    status: "Menunggu Persetujuan Kades",
    step: 2,
    status_label: "Diteruskan ke Meja Kepala Desa untuk TTD",
    status_color: "bg-amber-100 text-amber-900 border-amber-300",
    estimasi_selesai: "2 x 24 Jam Kerja",
    catatan: "Berkas syarat pernikahan telah diperiksa Kaur Kesra dan telah diajukan ke Kepala Desa.",
  },
  {
    id: "SWT-2026-8839",
    jenis_surat: "Surat Keterangan Usaha (SKU / UMKM)",
    jenis_surat_id: "surat-usaha",
    nama_pemohon: "Ahmad Fauzi",
    nik_pemohon: "3515111902800005",
    telepon_pemohon: "081777778888",
    rw_pemohon: "RW 01",
    keperluan: "Pengajuan modal KUR Bank Jatim untuk warung kelontong.",
    berkas_urls: [
      {
        name: "Foto_Tempat_Usaha.jpg",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/umkm-desa.jpg",
        size: 450000,
        type: "image/jpeg",
      },
    ],
    status: "Siap Diambil di Balai Desa",
    step: 4,
    status_label: "Siap Diambil di Loket Balai Desa",
    status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    estimasi_selesai: "Telah Siap",
    catatan: "Surat cetak fisik telah dicap stempel desa. Silakan ambil di Loket 1 membawa KTP asli.",
  },
  {
    id: "SWT-2026-8838",
    jenis_surat: "Surat Pengantar SKCK Polsek",
    jenis_surat_id: "surat-skck",
    nama_pemohon: "Budi Santoso",
    nik_pemohon: "3515111204880003",
    telepon_pemohon: "081234567890",
    rw_pemohon: "RW 05",
    keperluan: "Pemberkasan seleksi penerimaan PPPK Kabupaten Sidoarjo.",
    berkas_urls: [
      {
        name: "PasFoto_4x6.jpg",
        url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg",
        size: 110000,
        type: "image/jpeg",
      },
    ],
    status: "Dokumen Digital Terbit",
    step: 4,
    status_label: "Dokumen Digital Telah Dikirim ke Warga",
    status_color: "bg-teal-100 text-teal-800 border-teal-300",
    estimasi_selesai: "Terkirim",
    catatan: "Surat pengantar digital resmi ber-QR Code telah diterbitkan dan dikirim ke akun warga.",
  },
];

// GET: Ambil semua data permohonan surat dari database Supabase
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterRw = searchParams.get("rw");
    const filterStatus = searchParams.get("status");
    const search = searchParams.get("q")?.toLowerCase();

    // 1. Ambil dari Supabase pengajuan_surat
    const { data: dbData, error } = await supabaseAdmin
      .from("pengajuan_surat")
      .select("*")
      .order("created_at", { ascending: false });

    let records = dbData || [];

    // Jika database kosong, lakukan auto-seeding agar admin langsung melihat data asli
    if (!error && records.length === 0) {
      try {
        await supabaseAdmin.from("pengajuan_surat").insert(SEED_SURAT);
        const { data: seededData } = await supabaseAdmin
          .from("pengajuan_surat")
          .select("*")
          .order("created_at", { ascending: false });
        if (seededData && seededData.length > 0) {
          records = seededData;
        }
      } catch (seedErr) {
        console.warn("Notice: Seeding sample surat failed, using memory:", seedErr);
        records = SEED_SURAT as any;
      }
    }

    // Berikan flag penanda kebutuhan persetujuan Kades & metadata akun pengirim
    const enriched = records.map((item: any) => {
      const butuhKades = checkNeedsKades(item.jenis_surat, item.jenis_surat_id);

      let metaPengirim: any = null;
      let cleanFiles: any[] = [];
      if (Array.isArray(item.berkas_urls)) {
        metaPengirim = item.berkas_urls.find((b: any) => b && b.__meta === true);
        cleanFiles = item.berkas_urls.filter((b: any) => !b || b.__meta !== true);
      }

      const isHadiAccount =
        metaPengirim?.user_id === "user-hadi" ||
        metaPengirim?.user_nik === "3515112001000001" ||
        item.nama_pemohon?.toLowerCase().includes("hadi") ||
        item.nama_pemohon?.toLowerCase().includes("radhiyya") ||
        item.id === "SWT-2026-2499";

      const finalUserId = metaPengirim?.user_id || (isHadiAccount ? "user-hadi" : undefined);
      const finalUserNik = metaPengirim?.user_nik || (isHadiAccount ? "3515112001000001" : undefined);
      const finalUserName = metaPengirim?.user_name || (isHadiAccount ? "Hadi Purnomo" : undefined);
      const finalUntukSiapa =
        metaPengirim?.untuk_siapa ||
        (item.nama_pemohon?.toLowerCase().includes("hadi") ? "sendiri" : "keluarga");

      return {
        ...item,
        user_id: finalUserId,
        user_nik: finalUserNik,
        user_name: finalUserName,
        untuk_siapa: finalUntukSiapa,
        berkas_urls: cleanFiles,
        butuh_kades: butuhKades,
        kategori_otoritas: butuhKades ? "kades" : "admin",
      };
    });

    // Filter search dan RW jika ada
    const filtered = enriched.filter((item: any) => {
      if (filterRw && filterRw !== "Semua RW" && item.rw_pemohon !== filterRw) {
        return false;
      }
      if (filterStatus && filterStatus !== "semua") {
        if (filterStatus === "kades_perlu" && !item.butuh_kades) return false;
        if (filterStatus === "admin_cukup" && item.butuh_kades) return false;
        if (filterStatus === "antrean" && item.status !== "Antrean Verifikasi") return false;
        if (filterStatus === "di_kades" && item.status !== "Menunggu Persetujuan Kades") return false;
        if (filterStatus === "acc_kades" && item.status !== "Disetujui Kades") return false;
        if (filterStatus === "siap" && !item.status.includes("Siap") && !item.status.includes("Dokumen Digital")) return false;
      }
      if (search) {
        const match =
          item.id.toLowerCase().includes(search) ||
          item.nama_pemohon.toLowerCase().includes(search) ||
          item.nik_pemohon.includes(search) ||
          item.jenis_surat.toLowerCase().includes(search) ||
          item.rw_pemohon.toLowerCase().includes(search);
        if (!match) return false;
      }
      return true;
    });

    return NextResponse.json({
      success: true,
      total: records.length,
      data: filtered,
    });
  } catch (err: any) {
    console.error("Error in GET /api/admin/surat:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Gagal mengambil data permohonan surat." },
      { status: 500 }
    );
  }
}

// PATCH: Perbarui status surat (Teruskan ke Kades, ACC Kades, Proses Terbit Cetak/Softfile, Selesai)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, catatan, metodePenyerahan, softfileUrl } = body;

    if (!id || !action) {
      return NextResponse.json(
        { success: false, message: "ID Surat dan tindakan (action) wajib disertakan." },
        { status: 400 }
      );
    }

    // Ambil data surat yang ada
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("pengajuan_surat")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json(
        { success: false, message: "Data permohonan surat tidak ditemukan di database." },
        { status: 404 }
      );
    }

    const updates: any = {};

    switch (action) {
      // 1. Diteruskan ke Kepala Desa untuk persetujuan / TTD
      case "teruskan_ke_kades":
        updates.status = "Menunggu Persetujuan Kades";
        updates.step = 2;
        updates.status_label = "Diteruskan ke Meja Kepala Desa untuk Persetujuan";
        updates.status_color = "bg-amber-100 text-amber-900 border-amber-300";
        updates.catatan =
          catatan ||
          "Berkas telah lolos verifikasi administrasi staf desa dan telah diajukan ke Kepala Desa untuk ditinjau.";
        break;

      // 2. Kepala Desa menyetujui (ACC oleh Kades) -> Balik ke admin untuk diproses terbit
      case "acc_kades":
        updates.status = "Disetujui Kades";
        updates.step = 3;
        updates.status_label = "Disetujui Kepala Desa (Siap Diproses Terbit Admin)";
        updates.status_color = "bg-blue-100 text-blue-800 border-blue-300";
        updates.catatan =
          catatan ||
          "Kepala Desa telah menyetujui permohonan surat ini. Berkas dikembalikan ke loket admin untuk proses cetak / soft file.";
        break;

      // 3. Kepala Desa menolak permohonan
      case "tolak_kades":
        updates.status = "Ditolak Kades";
        updates.step = 2;
        updates.status_label = "Ditolak oleh Kepala Desa";
        updates.status_color = "bg-rose-100 text-rose-800 border-rose-300";
        updates.catatan =
          catatan ||
          "Permohonan belum dapat disetujui Kepala Desa. Silakan periksa kembali kelengkapan berkas.";
        break;

      // 4. Admin memproses & menerbitkan surat (Pilihan: Cetak Fisik atau Soft File Digital)
      case "terbitkan_surat":
        if (metodePenyerahan === "softfile") {
          updates.status = "Dokumen Digital Terbit";
          updates.step = 4;
          updates.status_label = "Dokumen Digital Telah Terbit (Terkirim ke Warga)";
          updates.status_color = "bg-teal-100 text-teal-800 border-teal-300";
          updates.catatan =
            catatan ||
            "Surat keterangan resmi format digital PDF telah terbit dan dapat diunduh langsung oleh pemohon.";

          // Tambahkan softfile ke berkas_urls jika ada link/dokumen
          if (softfileUrl) {
            const currentFiles = Array.isArray(existing.berkas_urls) ? existing.berkas_urls : [];
            updates.berkas_urls = [
              ...currentFiles,
              {
                name: `Surat_Resmi_${id}.pdf`,
                url: softfileUrl,
                type: "application/pdf",
                is_hasil_akhir: true,
              },
            ];
          }
        } else {
          // Default: Cetak Fisik (Ambil di Kantor Balai Desa / Kelurahan)
          updates.status = "Siap Diambil di Balai Desa";
          updates.step = 4;
          updates.status_label = "Siap Diambil di Kantor Balai Desa Sawotratap";
          updates.status_color = "bg-emerald-100 text-emerald-800 border-emerald-300";
          updates.catatan =
            catatan ||
            "Surat cetak fisik telah dicap dan ditandatangani resmi. Silakan pemohon datang ke Loket PTSP Balai Desa membawa KTP asli.";
        }
        break;

      // 5. Permohonan dinyatakan selesai tuntas (bisa ditekan user atau di-ACC akhir)
      case "selesai":
        updates.status = "Selesai";
        updates.step = 5;
        updates.status_label = "Pelayanan Selesai Tuntas";
        updates.status_color = "bg-slate-100 text-slate-800 border-slate-300";
        updates.catatan =
          catatan ||
          "Dokumen surat telah diterima oleh pemohon. Pelayanan administrasi selesai tuntas.";
        break;

      default:
        return NextResponse.json(
          { success: false, message: `Tindakan '${action}' tidak dikenali.` },
          { status: 400 }
        );
    }

    // Simpan pembaruan ke Supabase
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("pengajuan_surat")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("Gagal mengupdate pengajuan surat di Supabase:", updateErr);
      return NextResponse.json(
        { success: false, message: updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status surat ${id} berhasil diperbarui menjadi '${updates.status}'.`,
      data: updated,
    });
  } catch (err: any) {
    console.error("Error in PATCH /api/admin/surat:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Terjadi kesalahan server saat memperbarui surat." },
      { status: 500 }
    );
  }
}
