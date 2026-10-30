import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { uploadToS3 } from "@/lib/s3";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DAFTAR_PRODUK_UMKM, UmkmItem } from "@/app/data/umkm";

const STORE_PATH = path.join(process.cwd(), "app", "data", "umkm_store.json");

function readStoreData(): UmkmItem[] {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Gagal membaca umkm_store.json:", err);
  }
  return DAFTAR_PRODUK_UMKM;
}

function writeStoreData(data: UmkmItem[]) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Gagal menyimpan ke umkm_store.json:", err);
  }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

const VALID_SUPABASE_COLUMNS = [
  "id", "slug", "nama", "kategori", "pemilik", "nik_pemilik", "kontak_wa",
  "harga", "harga_angka", "rating", "lokasi", "rw", "foto", "foto_gallery",
  "deskripsi_singkat", "deskripsi_lengkap", "jam_operasional", "alamat_lengkap",
  "status", "catatan_admin", "is_unggulan", "urutan", "created_at", "updated_at"
];

function sanitizeForSupabase(item: any): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const col of VALID_SUPABASE_COLUMNS) {
    if (item[col] !== undefined) {
      clean[col] = item[col];
    }
  }
  if (!clean.deskripsi_singkat && item.deskripsi) {
    clean.deskripsi_singkat = item.deskripsi;
  }
  if (!clean.deskripsi_lengkap && (item.deskripsi || item.deskripsi_singkat)) {
    clean.deskripsi_lengkap = item.deskripsi_singkat || item.deskripsi;
  }
  if (!clean.kontak_wa && item.kontak) {
    clean.kontak_wa = item.kontak;
  }
  if (clean.rating && typeof clean.rating === "string") {
    clean.rating = parseFloat(clean.rating) || 5.0;
  }
  if (clean.harga_angka === undefined && clean.harga) {
    const num = parseInt(clean.harga.replace(/[^0-9]/g, ""), 10);
    clean.harga_angka = isNaN(num) ? 0 : num;
  }
  return clean;
}

