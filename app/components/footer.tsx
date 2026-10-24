"use client";

import React from "react";
import { MapPin, Clock, Plane } from "lucide-react";

export default function Footer() {
  const currentYear = 2025;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="kontak" className="relative z-10 bg-gradient-to-b from-[#064E3B] via-[#093529] to-[#0B1320] text-white pt-20 pb-12 px-6 sm:px-10 lg:px-16 border-t border-emerald-800/60 overflow-hidden font-sans">
      
      {/* SUBTLE BOTANICAL & TOPOGRAPHIC BACKGROUND PATTERN */}
      <div className="pointer-events-none absolute -right-16 -top-16 w-96 h-96 opacity-[0.04] -z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-200" fill="currentColor">
          <path d="M44.7,-64.4C58.1,-55.8,69.2,-43.3,75.1,-28.6C81,-13.9,81.6,3,76.5,18.1C71.3,33.2,60.4,46.5,47.2,56.8C34,67.1,18.5,74.4,2.3,71.2C-13.9,68.1,-30.9,54.4,-44.6,41.9C-58.4,29.4,-68.9,18,-72.5,3.7C-76.1,-10.7,-72.8,-27.9,-63.3,-41.4C-53.7,-54.9,-37.9,-64.7,-22.4,-70.7C-6.9,-76.8,8.3,-79,24,-76.1C39.7,-73.2,41.4,-67.2,44.7,-64.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="pointer-events-none absolute -left-20 bottom-10 w-80 h-80 opacity-[0.03] -z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="#C5D82F" strokeWidth="0.8">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="15" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* MAIN FOOTER GRID (4 BALANCED COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          
          {/* KOLOM 1: IDENTITAS DESA & BRAND (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Logo & Brand Name */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-[#064E3B] via-[#0b3c2f] to-[#111827] border border-[#C5D82F]/40 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#C5D82F]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider text-white leading-none">
                  PEMERINTAH DESA SAWOTRATAP
                </span>
                <span className="font-black text-xs tracking-widest text-[#C5D82F] uppercase mt-1">
                  PORTAL SMART SERVICE
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#EDF3E9]/80 leading-relaxed max-w-md font-medium">
              Sistem informasi pelayanan digital terpadu Pemerintah Desa Sawotratap, Kecamatan Gedangan, Kabupaten Sidoarjo. Menghadirkan akses keterbukaan data, administrasi online mandiri, transparansi anggaran APBDes, dan pemberdayaan ekonomi kreatif lokal.
            </p>

            {/* Badges / Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5D82F]" />
                <span>Desa Digital Mandiri</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-medium text-slate-300">
                Kode Pos: 61254
              </span>
            </div>

          </div>

          {/* KOLOM 2: NAVIGASI PORTAL (2 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C5D82F]">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#EDF3E9]/80">
              <li>
                <a href="/" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Beranda</span>
                </a>
              </li>
              <li>
                <a href="/profil" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Profil Desa</span>
                </a>
              </li>
              <li>
                <a href="/pemerintahan" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Pemerintahan & Pamong</span>
                </a>
              </li>
              <li>
                <a href="/informasi" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Informasi & Berita</span>
                </a>
              </li>
              <li>
                <a href="/layanan" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Layanan Warga</span>
                </a>
              </li>
              <li>
                <a href="/kontak" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Kontak & Lokasi</span>
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: LAYANAN PUBLIK (2 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C5D82F]">
              Layanan Online
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-[#EDF3E9]/80">
              <li>
                <a href="/layanan#surat" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Surat Pengantar RT/RW</span>
                </a>
              </li>
              <li>
                <a href="/layanan#surat" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Keterangan Domisili</span>
                </a>
              </li>
              <li>
                <a href="/layanan#surat" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Izin Usaha Mikro (SKU)</span>
                </a>
              </li>
              <li>
                <a href="/layanan#pengaduan" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Aspirasi & Pengaduan</span>
                </a>
              </li>
              <li>
                <a href="/layanan#umkm" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-400">›</span>
                  <span>Pasar Produk UMKM</span>
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: KANTOR & WILAYAH (3 COLS) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C5D82F]">
              Kantor Desa Sawotratap
            </h4>
            
            <div className="space-y-3 text-xs text-[#EDF3E9]/80 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                <span>
                  Jl. Raya Sawotratap, Kec. Gedangan, Kabupaten Sidoarjo, Jawa Timur 61254
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                <div>
                  <span className="block font-semibold text-white">Jam Operasional Pelayanan:</span>
                  <span>Senin – Jumat: 08.00 – 15.00 WIB</span>
                  <span className="block text-[11px] text-[#C5D82F] mt-0.5">Layanan Mandiri Online: 24 Jam Non-Stop</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                <span>
                  Koridor Strategis Flyover Aloha & Bandara Juanda
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          
          <div className="text-center sm:text-left">
            <p>
              © {currentYear} <span className="text-white font-semibold">Pemerintah Desa Sawotratap</span>. Hak Cipta Dilindungi.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Kecamatan Gedangan • Kabupaten Sidoarjo • Provinsi Jawa Timur
            </p>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition-all hover:text-[#C5D82F] shadow-sm"
          >
            <span>Kembali ke Atas</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>

        </div>

      </div>

    </footer>
  );
}
