"use client";

import React, { useState, useEffect } from "react";
import { DAFTAR_PRODUK_UMKM, UmkmItem } from "@/app/data/umkm";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  Megaphone,
  ShieldCheck,
  FileText,
  ExternalLink,
  ArrowRight,
  Search,
  MapPin,
  Clock,
  Star,
  PlusCircle,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Info,
} from "lucide-react";

export default function UmkmSection() {
  const [daftarUmkm, setDaftarUmkm] = useState<UmkmItem[]>(DAFTAR_PRODUK_UMKM);
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUmkm, setSelectedUmkm] = useState<UmkmItem | null>(null);

  // Modal Pendaftaran UMKM Warga
  const [isDaftarOpen, setIsDaftarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const [formDaftar, setFormDaftar] = useState({
    nama: "",
    kategori: "Kuliner",
    pemilik: "",
    nikPemilik: "",
    kontakWa: "",
    harga: "",
    lokasi: "",
    rw: "RW 01",
    deskripsiSingkat: "",
    deskripsiLengkap: "",
    jamOperasional: "08.00 - 20.00 WIB",
  });
  const [fileFoto, setFileFoto] = useState<File | null>(null);

  // Ambil data live dari Supabase (Hanya yang status = 'disetujui')
  const loadUmkmFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("umkm")
        .select("*")
        .eq("status", "disetujui")
        .order("urutan", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setDaftarUmkm(data);
      }
    } catch (err) {
      console.warn("Gagal mengambil data live UMKM dari Supabase, menggunakan data lokal:", err);
    }
  };

  useEffect(() => {
    loadUmkmFromSupabase();

    // Supabase Realtime Subscription: Update otomatis saat admin meng-ACC atau mengedit UMKM
    const channel = supabase
      .channel("realtime-umkm-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "umkm" }, () => {
        loadUmkmFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter UMKM berdasarkan Kategori & Search
  const filterProduk = daftarUmkm.filter((item) => {
    const matchKategori = kategoriAktif === "Semua" || item.kategori.toLowerCase() === kategoriAktif.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.nama.toLowerCase().includes(q) ||
      item.pemilik.toLowerCase().includes(q) ||
      item.lokasi.toLowerCase().includes(q) ||
      (item.rw && item.rw.toLowerCase().includes(q)) ||
      (item.deskripsi_singkat && item.deskripsi_singkat.toLowerCase().includes(q));
    return matchKategori && matchSearch;
  });

  // Hitung jumlah UMKM per kategori
  const hitungKategori = (kat: string) => {
    if (kat === "Semua") return daftarUmkm.length;
    return daftarUmkm.filter((u) => u.kategori.toLowerCase() === kat.toLowerCase()).length;
  };

  const KATEGORI_LIST = [
    { nama: "Semua Produk", kat: "Semua", icon: ShoppingBag, count: `${hitungKategori("Semua")} Produk` },
    { nama: "Kuliner & Jajanan", kat: "Kuliner", icon: Megaphone, count: `${hitungKategori("Kuliner")} UMKM` },
    { nama: "Kerajinan Tangan", kat: "Kerajinan", icon: ShieldCheck, count: `${hitungKategori("Kerajinan")} UMKM` },
    { nama: "Batik & Fashion", kat: "Fashion", icon: FileText, count: `${hitungKategori("Fashion")} UMKM` },
  ];

  // Helper link WhatsApp langsung tanya produk (tanpa keranjang)
  const getWaLink = (item: UmkmItem) => {
    const nomorWa = (item.kontak_wa || item.kontak || "6281234567801").replace(/[^0-9]/g, "");
    const cleanWa = nomorWa.startsWith("08") ? "62" + nomorWa.slice(1) : nomorWa;
    const pesan = `Halo ${item.pemilik || "Penjual"}, saya melihat produk *${item.nama}* di Website Resmi Desa Sawotratap. Boleh minta informasi ketersediaan dan pemesanan?`;
    return `https://wa.me/${cleanWa}?text=${encodeURIComponent(pesan)}`;
  };

  // Submit Pendaftaran UMKM Baru
  const handleDaftarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const fd = new FormData();
      fd.append("nama", formDaftar.nama);
      fd.append("kategori", formDaftar.kategori);
      fd.append("pemilik", formDaftar.pemilik);
      fd.append("nikPemilik", formDaftar.nikPemilik);
      fd.append("kontakWa", formDaftar.kontakWa);
      fd.append("harga", formDaftar.harga);
      fd.append("lokasi", formDaftar.lokasi);
      fd.append("rw", formDaftar.rw);
      fd.append("deskripsiSingkat", formDaftar.deskripsiSingkat);
      fd.append("deskripsiLengkap", formDaftar.deskripsiLengkap);
      fd.append("jamOperasional", formDaftar.jamOperasional);

      if (fileFoto) {
        fd.append("foto", fileFoto);
      }

      const res = await fetch("/api/umkm", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (json.success) {
        setSubmitSuccess(true);
        setSubmitMessage(
          json.message ||
            "Pendaftaran UMKM Anda telah berhasil dikirim! Menunggu verifikasi admin sebelum tampil di website."
        );
      } else {
        alert(json.message || "Gagal mengirim pendaftaran UMKM. Silakan periksa formulir.");
      }
    } catch (err) {
      console.error("Error submitting UMKM registration:", err);
      alert("Terjadi gangguan koneksi saat mengirim pendaftaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDaftarModal = () => {
    setIsDaftarOpen(false);
    setSubmitSuccess(false);
    setSubmitMessage("");
    setFileFoto(null);
    setFormDaftar({
      nama: "",
      kategori: "Kuliner",
      pemilik: "",
      nikPemilik: "",
      kontakWa: "",
      harga: "",
      lokasi: "",
      rw: "RW 01",
      deskripsiSingkat: "",
      deskripsiLengkap: "",
      jamOperasional: "08.00 - 20.00 WIB",
    });
  };

  return (
    <section id="umkm" className="py-24 bg-[#FAF9F4] text-[#111827] border-t border-[#E3E8E2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
        
        {/* HEADER STORE UMKM & TOMBOL DAFTARKAN UMKM */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E3E8E2] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#064E3B] animate-ping" />
              <span>Etalase Ekonomi Warga Sawotratap</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
              Store & Direktori <span className="text-[#064E3B]">UMKM</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Jelajahi produk unggulan warga Desa Sawotratap. Tidak perlu keranjang belanja, Anda dapat langsung terhubung dengan nomor WhatsApp penjual untuk bertanya atau memesan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* TOMBOL DAFTAR UMKM WARGA */}
            <button
              onClick={() => setIsDaftarOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-emerald-50 text-[#064E3B] border border-emerald-600 text-xs font-black transition-all shadow-xs hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#064E3B]" />
              <span>Daftarkan Usaha Anda</span>
            </button>

            <a
              href="/layanan#umkm"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black transition-all shadow-sm shrink-0 hover:scale-105"
            >
              <span>Lihat Seluruh Katalog</span>
              <ArrowRight className="w-4 h-4 text-[#C5D82F]" />
            </a>
          </div>
        </div>

        {/* SEARCH BAR & KATEGORI PILIHAN */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Live Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk, kuliner, penjual, RW..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
              />
            </div>

            <div className="text-xs font-bold text-slate-500">
              Menampilkan <span className="text-[#064E3B] font-black">{filterProduk.length} Produk</span> aktif
            </div>
          </div>

          {/* GRID KATEGORI TOMBOL FILTER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {KATEGORI_LIST.map((item, idx) => {
              const IconComponent = item.icon;
              const isSelected = kategoriAktif.toLowerCase() === item.kat.toLowerCase();

              return (
                <button
                  key={idx}
                  onClick={() => setKategoriAktif(item.kat)}
                  className={`p-5 rounded-[2rem] text-left transition-all flex flex-col justify-between gap-6 border shadow-xs cursor-pointer ${
                    isSelected
                      ? "bg-[#064E3B] border-[#064E3B] text-white ring-2 ring-emerald-500/20 scale-[1.02] shadow-md"
                      : "bg-white border-[#E3E8E2] hover:border-emerald-600 text-[#111827] hover:shadow-md"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#C5D82F] text-[#06261D]" : "bg-emerald-50 text-[#064E3B]"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-sm sm:text-base font-black ${isSelected ? "text-white" : "text-[#111827]"}`}>
                      {item.nama}
                    </div>
                    <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                      {item.count}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* GRID KATALOG PRODUK UMKM TERPILIH */}
        <div className="space-y-4 pt-2">
          {filterProduk.length === 0 ? (
            <div className="text-center py-14 rounded-3xl bg-white border border-dashed border-slate-200 text-slate-500 text-xs space-y-2">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-700">Produk UMKM tidak ditemukan</p>
              <p className="text-[11px] text-slate-400">
                Coba gunakan kata kunci pencarian yang lain atau pilih kategori Semua Produk.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterProduk.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="rounded-[2rem] border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* FOTO PRODUK & BADGE */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.foto}
                        alt={item.nama}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-0.5 text-[10px] font-black text-[#C5D82F] border border-white/10 shadow-sm">
                        {item.rw || "Sawotratap"}
                      </div>
                      <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{item.rating || "5.0"}</span>
                      </div>
                    </div>

                    {/* INFORMASI PRODUK */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-block text-[9px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          {item.kategori}
                        </span>
                        <span className="text-xs font-black font-mono text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-md">
                          {item.harga}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedUmkm(item)}
                        className="text-sm font-black text-[#111827] group-hover:text-[#064E3B] transition-colors line-clamp-1 cursor-pointer"
                        title={item.nama}
                      >
                        {item.nama}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                        {item.deskripsi_singkat || item.deskripsi}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 pt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.lokasi}</span>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER KARTU: TOMBOL DETAIL & HUBUNGI WA */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUmkm(item)}
                      className="text-[11px] font-black text-slate-600 hover:text-[#064E3B] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Detail</span>
                    </button>

                    <a
                      href={getWaLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs shrink-0 hover:scale-102"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#C5D82F]" />
                      <span>Tanya WA</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BANNER AJAKAN DAFTAR UMKM UNTUK WARGA */}
        <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-900 via-[#064E3B] to-[#043327] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C5D82F] bg-white/10 px-3 py-1 rounded-full">
              Pemberdayaan Ekonomi Desa
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Punya Usaha atau Produk di Desa Sawotratap?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-normal leading-relaxed">
              Daftarkan usaha Anda gratis ke direktori resmi desa. Setelah disetujui admin Balai Desa, produk Anda akan dipromosikan ke seluruh warga dan pengunjung website.
            </p>
          </div>

          <button
            onClick={() => setIsDaftarOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#06261D] px-6 py-3.5 text-xs font-black shadow-lg transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#06261D]" />
            <span>Formulir Pendaftaran UMKM</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PREVIEW DETAIL UMKM (Persiapan Halaman Detail) */}
      {/* ========================================================================= */}
      {selectedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Header Gambar Modal */}
            <div className="relative h-64 w-full bg-slate-900">
              <img
                src={selectedUmkm.foto}
                alt={selectedUmkm.nama}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedUmkm(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                aria-label="Tutup modal detail"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-xs font-black text-[#C5D82F] border border-white/10">
                  {selectedUmkm.rw || "Sawotratap"}
                </span>
                <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-800">
                  {selectedUmkm.kategori}
                </span>
              </div>
            </div>

            {/* Konten Detail Modal */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl sm:text-2xl font-black text-[#111827] leading-tight">
                    {selectedUmkm.nama}
                  </h3>
                  <div className="text-sm font-black font-mono text-[#064E3B] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shrink-0">
                    {selectedUmkm.harga}
                  </div>
                </div>
                <p className="text-xs font-bold text-emerald-700 mt-1">
                  Pemilik: {selectedUmkm.pemilik}
                </p>
              </div>

              {/* Grid Info Cepat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">Lokasi Usaha:</span>
                    <p className="text-slate-500 font-medium">{selectedUmkm.lokasi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700">Jam Operasional:</span>
                    <p className="text-slate-500 font-medium">{selectedUmkm.jam_operasional || "08.00 - 20.00 WIB"}</p>
                  </div>
                </div>
              </div>

              {/* Cerita & Deskripsi Lengkap Usaha */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Tentang Produk & Usaha
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {selectedUmkm.deskripsi_lengkap || selectedUmkm.deskripsi_singkat || selectedUmkm.deskripsi}
                </p>
              </div>

              {/* Alamat Lengkap Patokan */}
              {selectedUmkm.alamat_lengkap && (
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Alamat Lengkap / Patokan
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {selectedUmkm.alamat_lengkap}
                  </p>
                </div>
              )}

              {/* Action Button: Hubungi via WhatsApp */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 text-center sm:text-left">
                  Tidak ada keranjang checkout. Pemesanan dan tanya stok dilakukan langsung via WhatsApp pemilik.
                </p>
                <a
                  href={getWaLink(selectedUmkm)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all shrink-0 hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5D82F]" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FORMULIR PENDAFTARAN UMKM WARGA (Status Default: Menunggu ACC) */}
      {/* ========================================================================= */}
      {isDaftarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Header Modal */}
            <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                  Pendaftaran Terbuka
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#111827]">
                  Daftarkan UMKM Sawotratap
                </h3>
                <p className="text-xs text-slate-500">
                  Setelah didaftarkan, admin Balai Desa akan memverifikasi sebelum ditampilkan di website.
                </p>
              </div>

              <button
                onClick={closeDaftarModal}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Isi Formulir / Notifikasi Sukses */}
            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-[#111827]">Pendaftaran Berhasil Dikirim!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {submitMessage}
                </p>
                <div className="pt-4">
                  <button
                    onClick={closeDaftarModal}
                    className="px-6 py-2.5 rounded-full bg-[#064E3B] text-white text-xs font-black hover:bg-[#047857] transition-all cursor-pointer"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDaftarSubmit} className="p-6 sm:p-7 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Usaha / Produk *</label>
                  <input
                    type="text"
                    required
                    value={formDaftar.nama}
                    onChange={(e) => setFormDaftar({ ...formDaftar, nama: e.target.value })}
                    placeholder="Contoh: Dapur Sambal Bandeng Bu Siti"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Kategori Usaha *</label>
                    <select
                      value={formDaftar.kategori}
                      onChange={(e) => setFormDaftar({ ...formDaftar, kategori: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      <option value="Kuliner">Kuliner & Jajanan</option>
                      <option value="Kerajinan">Kerajinan Tangan</option>
                      <option value="Fashion">Batik & Fashion</option>
                      <option value="Pertanian">Pertanian & Tanaman</option>
                      <option value="Jasa">Jasa & Lainnya</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Wilayah RW *</label>
                    <select
                      value={formDaftar.rw}
                      onChange={(e) => setFormDaftar({ ...formDaftar, rw: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => {
                        const rwStr = `RW ${n < 10 ? "0" + n : n}`;
                        return (
                          <option key={rwStr} value={rwStr}>
                            {rwStr}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nama Pemilik Usaha *</label>
                    <input
                      type="text"
                      required
                      value={formDaftar.pemilik}
                      onChange={(e) => setFormDaftar({ ...formDaftar, pemilik: e.target.value })}
                      placeholder="Contoh: Ibu Siti Rahayu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">No. WhatsApp Aktif *</label>
                    <input
                      type="text"
                      required
                      value={formDaftar.kontakWa}
                      onChange={(e) => setFormDaftar({ ...formDaftar, kontakWa: e.target.value })}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Perkiraan Harga</label>
                    <input
                      type="text"
                      value={formDaftar.harga}
                      onChange={(e) => setFormDaftar({ ...formDaftar, harga: e.target.value })}
                      placeholder="Mulai Rp 15.000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Jam Operasional Usaha</label>
                    <input
                      type="text"
                      value={formDaftar.jamOperasional}
                      onChange={(e) => setFormDaftar({ ...formDaftar, jamOperasional: e.target.value })}
                      placeholder="08.00 - 20.00 WIB"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alamat Lengkap / Patokan *</label>
                  <input
                    type="text"
                    required
                    value={formDaftar.lokasi}
                    onChange={(e) => setFormDaftar({ ...formDaftar, lokasi: e.target.value })}
                    placeholder="Jl. Merpati No. 12, RT 02 / RW 01 Sawotratap"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Deskripsi Singkat Produk *</label>
                  <textarea
                    required
                    rows={2}
                    value={formDaftar.deskripsiSingkat}
                    onChange={(e) => setFormDaftar({ ...formDaftar, deskripsiSingkat: e.target.value })}
                    placeholder="Ringkasan 1-2 kalimat tentang produk yang dijual..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Foto Produk / Tempat Usaha (Opsional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileFoto(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeDaftarModal}
                    className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}