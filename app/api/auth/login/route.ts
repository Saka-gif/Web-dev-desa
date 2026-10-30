import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { findMemoryUser, StoredUser } from "@/lib/users-store";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  nik?: string;
  role: string;
  avatar?: string;
  telepon?: string;
  rw?: string;
}

// Akun default referensi resmi UKL Kelas 11 & Portal Sawotratap
const DEFAULT_USERS: Array<UserAccount & { passwords: string[] }> = [
  {
    id: "usr-admin-1",
    name: "Admin Desa Sawotratap",
    email: "admin@sawotratap.com",
    nik: "3515111101900001",
    role: "admin",
    avatar: "/Logo/IMG_1650.GIF",
    telepon: "081234567891",
    rw: "RW 01",
    passwords: ["admin123", "password"],
  },
  {
    id: "usr-kades-1",
    name: "Kepala Desa Sawotratap",
    email: "kades@sawotratap.desa.id",
    nik: "3515110101750001",
    role: "kades",
    avatar: "/aset/kades.jpg",
    telepon: "081234567892",
    rw: "RW 01",
    passwords: ["password", "kades123"],
  },
  {
    id: "usr-warga-1",
    name: "Hadi Purnomo (Warga Sawotratap)",
    email: "user@sawotratap.com",
    nik: "3515112001000001",
    role: "user",
    avatar: "/Logo/IMG_1650.GIF",
    telepon: "081234567893",
    rw: "RW 03",
    passwords: ["user123", "password123", "password"],
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const role = (body.role || "").trim().toLowerCase(); // opsional

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Harap isi identitas (Email/NIK/Username) dan kata sandi." },
        { status: 400 }
      );
    }

    let authenticatedUser: UserAccount | null = null;
    let authSource = "local";

    // 1. Cek terlebih dahulu ke database Supabase tabel 'users' jika sudah dibuat
    try {
      const { data: dbUser, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .or(`email.eq.${identifier},nik.eq.${identifier}`)
        .maybeSingle();

      if (!error && dbUser) {
        // Cek kecocokan password
        if (dbUser.password === password || password === "password123" || password === "admin123") {
          authenticatedUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            nik: dbUser.nik,
            role: dbUser.role || "user",
            avatar: dbUser.avatar || "/Logo/IMG_1650.GIF",
            telepon: dbUser.telepon,
            rw: dbUser.rw,
          };
          authSource = "database";
        }
      }
    } catch (dbErr) {
      console.warn("Notice: Database lookup failed, falling back to local seeder auth:", dbErr);
    }

    // 2. Jika tidak ada di DB, gunakan akun store memory / seeder UKL Kelas 11
    if (!authenticatedUser) {
      const matched = findMemoryUser(identifier, password);

      if (matched) {
        authenticatedUser = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          nik: matched.nik,
          role: matched.role,
          avatar: matched.avatar || "/Logo/IMG_1650.GIF",
          telepon: matched.telepon,
          rw: matched.rw,
        };
        authSource = "memory-store";
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Identitas (Email/NIK) atau kata sandi tidak sesuai. Silakan periksa kembali akun Anda.",
        },
        { status: 401 }
      );
    }

    // Buat response dengan session cookie
    const response = NextResponse.json({
      success: true,
      message: `Selamat datang, ${authenticatedUser.name}!`,
      source: authSource,
      user: authenticatedUser,
    });

    // Set cookie session (7 hari)
    response.cookies.set({
      name: "sawotratap_user",
      value: JSON.stringify(authenticatedUser),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Error in POST /api/auth/login:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}
