"use client";

import React from "react";
import { Star, MapPin, Check } from "lucide-react";

const DATA_UMKM = [
  {
    id: 1,
    nama: "Kue Khas Sawotratap",
    kategori: "Kuliner Lokal",
    harga: "Rp 15.000",
    rating: "4.9",
    lokasi: "RT 03 / RW 02",
    foto: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    fitur: [
      "Bahan alami tanpa pengawet",
      "Siap antar area Sawotratap",
      "Menerima pesanan hajatan",
      "Garansi produk segar",
    ],
  },
  {
    id: 2,
    nama: "Batik Tulis Sidoarjo",
    kategori: "Kerajinan Tangan",
    harga: "Rp 120.000",
    rating: "4.8",
    lokasi: "RW 05, Sawotratap",
    foto: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&q=80&w=800",
    fitur: [
      "Motif khas daun & bunga",
      "Kain katun primissima super",
      "Buatan pengrajin lokal",
      "Custom warna & ukuran",
    ],
  },
  {
    id: 3,
    nama: "Kedai Kopi Kampoeng",
    kategori: "Minuman & Olahan",
    harga: "Rp 10.000",
    rating: "4.9",
    lokasi: "Jl. Raya Sawotratap No. 12",
    foto: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
    fitur: [
      "Biji kopi arabika nusantara",
      "Area nongkrong outdoor adem",
      "Free Wi-Fi warga 100 Mbps",
      "Buka sampai jam 23.00 WIB",
    ],
  },
];

export default function UmkmSection() {
  return (
    <section id="umkm" className="relative z-10 bg-gradient-to-b from-[#FAF9F4] via-[#F4F8F1] to-[#FAF9F4] py-24 px-6 sm:px-10 lg:px-16 text-slate-900 border-t border-[#E3E8E2] overflow-hidden">
      
      {/* SUBTLE ORGANIC DECORATIVE PATTERN */}
      <div className="pointer-events-none absolute -left-20 top-24 w-80 h-80 opacity-[0.035] -z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#047857]" fill="currentColor">
          <path d="M41.7,-57.1C53.7,-49.2,63,-37.2,68.9,-23.1C74.8,-8.9,77.4,7.4,73.1,22.2C68.9,37,57.9,50.3,44.1,59.3C30.4,68.3,13.9,73,-2.2,76C-18.4,79,-34.2,80.3,-47.1,72.9C-60,65.5,-69.9,49.4,-75.4,32.4C-80.9,15.5,-82.1,-2.3,-77.2,-18.2C-72.3,-34.1,-61.4,-48.1,-47.5,-55.6C-33.6,-63.1,-16.8,-64,-0.4,-63.5C16.1,-62.9,29.8,-65.1,41.7,-57.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* HEADER & JUDUL */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3.5 py-1 text-xs font-bold text-[#064E3B] shadow-xs mb-3">
            <span className="h-2 w-2 rounded-full bg-[#047857]" />
            <span>Ekonomi Kreatif Warga</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
            Direktori UMKM Desa
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Dukung potensi ekonomi warga Sawotratap. Temukan produk kuliner khas, kerajinan buatan tangan, dan jasa lokal berkualitas tinggi.
          </p>
        </div>

        {/* GRID CARD KAPSUL UMKM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {DATA_UMKM.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/6 hover:border-emerald-300/80 flex flex-col justify-between card-interactive-2d"
            >
              <div>
                {/* GAMBAR PRODUK */}
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 mb-5">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-slate-800 shadow-sm border border-slate-100 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{item.lokasi}</span>
                  </div>
                </div>

                {/* JUDUL DAN HARGA */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-lg font-extrabold text-[#111827] leading-tight group-hover:text-[#064E3B] transition-colors">
                      {item.nama}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      {item.kategori}
                    </p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-[#064E3B]">
                      {item.harga}
                    </span>
                    <p className="text-[10px] font-medium text-slate-400">
                      Mulai dari
                    </p>
                  </div>
                </div>

                {/* DAFTAR FITUR / KEUNGGULAN PRODUK */}
                <ul className="mt-5 space-y-2.5 pt-4 border-t border-[#E3E8E2]/70">
                  {item.fitur.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TOMBOL ORDER / HUBUNGI PENJUAL */}
              <div className="mt-7">
                <a
                  href={`https://wa.me/628123456789?text=Halo%20penjual%20${encodeURIComponent(item.nama)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C5D82F] hover:bg-[#b8cb26] py-3.5 text-xs font-black uppercase tracking-wider text-[#111827] shadow-lg shadow-[#C5D82F]/20 hover:shadow-xl hover:shadow-[#C5D82F]/30 transition-all duration-300 hover:scale-[1.02] group/btn shine-hover"
                >
                  <span>Hubungi Penjual</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 arrow-slide">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* FOOTER LIHAT SEMUA */}
        <div className="mt-14 text-center">
          <a
            href="/layanan#umkm"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-[#111827] hover:text-white hover:border-[#111827] hover:shadow-lg transition-all duration-300 shine-hover"
          >
            <span>Jelajahi Katalog UMKM Selengkapnya</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 arrow-slide">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}