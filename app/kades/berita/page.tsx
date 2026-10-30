"use client";

import React, { useState, useEffect } from "react";
import {
  Newspaper,
  FileText,
  Calendar,
  Search,
  Eye,
  RefreshCw,
  ExternalLink,
  Clock,
  MapPin,
  Menu,
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Tag,
  Share2,
} from "lucide-react";
import KadesSidebar from "@/app/components/kades-sidebar";
import { BeritaItem } from "@/app/data/berita";

interface PengumumanItem {
  id: string;
  nomor: string;
  judul: string;
  waktu: string;
  lokasi: string;
  syarat: string;
  status: string;
  status_color?: string;
  created_at?: string;
}

interface AgendaItem {
  id: string;
  tanggal: string;
  jam: string;
  kegiatan: string;
  lokasi: string;
  created_at?: string;
}

export default function KadesWartaMonitoringPage() {
  const [activeTab, setActiveTab] = useState<"berita" | "pengumuman" | "agenda">("berita");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data lists dari Database
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [pengumumanList, setPengumumanList] = useState<PengumumanItem[]>([]);
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);

  // Modal Detail Item (Read-Only)
  const [previewItem, setPreviewItem] = useState<{
    type: "berita" | "pengumuman" | "agenda";
    data: any;
  } | null>(null);

  // Fetch Data Publikasi dari Backend API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/berita");
      const json = await res.json();
      if (json.success) {
        setBeritaList(json.berita || []);
        setPengumumanList(json.pengumuman || []);
        setAgendaList(json.agenda || []);
      }
    } catch (err) {
      console.warn("Gagal memuat warta Kades:", err);
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

  // Filter Search
  const q = searchQuery.toLowerCase().trim();
  const filteredBerita = beritaList.filter(
    (b) => !q || b.judul.toLowerCase().includes(q) || b.ringkasan.toLowerCase().includes(q) || b.badge.toLowerCase().includes(q)
  );
  const filteredPengumuman = pengumumanList.filter(
    (p) => !q || p.judul.toLowerCase().includes(q) || p.nomor.toLowerCase().includes(q) || p.lokasi.toLowerCase().includes(q)
  );
  const filteredAgenda = agendaList.filter(
    (a) => !q || a.kegiatan.toLowerCase().includes(q) || a.lokasi.toLowerCase().includes(q) || a.tanggal.toLowerCase().includes(q)
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex font-sans antialiased">
      {/* 1. SIDEBAR RESMI MEJA KEPALA DESA */}
      <KadesSidebar
        activeItem="berita"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. KONTEN UTAMA MEJA KADES */}
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* TOPBAR HEADER MEJA KADES */}
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
                <Newspaper className="w-5 h-5 text-[#C5D82F]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                    Pengawasan Publikasi Warta Desa
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#064E3B] border border-emerald-300">
                    <Lock className="w-3 h-3 text-[#064E3B]" />
                    Mode Monitoring Eksekutif
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Meja Kepala Desa • Pemantauan rilis berita pembangunan, pengumuman resmi, dan jadwal agenda warga.
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
                href="/informasi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C5D82F]" />
                <span className="hidden sm:inline">Pusat Informasi Publik</span>
              </a>
            </div>
          </div>
        </header>

        {/* BODY MAIN */}
        <div className="p-4 sm:p-8 space-y-6 flex-1">
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
                Kepala Desa dapat memantau seluruh artikel rilis resmi, surat edaran, serta kalender agenda kegiatan yang dipublikasikan kepada masyarakat. Pembuatan dan penyuntingan konten dikelola operasional oleh Tim Humas & Admin Desa.
              </p>
            </div>
          </div>

          {/* 3 STAT CARDS RINGKASAN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shrink-0">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Berita & Artikel Rilis</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{beritaList.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Papan Pengumuman Resmi</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{pengumumanList.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Agenda Kegiatan Desa</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900">{agendaList.length}</p>
              </div>
            </div>
          </div>

          {/* TAB SWITCHER & SEARCH */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => { setActiveTab("berita"); setSearchQuery(""); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === "berita"
                    ? "bg-[#064E3B] text-white shadow-sm font-black"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Berita & Artikel ({beritaList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("pengumuman"); setSearchQuery(""); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === "pengumuman"
                    ? "bg-[#064E3B] text-white shadow-sm font-black"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Papan Pengumuman ({pengumumanList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("agenda"); setSearchQuery(""); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === "agenda"
                    ? "bg-[#064E3B] text-white shadow-sm font-black"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Agenda Kegiatan ({agendaList.length})</span>
              </button>
            </div>

            {/* SEARCH BOX */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#064E3B] shadow-xs"
              />
            </div>
          </div>

          {/* TAB 1: BERITA & ARTIKEL (READ-ONLY) */}
          {activeTab === "berita" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-800 mb-3" />
                  <p className="text-xs font-bold text-slate-600">Memuat warta publikasi desa...</p>
                </div>
              ) : filteredBerita.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-black text-slate-800">Tidak ada berita yang sesuai</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Sesuaikan kata kunci pencarian berita desa.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBerita.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* FOTO HEADER */}
                        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={item.foto}
                            alt={item.judul}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 shadow-sm">
                              {item.badge}
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                              {item.tanggal}
                            </span>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                            <span>{item.penulis}</span>
                            <span>•</span>
                            <span className="capitalize text-emerald-800">{item.kategori}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-2">
                            {item.judul}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            {item.ringkasan}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS: BACA LENGKAP */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          ID: {item.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewItem({ type: "berita", data: item })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#064E3B] hover:bg-emerald-50 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Baca Lengkap</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAPAN PENGUMUMAN (READ-ONLY) */}
          {activeTab === "pengumuman" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-800 mb-3" />
                  <p className="text-xs font-bold text-slate-600">Memuat pengumuman resmi...</p>
                </div>
              ) : filteredPengumuman.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-black text-slate-800">Belum ada pengumuman</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPengumuman.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-slate-400">
                            {item.nomor}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${item.status_color || "bg-emerald-100 text-emerald-800 border-emerald-300"}`}>
                            {item.status}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                          {item.judul}
                        </h3>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.waktu}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.lokasi}</span>
                          </div>
                          <div className="flex items-start gap-2 pt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-slate-500 text-[11px]">Syarat: {item.syarat}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          ID: {item.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewItem({ type: "pengumuman", data: item })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#064E3B] hover:bg-emerald-50 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rincian Edaran</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AGENDA KEGIATAN DESA (READ-ONLY) */}
          {activeTab === "agenda" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-800 mb-3" />
                  <p className="text-xs font-bold text-slate-600">Memuat agenda desa...</p>
                </div>
              ) : filteredAgenda.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-black text-slate-800">Belum ada agenda kegiatan</h3>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-6">Tanggal & Jam</th>
                          <th className="py-3 px-6">Nama Kegiatan</th>
                          <th className="py-3 px-6">Lokasi Pelaksanaan</th>
                          <th className="py-3 px-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAgenda.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#064E3B]" />
                                <div>
                                  <div>{item.tanggal}</div>
                                  <div className="text-[11px] font-normal text-slate-400">{item.jam}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-black text-slate-900 text-sm">
                              {item.kegiatan}
                            </td>
                            <td className="py-4 px-6 text-slate-600 font-medium">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{item.lokasi}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setPreviewItem({ type: "agenda", data: item })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#064E3B]" />
                                <span>Detail</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL PREVIEW DETAIL (READ-ONLY KHUSUS KADES)             */}
      {/* ========================================================= */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold">
                  {previewItem.type === "berita" ? (
                    <Newspaper className="w-4 h-4" />
                  ) : previewItem.type === "pengumuman" ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Inspeksi {previewItem.type === "berita" ? "Artikel Berita" : previewItem.type === "pengumuman" ? "Pengumuman Resmi" : "Agenda Kegiatan"}
                  </span>
                  <h3 className="text-base font-black text-slate-900 line-clamp-1">
                    {previewItem.data.judul || previewItem.data.kegiatan}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DETAIL BERITA */}
            {previewItem.type === "berita" && (
              <div className="space-y-4 text-xs">
                {previewItem.data.foto && (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={previewItem.data.foto}
                      alt={previewItem.data.judul}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#C5D82F] text-[10px] font-black">
                      {previewItem.data.badge}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-100 pb-2">
                  <span>Rilis: {previewItem.data.penulis}</span>
                  <span>{previewItem.data.tanggal}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-slate-900">{previewItem.data.judul}</h4>
                  <p className="text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                    {previewItem.data.ringkasan}
                  </p>
                </div>
              </div>
            )}

            {/* DETAIL PENGUMUMAN */}
            {previewItem.type === "pengumuman" && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono font-bold text-slate-500">{previewItem.data.nomor}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${previewItem.data.status_color || "bg-emerald-100 text-emerald-800"}`}>
                    {previewItem.data.status}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900">{previewItem.data.judul}</h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Waktu:</strong> {previewItem.data.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Lokasi:</strong> {previewItem.data.lokasi}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Syarat Berkas:</strong> {previewItem.data.syarat}</span>
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL AGENDA */}
            {previewItem.type === "agenda" && (
              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-black text-slate-900">{previewItem.data.kegiatan}</h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#064E3B] shrink-0" />
                    <span><strong>Hari & Tanggal:</strong> {previewItem.data.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Jam Kegiatan:</strong> {previewItem.data.jam}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Lokasi:</strong> {previewItem.data.lokasi}</span>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER MODAL (HANYA TUTUP) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Publikasi dikelola Humas Desa</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
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
