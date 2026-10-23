"use client";

import React from "react";

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
    <section id="umkm" className="relative z-10 bg-gradient-to-b from-[#F8FAFC] via-slate-100 to-slate-200 py-24 px-6 sm:px-10 lg:px-16 text-slate-900 border-t border-slate-200/80">
      
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER & JUDUL */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#2961B1] italic">
            Ekonomi Kreatif Warga
          </span>
          <h3 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Direktori UMKM Desa
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Dukung potensi ekonomi warga Sawotratap. Temukan produk kuliner khas, kerajinan buatan tangan, dan jasa lokal berkualitas tinggi.
          </p>
        </div>

        {/* GRID CARD KAPSUL UMKM (PERSIS SEPERTI GAMBAR REFERENSI DARI USER) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {DATA_UMKM.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-[40px] border border-slate-200/90 bg-white p-6 shadow-2xl shadow-slate-300/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-3xl flex flex-col justify-between"
            >
              <div>
                {/* GAMBAR LENGKUNG DI BAGIAN ATAS */}
                <div className="relative h-44 w-full overflow-hidden rounded-[28px] bg-slate-100 mb-6">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-slate-800 shadow-sm flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* JUDUL DAN HARGA */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#2961B1] transition-colors">
                      {item.nama}
                    </h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      {item.kategori}
                    </p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-[#2961B1]">
                      {item.harga}
                    </span>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Mulai dari
                    </p>
                  </div>
                </div>

                {/* DAFTAR FITUR / KEUNGGULAN PRODUK (BULLET LIST) */}
                <ul className="mt-6 space-y-2.5 pt-4 border-t border-slate-100">
                  {item.fitur.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                      <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                        ✓
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TOMBOL ORDER / HUBUNGI PENJUAL (AKSEN LIME MENCOLOK SAMA DENGAN GAMBAR REFERENSI) */}
              <div className="mt-8">
                <a
                  href={`https://wa.me/628123456789?text=Halo%20penjual%20${encodeURIComponent(item.nama)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C7D42B] hover:bg-[#b5c225] py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-[#C7D42B]/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Hubungi Penjual</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
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
            href="#semua-umkm"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-xs font-black text-slate-800 shadow-md hover:bg-slate-900 hover:text-white transition-all duration-300"
          >
            <span>Jelajahi Katalog UMKM Selengkapnya</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}