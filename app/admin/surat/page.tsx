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
  UploadCloud,
  FileCheck,
  Send,
  UserCheck,
  Printer,
  FileCode,
  Info,
  Phone,
  Paperclip,
} from "lucide-react";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";
import AdminSidebar from "@/app/components/admin-sidebar";

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
  user_id?: string;
  user_name?: string;
  user_nik?: string;
  untuk_siapa?: string;
}

export default function AdminSuratVerificationPage() {
  const [suratList, setSuratList] = useState<SuratItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States
  const [activeTab, setActiveTab] = useState<
    "semua" | "antrean" | "kades_perlu" | "di_kades" | "acc_kades" | "admin_cukup" | "siap"
  >("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [rwFilter, setRwFilter] = useState("Semua RW");

  // Premium Dropdown States & Refs
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRwDropdownOpen, setIsRwDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const rwDropdownRef = useRef<HTMLDivElement>(null);

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

  // Modal Detail Berkas
  const [selectedSurat, setSelectedSurat] = useState<SuratItem | null>(null);

  // Modal Teruskan ke Kades
  const [forwardModalSurat, setForwardModalSurat] = useState<SuratItem | null>(null);
  const [forwardNote, setForwardNote] = useState("");
  const [isForwarding, setIsForwarding] = useState(false);

  // Modal Penerbitan Surat (Cetak Fisik vs Soft File)
  const [issueModalSurat, setIssueModalSurat] = useState<SuratItem | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"cetak" | "softfile">("cetak");
  const [pickupLocation, setPickupLocation] = useState("Loket 1 Pelayanan Terpadu Balai Desa Sawotratap");
  const [pickupHours, setPickupHours] = useState("Senin – Jumat, 08.00 – 15.00 WIB");
  const [pickupRequirement, setPickupRequirement] = useState("Membawa KTP asli & bukti resi pemohon");
  const [softfileUrl, setSoftfileUrl] = useState("");
  const [softfileName, setSoftfileName] = useState("");
  const [issueNote, setIssueNote] = useState("");
  const [isIssuing, setIsIssuing] = useState(false);

  // Pop up Sukses Lottie Animasi
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

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
      console.error("Gagal memuat data surat dari database:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuratData();
  }, []);

  // Filter List di Frontend
  const filteredList = suratList.filter((item) => {
    // Filter RW
    if (rwFilter !== "Semua RW" && item.rw_pemohon !== rwFilter) return false;

    // Filter Tab
    if (activeTab === "antrean" && item.status !== "Antrean Verifikasi") return false;
    if (activeTab === "kades_perlu" && !item.butuh_kades) return false;
    if (activeTab === "di_kades" && item.status !== "Menunggu Persetujuan Kades") return false;
    if (activeTab === "acc_kades" && item.status !== "Disetujui Kades") return false;
    if (activeTab === "admin_cukup" && item.butuh_kades) return false;
    if (activeTab === "siap" && !item.status.includes("Siap") && !item.status.includes("Dokumen Digital")) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.nama_pemohon.toLowerCase().includes(q) ||
        item.nik_pemohon.includes(q) ||
        item.jenis_surat.toLowerCase().includes(q) ||
        item.rw_pemohon.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Action 1: Teruskan ke Kepala Desa
  const handleConfirmForward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forwardModalSurat) return;
    setIsForwarding(true);

    try {
      const res = await fetch("/api/admin/surat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: forwardModalSurat.id,
          action: "teruskan_ke_kades",
          catatan: forwardNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setForwardModalSurat(null);
        setForwardNote("");
        fetchSuratData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Surat Berhasil Diteruskan!",
          message: `Surat ${forwardModalSurat.id} (${forwardModalSurat.jenis_surat}) berhasil diteruskan ke meja Kepala Desa untuk ditinjau.`,
        });
      } else {
        alert(json.message || "Gagal meneruskan surat.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsForwarding(false);
    }
  };



  // Action 3: Penerbitan Surat (Cetak Fisik vs Soft File Digital)
  const handleConfirmIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueModalSurat) return;
    setIsIssuing(true);

    let catatanFinal = "";
    if (deliveryMethod === "cetak") {
      catatanFinal = `Surat cetak fisik telah selesai diproses. Silakan ambil di ${pickupLocation} pada jam ${pickupHours}. ${pickupRequirement}.`;
    } else {
      catatanFinal = issueNote.trim() || `Dokumen digital resmi telah terbit ber-QR code. Silakan unduh langsung dari portal warga.`;
    }

    try {
      const res = await fetch("/api/admin/surat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: issueModalSurat.id,
          action: "terbitkan_surat",
          metodePenyerahan: deliveryMethod,
          softfileUrl: deliveryMethod === "softfile" ? (softfileUrl.trim() || "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg") : undefined,
          catatan: catatanFinal,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const msg = deliveryMethod === "cetak"
          ? `Surat ${issueModalSurat.id} berhasil diterbitkan dengan status CETAK FISIK (Siap Diambil di Balai Desa).`
          : `Surat ${issueModalSurat.id} berhasil diterbitkan sebagai SOFT FILE DIGITAL (Langsung terkirim ke akun warga).`;
        setIssueModalSurat(null);
        setSoftfileUrl("");
        setIssueNote("");
        fetchSuratData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Surat Resmi Berhasil Diterbitkan!",
          message: msg,
        });
      } else {
        alert(json.message || "Gagal menerbitkan surat.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat memproses penerbitan surat.");
    } finally {
      setIsIssuing(false);
    }
  };

  // Modal Konfirmasi Selesai
  const [completeConfirmItem, setCompleteConfirmItem] = useState<SuratItem | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Action 4: Selesaikan Pelayanan (Buka Modal Kustom)
  const handleMarkCompleted = (item: SuratItem) => {
    setCompleteConfirmItem(item);
  };

  const executeMarkCompleted = async () => {
    if (!completeConfirmItem) return;
    setIsCompleting(true);
    const item = completeConfirmItem;

    try {
      const res = await fetch("/api/admin/surat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          action: "selesai",
          catatan: "Dokumen telah diterima pemohon dan proses administrasi pelayanan desa telah tuntas.",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCompleteConfirmItem(null);
        fetchSuratData();
        window.dispatchEvent(new Event("admin-data-updated"));
        setSuccessPopup({
          isOpen: true,
          title: "Pelayanan Selesai!",
          message: `Surat ${item.id} berhasil ditandai Selesai Tuntas.`,
        });
      } else {
        console.error("Gagal menyelesaikan surat:", json.message);
      }
    } catch (err: any) {
      console.error("Terjadi kesalahan:", err.message);
    } finally {
      setIsCompleting(false);
    }
  };

  // Hitung ringkasan statistik
  const countTotal = suratList.length;
  const countAntrean = suratList.filter((s) => s.status === "Antrean Verifikasi").length;
  const countButuhKades = suratList.filter((s) => s.butuh_kades).length;
  const countDiKades = suratList.filter((s) => s.status === "Menunggu Persetujuan Kades").length;
  const countAccKades = suratList.filter((s) => s.status === "Disetujui Kades").length;
  const countCukupAdmin = suratList.filter((s) => !s.butuh_kades).length;
  const countSiap = suratList.filter((s) => s.status.includes("Siap") || s.status.includes("Dokumen Digital")).length;

  const statusOptions = [
    {
      id: "semua" as const,
      label: "Semua Permohonan",
      count: countTotal,
      desc: "Seluruh berkas masuk di database",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Layers,
    },
    {
      id: "antrean" as const,
      label: "Antrean Verifikasi Baru",
      count: countAntrean,
      desc: "Perlu tindakan & pemeriksaan awal",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: Clock,
    },
    {
      id: "kades_perlu" as const,
      label: "Wajib Persetujuan Kades",
      count: countButuhKades,
      desc: "SKTM, N1-N4 Nikah, Ahli Waris",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-200",
      icon: UserCheck,
    },
    {
      id: "di_kades" as const,
      label: "Sedang di Meja Kades",
      count: countDiKades,
      desc: "Menunggu tanda tangan / ACC Kades",
      badgeColor: "bg-purple-200 text-purple-950 border-purple-300",
      icon: Send,
    },
    {
      id: "acc_kades" as const,
      label: "Disetujui Kades (Balik ke Admin)",
      count: countAccKades,
      desc: "Telah di-ACC, siap diterbitkan admin",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-200",
      icon: FileCheck,
    },
    {
      id: "admin_cukup" as const,
      label: "Cukup Verifikasi Admin",
      count: countCukupAdmin,
      desc: "SKD Domisili, SKU UMKM, SKCK",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
      icon: ShieldCheck,
    },
    {
      id: "siap" as const,
      label: "Siap Diambil / Terbit",
      count: countSiap,
      desc: "Cetak Balai Desa & Dokumen Digital",
      badgeColor: "bg-teal-100 text-teal-900 border-teal-200",
      icon: Printer,
    },
  ];

  const currentStatusConfig = statusOptions.find((opt) => opt.id === activeTab) || statusOptions[0];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR PATOKAN RESMI ADMIN DESA */}
      {/* ========================================================================= */}
      <AdminSidebar
        activeItem="surat"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 2. KONTEN UTAMA VERIFIKASI SURAT */}
      {/* ========================================================================= */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        
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
                <a href="/admin" className="hover:text-emerald-700">Dashboard</a>
                <span>/</span>
                <span className="text-slate-800 font-bold">Verifikasi Surat Mandiri</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] leading-tight">
                Verifikasi & Alur Surat Keterangan Warga
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchSuratData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Segarkan Data DB</span>
            </button>

            <a
              href="/layanan#surat"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Form Permohonan Warga</span>
            </a>
          </div>
        </header>

        {/* CONTAINER ISI */}
        <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          

          {/* KARTU STATISTIK METRIK SURAT */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Berkas DB</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{countTotal}</p>
              <span className="text-[10px] font-bold text-slate-500">Live Supabase</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Antrean Verif Baru</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{countAntrean}</p>
              <span className="text-[10px] font-bold text-amber-600">Perlu tindakan</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Wajib Kades</span>
              <p className="text-2xl font-black text-purple-700 mt-1">{countButuhKades}</p>
              <span className="text-[10px] font-bold text-purple-600">{countDiKades} di meja Kades</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Cukup Admin</span>
              <p className="text-2xl font-black text-blue-700 mt-1">{countCukupAdmin}</p>
              <span className="text-[10px] font-bold text-blue-600">Proses langsung</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8E2] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Siap / Terbit</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{countSiap}</p>
              <span className="text-[10px] font-bold text-emerald-600">Cetak & Soft File</span>
            </div>

          </div>

          {/* TOOLBAR FILTER BERBENTUK DROPDOWN PREMIUM */}
          <div className="bg-white rounded-3xl border border-[#E3E8E2] p-4 shadow-2xs space-y-3">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* 1. DROPDOWN PREMIUM: STATUS & KATEGORI OTORITAS */}
                <div ref={statusDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusDropdownOpen(!isStatusDropdownOpen);
                      setIsRwDropdownOpen(false);
                    }}
                    className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-2xs select-none ${
                      isStatusDropdownOpen
                        ? "bg-emerald-50/80 border-[#064E3B] text-[#064E3B] ring-2 ring-emerald-600/10"
                        : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                      <currentStatusConfig.icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 font-medium block leading-none">Filter Alur Surat:</span>
                      <span className="font-black text-slate-900 leading-tight">{currentStatusConfig.label}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ml-1 ${currentStatusConfig.badgeColor}`}>
                      {currentStatusConfig.count}
                    </span>

                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180 text-emerald-800" : ""}`} />
                  </button>

                  {/* POPOVER MENU STATUS */}
                  {isStatusDropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl z-30 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pilih Kategori Alur Surat</p>
                      </div>

                      <div className="space-y-0.5 max-h-72 overflow-y-auto p-1">
                        {statusOptions.map((opt) => {
                          const IconComp = opt.icon;
                          const isSelected = activeTab === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setActiveTab(opt.id);
                                setIsStatusDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-50 text-[#064E3B] font-black border border-emerald-200/80 shadow-2xs"
                                  : "text-slate-700 hover:bg-slate-50 border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-[#064E3B] text-[#C5D82F]" : "bg-slate-100 text-slate-600"}`}>
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold truncate leading-tight">{opt.label}</p>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{opt.desc}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${opt.badgeColor}`}>
                                  {opt.count}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#064E3B]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. DROPDOWN PREMIUM: WILAYAH RW */}
                <div ref={rwDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRwDropdownOpen(!isRwDropdownOpen);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-2xs select-none ${
                      isRwDropdownOpen
                        ? "bg-emerald-50/80 border-[#064E3B] text-[#064E3B] ring-2 ring-emerald-600/10"
                        : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-800"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 font-medium block leading-none">Wilayah:</span>
                      <span className="font-black text-slate-900 leading-tight">{rwFilter}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isRwDropdownOpen ? "rotate-180 text-emerald-800" : ""}`} />
                  </button>

                  {/* POPOVER MENU RW */}
                  {isRwDropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-3xl border border-slate-200 shadow-2xl z-30 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 border-b border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pilih Wilayah RW</p>
                      </div>

                      <div className="space-y-0.5 max-h-60 overflow-y-auto p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRwFilter("Semua RW");
                            setIsRwDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                            rwFilter === "Semua RW" ? "bg-emerald-50 text-[#064E3B] font-black" : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>Seluruh 11 RW</span>
                          {rwFilter === "Semua RW" && <Check className="w-3.5 h-3.5 text-[#064E3B]" />}
                        </button>

                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => {
                          const r = `RW ${n < 10 ? "0" + n : n}`;
                          const isSelected = rwFilter === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setRwFilter(r);
                                setIsRwDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                                isSelected ? "bg-emerald-50 text-[#064E3B] font-black" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span>{r} Sawotratap</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#064E3B]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* RESET FILTER JIKA TIDAK DEFAULT */}
                {(activeTab !== "semua" || rwFilter !== "Semua RW" || searchQuery.trim() !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("semua");
                      setRwFilter("Semua RW");
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                    title="Kembalikan semua filter ke tampilan awal"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

              </div>

              {/* SEARCH INPUT */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pemohon / NIK / resi..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50/70 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>

            {/* TABEL DAFTAR PERMOHONAN SURAT */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
                  <p>Memuat data berkas permohonan dari Supabase...</p>
                </div>
              ) : filteredList.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-600">Tidak ada permohonan surat pada filter ini.</p>
                  <p className="text-[11px]">Silakan ubah tab kategori atau kata kunci pencarian Anda.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-3 px-3">Resi & Tanggal</th>
                      <th className="py-3 px-3">Pemohon & Wilayah</th>
                      <th className="py-3 px-3">Jenis Layanan</th>
                      <th className="py-3 px-3">Kategori Otoritas</th>
                      <th className="py-3 px-3">Status Permohonan</th>
                      <th className="py-3 px-3">Lampiran</th>
                      <th className="py-3 px-3 text-right">Tindakan Alur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                        
                        {/* RESI & TANGGAL */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block w-fit">
                            {item.id}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Hari Ini"}
                          </span>
                        </td>

                        {/* PEMOHON */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
                              {item.nama_pemohon?.charAt(0) || "W"}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-900 leading-tight">{item.nama_pemohon}</p>
                                {item.untuk_siapa === "keluarga" && (
                                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded">
                                    Keluarga
                                  </span>
                                )}
                              </div>
                              <p className="font-mono text-[10px] text-slate-400">{item.nik_pemohon}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[10px] font-bold text-emerald-800">{item.rw_pemohon}</span>
                                {item.user_name && item.untuk_siapa === "keluarga" && (
                                  <span className="text-[9px] text-slate-400">
                                    • Akun: {item.user_name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* JENIS SURAT */}
                        <td className="py-3.5 px-3 max-w-[200px]">
                          <p className="font-bold text-slate-800 leading-snug line-clamp-1">{item.jenis_surat}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.keperluan}</p>
                        </td>

                        {/* KATEGORI OTORITAS (KADES VS ADMIN) */}
                        <td className="py-3.5 px-3">
                          {item.butuh_kades ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                              <UserCheck className="w-3 h-3 text-purple-600" />
                              <span>Wajib TTD Kades</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Cukup Verif Admin</span>
                            </span>
                          )}
                        </td>

                        {/* STATUS BADGE */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${item.status_color || "bg-amber-100 text-amber-800 border-amber-300"}`}>
                            {item.status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[170px]" title={item.catatan}>
                            {item.catatan}
                          </p>
                        </td>

                        {/* LAMPIRAN BERKAS */}
                        <td className="py-3.5 px-3">
                          {Array.isArray(item.berkas_urls) && item.berkas_urls.length > 0 ? (
                            <button
                              onClick={() => setSelectedSurat(item)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span>{item.berkas_urls.length} Berkas</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Tanpa berkas</span>
                          )}
                        </td>

                        {/* TINDAKAN ALUR (TOMBOL 3D HIJAU TUA / AKSI KHUSUS) */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            
                            {/* JIKA STATUS: ANTREAN VERIFIKASI & BUTUH KADES -> TOMBOL TERUSKAN KE KADES */}
                            {item.status === "Antrean Verifikasi" && item.butuh_kades && (
                              <button
                                onClick={() => {
                                  setForwardModalSurat(item);
                                  setForwardNote(`Permohonan ${item.jenis_surat} an. ${item.nama_pemohon} (${item.rw_pemohon}) telah diperiksa kelengkapan berkasnya dan direkomendasikan untuk disetujui.`);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-[10px] uppercase shadow-[0_3px_0_#3b0764] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                title="Teruskan ke meja Kepala Desa untuk persetujuan / tanda tangan"
                              >
                                <Send className="w-3 h-3 text-[#C5D82F]" />
                                <span>Ke Kades</span>
                              </button>
                            )}

                            {/* JIKA STATUS: MENUNGGU PERSETUJUAN KADES -> MENUNGGU PERSETUJUAN KADES */}
                            {item.status === "Menunggu Persetujuan Kades" && (
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold"
                                title="Surat sedang di meja Kepala Desa. Menunggu verifikasi dan persetujuan Kepala Desa di halaman /kades/surat."
                              >
                                <Clock className="w-3 h-3 text-purple-600" />
                                <span>Menunggu Kades</span>
                              </span>
                            )}

                            {/* JIKA STATUS: ANTREAN (TIDAK BUTUH KADES) ATAU SUDAH DISETUJUI KADES -> TOMBOL TERBITKAN (CETAK / SOFTFILE) */}
                            {((item.status === "Antrean Verifikasi" && !item.butuh_kades) || item.status === "Disetujui Kades") && (
                              <button
                                onClick={() => {
                                  setIssueModalSurat(item);
                                  setSoftfileName(`Surat_Keterangan_${item.id}.pdf`);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#054030] text-white font-black text-[10px] uppercase shadow-[0_3px_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                                title="Proses penerbitan surat: pilih Cetak di Balai Desa atau Soft File digital"
                              >
                                <Printer className="w-3 h-3 text-[#C5D82F]" />
                                <span>Terbitkan</span>
                              </button>
                            )}

                            {/* JIKA STATUS: SIAP DIAMBIL / DOKUMEN DIGITAL -> TOMBOL TANDAI SELESAI */}
                            {(item.status.includes("Siap") || item.status.includes("Dokumen Digital")) && (
                              <button
                                onClick={() => handleMarkCompleted(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                                title="Tandai layanan telah tuntas diserahkan ke warga"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Selesai</span>
                              </button>
                            )}

                            {/* TOMBOL LIHAT DETAIL */}
                            <button
                              onClick={() => setSelectedSurat(item)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Lihat detail lengkap berkas & riwayat"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL 1: TERUSKAN KE KEPALA DESA */}
      {/* ========================================================================= */}
      {forwardModalSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-900 text-white">
              <div className="flex items-center gap-2.5">
                <Send className="w-5 h-5 text-[#C5D82F]" />
                <div>
                  <h3 className="text-base font-black">Teruskan Surat ke Kepala Desa</h3>
                  <p className="text-[11px] text-purple-200">Pengajuan nomor resi {forwardModalSurat.id}</p>
                </div>
              </div>

              <button
                onClick={() => setForwardModalSurat(null)}
                className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-purple-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmForward} className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                <p className="font-bold flex items-center justify-between">
                  <span>{forwardModalSurat.jenis_surat}</span>
                  <span className="text-[10px] font-mono bg-purple-200 px-2 py-0.5 rounded-md">Wajib TTD Kades</span>
                </p>
                <p className="text-[11px] text-purple-800">
                  Pemohon: <strong>{forwardModalSurat.nama_pemohon}</strong> ({forwardModalSurat.rw_pemohon})
                </p>
                <p className="text-[11px] text-purple-700 italic">
                  Keperluan: "{forwardModalSurat.keperluan}"
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan / Rekomendasi Staf Pelayanan untuk Kades</label>
                <textarea
                  rows={3}
                  value={forwardNote}
                  onChange={(e) => setForwardNote(e.target.value)}
                  placeholder="Tuliskan catatan verifikasi berkas untuk membantu Kepala Desa mengambil keputusan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setForwardModalSurat(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isForwarding}
                  className="px-5 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-black text-xs shadow-[0_4px_0_#3b0764] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  {isForwarding ? "Meneruskan..." : "Kirim ke Meja Kades"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL 2: PROSES & TERBITKAN SURAT (PILIHAN CETAK VS SOFT FILE) */}
      {/* ========================================================================= */}
      {issueModalSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#064E3B] text-white">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-[#C5D82F]" />
                <div>
                  <h3 className="text-base font-black">Proses & Terbitkan Surat Warga</h3>
                  <p className="text-[11px] text-emerald-200">
                    Resi: {issueModalSurat.id} • {issueModalSurat.nama_pemohon}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIssueModalSurat(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmIssue} className="p-6 space-y-5 text-xs">
              
              {/* PILIHAN METODE PENYERAHAN */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block text-sm">
                  Pilih Format & Metode Penyerahan Hasil Akhir:
                </label>

                <div className="grid grid-cols-2 gap-3">
                  
                  {/* OPSI 1: CETAK FISIK (AMBIL DI BALAI DESA) */}
                  <div
                    onClick={() => setDeliveryMethod("cetak")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                      deliveryMethod === "cetak"
                        ? "border-[#064E3B] bg-emerald-50/60 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-[#C5D82F] flex items-center justify-center">
                        <Printer className="w-4 h-4" />
                      </div>
                      <input
                        type="radio"
                        checked={deliveryMethod === "cetak"}
                        onChange={() => setDeliveryMethod("cetak")}
                        className="accent-[#064E3B] w-4 h-4"
                      />
                    </div>
                    <p className="font-black text-slate-900 text-xs pt-1">Surat Cetak Fisik</p>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Warga mengambil surat bertanda tangan basah & stempel di Balai Desa / Kelurahan.
                    </p>
                  </div>

                  {/* OPSI 2: SOFT FILE DIGITAL (PDF LANGSUNG DIUNDUH USER) */}
                  <div
                    onClick={() => setDeliveryMethod("softfile")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                      deliveryMethod === "softfile"
                        ? "border-[#064E3B] bg-emerald-50/60 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-teal-700 text-[#C5D82F] flex items-center justify-center">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <input
                        type="radio"
                        checked={deliveryMethod === "softfile"}
                        onChange={() => setDeliveryMethod("softfile")}
                        className="accent-[#064E3B] w-4 h-4"
                      />
                    </div>
                    <p className="font-black text-slate-900 text-xs pt-1">Soft File Digital (PDF)</p>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Dokumen digital terverifikasi langsung terbit di akun warga & bisa diunduh langsung.
                    </p>
                  </div>

                </div>
              </div>

              {/* JIKA MEMILIH SURAT CETAK FISIK */}
              {deliveryMethod === "cetak" && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Lokasi Loket Pengambilan</label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Jam Operasional Pelayanan</label>
                      <input
                        type="text"
                        value={pickupHours}
                        onChange={(e) => setPickupHours(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Persyaratan Pengambilan</label>
                      <input
                        type="text"
                        value={pickupRequirement}
                        onChange={(e) => setPickupRequirement(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* JIKA MEMILIH SOFT FILE DIGITAL */}
              {deliveryMethod === "softfile" && (
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="font-bold text-teal-900">Tautan Dokumen Soft File PDF</label>
                    <input
                      type="text"
                      value={softfileUrl}
                      onChange={(e) => setSoftfileUrl(e.target.value)}
                      placeholder="https://... atau biarkan default server storage"
                      className="w-full px-3 py-2 rounded-xl border border-teal-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                    />
                    <span className="text-[10px] text-teal-700">
                      Tautan dokumen akan otomatis muncul pada tombol unduh di halaman pelacakan status warga.
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-teal-900">Catatan Khusus untuk Warga</label>
                    <textarea
                      rows={2}
                      value={issueNote}
                      onChange={(e) => setIssueNote(e.target.value)}
                      placeholder="Contoh: Surat keterangan resmi telah disahkan dengan tanda tangan elektronik. Silakan cetak mandiri jika diperlukan."
                      className="w-full px-3 py-2 rounded-xl border border-teal-200 text-xs focus:outline-none focus:border-teal-600 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TOMBOL AKSI MODAL */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIssueModalSurat(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isIssuing}
                  className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#054030] text-white font-black text-xs shadow-[0_4px_0_#02261c] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  {isIssuing ? "Menerbitkan..." : "Konfirmasi & Terbitkan Surat"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL 3: DETAIL LENGKAP BERKAS & LAMPIRAN */}
      {/* ========================================================================= */}
      {selectedSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#C5D82F]" />
                <div>
                  <h3 className="text-base font-black">Detail Berkas Permohonan Warga</h3>
                  <p className="text-[11px] text-slate-300">Resi Nomor: {selectedSurat.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSurat(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* KARTU IDENTITAS */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Pemohon</span>
                  <p className="text-sm font-black text-slate-900">{selectedSurat.nama_pemohon}</p>
                  <p className="font-mono text-slate-500 mt-0.5">{selectedSurat.nik_pemohon}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Wilayah Domisili</span>
                  <p className="text-sm font-black text-emerald-800">{selectedSurat.rw_pemohon} Sawotratap</p>
                  <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{selectedSurat.telepon_pemohon}</span>
                  </p>
                </div>
              </div>

              {/* JENIS SURAT & KEPERLUAN */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Jenis Surat yang Dimohon:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${selectedSurat.butuh_kades ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {selectedSurat.butuh_kades ? "Wajib Persetujuan Kades" : "Cukup Staf Admin"}
                  </span>
                </div>
                <p className="text-sm font-black text-slate-900">{selectedSurat.jenis_surat}</p>
                
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">Keperluan:</span>
                  "{selectedSurat.keperluan}"
                </div>
              </div>

              {/* LAMPIRAN BERKAS YANG DIUNGGAH */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">
                  Dokumen Persyaratan yang Diunggah ({selectedSurat.berkas_urls?.length || 0}):
                </span>

                {Array.isArray(selectedSurat.berkas_urls) && selectedSurat.berkas_urls.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSurat.berkas_urls.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 hover:border-emerald-400 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 truncate">{file.name}</p>
                            <span className="text-[10px] text-slate-400">
                              {file.is_hasil_akhir ? "Dokumen Hasil Akhir Terbit" : "Dokumen Persyaratan Warga"}
                            </span>
                          </div>
                        </div>

                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#064E3B] text-white text-[11px] font-bold hover:bg-[#054030] transition-colors shrink-0"
                        >
                          Lihat / Unduh
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Pemohon tidak mengunggah berkas lampiran.</p>
                )}
              </div>

              {/* STATUS & CATATAN TERKINI */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800">Status Saat Ini:</span>
                <p className="font-black text-amber-950 text-xs">{selectedSurat.status}</p>
                <p className="text-[11px] text-amber-900 leading-relaxed mt-1">
                  Catatan: {selectedSurat.catatan}
                </p>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedSurat(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Tutup Detail
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

      {/* POPUP KONFIRMASI (CUSTOM MODAL) */}
      <ConfirmDeleteModal
        isOpen={completeConfirmItem !== null}
        title="Selesaikan Pelayanan Surat?"
        message="Apakah Anda yakin ingin menandai pelayanan surat ini telah SELESAI TUNTAS? Dokumen telah diserahkan dan proses administrasi desa telah rampung."
        itemName={completeConfirmItem ? `${completeConfirmItem.id} - ${completeConfirmItem.nama_pemohon} (${completeConfirmItem.jenis_surat})` : undefined}
        confirmText="Ya, Selesaikan"
        isLoading={isCompleting}
        onConfirm={executeMarkCompleted}
        onCancel={() => setCompleteConfirmItem(null)}
      />
    </div>
  );
}
