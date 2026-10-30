"use client";

import React from "react";
import {
  FileText,
  MessageSquareQuote,
  ArrowRight,
} from "lucide-react";
import BeritaSection from "./components/berita-section";
import UmkmSection from "./components/umkm-section";
import LayananSection from "./components/layanan-section";
import ApbdSection from "./components/apbd-section";
import DemografiSection from "./components/demografi-section";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full bg-[#06261D] text-white overflow-x-clip font-sans">
      {/* HERO SECTION */}
      <section
        id="hero"
        aria-label="Beranda Utama Desa Sawotratap"
        className="relative min-h-[90vh] lg:min-h-screen w-full overflow-hidden text-white flex items-center"
      >
        {/* BACKGROUND 1 FOTO herobg.jpeg DENGAN OVERLAY LEBIH GELAP */}
        <div className="absolute inset-0 z-0">
          <img
            src="/herobg.jpeg"
            alt="Pemerintah Desa Sawotratap"
            className="h-full w-full object-cover object-center"
          />
          {/* Overlay warna gelap agar foto cukup redup dan teks sangat kontras */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* KONTEN UTAMA HERO SIMPLE, ENAK DILIHAT, DAN RATA TENGAH */}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-16 pt-32 pb-20 sm:pt-40 sm:pb-28 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-6 flex flex-col items-center text-center">
            
            {/* 1. STATUS BADGE / PILL DI TENGAH */}
            <div className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-[#06261D]/85 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5D82F] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wide">
                Portal Resmi Pemerintah Desa Sawotratap
              </span>
              <span className="text-white/40">•</span>
              <span className="text-[11px] sm:text-xs text-[#C5D82F] font-bold">
                Kec. Gedangan, Kab. Sidoarjo
              </span>
            </div>

            {/* 2. HEADLINE TANPA GRADASI (NO AI SLOP) RATA TENGAH */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.14] drop-shadow-md text-center">
              Pelayanan Modern, <br />
              Membangun Desa <br />
              <span className="text-[#C5D82F]">
                Terkoneksi & Mandiri
              </span>
            </h1>

            {/* 3. PARAGRAF VALUE PROPOSITION RATA TENGAH */}
            <p className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-sm text-center">
              Portal resmi pelayanan mandiri kependudukan, keterbukaan informasi publik, transparansi anggaran APBDes, serta etalase potensi ekonomi UMKM warga Desa Sawotratap.
            </p>

            {/* 4. BUTTONS TANPA GRADASI DI TENGAH */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#layanan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#06261D] px-7 py-4 text-sm sm:text-base font-black transition-colors shadow-lg"
              >
                <FileText className="w-5 h-5 text-[#06261D]" />
                <span>Layanan Surat Mandiri</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              <a
                href="#pengaduan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#06261D] hover:bg-[#083327] border border-white/20 text-white px-7 py-4 text-sm sm:text-base font-bold transition-colors shadow-lg"
              >
                <MessageSquareQuote className="w-5 h-5 text-[#C5D82F]" />
                <span>Aspirasi & Pengaduan</span>
              </a>
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