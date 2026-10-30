import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { addMemoryUser, isIdentifierTaken } from "@/lib/users-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = (body.name || "").trim();
    const nik = (body.nik || "").trim().replace(/\D/g, "");
    const email = (body.email || "").trim().toLowerCase();
    const telepon = (body.telepon || "").trim();
    const rw = (body.rw || "").trim() || "RW 01";
    const alamat = (body.alamat || "").trim();
    const password = (body.password || "").trim();
    const confirmPassword = (body.confirmPassword || "").trim();

    // 1. Validasi Kolom Wajib
    if (!name || !nik || !email || !telepon || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Harap lengkapi seluruh formulir pendaftaran: Nama Lengkap Sesuai KTP, NIK 16 Digit, No. WhatsApp, Email, dan Kata Sandi.",
        },
        { status: 400 }
      );
    }

    // 2. Validasi NIK (Harus 16 Digit)
    if (nik.length !== 16) {
      return NextResponse.json(
        {
          success: false,
          message: `Nomor Induk Kependudukan (NIK) harus berjumlah 16 digit angka. Anda memasukkan ${nik.length} digit.`,
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
        { success: false, message: "Kata sandi minimal harus terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Konfirmasi kata sandi tidak cocok dengan kata sandi yang dimasukkan." },
        { status: 400 }
      );
    }

    // 5. Cek apakah Email atau NIK sudah terdaftar sebelumnya
    try {
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id, email, nik")
        .or(`email.eq.${email},nik.eq.${nik}`)
        .maybeSingle();

      if (existingUser) {
        if (existingUser.email?.toLowerCase() === email) {
          return NextResponse.json(
            { success: false, message: "Alamat email ini sudah terdaftar. Silakan langsung masuk di halaman login." },
            { status: 400 }
          );
        }
        if (existingUser.nik === nik) {
          return NextResponse.json(
            { success: false, message: "Nomor NIK ini sudah terdaftar di sistem desa." },
            { status: 400 }
          );
        }
      }
    } catch (checkErr) {
      console.warn("Notice checking existing user:", checkErr);
    }

    // 6. Buat Record Pengguna Baru (Role OTOMATIS SELALU 'user', admin dan kades hanya dibuat di dashboard admin)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userId = `usr-warga-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const newUserPayload = {
      id: userId,
      name,
      email,
      nik,
      password, // disimpan untuk verifikasi login
      role: "user", // Otomatis peran user warga
      avatar: "/Logo/IMG_1650.GIF",
      telepon,
      rw,
      is_active: true,
    };

    // Simpan ke in-memory store agar segera bisa login
    addMemoryUser(newUserPayload);

    // 7. Simpan ke Database Supabase
    let dbSuccess = false;
    let dbNotice = "";
    try {
      const { error: insertError } = await supabaseAdmin.from("users").insert([newUserPayload]);
      if (insertError) {
        console.warn("Supabase insert user warning:", insertError.message);
        dbNotice = insertError.message;
      } else {
        dbSuccess = true;
      }
    } catch (err: any) {
      console.warn("Supabase insert exception:", err?.message || err);
      dbNotice = err?.message || "Koneksi database lokal";
    }

    const safeUser = {
      id: userId,
      name,
      email,
      nik,
      role: "user",
      avatar: "/Logo/IMG_1650.GIF",
      telepon,
      rw,
      alamat,
    };

    // Buat response dengan session cookie otomatis
    const response = NextResponse.json({
      success: true,
      message: `Pendaftaran berhasil! Akun atas nama ${name} telah aktif.`,
      dbSaved: dbSuccess,
      dbNotice: dbNotice || undefined,
      user: safeUser,
    });

    response.cookies.set({
      name: "sawotratap_user",
      value: JSON.stringify(safeUser),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Error in POST /api/auth/register:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan server saat memproses pendaftaran." },
      { status: 500 }
    );
  }
}
