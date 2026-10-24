"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Megaphone,
  ShoppingBag,
  CheckCircle2,
  Clock,
  PhoneCall,
  Search,
  Upload,
  AlertCircle,
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";

interface LayananOption {
  id: string;
  nama: string;
  kategori: string;
  estimasi: string;
  persyaratan: string[];
}

const DAFTAR_SURAT: LayananOption[] = [
  {
    id: "surat-domisili",
    nama: "Surat Keterangan Domisili (SKD)",
    kategori: "Kependudukan",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP Pemohon", "Kartu Keluarga (KK)", "Pengantar RT/RW"],
  },
  {
    id: "surat-ktp-kk",
    nama: "Pengantar KTP-el / KK Baru",
    kategori: "Kependudukan",
    estimasi: "1 x 24 Jam",
    persyaratan: ["Akta Kelahiran", "KK Lama", "Surat Kehilangan (bila hilang)"],
  },
  {
    id: "surat-usaha",
    nama: "Surat Keterangan Usaha (SKU / UMKM)",
    kategori: "Ekonomi",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP & KK Pemilik", "Foto Tempat Usaha", "Pengantar RT"],
  },
  {
    id: "surat-sktm",
    nama: "Surat Keterangan Tidak Mampu (SKTM)",
    kategori: "Sosial & Beasiswa",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP & KK Sawotratap", "Surat RT/RW", "Foto Rumah"],
  },
  {
    id: "surat-skck",
    nama: "Surat Pengantar SKCK Polsek",
    kategori: "Hukum & Kerja",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP & KK", "Pas Foto 4x6 Merah (2 lbr)", "Pengantar RT/RW"],
  },
  {
    id: "surat-nikah",
    nama: "Surat Pengantar Nikah (N1 - N4)",
    kategori: "Pernikahan",
    estimasi: "2 x 24 Jam",
    persyaratan: ["KTP & KK Calon & Ortu", "Akta Kelahiran", "Pas Foto Berdampingan"],
  },
];

const DAFTAR_PRODUK_UMKM = [
  {
    id: 1,
    nama: "Kue Basah & Jajanan Tradisional Sawotratap",
    penjual: "Ibu Sri Rejeki (RW 02)",
    harga: "Mulai Rp 15.000",
    rating: "4.9",
    lokasi: "Jl. Merpati No. 4, RW 02",
    kategori: "Kuliner",
    foto: "/aset/umkm-desa.jpg",
  },
  {
    id: 2,
    nama: "Kerupuk Puli & Kupang Khas Sidoarjo",
    penjual: "Pak Suwandi (RW 05)",
    harga: "Mulai Rp 12.000",
    rating: "4.8",
    lokasi: "Kawasan Niaga RW 05",
    kategori: "Kuliner",
    foto: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    nama: "Kerajinan Anyaman Rotan & Tas Anyam",
    penjual: "Kelompok Usaha Melati RW 08",
    harga: "Mulai Rp 35.000",
    rating: "4.9",
    lokasi: "Perumahan Graha RW 08",
    kategori: "Kerajinan",
    foto: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    nama: "Batik Tulis Corak Khas Sidoarjo Delta",
    penjual: "Sanggar Batik Sawotratap",
    harga: "Mulai Rp 120.000",
    rating: "5.0",
    lokasi: "Jl. Sawotratap Krajan RW 01",
    kategori: "Kerajinan",
    foto: "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&q=80&w=600",
  },
];

