"use client";

import React, { useState } from "react";

// =========================================================================
// 🛒 DATA UMKM LOKAL SAWOTRATAP (Dapat ditambah / disesuaikan)
// =========================================================================
const DATA_UMKM = [
  {
    id: 1,
    nama: "Kue Khas Sawotratap",
    kategori: "Kuliner",
    harga: "Mulai Rp 15rb",
    rating: 4.9,
    ulasan: 128,
    deskripsi: "Aneka kue basah dan jajanan pasar tradisional khas dengan bahan alami berkualitas tanpa pengawet.",
    lokasi: "RT 03 / RW 02, Sawotratap",
    kontak: "6281234567890",
    foto: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    nama: "Batik Tulis Sidoarjo",
    kategori: "Kerajinan",
    harga: "Mulai Rp 120rb",
    rating: 4.8,
    ulasan: 95,
    deskripsi: "Kerajinan batik tulis bermotif lokal Sawotratap asli buatan kelompok ibu-ibu PKK desa.",
    lokasi: "RW 05, Sawotratap",
    kontak: "6281234567891",
    foto: "https://images.unsplash.com/photo-1606744888344-49423b381700?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    nama: "Kedai Kopi Kampoeng",
    kategori: "Minuman",
    harga: "Mulai Rp 10rb",
    rating: 4.9,
    ulasan: 210,
    deskripsi: "Tempat nongkrong santai warga dengan sajian racikan kopi lokal nusantara dan camilan hangat.",
    lokasi: "Jl. Raya Sawotratap No. 12",
    kontak: "6281234567892",
    foto: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    nama: "Keripik Tempe Renyah",
    kategori: "Camilan",
    harga: "Mulai Rp 8rb",
    rating: 4.7,
    ulasan: 84,
    deskripsi: "Olahan keripik tempe guris bumbu rempah asli yang cocok dijadikan oleh-oleh khas desa.",
    lokasi: "RT 01 / RW 01, Sawotratap",
    kontak: "6281234567893",
    foto: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800",
  },
];

export default function UmkmSection() {
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const daftarKategori = ["Semua", "Kuliner", "Kerajinan", "Minuman", "Camilan"];

  const umkmFiltered = kategoriAktif === "Semua" 
    ? DATA_UMKM 
    : DATA_UMKM.filter(item => item.kategori === kategoriAktif);

  return (
    <section id="umkm" className="relative z-10 bg-slate-950 py-20 px-6 sm:px-10 lg:px-16 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        
        {/* CONTAINER KARTU UTAMA (Mirip gaya Referensi Gambar) */}
        <div className="rounded-3xl border border-white/15 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C7D42B]">
                Ekonomi Kreatif Warga
              </span>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Direktori UMKM Lokal
              </h3>
            </div>
            
            <p className="max-w-md text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mendukung potensi ekonomi warga Sawotratap. Temukan produk lokal berkualitas, kuliner khas, serta kerajinan tangan langsung dari pengrajin desa.
            </p>
          </div>

          {/* TAB FILTER KATEGORI */}
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-white/10">
            {daftarKategori.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setKategoriAktif(kategori)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
                  kategoriAktif === kategori
                    ? "bg-[#C7D42B] text-slate-950 shadow-lg shadow-[#C7D42B]/20 scale-105"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {kategori}
              </button>
            ))}
          </div>

          {/* GRID BOX UMKM (Inspirasi dari referensi gambar kamu) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {umkmFiltered.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-slate-950/70 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:shadow-2xl"
              >
                <div>
                  {/* FOTO PRODUK + PRICE TAG DI KANAN ATAS */}
                  <div className="relative h-52 w-full overflow-hidden rounded-xl">
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Badge Harga (Kanan Atas seperti Gambar Referensi) */}
                    <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 border border-white/20 text-[10px] font-bold text-[#C7D42B]">
                      {item.harga}
                    </div>

                    {/* Rating & Kategori (Kiri Bawah Foto) */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="rounded-md bg-[#2961B1]/80 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                        {item.kategori}
                      </span>
                      
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-slate-950/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        ★ {item.rating} <span className="text-[9px] text-slate-400">({item.ulasan})</span>
                      </div>
                    </div>
                  </div>

                  {/* INFORMASI PRODUK */}
                  <div className="mt-4 px-1">
                    <h4 className="text-base font-bold text-white group-hover:text-[#C7D42B] transition-colors leading-snug">
                      {item.nama}
                    </h4>
                    
                    <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-[#64A8E5] shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="truncate">{item.lokasi}</span>
                    </div>
                  </div>
                </div>

                {/* TOMBOL KONTAK WA PENJUAL */}
                <div className="mt-5 pt-3 border-t border-white/10 px-1">
                  <a
                    href={`https://wa.me/${item.kontak}?text=Halo%20penjual%20${encodeURIComponent(item.nama)},%20saya%20tertarik%20dengan%20produk%20Anda.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-[#C7D42B] py-2.5 text-xs font-bold text-white hover:text-slate-950 transition-all duration-300"
                  >
                    <span>Hubungi Penjual</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>

              </div>
            ))}
          </div>

          {/* FOOTER NAVIGASI / TOMBOL LIHAT LEBIH BANYAK */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <a
              href="#semua-umkm"
              className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-6 py-2.5 text-xs font-bold hover:bg-[#C7D42B] transition-colors"
            >
              <span>Jelajahi Semua UMKM Desa</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>

            <p className="text-xs text-slate-400">
              Menampilkan {umkmFiltered.length} dari {DATA_UMKM.length} usaha terdaftar
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}