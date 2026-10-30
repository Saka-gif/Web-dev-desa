"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  MessageSquareQuote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Clock,
  Users,
  CheckCircle2,
  Store,
  ShieldCheck,
} from "lucide-react";
import { DAFTAR_BERITA } from "@/app/data/berita";
import BeritaSection from "./components/berita-section";
import UmkmSection from "./components/umkm-section";
import LayananSection from "./components/layanan-section";
import ApbdSection from "./components/apbd-section";
import DemografiSection from "./components/demografi-section";

const LOKAL_FOTO_DESA = [
  {
    id: 1,
    title: "Balai Desa Sawotratap",
    subtitle: "Pusat Administrasi & Sentra Pelayanan Terpadu Warga",
    category: "Pemerintahan",
    bgImg: "/aset/balai-desa.jpg",
    highlight: "Pelayanan Hari Kerja: 08.00–15.00 WIB",
  },
  {
    id: 2,
    title: "Kawasan Desa Sawotratap",
    subtitle: "Lingkungan Asri & Harmonis di Koridor Strategis Aloha Gedangan",
    category: "Wilayah",
    bgImg: "/aset/pedesaan.jpg",
    highlight: "Kec. Gedangan, Kab. Sidoarjo",
  },
  {
    id: 3,
    title: "Sentra Pasar & UMKM Warga",
    subtitle: "Penggerak Ekonomi Kerakyatan & Ragam Usaha Kreatif Lokal",
    category: "Ekonomi",
    bgImg: "/aset/umkm-desa.jpg",
    highlight: "150+ Pelaku Usaha Terdata",
  },
  {
    id: 4,
    title: "Layanan Mandiri Digital",
    subtitle: "Kemudahan Pengurusan Surat Administrasi Kependudukan Cepat",
    category: "Pelayanan",
    bgImg: "/aset/pelayanan.jpg",
    highlight: "Akses Online 24 Jam Non-Stop",
  },
  {
    id: 5,
    title: "Kerukunan & Gotong Royong",
    subtitle: "Semangat Guyub Rukun Warga dalam Membangun Desa yang Berdaya",
    category: "Kemasyarakatan",
    bgImg: "/aset/gotong-royong.jpg",
    highlight: "Partisipasi Aktif Warga",
  },
];

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Otomatis rotasi slide foto latar setiap 6 detik jika sedang aktif (tidak di-pause)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOKAL_FOTO_DESA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentSlide = LOKAL_FOTO_DESA[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % LOKAL_FOTO_DESA.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + LOKAL_FOTO_DESA.length) % LOKAL_FOTO_DESA.length);
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    // Geser kiri (swipe left) -> slide berikutnya
    if (diff > 45) {
      nextSlide();
    }
    // Geser kanan (swipe right) -> slide sebelumnya
    else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#06261D] text-white overflow-x-clip font-sans">
      {/* HERO SECTION */}
      <section
        id="hero"
        aria-label="Beranda Utama Desa Sawotratap"
        className="relative min-h-[100svh] w-full overflow-hidden bg-[#06261D] text-white flex flex-col justify-between"
      >
        {/* BACKGROUND FOTO HERO SLIDER (FOTO RESMI DESA) */}
        <div className="absolute inset-0 z-0">
          {LOKAL_FOTO_DESA.map((item, index) => (
            <img
              key={item.id}
              src={item.bgImg}
              alt={item.title}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-105 brightness-[0.52] contrast-[1.08]"
                  : "opacity-0 scale-100 pointer-events-none"
              }`}
            />
          ))}

          {/* LAYERED VIGNETTE & CINEMATIC CIVIC GRADIENTS */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06261D] via-[#06261D]/65 to-[#06261D]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06261D]/95 via-[#06261D]/80 to-transparent lg:w-3/4" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#06261D]/90 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-8 w-96 h-96 rounded-full bg-[#C5D82F]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 right-8 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* KOORDINAT RESMI DESA (TOP RIGHT) */}
        <div className="pointer-events-none absolute right-6 sm:right-10 lg:right-16 top-24 sm:top-28 z-10 hidden md:flex items-center gap-2 rounded-full border border-white/15 bg-[#06261D]/75 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-mono tracking-widest text-slate-300 uppercase shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-pulse" />
          <span>7°22&apos;48&quot;S 112°44&apos;20&quot;E • GEDANGAN, SIDOARJO</span>
        </div>

        {/* KONTEN UTAMA HERO */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-5 pt-28 pb-10 sm:px-8 sm:pt-36 lg:px-12 lg:pt-36">
          
          <div className="my-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* KOLOM KIRI: HEADLINE, DESKRIPSI, DAN CTA UTAMA (7 COLS) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* STATUS CHIP / IDENTITY PILL */}
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/20 bg-[#06261D]/85 px-4 py-2 text-xs font-semibold text-slate-100 backdrop-blur-md shadow-lg">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5D82F] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5D82F]" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold tracking-wide">
                    Portal Resmi Pemerintah Desa Sawotratap
                  </span>
                  <span className="hidden sm:inline text-white/30">•</span>
                  <span className="hidden sm:inline text-[11px] text-[#C5D82F] font-bold">
                    Kec. Gedangan, Kab. Sidoarjo
                  </span>
                </div>

                {/* MAIN HEADLINE */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.14] drop-shadow-xl">
                  Pelayanan Modern, <br className="hidden sm:inline" />
                  Membangun Desa{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5D82F] via-[#d7e93f] to-emerald-300 drop-shadow-[0_4px_24px_rgba(197,216,47,0.35)]">
                    Terkoneksi & Mandiri
                  </span>
                </h1>

                {/* VALUE PROPOSITION PARAGRAPH */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-200/95 font-medium leading-relaxed max-w-xl drop-shadow-sm">
                  Portal resmi pelayanan mandiri kependudukan, keterbukaan informasi publik, transparansi anggaran APBDes, serta etalase potensi ekonomi UMKM warga Desa Sawotratap.
                </p>

                {/* CALL TO ACTION BUTTONS */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <a
                    href="#layanan"
                    className="shine-hover inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#06261D] px-7 py-3.5 text-sm sm:text-base font-black shadow-xl shadow-[#C5D82F]/25 hover:shadow-[#C5D82F]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FileText className="w-5 h-5 text-[#06261D]" />
                    <span>Layanan Surat Mandiri</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </a>

                  <a
                    href="#pengaduan"
                    className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/25 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 text-sm sm:text-base font-bold backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    <MessageSquareQuote className="w-5 h-5 text-[#C5D82F]" />
                    <span>Aspirasi & Pengaduan</span>
                  </a>
                </div>

                {/* QUICK ACCESS CHIPS */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">Akses Cepat:</span>
                  <a
                    href="#layanan"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all hover:scale-105"
                  >
                    📄 Surat Pengantar RT/RW
                  </a>
                  <a
                    href="#umkm"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all hover:scale-105"
                  >
                    🏪 Pasar UMKM Desa
                  </a>
                  <a
                    href="#apbd"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all hover:scale-105"
                  >
                    📊 APBDes Transparan
                  </a>
                </div>

              </div>

              {/* KOLOM KANAN: CIVIC SERVICE HUB & PHOTO SHOWCASE WIDGET (5 COLS) */}
              <div className="lg:col-span-5">
                <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  className="rounded-3xl border border-white/20 bg-[#06261D]/80 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl text-white space-y-5 relative overflow-hidden select-none"
                >
                  
                  {/* Subtle Inner Decorative Glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5D82F]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* WIDGET HEADER: OPERATIONAL HOURS & LIVE STATUS */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                        Balai Desa Sawotratap
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#C5D82F] bg-[#C5D82F]/10 border border-[#C5D82F]/30 px-2.5 py-0.5 rounded-full">
                      Buka Hari Kerja
                    </span>
                  </div>

                  {/* ACTIVE PHOTO HIGHLIGHT CARD */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#C5D82F] bg-white/10 px-2.5 py-1 rounded-lg">
                        {currentSlide.category}
                      </span>
                      <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C5D82F]" />
                        {currentSlide.highlight}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                      {currentSlide.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* 3 QUICK SERVICE BUTTONS */}
                  <div className="space-y-2.5">
                    <a
                      href="#layanan"
                      className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-emerald-900/40 border border-white/10 hover:border-[#C5D82F]/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-[#C5D82F]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#C5D82F] transition-colors">
                            Buat Surat Keterangan Online
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Pengantar RT/RW, Domisili, Izin Usaha
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#C5D82F] group-hover:translate-x-1 transition-all" />
                    </a>

                    <a
                      href="#pengaduan"
                      className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-emerald-900/40 border border-white/10 hover:border-[#C5D82F]/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-[#C5D82F]">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#C5D82F] transition-colors">
                            Lapor Pengaduan Warga
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Aspirasi & pengaduan terintegrasi
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#C5D82F] group-hover:translate-x-1 transition-all" />
                    </a>

                    <a
                      href="#umkm"
                      className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-emerald-900/40 border border-white/10 hover:border-[#C5D82F]/40 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-[#C5D82F]">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#C5D82F] transition-colors">
                            Katalog Produk UMKM Desa
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Kuliner, kerajinan, dan jasa lokal
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#C5D82F] group-hover:translate-x-1 transition-all" />
                    </a>
                  </div>

                  {/* CAROUSEL CONTROLLER BAR */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
                    {/* Play/Pause & Prev/Next */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        aria-label={isPlaying ? "Jeda putaran foto latar" : "Lanjutkan putaran foto latar"}
                        title={isPlaying ? "Jeda putaran otomatis" : "Mulai putaran otomatis"}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#C5D82F]" /> : <Play className="w-3.5 h-3.5 text-white" />}
                      </button>

                      <button
                        type="button"
                        onClick={prevSlide}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        aria-label="Foto sebelumnya"
                        title="Foto sebelumnya"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={nextSlide}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        aria-label="Foto berikutnya"
                        title="Foto berikutnya"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* SLIDE PROGRESS DOTS */}
                    <div className="flex items-center gap-1.5">
                      {LOKAL_FOTO_DESA.map((slide, idx) => (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            currentIndex === idx ? "w-6 bg-[#C5D82F]" : "w-1.5 bg-white/30 hover:bg-white/60"
                          }`}
                          aria-label={`Lihat dokumentasi ${idx + 1}: ${slide.title}`}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* BAGIAN BAWAH: DATA STATISTIK KEPENDUDUKAN & LAYANAN RESMI */}
          <div className="pt-6 border-t border-white/15">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              
              <div className="rounded-2xl border border-white/15 bg-[#06261D]/75 backdrop-blur-xl p-4 sm:p-5 shadow-xl transition-all duration-300 hover:border-[#C5D82F]/40 hover:bg-[#06261D]/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/50 border border-emerald-600/40 flex items-center justify-center text-[#C5D82F] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white tabular-nums">
                      8.234
                    </p>
                    <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                      Jiwa Penduduk
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-[#06261D]/75 backdrop-blur-xl p-4 sm:p-5 shadow-xl transition-all duration-300 hover:border-[#C5D82F]/40 hover:bg-[#06261D]/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/50 border border-emerald-600/40 flex items-center justify-center text-[#C5D82F] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white tabular-nums">
                      98,4%
                    </p>
                    <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                      Layanan Tuntas
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-[#06261D]/75 backdrop-blur-xl p-4 sm:p-5 shadow-xl transition-all duration-300 hover:border-[#C5D82F]/40 hover:bg-[#06261D]/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/50 border border-emerald-600/40 flex items-center justify-center text-[#C5D82F] shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white tabular-nums">
                      150+
                    </p>
                    <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                      UMKM Binaan
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-[#06261D]/75 backdrop-blur-xl p-4 sm:p-5 shadow-xl transition-all duration-300 hover:border-[#C5D82F]/40 hover:bg-[#06261D]/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/50 border border-emerald-600/40 flex items-center justify-center text-[#C5D82F] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white tabular-nums">
                      24 Jam
                    </p>
                    <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                      Layanan Mandiri
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION BERITA DESA */}
      <BeritaSection />

      {/* 4. SECTION UMKM LOKAL */}
      <UmkmSection />

      {/* 5. SECTION LAYANAN */}
      <LayananSection />

      {/* 6. SECTION APBD */}
      <ApbdSection />

      {/* 7. SECTION DEMOGRAFI & PETA DESA */}
      <DemografiSection />
    </div>
  );
}