"use client";

import React, { useState } from "react";
import {
  LogIn,
  ShieldCheck,
  User,
  Building2,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [loginRole, setLoginRole] = useState<"warga" | "pamong">("warga");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      alert("Harap masukkan identitas Anda.");
      return;
    }
    setIsSuccess(true);
  };

  const handleQuickDemo = (role: "warga" | "pamong") => {
    setLoginRole(role);
    setIdentifier(role === "warga" ? "3515112001000001" : "pamong.ptsp@sawotratap.desa.id");
    setPassword("password123");
    setIsSuccess(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
      
      {/* 1. BACKGROUND PEMANDANGAN DESA DENGAN OVERLAY CINEMATIC */}
      <div className="absolute inset-0 z-0">
        <img
          src="/aset/pedesaan.jpg"
          alt="Pemandangan Desa Sawotratap"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105"
        />
        {/* Layer Gradient Overlay agar teks & kartu kaca lebih kontras */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* 2. TOMBOL KEMBALI DI POJOK KIRI ATAS */}
      <a
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border border-white/20 backdrop-blur-md text-xs font-bold transition-all shadow-lg hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4 text-[#C5D82F]" />
        <span>Kembali ke Beranda</span>
      </a>

      {/* 3. KARTU LOGIN GLASSMORPHISM (KACA BURAM TRANSPARAN) */}
      <div className="relative z-10 w-full max-w-md my-auto rounded-3xl border border-white/30 bg-white/15 p-7 sm:p-9 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl text-white space-y-6">
        
        {/* HEADER LOGO & JUDUL */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#064E3B]/80 border border-[#C5D82F]/40 text-white mx-auto flex items-center justify-center shadow-lg backdrop-blur-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-7 h-7 text-[#C5D82F]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
            </svg>
          </div>

          <div className="space-y-1 pt-1">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#C5D82F] bg-black/40 px-3 py-0.5 rounded-full border border-white/15 backdrop-blur-md">
              Sistem Informasi Desa (SID)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md tracking-tight">
              Portal Desa Sawotratap
            </h1>
            <p className="text-xs text-slate-200 font-medium drop-shadow-sm">
              Kecamatan Gedangan, Kabupaten Sidoarjo
            </p>
          </div>
        </div>

        {/* TAB PILIHAN ROLE (WARGA / PAMONG) */}
        <div className="grid grid-cols-2 p-1 bg-black/30 rounded-2xl text-xs font-bold text-slate-300 border border-white/10 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setLoginRole("warga");
              setIsSuccess(false);
            }}
            className={`py-2 rounded-xl transition-all ${
              loginRole === "warga"
                ? "bg-[#C5D82F] text-[#111827] shadow-md font-black"
                : "hover:text-white"
            }`}
          >
            Warga Desa
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginRole("pamong");
              setIsSuccess(false);
            }}
            className={`py-2 rounded-xl transition-all ${
              loginRole === "pamong"
                ? "bg-[#C5D82F] text-[#111827] shadow-md font-black"
                : "hover:text-white"
            }`}
          >
            Aparatur Pemdes
          </button>
        </div>

        {/* TAMPILAN JIKA BERHASIL LOGIN */}
        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-black/40 border border-emerald-400/40 text-center space-y-4 backdrop-blur-md animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Autentikasi Berhasil!
              </h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Selamat datang di Portal Pelayanan Mandiri Desa Sawotratap.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <a
                href="/layanan#surat"
                className="block w-full py-3 rounded-xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#111827] text-xs font-black uppercase tracking-wider transition-all shadow-lg"
              >
                Buka Layanan Surat Mandiri
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIdentifier("");
                  setPassword("");
                }}
                className="text-xs font-bold text-slate-300 hover:text-white underline transition-colors"
              >
                Ganti Akun
              </button>
            </div>
          </div>
        ) : (
          /* FORM LOGIN GLASS */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* INPUT IDENTIFIER */}
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                {loginRole === "warga"
                  ? "Nomor Induk Kependudukan (NIK 16 Digit) *"
                  : "Email Pamong / NIP Pegawai *"}
              </label>
              <div className="relative">
                {loginRole === "warga" ? (
                  <User className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                ) : (
                  <Building2 className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="text"
                  required
                  maxLength={loginRole === "warga" ? 16 : 50}
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(
                      loginRole === "warga"
                        ? e.target.value.replace(/\D/g, "")
                        : e.target.value
                    )
                  }
                  placeholder={
                    loginRole === "warga"
                      ? "351511xxxxxxxxxx"
                      : "pamong@sawotratap.desa.id"
                  }
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#C5D82F] focus:ring-1 focus:ring-[#C5D82F] backdrop-blur-md transition-all"
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-200">
                  {loginRole === "warga" ? "PIN Keamanan / Sandi Warga *" : "Kata Sandi Akun *"}
                </label>
                <a href="/kontak" className="text-[11px] font-bold text-[#C5D82F] hover:underline">
                  Lupa Sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#C5D82F] focus:ring-1 focus:ring-[#C5D82F] backdrop-blur-md transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CHECKBOX REMEMBER ME */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/30 text-[#064E3B] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#C5D82F]"
                />
                <span className="text-xs text-slate-200 font-medium">Ingat Saya di Perangkat Ini</span>
              </label>
            </div>

            {/* TOMBOL SUBMIT */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#111827] text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Portal Desa</span>
            </button>

            {/* QUICK DEMO SHORTCUTS */}
            <div className="pt-3 border-t border-white/15 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-300 block text-center tracking-wider">
                Akses Pengujian Cepat:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("warga")}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold text-center transition-all backdrop-blur-md"
                >
                  Demo Warga
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("pamong")}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold text-center transition-all backdrop-blur-md"
                >
                  Demo Pamong
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SECURITY BADGE FOOTER */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-slate-300 font-semibold border-t border-white/10">
          <ShieldCheck className="w-4 h-4 text-[#C5D82F]" />
          <span>Terenkripsi Keamanan Server Desa Sawotratap</span>
        </div>

      </div>

      {/* 4. FOOTER HAK CIPTA */}
      <div className="absolute bottom-3 inset-x-0 text-center text-[11px] text-slate-300 font-medium drop-shadow-md z-10">
        © 2026 Pemerintah Desa Sawotratap, Gedangan, Sidoarjo.
      </div>

    </div>
  );
}