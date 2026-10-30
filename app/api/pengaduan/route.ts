import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const kategori = (formData.get("kategori") as string) || "Infrastruktur Jalan Berlubang";
    const lokasi = formData.get("lokasi") as string;
    const isiAduan = formData.get("isiAduan") as string;
    const namaPelapor = (formData.get("namaPelapor") as string) || "Warga Sawotratap";
    const kontakPelapor = (formData.get("kontakPelapor") as string) || "-";

    if (!lokasi || !isiAduan) {
      return NextResponse.json(
        { success: false, message: "Harap isi lokasi kejadian dan uraian aduan secara lengkap." },
        { status: 400 }
      );
    }

    // Generate unique ID Aduan: ADU-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const aduanId = `ADU-2026-${randomSuffix}`;

    // Buat folder terpisah di S3 bucket: pengaduan-warga/{ID_ADUAN}_{KATEGORI}/
    const cleanKategori = kategori.trim().replace(/[^a-zA-Z0-9]/g, "_").substring(0, 25);
    const aduanFolder = `pengaduan-warga/${aduanId}_${cleanKategori}`;

    // Process optional photos/documentation
    const photos = formData.getAll("photos") as File[];
    const uploadedPhotos: Array<{ name: string; url: string; size: number; type: string; s3Path: string }> = [];

    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const s3Key = `${aduanFolder}/${cleanName}`;
          const fileUrl = await uploadToS3(buffer, s3Key, file.type || "image/jpeg");

          uploadedPhotos.push({
            name: file.name,
            url: fileUrl,
            size: file.size,
            type: file.type,
            s3Path: s3Key,
          });
        } catch (uploadErr) {
          console.error("Gagal mengunggah dokumentasi kerusakan ke S3:", file.name, uploadErr);
        }
      }
    }

    // Record payload
    const record = {
      id: aduanId,
      kategori,
      lokasi,
      nama_pelapor: namaPelapor,
      kontak_pelapor: kontakPelapor,
      isi_aduan: isiAduan,
      foto_urls: uploadedPhotos,
      status: "Menunggu Verifikasi",
      status_color: "bg-amber-100 text-amber-800 border-amber-300",
      catatan_petugas: "Laporan aduan telah dicatat dan menunggu peninjauan seksi terkait.",
    };

    // Save to Supabase table pengaduan_warga
    let dbSuccess = false;
    let dbErrorMsg = "";
    try {
      const { data, error } = await supabaseAdmin
        .from("pengaduan_warga")
        .insert([record])
        .select()
        .single();

      if (error) {
        console.warn("Supabase pengaduan notice:", error.message);
        dbErrorMsg = error.message;
      } else {
        dbSuccess = true;
      }
    } catch (err: any) {
      console.warn("Supabase exception on pengaduan:", err?.message || err);
      dbErrorMsg = err?.message || "Koneksi database bermasalah";
    }

    return NextResponse.json({
      success: true,
      aduanId,
      uploadedCount: uploadedPhotos.length,
      files: uploadedPhotos,
      dbSaved: dbSuccess,
      dbNotice: dbErrorMsg || undefined,
      data: record,
    });
  } catch (error: any) {
    console.error("Error in /api/pengaduan:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan server saat memproses laporan pengaduan." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim().toUpperCase();

    let query = supabaseAdmin.from("pengaduan_warga").select("*");
    if (id) {
      query = query.eq("id", id);
      const { data, error } = await query.maybeSingle();
      if (error) return NextResponse.json({ success: false, message: error.message }, { status: 400 });
      return NextResponse.json({ success: true, data });
    }

    // Return latest 10 complaints
    const { data, error } = await query.order("created_at", { ascending: false }).limit(10);
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
