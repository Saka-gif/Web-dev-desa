"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

interface LayananItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  estimasi: string;
  syarat: string[];
  foto: string;
}

const DAFTAR_LAYANAN: LayananItem[] = [
  {
    id: "surat",
    judul: "Pengajuan Surat Mandiri",
    deskripsi: "Ajukan berbagai jenis surat keterangan (KTP, Domisili, Usaha, Tidak Mampu) secara online tanpa antre di balai desa.",
    kategori: "Administrasi",
    estimasi: "1x24 Jam",
    syarat: ["Fotokopi KTP/KK", "Surat Pengantar RT/RW", "Pas Foto 3x4"],
    foto: "/aset/pedesaan.jpg",
  },
  {
    id: "pengaduan",
    judul: "Aspirasi & Pengaduan Warga",
    deskripsi: "Sampaikan saran, pengaduan infrastruktur, atau keluhan fasilitas umum secara langsung untuk ditindaklanjuti tim balai desa.",
    kategori: "Aspirasi",
    estimasi: "Max 2x24 Jam",
    syarat: ["Foto Bukti Kejadian", "Uraian Singkat Masalah"],
    foto: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "perizinan",
    judul: "Perizinan & Fasilitas Desa",
    deskripsi: "Urus berkas perizinan usaha mikro (IUMK), izin kegiatan hajatan, serta peminjaman tempat Balai Desa Sawotratap.",
    kategori: "Perizinan",
    estimasi: "2-3 Hari Kerja",
    syarat: ["KTP Penanggung Jawab", "Detail Rencana Kegiatan"],
    foto: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
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
    <section id="layanan" className="relative z-10 bg-[#FAF9F4] py-24 px-6 sm:px-10 lg:px-16 text-[#111827] border-t border-[#E3E8E2] overflow-hidden">
      {/* Anchor tersembunyi untuk navigasi */}
      <div id="pengaduan" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="surat" className="absolute -top-24 left-0 pointer-events-none" />
      
      <div className="mx-auto max-w-7xl space-y-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E3E8E2] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-[#064E3B] animate-ping" />
              <span>Portal Layanan Publik</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111827]">
              Pilih Layanan <span className="text-[#064E3B]">Desa Sawotratap</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Akses pengurusan surat, aspirasi warga, dan perizinan secara cepat, transparan, dan tanpa antre.
            </p>
          </div>
        </div>

        {/* GRID KARTU VERTICAL ALA DESTINATION CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DAFTAR_LAYANAN.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-[2.5rem] overflow-hidden bg-[#06261D] text-white shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between border border-emerald-900/60"
            >
              {/* GAMBAR BACKGROUND DENGAN GRADASI */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.foto}
                  alt={item.judul}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-40 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06261D] via-[#06261D]/80 to-transparent" />
              </div>

              {/* KONTEN KARTU ATAS */}
              <div className="relative z-10 p-7 sm:p-8 space-y-4">
                {/* CHIP KATEGORI & ESTIMASI */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-200 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/50">
                    {item.kategori}
                  </span>
                  <span className="text-[10px] font-bold text-[#C5D82F] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {item.estimasi}
                  </span>
                </div>

                <div className="space-y-2 pt-6">
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#C5D82F] transition-colors leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal line-clamp-3">
                    {item.deskripsi}
                  </p>
                </div>
              </div>

              {/* TOMBOL AKSI DI BAWAH (PERSIS SEPERTI TOMBOL RESERVE) */}
              <div className="relative z-10 p-6 pt-0">
                <button
                  onClick={() => setSelectedLayanan(item)}
                  className="w-full py-4 rounded-2xl bg-white hover:bg-[#C5D82F] text-[#111827] text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <span>Ajukan Layanan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* MODAL POPUP FORM PENGAJUAN */}
      {selectedLayanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-[2.5rem] border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-2xl text-[#111827]">
            
            <button
              onClick={() => setSelectedLayanan(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
                <h4 className="text-xl font-black">Pengajuan Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Pengajuan {selectedLayanan.judul} Anda telah masuk ke sistem Desa Sawotratap.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-2xl bg-[#064E3B] text-[#C5D82F] flex items-center justify-center shrink-0 font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-base font-black leading-sn0">
                      Form {selectedLayanan.judul}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Layanan Online Sawotratap</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap KTP</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#064E3B] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="3515..."
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#064E3B] font-mono"
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
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#064E3B] font-mono"
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
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-[#064E3B] font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-2xl bg-[#064E3B] hover:bg-[#047857] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Kirim Pengajuan</span>
                    <ArrowRight className="w-4 h-4 text-[#C5D82F]" />
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