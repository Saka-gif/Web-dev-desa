"use client";

import React, { useState } from "react";
import { CheckCircle2, CloudSun, Droplets, Download, ArrowUpRight, Clock, ShieldCheck } from "lucide-react";

interface ProgramDesa {
  id: string;
  nama: string;
  kategori: string;
  anggaran: string;
  status: "selesai" | "proses";
  progres: number;
  keterangan: string;
}

const DAFTAR_PROGRAM: ProgramDesa[] = [
  {
    id: "prog-1",
    nama: "Betonisasi Jalan Usaha Tani & Lingkungan RW 01 - 04",
    kategori: "Infrastruktur",
    anggaran: "Rp 450 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Selesai diaspal dan dicor beton kualitas K-350.",
  },
  {
    id: "prog-2",
    nama: "Rehab Saluran Drainase & Normalisasi Kali Desa",
    kategori: "Infrastruktur",
    anggaran: "Rp 320 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Pengerukan lumpur dan pemasangan U-Ditch beton.",
  },
  {
    id: "prog-3",
    nama: "Bantuan Permodalan & Pelatihan Digital UMKM",
    kategori: "Pemberdayaan",
    anggaran: "Rp 210 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Penyaluran alat produksi dan pendampingan izin PIRT.",
  },
  {
    id: "prog-4",
    nama: "Penerangan Jalan Umum (PJU) Tenaga Surya",
    kategori: "Infrastruktur",
    anggaran: "Rp 180 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Pemasangan 45 titik lampu hemat energi di titik rawan.",
  },
  {
    id: "prog-5",
    nama: "Revitalisasi Posyandu & Pemberian PMT Balita",
    kategori: "Kesehatan",
    anggaran: "Rp 150 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Pemberian makanan tambahan dan alat cek kesehatan posyandu.",
  },
  {
    id: "prog-6",
    nama: "Pembangunan Gedung Serbaguna & Balai Latihan Warga",
    kategori: "Infrastruktur",
    anggaran: "Rp 680 Juta",
    status: "proses",
    progres: 75,
    keterangan: "Tahap finishing interior dan instalasi kelistrikan lantai 2.",
  },
  {
    id: "prog-7",
    nama: "Digitalisasi Arsip Kependudukan & Smart Dashboard",
    kategori: "Pemerintahan",
    anggaran: "Rp 95 Juta",
    status: "proses",
    progres: 60,
    keterangan: "Integrasi database kependudukan dengan loket mandiri desa.",
  },
  {
    id: "prog-8",
    nama: "Program Penghijauan Taman Desa & Bank Sampah Mandiri",
    kategori: "Lingkungan",
    anggaran: "Rp 85 Juta",
    status: "proses",
    progres: 40,
    keterangan: "Pengadaan mesin pencacah sampah organik dan bibit pohon.",
  },
];

export default function ApbdSection() {
  const [statusFilter, setStatusFilter] = useState<"selesai" | "proses">("selesai");
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredProgram = DAFTAR_PROGRAM.filter((p) => p.status === statusFilter);

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Dokumen Transparansi APBDes 2026 berhasil diunduh (Simulasi PDF Resmi Desa Sawotratap).");
    }, 1500);
  };

  return (
    <section id="transparansi" className="relative z-10 bg-[#FAF9F4] py-24 px-6 sm:px-10 lg:px-16 text-[#111827] border-t border-[#E3E8E2] overflow-hidden">
      {/* Anchor tersembunyi untuk navigasi */}
      <div id="pemerintahan" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="pamong" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="lembaga" className="absolute -top-24 left-0 pointer-events-none" />

      <div className="mx-auto max-w-7xl space-y-12">
        
        {/* HEADER SECTION & KONTROL INTERAKTIF */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E3E8E2] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-[#064E3B] animate-ping" />
              <span>Transparansi Keuangan & Program Desa</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111827]">
              Laporan APBDes <span className="text-[#064E3B]">2026</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Keterbukaan alokasi anggaran, realisasi dana pembangunan fisik, serta status pengerjaan program warga Sawotratap.
            </p>
          </div>

          {/* TOMBOL AKSI & FILTER */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-white p-1.5 border border-[#E3E8E2] shadow-xs">
              <button
                onClick={() => setStatusFilter("selesai")}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                  statusFilter === "selesai"
                    ? "bg-[#064E3B] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Program Selesai</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${statusFilter === "selesai" ? "bg-[#047857] text-[#C5D82F]" : "bg-slate-100 text-slate-700"}`}>
                  {DAFTAR_PROGRAM.filter(p => p.status === "selesai").length}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("proses")}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                  statusFilter === "proses"
                    ? "bg-[#111827] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Dalam Proses</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${statusFilter === "proses" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}`}>
                  {DAFTAR_PROGRAM.filter(p => p.status === "proses").length}
                </span>
              </button>
            </div>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-full bg-[#111827] hover:bg-[#064E3B] text-white px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#C5D82F]" />
              <span>{isDownloading ? "Mengunduh..." : "Unduh PDF APBDes"}</span>
            </button>
          </div>
        </div>

        {/* BENTO GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 4 KARTU STATISTIK KEUANGAN */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Pagu APBDes</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#111827] tabular-nums">Rp 2.85 M</h4>
                <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Terverifikasi Resmi BPD</span>
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Realisasi Dana</span>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#111827] tabular-nums">Rp 2.62 M</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Tingkat Penyerapan 91.9%</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Alokasi Fisik Publik</span>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#111827] tabular-nums">Rp 1.25 M</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Infrastruktur Warga</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sisa / Surplus Kas</span>
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#064E3B] tabular-nums">Rp 230 Jt</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Dana Cadangan Desa</p>
              </div>
            </div>

          </div>

          {/* WIDGET CUACA & LINGKUNGAN SIDOARJO */}
          <div className="lg:col-span-5 rounded-[2.5rem] border border-[#E3E8E2] bg-gradient-to-br from-white via-[#FAF9F5] to-amber-50/20 p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kondisi Wilayah Sawotratap</span>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <span>Cerah Berawan</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span>62% Hum</span>
                </span>
              </div>
            </div>

            <div className="text-center my-6">
              <span className="text-6xl font-black text-[#111827] tabular-nums tracking-tight">30°C</span>
              <p className="text-xs text-slate-500 font-medium mt-1.5">Sidoarjo, Jawa Timur • Stasiun BMKG Juanda</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200/60">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Indeks Kualitas Udara</span>
                <span className="text-emerald-700">Baik & Sehat</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-[#C5D82F] rounded-full w-[85%]" />
              </div>
            </div>
          </div>

          {/* KARTU DAFTAR PROGRAM INTERAKTIF BERDASARKAN FILTER */}
          <div className="lg:col-span-12 rounded-[2.5rem] border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#111827]">
                  Daftar Rincian Program ({statusFilter === "selesai" ? "Selesai Dikerjakan" : "Sedang Dalan Proses"})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Menampilkan seluruh transparansi alokasi fisik & non-fisik desa</p>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                {filteredProgram.length} Program
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProgram.map((prog) => (
                <div key={prog.id} className="p-5 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {prog.kategori}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#064E3B]">
                        {prog.anggaran}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-[#111827] leading-snug">
                      {prog.nama}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {prog.keterangan}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Progres Fisik:</span>
                    <span className="text-[#064E3B] font-mono">{prog.progres}% Selesai</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}