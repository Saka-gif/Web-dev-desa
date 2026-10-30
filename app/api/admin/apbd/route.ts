import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tahun = searchParams.get("tahun") || "2026";

    // 1. Ambil Ringkasan APBD
    const { data: ringkasan, error: errRingkasan } = await supabaseAdmin
      .from("apbd_ringkasan")
      .select("*")
      .eq("tahun", tahun)
      .maybeSingle();

    // 2. Ambil Semua Program APBD
    const { data: program, error: errProgram } = await supabaseAdmin
      .from("apbd_program")
      .select("*")
      .order("urutan", { ascending: true });

    if (errRingkasan || errProgram) {
      console.warn("Supabase APBD warning:", errRingkasan?.message, errProgram?.message);
    }

    return NextResponse.json({
      success: true,
      ringkasan: ringkasan || {
        id: "2026",
        tahun: "2026",
        total_pagu: "Rp 2.85 M",
        realisasi_dana: "Rp 2.62 M",
        persen_penyerapan: "91.9%",
        alokasi_fisik: "Rp 1.25 M",
        surplus_kas: "Rp 230 Jt",
        status_verifikasi: "Terverifikasi Resmi BPD",
      },
      program: program || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data APBD", error: err.message },
      { status: 500 }
    );
  }
}

// POST: Tambah Program Anggaran / Pengeluaran Baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, kategori, anggaran, status, progres, keterangan, lokasi, tahun = "2026" } = body;

    if (!nama || !anggaran) {
      return NextResponse.json(
        { success: false, message: "Nama kegiatan dan anggaran wajib diisi" },
        { status: 400 }
      );
    }

    // Hitung urutan tertinggi saat ini
    const { data: existing } = await supabaseAdmin
      .from("apbd_program")
      .select("urutan")
      .order("urutan", { ascending: false })
      .limit(1);

    const nextUrutan = (existing?.[0]?.urutan || 0) + 1;
    const newId = `prog-${Date.now()}`;

    const newRecord = {
      id: newId,
      tahun,
      nama: nama.trim(),
      kategori: kategori || "Infrastruktur",
      anggaran: anggaran.trim(),
      status: status || (Number(progres) >= 100 ? "selesai" : "proses"),
      progres: typeof progres === "number" ? Math.min(100, Math.max(0, progres)) : 0,
      keterangan: keterangan?.trim() || "",
      lokasi: lokasi?.trim() || "Desa Sawotratap",
      urutan: nextUrutan,
    };

    const { data, error } = await supabaseAdmin
      .from("apbd_program")
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error("Gagal insert apbd_program:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Program anggaran berhasil ditambahkan",
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT: Perbarui Program ATAU Ringkasan APBD
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, id, data } = body; // target: 'ringkasan' | 'program'

    if (target === "ringkasan") {
      const tahun = data.tahun || "2026";
      const { error } = await supabaseAdmin
        .from("apbd_ringkasan")
        .upsert({
          id: tahun,
          tahun: tahun,
          total_pagu: data.total_pagu,
          realisasi_dana: data.realisasi_dana,
          persen_penyerapan: data.persen_penyerapan,
          alokasi_fisik: data.alokasi_fisik,
          surplus_kas: data.surplus_kas,
          status_verifikasi: data.status_verifikasi || "Terverifikasi Resmi BPD",
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Gagal update ringkasan APBD:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Ringkasan APBD berhasil diperbarui" });
    }

    // Default target: program
    if (!id || !data) {
      return NextResponse.json({ success: false, message: "ID dan data program wajib disertakan" }, { status: 400 });
    }

    const updatePayload: any = { ...data };
    if (data.progres !== undefined) {
      updatePayload.progres = Math.min(100, Math.max(0, Number(data.progres)));
      if (updatePayload.progres >= 100 && !data.status) {
        updatePayload.status = "selesai";
      }
    }

    const { error } = await supabaseAdmin
      .from("apbd_program")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("Gagal update program APBD:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Program anggaran berhasil diperbarui" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE: Hapus Program Anggaran
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Parameter id wajib disertakan" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("apbd_program")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Gagal delete program APBD:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Program anggaran berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
