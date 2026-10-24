"use client";

import React, { useState } from "react";
import { CheckCircle2, CloudSun, Droplets } from "lucide-react";

export default function ApbdSection() {
  const [statusFilter, setStatusFilter] = useState<"selesai" | "proses">("selesai");

  return (
    <section id="transparansi" className="relative z-10 bg-gradient-to-b from-[#FAF9F4] via-[#F4F6F8] to-[#FAF9F4] py-24 px-6 sm:px-10 lg:px-16 text-slate-900 border-t border-[#E3E8E2] overflow-hidden">
      {/* Invisible anchors for #pemerintahan, #pamong, #lembaga */}
      <div id="pemerintahan" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="pamong" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="lembaga" className="absolute -top-24 left-0 pointer-events-none" />
      
      {/* SUBTLE CIVIC GRID ACCENT */}
      <div className="pointer-events-none absolute -left-20 bottom-10 w-80 h-80 opacity-[0.025] -z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
          <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="#064E3B" strokeWidth="1" />
          <path d="M10 50h80M50 10v80" stroke="#064E3B" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* HEADER SECTION & CAPSULE STATUS SWITCHER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3.5 py-1 text-xs font-bold text-[#064E3B] shadow-xs mb-3">
              <span className="h-2 w-2 rounded-full bg-[#047857]" />
              <span>Transparansi Keuangan & Program</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
              Laporan APBDes 2026
            </h3>
          </div>

          {/* CAPSULE STATUS SWITCHER */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-white p-1.5 border border-[#E3E8E2] shadow-xs">
              <button
                onClick={() => setStatusFilter("selesai")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  statusFilter === "selesai"
                    ? "bg-[#064E3B] text-white shadow-md shadow-emerald-950/20"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Program Selesai</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${statusFilter === "selesai" ? "bg-[#047857] text-[#C5D82F]" : "bg-slate-100 text-slate-700"}`}>
                  14
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("proses")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  statusFilter === "proses"
                    ? "bg-[#111827] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Dalam Proses</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${statusFilter === "proses" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}`}>
                  3
                </span>
              </button>
            </div>

            {/* TOMBOL UNDUH PDF */}
            <a
              href="#download-pdf"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#111827] hover:bg-[#064E3B] text-white px-5 py-3 text-xs font-bold transition-all shadow-md shrink-0"
            >
              <span className="text-[#C5D82F] font-black">+</span>
              <span>Unduh PDF</span>
            </a>
          </div>
        </div>

        {/* MAIN DASHBOARD BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* KIRI ATAS: 2x2 MINI STAT CARDS */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            
            {/* Stat 1 */}
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Pagu APBDes</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tabular-nums">Rp 2.85 M</h4>
                <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Terverifikasi BPD</span>
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Realisasi Dana</span>
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tabular-nums">Rp 2.62 M</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Penyerapan 91.9%</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Alokasi Fisik</span>
                <div className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tabular-nums">1.25 M</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Infrastruktur Publik</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sisa / Surplus</span>
                <div className="w-2 h-2 rounded-full bg-teal-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-extrabold text-[#064E3B] tabular-nums">230 Jt</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Dana Cadangan Desa</p>
              </div>
            </div>

          </div>

          {/* KANAN ATAS: WEATHER & ENVIRONMENT CARD */}
          <div className="lg:col-span-5 rounded-3xl border border-[#E3E8E2] bg-gradient-to-br from-white via-[#FAF9F5] to-amber-50/20 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cuaca Sawotratap Hari Ini</span>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <span className="inline-flex items-center gap-1 text-slate-700">
                  <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cerah Berawan</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-700">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>62% Hum</span>
                </span>
              </div>
            </div>

            <div className="text-center my-4">
              <span className="text-5xl font-black text-[#111827] tabular-nums">30°C</span>
              <p className="text-xs text-slate-500 font-medium mt-1">Sidoarjo, Jawa Timur • Stasiun BMKG Juanda</p>
            </div>

            {/* Weather Bar Indicator */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-[#C5D82F]" title="Indeks Udara Sehat" />
              <div className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" title="Suhu Optimal" />
            </div>
          </div>

          {/* KIRI BAVAH: GREEN GRADIENT GLASS CARD */}
          <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#094838] to-[#0f2c22] p-7 text-white shadow-xl shadow-emerald-950/25 border border-emerald-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Alokasi Utama APBDes 2026</span>
                  <span className="text-[10px] font-extrabold bg-[#C5D82F] text-[#111827] px-2 py-0.5 rounded-full">
                    91.9% Terserap
                  </span>
                </h4>
                <span className="text-emerald-300 text-xs">•••</span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-100">Infrastruktur & Pembangunan</span>
                    <span className="text-[#C5D82F] font-mono">92% (1.15 M)</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-[#C5D82F] to-emerald-300 rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-100">Pemberdayaan UMKM Warga</span>
                    <span className="text-[#C5D82F] font-mono">93.8% (610 Jt)</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-[#C5D82F] to-emerald-300 rounded-full w-[93.8%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-100">Pembinaan & Operasional</span>
                    <span className="text-[#C5D82F] font-mono">93.3% (420 Jt)</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-[#C5D82F] to-emerald-300 rounded-full w-[93.3%]" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-emerald-200/80 font-medium mt-6 pt-4 border-t border-emerald-800/60">
              * Diperbarui secara berkala berdasarkan pencairan kas desa Sawotratap.
            </p>
          </div>

          {/* KANAN BAVAH: DONUT CHART PERFORMANCE DENGAN SVG RESMI */}
          <div className="lg:col-span-6 rounded-3xl border border-[#E3E8E2] bg-white p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-extrabold text-[#111827]">Efektivitas Kinerja APBDes</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Evaluasi realisasi anggaran terhadap target</p>
              </div>
              <span className="text-slate-300 text-xs">•••</span>
            </div>

            {/* DONUT CHART SVG DENGAN STROKE PRESISI */}
            <div className="flex items-center justify-center my-4">
              <div className="relative h-44 w-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                  
                  {/* Segment 1: Infrastruktur 61% (Emerald) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#047857"
                    strokeWidth="12"
                    strokeDasharray="238.76"
                    strokeDashoffset="93.1"
                    strokeLinecap="round"
                  />
                  
                  {/* Segment 2: UMKM 24% (Fresh Lime) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#C5D82F"
                    strokeWidth="12"
                    strokeDasharray="238.76"
                    strokeDashoffset="181.45"
                    strokeLinecap="round"
                    className="opacity-95"
                  />
                  
                  {/* Segment 3: Lainnya 15% (Deep Navy) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#111827"
                    strokeWidth="12"
                    strokeDasharray="238.76"
                    strokeDashoffset="202.9"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skor Kinerja</span>
                  <span className="text-3xl font-black text-[#111827] tabular-nums">92%</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">Sangat Baik</span>
                </div>
              </div>
            </div>

            {/* LEGENDA DONUT */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-600 pt-3 border-t border-[#E3E8E2]/80">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#047857]" />
                <span>Infrastruktur (61%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#C5D82F]" />
                <span>UMKM (24%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#111827]" />
                <span>Lainnya (15%)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}