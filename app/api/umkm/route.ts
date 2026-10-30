import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DAFTAR_PRODUK_UMKM, UmkmItem } from "@/app/data/umkm";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

// GET: Mengambil daftar UMKM (Default: status 'disetujui')
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const statusParam = searchParams.get("status"); // 'disetujui' | 'menunggu' | 'all'
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    let query = supabaseAdmin.from("umkm").select("*");

    // Jika mencari 1 UMKM spesifik untuk persiapan halaman detail
    if (slug) {
      const { data, error } = await query.eq("slug", slug).maybeSingle();
      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
      const fallbackItem = DAFTAR_PRODUK_UMKM.find((u) => u.slug === slug);
      if (fallbackItem) {
        return NextResponse.json({ success: true, data: fallbackItem });
      }
      return NextResponse.json({ success: false, message: "UMKM tidak ditemukan" }, { status: 404 });
    }

    if (id) {
      const { data, error } = await query.eq("id", id).maybeSingle();
      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
      const fallbackItem = DAFTAR_PRODUK_UMKM.find((u) => u.id === id);
      if (fallbackItem) {
        return NextResponse.json({ success: true, data: fallbackItem });
      }
      return NextResponse.json({ success: false, message: "UMKM tidak ditemukan" }, { status: 404 });
    }

    // Filter status: Default hanya tampilkan yang sudah di-ACC ('disetujui')
    if (statusParam && statusParam !== "all") {
      query = query.eq("status", statusParam);
    } else if (!statusParam) {
      query = query.eq("status", "disetujui");
    }

    if (kategori && kategori !== "Semua") {
      query = query.eq("kategori", kategori);
    }

    query = query.order("urutan", { ascending: true }).order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let filteredData = data as UmkmItem[];
      if (search) {
        filteredData = filteredData.filter(
          (u) =>
            u.nama?.toLowerCase().includes(search) ||
            u.pemilik?.toLowerCase().includes(search) ||
            u.lokasi?.toLowerCase().includes(search) ||
            u.deskripsi_singkat?.toLowerCase().includes(search)
        );
      }
      return NextResponse.json({
        success: true,
        source: "database",
        count: filteredData.length,
        data: filteredData,
      });
    }

    // Fallback data lokal jika database belum terisi
    let fallbackData = [...DAFTAR_PRODUK_UMKM];
    if (kategori && kategori !== "Semua") {
      fallbackData = fallbackData.filter((u) => u.kategori === kategori);
    }
    if (search) {
      fallbackData = fallbackData.filter(
        (u) =>
          u.nama.toLowerCase().includes(search) ||
          u.pemilik.toLowerCase().includes(search) ||
          u.lokasi.toLowerCase().includes(search) ||
          (u.deskripsi_singkat?.toLowerCase().includes(search) ?? false)
      );
    }
    if (limit) {
      fallbackData = fallbackData.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      count: fallbackData.length,
      data: fallbackData,
    });
  } catch (error: any) {
    console.error("Error GET /api/umkm:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal memuat katalog UMKM" },
      { status: 500 }
    );
  }
}

// POST: Formulir Pendaftaran Usaha UMKM Warga Sawotratap
// Status default otomatis 'menunggu' (Menunggu ACC verifikasi dari admin desa)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nama = (formData.get("nama") as string)?.trim();
    const kategori = (formData.get("kategori") as string)?.trim() || "Kuliner";
    const pemilik = (formData.get("pemilik") as string)?.trim();
    const nikPemilik = (formData.get("nikPemilik") as string)?.trim() || null;
    let kontakWa = (formData.get("kontakWa") as string)?.trim();
    const harga = (formData.get("harga") as string)?.trim() || "Hubungi Penjual";
    const lokasi = (formData.get("lokasi") as string)?.trim() || "Desa Sawotratap";
    const rw = (formData.get("rw") as string)?.trim() || "RW 01";
    const deskripsiSingkat = (formData.get("deskripsiSingkat") as string)?.trim();
    const deskripsiLengkap = (formData.get("deskripsiLengkap") as string)?.trim() || "";
    const jamOperasional = (formData.get("jamOperasional") as string)?.trim() || "08.00 - 20.00 WIB";

    // Validasi dasar
    if (!nama || !pemilik || !kontakWa || !deskripsiSingkat) {
      return NextResponse.json(
        {
          success: false,
          message: "Harap lengkapi formulir wajib: Nama Usaha, Pemilik, No. WhatsApp, dan Deskripsi Produk.",
        },
        { status: 400 }
      );
    }

    // Normalisasi nomor WA ke format 628...
    kontakWa = kontakWa.replace(/[^0-9]/g, "");
    if (kontakWa.startsWith("08")) {
      kontakWa = "62" + kontakWa.substring(1);
    } else if (kontakWa.startsWith("+62")) {
      kontakWa = kontakWa.substring(1);
    }

    // Generate unique ID & Slug
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `umkm-${Date.now().toString().slice(-6)}-${randSuffix}`;
    const slug = `${generateSlug(nama)}-${randSuffix}`;

    // Handle Upload Foto ke CloudKilat S3 jika ada file
    let fotoUrl = "/aset/umkm-desa.jpg";
    const file = formData.get("foto") as File | null;
    const fotoGallery: string[] = [];

    if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const s3Key = `umkm/${id}/${cleanName}`;
        const uploadedUrl = await uploadToS3(buffer, s3Key, file.type || "image/jpeg");
        fotoUrl = uploadedUrl;
        fotoGallery.push(uploadedUrl);
      } catch (uploadErr) {
        console.warn("Peringatan: Gagal unggah foto UMKM ke S3, memakai default:", uploadErr);
      }
    }

    // Payload pendaftaran: status otomatis 'menunggu'
    const newUmkmPayload = {
      id,
      slug,
      nama,
      kategori,
      pemilik,
      nik_pemilik: nikPemilik,
      kontak_wa: kontakWa,
      harga,
      rating: 5.0,
      lokasi,
      rw,
      foto: fotoUrl,
      foto_gallery: fotoGallery,
      deskripsi_singkat: deskripsiSingkat,
      deskripsi_lengkap: deskripsiLengkap || deskripsiSingkat,
      jam_operasional: jamOperasional,
      alamat_lengkap: `${lokasi}, ${rw}, Desa Sawotratap`,
      status: "menunggu", // Butuh persetujuan / ACC admin desa
      catatan_admin: "Pendaftaran mandiri oleh warga melalui portal website desa.",
      is_unggulan: false,
      urutan: 99,
    };

    // Simpan ke Supabase
    let dbSuccess = false;
    let dbErrorMsg = "";
    try {
      const { error } = await supabaseAdmin.from("umkm").insert([newUmkmPayload]);
      if (error) {
        console.warn("Supabase insert umkm notice:", error.message);
        dbErrorMsg = error.message;
      } else {
        dbSuccess = true;
      }
    } catch (err: any) {
      console.warn("Supabase exception on umkm insert:", err?.message || err);
      dbErrorMsg = err?.message || "Koneksi database bermasalah";
    }

    return NextResponse.json({
      success: true,
      message: "Pendaftaran UMKM berhasil dikirim! Data Anda akan diverifikasi oleh Admin Balai Desa sebelum diterbitkan di etalase web.",
      id,
      slug,
      status: "menunggu",
      dbSaved: dbSuccess,
      dbNotice: dbErrorMsg || undefined,
      data: newUmkmPayload,
    });
  } catch (error: any) {
    console.error("Error POST /api/umkm:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan server saat memproses pendaftaran UMKM." },
      { status: 500 }
    );
  }
}
