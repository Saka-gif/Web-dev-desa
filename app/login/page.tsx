"use client";

import React, { useState } from "react";
import {
  LogIn,
  ShieldCheck,
  User,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Lock,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const [loginRole, setLoginRole] = useState<"warga" | "pamong">("warga");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      alert("Harap masukkan identitas Anda.");
      return;
    }
    setIsSuccess(true);
  };

  const handleQuickDemo = (role: string, name: string) => {
    setIdentifier(role === "warga" ? "3515112001000001" : "pamong.ptsp@sawotratap.desa.id");
    setPassword("password123");
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] flex flex-col justify-between pt-24 sm:pt-28 pb-12 px-4 sm:px-8 font-sans">
      
      {/* BACKGROUND DECORATIVE ACCENTS */}
      <div className="pointer-events-none fixed -top-24 right-1/4 w-96 h-96 rounded-full bg-[#285726]/10 blur-3xl -z-0" />
      <div className="pointer-events-none fixed -bottom-24 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl -z-0" />

      {/* TOP BAR / BACK LINK */}
      <div className="max-w-md mx-auto w-full mb-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#285726] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </a>
      </div>

      {/* MAIN LOGIN CARD */}
      <div className="max-w-md mx-auto w-full rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-2xl shadow-black/10 relative z-10 space-y-6">
        
        {/* HEADER LOGO & TITLE */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#285726] border border-emerald-700 text-white mx-auto flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-7 h-7 text-[#C5D82F]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
            </svg>
          </div>

          <div className="space-y-0.5 pt-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#285726] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Sistem Informasi Desa (SID)
            </span>
            <h1 className="text-2xl font-black text-[#111827]">
              Portal Masuk Desa
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Desa Sawotratap • Kecamatan Gedangan, Sidoarjo
            </p>
          </div>
        </div>

        {/* ROLE SELECTOR TABS */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setLoginRole("warga");
              setIsSuccess(false);
            }}
            className={`py-2 rounded-xl transition-all ${
              loginRole === "warga"
                ? "bg-white text-[#285726] shadow-sm font-black"
                : "hover:text-slate-900"
            }`}
          >
            Warga Sawotratap
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginRole("pamong");
              setIsSuccess(false);
            }}
            className={`py-2 rounded-xl transition-all ${
              loginRole === "pamong"
                ? "bg-white text-[#285726] shadow-sm font-black"
                : "hover:text-slate-900"
            }`}
          >
            Aparatur Pemdes
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
            <h3 className="text-base font-black text-emerald-950">
              Autentikasi Berhasil!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Selamat datang kembali di Portal Pelayanan Mandiri Desa Sawotratap. Anda dapat mengajukan permohonan surat atau memantau status berkas secara langsung.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/layanan#surat"
                className="w-full py-2.5 rounded-xl bg-[#285726] text-white text-xs font-black uppercase tracking-wider"
              >
                Buka Layanan Surat Mandiri
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIdentifier("");
                  setPassword("");
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Ganti Akun Lain
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginRole === "warga" ? (
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Nomor Induk Kependudukan (NIK 16 Digit) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ""))}
                    placeholder="Contoh: 351511xxxxxxxxxx"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#285726]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Email Pamong / NIP Pegawai *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="pamong@sawotratap.desa.id"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#285726]"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-700">
                  {loginRole === "warga" ? "PIN Keamanan / Sandi Warga *" : "Kata Sandi Akun *"}
                </label>
                <a href="/kontak" className="text-[11px] font-bold text-emerald-800 hover:underline">
                  Bantuan Login?
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-[#285726]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#285726] hover:bg-[#1e421c] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>

            {/* QUICK DEMO SHORTCUT BUTTONS */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block text-center">
                Akses Cepat Pengujian:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("warga", "Budi Santoso")}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-700 text-[11px] font-bold text-center transition-colors"
                >
                  Masuk sbg Warga
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("pamong", "Petugas PTSP")}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-700 text-[11px] font-bold text-center transition-colors"
                >
                  Masuk sbg Pamong
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SECURITY FOOTER BADGE */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Terenkripsi Standar Keamanan Disdukcapil Sidoarjo</span>
        </div>

      </div>

      {/* FOOTER COPYRIGHT */}
      <div className="text-center text-xs text-slate-400 mt-6">
        © 2025 Pemerintah Desa Sawotratap, Gedangan, Sidoarjo.
      </div>

    </div>
  );
}
