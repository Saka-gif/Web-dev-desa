"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Store,
  Coins,
  Newspaper,
  Users,
  Building2,
  Home,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export type AdminMenuItem =
  | "overview"
  | "surat"
  | "pengaduan"
  | "perizinan"
  | "umkm"
  | "apbd"
  | "berita"
  | "users"
  | "penduduk"
  | "arsip";

interface AdminSidebarProps {
  activeItem?: AdminMenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu?: (menu: AdminMenuItem) => void;
  badgeSurat?: number;
  badgePengaduan?: number | string;
  badgeUmkm?: number | string;
}

export default function AdminSidebar({
  activeItem,
  isOpen,
  onClose,
  onSelectMenu,
  badgeSurat,
  badgePengaduan,
  badgeUmkm = "2 Verif",
}: AdminSidebarProps) {
  const pathname = usePathname();

  // State live badges terpadu untuk semua halaman admin
  const [liveBadgeSurat, setLiveBadgeSurat] = useState<number>(
    typeof badgeSurat === "number" ? badgeSurat : 1
  );
  const [liveBadgePengaduan, setLiveBadgePengaduan] = useState<number | string>(
    badgePengaduan ?? "Kelola"
  );
  const [liveBadgeUmkm, setLiveBadgeUmkm] = useState<number | string>(
    badgeUmkm ?? "2 Verif"
  );
  const [liveBadgePerizinan, setLiveBadgePerizinan] = useState<number>(0);

  // Update jika props luar berubah
  useEffect(() => {
    if (badgeSurat !== undefined) setLiveBadgeSurat(badgeSurat);
  }, [badgeSurat]);

  useEffect(() => {
    if (badgePengaduan !== undefined) setLiveBadgePengaduan(badgePengaduan);
  }, [badgePengaduan]);

  useEffect(() => {
    if (badgeUmkm !== undefined) setLiveBadgeUmkm(badgeUmkm);
  }, [badgeUmkm]);

  // Sinkronisasi badge realtime dari database Supabase & API Route
  useEffect(() => {
    let isMounted = true;

    const fetchLiveBadges = async () => {
      try {
        // 1. Fetch data antrean surat
        const resSurat = await fetch("/api/admin/surat");
        const jsonSurat = await resSurat.json();
        if (jsonSurat.success && Array.isArray(jsonSurat.data) && isMounted) {
          const antrean = jsonSurat.data.filter(
            (s: any) => s.status === "Antrean Verifikasi"
          ).length;
          setLiveBadgeSurat(antrean);
        }
      } catch (e) {
        // Abaikan jika offline / koneksi lambat
      }

      try {
        // 2. Fetch data laporan pengaduan kerusakan
        const resPengaduan = await fetch("/api/pengaduan");
        const jsonPengaduan = await resPengaduan.json();
        if (jsonPengaduan.success && Array.isArray(jsonPengaduan.data) && isMounted) {
          const baruCount = jsonPengaduan.data.filter(
            (p: any) => p.status === "menunggu_verifikasi_admin"
          ).length;
          setLiveBadgePengaduan(baruCount > 0 ? `${baruCount} Baru` : "Kelola");
        }
      } catch (e) {
        // Abaikan jika offline / koneksi lambat
      }

      try {
        // 3. Fetch data antrean perizinan & fasilitas
        const resPerizinan = await fetch("/api/perizinan");
        const jsonPerizinan = await resPerizinan.json();
        if (jsonPerizinan.success && Array.isArray(jsonPerizinan.data) && isMounted) {
          const antreanPerizinan = jsonPerizinan.data.filter(
            (p: any) =>
              p.status === "Menunggu Verifikasi" ||
              p.status === "Menunggu Verifikasi Admin" ||
              p.status === "Disetujui Kades"
          ).length;
          setLiveBadgePerizinan(antreanPerizinan);
        }
      } catch (e) {
        // Abaikan jika offline
      }

      try {
        // 4. Fetch data antrean UMKM menunggu verifikasi
        const resUmkm = await fetch("/api/umkm?status=all");
        const jsonUmkm = await resUmkm.json();
        if (jsonUmkm.success && Array.isArray(jsonUmkm.data) && isMounted) {
          const antreanUmkm = jsonUmkm.data.filter(
            (u: any) => u.status === "menunggu" || !u.status
          ).length;
          setLiveBadgeUmkm(antreanUmkm > 0 ? `${antreanUmkm} Verif` : "Kelola");
        }
      } catch (e) {
        // Abaikan jika offline
      }
    };

    fetchLiveBadges();

    // Dengarkan perubahan realtime Supabase
    const channel = supabase
      .channel("admin_sidebar_realtime_badges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "permohonan_surat" },
        () => {
          fetchLiveBadges();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pengaduan_warga" },
        () => {
          fetchLiveBadges();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "perizinan_fasilitas" },
        () => {
          fetchLiveBadges();
        }
      )
      .subscribe();

    // Event listener kustom ketika ada mutasi status di halaman mana pun
    const handleSyncEvent = () => fetchLiveBadges();
    window.addEventListener("admin-data-updated", handleSyncEvent);
    window.addEventListener("focus", handleSyncEvent);

    // Polling interval aman tiap 8 detik
    const interval = setInterval(fetchLiveBadges, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
      window.removeEventListener("admin-data-updated", handleSyncEvent);
      window.removeEventListener("focus", handleSyncEvent);
    };
  }, []);

  // Otomatis tentukan menu aktif dari URL path agar 100% akurat dan tidak pernah salah sorot
  let currentActive: AdminMenuItem = activeItem || "overview";
  if (pathname) {
    if (pathname === "/admin" || pathname === "/admin/") {
      if (activeItem && ["umkm", "apbd", "berita", "penduduk", "arsip"].includes(activeItem)) {
        currentActive = activeItem;
      } else {
        currentActive = "overview";
      }
    } else if (pathname.startsWith("/admin/pengaduan")) {
      currentActive = "pengaduan";
    } else if (pathname.startsWith("/admin/surat")) {
      currentActive = "surat";
    } else if (pathname.startsWith("/admin/perizinan")) {
      currentActive = "perizinan";
    } else if (pathname.startsWith("/admin/umkm")) {
      currentActive = "umkm";
    } else if (pathname.startsWith("/admin/apbd")) {
      currentActive = "apbd";
    } else if (pathname.startsWith("/admin/berita")) {
      currentActive = "berita";
    } else if (pathname.startsWith("/admin/users")) {
      currentActive = "users";
    }
  }

  const handleClick = (item: AdminMenuItem) => {
    if (onSelectMenu) {
      onSelectMenu(item);
    }
    onClose();
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E3E8E2] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          {/* HEADER LOGO & BRAND */}
          <div>
            <div className="h-16 px-6 flex items-center justify-between border-b border-[#F0F2F0]">
              <div className="flex items-center gap-3">
                <img
                  src="/Logo/IMG_1650.GIF"
                  alt="Logo Desa Sawotratap"
                  className="w-8 h-8 object-contain drop-shadow-xs"
                />
                <div>
                  <h1 className="text-sm font-black tracking-tight text-[#064E3B] leading-none">
                    SID Sawotratap
                  </h1>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Panel Tata Kelola
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* NAVIGASI MENU (PATOKAN TUNGGAL RESMI ADMIN) */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
              {/* GROUP 1: UTAMA */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Menu Utama
                </span>

                {/* 1. Dashboard Utama */}
                <Link
                  href="/admin"
                  onClick={() => handleClick("overview")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "overview"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Utama</span>
                  </div>
                </Link>

                {/* 2. Verifikasi Surat */}
                <Link
                  href="/admin/surat"
                  onClick={() => handleClick("surat")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "surat"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 ${currentActive === "surat" ? "text-white" : "text-emerald-800"}`} />
                    <span>Verifikasi Surat</span>
                  </div>
                  {Number(liveBadgeSurat) > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        currentActive === "surat"
                          ? "bg-[#C5D82F] text-[#06261D]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {liveBadgeSurat}
                    </span>
                  )}
                </Link>

                {/* 3. Laporan Kerusakan */}
                <Link
                  href="/admin/pengaduan"
                  onClick={() => handleClick("pengaduan")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "pengaduan"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquareQuote className={`w-4 h-4 ${currentActive === "pengaduan" ? "text-white" : "text-rose-700"}`} />
                    <span>Laporan Kerusakan</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      currentActive === "pengaduan"
                        ? "bg-[#C5D82F] text-[#06261D]"
                        : liveBadgePengaduan && String(liveBadgePengaduan).includes("Baru")
                        ? "bg-rose-100 text-rose-800"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {liveBadgePengaduan}
                  </span>
                </Link>

                {/* 3b. Perizinan & Fasilitas */}
                <Link
                  href="/admin/perizinan"
                  onClick={() => handleClick("perizinan")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "perizinan"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className={`w-4 h-4 ${currentActive === "perizinan" ? "text-white" : "text-emerald-700"}`} />
                    <span>Perizinan & Fasilitas</span>
                  </div>
                  {Number(liveBadgePerizinan) > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        currentActive === "perizinan"
                          ? "bg-[#C5D82F] text-[#06261D]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {liveBadgePerizinan}
                    </span>
                  )}
                </Link>

                {/* 4. Kurasi & ACC UMKM */}
                <Link
                  href="/admin/umkm"
                  onClick={() => handleClick("umkm")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "umkm"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Store className={`w-4 h-4 ${currentActive === "umkm" ? "text-white" : "text-amber-700"}`} />
                    <span>Kurasi & ACC UMKM</span>
                  </div>
                  {Boolean(liveBadgeUmkm) && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        currentActive === "umkm"
                          ? "bg-[#C5D82F] text-[#06261D]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {liveBadgeUmkm}
                    </span>
                  )}
                </Link>

                {/* 5. Transparansi APBD */}
                <Link
                  href="/admin/apbd"
                  onClick={() => handleClick("apbd")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "apbd"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Coins className={`w-4 h-4 ${currentActive === "apbd" ? "text-white" : "text-emerald-700"}`} />
                    <span>Transparansi APBD</span>
                  </div>
                </Link>

                {/* 6. Warta & Informasi */}
                <Link
                  href="/admin/berita"
                  onClick={() => handleClick("berita")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "berita"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Newspaper className={`w-4 h-4 ${currentActive === "berita" ? "text-white" : "text-emerald-700"}`} />
                    <span>Warta & Informasi</span>
                  </div>
                </Link>
              </div>

              {/* GROUP 2: KELOLA DATA */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Kelola Data
                </span>

                <Link
                  href="/admin/users"
                  onClick={() => handleClick("users")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "users"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 ${currentActive === "users" ? "text-white" : "text-emerald-700"}`} />
                    <span>Data User</span>
                  </div>
                </Link>
              </div>

              {/* GROUP 3: TAUTAN WEBSITE PUBLIK */}
              <div className="space-y-1 pt-2 border-t border-[#F0F2F0]">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Buka Web Publik</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>
            </div>
          </div>

          {/* USER PROFILE CARD DI BAWAH SIDEBAR */}
          <div className="p-3 border-t border-[#F0F2F0] bg-[#FAF9F5]">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <div className="flex items-center gap-2.5">
                <img
                  src="/Logo/IMG_1650.GIF"
                  alt="Admin"
                  className="w-9 h-9 rounded-xl object-contain bg-emerald-50 p-1 border border-emerald-200"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-slate-900 truncate">Admin Desa</p>
                  <p className="text-[10px] text-slate-400 truncate">admin@sawotratap.com</p>
                </div>
              </div>

              <a
                href="/login"
                title="Keluar / Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* OVERLAY UNTUK MOBILE SIDEBAR */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  );
}
