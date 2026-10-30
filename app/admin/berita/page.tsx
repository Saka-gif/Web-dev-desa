"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Newspaper,
  FileText,
  Calendar,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Filter,
  Check,
  Send,
  Image as ImageIcon,
} from "lucide-react";
import AdminSidebar from "@/app/components/admin-sidebar";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";
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

export default function AdminBeritaManagementPage() {
  const [activeTab, setActiveTab] = useState<"berita" | "pengumuman" | "agenda">("berita");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data lists
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [pengumumanList, setPengumumanList] = useState<PengumumanItem[]>([]);
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);

  // Modal Form State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields Berita
  const [formBerita, setFormBerita] = useState<{
    id?: string;
    judul: string;
    ringkasan: string;
    kategori: string;
    penulis: string;
    tanggal: string;
    badge: string;
    fotoUrl: string;
    fileFoto: File | null;
  }>({
    judul: "",
    ringkasan: "",
    kategori: "berita",
    penulis: "Humas Pemdes",
    tanggal: "",
    badge: "Kabar Desa",
    fotoUrl: "",
    fileFoto: null,
  });

  // Form Fields Pengumuman
  const [formPengumuman, setFormPengumuman] = useState<{
    id?: string;
    nomor: string;
    judul: string;
    waktu: string;
    lokasi: string;
    syarat: string;
    status: string;
    status_color: string;
  }>({
    nomor: "",
    judul: "",
    waktu: "",
    lokasi: "Balai Desa Sawotratap",
    syarat: "Membawa KTP & KK Asli",
    status: "Layanan Terbuka",
    status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  });

  // Form Fields Agenda
  const [formAgenda, setFormAgenda] = useState<{
    id?: string;
    kegiatan: string;
    tanggal: string;
    jam: string;
    lokasi: string;
  }>({
    kegiatan: "",
    tanggal: "",
    jam: "09.00 WIB",
    lokasi: "Balai Desa Sawotratap",
  });

  // Preview & Delete State
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "berita" | "pengumuman" | "agenda";
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: "berita",
    id: "",
    title: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Success Modal
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Fetch All Data
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
      console.warn("Gagal fetch data warta admin:", err);
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

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormMode("add");
    if (activeTab === "berita") {
      setFormBerita({
        judul: "",
        ringkasan: "",
        kategori: "berita",
        penulis: "Humas Pemdes",
        tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        badge: "Kabar Desa",
        fotoUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1000",
        fileFoto: null,
      });
    } else if (activeTab === "pengumuman") {
      setFormPengumuman({
        nomor: `140/${Date.now().toString().slice(-3)}/2026`,
        judul: "",
        waktu: "Berlaku mulai hari ini",
        lokasi: "Pendopo Balai Desa",
        syarat: "Membawa KTP & KK Asli",
        status: "Layanan Terbuka",
        status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      });
    } else {
      setFormAgenda({
        kegiatan: "",
        tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        jam: "09.00 WIB",
        lokasi: "Balai Desa Sawotratap",
      });
    }
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: any) => {
    setFormMode("edit");
    if (activeTab === "berita") {
      setFormBerita({
        id: item.id,
        judul: item.judul,
        ringkasan: item.ringkasan,
        kategori: item.kategori || "berita",
        penulis: item.penulis,
        tanggal: item.tanggal,
        badge: item.badge,
        fotoUrl: item.foto,
        fileFoto: null,
      });
    } else if (activeTab === "pengumuman") {
      setFormPengumuman({
        id: item.id,
        nomor: item.nomor,
        judul: item.judul,
        waktu: item.waktu,
        lokasi: item.lokasi,
        syarat: item.syarat,
        status: item.status,
        status_color: item.status_color || "bg-emerald-100 text-emerald-800 border-emerald-300",
      });
    } else {
      setFormAgenda({
        id: item.id,
        kegiatan: item.kegiatan,
        tanggal: item.tanggal,
        jam: item.jam,
        lokasi: item.lokasi,
      });
    }
    setIsFormModalOpen(true);
  };

  // Submit Form (Add / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", activeTab);

      if (activeTab === "berita") {
        if (formMode === "edit" && formBerita.id) formData.append("id", formBerita.id);
        formData.append("judul", formBerita.judul);
        formData.append("ringkasan", formBerita.ringkasan);
        formData.append("kategori", formBerita.kategori);
        formData.append("penulis", formBerita.penulis);
        formData.append("tanggal", formBerita.tanggal);
        formData.append("badge", formBerita.badge);
        formData.append("fotoUrl", formBerita.fotoUrl);
        if (formBerita.fileFoto) {
          formData.append("foto", formBerita.fileFoto);
        }
      } else if (activeTab === "pengumuman") {
        if (formMode === "edit" && formPengumuman.id) formData.append("id", formPengumuman.id);
        formData.append("nomor", formPengumuman.nomor);
        formData.append("judul", formPengumuman.judul);
        formData.append("waktu", formPengumuman.waktu);
        formData.append("lokasi", formPengumuman.lokasi);
        formData.append("syarat", formPengumuman.syarat);
        formData.append("status", formPengumuman.status);
        formData.append("status_color", formPengumuman.status_color);
      } else {
        if (formMode === "edit" && formAgenda.id) formData.append("id", formAgenda.id);
        formData.append("kegiatan", formAgenda.kegiatan);
        formData.append("tanggal", formAgenda.tanggal);
        formData.append("jam", formAgenda.jam);
        formData.append("lokasi", formAgenda.lokasi);
      }

      const method = formMode === "add" ? "POST" : "PUT";
      const res = await fetch("/api/admin/berita", {
        method,
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setIsFormModalOpen(false);
        setSuccessModalData({
          isOpen: true,
          title: formMode === "add" ? "Berhasil Diterbitkan!" : "Perubahan Tersimpan!",
          message:
            formMode === "add"
              ? `Data ${activeTab} baru telah berhasil dipublikasikan ke database dan otomatis tayang di web publik.`
              : `Informasi ${activeTab} telah berhasil diperbarui dan disinkronkan secara realtime.`,
        });
        fetchData();
      } else {
        alert("Gagal menyimpan data: " + json.message);
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Konfirmasi Delete
  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/berita?type=${deleteModal.type}&id=${deleteModal.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteModal({ isOpen: false, type: "berita", id: "", title: "" });
        setSuccessModalData({
          isOpen: true,
          title: "Data Berhasil Dihapus",
          message: "Data telah berhasil dihapus dari database warta desa.",
        });
        fetchData();
      } else {
        console.error("Gagal menghapus data:", json.message);
      }
    } catch (err: any) {
      console.error("Terjadi kesalahan:", err.message);
    } finally {
      setIsDeleting(false);
    }
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
      {/* 1. SIDEBAR ADMIN RESMI */}
      <AdminSidebar
        activeItem="berita"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. AREA KONTEN UTAMA */}
      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col min-h-screen">
        {/* TOPBAR HEADER ADMIN */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E3E8E2] px-4 sm:px-8 py-4">
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
                    Warta & Pusat Informasi
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-[#064E3B] border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Supabase Live Realtime
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Kelola berita desa, edaran resmi, dan jadwal agenda yang langsung terhubung ke landing page & pusat informasi.
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Segarkan Data</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-black transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C5D82F]" />
                <span>
                  Tambah {activeTab === "berita" ? "Berita" : activeTab === "pengumuman" ? "Pengumuman" : "Agenda"}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* BODY CONTENT */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* TAB SWITCHER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
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

          {/* TAB 1: BERITA & ARTIKEL */}
          {activeTab === "berita" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-800 mb-3" />
                  <p className="text-xs font-bold text-slate-600">Memuat basis data berita desa...</p>
                </div>
              ) : filteredBerita.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-black text-slate-800">Belum ada berita ditemukan</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Klik tombol "Tambah Berita" di atas untuk mempublikasikan artikel pertama ke landing page.
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

                      {/* ACTIONS */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          ID: {item.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                type: "berita",
                                id: item.id,
                                title: item.judul,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAPAN PENGUMUMAN */}
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
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Buat pengumuman atau surat edaran warga baru dengan menekan tombol di atas.
                  </p>
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

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              type: "pengumuman",
                              id: item.id,
                              title: item.judul,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AGENDA KEGIATAN DESA */}
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
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Tambah jadwal musyawarah, posyandu, atau kerja bakti warga desa.
                  </p>
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
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEdit(item)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-xs"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteModal({
                                      isOpen: true,
                                      type: "agenda",
                                      id: item.id,
                                      title: item.kegiatan,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL FORM TAMBAH / EDIT */}
      {/* ========================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center font-bold">
                  {activeTab === "berita" ? <Newspaper className="w-5 h-5" /> : activeTab === "pengumuman" ? <FileText className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {formMode === "add" ? "Tambah" : "Edit"} {activeTab === "berita" ? "Berita Baru" : activeTab === "pengumuman" ? "Pengumuman Resmi" : "Agenda Kegiatan"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Data akan otomatis disinkronkan ke database Supabase dan tayang di website.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* FORM BERITA */}
              {activeTab === "berita" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Judul Berita *</label>
                    <input
                      type="text"
                      required
                      value={formBerita.judul}
                      onChange={(e) => setFormBerita({ ...formBerita, judul: e.target.value })}
                      placeholder="Contoh: Gotong Royong Massal Drainase RW 01–11"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Ringkasan / Isi Berita *</label>
                    <textarea
                      required
                      rows={4}
                      value={formBerita.ringkasan}
                      onChange={(e) => setFormBerita({ ...formBerita, ringkasan: e.target.value })}
                      placeholder="Tuliskan intisari informasi berita atau artikel..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Kategori / Badge *</label>
                      <input
                        type="text"
                        required
                        value={formBerita.badge}
                        onChange={(e) => setFormBerita({ ...formBerita, badge: e.target.value })}
                        placeholder="Contoh: Lingkungan, Ekonomi, Layanan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Penulis / Rilis *</label>
                      <input
                        type="text"
                        required
                        value={formBerita.penulis}
                        onChange={(e) => setFormBerita({ ...formBerita, penulis: e.target.value })}
                        placeholder="Contoh: Humas Pemdes, PTSP Desa"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tanggal Publikasi</label>
                    <input
                      type="text"
                      value={formBerita.tanggal}
                      onChange={(e) => setFormBerita({ ...formBerita, tanggal: e.target.value })}
                      placeholder="Contoh: 30 Okt 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  {/* FOTO BERITA */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700">Foto Thumbnail Berita</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormBerita({ ...formBerita, fileFoto: file });
                        }}
                        className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] text-slate-400">Atau gunakan URL gambar online:</span>
                      <input
                        type="url"
                        value={formBerita.fotoUrl}
                        onChange={(e) => setFormBerita({ ...formBerita, fotoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* FORM PENGUMUMAN */}
              {activeTab === "pengumuman" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nomor Surat Edaran *</label>
                      <input
                        type="text"
                        required
                        value={formPengumuman.nomor}
                        onChange={(e) => setFormPengumuman({ ...formPengumuman, nomor: e.target.value })}
                        placeholder="Contoh: 140/082/2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Status Pengumuman *</label>
                      <select
                        value={formPengumuman.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          let col = "bg-emerald-100 text-emerald-800 border-emerald-300";
                          if (val === "Penting / Segera") col = "bg-rose-100 text-rose-800 border-rose-300";
                          if (val === "Batas Waktu") col = "bg-amber-100 text-amber-800 border-amber-300";
                          setFormPengumuman({ ...formPengumuman, status: val, status_color: col });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                      >
                        <option value="Layanan Terbuka">Layanan Terbuka (Hijau)</option>
                        <option value="Penting / Segera">Penting / Segera (Merah)</option>
                        <option value="Batas Waktu">Batas Waktu (Kuning)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Judul Pengumuman *</label>
                    <input
                      type="text"
                      required
                      value={formPengumuman.judul}
                      onChange={(e) => setFormPengumuman({ ...formPengumuman, judul: e.target.value })}
                      placeholder="Contoh: Penyaluran BLT Dana Desa Triwulan IV"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Waktu Pelaksanaan *</label>
                      <input
                        type="text"
                        required
                        value={formPengumuman.waktu}
                        onChange={(e) => setFormPengumuman({ ...formPengumuman, waktu: e.target.value })}
                        placeholder="Contoh: 28 – 30 Oktober 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Lokasi Pelaksanaan *</label>
                      <input
                        type="text"
                        required
                        value={formPengumuman.lokasi}
                        onChange={(e) => setFormPengumuman({ ...formPengumuman, lokasi: e.target.value })}
                        placeholder="Contoh: Pendopo Balai Desa"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Syarat / Ketentuan Berkas *</label>
                    <input
                      type="text"
                      required
                      value={formPengumuman.syarat}
                      onChange={(e) => setFormPengumuman({ ...formPengumuman, syarat: e.target.value })}
                      placeholder="Contoh: Bawa KTP & KK Asli"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>
                </>
              )}

              {/* FORM AGENDA */}
              {activeTab === "agenda" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nama Kegiatan Agenda *</label>
                    <input
                      type="text"
                      required
                      value={formAgenda.kegiatan}
                      onChange={(e) => setFormAgenda({ ...formAgenda, kegiatan: e.target.value })}
                      placeholder="Contoh: Musyawarah Perencanaan Desa (Musrenbangdes)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Tanggal Kegiatan *</label>
                      <input
                        type="text"
                        required
                        value={formAgenda.tanggal}
                        onChange={(e) => setFormAgenda({ ...formAgenda, tanggal: e.target.value })}
                        placeholder="Contoh: 18 Nov 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Jam Kegiatan *</label>
                      <input
                        type="text"
                        required
                        value={formAgenda.jam}
                        onChange={(e) => setFormAgenda({ ...formAgenda, jam: e.target.value })}
                        placeholder="Contoh: 09.00 WIB"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Lokasi Kegiatan *</label>
                    <input
                      type="text"
                      required
                      value={formAgenda.lokasi}
                      onChange={(e) => setFormAgenda({ ...formAgenda, lokasi: e.target.value })}
                      placeholder="Contoh: Ruang Rapat Balai Desa"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#064E3B]"
                    />
                  </div>
                </>
              )}

              {/* ACTION FOOTER */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#C5D82F]" />
                      <span>{formMode === "add" ? "Terbitkan Sekarang" : "Simpan Perubahan"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL KONFIRMASI HAPUS (CUSTOM POPUP) */}
      {/* ========================================================= */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title={`Hapus Data ${deleteModal.type === "berita" ? "Berita" : deleteModal.type === "pengumuman" ? "Pengumuman" : "Agenda"}?`}
        message="Apakah Anda yakin ingin menghapus data ini dari database warta desa? Tindakan ini tidak dapat dibatalkan."
        itemName={deleteModal.title}
        confirmText="Ya, Hapus Data"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, type: "berita", id: "", title: "" })}
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
