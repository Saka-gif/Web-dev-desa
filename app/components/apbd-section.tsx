"use client";

import React, { useState } from "react";

export default function ApbdSection() {
  const [statusFilter, setStatusFilter] = useState<"selesai" | "proses">("selesai");

  return (
    <section id="transparansi" className="relative z-10 bg-[#F4F6F8] py-24 px-6 sm:px-10 lg:px-16 text-slate-900 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER SECTION & CAPSULE STATUS SWITCHER (PERSIS BAGIAN ATAS GAMBAR REFERENSI) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#2961B1]">
              Transparansi Keuangan & Program
            </span>
            <h3 className="mt-1 text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Laporan APBDes 2026
            </h3>
          </div>

          {/* CAPSULE STATUS SWITCHER (PERSIS BAGIAN TOP BAR REFERENSI) */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-white p-1.5 border border-slate-200 shadow-sm">
              <button
                onClick={() => setStatusFilter("selesai")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  statusFilter === "selesai"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Program Selesai</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusFilter === "selesai" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                  14
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("proses")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  statusFilter === "proses"
                    ? "bg-[#2961B1] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Dalam Proses</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusFilter === "proses" ? "bg-[#1f4884] text-white" : "bg-slate-100 text-slate-700"}`}>
                  3
                </span>
              </button>
            </div>

            {/* TOMBOL UNDUH PDF */}
            <a
              href="#download-pdf"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-[#2961B1] text-white px-5 py-3 text-xs font-bold transition-all shadow-md shrink-0"
            >
              <span className="text-[#C7D42B]">+</span>
              <span>Unduh PDF</span>
            </a>
          </div>
        </div>

        {/* MAIN DASHBOARD BENTO GRID (SAMA DENGAN KARTU TATA LETAK GAMBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* KIRI ATAS: 2x2 MINI STAT CARDS */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            
            {/* Stat 1 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pagu APBDes</span>
                <span className="text-slate-300">••</span>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900">Rp 2.85 M</h4>
                <p className="text-xs font-semibold text-emerald-600 mt-1">✓ Terverifikasi BPD</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Realisasi Dana</span>
                <span className="text-slate-300">••</span>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900">Rp 2.62 M</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Penyerapan 91.9%</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Alokasi Fisik</span>
                <span className="text-slate-300">••</span>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900">1.25 M</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Infrastruktur Publik</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sisa / Surplus</span>
                <span className="text-slate-300">••</span>
              </div>
              <div className="mt-4">
                <h4 className="text-2xl sm:text-3xl font-black text-[#2961B1]">230 Jt</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Dana Cadangan Desa</p>
              </div>
            </div>

          </div>

          {/* KANAN ATAS: WEATHER & ENVIRONMENT CARD (TAMBAHAN INFORMASI LOKAL SAWOTRATAP) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cuaca Sawotratap Hari Ini</span>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span>⛅ Cerah Berawan</span>
                <span>•</span>
                <span>💨 62% Hum</span>
              </div>
            </div>

            <div className="text-center my-4">
              <span className="text-5xl font-black text-slate-900">30°C</span>
              <p className="text-xs text-slate-400 font-medium mt-1">Sidoarjo, Jawa Timur</p>
            </div>

            {/* Weather Bar Indicator */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400" />
              <div className="h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
            </div>
          </div>

          {/* KIRI BAVAH: GREEN GRADIENT GLASS CARD (SESUAI SOIL HEALTH DARI REFERENSI) */}
          <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 p-7 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-extrabold text-white">Alokasi Utama APBDes 2026</h4>
                <span className="text-emerald-300 text-xs">••</span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-100">Infrastruktur & Pembangunan</span>
                    <span className="text-[#C7D42B]">92% (1.15 M)</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-[#C7D42B] to-emerald-300 rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-100">Pemberdayaan UMKM Warga</span>
                    <span className="text-[#C7D42B]">93.8% (610 Jt)</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-[#C7D42B] to-emerald-300 rounded-full w-[93.8%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-100">Pembinaan & Operasional</span>
                    <span className="text-[#C7D42B]">93.3% (420 Jt)</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-[#C7D42B] to-emerald-300 rounded-full w-[93.3%]" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-emerald-200 font-medium mt-6">
              * Diperbarui secara real-time berdasarkan pencairan kas desa.
            </p>
          </div>

          {/* KANAN BAVAH: DONUT CHART PERFORMANCE (SAMA DENGAN FARM PERFORMANCE REFERENSI) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-extrabold text-slate-900">Efektivitas Kinerja APBDes</h4>
              <span className="text-slate-300">••</span>
            </div>

            {/* DONUT CHART SIMULASI */}
            <div className="flex items-center justify-center my-4">
              <div className="relative h-44 w-44 rounded-full border-[14px] border-emerald-500 border-t-[#2961B1] border-r-[#C7D42B] flex items-center justify-center">
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Skor Kinerja</span>
                  <span className="text-3xl font-black text-slate-900">92%</span>
                </div>
              </div>
            </div>

            {/* LEGENDA DONUT */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Infrastruktur (61%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#C7D42B]" />
                <span>UMKM (24%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2961B1]" />
                <span>Lainnya (15%)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}