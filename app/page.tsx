"use client";

import React, { useState } from "react";

const LOKAL_FOTO_DESA = [
  {
    id: 1,
    title: "Suasana Desa Sawotratap",
    subtitle: "Pusat Pelayanan Administrasi Digital",
    bgImg: "/aset/pedesaan.jpg",
  },
  {
    id: 2,
    title: "Kegiatan UMKM Warga",
    subtitle: "Pemberdayaan Ekonomi Lokal Sawotratap",
    bgImg: "/assets/pedesaan.jpg",
  },
  {
    id: 3,
    title: "Infrastruktur & Pembangunan",
    subtitle: "Transparansi Realisasi APBD Desa 2026",
    bgImg: "/assets/pedesaan.jpg",
  },
];

export default function Page() {
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      
      {/* 1. BACKGROUND FOTO PEDESAAN */}
      <div className="absolute inset-0 z-0">
        <img
          src={LOKAL_FOTO_DESA[activeSlide - 1].bgImg}
          alt="Lanskap Pedesaan Sawotratap"
          className="h-full w-full object-cover object-center transition-all duration-1000 brightness-[0.75] contrast-[1.05] scale-105"
        />
        
        {/* Overlay Gradasi */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/30" />
      </div>

      {/* 2. TEKS RAKSASA BACKGROUND "SAWOTRATAP" (Disesuaikan agar muat penuh 1 layar) */}
      <div className="pointer-events-none absolute inset-x-0 top-16 sm:top-20 z-0 flex justify-center select-none overflow-hidden px-4 opacity-25">
        <h1 className="text-[11vw] font-black uppercase tracking-normal text-white leading-none drop-shadow-2xl text-center whitespace-nowrap">
          SAWOTRATAP
        </h1>
      </div>

      {/* 3. KONTEN HERO UTAMA */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 pb-12 pt-32 sm:px-10 lg:px-16">
        
        <div className="h-4" />

        {/* UTAMA: Headline */}
        <div className="my-auto max-w-3xl pt-6">
          
          {/* Badge Active Status */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C7D42B]/50 bg-slate-950/60 px-4 py-1.5 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C7D42B] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C7D42B]"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C7D42B]">
              Smart Village Portal • Kec. Gedangan
            </span>
          </div>

          {/* Judul Utama */}
          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.08] text-white drop-shadow-lg">
            Bersatu Membangun <br />
            <span className="text-white">
              Komunitas Digital
            </span>
          </h2>
          
          {/* Deskripsi Singkat */}
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base font-medium drop-shadow-md">
            Satu portal terpadu untuk menghubungkan seluruh warga Sawotratap. Akses pelayanan administrasi desa secara online, sampaikan pengaduan masyarakat, pantau transparansi APBD, hingga dukung potensi UMKM lokal.
          </p>
        </div>

        {/* BAGIAN BAWAH: STATISTIK & CAROUSEL */}
        <div className="grid grid-cols-1 items-end gap-8 pt-8 lg:grid-cols-12 border-t border-white/20">
          
          <div className="space-y-6 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                  12.4K<span className="text-[#C7D42B]">+</span>
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mt-1">
                  Total Penduduk
                </p>
              </div>

              <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />

              <div>
                <p className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                  98.4<span className="text-[#64A8E5]">%</span>
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mt-1">
                  Laporan Selesai
                </p>
              </div>

              <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />

              <div>
                <p className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                  150<span className="text-[#C7D42B]">+</span>
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mt-1">
                  UMKM Terverifikasi
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#pengaduan"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C7D42B] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-black/30 transition-all duration-300 hover:scale-105 hover:bg-[#b5c225]"
              >
                <span>Sampaikan Pengaduan</span>
              </a>

              <a
                href="#layanan"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-slate-900/40 backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105"
                aria-label="Jelajahi Fitur"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>

              <p className="text-xs text-slate-300 max-w-xs leading-normal font-medium drop-shadow">
                Layanan mandiri warga Sawotratap, transparan dan terhubung langsung.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="group relative w-full max-w-xs overflow-hidden rounded-2xl border border-white/20 bg-slate-950/70 p-3 backdrop-blur-xl shadow-2xl transition-all hover:border-white/40">
              <div className="relative h-36 w-full overflow-hidden rounded-xl">
                <img
                  src={LOKAL_FOTO_DESA[activeSlide - 1].bgImg}
                  alt="Preview Dokumentasi"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-2.5 left-3 right-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#C7D42B]">
                    Dokumentasi Desa
                  </span>
                  <p className="text-xs font-bold text-white leading-tight">
                    {LOKAL_FOTO_DESA[activeSlide - 1].title}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300">
                  0{activeSlide} <span className="text-slate-500">/ 0{LOKAL_FOTO_DESA.length}</span>
                </span>

                <div className="flex gap-1.5">
                  {LOKAL_FOTO_DESA.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlide(s.id)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === s.id ? "w-6 bg-[#C7D42B]" : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Slide ${s.id}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}