"use client";

import React, { useState } from "react";
import {
  UserPlus,
  ShieldCheck,
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Home,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    email: "",
    telepon: "",
    rw: "RW 01",
    alamat: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validasi dasar
    if (
      !formData.name.trim() ||
      !formData.nik.trim() ||
      !formData.email.trim() ||
      !formData.telepon.trim() ||
      !formData.password
    ) {
      setErrorMessage("Harap lengkapi semua data wajib pada formulir pendaftaran.");
      return;
    }

    const cleanNik = formData.nik.replace(/\D/g, "");
    if (cleanNik.length !== 16) {
      setErrorMessage(`Nomor NIK harus 16 digit angka (saat ini ${cleanNik.length} digit).`);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok dengan kata sandi yang Anda buat.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Harap centang konfirmasi bahwa data kependudukan yang diisi adalah benar warga Desa Sawotratap.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          nik: cleanNik,
          email: formData.email.trim().toLowerCase(),
          telepon: formData.telepon.trim(),
          rw: formData.rw,
          alamat: formData.alamat.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setIsSuccess(true);
        setRegisteredUser(data.user);
        try {
          localStorage.setItem("sawotratap_user", JSON.stringify(data.user));
        } catch {
          // ignore
        }
      } else {
        setErrorMessage(data.message || "Gagal melakukan pendaftaran. Silakan periksa kembali data Anda.");
      }
    } catch (err: any) {
      console.error("Register request error:", err);
      setErrorMessage("Terjadi gangguan koneksi ke server. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF9F4] text-[#111827] font-sans selection:bg-[#064E3B] selection:text-[#C5D82F]">
      
      {/* 1. SISI KIRI: FORM REGISTRASI BERSIH */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
        
        {/* TOMBOL KEMBALI */}
        <div className="flex items-center justify-between pb-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 text-[#064E3B]" />
            <span>Kembali ke Beranda</span>
          </a>

          <a
            href="/login"
            className="text-xs font-bold text-[#064E3B] hover:text-emerald-700 hover:underline transition-colors"
          >
            Sudah punya akun? <strong>Masuk</strong>
          </a>
        </div>

        {/* KONTEN FORM */}
        <div className="w-full max-w-xl mx-auto my-auto py-4 space-y-5">
          
          {/* LOGO & HEADER */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img
                src="/Logo/IMG_1650.GIF"
                alt="Logo Resmi Desa Sawotratap"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Registrasi Akun Warga
                </span>
                <p className="text-xs font-bold text-slate-500">Pemerintah Desa Sawotratap</p>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                Daftar Akun Baru
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Lengkapi identitas kependudukan (NIK) Anda untuk mengakses layanan digital desa.
              </p>
            </div>
          </div>

          {/* JIKA BERHASIL DAFTAR */}
          {isSuccess ? (
            <div className="p-7 rounded-3xl bg-white border border-emerald-300 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Selamat datang di Portal Desa Sawotratap, <strong className="text-slate-900">{registeredUser?.name}</strong>. Akun Anda telah aktif dan dapat langsung digunakan untuk keperluan administrasi desa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">NIK Pemohon:</span>
                  <span className="font-mono font-bold text-slate-800">{registeredUser?.nik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Email Terdaftar:</span>
                  <span className="font-bold text-slate-800">{registeredUser?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Wilayah:</span>
                  <span className="font-bold text-emerald-800">{registeredUser?.rw} Sawotratap</span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5 max-w-md mx-auto">
                <a
                  href="/layanan#surat"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
                >
                  <span>Mulai Ajukan Surat Mandiri</span>
                  <ArrowRight className="w-4 h-4 text-[#C5D82F]" />
                </a>

                <a
                  href="/"
                  className="block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-colors"
                >
                  Kembali ke Beranda Utama
                </a>
              </div>
            </div>
          ) : (
            /* FORMULIR PENDAFTARAN LENGKAP */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* BARIS 1: NAMA LENGKAP & NIK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Nama Lengkap Sesuai KTP *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Nomor Induk Kependudukan (NIK 16 Digit) *
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })}
                      placeholder="3515xxxxxxxxxxxx"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* BARIS 2: WILAYAH RW & NOMOR WHATSAPP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Wilayah RW Domisili *
                  </label>
                  <select
                    value={formData.rw}
                    onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#111827] text-xs font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => {
                      const rwStr = `RW ${n < 10 ? "0" + n : n}`;
                      return (
                        <option key={rwStr} value={rwStr}>
                          {rwStr} Desa Sawotratap
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Nomor WhatsApp / HP Aktif *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* BARIS 3: EMAIL AKTIF */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Alamat Email Aktif *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="namaanda@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs"
                  />
                </div>
              </div>

              {/* BARIS 4: KATA SANDI & KONFIRMASI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Kata Sandi Akun (Min. 6 Karakter) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Ulangi Kata Sandi *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* CHECKBOX PERNYATAAN */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#064E3B] focus:ring-0 cursor-pointer accent-[#064E3B]"
                  />
                  <span className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Saya menyatakan dengan sungguh-sungguh bahwa data identitas kependudukan (NIK) di atas adalah benar warga Desa Sawotratap, Gedangan, Sidoarjo.
                  </span>
                </label>
              </div>

              {/* TOMBOL SUBMIT */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#054030] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_#02261c] active:translate-y-1 active:shadow-none disabled:opacity-50 cursor-pointer select-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5D82F]" />
                      <span>Mendaftarkan Akun Anda...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-[#C5D82F]" />
                      <span>Daftar Akun Sekarang</span>
                    </>
                  )}
                </button>
              </div>

              {/* LINK LOGIN */}
              <div className="text-center pt-2 text-xs text-slate-500">
                Sudah memiliki akun terdaftar?{" "}
                <a href="/login" className="font-bold text-[#064E3B] hover:underline">
                  Masuk ke Portal Desa
                </a>
              </div>

            </form>
          )}

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Data Terenkripsi dan Terlindungi Server Desa Sawotratap</span>
          </div>

        </div>

        {/* FOOTER KIRI */}
        <div className="text-xs text-slate-400 font-medium text-center sm:text-left pt-4">
          © 2026 Pemerintah Desa Sawotratap, Gedangan, Sidoarjo.
        </div>

      </div>

      {/* 2. SISI KANAN: PANEL VISUAL HIJAU TUA ESTETIK */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-[#06261D] text-white p-12 lg:p-16 flex-col justify-between items-start">
        
        {/* BACKGROUND FOTO DENGAN OVERLAY */}
        <div className="absolute inset-0 z-0">
          <img
            src="/aset/pedesaan.jpg"
            alt="Desa Sawotratap Sidoarjo"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06261D] via-[#06261D]/80 to-[#06261D]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(197,216,47,0.1)_0%,transparent_60%)]" />
        </div>

        {/* TOP BADGE */}
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#064E3B]/80 px-4 py-1.5 text-xs font-bold text-emerald-200 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
          <span>Akses Layanan Mandiri Kependudukan</span>
        </div>

        {/* HEADLINE UTAMA */}
        <div className="relative z-10 max-w-lg space-y-4 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-xs font-bold text-[#C5D82F] border border-white/15">
            <span>Kemudahan Birokrasi Warga</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Satu Akun untuk <br />
            <span className="text-[#C5D82F]">Semua Layanan Desa</span>
          </h2>
          <p className="text-sm text-slate-300 font-normal leading-relaxed">
            Daftarkan diri Anda untuk pengurusan surat pengantar online, pengaduan lingkungan terintegrasi, pemantauan APBDes, serta etalase produk UMKM Desa Sawotratap.
          </p>
        </div>

        {/* FOOTER SISI KANAN */}
        <div className="relative z-10 flex items-center justify-between w-full text-xs text-slate-400 font-mono border-t border-emerald-900/80 pt-6">
          <span>7°22&apos;48&quot;S 112°44&apos;20&quot;E</span>
          <span className="text-[#C5D82F]">Kec. Gedangan, Kab. Sidoarjo</span>
        </div>

      </div>

    </div>
  );
}
