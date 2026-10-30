"use client";

import React, { useState, useEffect } from "react";
import {
  LogIn,
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  nik?: string;
  role: "admin" | "kades" | "user" | string;
  avatar?: string;
  telepon?: string;
  rw?: string;
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Cek sesi login tersimpan
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sawotratap_user");
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === "admin") {
          window.location.href = "/admin";
          return;
        }
        if (u.role === "kades") {
          window.location.href = "/kades";
          return;
        }
        if (u.role === "user") {
          window.location.href = "/";
          return;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Submit Login (Role otomatis dibaca dari akun/email oleh backend)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage("Harap masukkan email atau NIK dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        try {
          localStorage.setItem("sawotratap_user", JSON.stringify(data.user));
        } catch {
          // ignore
        }
        if (data.user.role === "kades") {
          window.location.href = "/kades";
          return;
        }
        if (data.user.role === "admin") {
          window.location.href = "/admin";
          return;
        }
        // Role user / warga desa: langsung diarahkan ke landing page ("/")
        window.location.href = "/";
        return;
      } else {
        setErrorMessage(data.message || "Email atau kata sandi tidak cocok.");
      }
    } catch (err: any) {
      console.error("Login request error:", err);
      setErrorMessage("Gagal terhubung ke server autentikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem("sawotratap_user");
    setIdentifier("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF9F4] text-[#111827] font-sans selection:bg-[#064E3B] selection:text-[#C5D82F]">
      
      {/* 1. SISI KIRI: FORM LOGIN BERSIH */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative">
        
        {/* TOMBOL KEMBALI */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 text-[#064E3B]" />
            <span>Kembali ke Beranda</span>
          </a>

          {currentUser && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>

        {/* KONTEN FORM */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
          
          {/* LOGO & HEADER */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/Logo/IMG_1650.GIF"
                alt="Logo Resmi Desa Sawotratap"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Sistem Informasi Desa (SID)
                </span>
                <p className="text-xs font-bold text-slate-500">Pemerintah Desa Sawotratap</p>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Masuk ke Portal Resmi Desa Sawotratap, Gedangan, Sidoarjo.
              </p>
            </div>
          </div>

          {/* FORM INPUT LOGIN (BERSIH & RESPONSIF) */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
              
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* INPUT EMAIL ATAU NIK */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Email atau Nomor Induk Kependudukan (NIK) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="nama@sawotratap.com atau NIK 16 digit"
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs transition-all"
                  />
                </div>
              </div>

              {/* INPUT PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700">Kata Sandi Akun *</label>
                  <a href="/kontak" className="text-[11px] font-bold text-emerald-700 hover:underline">
                    Bantuan Akun?
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
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 bg-white text-[#111827] placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#064E3B] shadow-2xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
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
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#054030] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_4px_0_#02261c] active:translate-y-1 active:shadow-none disabled:opacity-50 cursor-pointer select-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C5D82F]" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#C5D82F]" />
                    <span>Masuk Portal Desa</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Belum memiliki akun warga?{" "}
                <a href="/register" className="font-bold text-[#064E3B] hover:underline">
                  Daftar Akun Baru
                </a>
              </div>
            </form>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Terenkripsi Keamanan Server Desa Sawotratap</span>
          </div>

        </div>

        {/* FOOTER KIRI */}
        <div className="text-xs text-slate-400 font-medium text-center sm:text-left pt-4">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-xs font-bold text-[#C5D82F] border border-white/15">
            <span>Portal Sistem Informasi Desa (SID)</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Digitalisasi Tata Kelola <br />
            <span className="text-[#C5D82F]">Desa Sawotratap</span>
          </h2>
          <p className="text-sm text-slate-300 font-normal leading-relaxed">
            Sistem terpadu pelayanan administrasi kependudukan, disposisi pengaduan, dan transparansi anggaran desa untuk seluruh warga Gedangan, Sidoarjo.
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