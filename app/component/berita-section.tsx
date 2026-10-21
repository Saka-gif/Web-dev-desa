"use client";

import React, { useState } from "react";

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
  },
  {
    id: 4,
    judul: "Sosialisasi Pembuatan Kartu Identitas Anak (KIA) Gratis",
    kategori: "Layanan",
    tanggal: "12 Okt 2026",
    penulis: "Kasi Pelayanan",
    ringkasan: "Layanan jemput bola pembuatan KIA langsung jadi di setiap Posyandu desa untuk mempermudah akses dokumen kependudukan anak.",
    bacaWaktu: "2 mnt baca",
    foto: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BeritaSection() {
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const daftarKategori = ["Semua", "Pengumuman", "Kegiatan", "Pemerintahan", "Layanan"];

  const beritaFiltered =
    kategoriAktif === "Semua"
      ? DATA_BERITA
      : DATA_BERITA.filter((item) => item.kategori === kategoriAktif);

  return (
    <section id="berita" className="relative z-10 bg-slate-950 py-24 px-6 sm:px-10 lg:px-16 text-white border-t border-white/10">
      
      {/* GLOW AKSEN LATAR BELAKANG HALUS */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2961B1]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* CONTAINER KARTU UTAMA (MATCHING DENGAN HERO & UMKM) */}
        <div className="rounded-3xl border border-white/15 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C7D42B]">
                Kabar & Informasi Terkini
              </span>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Berita Desa Sawotratap
              </h3>
            </div>

            <p className="max-w-md text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Dapatkan berita terbaru, pengumuman resmi pemerintahan desa, serta agenda kegiatan kemasyarakatan secara akurat dan terpercaya.
            </p>
          </div>

          {/* TAB FILTER KATEGORI (SESUAI AKSEN LIME & SLATE) */}
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-5 border-b border-white/10">
            {daftarKategori.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setKategoriAktif(kategori)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                  kategoriAktif === kategori
                    ? "bg-[#C7D42B] text-slate-950 shadow-lg shadow-[#C7D42B]/20 scale-105"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {kategori}
              </button>
            ))}
          </div>

          {/* GRID CARD BERITA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beritaFiltered.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-slate-950/70 p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/40 hover:shadow-2xl"
              >
                <div>
                  {/* FOTO BERITA */}
                  <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={item.foto}
                      alt={item.judul}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Badge Kategori */}
                    <div className="absolute top-3 left-3 rounded-md bg-[#2961B1]/90 backdrop-blur-md px-2.5 py-1 border border-white/20 text-[9px] font-extrabold uppercase text-white">
                      {item.kategori}
                    </div>

                    {/* Waktu Baca */}
                    <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-slate-300 border border-white/10">
                      {item.bacaWaktu}
                    </div>
                  </div>

                  {/* DETAIL BERITA */}
                  <div className="mt-4 px-1">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mb-1.5">
                      <span>{item.tanggal}</span>
                      <span>•</span>
                      <span className="text-[#64A8E5]">{item.penulis}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-[#C7D42B] transition-colors leading-snug line-clamp-2">
                      {item.judul}
                    </h4>

                    <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {item.ringkasan}
                    </p>
                  </div>
                </div>

                {/* TOMBOL BACA (SESUAI DENGAN AKSEN TOMBOL DESAIN KITA) */}
                <div className="mt-5 pt-3 border-t border-white/10 px-1">
                  <a
                    href={`#berita-${item.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-[#C7D42B] py-2.5 text-xs font-bold text-white hover:text-slate-950 transition-all duration-300 group/btn"
                  >
                    <span>Baca Selengkapnya</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* FOOTER NAVIGASI BERITA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <a
              href="#semua-berita"
              className="inline-flex items-center gap-2 rounded-full bg-white text-slate-950 px-6 py-2.5 text-xs font-bold hover:bg-[#C7D42B] transition-colors shadow-lg"
            >
              <span>Lihat Arsip Berita Desa</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>

            <p className="text-xs text-slate-400">
              Menampilkan {beritaFiltered.length} berita terbaru
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}