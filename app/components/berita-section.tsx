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
  },
];

export default function BeritaSection() {
  return (
    <section id="berita" className="relative z-10 bg-[#F8FAFC] py-20 px-6 sm:px-10 lg:px-16 text-slate-900 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-sm mb-3">
              <span className="h-2 w-2 rounded-full bg-[#2961B1]" />
              <span>Kabar Desa Sawotratap • 2026</span>
            </div>

            <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Informasi & Berita
            </h3>
          </div>

          <p className="max-w-md text-sm text-slate-500 font-medium leading-relaxed">
            Dapatkan pembaruan berita terkini, edaran resmi pemerintahan, serta beragam agenda kegiatan warga Desa Sawotratap.
          </p>
        </div>

        {/* GRID CARD BERITA (TANPA BAR NAVIGASI/FILTER) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DATA_BERITA.map((item) => (
            <article
              key={item.id}
              className="group relative rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-slate-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#2961B1] transition-colors leading-snug">
                      {item.judul}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      Sawotratap • {item.penulis}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-500/10 border border-amber-200 px-3 py-1 text-[10px] font-bold text-amber-700">
                    • {item.statusBadge}
                  </span>
                </div>

                <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-100 my-2">
                  <img
                    src={item.foto}
                    alt={item.judul}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-slate-800 shadow-sm">
                    {item.kategori}
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-3 px-1 font-medium">
                  {item.ringkasan}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between px-1">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                  <span>📅 {item.tanggal}</span>
                  <span>⏱️ {item.bacaWaktu}</span>
                </div>

                <a
                  href={`#berita-${item.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-[#2961B1] group-hover:text-white group-hover:scale-110"
                  aria-label="Baca Selengkapnya"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* FOOTER ARSIP */}
        <div className="mt-12 flex items-center justify-center">
          <a
            href="#semua-berita"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-8 py-3.5 text-xs font-extrabold shadow-lg hover:bg-[#2961B1] transition-colors"
          >
            <span>Lihat Seluruh Arsip Berita Desa</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}