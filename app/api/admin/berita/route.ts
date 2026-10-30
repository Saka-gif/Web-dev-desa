import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToS3 } from "@/lib/s3";
import { DAFTAR_BERITA, BeritaItem } from "@/app/data/berita";

interface PengumumanItem {
  id: string;
  nomor: string;
  judul: string;
  waktu: string;
  lokasi: string;
  syarat: string;
  status: string;
  status_color?: string;
  created_at?: string;
}

interface AgendaItem {
  id: string;
  tanggal: string;
  jam: string;
  kegiatan: string;
  lokasi: string;
  created_at?: string;
}

const DAFTAR_PENGUMUMAN_FALLBACK: PengumumanItem[] = [
  {
    id: "p1",
    nomor: "140/082/2024",
    judul: "Penyaluran BLT Dana Desa Triwulan IV",
    waktu: "28 – 30 Oktober 2024",
    lokasi: "Pendopo Balai Desa",
    syarat: "Bawa KTP & KK Asli",
    status: "Penting / Segera",
    status_color: "bg-rose-100 text-rose-800 border-rose-300",
  },
  {
    id: "p2",
    nomor: "470/105/2024",
    judul: "Jemput Bola Perekaman KTP-el & IKD Digital",
    waktu: "Setiap Sabtu, 09.00 – 13.00 WIB",
    lokasi: "Balai RW 03 & 07",
    syarat: "Pemula usia 17 th bawa KK & Akta",
    status: "Layanan Terbuka",
    status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "p3",
    nomor: "973/044/2024",
    judul: "Batas Akhir Pelunasan PBB-P2 Tahun 2024",
    waktu: "Batas: 15 November 2024",
    lokasi: "Loket Balai Desa / Bank Jatim",
    syarat: "Bawa SPPT PBB tahun berjalan",
    status: "Batas Waktu",
    status_color: "bg-amber-100 text-amber-800 border-amber-300",
  },
];

const DAFTAR_AGENDA_FALLBACK: AgendaItem[] = [
  {
    id: "a1",
    tanggal: "28 Okt 2024",
    jam: "19.30 WIB",
    kegiatan: "Malam Sumpah Pemuda & Pentas Seni Karang Taruna",
    lokasi: "Halaman Balai Desa",
  },
  {
    id: "a2",
    tanggal: "03 Nov 2024",
    jam: "08.00 WIB",
    kegiatan: "Posyandu Balita & Imunisasi Rutin Bebas Stunting",
    lokasi: "Balai RW 02 & 06",
  },
  {
    id: "a3",
    tanggal: "10 Nov 2024",
    jam: "06.30 WIB",
    kegiatan: "Kerja Bakti 'Minggu Bersih' & Senam Lansia",
    lokasi: "Serentak 11 RW",
  },
  {
    id: "a4",
    tanggal: "18 Nov 2024",
    jam: "09.00 WIB",
    kegiatan: "Musyawarah Perencanaan Desa (Musrenbangdes 2025)",
    lokasi: "Ruang Rapat Balai Desa",
  },
];

// GET: Ambil daftar Berita, Pengumuman, dan Agenda
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "berita" | "pengumuman" | "agenda" | undefined

    let dataBerita: BeritaItem[] = [];
    let dataPengumuman: PengumumanItem[] = [];
    let dataAgenda: AgendaItem[] = [];

    // 1. Ambil Berita
    if (!type || type === "berita") {
      try {
        const { data, error } = await supabaseAdmin
          .from("berita")
          .select("*")
          .order("id", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          dataBerita = data;
        } else {
          dataBerita = DAFTAR_BERITA;
        }
      } catch {
        dataBerita = DAFTAR_BERITA;
      }
    }

    // 2. Ambil Pengumuman
    if (!type || type === "pengumuman") {
      try {
        const { data, error } = await supabaseAdmin
          .from("pengumuman")
          .select("*")
          .order("id", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          dataPengumuman = data;
        } else {
          dataPengumuman = DAFTAR_PENGUMUMAN_FALLBACK;
        }
      } catch {
        dataPengumuman = DAFTAR_PENGUMUMAN_FALLBACK;
      }
    }

    // 3. Ambil Agenda
    if (!type || type === "agenda") {
      try {
        const { data, error } = await supabaseAdmin
          .from("agenda")
          .select("*")
          .order("id", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          dataAgenda = data;
        } else {
          dataAgenda = DAFTAR_AGENDA_FALLBACK;
        }
      } catch {
        dataAgenda = DAFTAR_AGENDA_FALLBACK;
      }
    }

    return NextResponse.json({
      success: true,
      berita: dataBerita,
      pengumuman: dataPengumuman,
      agenda: dataAgenda,
      counts: {
        berita: dataBerita.length,
        pengumuman: dataPengumuman.length,
        agenda: dataAgenda.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat data", error: err.message },
      { status: 500 }
    );
  }
}

