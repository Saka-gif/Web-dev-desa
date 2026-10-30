"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Store,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
  ChevronDown,
  MapPin,
  Menu,
  X,
  Eye,
  RefreshCw,
  Phone,
  Tag,
  Star,
  ShoppingBag,
  ShieldCheck,
  Lock,
  Layers,
  AlertTriangle,
  Info,
} from "lucide-react";
import KadesSidebar from "@/app/components/kades-sidebar";
import { UmkmItem } from "@/app/data/umkm";

export default function KadesUmkmMonitoringPage() {
  const [umkmList, setUmkmList] = useState<UmkmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<"semua" | "menunggu" | "disetujui" | "ditolak">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [rwFilter, setRwFilter] = useState("Semua RW");
  const [kategoriFilter, setKategoriFilter] = useState("Semua Kategori");

  // Dropdown States
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRwDropdownOpen, setIsRwDropdownOpen] = useState(false);
  const [isKategoriDropdownOpen, setIsKategoriDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const rwDropdownRef = useRef<HTMLDivElement>(null);
  const kategoriDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (rwDropdownRef.current && !rwDropdownRef.current.contains(e.target as Node)) {
        setIsRwDropdownOpen(false);
      }
      if (kategoriDropdownRef.current && !kategoriDropdownRef.current.contains(e.target as Node)) {
        setIsKategoriDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modal Detail Item (Read-Only)
  const [detailItem, setDetailItem] = useState<UmkmItem | null>(null);

  // Fetch Semua Data UMKM
  const fetchUmkmData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/umkm?status=all");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUmkmList(json.data);
      } else {
        setUmkmList([]);
      }
    } catch (err) {
      console.warn("Gagal fetch data UMKM Kades:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUmkmData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUmkmData();
  };

  // Statistik Eksekutif
  const stats = {
    total: umkmList.length,
    menunggu: umkmList.filter((u) => u.status === "menunggu" || !u.status).length,
    disetujui: umkmList.filter((u) => u.status === "disetujui").length,
    ditolak: umkmList.filter((u) => u.status === "ditolak").length,
  };

  // Kategori Unik
  const kategoriList = ["Semua Kategori", ...Array.from(new Set(umkmList.map((u) => u.kategori).filter(Boolean)))];

  // RW List
  const rwList = [
    "Semua RW",
    "RW 01", "RW 02", "RW 03", "RW 04", "RW 05",
    "RW 06", "RW 07", "RW 08", "RW 09", "RW 10", "RW 11",
  ];

  // Filter Data
  const filteredList = umkmList.filter((item) => {
    const itemStatus = item.status || "menunggu";
    if (statusFilter !== "semua" && itemStatus !== statusFilter) return false;
    if (kategoriFilter !== "Semua Kategori" && item.kategori?.toLowerCase() !== kategoriFilter.toLowerCase()) return false;
    if (rwFilter !== "Semua RW" && item.rw !== rwFilter) return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchNama = item.nama?.toLowerCase().includes(q);
      const matchPemilik = item.pemilik?.toLowerCase().includes(q);
      const matchNik = item.nik_pemilik?.toLowerCase().includes(q);
      const matchKategori = item.kategori?.toLowerCase().includes(q);
      return matchNama || matchPemilik || matchNik || matchKategori;
    }

    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-slate-800 font-sans antialiased">
      {/* 1. SIDEBAR RESMI MEJA KEPALA DESA */}
      <KadesSidebar
        activeItem="umkm"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. KONTEN UTAMA MEJA KADES */}
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* HEADER TOPBAR MEJA KADES */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>Meja Kepala Desa</span>
                <span>/</span>
                <span className="text-[#064E3B] font-bold">Pemantauan UMKM</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Pengawasan & Potensi UMKM Warga</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#064E3B] border border-emerald-300">
                  <Lock className="w-3 h-3 text-[#064E3B]" />
                  <span>Mode Monitoring Eksekutif</span>
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#064E3B]" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <a
              href="/#umkm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5D82F]" />
              <span className="hidden sm:inline">Lihat Etalase Publik</span>
            </a>
          </div>
        </header>

        {/* BODY DASHBOARD */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* NOTICE BANNER READ-ONLY */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs">
              <h4 className="font-black text-amber-950">
                Akses Pemantauan Eksekutif Kepala Desa (Read-Only)
              </h4>
              <p className="text-amber-900/90 leading-relaxed font-medium">
                Kepala Desa dapat memantau seluruh katalog, legalitas, domisili, dan status produk UMKM warga di 11 RW secara transparan. Hak kurasi, persetujuan (ACC), dan penolakan dikelola operasional oleh Tim Loket PTSP Admin Desa.
              </p>
            </div>
          </div>

          {/* 4 STAT CARDS KONSISTEN */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Total Produk */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Total UMKM Warga</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.total}</p>
              </div>
            </div>

            {/* Card 2: Menunggu ACC */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-300/80 bg-amber-50/20 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-amber-800 font-bold">Menunggu Kurasi Admin</p>
                <p className="text-xl sm:text-2xl font-black text-amber-950">{stats.menunggu}</p>
              </div>
            </div>

            {/* Card 3: Disetujui / Aktif */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Aktif di Web Publik</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.disetujui}</p>
              </div>
            </div>

            {/* Card 4: Ditolak */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Ditolak / Revisi</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.ditolak}</p>
              </div>
            </div>
          </div>

          {/* FILTER & PENCARIAN BAR */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* STATUS TABS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setStatusFilter("semua")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === "semua"
                      ? "bg-[#064E3B] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  Semua ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("menunggu")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === "menunggu"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Menunggu Kurasi ({stats.menunggu})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("disetujui")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === "disetujui"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Disetujui ({stats.disetujui})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("ditolak")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === "ditolak"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/60"
                  }`}
                >
                  Ditolak ({stats.ditolak})
                </button>
              </div>

              {/* SEARCH & DROPDOWN */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                {/* Filter Kategori */}
                <div className="relative" ref={kategoriDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsKategoriDropdownOpen(!isKategoriDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <span>{kategoriFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {isKategoriDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl py-1 z-30 max-h-56 overflow-y-auto">
                      {kategoriList.map((kat) => (
                        <button
                          key={kat}
                          type="button"
                          onClick={() => {
                            setKategoriFilter(kat);
                            setIsKategoriDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer ${
                            kategoriFilter === kat ? "bg-emerald-50 text-[#064E3B] font-bold" : "text-slate-700"
                          }`}
                        >
                          {kat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter RW */}
                <div className="relative" ref={rwDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRwDropdownOpen(!isRwDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <span>{rwFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {isRwDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-36 rounded-2xl bg-white border border-slate-200 shadow-xl py-1 z-30 max-h-56 overflow-y-auto">
                      {rwList.map((rw) => (
                        <button
                          key={rw}
                          type="button"
                          onClick={() => {
                            setRwFilter(rw);
                            setIsRwDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer ${
                            rwFilter === rw ? "bg-emerald-50 text-[#064E3B] font-bold" : "text-slate-700"
                          }`}
                        >
                          {rw}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input Search */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk / pemilik..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#064E3B] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TABEL PEMANTAUAN UMKM (READ-ONLY) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Produk / Usaha</th>
                    <th className="py-3.5 px-4">Pemilik & Domisili</th>
                    <th className="py-3.5 px-4">Harga & Jam Buka</th>
                    <th className="py-3.5 px-4">Kontak WhatsApp</th>
                    <th className="py-3.5 px-4">Status Kurasi</th>
                    <th className="py-3.5 px-4 text-right">Aksi Pantau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#064E3B]" />
                        <span>Memuat data katalog UMKM desa...</span>
                      </td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Store className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="font-bold text-slate-600">Tidak ada data UMKM yang cocok.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Coba ganti kata kunci pencarian atau ubah filter status/kategori.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item) => {
                      const isPending = !item.status || item.status === "menunggu";
                      const isApproved = item.status === "disetujui";
                      const isRejected = item.status === "ditolak";

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* Produk / Usaha */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img
                                  src={item.foto || "/aset/umkm-desa.jpg"}
                                  alt={item.nama}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/aset/umkm-desa.jpg";
                                  }}
                                />
                                {item.is_unggulan && (
                                  <div className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-amber-400 text-amber-950">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate">
                                    {item.nama}
                                  </h4>
                                  {item.is_unggulan && (
                                    <span className="text-[10px] text-amber-600 font-extrabold shrink-0">
                                      ★ Unggulan
                                    </span>
                                  )}
                                </div>
                                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 mt-0.5">
                                  {item.kategori || "Kuliner"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Pemilik & Domisili */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{item.pemilik}</div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-medium">
                              <span className="text-emerald-700 font-semibold">{item.rw || "RW 01"}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px]">{item.nik_pemilik?.slice(0, 6)}...</span>
                            </div>
                          </td>

                          {/* Harga & Jam Buka */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-black text-[#064E3B] text-xs">
                              {item.harga || "Hubungi Penjual"}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                              {item.jam_operasional || "08.00 - 21.00 WIB"}
                            </div>
                          </td>

                          {/* Kontak WhatsApp */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {item.kontak_wa || item.kontak ? (
                              <a
                                href={`https://wa.me/${String(item.kontak_wa || item.kontak).replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>+{item.kontak_wa || item.kontak}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>

                          {/* Status Kurasi */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-300">
                                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                <span>Menunggu ACC</span>
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Disetujui (Tayang)</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-800 border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>Ditolak / Revisi</span>
                              </span>
                            )}
                          </td>

                          {/* Aksi Pantau (READ-ONLY: HANYA LIHAT DETAIL) */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setDetailItem(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                              title="Lihat Rincian Lengkap Produk"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#064E3B]" />
                              <span>Inspeksi</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* MODAL DETAIL PRODUK (READ-ONLY KHUSUS KADES)              */}
      {/* ======================================================== */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Rincian Pemantauan UMKM
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{detailItem.nama}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Foto Besar */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={detailItem.foto || "/aset/umkm-desa.jpg"}
                alt={detailItem.nama}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/aset/umkm-desa.jpg";
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#C5D82F] text-[10px] font-black">
                {detailItem.rw || "Sawotratap"}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black border backdrop-blur-md bg-white/90 text-slate-900">
                {detailItem.status === "disetujui"
                  ? "✓ Tayang di Web"
                  : detailItem.status === "ditolak"
                  ? "✕ Ditolak Admin"
                  : "⏳ Menunggu Kurasi"}
              </div>
            </div>

            {/* Rincian Usaha */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Pemilik Usaha:</span>
                <span className="font-bold text-slate-900">{detailItem.pemilik}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NIK KTP Pemilik:</span>
                <span className="font-mono text-slate-800">{detailItem.nik_pemilik || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Harga / Tarif:</span>
                <span className="font-black text-[#064E3B]">{detailItem.harga || "Hubungi Penjual"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                <span className="font-bold text-emerald-700">+{detailItem.kontak_wa || detailItem.kontak || "-"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Lokasi / Alamat Lengkap:</span>
                <span className="font-medium text-slate-700">{detailItem.lokasi || "Desa Sawotratap"}</span>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <span className="text-slate-500 font-bold text-xs">Deskripsi Produk:</span>
              <p className="text-xs text-slate-600 leading-relaxed p-3 rounded-xl bg-slate-50 border border-slate-200">
                {detailItem.deskripsi || "Tidak ada rincian deskripsi tambahan."}
              </p>
            </div>

            {/* Catatan Admin jika ada */}
            {detailItem.catatan_admin && (
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Catatan Tim Kurasi Admin:</span>
                </span>
                <p className="text-amber-800 font-medium pl-5">{detailItem.catatan_admin}</p>
              </div>
            )}

            {/* Action Footer (Hanya Tutup, Read-Only) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Hak kelola/ACC berada di Loket Admin Desa</span>
              </span>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
