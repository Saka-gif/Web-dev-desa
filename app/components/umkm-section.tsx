"use client";

import React, { useState } from "react";
import { DAFTAR_PRODUK_UMKM } from "@/app/data/umkm";
import { ShoppingBag, Megaphone, ShieldCheck, FileText, ExternalLink, ArrowRight } from "lucide-react";

export default function UmkmSection() {
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const filterProduk = DAFTAR_PRODUK_UMKM.filter(
    (item) => kategoriAktif === "Semua" || item.kategori === kategoriAktif
  );

  const KATEGORI_LIST = [
    { nama: "Semua Produk", kat: "Semua", icon: ShoppingBag, count: "50+ Produk" },
    { nama: "Kuliner & Jajanan", kat: "Kuliner", icon: Megaphone, count: "24 UMKM" },
    { nama: "Kerajinan Tangan", kat: "Kerajinan", icon: ShieldCheck, count: "12 UMKM" },
    { nama: "Batik & Fashion", kat: "Fashion", icon: FileText, count: "15 UMKM" },
  ];

  return (
    <section id="umkm" className="py-20 bg-[#FAF9F4] text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
        
        {/* HEADER STORE UMKM */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E3E8E2] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#064E3B] animate-ping" />
              <span>Etalase Ekonomi Warga Sawotratap</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
              Store <span className="text-[#064E3B]">UMKM</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Pilih kategori untuk melihat produk unggulan desa, dukung pertumbuhan ekonomi lokal warga Sawotratap secara langsung.
            </p>
          </div>

          <a
            href="/layanan#umkm"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black transition-all shadow-sm shrink-0 hover:scale-105"
          >
            <span>Lihat Seluruh Katalog</span>
            <ArrowRight className="w-4 h-4 text-[#C5D82F]" />
          </a>
        </div>

        {/* GRID KATEGORI TOMBOL FILTER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {KATEGORI_LIST.map((item, idx) => {
            const IconComponent = item.icon;
            const isSelected = kategoriAktif === item.kat;

            return (
              <button
                key={idx}
                onClick={() => setKategoriAktif(item.kat)}
                className={`p-5 rounded-[2rem] text-left transition-all flex flex-col justify-between gap-6 border shadow-xs ${
                  isSelected
                    ? "bg-[#064E3B] border-[#064E3B] text-white ring-2 ring-emerald-500/20 scale-[1.02] shadow-md"
                    : "bg-white border-[#E3E8E2] hover:border-emerald-600 text-[#111827] hover:shadow-md"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                  isSelected ? "bg-[#C5D82F] text-[#06261D]" : "bg-emerald-50 text-[#064E3B]"
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-sm sm:text-base font-black ${isSelected ? "text-white" : "text-[#111827]"}`}>
                    {item.nama}
                  </div>
                  <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {item.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* GRID KATALOG PRODUK UMKM TERPILIH */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>Menampilkan Kategori: <strong className="text-[#064E3B]">{kategoriAktif}</strong></span>
            <span>{filterProduk.length} Produk Tersedia</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filterProduk.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="rounded-[2rem] border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* FOTO PRODUK */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-0.5 text-[10px] font-black text-[#C5D82F] border border-white/10 shadow-sm">
                      {item.rw}
                    </div>
                  </div>

                  {/* INFORMASI PRODUK */}
                  <div className="p-5 space-y-2">
                    <span className="inline-block text-[9px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {item.kategori}
                    </span>
                    <h3 className="text-sm font-black text-[#111827] group-hover:text-[#064E3B] transition-colors line-clamp-1">
                      {item.nama}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>

                {/* FOOTER KARTU PRODUK */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 truncate max-w-[100px]">
                    {item.pemilik}
                  </span>
                  <a
                    href={`https://wa.me/${item.kontak}?text=Halo%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(item.nama)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black transition-colors shadow-xs shrink-0 border border-amber-200"
                  >
                    <span>Pesan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}