// POST: Tambah Berita, Pengumuman, atau Agenda baru
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const entityType = formData.get("type") as string; // "berita" | "pengumuman" | "agenda"

      if (entityType === "berita") {
        const judul = (formData.get("judul") as string) || "";
        const ringkasan = (formData.get("ringkasan") as string) || "";
        const kategori = (formData.get("kategori") as string) || "berita";
        const penulis = (formData.get("penulis") as string) || "Humas Pemdes";
        const tanggal = (formData.get("tanggal") as string) || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        const badge = (formData.get("badge") as string) || "Kabar Desa";
        const fotoUrlInput = (formData.get("fotoUrl") as string) || "";
        const fileFoto = formData.get("foto") as File | null;

        let finalFotoUrl = fotoUrlInput;
        if (fileFoto && typeof fileFoto.arrayBuffer === "function" && fileFoto.size > 0) {
          try {
            const buffer = Buffer.from(await fileFoto.arrayBuffer());
            const filename = `berita/berita-${Date.now()}-${fileFoto.name.replace(/\s+/g, "-")}`;
            finalFotoUrl = await uploadToS3(buffer, filename, fileFoto.type || "image/jpeg");
          } catch (uploadErr) {
            console.warn("Gagal upload foto berita ke S3, fallback url:", uploadErr);
          }
        }

        if (!finalFotoUrl) {
          finalFotoUrl = "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1000";
        }

        const newId = `b-${Date.now()}`;
        const newRecord = {
          id: newId,
          judul,
          ringkasan,
          kategori,
          penulis,
          tanggal,
          badge,
          foto: finalFotoUrl,
        };

        const { error } = await supabaseAdmin.from("berita").insert([newRecord]);
        if (error) {
          console.warn("Supabase insert berita warning:", error.message);
        }

        return NextResponse.json({ success: true, message: "Berita berhasil dipublikasikan", data: newRecord });
      }

      if (entityType === "pengumuman") {
        const nomor = (formData.get("nomor") as string) || `140/${Date.now().toString().slice(-4)}/2026`;
        const judul = (formData.get("judul") as string) || "";
        const waktu = (formData.get("waktu") as string) || "";
        const lokasi = (formData.get("lokasi") as string) || "Balai Desa Sawotratap";
        const syarat = (formData.get("syarat") as string) || "KTP / KK";
        const status = (formData.get("status") as string) || "Layanan Terbuka";
        const status_color = (formData.get("status_color") as string) || "bg-emerald-100 text-emerald-800 border-emerald-300";

        const newId = `p-${Date.now()}`;
        const newRecord = {
          id: newId,
          nomor,
          judul,
          waktu,
          lokasi,
          syarat,
          status,
          status_color,
        };

        const { error } = await supabaseAdmin.from("pengumuman").insert([newRecord]);
        if (error) {
          console.warn("Supabase insert pengumuman warning:", error.message);
        }

        return NextResponse.json({ success: true, message: "Pengumuman berhasil diterbitkan", data: newRecord });
      }

      if (entityType === "agenda") {
        const kegiatan = (formData.get("kegiatan") as string) || "";
        const tanggal = (formData.get("tanggal") as string) || "";
        const jam = (formData.get("jam") as string) || "09.00 WIB";
        const lokasi = (formData.get("lokasi") as string) || "Balai Desa Sawotratap";

        const newId = `a-${Date.now()}`;
        const newRecord = {
          id: newId,
          kegiatan,
          tanggal,
          jam,
          lokasi,
        };

        const { error } = await supabaseAdmin.from("agenda").insert([newRecord]);
        if (error) {
          console.warn("Supabase insert agenda warning:", error.message);
        }

        return NextResponse.json({ success: true, message: "Agenda kegiatan berhasil ditambahkan", data: newRecord });
      }
    }

    // Parsing JSON biasa
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ success: false, message: "Data atau tipe tidak valid" }, { status: 400 });
    }

    const newId = `${type[0]}-${Date.now()}`;
    const newRecord = { ...data, id: data.id || newId };

    const { error } = await supabaseAdmin.from(type).insert([newRecord]);
    if (error) {
      console.warn(`Supabase insert ${type} error:`, error.message);
    }

    return NextResponse.json({ success: true, message: "Data berhasil ditambahkan", data: newRecord });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT: Perbarui Berita, Pengumuman, atau Agenda
