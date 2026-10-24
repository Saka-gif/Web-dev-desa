"use client";

import React, { useState, useEffect } from "react";
import { DAFTAR_BERITA } from "@/app/data/berita";
import BeritaSection from "./components/berita-section";
import UmkmSection from "./components/umkm-section";
import LayananSection from "./components/layanan-section";
import ApbdSection from "./components/apbd-section";
import DemografiSection from "./components/demografi-section";

const LOKAL_FOTO_DESA = [
  {
    id: 1,
    title: "Suasana Desa Sawotratap",
    bgImg: "/aset/pedesaan.jpg",
  },
  {
    id: 2,
    title: "Kegiatan UMKM & Pasar Lokal",
    bgImg: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 3,
    title: "Pembangunan Infrastruktur Desa",
    bgImg: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 4,
    title: "Kerja Bakti & Penghijauan",
    bgImg: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: 5,
    title: "Balai Desa & Pelayanan Publik",
    bgImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920",
  },
];

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Otomatis ganti slide background setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOKAL_FOTO_DESA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = LOKAL_FOTO_DESA[currentIndex];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-x-hidden font-sans">
      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white flex flex-col justify-between">
        
        {/* BACKGROUND FOTO HERO SLIDER */}
        <div className="absolute inset-0 z-0">
          {LOKAL_FOTO_DESA.map((item, index) => (
            <img
              key={item.id}
              src={item.bgImg}
              alt={item.title}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-105 brightness-[0.62] contrast-[1.08]"
                  : "opacity-0 scale-100 pointer-events-none"
              }`}
            />
          ))}
          
          {/* LAYERED VIGNETTE & CINEMATIC GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-[#111827]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/90 via-[#111827]/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(197,216,47,0.08)_0%,transparent_60%)] pointer-events-none" />
        </div>

        {/* KOORDINAT RESMI DESA */}
        <div className="pointer-events-none absolute right-8 sm:right-16 top-28 z-10 hidden md:flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-slate-300/40 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5D82F] animate-pulse" />
          <span>7°22&apos;48&quot;S 112°44&apos;20&quot;E • GEDANGAN, SIDOARJO</span>
        </div>

        {/* TEKS BACKGROUND RAKSASA "SAWOTRATAP" */}
        <div className="pointer-events-none absolute inset-x-0 top-16 sm:top-20 z-0 flex justify-center select-none overflow-hidden px-4">
          <h1 className="text-[11vw] font-black uppercase tracking-[0.16em] text-white/[0.04] mix-blend-overlay leading-none text-center whitespace-nowrap">
            SAWOTRATAP
          </h1>
        </div>

        {/* KONTEN UTAMA HERO */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 pb-12 pt-40 sm:px-10 lg:px-16">
          
          <div className="h-6" />

          {/* HEADLINE UTAMA */}
          <div className="my-auto max-w-2xl pt-16 relative">
            
            <div className="absolute -top-16 -left-12 w-80 h-80 rounded-full bg-[#C5D82F]/12 blur-3xl pointer-events-none animate-lime-glow -z-10" />

            {/* STATUS CHIP */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#111827]/60 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#C5D82F] animate-ping" />
              <span>Portal Resmi Pemerintah Desa Sawotratap • Gedangan, Sidoarjo</span>
            </div>

            <h2 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.08] text-white drop-shadow-2xl">
              Bersatu Membangun <br />
              <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.35)]">
                Komunitas Digital
              </span>
            </h2>

            <p className="mt-5 text-sm sm:text-base text-slate-200/90 font-medium leading-relaxed max-w-xl">
              Wadah keterbukaan informasi publik, layanan surat mandiri, direktori potensi ekonomi UMKM, dan tata kelola keuangan desa berbasis transparansi digital.
            </p>

            {/* Tombol Aksi */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#pengaduan"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C5D82F] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#111827] shadow-xl shadow-[#C5D82F]/25 transition-all duration-300 hover:scale-105 hover:bg-[#b8cb26] hover:shadow-[#C5D82F]/40"
              >
                <span>Sampaikan Pengaduan</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <a
                href="#layanan"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 hover:scale-105 shadow-lg text-xs font-bold text-white"
                aria-label="Jelajahi Fitur"
              >
                <span>Jelajahi Layanan</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          </div>

          {/* BAGIAN BAWAH: DATA STATISTIK + SLIDER DOKUMENTASI RINGKAS */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 border-t border-white/15">
            
            {/* STATISTIK KAPSUL MINIMALIS */}
            <div className="inline-flex flex-wrap items-center justify-between gap-6 sm:gap-8 rounded-full border border-white/15 bg-[#111827]/75 px-7 py-4 backdrop-blur-2xl shadow-2xl">
              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white tabular-nums">8,234</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">Total penduduk</p>
              </div>

              <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white tabular-nums">98.4%</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">Laporan selesai</p>
              </div>

              <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white tabular-nums">150+</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">UMKM terverifikasi</p>
              </div>

              <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white tabular-nums">24/7</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">Layanan mandiri</p>
              </div>
            </div>

            {/* FLOATING SLIDE INDICATOR DOKUMENTASI */}
            <div className="inline-flex items-center gap-4 rounded-full border border-white/15 bg-[#111827]/75 px-5 py-3 backdrop-blur-2xl shadow-2xl shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#C5D82F]">
                  Dokumentasi
                </span>
                <span className="text-xs font-semibold text-white max-w-[150px] truncate">
                  {currentSlide.title}
                </span>
              </div>

              <div className="h-5 w-[1px] bg-white/20" />

              {/* DOTS NAVIGASI SLIDE */}
              <div className="flex gap-1.5 items-center">
                {LOKAL_FOTO_DESA.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "w-5 bg-[#C5D82F]" : "w-1.5 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Ke slide ${idx + 1}`}
                  />
                ))}
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