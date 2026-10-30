"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Store,
  Coins,
  Newspaper,
  Megaphone,
  Calendar,
  Users,
  Building2,
  FolderArchive,
  UserCheck,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Filter,
  Download,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Home,
  Check,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/app/components/admin-sidebar";

export default function AdminDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState("Tahun 2026");
  const [rwFilter, setRwFilter] = useState("Semua RW");
  const [searchTableQuery, setSearchTableQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal Buat Pengumuman / Aksi Cepat
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalKategori, setModalKategori] = useState("Pemberitahuan");
  const [modalIsi, setModalIsi] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  // Data Permohonan Surat (Simulasi terhubung live)
  const [daftarSurat, setDaftarSurat] = useState([
    {
      id: "SWT-2026-8842",
      nama: "Hadi Purnomo",
      nik: "3515112001000001",
      rw: "RW 03",
      jenisSurat: "Surat Keterangan Usaha (SKU / UMKM)",
      tanggal: "Hari ini, 09:30 WIB",
      status: "Antrean Verifikasi",
      statusColor: "bg-amber-100 text-amber-800 border-amber-300",
      keperluan: "Syarat pengajuan KUR BRI untuk usaha kerupuk puli.",
    },
    {
      id: "SWT-2026-8841",
      nama: "Siti Aminah",
      nik: "3515114508950001",
      rw: "RW 02",
      jenisSurat: "Surat Keterangan Domisili Tempat Tinggal",
      tanggal: "Hari ini, 08:15 WIB",
      status: "Pemeriksaan Berkas",
      statusColor: "bg-blue-100 text-blue-800 border-blue-300",
      keperluan: "Pendaftaran sekolah anak di SMA Negeri 1 Gedangan.",
    },
    {
      id: "SWT-2026-8840",
      nama: "Budi Santoso",
      nik: "3515111204880003",
      rw: "RW 05",
      jenisSurat: "Surat Pengantar Catatan Kepolisian (SKCK)",
      tanggal: "Kemarin, 14:20 WIB",
      status: "Siap Diambil",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      keperluan: "Pemberkasan seleksi penerimaan PPPK Kabupaten Sidoarjo.",
    },
    {
      id: "SWT-2026-8839",
      nama: "Dewi Lestari",
      nik: "3515116709920004",
      rw: "RW 07",
      jenisSurat: "Surat Keterangan Belum Menikah",
      tanggal: "28 Okt 2026",
      status: "Siap Diambil",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      keperluan: "Pengurusan KPR Bank BTN perumahan bersubsidi.",
    },
    {
      id: "SWT-2026-8838",
      nama: "Ahmad Fauzi",
      nik: "3515111902800005",
      rw: "RW 01",
      jenisSurat: "Surat Keterangan Usaha (SKU / UMKM)",
      tanggal: "27 Okt 2026",
      status: "Antrean Verifikasi",
      statusColor: "bg-amber-100 text-amber-800 border-amber-300",
      keperluan: "Perluasan tempat usaha warung kelontong.",
    },
    {
      id: "SWT-2026-8837",
      nama: "Rina Kusuma",
      nik: "3515115206940006",
      rw: "RW 08",
      jenisSurat: "Surat Pengantar Nikah (N1 - N4)",
      tanggal: "26 Okt 2026",
      status: "Pemeriksaan Berkas",
      statusColor: "bg-blue-100 text-blue-800 border-blue-300",
      keperluan: "Pendaftaran akad nikah di KUA Kecamatan Gedangan.",
    },
  ]);

  // Data UMKM Menunggu ACC
  const [umkmMenunggu, setUmkmMenunggu] = useState([
    {
      id: "umkm-pending-1",
      nama: "Warung Kopi Krajan RW 03",
      pemilik: "Cak Joko",
      kategori: "Kuliner",
      harga: "Mulai Rp 5.000",
      rw: "RW 03",
      status: "menunggu",
    },
    {
      id: "umkm-pending-2",
      nama: "Dapur Sambal Bandeng Asap Bu Siti",
      pemilik: "Ibu Siti Rahayu",
      kategori: "Kuliner",
      harga: "Mulai Rp 20.000",
      rw: "RW 02",
      status: "menunggu",
    },
  ]);

  // Filter Permohonan Surat berdasarkan Search & RW
  const filteredSurat = daftarSurat.filter((item) => {
    const matchRw = rwFilter === "Semua RW" || item.rw === rwFilter;
    const q = searchTableQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.nama.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.jenisSurat.toLowerCase().includes(q) ||
      item.nik.includes(q);
    return matchRw && matchSearch;
  });

  // Sinkronisasi data live surat dari API backend
  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/surat");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setDaftarSurat(
          json.data.map((item: any) => ({
            id: item.id,
            nama: item.nama_pemohon,
            nik: item.nik_pemohon,
            rw: item.rw_pemohon,
            jenisSurat: item.jenis_surat,
            tanggal: item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Hari ini",
            status: item.status,
            statusColor: item.status_color || "bg-amber-100 text-amber-800 border-amber-300",
            keperluan: item.keperluan,
          }))
        );
      }
    } catch (e) {
      console.error("Gagal load surat di dashboard:", e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
    window.dispatchEvent(new Event("admin-data-updated"));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleAccUmkm = (id: string, nama: string) => {
    setUmkmMenunggu((prev) => prev.filter((u) => u.id !== id));
    window.dispatchEvent(new Event("admin-data-updated"));
    alert(`Usaha "${nama}" berhasil diverifikasi! Sekarang telah aktif dan tampil di etalase web desa.`);
  };

  const handleVerifikasiSurat = (id: string) => {
    setDaftarSurat((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "Siap Diambil",
              statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
            }
          : s
      )
    );
    window.dispatchEvent(new Event("admin-data-updated"));
    alert(`Surat dengan nomor resi ${id} berhasil diverifikasi dan status diubah menjadi "Siap Diambil".`);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setIsModalOpen(false);
      setModalTitle("");
      setModalIsi("");
      alert("Pengumuman resmi balai desa berhasil diterbitkan ke website!");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR PATOKAN RESMI ADMIN DESA (AUTO-SYNC REALTIME BADGES) */}
      {/* ========================================================================= */}
      <AdminSidebar
        activeItem="overview"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 2. AREA KONTEN UTAMA DASHBOARD */}
      {/* ========================================================================= */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* TOP NAVBAR / HEADER DASHBOARD */}
        <header className="h-16 px-6 sm:px-8 bg-white border-b border-[#E3E8E2] flex items-center justify-between sticky top-0 z-20">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-black text-[#111827]">
                Dashboard Tata Kelola Desa
              </h2>
            </div>
          </div>

          {/* SEARCH & TOMBOL AKSI 3D HIJAU TUA */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* SEARCH TOP */}
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari data warga, berkas, NIK..."
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* NOTIFIKASI BELL */}
            <div className="relative">
              <button
                onClick={() => alert("Notifikasi Sistem: Ada 2 pengajuan surat baru dan 1 laporan aduan lingkungan hari ini.")}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 relative transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>
            </div>

            {/* TOMBOL TIMBUL 3D HIJAU TUA (SESUAI REQUEST USER) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#054030] text-white px-4 sm:px-5 py-2 text-xs font-black shadow-[0_4px_0_#02261c] active:translate-y-1 active:shadow-[0_0px_0_#02261c] transition-all cursor-pointer select-none"
            >
              <Plus className="w-4 h-4 text-[#C5D82F] group-hover:rotate-90 transition-transform" />
              <span>Buat Pengumuman</span>
            </button>
          </div>

        </header>

        {/* ======================================================================= */}
        {/* ISI DASHBOARD UTAMA */}
        {/* ======================================================================= */}
        <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* BAR FILTER CEPAT & REFRESH */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E3E8E2] shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold text-slate-600">
              
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400 font-medium">Periode:</span>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="bg-transparent font-black text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Tahun 2026">Tahun Anggaran 2026</option>
                  <option value="Triwulan IV 2026">Triwulan IV (Okt-Des 2026)</option>
                  <option value="Bulan Ini">Bulan Oktober 2026</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400 font-medium">Wilayah:</span>
                <select
                  value={rwFilter}
                  onChange={(e) => setRwFilter(e.target.value)}
                  className="bg-transparent font-black text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Semua RW">Seluruh 11 RW</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => {
                    const r = `RW ${n < 10 ? "0" + n : n}`;
                    return <option key={r} value={r}>{r}</option>;
                  })}
                </select>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
                <span>Segarkan Data</span>
              </button>

              <button
                onClick={() => alert("Laporan rekapitulasi data berhasil diekspor ke format Excel (XLSX).")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Rekap</span>
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3. ROW KPI STATISTIK UTAMA (PERSIS ROW ATAS OBSCURA) */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* KPI 1: REALISASI APBD */}
            <div className="p-5 rounded-2xl bg-white border border-[#E3E8E2] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Realisasi Dana APBD
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-[#111827] tabular-nums">Rp 2.62 M</h3>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>91.9% Penyerapan Pagu</span>
                </div>
              </div>
            </div>

            {/* KPI 2: SURAT MASUK */}
            <div className="p-5 rounded-2xl bg-white border border-[#E3E8E2] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Pengajuan Surat
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-[#111827] tabular-nums">142 Berkas</h3>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>18 Perlu Verifikasi</span>
                </div>
              </div>
            </div>

            {/* KPI 3: ADUAN SELESAI */}
            <div className="p-5 rounded-2xl bg-white border border-[#E3E8E2] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Aspirasi & Aduan
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-[#111827] tabular-nums">38 Laporan</h3>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>94.7% Selesai Tuntas</span>
                </div>
              </div>
            </div>

            {/* KPI 4: UMKM TERDATA */}
            <div className="p-5 rounded-2xl bg-white border border-[#E3E8E2] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  UMKM Terdaftar
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-[#111827] tabular-nums">156 Usaha</h3>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{umkmMenunggu.length} Menunggu Verifikasi</span>
                </div>
              </div>
            </div>

            {/* KPI 5: DUAL CIRCULAR PROGRESS GAUGE (PERSIS SCREENSHOT OBSCURA 90% 25%) */}
            <div className="p-5 rounded-2xl bg-white border border-[#E3E8E2] shadow-xs flex items-center justify-around hover:shadow-md transition-shadow">
              
              <div className="text-center space-y-1">
                <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#064E3B]"
                      strokeDasharray="96, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-[#064E3B]">96%</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Kepuasan</p>
              </div>

              <div className="text-center space-y-1">
                <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#C5D82F]"
                      strokeDasharray="100, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-emerald-800">11/11</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">RW Aktif</p>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. ROW TENGAH: TABEL PERMOHONAN WARGA & SIDE CARDS */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* TABEL PERMOHONAN SURAT (8 COLS SEPERTI TOP WALLETS DI SCREENSHOT) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E3E8E2] p-6 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#111827]">
                      Permohonan Surat & Dokumen Warga Terkini
                    </h3>
                    <a
                      href="/admin/surat"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <span>Buka Alur Verifikasi Lengkap</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daftar antrean pengajuan surat mandiri online yang memerlukan tindakan petugas
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTableQuery}
                    onChange={(e) => setSearchTableQuery(e.target.value)}
                    placeholder="Filter nama pemohon / resi..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/70 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Pemohon</th>
                      <th className="py-3 px-3">Jenis Layanan</th>
                      <th className="py-3 px-3">Wilayah</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSurat.map((surat) => (
                      <tr key={surat.id} className="hover:bg-slate-50/70 transition-colors group">
                        
                        {/* PEMOHON */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
                              {surat.nama.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{surat.nama}</p>
                              <p className="font-mono text-[10px] text-slate-400 mt-0.5">{surat.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* JENIS SURAT */}
                        <td className="py-3.5 px-3">
                          <p className="font-medium text-slate-800 line-clamp-1">{surat.jenisSurat}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{surat.keperluan}</p>
                        </td>

                        {/* WILAYAH */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-600">{surat.rw}</span>
                        </td>

                        {/* STATUS */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${surat.statusColor}`}>
                            {surat.status}
                          </span>
                        </td>

                        {/* TOMBOL TINDAKAN 3D */}
                        <td className="py-3.5 px-3 text-right">
                          {surat.status === "Antrean Verifikasi" ? (
                            <button
                              onClick={() => handleVerifikasiSurat(surat.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#054030] text-white font-black text-[11px] shadow-[0_3px_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-[#C5D82F]" />
                              <span>Verif</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`Detail Berkas ${surat.id}\nPemohon: ${surat.nama}\nKeperluan: ${surat.keperluan}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-slate-500" />
                              <span>Detail</span>
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* KOLOM KANAN: RECENT ACTIVITY & UMKM PENDING (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* KARTU DAFTAR UMKM MENUNGGU ACC ADMIN */}
              <div className="bg-white rounded-3xl border border-[#E3E8E2] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#064E3B]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Pendaftaran UMKM Baru
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                    {umkmMenunggu.length} Perlu Review
                  </span>
                </div>

                {umkmMenunggu.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <span>Semua pendaftaran UMKM telah diverifikasi.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {umkmMenunggu.map((u) => (
                      <div
                        key={u.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5 overflow-hidden">
                          <p className="text-xs font-black text-slate-900 truncate">{u.nama}</p>
                          <p className="text-[10px] text-slate-500">{u.pemilik} • {u.rw}</p>
                          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {u.harga}
                          </span>
                        </div>

                        {/* TOMBOL 3D VERIF HIJAU TUA */}
                        <button
                          onClick={() => handleAccUmkm(u.id, u.nama)}
                          className="px-3 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#054030] text-white font-black text-[10px] uppercase shadow-[0_3px_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer"
                        >
                          Verif Usaha
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* KARTU LOG AKTIVITAS TERKINI (PERSIS RECENT ACTIVITY OBSCURA) */}
              <div className="bg-white rounded-3xl border border-[#E3E8E2] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Aktivitas Sistem Terkini
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Live Feed
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 leading-snug">
                        Siti Aminah mendaftar akun warga baru
                      </p>
                      <p className="text-[10px] text-slate-400">RW 02 Sawotratap • 10 menit lalu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 leading-snug">
                        Pengajuan Surat SKU #SWT-2026-8842 masuk antrean
                      </p>
                      <p className="text-[10px] text-slate-400">Pemohon: Hadi Purnomo • 25 menit lalu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 leading-snug">
                        Laporan aduan perbaikan PJU RW 07 ditindaklanjuti
                      </p>
                      <p className="text-[10px] text-slate-400">Seksi Trantib • 1 jam lalu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 leading-snug">
                        Update laporan realisasi APBDes Triwulan IV
                      </p>
                      <p className="text-[10px] text-slate-400">Kaur Keuangan • 2 jam lalu</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* 5. ROW BAWAH: STATISTIK PELAYANAN & DISTRIBUSI ANGGARAN (PERSIS OBSCURA) */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* WIDGET 1: STATISTIK PENGAJUAN SURAT MINGGUAN (BAR CHART MODERN) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E3E8E2] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Volume Pengurusan Surat Warga (7 Hari Terakhir)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Frekuensi permohonan surat administrasi kependudukan di loket online desa
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  142 Total Minggu Ini
                </span>
              </div>

              {/* SIMULASI VISUAL BAR CHART SEPERTI TRADING VOLUME OBSCURA */}
              <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                {[
                  { hari: "Sen", val: 65, surat: 28 },
                  { hari: "Sel", val: 85, surat: 34 },
                  { hari: "Rab", val: 95, surat: 41 },
                  { hari: "Kam", val: 75, surat: 30 },
                  { hari: "Jum", val: 60, surat: 24 },
                  { hari: "Sab", val: 40, surat: 16 },
                  { hari: "Min", val: 25, surat: 9 },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#064E3B] transition-colors">
                      {bar.surat}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-xl h-28 flex items-end overflow-hidden p-1">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-[#064E3B] to-[#047857] group-hover:to-[#C5D82F] transition-all duration-500"
                        style={{ height: `${bar.val}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">{bar.hari}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 2: DISTRIBUSI ALOKASI PROGRAM (STACKED BARS SEPERTI ORDER SIZE) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E3E8E2] p-6 shadow-xs space-y-4 flex flex-col justify-between">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Distribusi Realisasi Program APBDes
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Alokasi belanja fisik & pemberdayaan masyarakat Sawotratap
                  </p>
                </div>
              </div>

              {/* LEGEND BADGES SEPERTI SCREENSHOT */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Infrastruktur (48%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Pemberdayaan (24%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Kesehatan (15%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-purple-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Tata Kelola (13%)</span>
                </span>
              </div>

              {/* SIMULASI STACKED CHART */}
              <div className="space-y-3 pt-2">
                <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden">
                  <div style={{ width: "48%" }} className="bg-blue-500 h-full" title="Infrastruktur: Rp 1.25 M" />
                  <div style={{ width: "24%" }} className="bg-amber-500 h-full" title="Pemberdayaan UMKM: Rp 620 Jt" />
                  <div style={{ width: "15%" }} className="bg-emerald-500 h-full" title="Kesehatan & PMT: Rp 390 Jt" />
                  <div style={{ width: "13%" }} className="bg-purple-500 h-full" title="Tata Kelola SID: Rp 340 Jt" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Surplus Kas Cadangan</span>
                    <span className="text-base font-black text-[#064E3B]">Rp 230 Juta</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Status Verifikasi</span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Resmi Disahkan BPD</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 6. MODAL BUAT PENGUMUMAN RESMI (TOMBOL 3D HIJAU TUA) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#064E3B] text-white">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-[#C5D82F]" />
                <div>
                  <h3 className="text-base font-black">Buat Pengumuman Desa Baru</h3>
                  <p className="text-[11px] text-emerald-200">Akan langsung terbit di website portal resmi desa</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black">Pengumuman Diterbitkan!</h4>
                <p className="text-xs text-slate-500">
                  Warga Sawotratap sekarang dapat melihat edaran resmi ini di beranda dan halaman informasi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Judul Pengumuman *</label>
                  <input
                    type="text"
                    required
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    placeholder="Contoh: Jadwal Penyaluran BLT Dana Desa Triwulan I"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Kategori Edaran *</label>
                    <select
                      value={modalKategori}
                      onChange={(e) => setModalKategori(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      <option value="Pemberitahuan">Pemberitahuan Umum</option>
                      <option value="Pelayanan">Jadwal Pelayanan</option>
                      <option value="Penting">Penting / Segera</option>
                      <option value="Bansos">Bantuan Sosial</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Wilayah Sasaran</label>
                    <input
                      type="text"
                      defaultValue="Seluruh 11 RW Sawotratap"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Isi Pengumuman / Ketentuan Warga *</label>
                  <textarea
                    required
                    rows={4}
                    value={modalIsi}
                    onChange={(e) => setModalIsi(e.target.value)}
                    placeholder="Tuliskan tanggal, lokasi balai RW, berkas persyaratan yang harus dibawa..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>

                  {/* TOMBOL TIMBUL 3D HIJAU TUA */}
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#054030] text-white font-black text-xs shadow-[0_4px_0_#02261c] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                  >
                    Terbitkan Pengumuman
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