export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const entityType = formData.get("type") as string;
      const id = formData.get("id") as string;

      if (!id || !entityType) {
        return NextResponse.json({ success: false, message: "ID atau tipe entitas tidak valid" }, { status: 400 });
      }

      if (entityType === "berita") {
        const updateData: any = {};
        if (formData.has("judul")) updateData.judul = formData.get("judul") as string;
        if (formData.has("ringkasan")) updateData.ringkasan = formData.get("ringkasan") as string;
        if (formData.has("kategori")) updateData.kategori = formData.get("kategori") as string;
        if (formData.has("penulis")) updateData.penulis = formData.get("penulis") as string;
        if (formData.has("tanggal")) updateData.tanggal = formData.get("tanggal") as string;
        if (formData.has("badge")) updateData.badge = formData.get("badge") as string;

        const fileFoto = formData.get("foto") as File | null;
        const fotoUrlInput = formData.get("fotoUrl") as string;
        if (fileFoto && typeof fileFoto.arrayBuffer === "function" && fileFoto.size > 0) {
          try {
            const buffer = Buffer.from(await fileFoto.arrayBuffer());
            const filename = `berita/berita-${Date.now()}-${fileFoto.name.replace(/\s+/g, "-")}`;
            updateData.foto = await uploadToS3(buffer, filename, fileFoto.type || "image/jpeg");
          } catch (uploadErr) {
            console.warn("Gagal upload update foto berita:", uploadErr);
          }
        } else if (fotoUrlInput) {
          updateData.foto = fotoUrlInput;
        }

        const { error } = await supabaseAdmin.from("berita").update(updateData).eq("id", id);
        if (error) console.warn("Supabase update berita error:", error.message);

        return NextResponse.json({ success: true, message: "Berita berhasil diperbarui", data: updateData });
      }

      if (entityType === "pengumuman") {
        const updateData: any = {};
        if (formData.has("nomor")) updateData.nomor = formData.get("nomor") as string;
        if (formData.has("judul")) updateData.judul = formData.get("judul") as string;
        if (formData.has("waktu")) updateData.waktu = formData.get("waktu") as string;
        if (formData.has("lokasi")) updateData.lokasi = formData.get("lokasi") as string;
        if (formData.has("syarat")) updateData.syarat = formData.get("syarat") as string;
        if (formData.has("status")) updateData.status = formData.get("status") as string;
        if (formData.has("status_color")) updateData.status_color = formData.get("status_color") as string;

        const { error } = await supabaseAdmin.from("pengumuman").update(updateData).eq("id", id);
        if (error) console.warn("Supabase update pengumuman error:", error.message);

        return NextResponse.json({ success: true, message: "Pengumuman berhasil diperbarui", data: updateData });
      }

      if (entityType === "agenda") {
        const updateData: any = {};
        if (formData.has("kegiatan")) updateData.kegiatan = formData.get("kegiatan") as string;
        if (formData.has("tanggal")) updateData.tanggal = formData.get("tanggal") as string;
        if (formData.has("jam")) updateData.jam = formData.get("jam") as string;
        if (formData.has("lokasi")) updateData.lokasi = formData.get("lokasi") as string;

        const { error } = await supabaseAdmin.from("agenda").update(updateData).eq("id", id);
        if (error) console.warn("Supabase update agenda error:", error.message);

        return NextResponse.json({ success: true, message: "Agenda berhasil diperbarui", data: updateData });
      }
    }

    const body = await req.json();
    const { type, id, data } = body;
    if (!type || !id || !data) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from(type).update(data).eq("id", id);
    if (error) console.warn(`Supabase update ${type} error:`, error.message);

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui", data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE: Hapus Berita, Pengumuman, atau Agenda
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "berita" | "pengumuman" | "agenda"
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ success: false, message: "Parameter type dan id wajib disertakan" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from(type).delete().eq("id", id);
    if (error) {
      console.warn(`Supabase delete ${type} error:`, error.message);
    }

    return NextResponse.json({ success: true, message: `Data ${type} berhasil dihapus` });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
