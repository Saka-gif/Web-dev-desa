import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  getAllMemoryUsers,
  addMemoryUser,
  updateMemoryUser,
  deleteMemoryUser,
  isIdentifierTaken,
} from "@/lib/users-manager";
import { StoredUser } from "@/lib/users-store";

// GET: Ambil daftar seluruh user / akun sistem
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const roleFilter = (searchParams.get("role") || "all").trim().toLowerCase();
    const rwFilter = (searchParams.get("rw") || "all").trim();
    const statusFilter = (searchParams.get("status") || "all").trim().toLowerCase();

    // 1. Ambil dari memori lokal / file
    let usersList: StoredUser[] = getAllMemoryUsers();

    // 2. Sinkronkan dengan Supabase jika ada data tambahan
    try {
      const { data: dbUsers, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(dbUsers) && dbUsers.length > 0) {
        // Gabungkan dengan cerdas
        for (const dbU of dbUsers) {
          const existingIdx = usersList.findIndex(
            (u) => u.id === dbU.id || u.email.toLowerCase() === (dbU.email || "").toLowerCase()
          );
          if (existingIdx >= 0) {
            usersList[existingIdx] = {
              ...usersList[existingIdx],
              ...dbU,
            };
          } else {
            usersList.push(dbU);
          }
        }
      }
    } catch (dbErr) {
      // Abaikan jika Supabase offline, tetap gunakan local store
    }

    // 3. Hitung statistik menyeluruh sebelum pemfilteran
    const stats = {
      total: usersList.length,
      totalWarga: usersList.filter((u) => u.role === "user" || !u.role).length,
      totalAdmin: usersList.filter((u) => u.role === "admin").length,
      totalKades: usersList.filter((u) => u.role === "kades").length,
      totalAktif: usersList.filter((u) => u.is_active !== false).length,
      totalNonaktif: usersList.filter((u) => u.is_active === false).length,
    };

    // 4. Lakukan pemfilteran
    let filtered = [...usersList];

    if (search) {
      filtered = filtered.filter((u) => {
        const nameMatch = u.name?.toLowerCase().includes(search);
        const emailMatch = u.email?.toLowerCase().includes(search);
        const nikMatch = u.nik?.includes(search);
        const phoneMatch = u.telepon?.includes(search);
        const rwMatch = u.rw?.toLowerCase().includes(search);
        return nameMatch || emailMatch || nikMatch || phoneMatch || rwMatch;
      });
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => (u.role || "user").toLowerCase() === roleFilter);
    }

    if (rwFilter !== "all" && rwFilter !== "Semua RW") {
      filtered = filtered.filter((u) => u.rw === rwFilter);
    }

    if (statusFilter !== "all") {
      if (statusFilter === "aktif") {
        filtered = filtered.filter((u) => u.is_active !== false);
      } else if (statusFilter === "nonaktif") {
        filtered = filtered.filter((u) => u.is_active === false);
      }
    }

    // Sort: Admin & Kades di atas, lalu yang terbaru
    filtered.sort((a, b) => {
      const roleOrder: Record<string, number> = { admin: 1, kades: 2, user: 3 };
      const orderA = roleOrder[a.role] || 4;
      const orderB = roleOrder[b.role] || 4;
      if (orderA !== orderB) return orderA - orderB;
      return (b.created_at || "").localeCompare(a.created_at || "");
    });

    return NextResponse.json({
      success: true,
      data: filtered,
      stats,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal memuat data akun pengguna." },
      { status: 500 }
    );
  }
}

