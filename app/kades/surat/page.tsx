"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Store,
  Coins,
  Newspaper,
  Users,
  FolderArchive,
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
  SlidersHorizontal,
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
  FileCheck,
  FileCode,
  Paperclip,
  Phone,
  Sparkles,
  XCircle,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import KadesSidebar from "@/app/components/kades-sidebar";

interface BerkasItem {
  name: string;
  url: string;
  size?: number;
  type?: string;
  is_hasil_akhir?: boolean;
}

interface SuratItem {
  id: string;
  jenis_surat: string;
  jenis_surat_id: string;
  nama_pemohon: string;
  nik_pemohon: string;
  telepon_pemohon: string;
  rw_pemohon: string;
  keperluan: string;
  berkas_urls: BerkasItem[];
  status: string;
  step: number;
  status_label: string;
  status_color: string;
  estimasi_selesai: string;
  catatan: string;
  created_at: string;
  butuh_kades: boolean;
  kategori_otoritas: "kades" | "admin";
}

export default function KadesSuratVerificationPage() {
  const [suratList, setSuratList] = useState<SuratItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States - Default fokus pada "Menunggu Persetujuan Kades"
  const [statusFilter, setStatusFilter] = useState<string>("kades_perlu");
  const [searchQuery, setSearchQuery] = useState("");
  const [rwFilter, setRwFilter] = useState("Semua RW");

  // Premium Dropdown States & Refs
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRwDropdownOpen, setIsRwDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const rwDropdownRef = useRef<HTMLDivElement>(null);

  // Modal Detail Berkas
  const [selectedSurat, setSelectedSurat] = useState<SuratItem | null>(null);

  // Modal ACC Kades
  const [accModalSurat, setAccModalSurat] = useState<SuratItem | null>(null);
  const [accNote, setAccNote] = useState("");
  const [isAccing, setIsAccing] = useState(false);

  // Modal Tolak Kades
  const [rejectModalSurat, setRejectModalSurat] = useState<SuratItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Toast Notifikasi & Modal Sukses Lottie
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (rwDropdownRef.current && !rwDropdownRef.current.contains(e.target as Node)) {
        setIsRwDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data dari database Supabase melalui API route
  const fetchSuratData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/surat");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSuratList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat data surat kades dari database:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuratData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Eksekusi ACC & Tanda Tangan Kades
  const handleAccKades = async () => {
    if (!accModalSurat) return;
    try {
      setIsAccing(true);
      const res = await fetch("/api/admin/surat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: accModalSurat.id,
          action: "acc_kades",
          catatan:
            accNote ||
            "Telah diperiksa dan disetujui resmi oleh Kepala Desa Sawotratap. Berkas dikembalikan ke admin loket untuk diterbitkan.",
        }),
      });
      const json = await res.json();
      if (json.success) {
        const suratId = accModalSurat.id;
        setAccModalSurat(null);
        setAccNote("");
        fetchSuratData();
        setSuccessPopup({
          isOpen: true,
          title: "Surat Berhasil Disetujui!",
          message: `Permohonan nomor ${suratId} telah disetujui Kepala Desa dan otomatis kembali ke loket admin untuk dicetak / diterbitkan.`,
        });
      } else {
        alert(json.message || "Gagal menyetujui surat.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan saat menyetujui surat.");
    } finally {
      setIsAccing(false);
    }
  };

  // Eksekusi Tolak Permohonan oleh Kades
  const handleRejectKades = async () => {
    if (!rejectModalSurat) return;
    if (!rejectReason.trim()) {
      alert("Harap masukkan alasan penolakan agar pemohon dapat memperbaiki dokumen.");
      return;
    }
    try {
      setIsRejecting(true);
      const res = await fetch("/api/admin/surat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectModalSurat.id,
          action: "tolak_kades",
          catatan: rejectReason.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Permohonan ${rejectModalSurat.id} ditolak dengan catatan.`);
        setRejectModalSurat(null);
        setRejectReason("");
        fetchSuratData();
      } else {
        alert(json.message || "Gagal menolak permohonan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsRejecting(false);
    }
  };

  // Perhitungan Angka Filter
  const countMenungguKades = suratList.filter(
    (s) => s.status === "Menunggu Persetujuan Kades"
  ).length;
  const countDisetujuiKades = suratList.filter(
    (s) => s.status === "Disetujui Kades" || s.step >= 3
  ).length;
  const countDitolakKades = suratList.filter(
    (s) => s.status === "Ditolak Kades"
  ).length;
  const countWajibKades = suratList.filter(
    (s) => s.butuh_kades || s.kategori_otoritas === "kades"
  ).length;

  // Filter Data Surat berdasarkan opsi terpilih
  const filteredSurat = suratList.filter((item) => {
    // 1. Filter Status / Kategori
    if (statusFilter === "kades_perlu" && item.status !== "Menunggu Persetujuan Kades") {
      return false;
    }
    if (statusFilter === "acc_kades" && !(item.status === "Disetujui Kades" || item.step >= 3)) {
      return false;
    }
    if (statusFilter === "ditolak" && item.status !== "Ditolak Kades") {
      return false;
    }
    if (statusFilter === "semua_wajib_kades" && !(item.butuh_kades || item.kategori_otoritas === "kades")) {
      return false;
    }

    // 2. Filter RW
    if (rwFilter !== "Semua RW" && item.rw_pemohon !== rwFilter) {
      return false;
    }

    // 3. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchNama = item.nama_pemohon.toLowerCase().includes(q);
      const matchNik = item.nik_pemohon.toLowerCase().includes(q);
      const matchJenis = item.jenis_surat.toLowerCase().includes(q);
      if (!matchId && !matchNama && !matchNik && !matchJenis) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 font-sans flex flex-col lg:flex-row antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* TOAST NOTIFIKASI */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#064E3B] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SIDEBAR KEPALA DESA (PATOKAN TUNGGAL RESMI) */}
      {/* ========================================================================= */}
      <KadesSidebar
        activeItem="surat"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 2. AREA KONTEN UTAMA VERIFIKASI SURAT KADES */}
      {/* ========================================================================= */}
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
                <Link href="/kades" className="hover:text-emerald-700">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-800 font-bold">Disposisi & TTD Kades</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] leading-tight">
                Disposisi & Tanda Tangan Dokumen Surat
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchSuratData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-700" : ""}`} />
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

        {/* BODY KONTEN */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
          

          {/* FILTER BAR DROPDOWN PREMIUM */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8ECE7] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* DROPDOWN PREMIUM 1: STATUS PERMOHONAN */}
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                >
                  <Filter className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {statusFilter === "kades_perlu" && `Menunggu TTD Kades (${countMenungguKades})`}
                    {statusFilter === "acc_kades" && `Telah Disetujui Kades (${countDisetujuiKades})`}
                    {statusFilter === "ditolak" && `Ditolak Kades (${countDitolakKades})`}
                    {statusFilter === "semua_wajib_kades" && `Semua Surat Wajib Kades (${countWajibKades})`}
                    {statusFilter === "semua" && `Semua Permohonan (${suratList.length})`}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-2xl border border-[#E3E8E2] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => { setStatusFilter("kades_perlu"); setIsStatusDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${statusFilter === "kades_perlu" ? "bg-amber-50 text-amber-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Menunggu TTD Kades
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">{countMenungguKades}</span>
                    </button>

                    <button
                      onClick={() => { setStatusFilter("acc_kades"); setIsStatusDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${statusFilter === "acc_kades" ? "bg-emerald-50 text-emerald-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Telah Disetujui Kades
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">{countDisetujuiKades}</span>
                    </button>

                    <button
                      onClick={() => { setStatusFilter("ditolak"); setIsStatusDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${statusFilter === "ditolak" ? "bg-rose-50 text-rose-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        Ditolak Kades
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">{countDitolakKades}</span>
                    </button>

                    <div className="border-t border-[#F0F2F0] my-1"></div>

                    <button
                      onClick={() => { setStatusFilter("semua_wajib_kades"); setIsStatusDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${statusFilter === "semua_wajib_kades" ? "bg-slate-100 text-slate-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"}`}
                    >
                      <span>Semua Surat Wajib Kades</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-800">{countWajibKades}</span>
                    </button>

                    <button
                      onClick={() => { setStatusFilter("semua"); setIsStatusDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${statusFilter === "semua" ? "bg-slate-100 text-slate-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"}`}
                    >
                      <span>Semua Permohonan Desa</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">{suratList.length}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* DROPDOWN PREMIUM 2: FILTER RW */}
              <div className="relative" ref={rwDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsRwDropdownOpen(!isRwDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-2xs focus:outline-hidden"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{rwFilter}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isRwDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isRwDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-2xl border border-[#E3E8E2] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {["Semua RW", "RW 01", "RW 02", "RW 03", "RW 04", "RW 05", "RW 06", "RW 07", "RW 08"].map((rw) => (
                      <button
                        key={rw}
                        onClick={() => { setRwFilter(rw); setIsRwDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${rwFilter === rw ? "bg-emerald-50 text-emerald-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"}`}
                      >
                        <span>{rw}</span>
                        {rwFilter === rw && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PENCARIAN */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID resi, nama pemohon, NIK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-700 transition-all"
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

          </div>

          {/* TABEL PERMOHONAN VERIFIKASI KADES */}
          <div className="bg-white rounded-3xl border border-[#E8ECE7] shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-[#F0F2F0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Daftar Berkas & Permohonan Surat ({filteredSurat.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Tinjau lampiran warga sebelum menyetujui atau menolak permohonan
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400">
                Data Database Terkoneksi
              </span>
            </div>

            {isLoading ? (
              <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
                <p>Mengambil berkas pengajuan surat dari Supabase...</p>
              </div>
            ) : filteredSurat.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3 px-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-800 text-base">Tidak Ada Berkas Ditemukan</p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Tidak ada permohonan yang sesuai dengan filter pilihan saat ini.
                </p>
                <button
                  onClick={() => { setStatusFilter("semua"); setRwFilter("Semua RW"); setSearchQuery(""); }}
                  className="mt-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAFBF9] border-b border-[#E8ECE7] text-slate-500 font-black uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4 whitespace-nowrap">No. Resi & Tgl</th>
                      <th className="py-3.5 px-4">Jenis Surat</th>
                      <th className="py-3.5 px-4">Pemohon & Wilayah</th>
                      <th className="py-3.5 px-4">Keperluan & Lampiran</th>
                      <th className="py-3.5 px-4">Status Terkini</th>
                      <th className="py-3.5 px-6 text-right whitespace-nowrap">Tindakan Kepala Desa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F2F0]">
                    {filteredSurat.map((surat) => {
                      const isWaitingKades = surat.status === "Menunggu Persetujuan Kades";
                      const isApprovedKades = surat.status === "Disetujui Kades" || surat.step >= 3;
                      const isRejectedKades = surat.status === "Ditolak Kades";

                      return (
                        <tr key={surat.id} className="hover:bg-[#F9FBFA] transition-colors">
                          {/* NO. RESI & TANGGAL */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap min-w-[135px]">
                            <span className="font-mono font-black text-slate-900 bg-slate-100/90 px-2.5 py-1 rounded-lg text-xs border border-slate-200 block w-fit">
                              {surat.id}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-sans font-medium mt-1.5">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{surat.created_at ? new Date(surat.created_at).toLocaleDateString("id-ID") : "Hari ini"}</span>
                            </span>
                          </td>

                          {/* JENIS SURAT */}
                          <td className="py-4 px-4 align-middle min-w-[190px] max-w-[240px]">
                            <p className="font-black text-slate-900 text-xs leading-snug">{surat.jenis_surat}</p>
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {surat.butuh_kades || surat.kategori_otoritas === "kades" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-200">
                                  <Stamp className="w-2.5 h-2.5 text-amber-700" />
                                  Wajib TTD Kades
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                  Otoritas Admin
                                </span>
                              )}
                            </div>
                          </td>

                          {/* IDENTITAS PEMOHON */}
                          <td className="py-4 px-4 align-middle min-w-[170px]">
                            <p className="font-extrabold text-slate-900 text-xs">{surat.nama_pemohon}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">NIK: {surat.nik_pemohon}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                              {surat.rw_pemohon}
                            </span>
                          </td>

                          {/* KEPERLUAN & LAMPIRAN */}
                          <td className="py-4 px-4 align-middle min-w-[200px] max-w-[260px]">
                            <p className="text-slate-700 line-clamp-2 text-xs leading-relaxed font-medium" title={surat.keperluan}>
                              {surat.keperluan}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <button
                                onClick={() => setSelectedSurat(surat)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[11px] font-bold text-emerald-800 transition-colors shadow-2xs cursor-pointer"
                              >
                                <Paperclip className="w-3 h-3 text-emerald-700 shrink-0" />
                                <span>{surat.berkas_urls?.length || 0} Lampiran Berkas</span>
                              </button>
                            </div>
                          </td>

                          {/* STATUS TERKINI */}
                          <td className="py-4 px-4 align-middle min-w-[190px] max-w-[250px]">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                surat.status === "Menunggu Persetujuan Kades"
                                  ? "bg-amber-50 text-amber-900 border-amber-300/80"
                                  : surat.status_color && !surat.status_color.includes("purple")
                                  ? surat.status_color
                                  : "bg-slate-100 text-slate-800 border-slate-200"
                              }`}
                            >
                              {isWaitingKades && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                              {surat.status}
                            </span>
                            {surat.catatan && (
                              <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 italic leading-relaxed" title={surat.catatan}>
                                "{surat.catatan}"
                              </p>
                            )}
                          </td>

                          {/* TINDAKAN KEPALA DESA */}
                          <td className="py-4 px-6 align-middle text-right whitespace-nowrap min-w-[190px]">
                            {isWaitingKades ? (
                              <div className="flex items-center justify-end gap-2">
                                {/* TOMBOL 3D HIJAU TUA: SETUJUI */}
                                <button
                                  onClick={() => {
                                    setAccModalSurat(surat);
                                    setAccNote("Telah ditinjau dan disetujui resmi oleh Kepala Desa Sawotratap. Berkas dikembalikan ke loket admin untuk dicetak / diterbitkan.");
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white font-black text-xs shadow-[0_3px_0_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                  title="Setujui permohonan surat"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                                  <span>Setujui</span>
                                </button>

                                {/* TOMBOL 3D MERAH: TOLAK */}
                                <button
                                  onClick={() => {
                                    setRejectModalSurat(surat);
                                    setRejectReason("");
                                  }}
                                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-[0_3px_0_0_#9f1239] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                  title="Tolak permohonan surat"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-white" />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            ) : isApprovedKades ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Telah Disetujui
                                </span>
                              </div>
                            ) : isRejectedKades ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-black">
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                  Ditolak Kades
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedSurat(surat)}
                                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                                >
                                  Detail
                                </button>
                              </div>
                            )}
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

      {/* ========================================================================= */}
      {/* 3. MODAL DETAIL BERKAS WARGA */}
      {/* ========================================================================= */}
      {selectedSurat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#FAFBF9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Stamp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">
                    Detail Pengajuan: {selectedSurat.id}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedSurat.jenis_surat}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSurat(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Pemohon</span>
                  <strong className="text-slate-900 font-black">{selectedSurat.nama_pemohon}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Wilayah RT / RW</span>
                  <strong className="text-slate-900 font-black">{selectedSurat.rw_pemohon}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Nomor NIK</span>
                  <strong className="text-slate-900 font-mono">{selectedSurat.nik_pemohon}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kontak HP / WA</span>
                  <strong className="text-slate-900 font-mono">{selectedSurat.telepon_pemohon || "—"}</strong>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Keperluan Pemohon:
                </label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                  {selectedSurat.keperluan}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Lampiran Berkas Persyaratan ({selectedSurat.berkas_urls?.length || 0}):
                </label>
                <div className="space-y-2">
                  {selectedSurat.berkas_urls && selectedSurat.berkas_urls.length > 0 ? (
                    selectedSurat.berkas_urls.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <Paperclip className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {file.type || "Dokumen Lampiran"} • {file.size ? `${(file.size / 1024).toFixed(0)} KB` : "Tersimpan"}
                            </p>
                          </div>
                        </div>

                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka Lampiran</span>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      Tidak ada lampiran dokumen digital tambahan
                    </div>
                  )}
                </div>
              </div>

              {selectedSurat.catatan && (
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Catatan Verifikasi Terakhir:
                  </label>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "{selectedSurat.catatan}"
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-[#FAFBF9] flex justify-end gap-2">
              <button
                onClick={() => setSelectedSurat(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL ACC & TANDATANGAN RESMI KEPALA DESA */}
      {/* ========================================================================= */}
      {accModalSurat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-emerald-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-gradient-to-r from-[#064E3B] to-[#093529] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#06261D] flex items-center justify-center font-black shadow-xs">
                  <Stamp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">
                    Persetujuan & Tanda Tangan Kades
                  </h4>
                  <p className="text-xs text-emerald-200">
                    Pengesahan Resmi Dokumen Permohonan Warga
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-emerald-800 font-bold">Nomor Resi:</span>
                  <span className="font-mono font-black text-slate-900">{accModalSurat.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-800 font-bold">Pemohon:</span>
                  <span className="font-black text-slate-900">{accModalSurat.nama_pemohon} ({accModalSurat.rw_pemohon})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-800 font-bold">Jenis Dokumen:</span>
                  <span className="font-black text-slate-900">{accModalSurat.jenis_surat}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan / Pernyataan Persetujuan Kepala Desa:
                </label>
                <textarea
                  rows={3}
                  value={accNote}
                  onChange={(e) => setAccNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-700 bg-slate-50/50 focus:bg-white"
                  placeholder="Contoh: Telah ditinjau dan disetujui resmi oleh Kepala Desa Sawotratap..."
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Catatan ini akan tersimpan di riwayat berkas dan dapat dibaca oleh staf loket admin serta pemohon.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Setelah tombol <strong>"Setujui Permohonan"</strong> ditekan, status dokumen akan otomatis menjadi <strong>"Disetujui Kades"</strong> dan diteruskan kembali ke loket staf admin untuk dicetak stempel / diterbitkan digital PDF.
                </span>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-[#FAFBF9] flex justify-end gap-3">
              <button
                onClick={() => setAccModalSurat(null)}
                disabled={isAccing}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleAccKades}
                disabled={isAccing}
                className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-black shadow-[0_3px_0_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAccing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyetujui Dokumen...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Setujui Permohonan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL PENOLAKAN KADES */}
      {/* ========================================================================= */}
      {rejectModalSurat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-rose-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-gradient-to-r from-rose-700 to-rose-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">
                    Tolak Permohonan Surat
                  </h4>
                  <p className="text-xs text-rose-200">
                    Otoritas Penolakan Kepala Desa
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Anda akan menolak pengajuan <strong>{rejectModalSurat.jenis_surat}</strong> milik <strong>{rejectModalSurat.nama_pemohon}</strong>.
              </p>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  Alasan Penolakan / Dokumen yang Perlu Diperbaiki: <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-rose-200 text-xs focus:outline-hidden focus:border-rose-600 bg-rose-50/30"
                  placeholder="Contoh: Berkas Kartu Keluarga pemohon belum dilegalisir terbaru / surat pengantar RT belum mencantumkan stempel basah..."
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-[#FAFBF9] flex justify-end gap-3">
              <button
                onClick={() => setRejectModalSurat(null)}
                disabled={isRejecting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleRejectKades}
                disabled={isRejecting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-[0_3px_0_0_#9f1239] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRejecting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Konfirmasi Tolak Permohonan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JENDELA POP-UP SUKSES DENGAN ANIMASI LOTTIE CENTANG */}
      {successPopup && (
        <LottieSuccessModal
          isOpen={successPopup.isOpen}
          title={successPopup.title}
          message={successPopup.message}
          onClose={() => setSuccessPopup(null)}
          loopTarget={2}
        />
      )}

    </div>
  );
}
