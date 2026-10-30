"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  Send,
  UserCheck,
  HardHat,
  Phone,
  Paperclip,
  CheckCheck,
  Ban,
  Building,
  DollarSign,
  Camera,
  History,
  FileCheck2,
} from "lucide-react";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";
import AdminSidebar from "@/app/components/admin-sidebar";

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

export default function AdminPengaduanKerusakanPage() {
  const [laporanList, setLaporanList] = useState<PengaduanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States
  const [activeTab, setActiveTab] = useState<
    "semua" | "menunggu_verifikasi_admin" | "diteruskan_ke_kades" | "disetujui_kades" | "sedang_perbaikan" | "selesai" | "ditolak"
  >("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [rwFilter, setRwFilter] = useState("Semua RW");

  // Modals
  const [detailModalItem, setDetailModalItem] = useState<PengaduanItem | null>(null);

  // Modal 1: Teruskan ke Kades
  const [forwardModalItem, setForwardModalItem] = useState<PengaduanItem | null>(null);
  const [forwardNote, setForwardNote] = useState("");
  const [isForwarding, setIsForwarding] = useState(false);

  // Modal 2: Tugaskan Vendor & Mulai Perbaikan
  const [vendorModalItem, setVendorModalItem] = useState<PengaduanItem | null>(null);
  const [vendorNama, setVendorNama] = useState("");
  const [vendorKontak, setVendorKontak] = useState("");
  const [estimasiBiaya, setEstimasiBiaya] = useState("");
  const [vendorNote, setVendorNote] = useState("");
  const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);

  // Modal 3: Selesaikan Laporan
  const [completeModalItem, setCompleteModalItem] = useState<PengaduanItem | null>(null);
  const [completeNote, setCompleteNote] = useState("");
  const [fotoSelesaiUrl, setFotoSelesaiUrl] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  // Modal 4: Tolak Laporan
  const [rejectModalItem, setRejectModalItem] = useState<PengaduanItem | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Modal Konfirmasi ACC Kades
  const [accConfirmItem, setAccConfirmItem] = useState<PengaduanItem | null>(null);
  const [isAccing, setIsAccing] = useState(false);

  // Modal Lottie Sukses
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Fetch Data Laporan dari Backend API
  const fetchLaporanData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/pengaduan");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLaporanList(json.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data pengaduan:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLaporanData();
  }, []);

  // Filter List Data
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

  // Action 1: Konfirmasi Teruskan ke Kepala Desa
  const handleConfirmForward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forwardModalItem) return;
    setIsForwarding(true);

    try {
      const res = await fetch("/api/pengaduan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: forwardModalItem.id,
          action: "teruskan_ke_kades",
          catatan: forwardNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setForwardModalItem(null);
        setForwardNote("");
        fetchLaporanData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Laporan Diteruskan ke Kepala Desa!",
          message: `Laporan kerusakan ${forwardModalItem.id} berhasil diteruskan ke meja Kepala Desa untuk ditinjau dan mendapatkan persetujuan (ACC).`,
        });
      } else {
        alert(json.message || "Gagal meneruskan laporan ke Kades.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi saat meneruskan laporan.");
    } finally {
      setIsForwarding(false);
    }
  };

  // Action 2: Shortcut / Simulasi ACC Kades (Bila Kades Menyetujui)
  const handleAccKades = (item: PengaduanItem) => {
    setAccConfirmItem(item);
  };

  const handleConfirmAccKades = async () => {
    if (!accConfirmItem) return;
    const item = accConfirmItem;
    setIsAccing(true);

    try {
      const res = await fetch("/api/pengaduan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          action: "acc_kades",
          catatanKades: "Disetujui Kepala Desa. Silakan Admin Desa menugaskan vendor mitra untuk penanganan fisik lapangan.",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAccConfirmItem(null);
        fetchLaporanData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Persetujuan Kades Diberikan!",
          message: `Laporan ${item.id} telah disetujui Kepala Desa. Status kini kembali ke Admin untuk mencari dan menugaskan vendor perbaikan.`,
        });
      } else {
        console.error("Gagal memperbarui persetujuan Kades:", json.message);
      }
    } catch (err) {
      console.error("Terjadi kesalahan jaringan:", err);
    } finally {
      setIsAccing(false);
    }
  };

  // Action 3: Konfirmasi Tugaskan Vendor & Mulai Perbaikan
  const handleConfirmVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorModalItem) return;
    if (!vendorNama.trim()) {
      alert("Harap masukkan nama vendor atau teknisi perbaikan.");
      return;
    }
    setIsSubmittingVendor(true);

    try {
      const res = await fetch("/api/pengaduan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: vendorModalItem.id,
          action: "mulai_perbaikan",
          vendorNama: vendorNama.trim(),
          vendorKontak: vendorKontak.trim() || undefined,
          estimasiBiaya: estimasiBiaya.trim() || undefined,
          catatan: vendorNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setVendorModalItem(null);
        setVendorNama("");
        setVendorKontak("");
        setEstimasiBiaya("");
        setVendorNote("");
        fetchLaporanData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Vendor Resmi Ditugaskan!",
          message: `Vendor '${vendorNama}' telah resmi ditugaskan untuk laporan ${vendorModalItem.id}. Status diperbarui menjadi 'Sedang Dalam Pengerjaan Vendor'.`,
        });
      } else {
        alert(json.message || "Gagal menugaskan vendor.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmittingVendor(false);
    }
  };

  // Action 4: Konfirmasi Selesaikan Perbaikan
  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeModalItem) return;
    setIsCompleting(true);

    try {
      const res = await fetch("/api/pengaduan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: completeModalItem.id,
          action: "selesai",
          catatanSelesai: completeNote.trim() || undefined,
          fotoSelesai: fotoSelesaiUrl.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCompleteModalItem(null);
        setCompleteNote("");
        setFotoSelesaiUrl("");
        fetchLaporanData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Perbaikan Berhasil Diselesaikan!",
          message: `Laporan kerusakan ${completeModalItem.id} telah ditandai Selesai Tuntas. Warga dapat melihat bukti dokumentasi di portal laporan mandiri.`,
        });
      } else {
        alert(json.message || "Gagal menyelesaikan laporan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsCompleting(false);
    }
  };

  // Action 5: Konfirmasi Tolak Laporan
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;
    setIsRejecting(true);

    try {
      const res = await fetch("/api/pengaduan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectModalItem.id,
          action: "tolak",
          catatan: rejectNote.trim() || "Laporan tidak valid atau di luar wewenang pemeliharaan desa.",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRejectModalItem(null);
        setRejectNote("");
        fetchLaporanData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Laporan Ditolak",
          message: `Laporan ${rejectModalItem.id} berhasil ditolak dengan alasan yang telah dicatat di riwayat.`,
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

  // Hitung statistik count
  const countTotal = laporanList.length;
  const countBaru = laporanList.filter((l) => l.status === "menunggu_verifikasi_admin").length;
  const countDiKades = laporanList.filter((l) => l.status === "diteruskan_ke_kades").length;
  const countAccKades = laporanList.filter((l) => l.status === "disetujui_kades").length;
  const countPerbaikan = laporanList.filter((l) => l.status === "sedang_perbaikan").length;
  const countSelesai = laporanList.filter((l) => l.status === "selesai").length;
  const countDitolak = laporanList.filter((l) => l.status === "ditolak").length;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 flex font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. SIDEBAR PATOKAN RESMI ADMIN DESA */}
      {/* ========================================================= */}
      <AdminSidebar
        activeItem="pengaduan"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ========================================================= */}
      {/* 2. KONTEN UTAMA */}
      {/* ========================================================= */}
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
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
                <Link href="/admin" className="hover:text-emerald-700">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-800 font-bold">Laporan Kerusakan Lingkungan</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] leading-tight">
                Manajemen Pengaduan & Perbaikan Fasilitas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchLaporanData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </button>

            <a
              href="/layanan#pengaduan"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Form Laporan Warga</span>
            </a>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">

          {/* ========================================================= */}
          {/* METRIC CARDS RINGKASAN */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total */}
            <div
              onClick={() => setActiveTab("semua")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "semua"
                  ? "bg-white border-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Aduan</span>
                <Layers className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900">{countTotal}</p>
              <span className="text-[10px] text-slate-500">Semua Laporan</span>
            </div>

            {/* Antrean Baru */}
            <div
              onClick={() => setActiveTab("menunggu_verifikasi_admin")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "menunggu_verifikasi_admin"
                  ? "bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500/20"
                  : "bg-white border-slate-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center justify-between text-amber-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Baru Masuk</span>
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-amber-900">{countBaru}</p>
              <span className="text-[10px] font-semibold text-amber-700">Perlu Verif Admin</span>
            </div>

            {/* Di Meja Kades */}
            <div
              onClick={() => setActiveTab("diteruskan_ke_kades")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "diteruskan_ke_kades"
                  ? "bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-500/20"
                  : "bg-white border-slate-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between text-purple-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Di Kades</span>
                <UserCheck className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-purple-900">{countDiKades}</p>
              <span className="text-[10px] font-semibold text-purple-700">Menunggu ACC Kades</span>
            </div>

            {/* Perlu Vendor */}
            <div
              onClick={() => setActiveTab("disetujui_kades")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "disetujui_kades"
                  ? "bg-teal-50 border-teal-500 shadow-md ring-2 ring-teal-500/20"
                  : "bg-white border-slate-200 hover:border-teal-300"
              }`}
            >
              <div className="flex items-center justify-between text-teal-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Siap Vendor</span>
                <HardHat className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-teal-900">{countAccKades}</p>
              <span className="text-[10px] font-semibold text-teal-700">Admin Cari Vendor</span>
            </div>

            {/* Sedang Perbaikan */}
            <div
              onClick={() => setActiveTab("sedang_perbaikan")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "sedang_perbaikan"
                  ? "bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500/20"
                  : "bg-white border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between text-blue-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Dikerjakan</span>
                <Wrench className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-blue-900">{countPerbaikan}</p>
              <span className="text-[10px] font-semibold text-blue-700">Vendor di Lapangan</span>
            </div>

            {/* Selesai */}
            <div
              onClick={() => setActiveTab("selesai")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "selesai"
                  ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                  : "bg-white border-slate-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between text-emerald-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Selesai</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-emerald-900">{countSelesai}</p>
              <span className="text-[10px] font-semibold text-emerald-700">Perbaikan Tuntas</span>
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
                  placeholder="Cari ID aduan, lokasi, pelapor, atau vendor..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#064E3B] transition-colors"
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

              {/* Filter RW & Tab Cepat */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={rwFilter}
                  onChange={(e) => setRwFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-[#064E3B]"
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
                { id: "semua", label: "Semua Laporan", count: countTotal },
                { id: "menunggu_verifikasi_admin", label: "1. Antrean Baru (Admin)", count: countBaru, badge: "bg-amber-100 text-amber-900" },
                { id: "diteruskan_ke_kades", label: "2. Di Meja Kades", count: countDiKades, badge: "bg-purple-100 text-purple-900" },
                { id: "disetujui_kades", label: "3. Disetujui Kades (Perlu Vendor)", count: countAccKades, badge: "bg-teal-100 text-teal-900" },
                { id: "sedang_perbaikan", label: "4. Sedang Pengerjaan Vendor", count: countPerbaikan, badge: "bg-blue-100 text-blue-900" },
                { id: "selesai", label: "5. Selesai Tuntas", count: countSelesai, badge: "bg-emerald-100 text-emerald-900" },
                { id: "ditolak", label: "Ditolak", count: countDitolak, badge: "bg-rose-100 text-rose-900" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-[#064E3B] text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === tab.id ? "bg-white text-[#064E3B]" : tab.badge || "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* TABEL LAPORAN KERUSAKAN */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-[#E3E8E2] shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-600">Memuat data pengaduan kerusakan...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Wrench className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Tidak Ada Laporan yang Cocok</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tidak ditemukan laporan kerusakan pada filter atau kata kunci pencarian ini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">ID & Waktu</th>
                      <th className="py-3.5 px-4">Pelapor</th>
                      <th className="py-3.5 px-4">Kategori & Lokasi</th>
                      <th className="py-3.5 px-4">Foto Bukti</th>
                      <th className="py-3.5 px-4">Status & Alur</th>
                      <th className="py-3.5 px-4">Mitra Vendor</th>
                      <th className="py-3.5 px-4 text-center">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((item) => {
                      const firstPhoto = item.foto_urls?.[0];
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* ID & Waktu */}
                          <td className="py-4 px-4 align-top">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] block w-fit mb-1">
                              {item.id}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                            </span>
                          </td>

                          {/* Pelapor */}
                          <td className="py-4 px-4 align-top">
                            <strong className="text-slate-900 block font-bold text-xs">
                              {item.nama_pelapor}
                            </strong>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{item.rw || "RW 01"}</span>
                            </div>
                            {item.kontak_pelapor && item.kontak_pelapor !== "-" && (
                              <a
                                href={`https://wa.me/${item.kontak_pelapor.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 mt-1"
                              >
                                <Phone className="w-2.5 h-2.5" />
                                <span>{item.kontak_pelapor}</span>
                              </a>
                            )}
                          </td>

                          {/* Kategori & Lokasi */}
                          <td className="py-4 px-4 align-top max-w-[260px]">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                              {item.kategori}
                            </span>
                            <p className="font-semibold text-slate-800 text-[11px] line-clamp-1">
                              {item.lokasi}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 italic">
                              &ldquo;{item.isi_aduan}&rdquo;
                            </p>
                          </td>

                          {/* Foto Bukti */}
                          <td className="py-4 px-4 align-top">
                            {firstPhoto ? (
                              <div
                                onClick={() => setDetailModalItem(item)}
                                className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group shrink-0"
                              >
                                <img
                                  src={firstPhoto.url}
                                  alt={firstPhoto.name || "Foto"}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                                {item.foto_urls.length > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] font-bold px-1 rounded-tl">
                                    +{item.foto_urls.length - 1}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Tanpa Foto</span>
                            )}
                          </td>

                          {/* Status & Step */}
                          <td className="py-4 px-4 align-top">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                                item.status_color || "bg-slate-100 text-slate-800 border-slate-200"
                              }`}
                            >
                              {item.status === "selesai" ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : item.status === "sedang_perbaikan" ? (
                                <Wrench className="w-3 h-3 text-blue-600" />
                              ) : item.status === "disetujui_kades" ? (
                                <HardHat className="w-3 h-3 text-teal-600" />
                              ) : item.status === "diteruskan_ke_kades" ? (
                                <UserCheck className="w-3 h-3 text-purple-600" />
                              ) : (
                                <Clock className="w-3 h-3 text-amber-600" />
                              )}
                              <span>{item.status_label || item.status}</span>
                            </span>

                            {/* Stepper Progress 1-5 */}
                            <div className="flex items-center gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <div
                                  key={s}
                                  className={`h-1.5 flex-1 rounded-full ${
                                    (item.step || 1) >= s
                                      ? s === 5
                                        ? "bg-emerald-500"
                                        : "bg-[#064E3B]"
                                      : "bg-slate-200"
                                  }`}
                                  title={`Tahap ${s}`}
                                />
                              ))}
                            </div>
                            <span className="text-[9px] text-slate-400 mt-0.5 block">
                              Tahap {item.step || 1} dari 5
                            </span>
                          </td>

                          {/* Mitra Vendor */}
                          <td className="py-4 px-4 align-top max-w-[180px]">
                            {item.vendor_nama ? (
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 text-[11px] block">
                                  {item.vendor_nama}
                                </span>
                                {item.estimasi_biaya && (
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block w-fit">
                                    {item.estimasi_biaya}
                                  </span>
                                )}
                                {item.vendor_kontak && item.vendor_kontak !== "-" && (
                                  <span className="text-[10px] text-slate-500 block truncate">
                                    {item.vendor_kontak}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Belum Ditugaskan</span>
                            )}
                          </td>

                          {/* Tombol Aksi Kontekstual */}
                          <td className="py-4 px-4 align-top text-center">
                            <div className="flex flex-col gap-1.5 min-w-[130px] items-stretch">
                              {/* Kasus 1: Laporan Baru -> Teruskan ke Kades / Tolak */}
                              {item.status === "menunggu_verifikasi_admin" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setForwardModalItem(item);
                                      setForwardNote(`Laporan kerusakan ${item.kategori} di ${item.lokasi} telah diverifikasi lapangan dan direkomendasikan untuk persetujuan perbaikan.`);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Teruskan ke Kades</span>
                                  </button>
                                  <button
                                    onClick={() => setRejectModalItem(item)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-[10px] transition-colors cursor-pointer"
                                  >
                                    Tolak Laporan
                                  </button>
                                </>
                              )}

                              {/* Kasus 2: Di Meja Kades -> Menunggu ACC Kades (Bisa Simulasi ACC jika Admin berwenang) */}
                              {item.status === "diteruskan_ke_kades" && (
                                <>
                                  <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold block">
                                    Ditinjau Kades
                                  </span>
                                  <button
                                    onClick={() => handleAccKades(item)}
                                    className="px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
                                    title="Persetujuan Kades telah turun"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>ACC Kades (Lanjut)</span>
                                  </button>
                                </>
                              )}

                              {/* Kasus 3: Sudah Di-ACC Kades -> Admin Cari & Tugaskan Vendor */}
                              {item.status === "disetujui_kades" && (
                                <button
                                  onClick={() => {
                                    setVendorModalItem(item);
                                    setVendorNama("CV Bina Karya Sidoarjo");
                                    setVendorKontak("081234567890");
                                    setEstimasiBiaya("Rp 2.500.000");
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                >
                                  <HardHat className="w-3 h-3" />
                                  <span>Tugaskan Vendor</span>
                                </button>
                              )}

                              {/* Kasus 4: Sedang Dikerjakan Vendor -> Tandai Selesai */}
                              {item.status === "sedang_perbaikan" && (
                                <button
                                  onClick={() => {
                                    setCompleteModalItem(item);
                                    setCompleteNote(`Pengerjaan fisik oleh ${item.vendor_nama || "vendor"} telah selesai 100%. Fasilitas jalan/lingkungan telah normal dan aman digunakan.`);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                                >
                                  <CheckCheck className="w-3 h-3" />
                                  <span>Tandai Selesai</span>
                                </button>
                              )}

                              {/* Kasus 5: Selesai Tuntas */}
                              {item.status === "selesai" && (
                                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold block">
                                  Tuntas & Terverifikasi
                                </span>
                              )}

                              {/* Detail Lengkap Button */}
                              <button
                                onClick={() => setDetailModalItem(item)}
                                className="px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-semibold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Rincian & Log</span>
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
      {/* MODAL 1: TERUSKAN LAPORAN KE KEPALA DESA */}
      {/* ========================================================= */}
      {forwardModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 bg-purple-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200">
                  Disposisi Laporan
                </span>
                <h3 className="text-lg font-black tracking-tight">Teruskan ke Kepala Desa</h3>
              </div>
              <button
                onClick={() => setForwardModalItem(null)}
                className="p-1 rounded-lg text-purple-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmForward} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID Laporan:</span>
                  <strong className="font-mono text-purple-900">{forwardModalItem.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <strong className="text-slate-800">{forwardModalItem.kategori}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lokasi:</span>
                  <strong className="text-slate-800">{forwardModalItem.lokasi}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Rekomendasi Admin untuk Kades *
                </label>
                <textarea
                  required
                  rows={4}
                  value={forwardNote}
                  onChange={(e) => setForwardNote(e.target.value)}
                  placeholder="Contoh: Telah dicek oleh petugas lapangan, aspal berlubang parah dan perlu segera ditambal..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-purple-600"
                />
                <span className="text-[11px] text-slate-400">
                  Catatan ini akan langsung tampil di meja kerja Kepala Desa untuk di-ACC.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForwardModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isForwarding}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  {isForwarding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Kirim ke Kades</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TUGASKAN VENDOR & MULAI PERBAIKAN */}
      {/* ========================================================= */}
      {vendorModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 bg-[#064E3B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5D82F]">
                  Penugasan Rekanan Mitra
                </span>
                <h3 className="text-lg font-black tracking-tight">Tugaskan Vendor Perbaikan</h3>
              </div>
              <button
                onClick={() => setVendorModalItem(null)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmVendor} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID Laporan:</span>
                  <strong className="font-mono text-emerald-950">{vendorModalItem.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Arahan Kades:</span>
                  <strong className="text-emerald-900">{vendorModalItem.catatan_kades || "Disetujui untuk perbaikan."}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Vendor / Mitra Lapangan *</label>
                <input
                  type="text"
                  required
                  value={vendorNama}
                  onChange={(e) => setVendorNama(e.target.value)}
                  placeholder="Contoh: CV Bina Karya Sidoarjo / Pak Slamet (Tukang Aspal)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kontak WhatsApp Vendor</label>
                  <input
                    type="tel"
                    value={vendorKontak}
                    onChange={(e) => setVendorKontak(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#064E3B] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Anggaran (Opsional)</label>
                  <input
                    type="text"
                    value={estimasiBiaya}
                    onChange={(e) => setEstimasiBiaya(e.target.value)}
                    placeholder="Contoh: Rp 2.500.000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#064E3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Instruksi Pengerjaan</label>
                <textarea
                  rows={2}
                  value={vendorNote}
                  onChange={(e) => setVendorNote(e.target.value)}
                  placeholder="Instruksi material, standar ketebalan aspal, atau jadwal..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVendorModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVendor}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  {isSubmittingVendor ? <RefreshCw className="w-4 h-4 animate-spin" /> : <HardHat className="w-4 h-4" />}
                  <span>Mulai Pengerjaan Lapangan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SELESAIKAN PERBAIKAN */}
      {/* ========================================================= */}
      {completeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 bg-emerald-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                  Verifikasi Hasil Akhir
                </span>
                <h3 className="text-lg font-black tracking-tight">Tandai Perbaikan Selesai Tuntas</h3>
              </div>
              <button
                onClick={() => setCompleteModalItem(null)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmComplete} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID Laporan:</span>
                  <strong className="font-mono text-emerald-950">{completeModalItem.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendor Pelaksana:</span>
                  <strong className="text-emerald-900">{completeModalItem.vendor_nama || "Tim Swakelola"}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Penyelesaian & Verifikasi Hasil *
                </label>
                <textarea
                  required
                  rows={3}
                  value={completeNote}
                  onChange={(e) => setCompleteNote(e.target.value)}
                  placeholder="Jelaskan kondisi fisik setelah perbaikan selesai tuntas..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foto Dokumentasi Selesai (Opsional URL)
                </label>
                <input
                  type="url"
                  value={fotoSelesaiUrl}
                  onChange={(e) => setFotoSelesaiUrl(e.target.value)}
                  placeholder="https://... atau biarkan kosong"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCompleting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  {isCompleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Konfirmasi Selesai 100%</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: TOLAK LAPORAN */}
      {/* ========================================================= */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 bg-rose-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-200">
                  Pembatalan
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

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Anda akan menolak laporan <strong>{rejectModalItem.id}</strong>. Berikan alasan penolakan yang jelas agar pelapor dapat memahami.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Penolakan *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Contoh: Lokasi jalan berada di wilayah jalan provinsi di luar kewenangan pemeliharaan desa..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-rose-600"
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
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold flex items-center gap-2 shadow-sm"
                >
                  {isRejecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                  <span>Tolak Laporan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: DETAIL RINCIAN & LOG RIWAYAT TRACKING */}
      {/* ========================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-[#06261D] text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#C5D82F]">
                  Rincian & Kronologis Laporan
                </span>
                <h3 className="text-xl font-black tracking-tight">{detailModalItem.id}</h3>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Status Header Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Status Terkini
                  </span>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-black border ${detailModalItem.status_color}`}>
                    {detailModalItem.status_label || detailModalItem.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Posisi Alur
                  </span>
                  <strong className="text-slate-800 text-xs">Tahap {detailModalItem.step || 1} dari 5</strong>
                </div>
              </div>

              {/* Data Pelapor & Lokasi */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Nama Pelapor:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.nama_pelapor}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Kontak WA:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.kontak_pelapor || "-"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Kategori Masalah:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.kategori}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Lokasi Kejadian:</span>
                  <strong className="text-slate-900 text-xs">{detailModalItem.lokasi} ({detailModalItem.rw || "RW 01"})</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Uraian Aduan:</span>
                  <p className="text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-200">
                    &ldquo;{detailModalItem.isi_aduan}&rdquo;
                  </p>
                </div>
              </div>

              {/* Vendor & Catatan Lapangan */}
              {(detailModalItem.vendor_nama || detailModalItem.catatan_kades || detailModalItem.catatan_selesai) && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>Data Penanganan Lapangan & Rekanan:</span>
                  </h4>
                  {detailModalItem.catatan_kades && (
                    <div className="text-[11px]">
                      <span className="text-emerald-800 font-semibold">Disposisi/Arahan Kades:</span>{" "}
                      <span className="text-slate-700">{detailModalItem.catatan_kades}</span>
                    </div>
                  )}
                  {detailModalItem.vendor_nama && (
                    <div className="text-[11px] grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-emerald-800 font-semibold">Vendor Ditugaskan:</span>{" "}
                        <strong className="text-slate-900">{detailModalItem.vendor_nama}</strong>
                      </div>
                      <div>
                        <span className="text-emerald-800 font-semibold">Estimasi Anggaran:</span>{" "}
                        <strong className="text-slate-900">{detailModalItem.estimasi_biaya || "-"}</strong>
                      </div>
                    </div>
                  )}
                  {detailModalItem.catatan_selesai && (
                    <div className="text-[11px] pt-1">
                      <span className="text-emerald-800 font-semibold">Laporan Penyelesaian:</span>{" "}
                      <span className="text-slate-800">{detailModalItem.catatan_selesai}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Foto Dokumentasi Kerusakan */}
              {detailModalItem.foto_urls && detailModalItem.foto_urls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-slate-600" />
                    <span>Foto Dokumentasi ({detailModalItem.foto_urls.length} Berkas):</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detailModalItem.foto_urls.map((f, idx) => (
                      <a
                        key={idx}
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl overflow-hidden border border-slate-200 group block relative aspect-video bg-slate-100"
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

              {/* Timeline Riwayat Tracking */}
              {detailModalItem.riwayat && detailModalItem.riwayat.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-600" />
                    <span>Log Kronologis Perjalanan Laporan:</span>
                  </h4>
                  <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {detailModalItem.riwayat.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 pl-1 relative">
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">
                          ✓
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 w-full text-[11px]">
                          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                            <strong className="text-slate-700">{r.aktor}</strong>
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

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setDetailModalItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Tutup Detail
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

      {/* POPUP KONFIRMASI PERSETUJUAN KADES (CUSTOM MODAL) */}
      <ConfirmDeleteModal
        isOpen={accConfirmItem !== null}
        onClose={() => setAccConfirmItem(null)}
        onConfirm={handleConfirmAccKades}
        title="Konfirmasi Persetujuan Kepala Desa?"
        message="Apakah Anda yakin memberikan persetujuan (ACC) Kepala Desa untuk penanganan laporan kerusakan fasilitas ini? Status akan diperbarui untuk penugasan vendor perbaikan."
        itemName={accConfirmItem ? `${accConfirmItem.id} - ${accConfirmItem.kategori} (${accConfirmItem.lokasi})` : undefined}
        confirmText="Ya, Setujui Laporan"
        cancelText="Batal"
        isLoading={isAccing}
      />
    </div>
  );
}
