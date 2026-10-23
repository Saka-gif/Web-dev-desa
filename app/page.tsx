"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import BeritaSection from "./components/berita-section";
import UmkmSection from "./components/umkm-section";
import LayananSection from "./components/layanan-section";
import ApbdSection from "./components/apbd-section";

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
    <main className="relative min-h-screen w-full bg-slate-950 text-white overflow-x-hidden font-sans">
      {/* 1. NAVBAR DENGAN DROPDOWN */}
      <Navbar />

      {/* 2. HERO SECTION */}
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
                  ? "opacity-100 scale-105 brightness-[0.65] contrast-[1.05]"
                  : "opacity-0 scale-100 pointer-events-none"
              }`}
            />
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/30" />
        </div>

        {/* TEKS BACKGROUND RAKSASA "SAWOTRATAP" (Posisi Dinaikkan ke Atas & Opacity Ditipiskan) */}
        <div className="pointer-events-none absolute inset-x-0 top-16 sm:top-20 z-0 flex justify-center select-none overflow-hidden px-4">
          <h1 className="text-[11vw] font-black uppercase tracking-wider text-white/10 mix-blend-overlay leading-none text-center whitespace-nowrap">
            SAWOTRATAP
          </h1>
        </div>

        {/* KONTEN UTAMA HERO */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 pb-12 pt-40 sm:px-10 lg:px-16">
          
          <div className="h-6" />

          {/* HEADLINE UTAMA (Sudah tidak tertimpa teks background) */}
          <div className="my-auto max-w-2xl pt-16">
            <h2 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.08] text-white drop-shadow-2xl">
              Bersatu Membangun <br />
              <span className="text-[#C7D42B]">
                Komunitas Digital
              </span>
            </h2>

            {/* Tombol Aksi */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#pengaduan"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C7D42B] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#b5c225]"
              >
                <span>Sampaikan Pengaduan</span>
              </a>

              <a
                href="#layanan"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
                aria-label="Jelajahi Fitur"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          </div>

          {/* BAGIAN BAVAH: DATA STATISTIK + SLIDER DOKUMENTASI RINGKAS */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 border-t border-white/15">
            
            {/* STATISTIK KAPSUL MINIMALIS */}
            <div className="inline-flex flex-wrap items-center justify-between gap-6 sm:gap-8 rounded-full border border-white/15 bg-slate-950/60 px-7 py-4 backdrop-blur-xl shadow-2xl">
              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white">12.4K+</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">Total penduduk</p>
              </div>

              <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white">98.4%</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">Laporan selesai</p>
              </div>

              <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white">150+</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">UMKM terverifikasi</p>
              </div>

              <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

              <div className="text-left">
                <p className="text-2xl sm:text-3xl font-light tracking-tight text-white">24/7</p>
                <p className="text-[10px] font-medium text-slate-300 capitalize mt-0.5">Layanan mandiri</p>
              </div>
            </div>

            {/* FLOATING SLIDE INDICATOR DOKUMENTASI */}
            <div className="inline-flex items-center gap-4 rounded-full border border-white/15 bg-slate-950/60 px-5 py-3 backdrop-blur-xl shadow-2xl shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#C7D42B]">
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
                      currentIndex === idx ? "w-5 bg-[#C7D42B]" : "w-1.5 bg-white/30 hover:bg-white/60"
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
    </main>
  );
}