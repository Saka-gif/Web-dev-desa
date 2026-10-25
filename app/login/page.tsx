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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF9F4] text-[#111827] font-sans selection:bg-[#064E3B] selection:text-[#C5D82F]">
      
      {/* 1. SISI KIRI: FORM LOGIN BERSIH (LIGHT MODE) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative">
        
        {/* TOMBOL KEMBALI */}
        <div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-[#064E3B]" />
            <span>Kembali ke Beranda</span>
          </a>
        </div>

        {/* KONTEN FORM */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
          
          {/* LOGO & HEADER */}
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#064E3B] text-[#C5D82F] flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
              </svg>
            </div>

            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
                Sistem Informasi Desa (SID)
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Masuk ke Portal Resmi Desa Sawotratap, Gedangan, Sidoarjo.
              </p>
            </div>
          </div>

          {/* TAB PILIHAN ROLE (WARGA / PAMONG) */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setLoginRole("warga");
                setIsSuccess(false);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                loginRole === "warga"
                  ? "bg-[#064E3B] text-white shadow-sm font-black"
                  : "hover:text-slate-900"
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
              className={`py-2.5 rounded-xl transition-all ${
                loginRole === "pamong"
                  ? "bg-[#064E3B] text-white shadow-sm font-black"
                  : "hover:text-slate-900"
              }`}
            >
              Aparatur Pemdes
            </button>
          </div>

          {/* TAMPILAN JIKA BERHASIL LOGIN */}
          {isSuccess ? (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Autentikasi Berhasil!
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Selamat datang kembali di Portal Pelayanan Mandiri Desa Sawotratap.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <a
                  href="/layanan#surat"
                  className="block w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md"
                >
                  Buka Layanan Surat Mandiri
                </a>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setIdentifier("");
                    setPassword("");
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline transition-colors"
                >
                  Ganti Akun
                </button>
              </div>
            </div>
          ) : (
            /* FORM LOGIN */
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {loginRole === "warga"
                    ? "Nomor Induk Kependudukan (NIK 16 Digit) *"
                    : "Email Pamong / NIP Pegawai *"}
                </label>
                <div className="relative">
                  {loginRole === "warga" ? (
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  ) : (
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 text-[#111827] placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700">
                    {loginRole === "warga" ? "PIN Keamanan / Sandi Warga *" : "Kata Sandi Akun *"}
                  </label>
                  <a href="/kontak" className="text-[11px] font-bold text-emerald-700 hover:underline">
                    Lupa Sandi?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 text-[#111827] placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#064E3B] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#064E3B] focus:ring-0 cursor-pointer accent-[#064E3B]"
                  />
                  <span className="text-xs text-slate-600 font-medium">Ingat Saya di Perangkat Ini</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
              >
                <LogIn className="w-4 h-4 text-[#C5D82F]" />
                <span>Masuk Portal Desa</span>
              </button>

              {/* QUICK DEMO SHORTCUTS */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block text-center tracking-wider">
                  Akses Pengujian Cepat:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("warga")}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-bold text-center transition-all"
                  >
                    Demo Warga
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("pamong")}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-bold text-center transition-all"
                  >
                    Demo Pamong
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Terenkripsi Keamanan Server Desa Sawotratap</span>
          </div>

        </div>

        {/* FOOTER KIRI */}
        <div className="text-xs text-slate-400 font-medium">
          © 2026 Pemerintah Desa Sawotratap, Gedangan, Sidoarjo.
        </div>

      </div>

      {/* 2. SISI KANAN: PANEL VISUAL HIJAU TUA ESTETIK (DARK MODE) */}
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
          <span>Layanan Mandiri Warga 24/7</span>
        </div>

        {/* HEADLINE UTAMA */}
        <div className="relative z-10 max-w-lg space-y-4 my-auto">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Digitalisasi Tata Kelola <br />
            <span className="text-[#C5D82F]">Desa Sawotratap</span>
          </h2>
          <p className="text-sm text-slate-300 font-normal leading-relaxed">
            Sistem terpadu pelayanan administrasi kependudukan, pengaduan lingkungan, dan transparansi anggaran desa untuk seluruh warga Gedangan, Sidoarjo.
          </p>
        </div>

        {/* FOOTER SISI KANAN */}
        <div className="relative z-10 flex items-center justify-between w-full text-xs text-slate-400 font-mono border-t border-emerald-900/80 pt-6">
          <span>7°22&apos;48&quot;S 112°44&apos;20&quot;E</span>
          <span className="text-[#C5D82F]">Kabupaten Sidoarjo, Jawa Timur</span>
        </div>

      </div>

    </div>
  );
}