"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  FileText,
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
  Check,
  AlertTriangle,
  Stamp,
  Paperclip,
  Calendar,
  Send,
  FileCheck,
} from "lucide-react";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import KadesSidebar from "@/app/components/kades-sidebar";

interface BerkasItem {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

interface PerizinanItem {
  id: string;
  jenis_perizinan: string;
  kategori: string;
  nama_pemohon: string;
  nik_pemohon: string;
  telepon_pemohon: string;
  rw_pemohon: string;
  nama_kegiatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  waktu_kegiatan: string;
  lokasi_fasilitas: string;
  jumlah_peserta: string;
  keterangan: string;
  berkas_urls: BerkasItem[];
  status: string;
  step: number;
  status_label: string;
  status_color: string;
  catatan_petugas: string;
  catatan_admin?: string;
  catatan_kades?: string;
  created_at: string;
  estimasi_selesai?: string;
}

export default function KadesPerizinanPage() {
  const [perizinanList, setPerizinanList] = useState<PerizinanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States - Default fokus pada permohonan yang perlu ACC Kades
  const [statusFilter, setStatusFilter] = useState<
    "perlu_kades" | "disetujui_kades" | "terbit_resmi" | "ditolak" | "semua"
  >("perlu_kades");
  const [searchQuery, setSearchQuery] = useState("");
  const [rwFilter, setRwFilter] = useState("Semua RW");
  const [kategoriFilter, setKategoriFilter] = useState("Semua Kategori");

  // Dropdown Refs & States
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRwDropdownOpen, setIsRwDropdownOpen] = useState(false);
  const [isKategoriDropdownOpen, setIsKategoriDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const rwDropdownRef = useRef<HTMLDivElement>(null);
  const kategoriDropdownRef = useRef<HTMLDivElement>(null);

  // Modals
  const [selectedItem, setSelectedItem] = useState<PerizinanItem | null>(null);

  // Modal ACC Kades
  const [accModalItem, setAccModalItem] = useState<PerizinanItem | null>(null);
  const [accNote, setAccNote] = useState("");
  const [isAccing, setIsAccing] = useState(false);

  // Modal Tolak Kades
  const [rejectModalItem, setRejectModalItem] = useState<PerizinanItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Lottie Success Popup
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  // Handle click outside dropdowns
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

  // Fetch Data dari API
  const fetchPerizinanData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/perizinan");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPerizinanList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat data perizinan kades:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPerizinanData();
  }, []);

  // Eksekusi ACC & Tanda Tangan Kades (Mengembalikan ke Admin)
  const handleConfirmAccKades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accModalItem) return;

    try {
      setIsAccing(true);
      const noteToSend =
        accNote.trim() ||
        "Disetujui resmi oleh Kepala Desa Sawotratap. Berkas dikembalikan ke Admin Seksi Pemerintahan untuk penerbitan izin resmi.";

      const res = await fetch("/api/perizinan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: accModalItem.id,
          action: "acc_kades",
          catatan: noteToSend,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const itemNumber = accModalItem.id;
        setAccModalItem(null);
        setAccNote("");
        fetchPerizinanData();
        setSuccessPopup({
          isOpen: true,
          title: "Permohonan Berhasil Di-ACC!",
          message: `Permohonan ${itemNumber} telah disetujui Kepala Desa dan otomatis dikembalikan ke loket Admin Desa untuk diterbitkan izin resminya.`,
        });
      } else {
        alert(json.message || "Gagal menyetujui permohonan.");
      }
    } catch (err) {
      console.error("Error ACC Kades:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAccing(false);
    }
  };

  // Eksekusi Tolak oleh Kades
  const handleConfirmRejectKades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;
    if (!rejectReason.trim()) {
      alert("Harap tuliskan alasan penolakan.");
      return;
    }

    try {
      setIsRejecting(true);
      const res = await fetch("/api/perizinan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectModalItem.id,
          action: "tolak_kades",
          catatan: rejectReason.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRejectModalItem(null);
        setRejectReason("");
        fetchPerizinanData();
      } else {
        alert(json.message || "Gagal menolak permohonan.");
      }
    } catch (err) {
      console.error("Error Tolak Kades:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsRejecting(false);
    }
  };

  // Perhitungan Angka Metrik Kades
  const countPerluKades = perizinanList.filter(
    (p) => p.status === "Menunggu Persetujuan Kades" || p.status === "Diteruskan ke Kepala Desa"
  ).length;

  const countDisetujuiKades = perizinanList.filter(
    (p) => p.status === "Disetujui Kades"
  ).length;

  const countTerbitResmi = perizinanList.filter(
    (p) => p.status === "Izin Resmi Terbit" || p.status === "Selesai"
  ).length;

  const countDitolak = perizinanList.filter(
    (p) => p.status === "Ditolak Kades" || p.status === "Ditolak"
  ).length;

  const countTotal = perizinanList.length;

  // Filter Data List
  const filteredList = perizinanList.filter((item) => {
    if (statusFilter === "perlu_kades") {
      if (item.status !== "Menunggu Persetujuan Kades" && item.status !== "Diteruskan ke Kepala Desa") {
        return false;
      }
    } else if (statusFilter === "disetujui_kades") {
      if (item.status !== "Disetujui Kades") return false;
    } else if (statusFilter === "terbit_resmi") {
      if (item.status !== "Izin Resmi Terbit" && item.status !== "Selesai") return false;
    } else if (statusFilter === "ditolak") {
      if (item.status !== "Ditolak Kades" && item.status !== "Ditolak") return false;
    }

    if (kategoriFilter !== "Semua Kategori" && item.kategori !== kategoriFilter) {
      return false;
    }

    if (rwFilter !== "Semua RW" && item.rw_pemohon !== rwFilter) {
      return false;
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchNama = item.nama_pemohon?.toLowerCase().includes(q);
      const matchKegiatan = item.nama_kegiatan?.toLowerCase().includes(q);
      const matchLokasi = item.lokasi_fasilitas?.toLowerCase().includes(q);
      const matchNik = item.nik_pemohon?.toLowerCase().includes(q);
      if (!matchId && !matchNama && !matchKegiatan && !matchLokasi && !matchNik) {
        return false;
      }
    }

    return true;
  });

  const statusOptions = [
    {
      id: "perlu_kades" as const,
      label: "Perlu Persetujuan Kades",
      count: countPerluKades,
      desc: "Menunggu disposisi & tanda tangan Kades",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: Clock,
    },
    {
      id: "disetujui_kades" as const,
      label: "Disetujui (Kembali ke Admin)",
      count: countDisetujuiKades,
      desc: "Telah di-ACC Kades, kembali ke loket Admin",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: CheckCircle2,
    },
    {
      id: "terbit_resmi" as const,
      label: "Izin Resmi Terbit",
      count: countTerbitResmi,
      desc: "Surat izin & jadwal peminjaman aktif",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: FileCheck,
    },
    {
      id: "ditolak" as const,
      label: "Permohonan Ditolak",
      count: countDitolak,
      desc: "Ditolak Kades atau administrasi tidak lengkap",
      badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
      icon: AlertTriangle,
    },
    {
      id: "semua" as const,
      label: "Semua Permohonan",
      count: countTotal,
      desc: "Seluruh berkas perizinan masuk",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      icon: Building2,
    },
  ];

  const currentFilterLabel =
    statusOptions.find((o) => o.id === statusFilter)?.label || "Semua Permohonan";

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 font-sans flex antialiased">
      {/* 1. SIDEBAR RESMI MEJA KEPALA DESA */}
      <KadesSidebar
        activeItem="perizinan"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. KONTEN UTAMA MEJA KADES */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* HEADER TOP BAR */}
        <header className="h-16 px-6 sm:px-8 bg-white border-b border-[#E3E8E2] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <a href="/kades" className="hover:text-emerald-700">Meja Kades</a>
                <span>/</span>
                <span className="text-slate-800 font-bold">Perizinan & Fasilitas Desa</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] leading-tight">
                Disposisi & Persetujuan Perizinan / Fasilitas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchPerizinanData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Segarkan Data DB</span>
            </button>

            <a
              href="/layanan#perizinan"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web Layanan Publik</span>
            </a>
          </div>
        </header>

        {/* CONTAINER ISI */}
        <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* KARTU STATISTIK METRIK KADES */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Perlu Persetujuan Kades</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{countPerluKades}</p>
              <span className="text-[10px] font-bold text-amber-600">Menunggu ACC Kades</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Disetujui Kades</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{countDisetujuiKades}</p>
              <span className="text-[10px] font-bold text-emerald-600">Kembali ke Admin</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Izin Resmi Terbit</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{countTerbitResmi}</p>
              <span className="text-[10px] font-bold text-slate-400">Jadwal Terkunci</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Permohonan</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{countTotal}</p>
              <span className="text-[10px] font-bold text-slate-500">Live Database</span>
            </div>
          </div>

          {/* FILTER BAR DROPDOWNS & SEARCH */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Dropdown Filter Status */}
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-2xs cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentFilterLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl border border-[#E3E8E2] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {statusOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setStatusFilter(opt.id);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                            statusFilter === opt.id ? "bg-emerald-50 text-emerald-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <div className="truncate">
                              <p className="truncate leading-tight">{opt.label}</p>
                              <p className="text-[10px] text-slate-400 font-normal truncate">{opt.desc}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${opt.badgeColor}`}>
                            {opt.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dropdown Filter Kategori */}
              <div className="relative" ref={kategoriDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsKategoriDropdownOpen(!isKategoriDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-2xs cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{kategoriFilter}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isKategoriDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isKategoriDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-2xl border border-[#E3E8E2] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {["Semua Kategori", "Fasilitas Desa", "Izin Kegiatan", "Perizinan Usaha"].map((kat) => (
                      <button
                        key={kat}
                        onClick={() => {
                          setKategoriFilter(kat);
                          setIsKategoriDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                          kategoriFilter === kat ? "bg-emerald-50 text-emerald-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"
                        }`}
                      >
                        <span>{kat}</span>
                        {kategoriFilter === kat && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown Filter RW */}
              <div className="relative" ref={rwDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsRwDropdownOpen(!isRwDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-2xs cursor-pointer"
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
                        onClick={() => {
                          setRwFilter(rw);
                          setIsRwDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                          rwFilter === rw ? "bg-emerald-50 text-emerald-900 font-black" : "text-slate-700 hover:bg-slate-50 font-bold"
                        }`}
                      >
                        <span>{rw}</span>
                        {rwFilter === rw && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input Pencarian */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID resi, nama, kegiatan, lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-700 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* TABEL DATA PERIZINAN KHUSUS KADES */}
          <div className="bg-white rounded-3xl border border-[#E8ECE7] shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-[#F0F2F0] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Daftar Disposisi & Persetujuan Kepala Desa ({filteredList.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Alur SOP: Verifikasi Awal Admin &rarr; Persetujuan / ACC Kepala Desa &rarr; Kembali ke Admin untuk Terbit Izin
                </p>
              </div>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
                Otoritas Kepala Desa
              </span>
            </div>

            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-bold">Memuat berkas perizinan dari database...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Tidak ada permohonan perizinan pada filter ini.</p>
                <p className="text-xs text-slate-400">Silakan ubah tab status atau kata kunci pencarian Anda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#F0F2F0] text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/60">
                      <th className="py-3 px-3">No. Resi & Tgl</th>
                      <th className="py-3 px-3">Jenis Izin & Fasilitas</th>
                      <th className="py-3 px-3">Pemohon & Wilayah</th>
                      <th className="py-3 px-3">Kegiatan & Tanggal</th>
                      <th className="py-3 px-3">Pengantar Admin</th>
                      <th className="py-3 px-3">Status Terkini</th>
                      <th className="py-3 px-4 text-right">Tindakan Kepala Desa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((item) => {
                      const isPendingKades =
                        item.status === "Menunggu Persetujuan Kades" ||
                        item.status === "Diteruskan ke Kepala Desa";
                      const isAccKades = item.status === "Disetujui Kades";
                      const isTerbit = item.status === "Izin Resmi Terbit" || item.status === "Selesai";

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* NO RESI & TGL */}
                          <td className="py-3.5 px-3 align-middle whitespace-nowrap">
                            <span className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                              {item.id}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1.5">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "Hari ini"}</span>
                            </span>
                          </td>

                          {/* JENIS IZIN & FASILITAS */}
                          <td className="py-3.5 px-3 align-middle max-w-[210px]">
                            <p className="font-black text-slate-900 text-xs leading-snug">{item.jenis_perizinan}</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              <span className="inline-block text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {item.kategori}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate" title={item.lokasi_fasilitas}>
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.lokasi_fasilitas}</span>
                            </p>
                          </td>

                          {/* PEMOHON & WILAYAH */}
                          <td className="py-3.5 px-3 align-middle max-w-[180px]">
                            <p className="font-extrabold text-slate-900 text-xs">{item.nama_pemohon}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">NIK: {item.nik_pemohon}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                                {item.rw_pemohon}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">{item.telepon_pemohon}</span>
                            </div>
                          </td>

                          {/* KEGIATAN & TANGGAL */}
                          <td className="py-3.5 px-3 align-middle max-w-[210px]">
                            <p className="font-bold text-slate-800 text-xs line-clamp-1" title={item.nama_kegiatan}>
                              {item.nama_kegiatan}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>
                                {item.tanggal_mulai} {item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai ? `s/d ${item.tanggal_selesai}` : ""}
                              </span>
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-800 transition-colors cursor-pointer"
                              >
                                <Paperclip className="w-2.5 h-2.5" />
                                <span>{item.berkas_urls?.length || 0} Berkas</span>
                              </button>
                            </div>
                          </td>

                          {/* PENGANTAR ADMIN */}
                          <td className="py-3.5 px-3 align-middle max-w-[190px]">
                            {item.catatan_admin ? (
                              <p className="text-[11px] text-slate-600 line-clamp-2 italic leading-relaxed" title={item.catatan_admin}>
                                "{item.catatan_admin}"
                              </p>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Diteruskan staf administrasi</span>
                            )}
                          </td>

                          {/* STATUS TERKINI */}
                          <td className="py-3.5 px-3 align-middle max-w-[180px]">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                isAccKades
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : isPendingKades
                                  ? "bg-amber-100 text-amber-900 border-amber-300"
                                  : isTerbit
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : "bg-slate-100 text-slate-800 border-slate-200"
                              }`}
                            >
                              {isPendingKades && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                              {isAccKades && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                              {item.status}
                            </span>
                            {item.catatan_kades && (
                              <p className="text-[10px] text-emerald-800 font-bold mt-1 line-clamp-1 italic" title={item.catatan_kades}>
                                ACC: "{item.catatan_kades}"
                              </p>
                            )}
                          </td>

                          {/* TINDAKAN KEPALA DESA */}
                          <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {/* Detail Modal Button */}
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Lihat Detail Permohonan"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* JIKA PERLU ACC KADES */}
                              {isPendingKades && (
                                <>
                                  <button
                                    onClick={() => {
                                      setAccModalItem(item);
                                      setAccNote("Disetujui resmi oleh Kepala Desa Sawotratap. Berkas dikembalikan ke Admin Seksi Pemerintahan untuk penerbitan izin resmi.");
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white font-black text-xs shadow-xs cursor-pointer transition-all"
                                    title="Setujui permohonan dan kembalikan ke Admin"
                                  >
                                    <Stamp className="w-3.5 h-3.5 text-[#C5D82F]" />
                                    <span>Beri ACC & Kembalikan</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setRejectModalItem(item);
                                      setRejectReason("");
                                    }}
                                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                                    title="Tolak Permohonan"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {/* JIKA SUDAH DISETUJUI KADES */}
                              {isAccKades && (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Telah Di-ACC (Di Admin)</span>
                                </span>
                              )}

                              {/* JIKA IZIN RESMI SUDAH TERBIT OLEH ADMIN */}
                              {isTerbit && (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Izin Resmi Terbit</span>
                                </span>
                              )}
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

      {/* ========================================================================= */}
      {/* MODAL 1: DETAIL LENGKAP PERMOHONAN                                        */}
      {/* ========================================================================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E3E8E2] max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Detail Permohonan {selectedItem.id}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedItem.jenis_perizinan}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Box Pemohon */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Identitas Penanggung Jawab</span>
                <div className="grid grid-cols-2 gap-2 text-slate-800 font-medium">
                  <div>Nama: <strong>{selectedItem.nama_pemohon}</strong></div>
                  <div>NIK: <span className="font-mono">{selectedItem.nik_pemohon}</span></div>
                  <div>No. WhatsApp: <span className="font-mono">{selectedItem.telepon_pemohon}</span></div>
                  <div>Domisili: <strong className="text-emerald-800">{selectedItem.rw_pemohon}</strong></div>
                </div>
              </div>

              {/* Box Kegiatan */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Rincian Acara & Fasilitas</span>
                <div className="space-y-1.5 text-slate-800 font-medium">
                  <div>Nama Acara: <strong>{selectedItem.nama_kegiatan}</strong></div>
                  <div>Lokasi Fasilitas: <span>{selectedItem.lokasi_fasilitas}</span></div>
                  <div>Tanggal: <strong>{selectedItem.tanggal_mulai} {selectedItem.tanggal_selesai && selectedItem.tanggal_selesai !== selectedItem.tanggal_mulai ? `s/d ${selectedItem.tanggal_selesai}` : ""}</strong></div>
                  <div>Waktu: <span>{selectedItem.waktu_kegiatan}</span></div>
                  <div>Estimasi Peserta: <span>{selectedItem.jumlah_peserta}</span></div>
                  {selectedItem.keterangan && (
                    <div className="pt-1 text-slate-600 italic">Keterangan: "{selectedItem.keterangan}"</div>
                  )}
                </div>
              </div>

              {/* Berkas Lampiran */}
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Berkas Pendukung ({selectedItem.berkas_urls?.length || 0})
                </span>
                {selectedItem.berkas_urls && selectedItem.berkas_urls.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedItem.berkas_urls.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate font-bold text-slate-700">{file.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 ml-auto shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Tidak ada lampiran berkas yang diunggah.</p>
                )}
              </div>

              {/* Catatan Alur SOP */}
              {(selectedItem.catatan_admin || selectedItem.catatan_kades || selectedItem.catatan_petugas) && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 text-xs">
                  <span className="font-black text-[10px] uppercase tracking-wider text-amber-900">Catatan Riwayat Verifikasi:</span>
                  {selectedItem.catatan_admin && <p>Admin Pengantar: {selectedItem.catatan_admin}</p>}
                  {selectedItem.catatan_kades && <p>Kepala Desa: {selectedItem.catatan_kades}</p>}
                  {selectedItem.catatan_petugas && <p>Status Info: {selectedItem.catatan_petugas}</p>}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Tutup Detail
              </button>

              {(selectedItem.status === "Menunggu Persetujuan Kades" || selectedItem.status === "Diteruskan ke Kepala Desa") && (
                <button
                  type="button"
                  onClick={() => {
                    const item = selectedItem;
                    setSelectedItem(null);
                    setAccModalItem(item);
                    setAccNote("Disetujui resmi oleh Kepala Desa Sawotratap. Berkas dikembalikan ke Admin Seksi Pemerintahan untuk penerbitan izin resmi.");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  <Stamp className="w-3.5 h-3.5 text-[#C5D82F]" />
                  <span>Beri ACC & Kembalikan ke Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ACC KEPALA DESA & KEMBALIKAN KE ADMIN                             */}
      {/* ========================================================================= */}
      {accModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E3E8E2] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
                <Stamp className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Disposisi & Persetujuan Kepala Desa</h3>
                <p className="text-xs text-slate-500 font-medium">Permohonan: {accModalItem.id}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmAccKades} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p>Pemohon: <strong>{accModalItem.nama_pemohon}</strong> ({accModalItem.rw_pemohon})</p>
                <p>Jenis Izin: <strong>{accModalItem.jenis_perizinan}</strong></p>
                <p>Kegiatan: <strong>{accModalItem.nama_kegiatan}</strong></p>
                <p>Jadwal: <span>{accModalItem.tanggal_mulai}</span> ({accModalItem.waktu_kegiatan})</p>
                {accModalItem.catatan_admin && (
                  <p className="pt-1 text-slate-600 border-t border-slate-200/60 mt-1 italic">
                    Pengantar Admin: "{accModalItem.catatan_admin}"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Arahan / Lembar Disposisi Kepala Desa *
                </label>
                <textarea
                  rows={3}
                  required
                  value={accNote}
                  onChange={(e) => setAccNote(e.target.value)}
                  placeholder="Tuliskan arahan dan persetujuan resmi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-[11px] leading-relaxed">
                <strong>Alur Otomatis:</strong> Setelah Kepala Desa memberi ACC, status permohonan akan menjadi <strong>Disetujui Kades</strong> dan otomatis kembali ke loket Admin Desa untuk diterbitkan surat izin resminya.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAccModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAccing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white font-black shadow-xs cursor-pointer"
                >
                  {isAccing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5D82F]" />
                  ) : (
                    <Stamp className="w-4 h-4 text-[#C5D82F]" />
                  )}
                  <span>Beri ACC & Kembalikan ke Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TOLAK PERMOHONAN OLEH KEPALA DESA                                */}
      {/* ========================================================================= */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E3E8E2] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Tolak Permohonan Perizinan</h3>
                <p className="text-xs text-slate-500 font-medium">Permohonan: {rejectModalItem.id}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmRejectKades} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p>Pemohon: <strong>{rejectModalItem.nama_pemohon}</strong></p>
                <p>Kegiatan: <strong>{rejectModalItem.nama_kegiatan}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan Penolakan Kepala Desa *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Jelaskan alasan penolakan secara jelas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-rose-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isRejecting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-xs cursor-pointer"
                >
                  {isRejecting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <X className="w-4 h-4 text-white" />
                  )}
                  <span>Tolak Permohonan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUKSES LOTTIE */}
      {successPopup && (
        <LottieSuccessModal
          isOpen={successPopup.isOpen}
          onClose={() => setSuccessPopup(null)}
          title={successPopup.title}
          message={successPopup.message}
        />
      )}
    </div>
  );
}
