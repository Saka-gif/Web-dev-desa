"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Store,
  Coins,
  Newspaper,
  Users,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
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
  Home,
  Check,
  AlertTriangle,
  Award,
  Stamp,
  FileCheck,
  FolderArchive,
  Wrench,
} from "lucide-react";
import Link from "next/link";
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

export default function KadesDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [suratList, setSuratList] = useState<SuratItem[]>([]);
  const [isLoadingSurat, setIsLoadingSurat] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Ambil data asli dari API Supabase
  const fetchSuratData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/surat");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSuratList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat data surat kades:", err);
    } finally {
      setIsLoadingSurat(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuratData();
  }, []);

  // Filter surat yang membutuhkan TTD Kades atau di meja Kades
  const suratMenungguKades = suratList.filter(
    (s) => s.status === "Menunggu Persetujuan Kades"
  );
  const suratDisetujuiKades = suratList.filter(
    (s) => s.status === "Disetujui Kades" || s.step >= 3
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 font-sans flex flex-col lg:flex-row antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR KHUSUS KEPALA DESA (PATOKAN TUNGGAL RESMI) */}
      {/* ========================================================================= */}
      <KadesSidebar
        activeItem={activeMenu as any}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectMenu={(menu) => setActiveMenu(menu)}
      />

      {/* ========================================================================= */}
      {/* 2. AREA KONTEN UTAMA DASHBOARD KADES */}
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
                <span className="text-slate-800 font-bold">Dashboard Kades</span>
                <span>/</span>
                <span className="text-slate-500">Ruang Kerja Eksekutif</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] leading-tight">
                Ruang Kerja & Pengawasan Kepala Desa
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

            {/* TOMBOL CEPAT DISPOSISI KADES */}
            <Link
              href="/kades/surat"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#064E3B] hover:bg-[#085a44] transition-all shadow-2xs"
            >
              <Stamp className="w-3.5 h-3.5 text-amber-300" />
              <span>Meja Disposisi</span>
              {suratMenungguKades.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {suratMenungguKades.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* BODY KONTEN */}
        <div className="p-4 sm:p-8 space-y-8 max-w-7xl">

          {/* BANNER SAMBUTAN KADES */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#093529] to-[#042019] text-white p-6 sm:p-8 shadow-md border border-emerald-800">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sistem Informasi Eksekutif Desa Sawotratap</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Selamat Datang, Bapak Kepala Desa
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                  {suratMenungguKades.length > 0 ? (
                    <>
                      Terdapat <strong className="text-amber-300 underline font-black">{suratMenungguKades.length} permohonan surat warga</strong> yang saat ini menunggu persetujuan dan tanda tangan basah/digital Anda hari ini.
                    </>
                  ) : (
                    "Semua permohonan surat khusus Kepala Desa telah ditindaklanjuti. Pelayanan administrasi berjalan tertib dan lancar."
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/kades/surat"
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#06261D] text-xs font-black shadow-[0_3px_0_0_#b48108] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                >
                  <Stamp className="w-4 h-4" />
                  <span>Buka Verifikasi Surat Kades</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 4 STATISTIK KARTU EKSEKUTIF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* CARD 1: SURAT MENUNGGU KADES */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8ECE7] shadow-2xs relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Menunggu TTD Kades
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Stamp className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {isLoadingSurat ? "..." : suratMenungguKades.length}
                </span>
                <span className="text-xs text-amber-700 font-bold">Berkas Siap Tinjau</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">SKTM, N1 Nikah, Ahli Waris</span>
                <Link href="/kades/surat" className="text-amber-800 font-black hover:underline flex items-center gap-0.5">
                  Proses <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* CARD 2: SURAT TELAH DISETUJUI KADES */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8ECE7] shadow-2xs relative overflow-hidden group hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Surat Telah Disetujui
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {isLoadingSurat ? "..." : suratDisetujuiKades.length}
                </span>
                <span className="text-xs text-emerald-700 font-bold">Telah Diteruskan ke Admin</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Siap Cetak / Terbit Softfile</span>
                <span className="text-emerald-700 font-bold">100% Valid</span>
              </div>
            </div>

            {/* CARD 3: REALISASI ANGGARAN APBD */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8ECE7] shadow-2xs relative overflow-hidden group hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Realisasi APBDes 2026
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">Rp 2,45 M</span>
                <span className="text-xs text-blue-700 font-bold">Pagu Terserap</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Transparansi Publik</span>
                <span className="text-blue-700 font-bold">Akuntabel</span>
              </div>
            </div>

            {/* CARD 4: WARGA & ADUAN */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8ECE7] shadow-2xs relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pelayanan & Aspirasi
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">12.840</span>
                <span className="text-xs text-slate-500 font-bold">Jiwa Warga</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">2 Aspirasi Menunggu Respon</span>
                <span className="text-amber-700 font-bold">8 RW Aktif</span>
              </div>
            </div>

          </div>

          {/* TABEL DISPOSISI MENDESAK KEPALA DESA */}
          <div className="bg-white rounded-3xl border border-[#E8ECE7] shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-[#F0F2F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900 tracking-tight">
                    Disposisi Surat Menunggu Persetujuan Anda
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900">
                    {suratMenungguKades.length} Berkas
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Surat resmi yang memerlukan pertimbangan dan tanda tangan basah / persetujuan langsung Kepala Desa
                </p>
              </div>

              <Link
                href="/kades/surat"
                className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-black shadow-[0_3px_0_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Buka Seluruh Berkas Kades</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingSurat ? (
              <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
                <p>Memuat data antrean surat Kepala Desa dari database...</p>
              </div>
            ) : suratMenungguKades.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3 px-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-800 text-base">Meja Disposisi Bersih!</p>
                <p className="text-xs text-slate-400 max-w-md">
                  Saat ini tidak ada permohonan surat yang tertahan di meja Kepala Desa. Semua berkas telah ditandatangani.
                </p>
                <Link
                  href="/kades/surat"
                  className="mt-2 text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  Lihat Riwayat Surat yang Telah Disetujui <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAFBF9] border-b border-[#F0F2F0] text-slate-500 font-black uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Nomor & Tanggal</th>
                      <th className="py-3 px-4">Jenis Surat Permohonan</th>
                      <th className="py-3 px-4">Identitas Pemohon</th>
                      <th className="py-3 px-4">Keperluan</th>
                      <th className="py-3 px-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F5F2]">
                    {suratMenungguKades.slice(0, 5).map((surat) => (
                      <tr key={surat.id} className="hover:bg-[#F9FBFA] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          <div>{surat.id}</div>
                          <span className="text-[10px] text-slate-400 font-sans font-normal">
                            {surat.created_at ? new Date(surat.created_at).toLocaleDateString("id-ID") : "Hari ini"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-black text-slate-900">{surat.jenis_surat}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            Wajib TTD Kades
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{surat.nama_pemohon}</p>
                          <p className="text-[10px] text-slate-400">
                            NIK: {surat.nik_pemohon} • <span className="font-bold text-slate-600">{surat.rw_pemohon}</span>
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={surat.keperluan}>
                          {surat.keperluan}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Link
                            href="/kades/surat"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white font-extrabold text-[11px] shadow-[0_2px_0_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Tinjau & Setujui</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* KOTAK TRANSPARANSI DOKUMEN & INTEGRASI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8ECE7] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h5 className="font-black text-sm">SOP Otoritas Pengesahan Dokumen Kades</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Sesuai Permendagri dan Perdes Sawotratap, dokumen seperti <strong>SKTM</strong>, <strong>Pengantar Nikah (N1-N4)</strong>, serta <strong>Surat Keterangan Ahli Waris</strong> wajib mendapatkan verifikasi dan persetujuan Kepala Desa. Setelah Bapak menekan tombol Setujui, status akan otomatis beralih dan loket admin dapat langsung memproses cetak stempel atau upload PDF ke pemohon.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8ECE7] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h5 className="font-black text-sm">Integritas Data Terkoneksi Supabase</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Semua tindakan persetujuan (ACC) dan penolakan langsung disinkronkan ke tabel database utama <code>pengajuan_surat</code>. Warga dapat memantau status secara langsung pada tracker resi surat mereka, menciptakan pelayanan publik yang transparan dan akuntabel.
              </p>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