// POST: Tambah akun user baru oleh Admin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = (body.name || "").trim();
    const nik = (body.nik || "").trim().replace(/\D/g, "");
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const role = (body.role || "user").trim().toLowerCase();
    const telepon = (body.telepon || "").trim();
    const rw = (body.rw || "RW 01").trim();
    const alamat = (body.alamat || "").trim();
    const isActive = body.is_active !== undefined ? Boolean(body.is_active) : true;

    // 1. Validasi Kolom Wajib
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Harap lengkapi nama lengkap, alamat email, dan kata sandi.",
        },
        { status: 400 }
      );
    }

    // 2. Validasi NIK (Jika diisi)
    if (nik && nik.length !== 16) {
      return NextResponse.json(
        {
          success: false,
          message: `NIK harus terdiri dari 16 digit angka (saat ini ${nik.length} digit).`,
        },
        { status: 400 }
      );
    }

    // 3. Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    // 4. Validasi Kata Sandi
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Kata sandi minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    // 5. Cek duplikasi
    const collision = isIdentifierTaken(email, nik);
    if (collision.taken) {
      if (collision.reason === "email") {
        return NextResponse.json(
          { success: false, message: "Alamat email ini sudah terdaftar untuk akun lain." },
          { status: 400 }
        );
      }
      if (collision.reason === "nik") {
        return NextResponse.json(
          { success: false, message: "Nomor NIK ini sudah digunakan oleh akun lain." },
          { status: 400 }
        );
      }
    }

    // 6. Buat Record Baru
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userId = `usr-${role}-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const newUser: StoredUser = {
      id: userId,
      name,
      email,
      nik: nik || undefined,
      password,
      passwords: [password],
      role,
      avatar: role === "kades" ? "/aset/kades.jpg" : "/Logo/IMG_1650.GIF",
      telepon: telepon || undefined,
      rw: rw || undefined,
      alamat: alamat || undefined,
      is_active: isActive,
      created_at: new Date().toISOString(),
    };

    // Simpan ke local store
    addMemoryUser(newUser);

    // Simpan ke Supabase jika tersedia
    try {
      await supabaseAdmin.from("users").insert([newUser]);
    } catch (e) {
      // Abaikan jika Supabase gagal insert
    }

    return NextResponse.json({
      success: true,
      message: `Akun atas nama ${name} (${role.toUpperCase()}) berhasil dibuat!`,
      data: newUser,
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/users:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal membuat akun user baru." },
      { status: 500 }
    );
  }
}

// PATCH: Edit data user / ubah status / reset password
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = (body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID akun pengguna wajib disertakan." },
        { status: 400 }
      );
    }

    const updates: Partial<StoredUser> = {};

    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.email !== undefined) {
      const email = body.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Format email tidak valid." },
          { status: 400 }
        );
      }
      updates.email = email;
    }

    if (body.nik !== undefined) {
      const nik = body.nik.trim().replace(/\D/g, "");
      if (nik && nik.length !== 16) {
        return NextResponse.json(
          { success: false, message: "NIK harus berjumlah 16 digit angka." },
          { status: 400 }
        );
      }
      updates.nik = nik || undefined;
    }

    if (body.telepon !== undefined) updates.telepon = body.telepon.trim();
    if (body.rw !== undefined) updates.rw = body.rw.trim();
    if (body.alamat !== undefined) updates.alamat = body.alamat.trim();
    if (body.role !== undefined) updates.role = body.role.trim().toLowerCase();
    if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);

    if (body.password !== undefined && body.password.trim() !== "") {
      const pass = body.password.trim();
      if (pass.length < 6) {
        return NextResponse.json(
          { success: false, message: "Kata sandi baru minimal harus 6 karakter." },
          { status: 400 }
        );
      }
      updates.password = pass;
    }

    // Validasi tabrakan email / NIK jika diubah
    if (updates.email || updates.nik) {
      const collision = isIdentifierTaken(
        updates.email || "",
        updates.nik || "",
        id
      );
      if (collision.taken) {
        return NextResponse.json(
          {
            success: false,
            message:
              collision.reason === "email"
                ? "Alamat email ini sudah dipakai oleh akun lain."
                : "Nomor NIK ini sudah digunakan oleh akun lain.",
          },
          { status: 400 }
        );
      }
    }

    // Update di local store
    const updatedUser = updateMemoryUser(id, updates);
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Akun pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // Update di Supabase
    try {
      await supabaseAdmin.from("users").update(updates).eq("id", id);
    } catch (e) {
      // Abaikan
    }

    return NextResponse.json({
      success: true,
      message: `Data akun ${updatedUser.name} berhasil diperbarui.`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/users:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal memperbarui akun user." },
      { status: 500 }
    );
  }
}

// DELETE: Hapus akun user
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID akun yang akan dihapus tidak ditentukan." },
        { status: 400 }
      );
    }

    // Proteksi akun super admin bawaan
    if (id === "usr-admin-1" || id === "usr-kades-1") {
      return NextResponse.json(
        {
          success: false,
          message: "Akun Super Admin & Kepala Desa sistem dilindungi dan tidak boleh dihapus demi keamanan operasional desa.",
        },
        { status: 403 }
      );
    }

    const deleted = deleteMemoryUser(id);

    // Hapus dari Supabase
    try {
      await supabaseAdmin.from("users").delete().eq("id", id);
    } catch (e) {
      // Abaikan
    }

    return NextResponse.json({
      success: true,
      message: "Akun pengguna berhasil dihapus dari sistem desa.",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/users:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal menghapus akun pengguna." },
      { status: 500 }
    );
  }
}
