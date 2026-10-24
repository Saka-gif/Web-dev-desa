"use client";

import React from "react";
import { DAFTAR_BERITA } from "@/app/data/berita";
import { Clock, ChevronRight, ArrowUpRight } from "lucide-react";

export default function BeritaSection() {
  // Mengambil 3 berita terbaru dari file data terpusat
  const beritaTerbaru = DAFTAR_BERITA.slice(0, 3);

  return (
    <section id="berita" className="py-16 bg-[#FAF9F4] text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E3E8E2]">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#064E3B] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#064E3B]" />
              Kabar Desa Sawotratap • 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
              Informasi & Berita
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Dapatkan pembaruan berita terkini, edaran resmi pemerintahan, serta beragam agenda kegiatan warga Desa Sawotratap.
          </p>
        </div>

        {/* GRID KARTU BERITA SINKRON */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {beritaTerbaru.map((item, index) => (
            <article
              key={item.id || index}
              className={`rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                index === 1 ? "ring-2 ring-[#064E3B]/20" : ""
              }`}
            >
              <div>
                {/* FOTO BERITA & BADGE */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.foto}
                    alt={item.judul}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black text-slate-800 shadow-sm border border-slate-200/80">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* METADATA & JUDUL BERITA */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-2">
                    <span>{item.penulis}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.tanggal}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#111827] group-hover:text-[#064E3B] transition-colors leading-snug line-clamp-2">
                    {item.judul}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {item.ringkasan}
                  </p>
                </div>
              </div>

              {/* FOOTER TOMBOL BACA */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs">
                <a
                  href="/informasi#berita"
                  className="inline-flex items-center gap-1 text-xs font-black text-[#064E3B] group-hover:text-emerald-700 transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="/informasi#berita"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-white transition-all shadow-xs"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* TOMBOL ARSIP SELURUH BERITA DESA */}
        <div className="flex justify-center pt-4">
          <a
            href="/informasi#berita"
            className="inline-flex items-center gap-2 bg-[#111827] hover:bg-slate-800 text-white px-7 py-3.5 rounded-full text-xs font-extrabold transition-all shadow-md hover:scale-105"
          >
            <span>Lihat Seluruh Arsip Berita Desa</span>
            <ChevronRight className="w-4 h-4 text-[#C5D82F]" />
          </a>
        </div>

      </div>
    </section>
  );
}