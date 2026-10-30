"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import KadesSidebar from "@/app/components/kades-sidebar";
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Store,
  Coins,
  Newspaper,
  Wrench,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Layers,
  MapPin,
  Menu,
  X,
  LogOut,
  Eye,
  RefreshCw,
  Home,
  Check,
  AlertTriangle,
  Award,
  Stamp,
  Send,
  UserCheck,
  HardHat,
  Phone,
  Sparkles,
  Paperclip,
  CheckCheck,
  Ban,
  Building,
  DollarSign,
  Camera,
  History,
  FileCheck2,
  FileCheck,
} from "lucide-react";
import LottieSuccessModal from "@/app/components/lottie-success-modal";

interface FotoItem {
  name: string;
  url: string;
  size?: number;
  type?: string;
  s3Path?: string;
}

interface RiwayatItem {
  tanggal: string;
  aktor: string;
  keterangan: string;
}

interface PengaduanItem {
  id: string;
  kategori: string;
  lokasi: string;
  nama_pelapor: string;
  nik_pelapor?: string;
  kontak_pelapor: string;
  rw?: string;
  isi_aduan: string;
  foto_urls: FotoItem[];
  status: "menunggu_verifikasi_admin" | "diteruskan_ke_kades" | "disetujui_kades" | "sedang_perbaikan" | "selesai" | "ditolak" | string;
  status_label: string;
  status_color: string;
  step: number;
  catatan_admin?: string;
  catatan_kades?: string;
  vendor_nama?: string;
  vendor_kontak?: string;
  estimasi_biaya?: string;
  catatan_selesai?: string;
  foto_selesai?: string;
  created_at: string;
  updated_at?: string;
  riwayat?: RiwayatItem[];
}