const SAMPLE_TRACKING_DATA: Record<string, {
  ticketId: string;
  nama: string;
  jenisSurat: string;
  tanggal: string;
  step: number; // 1 to 4
  statusLabel: string;
  statusColor: string;
  estimasiSelesai: string;
  catatan: string;
}> = {
  "SWT-2024-8842": {
    ticketId: "SWT-2024-8842",
    nama: "Hadi Purnomo",
    jenisSurat: "Surat Keterangan Usaha (SKU / UMKM)",
    tanggal: "24 Okt 2024, 08.15 WIB",
    step: 4,
    statusLabel: "Siap Diambil di Loket Balai Desa",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    estimasiSelesai: "Hari Ini • Loket PTSP",
    catatan: "Dokumen telah ditandatangani basah & cap resmi Kepala Desa. Tunjukkan KTP asli saat pengambilan.",
  },
  "SWT-2024-3190": {
    ticketId: "SWT-2024-3190",
    nama: "Siti Rahmawati",
    jenisSurat: "Surat Keterangan Domisili (SKD)",
    tanggal: "24 Okt 2024, 09.30 WIB",
    step: 3,
    statusLabel: "Verifikasi Tanda Tangan Digital Kades",
    statusColor: "bg-blue-100 text-blue-800 border-blue-300",
    estimasiSelesai: "Sore Ini, 14.00 WIB",
    catatan: "Verifikasi berkas kependudukan RT 04 / RW 02 telah disetujui. Sedang proses pengesahan Kades.",
  },
  "SWT-2024-1025": {
    ticketId: "SWT-2024-1025",
    nama: "Rizky Firmansyah",
    jenisSurat: "Surat Pengantar SKCK Polsek Gedangan",
    tanggal: "24 Okt 2024, 10.05 WIB",
    step: 2,
    statusLabel: "Pemeriksaan Dokumen oleh Kaur TU",
    statusColor: "bg-amber-100 text-amber-800 border-amber-300",
    estimasiSelesai: "Besok Pagi, 09.00 WIB",
    catatan: "Petugas sedang memeriksa kelengkapan pas foto 4x6 dan surat pengantar RW 06.",
  },
};

