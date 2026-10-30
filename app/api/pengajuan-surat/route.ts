import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const namaPemohon = formData.get("namaPemohon") as string;
    const nikPemohon = formData.get("nikPemohon") as string;
    const teleponPemohon = formData.get("teleponPemohon") as string;
    const rwPemohon = (formData.get("rwPemohon") as string) || "RW 01";
    const keperluan = formData.get("keperluan") as string;
    const jenisSuratId = formData.get("jenisSuratId") as string;
    const jenisSuratNama = formData.get("jenisSuratNama") as string;

    if (!namaPemohon || !nikPemohon || !teleponPemohon || !jenisSuratNama) {
      return NextResponse.json(
        { success: false, message: "Harap lengkapi semua data wajib (Nama, NIK, No. WhatsApp, dan Jenis Surat)." },
        { status: 400 }
      );
    }

    // Generate unique Ticket ID: SWT-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `SWT-2026-${randomSuffix}`;

    // Buat folder khusus per pemohon di bucket: pengajuan-surat/{TICKET}_{NAMA}/
    const cleanNama = namaPemohon.trim().replace(/[^a-zA-Z0-9]/g, "_").substring(0, 25);
    const userFolder = `pengajuan-surat/${ticketId}_${cleanNama}`;

    // Process file uploads to CloudKilat S3
    const files = formData.getAll("files") as File[];
    const uploadedFiles: Array<{ name: string; url: string; size: number; type: string; s3Path: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const s3Key = `${userFolder}/${cleanName}`;
          const fileUrl = await uploadToS3(buffer, s3Key, file.type || "application/octet-stream");

          uploadedFiles.push({
            name: file.name,
            url: fileUrl,
            size: file.size,
            type: file.type,
            s3Path: s3Key,
          });
        } catch (uploadErr) {
          console.error("Gagal mengunggah file ke S3 CloudKilat:", file.name, uploadErr);
        }
      }
    }

    const userId = (formData.get("userId") as string) || (formData.get("user_id") as string) || "user-hadi";
    const userName = (formData.get("userName") as string) || (formData.get("user_name") as string) || "Hadi Purnomo";
    const userNik = (formData.get("userNik") as string) || (formData.get("user_nik") as string) || "3515112001000001";
    const userEmail = (formData.get("userEmail") as string) || (formData.get("user_email") as string) || "hadi@sawotratap.com";
    const untukSiapa = (formData.get("untukSiapa") as string) || "sendiri";

    // Embed metadata identitas akun pengirim ke berkas_urls agar tersimpan permanen di DB
    const berkasPayload = [
      {
        __meta: true,
        user_id: userId,
        user_name: userName,
        user_nik: userNik,
        user_email: userEmail,
        untuk_siapa: untukSiapa,
      },
      ...uploadedFiles,
    ];

    // Record payload
    const record = {
      id: ticketId,
      jenis_surat: jenisSuratNama,
      jenis_surat_id: jenisSuratId || "surat-domisili",
      nama_pemohon: namaPemohon,
      nik_pemohon: nikPemohon,
      telepon_pemohon: teleponPemohon,
      rw_pemohon: rwPemohon,
      keperluan: keperluan || "-",
      berkas_urls: berkasPayload,
      status: "Antrean Verifikasi",
      step: 1,
      status_label: "Sedang Dalam Antrean Verifikasi",
      status_color: "bg-amber-100 text-amber-800 border-amber-300",
      estimasi_selesai: "1 x 24 Jam Kerja",
      catatan: `Berkas permohonan atas nama ${namaPemohon} (${untukSiapa === "keluarga" ? "Anggota Keluarga" : "Diri Sendiri"}) telah diterima sistem dan menunggu verifikasi petugas pelayanan Balai Desa.`,
    };

    // Save to Supabase
    let dbSuccess = false;
    let dbErrorMsg = "";
    try {
      const { data, error } = await supabaseAdmin
        .from("pengajuan_surat")
        .insert([record])
        .select()
        .single();

      if (error) {
        console.warn("Supabase insert notice:", error.message);
        dbErrorMsg = error.message;
      } else {
        dbSuccess = true;
      }
    } catch (err: any) {
      console.warn("Supabase exception:", err?.message || err);
      dbErrorMsg = err?.message || "Koneksi database bermasalah";
    }

    return NextResponse.json({
      success: true,
      ticketId,
      uploadedCount: uploadedFiles.length,
      files: uploadedFiles,
      dbSaved: dbSuccess,
      dbNotice: dbErrorMsg || undefined,
      data: record,
    });
  } catch (error: any) {
    console.error("Error in /api/pengajuan-surat:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan server saat memproses pengajuan." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get("ticket")?.trim().toUpperCase();
    const nik = searchParams.get("nik")?.trim();

    if (!ticket && !nik) {
      return NextResponse.json(
        { success: false, message: "Parameter ticket atau nik diperlukan." },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("pengajuan_surat").select("*");
    if (ticket) {
      query = query.eq("id", ticket);
    } else if (nik) {
      query = query.eq("nik_pemohon", nik);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ success: false, message: "Data pengajuan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