// -------------------------------------------------------------
// GET: Mengambil katalog UMKM
// Mendukung:
// 1. Filter spesifik user (?nik=... atau ?pemilik=...) -> menampilkan SEMUA status produk miliknya
// 2. Filter publik (?status=disetujui atau default) -> etalase produk warga
// 3. Detail 1 item (?id=... atau ?slug=...)
// -------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userNik = searchParams.get("nik") || searchParams.get("userNik");
    const pemilikParam = searchParams.get("pemilik")?.toLowerCase().trim();
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const statusParam = searchParams.get("status"); // 'disetujui' | 'menunggu' | 'ditolak' | 'all'
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    // Ambil basis data dari Supabase jika ada, dan gabungkan dengan local store
    let records: UmkmItem[] = [];
    const localStore = readStoreData();
    try {
      const { data, error } = await supabaseAdmin
        .from("umkm")
        .select("*")
        .order("urutan", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const dbItems = data as UmkmItem[];
        const dbIds = new Set(dbItems.map((d) => d.id));
        // Gabungkan item local store yang belum ada di Supabase
        const missingFromDb = localStore.filter((l) => !dbIds.has(l.id));
        records = [...missingFromDb, ...dbItems];
      } else {
        records = localStore;
      }
    } catch {
      records = localStore;
    }

    // 1. Pencarian 1 produk by ID atau Slug
    if (id) {
      const found = records.find((u) => u.id === id);
      if (found) return NextResponse.json({ success: true, data: found });
      return NextResponse.json({ success: false, message: "UMKM tidak ditemukan" }, { status: 404 });
    }
    if (slug) {
      const found = records.find((u) => u.slug === slug);
      if (found) return NextResponse.json({ success: true, data: found });
      return NextResponse.json({ success: false, message: "UMKM tidak ditemukan" }, { status: 404 });
    }

    // 2. JIKA REQUEST KHUSUS PRODUK MILIK USER LOGIN
    if (userNik || pemilikParam) {
      let userProducts = records.filter((item) => {
        // Cek NIK
        if (userNik && item.nik_pemilik) {
          const uNik = userNik.trim();
          const pNik = item.nik_pemilik.trim();
          if (uNik === pNik) return true;
          // Alias NIK demo warga Hadi Purnomo
          if (
            (uNik === "3515112001000001" || uNik === "3515082103900001") &&
            (pNik === "3515112001000001" || pNik === "3515082103900001")
          ) {
            return true;
          }
        }
        // Cek Nama Pemilik
        if (pemilikParam && item.pemilik) {
          const itemPemilik = item.pemilik.toLowerCase();
          if (itemPemilik.includes(pemilikParam) || pemilikParam.includes(itemPemilik)) {
            return true;
          }
        }
        return false;
      });

      // Filter status jika diminta spesifik, jika tidak ada param status / status='all', tampilkan SEMUA milik user
      if (statusParam && statusParam !== "all") {
        userProducts = userProducts.filter((u) => (u.status || "menunggu") === statusParam);
      }

      if (kategori && kategori !== "Semua") {
        userProducts = userProducts.filter((u) => u.kategori === kategori);
      }

      if (search) {
        userProducts = userProducts.filter(
          (u) =>
            u.nama?.toLowerCase().includes(search) ||
            u.deskripsi_singkat?.toLowerCase().includes(search) ||
            u.lokasi?.toLowerCase().includes(search)
        );
      }

      return NextResponse.json({
        success: true,
        isUserSpecific: true,
        count: userProducts.length,
        data: userProducts,
      });
    }

    // 3. REQUEST PUBLIK (Etalase Desa): Default hanya tampilkan status 'disetujui'
    let publicProducts = [...records];
    if (statusParam && statusParam !== "all") {
      publicProducts = publicProducts.filter((u) => (u.status || "menunggu") === statusParam);
    } else if (!statusParam) {
      publicProducts = publicProducts.filter((u) => (u.status || "disetujui") === "disetujui");
    }

    if (kategori && kategori !== "Semua") {
      publicProducts = publicProducts.filter((u) => u.kategori === kategori);
    }

    if (search) {
      publicProducts = publicProducts.filter(
        (u) =>
          u.nama?.toLowerCase().includes(search) ||
          u.pemilik?.toLowerCase().includes(search) ||
          u.lokasi?.toLowerCase().includes(search) ||
          u.deskripsi_singkat?.toLowerCase().includes(search)
      );
    }

    if (limit) {
      publicProducts = publicProducts.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      count: publicProducts.length,
      data: publicProducts,
    });
  } catch (error: any) {
    console.error("Error GET /api/umkm:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal memuat katalog UMKM" },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// POST: Formulir Pendaftaran Usaha UMKM Warga Sawotratap
// Status default otomatis 'menunggu' (Menunggu ACC verifikasi dari admin desa)
// -------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    let payload: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const nama = (formData.get("nama") as string)?.trim();
      const kategori = (formData.get("kategori") as string)?.trim() || "Kuliner";
      const pemilik = (formData.get("pemilik") as string)?.trim();
      const nikPemilik = (formData.get("nikPemilik") as string || formData.get("nik_pemilik") as string)?.trim() || null;
      let kontakWa = (formData.get("kontakWa") as string || formData.get("kontak_wa") as string)?.trim();
      const harga = (formData.get("harga") as string)?.trim() || "Hubungi Penjual";
      const lokasi = (formData.get("lokasi") as string)?.trim() || "Desa Sawotratap";
      const rw = (formData.get("rw") as string)?.trim() || "RW 03";
      const deskripsiSingkat = (formData.get("deskripsiSingkat") as string || formData.get("deskripsi_singkat") as string)?.trim();
      const deskripsiLengkap = (formData.get("deskripsiLengkap") as string || formData.get("deskripsi_lengkap") as string)?.trim() || "";
      const jamOperasional = (formData.get("jamOperasional") as string || formData.get("jam_operasional") as string)?.trim() || "08.00 - 20.00 WIB";

      if (!nama || !pemilik || !kontakWa || !deskripsiSingkat) {
        return NextResponse.json(
          {
            success: false,
            message: "Harap lengkapi formulir wajib: Nama Usaha, Pemilik, No. WhatsApp, dan Deskripsi Produk.",
          },
          { status: 400 }
        );
      }

      // Normalisasi WA
      kontakWa = kontakWa.replace(/[^0-9]/g, "");
      if (kontakWa.startsWith("08")) kontakWa = "62" + kontakWa.substring(1);
      else if (kontakWa.startsWith("+62")) kontakWa = kontakWa.substring(1);

      // Handle file foto
      let fotoUrl = "/aset/umkm-desa.jpg";
      const file = formData.get("foto") as File | null;
      const fotoGallery: string[] = [];
      const randSuffix = Math.floor(1000 + Math.random() * 9000);
      const id = `umkm-${Date.now().toString().slice(-6)}-${randSuffix}`;

      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const s3Key = `umkm/${id}/${cleanName}`;
          const uploadedUrl = await uploadToS3(buffer, s3Key, file.type || "image/jpeg");
          fotoUrl = uploadedUrl;
          fotoGallery.push(uploadedUrl);
        } catch (uploadErr) {
          console.warn("Peringatan: Gagal unggah foto UMKM ke S3:", uploadErr);
        }
      }

      payload = {
        id,
        slug: `${generateSlug(nama)}-${randSuffix}`,
        nama,
        kategori,
        pemilik,
        penjual: `${pemilik} (${rw})`,
        nik_pemilik: nikPemilik,
        kontak_wa: kontakWa,
        kontak: kontakWa,
        harga,
        rating: "5.0",
        lokasi,
        rw,
        foto: fotoUrl,
        foto_gallery: fotoGallery.length > 0 ? fotoGallery : [fotoUrl],
        deskripsi_singkat: deskripsiSingkat,
        deskripsi: deskripsiSingkat,
        deskripsi_lengkap: deskripsiLengkap || deskripsiSingkat,
        jam_operasional: jamOperasional,
        alamat_lengkap: `${lokasi}, ${rw}, Sawotratap, Gedangan, Sidoarjo`,
        status: "menunggu",
        catatan_admin: "Pendaftaran produk baru berhasil dikirim dan sedang menunggu verifikasi admin balai desa.",
        is_unggulan: false,
        urutan: 99,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      // JSON body
      const body = await req.json();
      const randSuffix = Math.floor(1000 + Math.random() * 9000);
      const id = body.id || `umkm-${Date.now().toString().slice(-6)}-${randSuffix}`;

      let kontakWa = (body.kontak_wa || body.kontakWa || "").toString().replace(/[^0-9]/g, "");
      if (kontakWa.startsWith("08")) kontakWa = "62" + kontakWa.substring(1);
      else if (kontakWa.startsWith("+62")) kontakWa = kontakWa.substring(1);

      payload = {
        id,
        slug: body.slug || `${generateSlug(body.nama || "produk")}-${randSuffix}`,
        nama: body.nama,
        kategori: body.kategori || "Kuliner",
        pemilik: body.pemilik || "Warga Sawotratap",
        penjual: `${body.pemilik || "Warga"} (${body.rw || "RW 03"})`,
        nik_pemilik: body.nik_pemilik || body.nikPemilik || null,
        kontak_wa: kontakWa,
        kontak: kontakWa,
        harga: body.harga || "Mulai Rp 20.000",
        rating: body.rating || "5.0",
        lokasi: body.lokasi || "Sawotratap",
        rw: body.rw || "RW 03",
        foto: body.foto || "/aset/umkm-desa.jpg",
        foto_gallery: body.foto_gallery || [body.foto || "/aset/umkm-desa.jpg"],
        deskripsi_singkat: body.deskripsi_singkat || body.deskripsiSingkat || "",
        deskripsi: body.deskripsi_singkat || body.deskripsiSingkat || "",
        deskripsi_lengkap: body.deskripsi_lengkap || body.deskripsiLengkap || "",
        jam_operasional: body.jam_operasional || body.jamOperasional || "08.00 - 20.00 WIB",
        alamat_lengkap: body.alamat_lengkap || `${body.lokasi || ""}, ${body.rw || ""}, Sawotratap`,
        status: "menunggu",
        catatan_admin: "Pendaftaran produk baru berhasil dikirim dan sedang menunggu verifikasi admin balai desa.",
        is_unggulan: false,
        urutan: 99,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // Simpan ke local store
    const localStore = readStoreData();
    localStore.unshift(payload);
    writeStoreData(localStore);

    // Simpan ke Supabase (jika tersedia)
    try {
      await supabaseAdmin.from("umkm").insert([sanitizeForSupabase(payload)]);
    } catch (err: any) {
      console.warn("Supabase insert umkm notice:", err?.message || err);
    }

    return NextResponse.json({
      success: true,
      message: "Pendaftaran UMKM berhasil dikirim! Menunggu verifikasi ACC dari Admin Balai Desa.",
      data: payload,
    });
  } catch (error: any) {
    console.error("Error POST /api/umkm:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan server saat mendaftarkan UMKM." },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// PUT: Edit / Update Produk UMKM Warga
// Warga dapat mengedit informasi produk usahanya sendiri
// -------------------------------------------------------------
export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let id = "";
    let updateData: Partial<UmkmItem> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = (formData.get("id") as string)?.trim();
      if (!id) {
        return NextResponse.json({ success: false, message: "ID produk UMKM wajib disertakan." }, { status: 400 });
      }

      const nama = (formData.get("nama") as string)?.trim();
      const kategori = (formData.get("kategori") as string)?.trim();
      let kontakWa = (formData.get("kontakWa") as string || formData.get("kontak_wa") as string)?.trim();
      const harga = (formData.get("harga") as string)?.trim();
      const lokasi = (formData.get("lokasi") as string)?.trim();
      const rw = (formData.get("rw") as string)?.trim();
      const deskripsiSingkat = (formData.get("deskripsiSingkat") as string || formData.get("deskripsi_singkat") as string)?.trim();
      const deskripsiLengkap = (formData.get("deskripsiLengkap") as string || formData.get("deskripsi_lengkap") as string)?.trim();
      const jamOperasional = (formData.get("jamOperasional") as string || formData.get("jam_operasional") as string)?.trim();
      const fotoUrlCustom = (formData.get("fotoUrl") as string)?.trim();

      if (kontakWa) {
        kontakWa = kontakWa.replace(/[^0-9]/g, "");
        if (kontakWa.startsWith("08")) kontakWa = "62" + kontakWa.substring(1);
        else if (kontakWa.startsWith("+62")) kontakWa = kontakWa.substring(1);
      }

      // Handle upload foto baru jika ada file
      let uploadedFotoUrl = fotoUrlCustom || undefined;
      const file = formData.get("foto") as File | null;
      if (file && typeof file.arrayBuffer === "function" && file.size > 0) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const s3Key = `umkm/${id}/${cleanName}`;
          uploadedFotoUrl = await uploadToS3(buffer, s3Key, file.type || "image/jpeg");
        } catch (uploadErr) {
          console.warn("Gagal upload foto baru ke S3:", uploadErr);
        }
      }

      if (nama) updateData.nama = nama;
      if (kategori) updateData.kategori = kategori;
      if (kontakWa) {
        updateData.kontak_wa = kontakWa;
        updateData.kontak = kontakWa;
      }
      if (harga) updateData.harga = harga;
      if (lokasi) updateData.lokasi = lokasi;
      if (rw) updateData.rw = rw;
      if (deskripsiSingkat) {
        updateData.deskripsi_singkat = deskripsiSingkat;
        updateData.deskripsi = deskripsiSingkat;
      }
      if (deskripsiLengkap) updateData.deskripsi_lengkap = deskripsiLengkap;
      if (jamOperasional) updateData.jam_operasional = jamOperasional;
      if (uploadedFotoUrl) {
        updateData.foto = uploadedFotoUrl;
        updateData.foto_gallery = [uploadedFotoUrl];
      }
      const statusFd = (formData.get("status") as string)?.trim();
      if (statusFd) updateData.status = statusFd;
      const catatanAdminFd = (formData.get("catatanAdmin") as string || formData.get("catatan_admin") as string)?.trim();
      if (catatanAdminFd !== undefined) updateData.catatan_admin = catatanAdminFd;
    } else {
      // JSON body
      const body = await req.json();
      id = body.id;
      if (!id) {
        return NextResponse.json({ success: false, message: "ID produk UMKM wajib disertakan." }, { status: 400 });
      }

      if (body.status) updateData.status = body.status.trim();
      if (body.catatan_admin !== undefined) updateData.catatan_admin = body.catatan_admin;
      if (body.catatanAdmin !== undefined) updateData.catatan_admin = body.catatanAdmin;
      if (body.is_unggulan !== undefined) updateData.is_unggulan = Boolean(body.is_unggulan);
      if (body.urutan !== undefined) updateData.urutan = Number(body.urutan);

      if (body.nama) updateData.nama = body.nama.trim();
      if (body.kategori) updateData.kategori = body.kategori.trim();
      if (body.kontak_wa || body.kontakWa) {
        let wa = (body.kontak_wa || body.kontakWa).toString().replace(/[^0-9]/g, "");
        if (wa.startsWith("08")) wa = "62" + wa.substring(1);
        else if (wa.startsWith("+62")) wa = wa.substring(1);
        updateData.kontak_wa = wa;
        updateData.kontak = wa;
      }
      if (body.harga) updateData.harga = body.harga.trim();
      if (body.lokasi) updateData.lokasi = body.lokasi.trim();
      if (body.rw) updateData.rw = body.rw.trim();
      if (body.deskripsi_singkat || body.deskripsiSingkat) {
        const d = (body.deskripsi_singkat || body.deskripsiSingkat).trim();
        updateData.deskripsi_singkat = d;
        updateData.deskripsi = d;
      }
      if (body.deskripsi_lengkap || body.deskripsiLengkap) {
        updateData.deskripsi_lengkap = (body.deskripsi_lengkap || body.deskripsiLengkap).trim();
      }
      if (body.jam_operasional || body.jamOperasional) {
        updateData.jam_operasional = (body.jam_operasional || body.jamOperasional).trim();
      }
      if (body.foto) {
        updateData.foto = body.foto;
        updateData.foto_gallery = [body.foto];
      }
      if (body.alamat_lengkap) {
        updateData.alamat_lengkap = body.alamat_lengkap;
      }
    }

    updateData.updated_at = new Date().toISOString();

    // 1. Perbarui di Local Store
    const localStore = readStoreData();
    const index = localStore.findIndex((u) => u.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Produk UMKM tidak ditemukan di database." }, { status: 404 });
    }

    const updatedItem = {
      ...localStore[index],
      ...updateData,
    };
    localStore[index] = updatedItem;
    writeStoreData(localStore);

    // 2. Perbarui di Supabase jika ada
    try {
      await supabaseAdmin.from("umkm").update(sanitizeForSupabase(updateData)).eq("id", id);
    } catch (err: any) {
      console.warn("Supabase update notice:", err?.message || err);
    }

    return NextResponse.json({
      success: true,
      message: "Data produk UMKM berhasil diperbarui!",
      data: updatedItem,
    });
  } catch (error: any) {
    console.error("Error PUT /api/umkm:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal memperbarui data UMKM." },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// DELETE: Hapus Produk UMKM Warga
// -------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID produk UMKM wajib disertakan." }, { status: 400 });
    }

    // Hapus dari local store
    let localStore = readStoreData();
    const filtered = localStore.filter((u) => u.id !== id);
    writeStoreData(filtered);

    // Hapus dari Supabase
    try {
      await supabaseAdmin.from("umkm").delete().eq("id", id);
    } catch (err: any) {
      console.warn("Supabase delete notice:", err?.message || err);
    }

    return NextResponse.json({
      success: true,
      message: "Produk UMKM berhasil dihapus dari daftar.",
    });
  } catch (error: any) {
    console.error("Error DELETE /api/umkm:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal menghapus produk UMKM." },
      { status: 500 }
    );
  }
}