export default function LayananPage() {
  const [activeTab, setActiveTab] = useState<"surat" | "pengaduan" | "umkm" | "status">("surat");

  // Sync hash from URL on load and hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["surat", "pengaduan", "umkm", "status"].includes(hash)) {
        setActiveTab(hash as any);
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Tracking State
  const [trackingInput, setTrackingInput] = useState("SWT-2024-8842");
  const [currentTracking, setCurrentTracking] = useState<any>(SAMPLE_TRACKING_DATA["SWT-2024-8842"]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchTracking = (codeToSearch?: string) => {
    const query = (codeToSearch || trackingInput).trim().toUpperCase();
    setHasSearched(true);
    if (SAMPLE_TRACKING_DATA[query]) {
      setCurrentTracking(SAMPLE_TRACKING_DATA[query]);
    } else {
      // Dynamic fallback for any query
      setCurrentTracking({
        ticketId: query || "SWT-2024-BARU",
        nama: "Warga Desa Sawotratap",
        jenisSurat: "Permohonan Layanan Surat Mandiri",
        tanggal: "Hari Ini, Baru Saja",
        step: 2,
        statusLabel: "Sedang Dalam Antrean Verifikasi",
        statusColor: "bg-amber-100 text-amber-800 border-amber-300",
        estimasiSelesai: "1 x 24 Jam Kerja",
        catatan: "Permohonan nomor registrasi ini sedang ditelaah oleh Seksi Pelayanan Balai Desa.",
      });
    }
  };

  // Form State Surat
  const [selectedSurat, setSelectedSurat] = useState(DAFTAR_SURAT[0].id);
  const [namaPemohon, setNamaPemohon] = useState("");
  const [nikPemohon, setNikPemohon] = useState("");
  const [teleponPemohon, setTeleponPemohon] = useState("");
  const [rwPemohon, setRwPemohon] = useState("RW 01");
  const [keperluan, setKeperluan] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Form State Pengaduan
  const [kategoriAduan, setKategoriAduan] = useState("Infrastruktur Jalan");
  const [lokasiAduan, setLokasiAduan] = useState("");
  const [isiAduan, setIsIduan] = useState("");
  const [aduanSubmitted, setAduanSubmitted] = useState(false);

  // Filter UMKM
  const [kategoriUmkm, setKategoriUmkm] = useState("Semua");

  const handleSubmitSurat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPemohon || !nikPemohon || !teleponPemohon) {
      alert("Harap lengkapi Nama, NIK, dan Nomor Telepon.");
      return;
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket = `SWT-2024-${randomNum}`;
    setTicketId(newTicket);
  };

  const handleSubmitAduan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lokasiAduan || !isiAduan) {
      alert("Harap isi lokasi dan deskripsi aduan.");
      return;
    }
    setAduanSubmitted(true);
  };

  const currentSuratObj = DAFTAR_SURAT.find((s) => s.id === selectedSurat) || DAFTAR_SURAT[0];

  const filteredUmkm = DAFTAR_PRODUK_UMKM.filter(
    (item) => kategoriUmkm === "Semua" || item.kategori === kategoriUmkm
  );

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] pt-24 sm:pt-28 pb-20 font-sans">
      
      {/* 1. HERO HEADER LAYANAN */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06261D] via-[#083327] to-[#0A1F17] text-white py-14 sm:py-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#C5D82F]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
              <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
              <span>/</span>
              <span className="text-white font-bold">Layanan Warga</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#064E3B]/80 px-4 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
              <span>Loket PTSP Mandiri 24/7 • 100% Bebas Pungli</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Layanan Surat Kilat & <br />
              <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
                Aspirasi Warga
              </span>
            </h1>

            <p className="max-w-xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
              Pengurusan surat pengantar administrasi kependudukan tanpa antre, meja aduan permasalahan lingkungan, serta etalase produk UMKM Desa Sawotratap.
            </p>

            {/* 3 LANGKAH VISUAL PENGURUSAN SURAT (WORKFLOW INFOGRAFIS) */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3 card-interactive-2d hover:border-emerald-400/50 hover:bg-white/15">
                <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  1
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 1</div>
                  <div className="text-xs sm:text-sm font-black text-white">Pilih Surat</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3 card-interactive-2d hover:border-emerald-400/50 hover:bg-white/15">
                <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  2
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 2</div>
                  <div className="text-xs sm:text-sm font-black text-white">Isi Data</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3 card-interactive-2d hover:border-[#C5D82F]/50 hover:bg-white/15">
                <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  3
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 3</div>
                  <div className="text-xs sm:text-sm font-black text-[#C5D82F]">Resi Terbit</div>
                </div>
              </div>
            </div>
          </div>

          {/* KARTU 3D ISOMETRIC ILUSTRASI LAYANAN */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-400/30 bg-emerald-950/40 p-2 shadow-2xl backdrop-blur-xl card-interactive-2d group">
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden">
                <img
                  src="/aset/pelayanan-3d.jpg"
                  alt="Pelayanan Publik Modern Desa Sawotratap"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06261D]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
                    <span className="font-extrabold text-[11px]">PTSP Ramah & Cepat Bebas Pungli</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">100% Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TAB NAVIGATOR STICKY */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3E8E2] px-6 sm:px-10 lg:px-16 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
          
          <button
            onClick={() => {
              setActiveTab("surat");
              window.history.replaceState(null, "", "#surat");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "surat"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#C5D82F]" />
            <span>Surat Mandiri Online</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("pengaduan");
              window.history.replaceState(null, "", "#pengaduan");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "pengaduan"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Pengaduan Warga</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("umkm");
              window.history.replaceState(null, "", "#umkm");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "umkm"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Direktori Pasar UMKM</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("status");
              window.history.replaceState(null, "", "#status");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "status"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#C5D82F]" />
            <span>Cek Status Berkas</span>
          </button>

        </div>
      </div>

      {/* 3. KONTEN DETAIL LAYANAN */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 space-y-16">
        
        {/* ========================================================= */}
        {/* SECTION 1: SURAT MANDIRI ONLINE (#surat) */}
        {/* ========================================================= */}
        {activeTab === "surat" && (
          <section id="surat" className="scroll-mt-36 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Pelayanan Kilat</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Pengajuan Surat Keterangan Online</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                  Biaya: Rp 0 (100% Gratis)
                </span>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-300">
                  Estimasi: 1 x 24 Jam
                </span>
              </div>
            </div>

            {ticketId ? (
              /* Kartu Bukti Resi Pengajuan (Visual Berhasil) */
              <div className="max-w-xl mx-auto rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-2xl text-center space-y-5 card-interactive-2d">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm animate-bounce-subtle">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>

                <div>
                  <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full mb-2">
                    Pengajuan Berhasil Diproses
                  </span>
                  <h3 className="text-3xl font-black font-mono text-[#064E3B] tracking-wider">
                    {ticketId}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">Simpan nomor resi ini untuk pengambilan berkas fisik</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Nama Pemohon:</span>
                    <strong className="text-slate-900">{namaPemohon}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">NIK KTP:</span>
                    <strong className="text-slate-900 font-mono">{nikPemohon}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Jenis Surat:</span>
                    <strong className="text-emerald-800">{currentSuratObj.nama}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lokasi Pengambilan:</span>
                    <strong className="text-slate-900">Loket PTSP Balai Desa</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTicketId(null);
                    setNamaPemohon("");
                    setNikPemohon("");
                    setKeperluan("");
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#064E3B] text-white text-xs font-black uppercase tracking-wider hover:bg-[#047857] transition-all shadow-md shine-hover"
                >
                  Ajukan Permohonan Surat Lainnya
                </button>
              </div>
            ) : (
              /* Grid Form & Quick Requirements */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Input Kilat */}
                <form onSubmit={handleSubmitSurat} className="lg:col-span-7 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-[#111827] pb-3 border-b border-slate-100">
                    Formulir Permohonan Cepat
                  </h3>

                  {/* Pilihan Jenis Surat (Radio Pills Visual) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Pilih Jenis Surat yang Dibutuhkan *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DAFTAR_SURAT.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedSurat(s.id)}
                          className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between card-interactive-2d ${
                            selectedSurat === s.id
                              ? "border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="text-xs font-black text-[#111827] line-clamp-1">{s.nama}</div>
                          <div className="flex items-center justify-between text-[10px] font-bold mt-1 text-slate-500">
                            <span className="text-emerald-700">{s.estimasi}</span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{s.kategori}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap (KTP) *</label>
                      <input
                        type="text"
                        required
                        value={namaPemohon}
                        onChange={(e) => setNamaPemohon(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">NIK (16 Digit) *</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={nikPemohon}
                        onChange={(e) => setNikPemohon(e.target.value.replace(/\D/g, ""))}
                        placeholder="3515xxxxxxxxxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={teleponPemohon}
                        onChange={(e) => setTeleponPemohon(e.target.value)}
                        placeholder="0812xxxx (Untuk notifikasi status)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah Rukun Warga *</label>
                      <select
                        value={rwPemohon}
                        onChange={(e) => setRwPemohon(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:border-emerald-600"
                      >
                        {Array.from({ length: 11 }, (_, i) => {
                          const num = String(i + 1).padStart(2, "0");
                          return <option key={num} value={`RW ${num}`}>RW {num} - Sawotratap</option>;
                        })}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Keperluan Singkat *</label>
                    <input
                      type="text"
                      required
                      value={keperluan}
                      onChange={(e) => setKeperluan(e.target.value)}
                      placeholder="Contoh: Syarat pendaftaran kerja / izin usaha / beasiswa"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 shine-hover"
                  >
                    <FileText className="w-4 h-4 text-[#C5D82F]" />
                    <span>Terbitkan Resi Pengajuan Surat</span>
                  </button>
                </form>

                {/* Persyaratan Visual Samping */}
                <div className="lg:col-span-5 rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs space-y-4 card-interactive-2d">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-sm font-black text-[#111827]">
                      Syarat Pengambilan: {currentSuratObj.nama}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {currentSuratObj.persyaratan.map((syarat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 font-medium hover:bg-emerald-50/50 transition-colors">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{syarat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Loket Card */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                    <div className="text-xs font-black">Jadwal Loket Balai Desa:</div>
                    <div className="text-xs font-medium">Senin – Jumat: 08.00 – 15.00 WIB</div>
                    <div className="text-[11px] text-amber-800">Cukup tunjukkan nomor resi pada layar smartphone Anda.</div>
                  </div>

                  {/* Direct WA Loket */}
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Loket%20Pelayanan%20Sawotratap%2C%20saya%20ingin%20konsultasi%20surat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-black flex items-center justify-center gap-2 transition-colors shine-hover border border-emerald-200"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp Loket PTSP Desa</span>
                  </a>
                </div>

              </div>
            )}

          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: POS PENGADUAN WARGA (#pengaduan) */}
        {/* ========================================================= */}
        {activeTab === "pengaduan" && (
          <section id="pengaduan" className="scroll-mt-36 space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Aspirasi & Keluhan</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Layanan Pengaduan Warga Lingkungan</h2>
              </div>
            </div>

            {aduanSubmitted ? (
              <div className="max-w-xl mx-auto p-8 rounded-3xl border-2 border-emerald-500 bg-emerald-50 text-emerald-950 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h4 className="text-xl font-black">Laporan Berhasil Terkirim!</h4>
                <p className="text-xs text-slate-600">
                  Aspirasi Anda telah diterima sistem dan diteruskan ke Kepala Dusun serta Seksi Trantib untuk peninjauan langsung.
                </p>
                <button
                  onClick={() => {
                    setAduanSubmitted(false);
                    setIsIduan("");
                    setLokasiAduan("");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-black uppercase tracking-wider"
                >
                  Kirim Aduan Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitAduan} className="max-w-2xl mx-auto rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Masalah *</label>
                    <select
                      value={kategoriAduan}
                      onChange={(e) => setKategoriAduan(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white"
                    >
                      <option>Infrastruktur Jalan Berlubang</option>
                      <option>Drainase & Saluran Mampet</option>
                      <option>Lampu PJU Padam</option>
                      <option>Sampah & Kebersihan</option>
                      <option>Keamanan & Ketertiban</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Titik Lokasi *</label>
                    <input
                      type="text"
                      required
                      value={lokasiAduan}
                      onChange={(e) => setLokasiAduan(e.target.value)}
                      placeholder="Contoh: Jl. Mangga RW 03 depan Pos"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Uraian Singkat *</label>
                  <textarea
                    rows={3}
                    required
                    value={isiAduan}
                    onChange={(e) => setIsIduan(e.target.value)}
                    placeholder="Jelaskan kondisi secara ringkas agar tim desa dapat langsung cek ke lokasi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md shine-hover flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Kirim Pengaduan Sekarang</span>
                </button>
              </form>
            )}
          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: DIREKTORI UMKM (#umkm) */}
        {/* ========================================================= */}
        {activeTab === "umkm" && (
          <section id="umkm" className="scroll-mt-36 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8E2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Potensi Ekonomi Lokal</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Direktori Pasar UMKM Sawotratap</h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {["Semua", "Kuliner", "Kerajinan"].map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setKategoriUmkm(kat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      kategoriUmkm === kat
                        ? "bg-[#064E3B] text-white"
                        : "bg-white border border-[#E3E8E2] text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredUmkm.map((u) => (
                <div
                  key={u.id}
                  className="rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group card-interactive-2d"
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img src={u.foto} alt={u.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{u.rating}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-[#064E3B]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white">
                        {u.kategori}
                      </div>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-sm font-black text-[#111827] line-clamp-1 group-hover:text-[#064E3B] transition-colors">
                        {u.nama}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{u.penjual}</p>
                      <div className="text-xs font-black text-[#064E3B] pt-1">{u.harga}</div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20penjual%20${encodeURIComponent(u.nama)}%20Sawotratap`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black text-center flex items-center justify-center gap-2 transition-colors shadow-sm shine-hover"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Pesan via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 4: CEK STATUS BERKAS (#status)                    */}
        {/* ========================================================= */}
        {activeTab === "status" && (
          <section id="status" className="scroll-mt-36 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8E2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">Lacak Dokumen Real-Time</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Cek Progres Permohonan Surat</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Server PTSP Terhubung</span>
              </div>
            </div>

            {/* BOX PENCARIAN TIKET RESI */}
            <div className="max-w-3xl mx-auto rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-5 card-interactive-2d">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Masukkan Nomor Resi / ID Registrasi Anda:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: SWT-2024-8842"
                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 font-mono text-sm font-black tracking-wider uppercase focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    onClick={() => handleSearchTracking()}
                    className="px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shine-hover flex items-center justify-center gap-2 shrink-0"
                  >
                    <Search className="w-4 h-4 text-[#C5D82F]" />
                    <span>Lacak Berkas</span>
                  </button>
                </div>
              </div>

              {/* PINTASAN DEMO UJI COBA CEPAT */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-500">Coba Contoh Resi:</span>
                {Object.keys(SAMPLE_TRACKING_DATA).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setTrackingInput(code);
                      handleSearchTracking(code);
                    }}
                    className={`font-mono font-bold px-2.5 py-1 rounded-xl border text-[11px] transition-all ${
                      trackingInput === code
                        ? "bg-emerald-50 border-emerald-600 text-[#064E3B] ring-1 ring-emerald-600"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* HASIL TRACKING PROGRES VISUAL */}
            {currentTracking && (
              <div className="max-w-3xl mx-auto rounded-3xl border-2 border-emerald-500/40 bg-white p-6 sm:p-8 shadow-xl space-y-8 card-interactive-2d">
                
                {/* Header Hasil */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-black tracking-wider bg-[#064E3B] text-white px-3 py-1 rounded-full">
                        {currentTracking.ticketId}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${currentTracking.statusColor}`}>
                        {currentTracking.statusLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#111827] mt-2">
                      {currentTracking.jenisSurat}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Pemohon: <strong className="text-slate-800">{currentTracking.nama}</strong> • Diajukan: {currentTracking.tanggal}
                    </p>
                  </div>

                  <div className="text-right shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimasi Pengambilan</span>
                    <span className="text-xs font-black text-[#064E3B]">{currentTracking.estimasiSelesai}</span>
                  </div>
                </div>

                {/* 4-STEP VISUAL PROGRESS BAR */}
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-5">
                    Tahapan Pemrosesan Dokumen
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                    {[
                      { step: 1, title: "1. Pengajuan", desc: "Data Diterima Sistem" },
                      { step: 2, title: "2. Verifikasi", desc: "Pemeriksaan RT/RW" },
                      { step: 3, title: "3. Validasi", desc: "Tanda Tangan Kades" },
                      { step: 4, title: "4. Siap Ambil", desc: "Loket PTSP Desa" },
                    ].map((st) => {
                      const isCompleted = currentTracking.step >= st.step;
                      const isCurrent = currentTracking.step === st.step;

                      return (
                        <div
                          key={st.step}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isCompleted
                              ? "bg-emerald-50/80 border-emerald-300 text-[#064E3B]"
                              : "bg-slate-50 border-slate-200/80 text-slate-400"
                          } ${isCurrent ? "ring-2 ring-emerald-500 shadow-sm" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black font-mono">Tahap 0{st.step}</span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div className="text-xs font-black">{st.title}</div>
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5">{st.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Catatan & Instruksi Fisik */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                  <div className="font-black flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-800" />
                    <span>Catatan Petugas PTSP:</span>
                  </div>
                  <p className="text-amber-900 leading-relaxed font-medium">
                    {currentTracking.catatan}
                  </p>
                </div>

                {/* Tombol Ambil di Loket / Bantuan */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Loket%20PTSP%20Sawotratap%2C%20saya%20ingin%20konfirmasi%20resi%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm shine-hover"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Konfirmasi Pengambilan via WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      alert(`Resi ${currentTracking.ticketId} berhasil disalin. Tunjukkan tangkapan layar ini di Loket Balai Desa.`);
                    }}
                    className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all"
                  >
                    Simpan / Cetak Bukti
                  </button>
                </div>

              </div>
            )}
          </section>
        )}

      </div>

    </div>
  );
}
