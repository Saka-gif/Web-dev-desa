"use client";

import React, { useState } from "react";
import {
  Users,
  Home,
  TrendingUp,
  MapPin,
  Map as MapIcon,
  Satellite,
  Landmark,
  Building,
  Activity,
  School,
  ExternalLink,
} from "lucide-react";

export default function DemografiSection() {
  const [mapType, setMapType] = useState<"m" | "k">("m");

  const googleMapsUrl = `https://maps.google.com/maps?q=Sawotratap,+Gedangan,+Sidoarjo&t=${mapType}&z=15&output=embed`;
  const externalMapsLink = "https://maps.app.goo.gl/SawotratapGedanganSidoarjo";
  const directionsLink = "https://www.google.com/maps/dir//Sawotratap,+Gedangan,+Sidoarjo";

  return (
    <section id="demografi" className="py-16 bg-[#FAF9F4] text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111827]">
            Demografi Desa
          </h2>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#064E3B]">
            Data Kependudukan dan Peta Wilayah
          </p>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Statistik penduduk resmi semester terbaru dan pemetaan batas wilayah administratif Desa Sawotratap, Kecamatan Gedangan, Kabupaten Sidoarjo, Jawa Timur.
          </p>
        </div>

        {/* 1. TOP 4 METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Penduduk */}
          <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Penduduk
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
                8,234 <span className="text-xs font-semibold text-slate-500">Jiwa</span>
              </h3>
              <p className="text-[10px] font-bold text-emerald-600 mt-1">
                +1.2% Pertumbuhan tahunan
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Kepala Keluarga */}
          <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Kepala Keluarga
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
                2,418 <span className="text-xs font-semibold text-slate-500">KK</span>
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">
                Rata-rata 3.4 jiwa / rumah tangga
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Usia Produktif */}
          <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Usia Produktif
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
                68.2% <span className="text-xs font-semibold text-slate-500">5,618 Jiwa</span>
              </h3>
              <p className="text-[10px] font-medium text-amber-600 font-bold mt-1">
                Bonus Demografi Unggul (15–64 th)
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Luas Wilayah */}
          <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Luas Wilayah
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
                2.45 <span className="text-xs font-semibold text-slate-500">km²</span>
              </h3>
              <p className="text-[10px] font-medium text-slate-400 mt-1">
                11 RW • 54 RT (3,360 jiwa / km²)
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* 2. MAIN DUAL-COLUMN GRID: JENIS KELAMIN (KIRI) vs PETA DESA (KANAN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* KOLOM KIRI: STATISTIK JENIS KELAMIN & TOTAL BANNER */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Kartu Berdasarkan Jenis Kelamin */}
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#111827]">
                    Berdasarkan Jenis Kelamin
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200/80">
                  Rasio 100.3
                </span>
              </div>

              {/* Laki-Laki */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" /> Laki-laki
                  </span>
                  <span className="text-slate-500 font-medium">50.07% dari populasi</span>
                  <span className="font-black text-[#111827] text-base">4,123 <span className="text-[10px] font-medium text-slate-400">Jiwa</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[50.07%]" />
                </div>
              </div>

              {/* Perempuan */}
              <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-pink-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500" /> Perempuan
                  </span>
                  <span className="text-slate-500 font-medium">49.93% dari populasi</span>
                  <span className="font-black text-[#111827] text-base">4,111 <span className="text-[10px] font-medium text-slate-400">Jiwa</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full w-[49.93%]" />
                </div>
              </div>
            </div>

            {/* Banner Total Penduduk Sawotratap */}
            <div className="rounded-3xl bg-[#064E3B] text-white p-6 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C5D82F] text-slate-950 flex items-center justify-center shrink-0 font-black">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C5D82F]">
                    TOTAL PENDUDUK
                  </span>
                  <p className="text-xs text-emerald-100 font-medium">Sawotratap, Gedangan</p>
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">8,234 <span className="text-xs font-semibold text-emerald-200">Jiwa</span></span>
            </div>

          </div>

          {/* KOLOM KANAN: KARTU PETA DESA SAWOTRATAP (TANPA 3D) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-7 shadow-xs flex flex-col h-full">
              
              {/* Header Peta & Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E8E2]/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-[#111827] flex items-center gap-2">
                      Peta Desa Sawotratap
                      <span className="hidden sm:inline-block text-[10px] font-extrabold bg-emerald-50 text-[#064E3B] border border-emerald-200/70 px-2 py-0.5 rounded-full">
                        Gedangan, Sidoarjo
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Batas wilayah dan peta geospasial resmi Desa Sawotratap
                    </p>
                  </div>
                </div>

                {/* Kontrol Tampilan Peta (Hanya Peta Jalan & Satelit) */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setMapType("m")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        mapType === "m"
                          ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Peta Jalan</span>
                    </button>
                    <button
                      onClick={() => setMapType("k")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        mapType === "k"
                          ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <Satellite className="w-3.5 h-3.5" />
                      <span>Satelit</span>
                    </button>
                  </div>

                  <a
                    href={externalMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] border border-emerald-200/80 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                    title="Buka langsung di Google Maps"
                  >
                    <span>Buka Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* EMBED GOOGLE MAPS */}
              <div className="relative mt-4 w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#E3E8E2] shadow-inner bg-slate-100">
                <iframe
                  title="Peta Interaktif Desa Sawotratap Gedangan Sidoarjo"
                  src={googleMapsUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Info Badge Atas Kiri */}
                <div className="absolute top-3 left-3 z-10 max-w-[280px] sm:max-w-xs rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-[#E3E8E2] pointer-events-auto">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-[#C5D82F] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#111827] leading-tight">
                        Desa Sawotratap
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Kec. Gedangan, Kab. Sidoarjo, Jawa Timur
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <a
                          href={directionsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#064E3B] hover:bg-[#047857] text-white px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                        >
                          <span>Rute Arah</span>
                        </a>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Kode Pos: 61254
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Status Badge Bawah Kanan */}
                <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 rounded-full bg-[#111827]/85 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-bold text-white shadow-lg border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
                  <span>Geospasial Aktif • Kec. Gedangan</span>
                </div>
              </div>

              {/* BATAS-BATAS WILAYAH ADMINISTRATIF */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Utara</span>
                  <span className="text-xs font-bold text-slate-800">Kecamatan Waru</span>
                  <span className="text-[10px] text-slate-500 block">Bungurasih & Medaeng</span>
                </div>

                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Selatan</span>
                  <span className="text-xs font-bold text-slate-800">Desa Keboansikep</span>
                  <span className="text-[10px] text-slate-500 block">Kec. Gedangan</span>
                </div>

                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Barat</span>
                  <span className="text-xs font-bold text-slate-800">Pepelegi / Aloha</span>
                  <span className="text-[10px] text-slate-500 block">Flyover Aloha Sidoarjo</span>
                </div>

                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Timur</span>
                  <span className="text-xs font-bold text-slate-800">Kecamatan Sedati</span>
                  <span className="text-[10px] text-slate-500 block">Area Bandara Juanda</span>
                </div>
              </div>

              {/* FOOTER INFO FASILITAS UTAMA */}
              <div className="mt-4 pt-3.5 border-t border-[#E3E8E2]/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-semibold text-slate-700">Fasilitas Sekitar:</span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <Landmark className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Balai Desa</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <Activity className="w-3.5 h-3.5 text-rose-600" />
                    <span>Pustu Sawotratap</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <School className="w-3.5 h-3.5 text-blue-600" />
                    <span>SDN Sawotratap</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>Masjid Baiturrahman</span>
                  </span>
                </div>

                <a
                  href="#layanan"
                  className="text-xs font-bold text-[#064E3B] hover:text-[#047857] inline-flex items-center gap-1"
                >
                  <span>Layanan Desa</span>
                  <span>→</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}