export default function KadesPengaduanManagementPage() {
  const [laporanList, setLaporanList] = useState<PengaduanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States: Default tab fokus pada laporan yang butuh ACC Kades ("diteruskan_ke_kades")
  const [activeTab, setActiveTab] = useState<
    "diteruskan_ke_kades" | "semua" | "disetujui_kades" | "sedang_perbaikan" | "selesai" | "ditolak"
  >("diteruskan_ke_kades");
  const [searchQuery, setSearchQuery] = useState("");
  const [rwFilter, setRwFilter] = useState("Semua RW");

  // Modals
  const [detailModalItem, setDetailModalItem] = useState<PengaduanItem | null>(null);

  // Modal 1: ACC / Persetujuan Kades
  const [accModalItem, setAccModalItem] = useState<PengaduanItem | null>(null);
  const [catatanAccKades, setCatatanAccKades] = useState("");
  const [isAccSubmitting, setIsAccSubmitting] = useState(false);

  // Modal 2: Tolak Laporan oleh Kades (Wajib ada alasan)
  const [rejectModalItem, setRejectModalItem] = useState<PengaduanItem | null>(null);
  const [alasanPenolakan, setAlasanPenolakan] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Modal Sukses Lottie
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Fetch Data Laporan dari API
  const fetchLaporanData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/pengaduan");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLaporanList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat data pengaduan kades:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLaporanData();
  }, []);

  // Filter Data
  const filteredList = laporanList.filter((item) => {
    if (activeTab !== "semua" && item.status !== activeTab) {
      return false;
    }

    if (rwFilter !== "Semua RW" && item.rw && item.rw !== rwFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchNama = item.nama_pelapor?.toLowerCase().includes(q);
      const matchLokasi = item.lokasi?.toLowerCase().includes(q);
      const matchKategori = item.kategori?.toLowerCase().includes(q);
      const matchIsi = item.isi_aduan?.toLowerCase().includes(q);
      const matchVendor = item.vendor_nama?.toLowerCase().includes(q);
      return matchId || matchNama || matchLokasi || matchKategori || matchIsi || matchVendor;
    }

    return true;
  });

  // Action 1: Konfirmasi ACC Kades
  const handleConfirmAccKades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accModalItem) return;
    setIsAccSubmitting(true);

    const catatanFinal =
      catatanAccKades.trim() ||
      "Disetujui Kepala Desa Sawotratap. Silakan Admin Desa segera menugaskan vendor perbaikan fisik di lapangan.";

    try {
      const res = await fetch("/api/pengaduan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: accModalItem.id,
          action: "acc_kades",
          catatanKades: catatanFinal,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAccModalItem(null);
        setCatatanAccKades("");
        fetchLaporanData();
        setSuccessPopup({
          isOpen: true,
          title: "Persetujuan (ACC) Berhasil Diberikan!",
          message: `Laporan ${accModalItem.id} telah disetujui Kepala Desa. Berkas kini kembali ke meja Admin Desa untuk proses penunjukan vendor perbaikan.`,
        });
      } else {
        alert(json.message || "Gagal memberikan persetujuan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi saat mengirim persetujuan.");
    } finally {
      setIsAccSubmitting(false);
    }
  };

  // Action 2: Konfirmasi Tolak Laporan oleh Kades (Alasan Wajib)
  const handleConfirmRejectKades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;
    if (!alasanPenolakan.trim()) {
      alert("Harap tuliskan alasan penolakan laporan secara jelas.");
      return;
    }
    setIsRejecting(true);

    try {
      const res = await fetch("/api/pengaduan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectModalItem.id,
          action: "tolak",
          catatan: `Ditolak oleh Kepala Desa: ${alasanPenolakan.trim()}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRejectModalItem(null);
        setAlasanPenolakan("");
        fetchLaporanData();
        setSuccessPopup({
          isOpen: true,
          title: "Laporan Ditolak Kepala Desa",
          message: `Laporan ${rejectModalItem.id} berhasil ditolak dengan alasan resmi: "${alasanPenolakan}". Alasan ini telah dicatat pada sistem pelacakan warga.`,
        });
      } else {
        alert(json.message || "Gagal menolak laporan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsRejecting(false);
    }
  };

  // Hitung jumlah data
  const countTotal = laporanList.length;
  const countButuhAcc = laporanList.filter((l) => l.status === "diteruskan_ke_kades").length;
  const countDisetujui = laporanList.filter((l) => l.status === "disetujui_kades").length;
  const countSedangDikerjakan = laporanList.filter((l) => l.status === "sedang_perbaikan").length;
  const countSelesai = laporanList.filter((l) => l.status === "selesai").length;
  const countDitolak = laporanList.filter((l) => l.status === "ditolak").length;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 flex font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. SIDEBAR KADES (PATOKAN TUNGGAL RESMI) */}
      {/* ========================================================= */}
      <KadesSidebar
        activeItem="pengaduan"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ========================================================= */}
      {/* 2. KONTEN UTAMA MEJA KADES */}
      {/* ========================================================= */}
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* HEADER TOP BAR */}
        <header className="h-16 px-6 sm:px-8 bg-white border-b border-[#E3E8E2] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <Link href="/kades" className="hover:text-purple-700">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-800 font-bold">Persetujuan Kerusakan</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] leading-tight">
                Persetujuan & Disposisi Laporan Kerusakan
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchLaporanData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-700" : ""}`} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* METRIC CARDS RINGKASAN MEJA KADES */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* 1. Menunggu ACC Kades */}
            <div
              onClick={() => setActiveTab("diteruskan_ke_kades")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "diteruskan_ke_kades"
                  ? "bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20"
                  : "bg-white border-slate-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between text-amber-900 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider">Perlu ACC Kades</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{countButuhAcc}</p>
              <span className="text-[10px] font-bold text-rose-600">Prioritas Tindakan</span>
            </div>

            {/* 2. Disetujui (ACC Turun) */}
            <div
              onClick={() => setActiveTab("disetujui_kades")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "disetujui_kades"
                  ? "bg-teal-50 border-teal-600 shadow-md ring-2 ring-teal-600/20"
                  : "bg-white border-slate-200 hover:border-teal-300"
              }`}
            >
              <div className="flex items-center justify-between text-teal-800 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Telah Di-ACC</span>
                <CheckCircle2 className="w-4 h-4 text-teal-700" />
              </div>
              <p className="text-2xl font-black text-teal-950">{countDisetujui}</p>
              <span className="text-[10px] text-teal-700">Kembali ke Admin (Vendor)</span>
            </div>

            {/* 3. Sedang Dikerjakan Vendor */}
            <div
              onClick={() => setActiveTab("sedang_perbaikan")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "sedang_perbaikan"
                  ? "bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-600/20"
                  : "bg-white border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between text-blue-800 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Sedang Pengerjaan</span>
                <Wrench className="w-4 h-4 text-blue-700" />
              </div>
              <p className="text-2xl font-black text-blue-950">{countSedangDikerjakan}</p>
              <span className="text-[10px] text-blue-700">Fisik di Lapangan</span>
            </div>

            {/* 4. Selesai Tuntas */}
            <div
              onClick={() => setActiveTab("selesai")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "selesai"
                  ? "bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-600/20"
                  : "bg-white border-slate-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between text-emerald-800 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Perbaikan Selesai</span>
                <CheckCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-2xl font-black text-emerald-950">{countSelesai}</p>
              <span className="text-[10px] text-emerald-700">Tuntas 100%</span>
            </div>

            {/* 5. Ditolak Kades / Admin */}
            <div
              onClick={() => setActiveTab("ditolak")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "ditolak"
                  ? "bg-rose-50 border-rose-600 shadow-md ring-2 ring-rose-600/20"
                  : "bg-white border-slate-200 hover:border-rose-300"
              }`}
            >
              <div className="flex items-center justify-between text-rose-800 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Ditolak</span>
                <Ban className="w-4 h-4 text-rose-700" />
              </div>
              <p className="text-2xl font-black text-rose-950">{countDitolak}</p>
              <span className="text-[10px] text-rose-700">Dengan Alasan</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FILTER & PENCARIAN BAR */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-[#E3E8E2] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID aduan, lokasi, pelapor, atau kategori..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-700 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter RW & Reset */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={rwFilter}
                  onChange={(e) => setRwFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-emerald-700"
                >
                  <option>Semua RW</option>
                  <option>RW 01</option>
                  <option>RW 02</option>
                  <option>RW 03</option>
                  <option>RW 04</option>
                  <option>RW 05</option>
                  <option>RW 06</option>
                  <option>RW 07</option>
                  <option>RW 08</option>
                </select>

                <button
                  onClick={() => {
                    setActiveTab("semua");
                    setSearchQuery("");
                    setRwFilter("Semua RW");
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            {/* Tabs Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
              {[
                { id: "diteruskan_ke_kades", label: "Wajib ACC Kades", count: countButuhAcc, badge: "bg-rose-500 text-white" },
                { id: "semua", label: "Semua Arsip Desa", count: countTotal, badge: "bg-slate-200 text-slate-700" },
                { id: "disetujui_kades", label: "Telah Di-ACC Kades", count: countDisetujui, badge: "bg-teal-100 text-teal-900" },
                { id: "sedang_perbaikan", label: "Sedang Dikerjakan Vendor", count: countSedangDikerjakan, badge: "bg-blue-100 text-blue-900" },
                { id: "selesai", label: "Selesai Tuntas", count: countSelesai, badge: "bg-emerald-100 text-emerald-900" },
                { id: "ditolak", label: "Ditolak", count: countDitolak, badge: "bg-rose-100 text-rose-900" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === tab.id ? "bg-[#C5D82F] text-[#06261D]" : tab.badge || "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* TABEL PENGADUAN & DOKUMENTASI KERUSAKAN */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-[#E3E8E2] shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-600">Memuat berkas pengaduan ke meja Kades...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Wrench className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Tidak Ada Laporan</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {activeTab === "diteruskan_ke_kades"
                    ? "Semua laporan yang membutuhkan persetujuan Kades telah ditindaklanjuti."
                    : "Tidak ada laporan yang sesuai dengan filter saat ini."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">ID & Tanggal Lapor</th>
                      <th className="py-3.5 px-4">Pelapor & Lokasi</th>
                      <th className="py-3.5 px-4">Kategori & Masalah</th>
                      <th className="py-3.5 px-4">Dokumentasi Bukti</th>
                      <th className="py-3.5 px-4">Catatan Rekomendasi Admin</th>
                      <th className="py-3.5 px-4">Status Alur</th>
                      <th className="py-3.5 px-4 text-center">Keputusan Kepala Desa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((item) => {
                      const firstPhoto = item.foto_urls?.[0];
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          {/* ID & Tanggal */}
                          <td className="py-4 px-4 align-top">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] block w-fit mb-1">
                              {item.id}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                            </span>
                          </td>

                          {/* Pelapor & Lokasi */}
                          <td className="py-4 px-4 align-top">
                            <strong className="text-slate-900 block font-bold text-xs">
                              {item.nama_pelapor}
                            </strong>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{item.rw || "RW 01"}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[160px] mt-0.5">
                              {item.lokasi}
                            </span>
                          </td>

                          {/* Kategori & Masalah */}
                          <td className="py-4 px-4 align-top max-w-[260px]">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                              {item.kategori}
                            </span>
                            <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed italic">
                              &ldquo;{item.isi_aduan}&rdquo;
                            </p>
                          </td>

                          {/* Dokumentasi Bukti (Foto) */}
                          <td className="py-4 px-4 align-top">
                            {firstPhoto ? (
                              <div
                                onClick={() => setDetailModalItem(item)}
                                className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group shrink-0 shadow-xs"
                                title="Klik untuk memantau foto dokumentasi lengkap"
                              >
                                <img
                                  src={firstPhoto.url}
                                  alt={firstPhoto.name || "Foto"}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                                  <Camera className="w-4 h-4" />
                                </div>
                                {item.foto_urls.length > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-black/80 text-white text-[9px] font-bold px-1 rounded-tl">
                                    +{item.foto_urls.length - 1} Foto
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Tanpa Foto</span>
                            )}
                          </td>

                          {/* Catatan Admin ke Kades */}
                          <td className="py-4 px-4 align-top max-w-[220px]">
                            {item.catatan_admin ? (
                              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-950">
                                <span className="font-bold block text-[10px] uppercase text-emerald-800 mb-0.5">
                                  Disposisi Admin:
                                </span>
                                <p className="line-clamp-3 leading-relaxed text-slate-700">{item.catatan_admin}</p>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">-</span>
                            )}
                          </td>

                          {/* Status Alur */}
                          <td className="py-4 px-4 align-top">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                                item.status_color || "bg-slate-100 text-slate-800 border-slate-200"
                              }`}
                            >
                              {item.status === "diteruskan_ke_kades" ? (
                                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                              ) : item.status === "disetujui_kades" ? (
                                <CheckCircle2 className="w-3 h-3 text-teal-700" />
                              ) : item.status === "sedang_perbaikan" ? (
                                <Wrench className="w-3 h-3 text-blue-700" />
                              ) : item.status === "selesai" ? (
                                <CheckCheck className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <AlertTriangle className="w-3 h-3 text-amber-700" />
                              )}
                              <span>{item.status_label || item.status}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              Tahap {item.step || 1} dari 5
                            </span>
                          </td>

                          {/* Tombol Keputusan Kades */}
                          <td className="py-4 px-4 align-top text-center">
                            <div className="flex flex-col gap-1.5 min-w-[140px] items-stretch">
                              {/* Kasus Utama: Menunggu ACC Kades */}
                              {item.status === "diteruskan_ke_kades" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setAccModalItem(item);
                                      setCatatanAccKades(
                                        "Disetujui Kepala Desa. Silakan Admin Desa segera menugaskan vendor perbaikan fisik sarpras di lapangan."
                                      );
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                  >
                                    <Stamp className="w-3.5 h-3.5 text-[#C5D82F]" />
                                    <span>Setujui (ACC)</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRejectModalItem(item);
                                      setAlasanPenolakan("");
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer border border-rose-200"
                                  >
                                    <Ban className="w-3 h-3 text-rose-600" />
                                    <span>Tolak Laporan</span>
                                  </button>
                                </>
                              )}

                              {/* Kasus Sudah Di-ACC Kades */}
                              {item.status === "disetujui_kades" && (
                                <span className="px-2 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold block">
                                  ✓ Sudah Di-ACC
                                </span>
                              )}

                              {/* Kasus Sedang Dikerjakan Vendor */}
                              {item.status === "sedang_perbaikan" && (
                                <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold block">
                                  Vendor: {item.vendor_nama || "Aktif"}
                                </span>
                              )}

                              {/* Kasus Selesai */}
                              {item.status === "selesai" && (
                                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold block">
                                  Tuntas 100%
                                </span>
                              )}

                              {/* Kasus Ditolak */}
                              {item.status === "ditolak" && (
                                <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold block">
                                  Ditolak
                                </span>
                              )}

                              {/* Tombol Detail Lengkap & Pantau Dokumentasi */}
                              <button
                                onClick={() => setDetailModalItem(item)}
                                className="px-2.5 py-1 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-200"
                              >
                                <Eye className="w-3 h-3 text-slate-600" />
                                <span>Pantau Foto & Log</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: FORM PERSETUJUAN (ACC) KEPALA DESA */}
      {/* ========================================================= */}
      {accModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-emerald-200 shadow-2xl overflow-hidden">
            <div className="p-6 bg-[#064E3B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5D82F] flex items-center gap-1">
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Lembar Disposisi Kepala Desa</span>
                </span>
                <h3 className="text-lg font-black tracking-tight">Persetujuan (ACC) Perbaikan</h3>
              </div>
              <button
                onClick={() => setAccModalItem(null)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAccKades} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID Laporan:</span>
                  <strong className="font-mono text-emerald-950 font-bold">{accModalItem.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <strong className="text-slate-800">{accModalItem.kategori}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lokasi Kejadian:</span>
                  <strong className="text-slate-800">{accModalItem.lokasi} ({accModalItem.rw || "RW 01"})</strong>
                </div>
                <div className="pt-1 border-t border-emerald-200 text-slate-700 italic">
                  &ldquo;{accModalItem.isi_aduan}&rdquo;
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Arahan Disposisi Kepala Desa *
                </label>
                <textarea
                  required
                  rows={4}
                  value={catatanAccKades}
                  onChange={(e) => setCatatanAccKades(e.target.value)}
                  placeholder="Tuliskan arahan pelaksanaan untuk Admin Desa / Seksi Pembangunan..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-700"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Setelah di-ACC, status akan otomatis berpindah kembali ke meja Admin untuk mencari dan menugaskan vendor perbaikan.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAccModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAccSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  {isAccSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Stamp className="w-4 h-4 text-[#C5D82F]" />}
                  <span>Terbitkan ACC Kades</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: FORM PENOLAKAN OLEH KADES (WAJIB ADA ALASAN) */}
      {/* ========================================================= */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-rose-200 shadow-2xl overflow-hidden">
            <div className="p-6 bg-rose-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-200 flex items-center gap-1">
                  <Ban className="w-3.5 h-3.5" />
                  <span>Otoritas Penolakan Kepala Desa</span>
                </span>
                <h3 className="text-lg font-black tracking-tight">Tolak Laporan Kerusakan</h3>
              </div>
              <button
                onClick={() => setRejectModalItem(null)}
                className="p-1 rounded-lg text-rose-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRejectKades} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <p className="text-rose-950">
                  Anda akan menolak pengaduan <strong>{rejectModalItem.id}</strong> ({rejectModalItem.kategori}).
                </p>
                <p className="text-[11px] text-slate-600">
                  Kepala Desa wajib memberikan alasan resmi agar warga pelapor mendapatkan kejelasan transparan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Alasan Resmi Penolakan Kades <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={alasanPenolakan}
                  onChange={(e) => setAlasanPenolakan(e.target.value)}
                  placeholder="Contoh: Berdasarkan hasil peninjauan, lokasi jalan tersebut merupakan aset jalan provinsi yang wewenang anggarannya berada di Dinas PU Bina Marga Kabupaten, warga diarahkan melapor melalui aplikasi lapor kabupaten..."
                  className="w-full p-3 rounded-xl border border-rose-300 text-xs focus:outline-none focus:border-rose-700 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isRejecting}
                  className="px-5 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  {isRejecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                  <span>Tolak dengan Alasan Ini</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DETAIL RINCIAN, FOTO DOKUMENTASI & LOG LENGKAP */}
      {/* ========================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#06261D] text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#C5D82F]">
                  Inspeksi Berkas & Dokumentasi Kades
                </span>
                <h3 className="text-xl font-black tracking-tight">{detailModalItem.id}</h3>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Status Header */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block">
                    Status Dokumen
                  </span>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-black border ${detailModalItem.status_color}`}>
                    {detailModalItem.status_label || detailModalItem.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Proses Alur
                  </span>
                  <strong className="text-emerald-950 text-xs">Tahap {detailModalItem.step || 1} dari 5</strong>
                </div>
              </div>

              {/* Data Pelapor & Lokasi */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Nama Pelapor:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.nama_pelapor}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Nomor WhatsApp:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.kontak_pelapor || "-"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Kategori Masalah:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.kategori}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Lokasi RT/RW:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.lokasi} ({detailModalItem.rw || "RW 01"})</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Deskripsi Lengkap Aduan Warga:</span>
                  <p className="text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
                    &ldquo;{detailModalItem.isi_aduan}&rdquo;
                  </p>
                </div>
              </div>

              {/* Catatan Admin ke Kades */}
              {detailModalItem.catatan_admin && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                    Catatan Rekomendasi Admin Desa:
                  </span>
                  <p className="text-slate-800 leading-relaxed">{detailModalItem.catatan_admin}</p>
                </div>
              )}

              {/* Catatan Kades Jika Sudah Diberikan */}
              {detailModalItem.catatan_kades && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Arahan Disposisi Kepala Desa:</span>
                  </span>
                  <p className="text-emerald-950 font-medium leading-relaxed">{detailModalItem.catatan_kades}</p>
                </div>
              )}

              {/* Foto Dokumentasi Kerusakan */}
              {detailModalItem.foto_urls && detailModalItem.foto_urls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>Dokumentasi Foto Bukti Kerusakan ({detailModalItem.foto_urls.length} Berkas):</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detailModalItem.foto_urls.map((f, idx) => (
                      <a
                        key={idx}
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl overflow-hidden border border-slate-200 group block relative aspect-video bg-slate-100 shadow-xs"
                      >
                        <img
                          src={f.url}
                          alt={f.name || `Foto ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Perbesar Foto</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Log Timeline Riwayat */}
              {detailModalItem.riwayat && detailModalItem.riwayat.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-600" />
                    <span>Kronologis Riwayat Tindakan:</span>
                  </h4>
                  <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {detailModalItem.riwayat.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 pl-1 relative">
                        <div className="w-4 h-4 rounded-full bg-[#064E3B] text-white flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">
                          ✓
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 w-full text-[11px]">
                          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                            <strong className="text-slate-800">{r.aktor}</strong>
                            <span>{r.tanggal}</span>
                          </div>
                          <p className="text-slate-600">{r.keterangan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              {detailModalItem.status === "diteruskan_ke_kades" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAccModalItem(detailModalItem);
                      setDetailModalItem(null);
                      setCatatanAccKades("Disetujui Kepala Desa Sawotratap. Silakan Admin Desa segera menugaskan vendor perbaikan fisik di lapangan.");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Stamp className="w-3.5 h-3.5 text-[#C5D82F]" />
                    <span>Setujui (ACC)</span>
                  </button>
                  <button
                    onClick={() => {
                      setRejectModalItem(detailModalItem);
                      setDetailModalItem(null);
                      setAlasanPenolakan("");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1 border border-rose-200"
                  >
                    <Ban className="w-3 h-3 text-rose-600" />
                    <span>Tolak</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-medium">Status: {detailModalItem.status_label}</span>
              )}

              <button
                onClick={() => setDetailModalItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup Sukses Animasi Lottie */}
      <LottieSuccessModal
        isOpen={successPopup.isOpen}
        title={successPopup.title}
        message={successPopup.message}
        onClose={() => setSuccessPopup({ isOpen: false, title: "", message: "" })}
      />
    </div>
  );
}
