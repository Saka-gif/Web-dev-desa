"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  Building2,
  PieChart,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Check,
  Layers,
  MapPin,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import AdminSidebar from "@/app/components/admin-sidebar";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";
import { ApbdRingkasan, ProgramDesa } from "@/app/components/apbd-section";

const KATEGORI_OPTIONS = [
  "Infrastruktur",
  "Pemberdayaan",
  "Kesehatan",
  "Pemerintahan",
  "Lingkungan",
];

const KATEGORI_COLORS: Record<string, string> = {
  Infrastruktur: "bg-blue-50 text-blue-800 border-blue-200",
  Pemberdayaan: "bg-amber-50 text-amber-800 border-amber-200",
  Kesehatan: "bg-rose-50 text-rose-800 border-rose-200",
  Pemerintahan: "bg-purple-50 text-purple-800 border-purple-200",
  Lingkungan: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export default function AdminApbdManagementPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data State dari Database
  const [ringkasan, setRingkasan] = useState<ApbdRingkasan>({
    id: "2026",
    tahun: "2026",
    total_pagu: "Rp 2.85 M",
    realisasi_dana: "Rp 2.62 M",
    persen_penyerapan: "91.9%",
    alokasi_fisik: "Rp 1.25 M",
    surplus_kas: "Rp 230 Jt",
    status_verifikasi: "Terverifikasi Resmi BPD",
  });
  const [programList, setProgramList] = useState<ProgramDesa[]>([]);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"semua" | "selesai" | "proses">("semua");

  // Modal Ringkasan APBD
  const [isRingkasanModalOpen, setIsRingkasanModalOpen] = useState(false);
  const [formRingkasan, setFormRingkasan] = useState<ApbdRingkasan>(ringkasan);
  const [isSavingRingkasan, setIsSavingRingkasan] = useState(false);

  // Modal Tambah / Edit Program
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [programMode, setProgramMode] = useState<"add" | "edit">("add");
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [formProgram, setFormProgram] = useState<{
    id?: string;
    nama: string;
    kategori: string;
    anggaran: string;
    status: string;
    progres: number;
    lokasi: string;
    keterangan: string;
  }>({
    nama: "",
    kategori: "Infrastruktur",
    anggaran: "",
    status: "proses",
    progres: 0,
    lokasi: "RW 01",
    keterangan: "",
  });

  // Modal Konfirmasi Hapus
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    nama: string;
  }>({
    isOpen: false,
    id: "",
    nama: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal Sukses
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Fetch Data Asli dari DB
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/apbd");
      const json = await res.json();
      if (json.success) {
        if (json.ringkasan) {
          setRingkasan(json.ringkasan);
          setFormRingkasan(json.ringkasan);
        }
        if (Array.isArray(json.program)) {
          setProgramList(json.program);
        }
      }
    } catch (err) {
      console.warn("Gagal memuat APBD dari server:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Simpan Ringkasan APBD
  const handleSaveRingkasan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRingkasan(true);
    try {
      const res = await fetch("/api/admin/apbd", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "ringkasan",
          data: formRingkasan,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsRingkasanModalOpen(false);
        setRingkasan(formRingkasan);
        setSuccessModalData({
          isOpen: true,
          title: "Ringkasan Pagu Diperbarui!",
          message: "Total pagu, realisasi belanja, dan surplus kas telah berhasil diperbarui dan disinkronkan ke website.",
        });
        fetchData();
      } else {
        alert("Gagal menyimpan ringkasan: " + json.message);
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSavingRingkasan(false);
    }
  };

  // Buka Modal Tambah Program
  const handleOpenAddProgram = () => {
    setProgramMode("add");
    setFormProgram({
      nama: "",
      kategori: "Infrastruktur",
      anggaran: "",
      status: "proses",
      progres: 0,
      lokasi: "Wilayah Desa Sawotratap",
      keterangan: "",
    });
    setIsProgramModalOpen(true);
  };

  // Buka Modal Edit Program
  const handleOpenEditProgram = (item: ProgramDesa) => {
    setProgramMode("edit");
    setFormProgram({
      id: item.id,
      nama: item.nama,
      kategori: item.kategori,
      anggaran: item.anggaran,
      status: item.status,
      progres: item.progres,
      lokasi: item.lokasi || "Desa Sawotratap",
      keterangan: item.keterangan || "",
    });
    setIsProgramModalOpen(true);
  };

  // Simpan Program (Add / Edit)
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProgram(true);

    try {
      const isComplete = formProgram.progres >= 100;
      const finalPayload = {
        ...formProgram,
        status: isComplete ? "selesai" : formProgram.status,
      };

      let res;
      if (programMode === "add") {
        res = await fetch("/api/admin/apbd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        });
      } else {
        res = await fetch("/api/admin/apbd", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target: "program",
            id: formProgram.id,
            data: finalPayload,
          }),
        });
      }

      const json = await res.json();
      if (json.success) {
        setIsProgramModalOpen(false);
        setSuccessModalData({
          isOpen: true,
          title: programMode === "add" ? "Program Anggaran Ditambahkan!" : "Program Berhasil Diperbarui!",
          message:
            programMode === "add"
              ? `Program "${formProgram.nama}" telah berhasil dicatat ke dalam APBD desa dan langsung tampil di landing page.`
              : `Informasi kegiatan "${formProgram.nama}" berhasil diperbarui.`,
        });
        fetchData();
      } else {
        alert("Gagal menyimpan: " + json.message);
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSavingProgram(false);
    }
  };

  // Hapus Program
  const handleDeleteProgram = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/apbd?id=${deleteModal.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteModal({ isOpen: false, id: "", nama: "" });
        setSuccessModalData({
          isOpen: true,
          title: "Program Berhasil Dihapus",
          message: "Data kegiatan anggaran telah dihapus dari database APBD desa.",
        });
        fetchData();
      } else {
        console.error("Gagal menghapus program:", json.message);
      }
    } catch (err: any) {
      console.error("Terjadi kesalahan:", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Action: Tandai Selesai 100% Langsung
  const handleQuickMarkDone = async (item: ProgramDesa) => {
    try {
      const res = await fetch("/api/admin/apbd", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "program",
          id: item.id,
          data: {
            progres: 100,
            status: "selesai",
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
      }
    } catch (err) {
      console.warn("Gagal update cepat:", err);
    }
  };

  // Filter Program
  const q = searchQuery.toLowerCase().trim();
  const filteredProgram = programList.filter((p) => {
    const matchSearch =
      !q ||
      p.nama.toLowerCase().includes(q) ||
      p.anggaran.toLowerCase().includes(q) ||
      p.kategori.toLowerCase().includes(q) ||
      (p.lokasi && p.lokasi.toLowerCase().includes(q));
    const matchKategori = kategoriFilter === "Semua" || p.kategori.toLowerCase() === kategoriFilter.toLowerCase();
    const matchStatus = statusFilter === "semua" || p.status === statusFilter;
    return matchSearch && matchKategori && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex font-sans antialiased">
      {/* 1. SIDEBAR ADMIN RESMI */}
      <AdminSidebar
        activeItem="apbd"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. KONTEN UTAMA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* HEADER TOPBAR */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E3E8E2] px-4 sm:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-black shadow-sm shrink-0">
                <Coins className="w-5 h-5 text-[#C5D82F]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                    Transparansi APBD & Belanja Desa
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#064E3B] border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Supabase DB Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Pengelolaan pagu anggaran, realisasi serapan, dan rincian program pembangunan Desa Sawotratap.
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Segarkan Data</span>
              </button>

              <a
                href="/#apbd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Web Publik</span>
              </a>

              <button
                type="button"
                onClick={handleOpenAddProgram}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-black transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C5D82F]" />
                <span>Tambah Anggaran Baru</span>
              </button>
            </div>
          </div>
        </header>

        {/* BODY MAIN */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          {/* ========================================================= */}
          {/* WIDGET RINGKASAN PAGU APBD (BISA DI-QUICK EDIT)           */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-[#E3E8E2] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    Ringkasan Pagu Anggaran Desa ({ringkasan.tahun})
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    Status: <strong className="text-emerald-700 font-bold">{ringkasan.status_verifikasi}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormRingkasan(ringkasan);
                  setIsRingkasanModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#064E3B] text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Ringkasan Pagu</span>
              </button>
            </div>

            {/* 4 STAT KARTU RINGKASAN */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#06261D] text-white space-y-1">
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  Total Pagu APBD
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#C5D82F]">
                  {ringkasan.total_pagu}
                </div>
                <div className="text-[10px] text-slate-300 font-medium">Ketetapan APBDes {ringkasan.tahun}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Realisasi Pengeluaran
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {ringkasan.realisasi_dana}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Serapan: {ringkasan.persen_penyerapan}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Alokasi Fisik & Prasarana
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {ringkasan.alokasi_fisik}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Infrastruktur dan Fasilitas</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Surplus / Sisa Kas
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-800">
                  {ringkasan.surplus_kas}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Cadangan Kas & Silva Desa</div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TABEL PROGRAM PENGELUARAN & ANGGARAN                     */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Daftar Alokasi Program & Belanja Desa</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                    {filteredProgram.length} Kegiatan
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Rincian proyek pembangunan fisik, pemberdayaan warga, dan belanja operasional desa.
                </p>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari program / lokasi..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#064E3B] shadow-xs"
                  />
                </div>

                {/* Filter Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#064E3B] shadow-xs cursor-pointer"
                >
                  <option value="semua">Semua Status</option>
                  <option value="selesai">Selesai (100%)</option>
                  <option value="proses">Dalam Pengerjaan</option>
                </select>

                {/* Filter Kategori */}
                <select
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#064E3B] shadow-xs cursor-pointer"
                >
                  <option value="Semua">Semua Kategori</option>
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* TABEL LIST PROGRAM */}
            <div className="bg-white rounded-3xl border border-[#E3E8E2] overflow-hidden shadow-xs">
              {isLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#064E3B] mb-3" />
                  <p className="text-xs font-bold text-slate-600">Memuat data alokasi APBD dari database...</p>
                </div>
              ) : filteredProgram.length === 0 ? (
                <div className="p-12 text-center">
                  <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-black text-slate-800">Tidak ada program ditemukan</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Silakan sesuaikan kata kunci pencarian atau tambah program anggaran baru.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-6">Nama Kegiatan & Lokasi</th>
                        <th className="py-3 px-6">Kategori</th>
                        <th className="py-3 px-6">Anggaran / Biaya</th>
                        <th className="py-3 px-6">Progres Pengerjaan</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6 text-right">Tindakan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProgram.map((item) => {
                        const isSelesai = item.status === "selesai" || item.progres >= 100;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Nama & Lokasi */}
                            <td className="py-4 px-6 font-bold text-slate-900 max-w-xs">
                              <div className="text-sm font-black leading-snug">{item.nama}</div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{item.lokasi || "Sawotratap"}</span>
                              </div>
                              {item.keterangan && (
                                <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                                  {item.keterangan}
                                </p>
                              )}
                            </td>

                            {/* Kategori */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${KATEGORI_COLORS[item.kategori] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                                {item.kategori}
                              </span>
                            </td>

                            {/* Anggaran */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className="text-sm font-black text-[#064E3B]">
                                {item.anggaran}
                              </span>
                            </td>

                            {/* Progres Bar */}
                            <td className="py-4 px-6 whitespace-nowrap min-w-[140px]">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                                  <span>{item.progres}%</span>
                                  {item.progres < 100 && (
                                    <button
                                      type="button"
                                      onClick={() => handleQuickMarkDone(item)}
                                      className="text-emerald-700 hover:text-emerald-800 text-[10px] font-bold cursor-pointer"
                                      title="Tandai selesai 100%"
                                    >
                                      ✓ Set Selesai
                                    </button>
                                  )}
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isSelesai ? "bg-emerald-600" : "bg-amber-500"
                                    }`}
                                    style={{ width: `${item.progres}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              {isSelesai ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Selesai 100%</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>Pengerjaan</span>
                                </span>
                              )}
                            </td>

                            {/* Tindakan */}
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProgram(item)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteModal({ isOpen: true, id: item.id, nama: item.nama })}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: EDIT RINGKASAN PAGU APBD                         */}
      {/* ========================================================= */}
      {isRingkasanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Edit Ringkasan Pagu APBD {formRingkasan.tahun}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Nilai ini akan tampil pada kartu utama di halaman publik.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRingkasanModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRingkasan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Total Pagu APBD *</label>
                  <input
                    type="text"
                    required
                    value={formRingkasan.total_pagu}
                    onChange={(e) => setFormRingkasan({ ...formRingkasan, total_pagu: e.target.value })}
                    placeholder="Contoh: Rp 2.85 M"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Realisasi Dana *</label>
                  <input
                    type="text"
                    required
                    value={formRingkasan.realisasi_dana}
                    onChange={(e) => setFormRingkasan({ ...formRingkasan, realisasi_dana: e.target.value })}
                    placeholder="Contoh: Rp 2.62 M"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Persentase Serapan *</label>
                  <input
                    type="text"
                    required
                    value={formRingkasan.persen_penyerapan}
                    onChange={(e) => setFormRingkasan({ ...formRingkasan, persen_penyerapan: e.target.value })}
                    placeholder="Contoh: 91.9%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alokasi Fisik & Pembangunan</label>
                  <input
                    type="text"
                    value={formRingkasan.alokasi_fisik}
                    onChange={(e) => setFormRingkasan({ ...formRingkasan, alokasi_fisik: e.target.value })}
                    placeholder="Contoh: Rp 1.25 M"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Surplus / Sisa Kas</label>
                  <input
                    type="text"
                    value={formRingkasan.surplus_kas}
                    onChange={(e) => setFormRingkasan({ ...formRingkasan, surplus_kas: e.target.value })}
                    placeholder="Contoh: Rp 230 Jt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status Pengesahan</label>
                  <input
                    type="text"
                    value={formRingkasan.status_verifikasi}
                    onChange={(e) => setFormRingkasan({ ...formRingkasan, status_verifikasi: e.target.value })}
                    placeholder="Contoh: Terverifikasi Resmi BPD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRingkasanModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingRingkasan}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSavingRingkasan ? "Menyimpan..." : "Simpan Perubahan Pagu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TAMBAH / EDIT PROGRAM ANGGARAN (SUPER PRAKTIS)   */}
      {/* ========================================================= */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {programMode === "add" ? "Tambah Program Anggaran / Pengeluaran" : "Edit Program Anggaran"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Isi detail kegiatan belanja yang akan dipublikasikan secara transparan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProgramModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Program Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={formProgram.nama}
                  onChange={(e) => setFormProgram({ ...formProgram, nama: e.target.value })}
                  placeholder="Contoh: Betonisasi Jalan Usaha Tani RW 04"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori Bidang *</label>
                  <select
                    value={formProgram.kategori}
                    onChange={(e) => setFormProgram({ ...formProgram, kategori: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B] cursor-pointer"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Jumlah Anggaran / Biaya *</label>
                  <input
                    type="text"
                    required
                    value={formProgram.anggaran}
                    onChange={(e) => setFormProgram({ ...formProgram, anggaran: e.target.value })}
                    placeholder="Contoh: Rp 320 Juta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Progres Pengerjaan (%)</label>
                    <span className="text-xs font-black text-[#064E3B]">{formProgram.progres}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formProgram.progres}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setFormProgram({
                        ...formProgram,
                        progres: p,
                        status: p >= 100 ? "selesai" : "proses",
                      });
                    }}
                    className="w-full accent-[#064E3B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>0% (Rencana)</span>
                    <span>50% (Sedang Jalan)</span>
                    <span>100% (Selesai)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={formProgram.lokasi}
                    onChange={(e) => setFormProgram({ ...formProgram, lokasi: e.target.value })}
                    placeholder="Contoh: RW 02 & RW 07"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Keterangan / Rincian Singkat</label>
                <textarea
                  rows={3}
                  value={formProgram.keterangan}
                  onChange={(e) => setFormProgram({ ...formProgram, keterangan: e.target.value })}
                  placeholder="Contoh: Pengerukan lumpur, pemasangan drainase U-Ditch beton kualitas K-350..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProgram}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSavingProgram ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#C5D82F]" />
                      <span>{programMode === "add" ? "Tambah ke APBD" : "Simpan Perubahan"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS PROGRAM (CUSTOM POPUP)          */}
      {/* ========================================================= */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Hapus Program Anggaran?"
        message="Apakah Anda yakin ingin menghapus kegiatan pembangunan berikut dari ketetapan APBD desa? Tindakan ini tidak dapat dibatalkan."
        itemName={deleteModal.nama}
        confirmText="Ya, Hapus Program"
        isLoading={isDeleting}
        onConfirm={handleDeleteProgram}
        onCancel={() => setDeleteModal({ isOpen: false, id: "", nama: "" })}
      />

      {/* MODAL SUKSES */}
      <LottieSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData({ ...successModalData, isOpen: false })}
        title={successModalData.title}
        message={successModalData.message}
      />
    </div>
  );
}
