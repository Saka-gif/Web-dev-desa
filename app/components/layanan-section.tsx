"use client";

import React, { useState } from "react";

interface LayananItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  estimasi: string;
  syarat: string[];
  iconSvg: React.ReactNode;
}

const DAFTAR_LAYANAN: LayananItem[] = [
  {
    id: "surat",
    judul: "Pengajuan Surat Mandiri",
    deskripsi: "Ajukan berbagai jenis surat keterangan (KTP, Domisili, Usaha, Tidak Mampu) secara online tanpa antre di balai desa.",
    kategori: "Administrasi",
    estimasi: "1x24 Jam Kerja",
    syarat: ["Fotokopi KTP/KK", "Surat Pengantar RT/RW", "Pas Foto 3x4"],
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: "pengaduan",
    judul: "Aspirasi & Pengaduan Warga",
    deskripsi: "Sampaikan saran, pengaduan infrastruktur, atau keluhan fasilitas umum secara langsung untuk ditindaklanjuti tim balai desa.",
    kategori: "Aspirasi",
    estimasi: "Respon Max 2x24 Jam",
    syarat: ["Foto Bukti Kejadian", "Uraian Singkat Masalah"],
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 01-4.5-4.5v-3a4.5 4.5 0 014.5-4.5h12a4.5 4.5 0 014.5 4.5v3a4.5 4.5 0 01-4.5 4.5h-1.002c-.371 1.206-1.22 2.298-2.483 3.109-1.223.78-2.678 1.191-4.175 1.191V15.84z" />
      </svg>
    ),
  },
  {
    id: "perizinan",
    judul: "Perizinan & Fasilitas Desa",
    deskripsi: "Urus berkas perizinan usaha mikro (IUMK), izin kegiatan hajatan, serta peminjaman tempat Balai Desa Sawotratap.",
    kategori: "Perizinan",
    estimasi: "2-3 Hari Kerja",
    syarat: ["KTP Penanggung Jawab", "Detail Rencana Kegiatan"],
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25h1.5c.83 0 1.57.45 1.95 1.136m-5.8 0a2.25 2.25 0 00-1.85 2.214v12.25c0 1.243 1.007 2.25 2.25 2.25h7.5c1.243 0 2.25-1.007 2.25-2.25V5.586a2.25 2.25 0 00-1.85-2.214M9 10.5h6M9 13.5h6m-6 3h4" />
      </svg>
    ),
  },
];

export default function LayananSection() {
  const [selectedLayanan, setSelectedLayanan] = useState<LayananItem | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    telepon: "",
    keterangan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedLayanan(null);
      setFormData({ nama: "", nik: "", telepon: "", keterangan: "" });
    }, 2200);
  };

  return (
    <section id="layanan" className="relative z-10 bg-slate-50 py-24 px-6 sm:px-10 lg:px-16 text-slate-900 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl">
        
        {/* TATA LETAK SPLIT 2 KOLOM (PERSIS SEPERTI GAMBAR ACUAN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* KOLOM KIRI: HEADLINE, SOSMED & KEY METRICS STATS */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Tag Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-bold text-[#2961B1] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#C7D42B] animate-pulse" />
              Layanan Digital Terpadu
            </span>

            {/* Judul Utama */}
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Mengapa Warga Memilih Portal Smart Service Sawotratap?
            </h3>

            {/* Deskripsi Komitmen */}
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Dari pengurusan administrasi kependudukan hingga saluran aspirasi warga, kami menghadirkan pelayanan publik yang lebih cepat, transparan, dan dapat diakses kapan saja tanpa perlu antre di Balai Desa.
            </p>

            {/* Ikon Tautan Sosial Media / Kontak Resmi */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-[#2961B1] hover:text-white transition-all shadow-sm">
                <span className="text-xs font-bold">IG</span>
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-[#2961B1] hover:text-white transition-all shadow-sm">
                <span className="text-xs font-bold">FB</span>
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-[#2961B1] hover:text-white transition-all shadow-sm">
                <span className="text-xs font-bold">WA</span>
              </a>
            </div>

            {/* METRIK STATISTIK LINGKARAN (BAGIAN BAVAH KIRI DARI GAMBAR REFERENCE) */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              
              <div className="text-center sm:text-left">
                <div className="mx-auto sm:mx-0 h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center mb-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#C7D42B]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <p className="text-lg font-black text-slate-900">12K+</p>
                <p className="text-[11px] font-medium text-slate-500 leading-snug">Warga Terlayani</p>
              </div>

              <div className="text-center sm:text-left">
                <div className="mx-auto sm:mx-0 h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center mb-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#64A8E5]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-black text-slate-900">99%</p>
                <p className="text-[11px] font-medium text-slate-500 leading-snug">Berkas Selesai</p>
              </div>

              <div className="text-center sm:text-left">
                <div className="mx-auto sm:mx-0 h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center mb-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#C7D42B]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-black text-slate-900">24/7</p>
                <p className="text-[11px] font-medium text-slate-500 leading-snug">Layanan Mandiri</p>
              </div>

            </div>

          </div>

          {/* KOLOM KANAN: KARTU LAYANAN HORISONTAL (STACKED HORIZONTAL CARDS SAMA SEPERTI GAMBAR) */}
          <div className="lg:col-span-6 space-y-5">
            {DAFTAR_LAYANAN.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedLayanan(item)}
                className="group relative rounded-3xl border border-slate-200/90 bg-[#8B9BB4]/30 hover:bg-[#8B9BB4]/40 p-5 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex items-center gap-5"
              >
                {/* WADAH IKON DENGAN IKON BESAR DI KIRI */}
                <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <div className="text-[#C7D42B]">
                    {item.iconSvg}
                  </div>
                </div>

                {/* DETAIL TEKS SISI KANAN */}
                <div className="flex-1 pr-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#2961B1] transition-colors leading-snug">
                      {item.judul}
                    </h4>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200">
                      {item.estimasi}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                    {item.deskripsi}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#2961B1] group-hover:translate-x-1 transition-transform">
                    <span>Ajukan Layanan Ini</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* MODAL POPUP FORM PENGAJUAN */}
      {selectedLayanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            
            <button
              onClick={() => setSelectedLayanan(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-slate-900">Pengajuan Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Pengajuan {selectedLayanan.judul} Anda telah masuk ke sistem Desa Sawotratap.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#C7D42B] flex items-center justify-center shrink-0">
                    {selectedLayanan.iconSvg}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      Form {selectedLayanan.judul}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">Layanan Online Sawotratap</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap KTP</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2961B1] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="3515..."
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2961B1] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="0812..."
                        value={formData.telepon}
                        onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2961B1] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Keperluan</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tuliskan alasan/rincian permohonan Anda..."
                      value={formData.keterangan}
                      onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2961B1] focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 rounded-xl bg-[#C7D42B] hover:bg-[#b5c225] py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg transition-all"
                  >
                    Kirim Pengajuan
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
}