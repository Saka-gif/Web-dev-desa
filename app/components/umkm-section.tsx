"use client";

import React, { useState } from "react";
import { DAFTAR_PRODUK_UMKM } from "@/app/data/umkm";
import { Star, MapPin, ChevronRight, ShoppingBag } from "lucide-react";

export default function UmkmSection() {
  const [kategoriUmkm, setKategoriUmkm] = useState("Semua");

  const filteredUmkm = DAFTAR_PRODUK_UMKM.filter(
    (item) => kategoriUmkm === "Semua" || item.kategori === kategoriUmkm
  );

  return (
    <section id="umkm" className="py-16 bg-[#FAF9F4] text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Ekonomi Kerakyatan</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Etalase Produk UMKM Desa</h2>
            </div>
          </div>

          {/* FILTER KATEGORI */}
          <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
            {["Semua", "Kuliner", "Kerajinan"].map((kat) => (
              <button
                key={kat}
                onClick={() => setKategoriUmkm(kat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  kategoriUmkm === kat ? "bg-white text-[#064E3B] shadow-xs font-extrabold" : "text-slate-600"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID PRODUK UMKM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredUmkm.map((u) => (
            <div key={u.id} className="rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img src={u.foto} alt={u.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-slate-800 rounded-full">
                    {u.kategori}
                  </span>
                  <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 text-[10px] font-black rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-slate-950" /> {u.rating}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{u.penjual}</div>
                  <h3 className="font-black text-sm text-[#111827] group-hover:text-[#064E3B] transition-colors line-clamp-1">{u.nama}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{u.lokasi}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="font-extrabold text-emerald-700 text-xs">{u.harga}</span>
                <a
                  href={`https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20pesan%20${encodeURIComponent(u.nama)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-black transition-colors"
                >
                  <span>Pesan WA</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* TOMBOL SELENGKAPNYA KE HALAMAN LAYANAN */}
        <div className="flex justify-center pt-2">
          <a
            href="/layanan#umkm"
            className="inline-flex items-center gap-2 bg-[#111827] hover:bg-slate-800 text-white px-7 py-3.5 rounded-full text-xs font-extrabold transition-all shadow-md hover:scale-105"
          >
            <span>Lihat Seluruh Direktori UMKM Desa</span>
            <ChevronRight className="w-4 h-4 text-[#C5D82F]" />
          </a>
        </div>

      </div>
    </section>
  );
}