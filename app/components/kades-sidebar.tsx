"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  Store,
  Newspaper,
  Users,
  Home,
  ExternalLink,
  LogOut,
  X,
  Stamp,
  Wrench,
  Building2,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export type KadesMenuItem =
  | "overview"
  | "surat"
  | "pengaduan"
  | "perizinan"
  | "apbd"
  | "umkm"
  | "berita"
  | "users"
  | "penduduk";

interface KadesSidebarProps {
  activeItem?: KadesMenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSelectMenu?: (menu: KadesMenuItem) => void;
  badgeSurat?: number | string;
  badgePengaduan?: number | string;
}

export default function KadesSidebar({
  activeItem,
  isOpen,
  onClose,
  onSelectMenu,
  badgeSurat,
  badgePengaduan,
}: KadesSidebarProps) {
  const pathname = usePathname();

  // State realtime badges khusus Meja Kepala Desa
  const [liveCountSuratKades, setLiveCountSuratKades] = useState<number>(0);
  const [liveCountPengaduanKades, setLiveCountPengaduanKades] = useState<number>(0);
  const [liveCountPerizinanKades, setLiveCountPerizinanKades] = useState<number>(0);

  // Update jika props luar dikirim
  useEffect(() => {
    if (typeof badgeSurat === "number") setLiveCountSuratKades(badgeSurat);
  }, [badgeSurat]);

  useEffect(() => {
    if (typeof badgePengaduan === "number") setLiveCountPengaduanKades(badgePengaduan);
  }, [badgePengaduan]);

  // Sync realtime badge data dari API / Database Supabase
  useEffect(() => {
    let isMounted = true;

    const fetchKadesBadges = async () => {
      try {
        // 1. Hitung surat yang sedang di meja Kades
        const resSurat = await fetch("/api/admin/surat");
        const jsonSurat = await resSurat.json();
        if (jsonSurat.success && Array.isArray(jsonSurat.data) && isMounted) {
          const kadesSurat = jsonSurat.data.filter(
            (s: any) =>
              s.status === "Menunggu Persetujuan Kades" ||
              s.status === "Diteruskan ke Kepala Desa"
          ).length;
          setLiveCountSuratKades(kadesSurat);
        }
      } catch (e) {
        // Abaikan jika offline / koneksi lambat
      }

      try {
        // 2. Hitung laporan kerusakan yang butuh ACC Kades ("diteruskan_ke_kades")
        const resPengaduan = await fetch("/api/pengaduan");
        const jsonPengaduan = await resPengaduan.json();
        if (jsonPengaduan.success && Array.isArray(jsonPengaduan.data) && isMounted) {
          const kadesPengaduan = jsonPengaduan.data.filter(
            (p: any) => p.status === "diteruskan_ke_kades"
          ).length;
          setLiveCountPengaduanKades(kadesPengaduan);
        }
      } catch (e) {
        // Abaikan jika offline / koneksi lambat
      }

      try {
        // 3. Hitung perizinan yang butuh ACC Kades ("Menunggu Persetujuan Kades")
        const resPerizinan = await fetch("/api/perizinan");
        const jsonPerizinan = await resPerizinan.json();
        if (jsonPerizinan.success && Array.isArray(jsonPerizinan.data) && isMounted) {
          const kadesPerizinan = jsonPerizinan.data.filter(
            (p: any) =>
              p.status === "Menunggu Persetujuan Kades" ||
              p.status === "Diteruskan ke Kepala Desa"
          ).length;
          setLiveCountPerizinanKades(kadesPerizinan);
        }
      } catch (e) {
        // Abaikan jika offline / koneksi lambat
      }
    };

    fetchKadesBadges();

    // Dengarkan perubahan realtime Supabase
    const channel = supabase
      .channel("kades_sidebar_realtime_badges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "permohonan_surat" },
        () => {
          fetchKadesBadges();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pengaduan_warga" },
        () => {
          fetchKadesBadges();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "perizinan_fasilitas" },
        () => {
          fetchKadesBadges();
        }
      )
      .subscribe();

    const handleSyncEvent = () => fetchKadesBadges();
    window.addEventListener("admin-data-updated", handleSyncEvent);
    window.addEventListener("focus", handleSyncEvent);

    const interval = setInterval(fetchKadesBadges, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
      window.removeEventListener("admin-data-updated", handleSyncEvent);
      window.removeEventListener("focus", handleSyncEvent);
    };
  }, []);

  // Otomatis tentukan menu aktif dari URL path agar 100% konsisten
  let currentActive: KadesMenuItem = activeItem || "overview";
  if (pathname) {
    if (pathname === "/kades" || pathname === "/kades/") {
      if (activeItem && ["apbd", "umkm", "berita", "penduduk"].includes(activeItem)) {
        currentActive = activeItem;
      } else {
        currentActive = "overview";
      }
    } else if (pathname.startsWith("/kades/surat")) {
      currentActive = "surat";
    } else if (pathname.startsWith("/kades/pengaduan")) {
      currentActive = "pengaduan";
    } else if (pathname.startsWith("/kades/perizinan")) {
      currentActive = "perizinan";
    } else if (pathname.startsWith("/kades/apbd")) {
      currentActive = "apbd";
    } else if (pathname.startsWith("/kades/umkm")) {
      currentActive = "umkm";
    } else if (pathname.startsWith("/kades/berita")) {
      currentActive = "berita";
    } else if (pathname.startsWith("/kades/users")) {
      currentActive = "users";
    }
  }

  const handleClick = (item: KadesMenuItem) => {
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
          {/* HEADER LOGO & BRAND KADES (SERAGAM 100% DENGAN ADMIN) */}
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
                    Meja Kepala Desa
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

            {/* NAVIGASI MENU UTAMA KADES */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
              {/* GROUP 1: MENU EKSEKUTIF */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Menu Eksekutif
                </span>

                {/* 1. Dashboard Kades */}
                <Link
                  href="/kades"
                  onClick={() => handleClick("overview")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "overview"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span className="truncate">Dashboard Kades</span>
                  </div>
                </Link>

                {/* 2. Disposisi & TTD Kades */}
                <Link
                  href="/kades/surat"
                  onClick={() => handleClick("surat")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "surat"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Stamp className={`w-4 h-4 shrink-0 ${currentActive === "surat" ? "text-white" : "text-emerald-800"}`} />
                    <span className="truncate">Disposisi & TTD Kades</span>
                  </div>
                  {Number(liveCountSuratKades) > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                        currentActive === "surat"
                          ? "bg-[#C5D82F] text-[#06261D]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {liveCountSuratKades}
                    </span>
                  )}
                </Link>

                {/* 3. Persetujuan Kerusakan */}
                <Link
                  href="/kades/pengaduan"
                  onClick={() => handleClick("pengaduan")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "pengaduan"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Wrench className={`w-4 h-4 shrink-0 ${currentActive === "pengaduan" ? "text-white" : "text-emerald-800"}`} />
                    <span className="truncate">Persetujuan Kerusakan</span>
                  </div>
                  {Number(liveCountPengaduanKades) > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                        currentActive === "pengaduan"
                          ? "bg-[#C5D82F] text-[#06261D]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {liveCountPengaduanKades}
                    </span>
                  )}
                </Link>

                {/* 4. Perizinan & Fasilitas */}
                <Link
                  href="/kades/perizinan"
                  onClick={() => handleClick("perizinan")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "perizinan"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Building2 className={`w-4 h-4 shrink-0 ${currentActive === "perizinan" ? "text-white" : "text-emerald-800"}`} />
                    <span className="truncate">Perizinan & Fasilitas</span>
                  </div>
                  {Number(liveCountPerizinanKades) > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                        currentActive === "perizinan"
                          ? "bg-[#C5D82F] text-[#06261D]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {liveCountPerizinanKades}
                    </span>
                  )}
                </Link>

                {/* 5. Anggaran & APBD */}
                <Link
                  href="/kades/apbd"
                  onClick={() => handleClick("apbd")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "apbd"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Coins className={`w-4 h-4 shrink-0 ${currentActive === "apbd" ? "text-white" : "text-emerald-800"}`} />
                    <span className="truncate">Anggaran & APBD</span>
                  </div>
                </Link>
              </div>

              {/* GROUP 2: PENGAWASAN DESA */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Pengawasan Desa
                </span>

                {/* 1. Pengembangan UMKM */}
                <Link
                  href="/kades/umkm"
                  onClick={() => handleClick("umkm")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "umkm"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Store className={`w-4 h-4 shrink-0 ${currentActive === "umkm" ? "text-white" : "text-emerald-800"}`} />
                    <span className="truncate">Pengembangan UMKM</span>
                  </div>
                </Link>

                {/* 2. Publikasi Warta Desa */}
                <Link
                  href="/kades/berita"
                  onClick={() => handleClick("berita")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "berita"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Newspaper className={`w-4 h-4 shrink-0 ${currentActive === "berita" ? "text-white" : "text-emerald-800"}`} />
                    <span className="truncate">Publikasi Warta Desa</span>
                  </div>
                </Link>

                <Link
                  href="/kades/users"
                  onClick={() => handleClick("users")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentActive === "users"
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Users className={`w-4 h-4 shrink-0 ${currentActive === "users" ? "text-white" : "text-emerald-700"}`} />
                    <span className="truncate">Data User</span>
                  </div>
                </Link>
              </div>

              {/* GROUP 3: TAUTAN WEBSITE & AKSES CEPAT */}
              <div className="space-y-1 pt-2 border-t border-[#F0F2F0]">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-700" />
                    <span>Buka Web Publik</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>

                <Link
                  href="/admin"
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Beralih ke Meja Admin</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* USER PROFILE CARD KEPALA DESA DI BAWAH SIDEBAR (SERAGAM DENGAN ADMIN) */}
          <div className="p-3 border-t border-[#F0F2F0] bg-[#FAF9F5]">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="/aset/kades.jpg"
                  alt="Kepala Desa"
                  className="w-9 h-9 rounded-xl object-cover shrink-0 border border-emerald-200 shadow-xs"
                />
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">Kepala Desa</p>
                  <p className="text-[10px] text-slate-400 truncate">kades@sawotratap.desa.id</p>
                </div>
              </div>

              <a
                href="/login"
                title="Keluar / Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-2xs lg:hidden"
        />
      )}
    </>
  );
}
