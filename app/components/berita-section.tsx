"use client";

import React from "react";

const DATA_BERITA = [
  {
    id: 1,
    judul: "Penyaluran Bantuan Pangan Tahap IV untuk Warga Sawotratap",
    kategori: "Pengumuman",
    tanggal: "20 Okt 2026",
    penulis: "Sekretariat Desa",
    ringkasan: "Pemerintah Desa Sawotratap kembali menyalurkan bantuan bahan pangan pokok bagi keluarga penerima manfaat di Balai Desa.",
    bacaWaktu: "3 mnt baca",
    foto: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
    statusBadge: "Resmi",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
  },
  {
    id: 2,
    judul: "Kerja Bakti Massal & Peluncuran Program Lingkungan Hijau",
    kategori: "Kegiatan",
    tanggal: "18 Okt 2026",
    penulis: "Karang Taruna",
    ringkasan: "Warga serentak membersihkan saluran air dan menanam pohon pelindung di sepanjang jalan utama desa untuk mengantisipasi musim hujan.",
    bacaWaktu: "4 mnt baca",
    foto: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    statusBadge: "Program",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  {
    id: 3,
    judul: "Pelatihan Digitalisasi Administrasi bagi Pengurus RT & RW",
    kategori: "Pemerintahan",
    tanggal: "15 Okt 2026",
    penulis: "Tim IT Sawotratap",
    ringkasan: "Bimtek penggunaan portal Smart Service guna mempercepat proses verifikasi data pengajuan surat dan pengaduan warga secara online.",
    bacaWaktu: "5 mnt baca",
    foto: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    statusBadge: "Edukasi",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200/80",
  },
];

export default function BeritaSection() {
  return (
    <section id="berita" className="relative z-10 bg-gradient-to-b from-[#FAF9F4] via-[#F6F8F5] to-[#FAF9F4] py-24 px-6 sm:px-10 lg:px-16 text-slate-900 border-t border-[#E3E8E2] overflow-hidden">
      {/* Invisible anchors for #informasi, #pengumuman, #galeri */}
      <div id="informasi" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="pengumuman" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="galeri" className="absolute -top-24 left-0 pointer-events-none" />
      
      {/* SUBTLE ORGANIC BACKGROUND ACCENT */}
      <div className="pointer-events-none absolute -right-24 top-12 w-96 h-96 opacity-[0.035] -z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#064E3B]" fill="currentColor">
          <path d="M48.2,-61.8C61.4,-53.4,70.6,-38.7,75.4,-22.4C80.2,-6.1,80.7,11.8,74.1,27.2C67.6,42.6,54.1,55.5,38.8,64.2C23.6,72.9,6.7,77.4,-10.1,76.5C-26.9,75.6,-43.5,69.4,-56.3,58.3C-69.1,47.2,-78,31.3,-80.6,14.4C-83.2,-2.5,-79.4,-20.3,-70.6,-34.5C-61.7,-48.7,-47.9,-59.3,-33.4,-67.1C-18.9,-74.8,-3.8,-79.8,11.3,-77.8C26.5,-75.7,35,-66.6,48.2,-61.8Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3.5 py-1 text-xs font-bold text-[#064E3B] shadow-xs mb-3.5">
              <span className="h-2 w-2 rounded-full bg-[#047857]" />
              <span>Kabar Desa Sawotratap • 2026</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827] leading-tight">
              Informasi & Berita
            </h3>
          </div>

          <p className="max-w-md text-sm text-slate-600 font-medium leading-relaxed">
            Dapatkan pembaruan berita terkini, edaran resmi pemerintahan, serta beragam agenda kegiatan warga Desa Sawotratap.
          </p>
        </div>

        {/* GRID CARD BERITA (EDITORIAL STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {DATA_BERITA.map((item) => (
            <article
              key={item.id}
              className="group relative rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/6 hover:border-emerald-300/80 flex flex-col justify-between card-interactive-2d"
            >
              <div>
                {/* 1. GAMBAR BERITA DI BAGIAN ATAS DENGAN PROPORSI EDITORIAL */}
                <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                  <img
                    src={item.foto}
                    alt={item.judul}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Kategori label */}
                  <div className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-slate-800 shadow-sm border border-slate-100">
                    {item.kategori}
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold shadow-xs ${item.badgeColor}`}>
                      • {item.statusBadge}
                    </span>
                  </div>
                </div>

                {/* 2. METADATA PENULIS & TANGGAL */}
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-2 px-0.5">
                  <span className="text-[#064E3B] font-bold">{item.penulis}</span>
                  <span>•</span>
                  <span>{item.tanggal}</span>
                  <span>•</span>
                  <span>{item.bacaWaktu}</span>
                </div>

                {/* 3. JUDUL ARTIKEL */}
                <h4 className="text-base sm:text-lg font-extrabold text-[#111827] group-hover:text-[#064E3B] transition-colors leading-snug px-0.5">
                  {item.judul}
                </h4>

                {/* 4. RINGKASAN TEKS */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2.5 px-0.5 font-medium">
                  {item.ringkasan}
                </p>
              </div>

              {/* 5. FOOTER CARD DENGAN LINK & PANAH MIKRO-INTERAKSI */}
              <div className="mt-6 pt-3.5 border-t border-[#E3E8E2]/70 flex items-center justify-between px-0.5">
                <a
                  href="/informasi"
                  className="text-xs font-bold text-[#064E3B] group-hover:text-[#047857] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Baca Selengkapnya</span>
                  <span className="arrow-slide">→</span>
                </a>

                <a
                  href="/informasi"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-[#064E3B] group-hover:text-white group-hover:scale-105 shadow-xs"
                  aria-label={`Baca ${item.judul}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* FOOTER ARSIP */}
        <div className="mt-14 flex items-center justify-center">
          <a
            href="/informasi"
            className="group inline-flex items-center gap-2 rounded-full bg-[#111827] text-white px-8 py-3.5 text-xs font-extrabold shadow-md hover:bg-[#064E3B] hover:shadow-xl transition-all duration-300 shine-hover"
          >
            <span>Lihat Seluruh Arsip Berita Desa</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 arrow-slide">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}