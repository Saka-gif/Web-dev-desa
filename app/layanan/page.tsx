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
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
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

import { DAFTAR_PRODUK_UMKM } from "@/app/data/umkm";

const SAMPLE_TRACKING_DATA: Record<string, {
  ticketId: string;
  nama: string;
  jenisSurat: string;
  tanggal: string;
  step: number;
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
  const [activeSection, setActiveSection] = useState("surat");

  // Deteksi section aktif saat melakukan scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["surat", "pengaduan", "umkm", "status"];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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
  const [kategoriAduan, setKategoriAduan] = useState("Infrastruktur Jalan Berlubang");
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
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] pt-24 sm:pt-28 pb-24 font-sans">
      
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

            {/* 3 LANGKAH VISUAL */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  1
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 1</div>
                  <div className="text-xs sm:text-sm font-black text-white">Pilih Surat</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  2
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 2</div>
                  <div className="text-xs sm:text-sm font-black text-white">Isi Data</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
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

          {/* ILUSTRASI */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-400/30 bg-emerald-950/40 p-2 shadow-2xl backdrop-blur-xl group">
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

      {/* 2. STICKY JUMP-TO NAVIGATION BAR */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3E8E2] px-6 sm:px-10 lg:px-16 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
          
          <button
            onClick={() => scrollToSection("surat")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeSection === "surat"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#C5D82F]" />
            <span>Surat Mandiri Online</span>
          </button>

          <button
            onClick={() => scrollToSection("pengaduan")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeSection === "pengaduan"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Pengaduan Warga</span>
          </button>

          <button
            onClick={() => scrollToSection("umkm")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeSection === "umkm"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Direktori Pasar UMKM</span>
          </button>

          <button
            onClick={() => scrollToSection("status")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeSection === "status"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#C5D82F]" />
            <span>Cek Status Berkas</span>
          </button>

        </div>
      </div>

      {/* 3. KONTEN LONG-SCROLL KE BAWAH */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 space-y-28">
        
        {/* ========================================================= */}
        {/* SECTION 1: SURAT MANDIRI ONLINE (#surat) */}
        {/* ========================================================= */}
        <div id="surat" className="scroll-mt-36 space-y-8">
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
            <div className="max-w-xl mx-auto rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-2xl text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
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
                className="w-full py-3.5 rounded-2xl bg-[#064E3B] text-white text-xs font-black uppercase tracking-wider hover:bg-[#047857] transition-all shadow-md"
              >
                Ajukan Permohonan Surat Lainnya
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Input Kilat */}
              <form onSubmit={handleSubmitSurat} className="lg:col-span-7 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-black text-[#111827] pb-3 border-b border-slate-100">
                  Formulir Permohonan Cepat
                </h3>

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
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
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
                      placeholder="0812xxxx"
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
                        return <option key={num} value={`RW ${num}`}>RW {num} Sawotratap</option>;
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
                    placeholder="Contoh: Syarat pendaftaran kerja / izin usaha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#C5D82F]" />
                  <span>Terbitkan Resi Pengajuan Surat</span>
                </button>
              </form>

              {/* Syarat Pengambilan Samping */}
              <div className="lg:col-span-5 rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-black text-[#111827]">
                    Syarat: {currentSuratObj.nama}
                  </h3>
                </div>

                <div className="space-y-2">
                  {currentSuratObj.persyaratan.map((syarat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{syarat}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="text-xs font-black">Jadwal Loket Balai Desa:</div>
                  <div className="text-xs font-medium">Senin – Jumat: 08.00 – 15.00 WIB</div>
                  <div className="text-[11px] text-amber-800">Tunjukkan nomor resi pada layar smartphone Anda.</div>
                </div>

                <a
                  href="https://wa.me/6281234567890?text=Halo%20Loket%20Pelayanan%20Sawotratap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-black flex items-center justify-center gap-2 transition-colors border border-emerald-200"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp Loket PTSP Desa</span>
                </a>
              </div>

            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: POS PENGADUAN WARGA (#pengaduan) */}
        {/* ========================================================= */}
        <div id="pengaduan" className="scroll-mt-36 space-y-8">
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
                    <option>Kebersihan & Sampah Liar</option>
                    <option>Fasilitas Umum Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi / RT / RW *</label>
                  <input
                    type="text"
                    required
                    value={lokasiAduan}
                    onChange={(e) => setLokasiAduan(e.target.value)}
                    placeholder="Contoh: Jl. Kenanga RT 02 / RW 03"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Uraian & Deskripsi Aduan *</label>
                <textarea
                  required
                  rows={4}
                  value={isiAduan}
                  onChange={(e) => setIsIduan(e.target.value)}
                  placeholder="Jelaskan detail permasalahan secara jelas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Megaphone className="w-4 h-4 text-rose-200" />
                <span>Kirimkan Laporan Aspirasi</span>
              </button>
            </form>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: DIREKTORI PASAR UMKM (#umkm) */}
        {/* ========================================================= */}
        <div id="umkm" className="scroll-mt-36 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Ekonomi Kerakyatan</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Etalase Produk UMKM Desa</h2>
              </div>
            </div>

            <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
              {["Semua", "Kuliner", "Kerajinan"].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKategoriUmkm(kat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    kategoriUmkm === kat ? "bg-white text-[#064E3B] shadow-xs font-extrabold" : "text-slate-600"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredUmkm.map((u) => (
              <div key={u.id} className="rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img src={u.foto} alt={u.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-slate-800 rounded-full">
                      {u.kategori}
                    </span>
                    <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 text-[10px] font-black rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-slate-950" /> {u.rating}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{u.penjual}</div>
                    <h3 className="font-black text-sm text-[#111827] group-hover:text-[#064E3B] transition-colors line-clamp-1">{u.nama}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.lokasi}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="font-extrabold text-emerald-700 text-xs">{u.harga}</span>
                  <a
                    href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20pesan%20${encodeURIComponent(u.nama)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-black transition-colors"
                  >
                    <span>Pesan WA</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: CEK STATUS BERKAS (#status) */}
        {/* ========================================================= */}
        <div id="status" className="scroll-mt-36 space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Tracking Sistem</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Cek Status Pengajuan Berkas Surat</h2>
            </div>
          </div>

          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Masukkan No Resi (Contoh: SWT-2024-8842)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600 bg-white"
              />
              <button
                onClick={() => handleSearchTracking()}
                className="px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider shrink-0"
              >
                Lacak
              </button>
            </div>

            {currentTracking && (
              <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Resi: {currentTracking.ticketId}
                    </span>
                    <h3 className="font-black text-lg text-[#111827] mt-1">{currentTracking.jenisSurat}</h3>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${currentTracking.statusColor}`}>
                    {currentTracking.statusLabel}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Pemohon:</span>
                    <strong className="text-slate-900">{currentTracking.nama}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu Pengajuan:</span>
                    <strong className="text-slate-900">{currentTracking.tanggal}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimasi Selesai:</span>
                    <strong className="text-emerald-700">{currentTracking.estimasiSelesai}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <strong className="text-slate-900 block">Catatan Petugas PTSP:</strong>
                  <p>{currentTracking.catatan}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}