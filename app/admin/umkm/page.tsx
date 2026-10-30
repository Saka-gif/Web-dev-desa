"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Store,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Layers,
  MapPin,
  Menu,
  X,
  Eye,
  RefreshCw,
  Check,
  AlertTriangle,
  Send,
  Phone,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Star,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import AdminSidebar from "@/app/components/admin-sidebar";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";
import { UmkmItem } from "@/app/data/umkm";

export default function AdminUmkmManagementPage() {
  const [umkmList, setUmkmList] = useState<UmkmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<"semua" | "menunggu" | "disetujui" | "ditolak">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [rwFilter, setRwFilter] = useState("Semua RW");
  const [kategoriFilter, setKategoriFilter] = useState("Semua Kategori");

  // Dropdown Filter States
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

  // Modal States
  const [detailItem, setDetailItem] = useState<UmkmItem | null>(null);
  const [accModalItem, setAccModalItem] = useState<UmkmItem | null>(null);
  const [accNote, setAccNote] = useState("");
  const [isUnggulan, setIsUnggulan] = useState(false);
  const [isProcessingAcc, setIsProcessingAcc] = useState(false);

  const [rejectModalItem, setRejectModalItem] = useState<UmkmItem | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [isProcessingReject, setIsProcessingReject] = useState(false);

  // Success Modal
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    ticketId: string;
    actionType: "acc" | "tolak";
  }>({
    isOpen: false,
    title: "",
    description: "",
    ticketId: "",
    actionType: "acc",
  });

  // Fetch Semua Data UMKM (termasuk yang menunggu dan ditolak)
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
      console.warn("Gagal fetch data UMKM admin:", err);
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

  // Statistik Cepat
  const stats = {
    total: umkmList.length,
    menunggu: umkmList.filter((u) => u.status === "menunggu" || !u.status).length,
    disetujui: umkmList.filter((u) => u.status === "disetujui").length,
    ditolak: umkmList.filter((u) => u.status === "ditolak").length,
  };

  // Filter Data
  const filteredList = umkmList.filter((item) => {
    // 1. Status Filter
    if (statusFilter !== "semua") {
      const currentSt = item.status || "menunggu";
      if (currentSt !== statusFilter) return false;
    }

    // 2. RW Filter
    if (rwFilter !== "Semua RW") {
      if (item.rw !== rwFilter) return false;
    }

    // 3. Kategori Filter
    if (kategoriFilter !== "Semua Kategori") {
      if (item.kategori?.toLowerCase() !== kategoriFilter.toLowerCase()) return false;
    }

    // 4. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNama = item.nama?.toLowerCase().includes(q);
      const matchPemilik = item.pemilik?.toLowerCase().includes(q);
      const matchNik = item.nik_pemilik?.includes(q);
      const matchDeskripsi = item.deskripsi_singkat?.toLowerCase().includes(q) || item.deskripsi?.toLowerCase().includes(q);
      const matchLokasi = item.lokasi?.toLowerCase().includes(q);
      return matchNama || matchPemilik || matchNik || matchDeskripsi || matchLokasi;
    }

    return true;
  });

  // Handler Buka Modal ACC
  const handleOpenAcc = (item: UmkmItem) => {
    setAccModalItem(item);
    setAccNote("Produk legalitas terverifikasi lengkap. Telah disetujui tampil di etalase web desa.");
    setIsUnggulan(Boolean(item.is_unggulan));
  };

  // Eksekusi ACC / Setujui Produk UMKM
  const handleExecuteAcc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accModalItem) return;

    try {
      setIsProcessingAcc(true);
      const res = await fetch("/api/umkm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: accModalItem.id,
          status: "disetujui",
          catatan_admin: accNote.trim() || "Produk telah disetujui tampil di etalase web desa.",
          is_unggulan: isUnggulan,
        }),
      });

      const json = await res.json();
      if (json.success) {
        // Emit sinkronisasi badge sidebar
        window.dispatchEvent(new CustomEvent("admin-data-updated"));

        setSuccessModalData({
          isOpen: true,
          title: "Produk UMKM Berhasil di-ACC!",
          description: `Produk "${accModalItem.nama}" milik ${accModalItem.pemilik} kini telah aktif dan resmi tampil di etalase website Desa Sawotratap.`,
          ticketId: accModalItem.id,
          actionType: "acc",
        });

        setAccModalItem(null);
        fetchUmkmData();
      } else {
        alert(json.message || "Gagal menyetujui produk UMKM.");
      }
    } catch (err: any) {
      console.error("Gagal ACC UMKM:", err);
      alert("Terjadi kesalahan saat memproses persetujuan.");
    } finally {
      setIsProcessingAcc(false);
    }
  };

  // Handler Buka Modal Tolak
  const handleOpenReject = (item: UmkmItem) => {
    setRejectModalItem(item);
    setRejectNote("Foto produk kurang jelas / informasi legalitas usaha belum memenuhi ketentuan kurasi desa.");
  };

  // Eksekusi Tolak Produk UMKM
  const handleExecuteReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    try {
      setIsProcessingReject(true);
      const res = await fetch("/api/umkm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectModalItem.id,
          status: "ditolak",
          catatan_admin: rejectNote.trim() || "Pendaftaran produk belum memenuhi ketentuan kurasi desa.",
          is_unggulan: false,
        }),
      });

      const json = await res.json();
      if (json.success) {
        window.dispatchEvent(new CustomEvent("admin-data-updated"));

        setSuccessModalData({
          isOpen: true,
          title: "Pendaftaran UMKM Ditolak",
          description: `Produk "${rejectModalItem.nama}" telah ditolak. Catatan perbaikan dapat dilihat oleh pemilik di portal UMKM Saya.`,
          ticketId: rejectModalItem.id,
          actionType: "tolak",
        });

        setRejectModalItem(null);
        fetchUmkmData();
      } else {
        alert(json.message || "Gagal menolak produk UMKM.");
      }
    } catch (err: any) {
      console.error("Gagal Tolak UMKM:", err);
      alert("Terjadi kesalahan saat memproses penolakan.");
    } finally {
      setIsProcessingReject(false);
    }
  };

  // Delete Produk UMKM
  const [deleteProductItem, setDeleteProductItem] = useState<UmkmItem | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const handleDeleteProduct = async () => {
    if (!deleteProductItem) return;
    setIsDeletingProduct(true);
    try {
      const res = await fetch(`/api/umkm?id=${deleteProductItem.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        window.dispatchEvent(new CustomEvent("admin-data-updated"));
        setSuccessModalData({
          isOpen: true,
          title: "Produk Berhasil Dihapus",
          description: `Produk "${deleteProductItem.nama}" milik ${deleteProductItem.pemilik} telah dihapus dari sistem desa.`,
          ticketId: deleteProductItem.id,
          actionType: "tolak",
        });
        setDeleteProductItem(null);
        fetchUmkmData();
      } else {
        console.error("Gagal menghapus produk:", json.message);
      }
    } catch (err: any) {
      console.error("Terjadi kesalahan:", err.message);
    } finally {
      setIsDeletingProduct(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-slate-800 font-sans selection:bg-[#C5D82F]/30 selection:text-[#064E3B]">
      {/* SIDEBAR ADMIN RESMI */}
      <AdminSidebar
        activeItem="umkm"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        badgeUmkm={stats.menunggu > 0 ? `${stats.menunggu} Verif` : "Kelola"}
      />

      {/* KONTEN UTAMA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* HEADER ATAS */}
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
                <span>Portal Admin Balai Desa</span>
                <span>/</span>
                <span className="text-[#064E3B] font-bold">Kurasi & ACC UMKM</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Kurasi & ACC Produk UMKM Warga</span>
                {stats.menunggu > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    {stats.menunggu} Perlu ACC
                  </span>
                )}
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
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* 4 STAT CARDS KONSISTEN */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Total Produk */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Total Produk Warga</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.total}</p>
              </div>
            </div>

            {/* Card 2: Menunggu ACC */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-300/80 bg-amber-50/20 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-amber-800 font-bold">Menunggu ACC Admin</p>
                <p className="text-xl sm:text-2xl font-black text-amber-900">{stats.menunggu}</p>
              </div>
            </div>

            {/* Card 3: Disetujui (Aktif di Web) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-300/80 bg-emerald-50/20 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-emerald-800 font-bold">Disetujui (Aktif di Web)</p>
                <p className="text-xl sm:text-2xl font-black text-[#064E3B]">{stats.disetujui}</p>
              </div>
            </div>

            {/* Card 4: Ditolak */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Ditolak / Revisi</p>
                <p className="text-xl sm:text-2xl font-black text-rose-700">{stats.ditolak}</p>
              </div>
            </div>
          </div>

          {/* BAR FILTER & SEARCH */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Tab Filter Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setStatusFilter("semua")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === "semua"
                    ? "bg-[#064E3B] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("menunggu")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "menunggu"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu ACC ({stats.menunggu})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("disetujui")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "disetujui"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Disetujui ({stats.disetujui})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("ditolak")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "ditolak"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-rose-50 text-rose-800 hover:bg-rose-100"
                }`}
              >
                <span>Ditolak ({stats.ditolak})</span>
              </button>
            </div>

            {/* Filter Kategori & RW & Search */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Dropdown Kategori */}
              <div className="relative" ref={kategoriDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsKategoriDropdownOpen(!isKategoriDropdownOpen)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{kategoriFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {isKategoriDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95">
                    {["Semua Kategori", "Kuliner", "Kerajinan", "Fashion", "Pertanian", "Jasa"].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setKategoriFilter(k);
                          setIsKategoriDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${
                          kategoriFilter === k ? "text-[#064E3B] font-bold bg-emerald-50/60" : "text-slate-700"
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown RW */}
              <div className="relative" ref={rwDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsRwDropdownOpen(!isRwDropdownOpen)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{rwFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {isRwDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95">
                    {["Semua RW", "RW 01", "RW 02", "RW 03", "RW 04", "RW 05", "RW 06", "RW 07", "RW 08"].map((rw) => (
                      <button
                        key={rw}
                        type="button"
                        onClick={() => {
                          setRwFilter(rw);
                          setIsRwDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${
                          rwFilter === rw ? "text-[#064E3B] font-bold bg-emerald-50/60" : "text-slate-700"
                        }`}
                      >
                        {rw}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Search */}
              <div className="relative min-w-[200px] flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari produk / pemilik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#064E3B] focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABEL DATA UMKM */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Produk & Usaha</th>
                    <th className="py-3 px-4">Pemilik & Domisili</th>
                    <th className="py-3 px-4">Harga & Jam Buka</th>
                    <th className="py-3 px-4">Kontak WhatsApp</th>
                    <th className="py-3 px-4">Status ACC</th>
                    <th className="py-3 px-4 text-center">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-500">
                        <div className="w-8 h-8 rounded-full border-2 border-emerald-600/20 border-t-emerald-600 animate-spin mx-auto mb-2" />
                        <span className="font-semibold text-xs">Memuat katalog UMKM warga...</span>
                      </td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-500">
                        <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-700">Tidak ada data UMKM yang cocok</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Coba ubah kata kunci atau filter status Anda.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item) => {
                      const isApproved = item.status === "disetujui";
                      const isPending = item.status === "menunggu" || !item.status;
                      const isRejected = item.status === "ditolak";

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isPending ? "bg-amber-50/20" : ""
                          }`}
                        >
                          {/* Produk & Usaha */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img
                                  src={item.foto || "/aset/umkm-desa.jpg"}
                                  alt={item.nama}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/aset/umkm-desa.jpg";
                                  }}
                                />
                              </div>
                              <div className="max-w-[200px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900 truncate hover:text-emerald-800 transition-colors">
                                    {item.nama}
                                  </span>
                                  {item.is_unggulan && (
                                    <span className="p-0.5 rounded bg-amber-100 text-amber-800" title="Produk Unggulan">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                    </span>
                                  )}
                                </div>
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {item.kategori || "Kuliner"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Pemilik & Domisili */}
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{item.pemilik}</p>
                            <p className="text-[11px] text-slate-500">
                              {item.rw || "RW 03"} {item.nik_pemilik ? `• ${item.nik_pemilik.slice(0, 6)}...` : ""}
                            </p>
                          </td>

                          {/* Harga & Jam Buka */}
                          <td className="py-3.5 px-4">
                            <p className="font-black text-[#064E3B]">{item.harga || "Hubungi Penjual"}</p>
                            <p className="text-[11px] text-slate-500">{item.jam_operasional || "08.00 - 20.00 WIB"}</p>
                          </td>

                          {/* Kontak WA */}
                          <td className="py-3.5 px-4">
                            <a
                              href={`https://wa.me/${(item.kontak_wa || item.kontak || "6281234567801").replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-[11px] font-bold transition-colors"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>+{item.kontak_wa || item.kontak || "-"}</span>
                            </a>
                          </td>

                          {/* Status ACC */}
                          <td className="py-3.5 px-4">
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Disetujui (Tayang)</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                                <Clock className="w-3 h-3" />
                                <span>Menunggu ACC</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                                <span>Ditolak / Revisi</span>
                              </span>
                            )}
                          </td>

                          {/* Tindakan Admin */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Tombol Detail */}
                              <button
                                type="button"
                                onClick={() => setDetailItem(item)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                title="Lihat Detail Produk"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Tombol ACC (Bila Menunggu atau Ditolak) */}
                              {(!isApproved || isPending) && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenAcc(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#064E3B] hover:bg-[#085a44] text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
                                  title="Setujui Produk & Tayangkan"
                                >
                                  <ThumbsUp className="w-3 h-3 text-[#C5D82F]" />
                                  <span>ACC Produk</span>
                                </button>
                              )}

                              {/* Tombol Tolak (Bila Menunggu atau Disetujui) */}
                              {!isRejected && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenReject(item)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
                                  title="Tolak / Minta Revisi"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Tombol Hapus Produk */}
                              <button
                                type="button"
                                onClick={() => setDeleteProductItem(item)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                title="Hapus Produk dari Sistem"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL DETAIL PRODUK                                      */}
      {/* ======================================================== */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Detail Produk UMKM
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{detailItem.nama}</h3>
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
            </div>

            {/* Rincian Usaha */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Pemilik Usaha:</span>
                <span className="font-bold text-slate-900">{detailItem.pemilik}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NIK KTP:</span>
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
                <span className="text-slate-400 block text-[10px]">Lokasi / Alamat:</span>
                <span className="text-slate-700 font-medium">{detailItem.alamat_lengkap || detailItem.lokasi}</span>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <span className="text-[10px] font-bold uppercase text-slate-400">Deskripsi Produk:</span>
              <p className="leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                {detailItem.deskripsi_lengkap || detailItem.deskripsi_singkat || detailItem.deskripsi || "Tidak ada deskripsi tambahan."}
              </p>
            </div>

            {/* Catatan Verifikasi Admin Jika Ada */}
            {detailItem.catatan_admin && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-0.5">
                <span className="font-bold text-[10px]">Catatan Admin Saat Ini:</span>
                <p>{detailItem.catatan_admin}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
              {detailItem.status !== "disetujui" && (
                <button
                  type="button"
                  onClick={() => {
                    const it = detailItem;
                    setDetailItem(null);
                    handleOpenAcc(it);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Proses ACC Produk
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL ACC & TERBITKAN KE ETALASE WEB DESA               */}
      {/* ======================================================== */}
      {accModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 p-6 sm:p-7 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Verifikasi & Publikasi
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  Setujui & Terbitkan ke Web Desa
                </h3>
              </div>
            </div>

            <form onSubmit={handleExecuteAcc} className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-extrabold text-slate-900 text-sm">{accModalItem.nama}</p>
                <p className="text-slate-500">
                  Pemilik: <strong className="text-slate-800">{accModalItem.pemilik}</strong> ({accModalItem.rw})
                </p>
                <p className="text-slate-500">
                  Harga: <strong className="text-[#064E3B]">{accModalItem.harga || "Hubungi Penjual"}</strong>
                </p>
              </div>

              {/* Catatan ACC */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Verifikasi Admin (Tampil di menu UMKM Saya milik pemohon):
                </label>
                <textarea
                  rows={2}
                  required
                  value={accNote}
                  onChange={(e) => setAccNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#064E3B]"
                  placeholder="Produk legalitas terverifikasi lengkap. Telah disetujui tampil di etalase web desa."
                />
              </div>

              {/* Opsi Produk Unggulan */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnggulan}
                  onChange={(e) => setIsUnggulan(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-900">
                  Tandai sebagai Produk Unggulan (Tampil di baris teratas etalase)
                </span>
              </label>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isProcessingAcc}
                  onClick={() => setAccModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessingAcc}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingAcc ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses ACC...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ACC & Tayangkan Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL TOLAK PENDAFTARAN UMKM                             */}
      {/* ======================================================== */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 p-6 sm:p-7 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <ThumbsDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                  Tolak / Minta Revisi Produk
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  Tolak Pengajuan UMKM
                </h3>
              </div>
            </div>

            <form onSubmit={handleExecuteReject} className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-1">
                <p className="font-extrabold text-slate-900 text-sm">{rejectModalItem.nama}</p>
                <p className="text-slate-500">
                  Pemilik: <strong className="text-slate-800">{rejectModalItem.pemilik}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alasan Penolakan / Catatan Perbaikan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-rose-600"
                  placeholder="Contoh: Foto produk tidak sesuai, mohon unggah foto produk asli dengan pencahayaan jelas..."
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Catatan ini akan dikirimkan ke halaman UMKM Saya milik pemohon agar mereka dapat memperbaikinya.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isProcessingReject}
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessingReject}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingReject ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak Pendaftaran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUKSES (LOTTIE ANIMATION) */}
      <LottieSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData({ ...successModalData, isOpen: false })}
        title={successModalData.title}
        message={successModalData.description}
      />

      {/* POPUP KONFIRMASI HAPUS (CUSTOM MODAL) */}
      <ConfirmDeleteModal
        isOpen={deleteProductItem !== null}
        title="Hapus Produk UMKM?"
        message="Apakah Anda yakin ingin menghapus produk UMKM ini secara permanen dari basis data desa? Tindakan ini tidak dapat dibatalkan."
        itemName={deleteProductItem ? `${deleteProductItem.nama} (${deleteProductItem.pemilik})` : undefined}
        confirmText="Ya, Hapus Produk"
        isLoading={isDeletingProduct}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteProductItem(null)}
      />
    </div>
  );
}
