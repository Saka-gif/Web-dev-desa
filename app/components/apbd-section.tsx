"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  Download,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Search,
  MapPin,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { exportApbdesToPdf } from "@/app/utils/generate-apbdes-pdf";

export interface ApbdRingkasan {
  id: string;
  tahun: string;
  total_pagu: string;
  realisasi_dana: string;
  persen_penyerapan: string;
  alokasi_fisik: string;
  surplus_kas: string;
  status_verifikasi: string;
}

export interface ProgramDesa {
  id: string;
  tahun?: string;
  nama: string;
  kategori: string;
  anggaran: string;
  status: "selesai" | "proses" | string;
  progres: number;
  keterangan: string;
  lokasi?: string;
  urutan?: number;
}

const DEFAULT_RINGKASAN: ApbdRingkasan = {
  id: "2026",
  tahun: "2026",
  total_pagu: "Rp 2.85 M",
  realisasi_dana: "Rp 2.62 M",
  persen_penyerapan: "91.9%",
  alokasi_fisik: "Rp 1.25 M",
  surplus_kas: "Rp 230 Jt",
  status_verifikasi: "Terverifikasi Resmi BPD",
};

const DEFAULT_PROGRAM: ProgramDesa[] = [
  {
    id: "prog-1",
    nama: "Betonisasi Jalan Usaha Tani & Lingkungan RW 01 - 04",
    kategori: "Infrastruktur",
    anggaran: "Rp 450 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Selesai diaspal dan dicor beton kualitas K-350.",
    lokasi: "RW 01 s/d RW 04",
    urutan: 1,
  },
  {
    id: "prog-2",
    nama: "Rehab Saluran Drainase & Normalisasi Kali Desa",
    kategori: "Infrastruktur",
    anggaran: "Rp 320 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Pengerukan lumpur dan pemasangan U-Ditch beton.",
    lokasi: "RW 02 & RW 07",
    urutan: 2,
  },
  {
    id: "prog-3",
    nama: "Bantuan Permodalan & Pelatihan Digital UMKM",
    kategori: "Pemberdayaan",
    anggaran: "Rp 210 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Penyaluran alat produksi dan pendampingan izin PIRT.",
    lokasi: "Sentra UMKM Desa",
    urutan: 3,
  },
  {
    id: "prog-4",
    nama: "Penerangan Jalan Umum (PJU) Tenaga Surya",
    kategori: "Infrastruktur",
    anggaran: "Rp 180 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Pemasangan 45 titik lampu hemat energi di titik rawan.",
    lokasi: "Jalan Lingkungan 11 RW",
    urutan: 4,
  },
  {
    id: "prog-5",
    nama: "Revitalisasi Posyandu & Pemberian PMT Balita",
    kategori: "Kesehatan",
    anggaran: "Rp 150 Juta",
    status: "selesai",
    progres: 100,
    keterangan: "Pemberian makanan tambahan dan alat cek kesehatan posyandu.",
    lokasi: "Balai RW 02, 06, 09",
    urutan: 5,
  },
  {
    id: "prog-6",
    nama: "Pembangunan Gedung Serbaguna & Balai Latihan Warga",
    kategori: "Infrastruktur",
    anggaran: "Rp 680 Juta",
    status: "proses",
    progres: 75,
    keterangan: "Tahap finishing interior dan instalasi kelistrikan lantai 2.",
    lokasi: "Kompleks Balai Desa",
    urutan: 6,
  },
  {
    id: "prog-7",
    nama: "Digitalisasi Arsip Kependudukan & Smart Dashboard",
    kategori: "Pemerintahan",
    anggaran: "Rp 95 Juta",
    status: "proses",
    progres: 60,
    keterangan: "Integrasi database kependudukan dengan loket mandiri desa.",
    lokasi: "Kantor Balai Desa",
    urutan: 7,
  },
  {
    id: "prog-8",
    nama: "Program Penghijauan Taman Desa & Bank Sampah Mandiri",
    kategori: "Lingkungan",
    anggaran: "Rp 85 Juta",
    status: "proses",
    progres: 40,
    keterangan: "Pengadaan mesin pencacah sampah organik dan bibit pohon.",
    lokasi: "RW 05 & RW 10",
    urutan: 8,
  },
];

const KATEGORI_COLORS: Record<string, string> = {
  Infrastruktur: "bg-blue-50 text-blue-800 border-blue-200",
  Pemberdayaan: "bg-amber-50 text-amber-800 border-amber-200",
  Kesehatan: "bg-rose-50 text-rose-800 border-rose-200",
  Pemerintahan: "bg-purple-50 text-purple-800 border-purple-200",
  Lingkungan: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

interface CuacaData {
  temperature: number;
  humidity: number;
  weatherText: string;
  weatherIcon: "sun" | "cloud-sun" | "cloud" | "cloud-rain" | "cloud-lightning";
  stasiun: string;
  aqiText: string;
  aqiColor: string;
  aqiPercent: number;
  aqiBarGradient: string;
}

export default function ApbdSection() {
  const [ringkasan, setRingkasan] = useState<ApbdRingkasan>(DEFAULT_RINGKASAN);
  const [daftarProgram, setDaftarProgram] = useState<ProgramDesa[]>(DEFAULT_PROGRAM);
  const [statusFilter, setStatusFilter] = useState<"semua" | "selesai" | "proses">("semua");
  const [kategoriFilter, setKategoriFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [cuaca, setCuaca] = useState<CuacaData>({
    temperature: 30,
    humidity: 62,
    weatherText: "Cerah Berawan",
    weatherIcon: "cloud-sun",
    stasiun: "Sidoarjo, Jawa Timur • Stasiun BMKG Juanda",
    aqiText: "Baik & Sehat",
    aqiColor: "text-emerald-700",
    aqiPercent: 85,
    aqiBarGradient: "from-emerald-500 to-[#C5D82F]",
  });

  // Ambil data live dari Supabase
  const loadApbdFromSupabase = async () => {
    try {
      const [resRingkasan, resProgram] = await Promise.all([
        supabase.from("apbd_ringkasan").select("*").eq("tahun", "2026").maybeSingle(),
        supabase.from("apbd_program").select("*").order("urutan", { ascending: true }),
      ]);

      if (!resRingkasan.error && resRingkasan.data) {
        setRingkasan(resRingkasan.data);
      }
      if (!resProgram.error && resProgram.data && resProgram.data.length > 0) {
        setDaftarProgram(resProgram.data);
      }
    } catch (err) {
      console.warn("Gagal memuat APBD dari Supabase, menggunakan data lokal:", err);
    }
  };

  useEffect(() => {
    loadApbdFromSupabase();

    // Ambil data cuaca & AQI asli secara live dari stasiun terdekat (Juanda / Sidoarjo)
    fetch("/api/cuaca")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setCuaca({
            temperature: data.temperature,
            humidity: data.humidity,
            weatherText: data.weatherText,
            weatherIcon: data.weatherIcon,
            stasiun: data.stasiun,
            aqiText: data.aqiText,
            aqiColor: data.aqiColor,
            aqiPercent: data.aqiPercent,
            aqiBarGradient: data.aqiBarGradient || "from-emerald-500 to-[#C5D82F]",
          });
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat data cuaca real-time:", err);
      });

    // Supabase Realtime Subscription: Update otomatis saat diedit di admin Supabase
    const channel = supabase
      .channel("realtime-apbd-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "apbd_ringkasan" }, () => loadApbdFromSupabase())
      .on("postgres_changes", { event: "*", schema: "public", table: "apbd_program" }, () => loadApbdFromSupabase())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderWeatherIcon = () => {
    switch (cuaca.weatherIcon) {
      case "sun":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "cloud":
        return <Cloud className="w-4 h-4 text-slate-500" />;
      case "cloud-rain":
        return <CloudRain className="w-4 h-4 text-sky-500" />;
      case "cloud-lightning":
        return <CloudLightning className="w-4 h-4 text-amber-600" />;
      default:
        return <CloudSun className="w-4 h-4 text-amber-500" />;
    }
  };

  // Filter program
  const filteredProgram = daftarProgram.filter((prog) => {
    const matchStatus = statusFilter === "semua" || prog.status === statusFilter;
    const matchKategori = kategoriFilter === "Semua" || prog.kategori.toLowerCase() === kategoriFilter.toLowerCase();
    const matchSearch =
      prog.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prog.lokasi && prog.lokasi.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchKategori && matchSearch;
  });

  const jumlahSelesai = daftarProgram.filter((p) => p.status === "selesai").length;
  const jumlahProses = daftarProgram.filter((p) => p.status === "proses").length;

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      await exportApbdesToPdf(ringkasan, daftarProgram);
    } catch (err) {
      console.error("Gagal mengekspor PDF APBDes:", err);
      alert("Terjadi kendala saat menghasilkan PDF. Silakan coba kembali.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="transparansi" className="relative z-10 bg-[#FAF9F4] py-24 px-6 sm:px-10 lg:px-16 text-[#111827] border-t border-[#E3E8E2] overflow-hidden">
      {/* Anchors navigasi */}
      <div id="apbd" className="absolute -top-24 left-0 pointer-events-none" />
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
              Laporan APBDes <span className="text-[#064E3B]">{ringkasan.tahun || "2026"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Keterbukaan alokasi anggaran, realisasi dana pembangunan fisik, serta status pengerjaan program warga Desa Sawotratap yang terhubung live ke database.
            </p>
          </div>

          {/* TOMBOL AKSI & FILTER STATUS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-white p-1.5 border border-[#E3E8E2] shadow-xs">
              <button
                onClick={() => setStatusFilter("semua")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  statusFilter === "semua"
                    ? "bg-[#064E3B] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Semua</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${statusFilter === "semua" ? "bg-[#047857] text-[#C5D82F]" : "bg-slate-100 text-slate-700"}`}>
                  {daftarProgram.length}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("selesai")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  statusFilter === "selesai"
                    ? "bg-[#064E3B] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Selesai</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${statusFilter === "selesai" ? "bg-[#047857] text-[#C5D82F]" : "bg-slate-100 text-slate-700"}`}>
                  {jumlahSelesai}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("proses")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  statusFilter === "proses"
                    ? "bg-[#111827] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Proses</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${statusFilter === "proses" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}`}>
                  {jumlahProses}
                </span>
              </button>
            </div>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-full bg-[#111827] hover:bg-[#064E3B] text-white px-5 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Download className={`w-4 h-4 text-[#C5D82F] ${isDownloading ? "animate-bounce" : ""}`} />
              <span>{isDownloading ? "Menyiapkan PDF..." : "Unduh PDF APBDes"}</span>
            </button>
          </div>
        </div>

        {/* BENTO GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 4 KARTU STATISTIK KEUANGAN LIVE SUPABASE */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Pagu APBDes</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#111827] tabular-nums">{ringkasan.total_pagu}</h4>
                <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{ringkasan.status_verifikasi}</span>
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Realisasi Dana</span>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#111827] tabular-nums">{ringkasan.realisasi_dana}</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Tingkat Penyerapan {ringkasan.persen_penyerapan}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Alokasi Fisik Publik</span>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#111827] tabular-nums">{ringkasan.alokasi_fisik}</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Infrastruktur Warga</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sisa / Surplus Kas</span>
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              </div>
              <div className="mt-4">
                <h4 className="text-3xl font-black text-[#064E3B] tabular-nums">{ringkasan.surplus_kas}</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">Dana Cadangan Desa</p>
              </div>
            </div>

          </div>

          {/* WIDGET CUACA & KONDISI WILAYAH (DATA ASLI REAL-TIME) */}
          <div className="lg:col-span-5 rounded-[2.5rem] border border-[#E3E8E2] bg-gradient-to-br from-white via-[#FAF9F5] to-amber-50/20 p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kondisi Wilayah Sawotratap</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  {renderWeatherIcon()}
                  <span>{cuaca.weatherText}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span>{cuaca.humidity}% Hum</span>
                </span>
              </div>
            </div>

            <div className="text-center my-6">
              <span className="text-6xl font-black text-[#111827] tabular-nums tracking-tight">{cuaca.temperature}°C</span>
              <p className="text-xs text-slate-500 font-medium mt-1.5">{cuaca.stasiun}</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200/60">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Indeks Kualitas Udara</span>
                <span className={cuaca.aqiColor}>{cuaca.aqiText}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${cuaca.aqiBarGradient} rounded-full transition-all duration-500`}
                  style={{ width: `${cuaca.aqiPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* KARTU DAFTAR PROGRAM INTERAKTIF BERDASARKAN FILTER & PENCARIAN */}
          <div className="lg:col-span-12 rounded-[2.5rem] border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Header Rincian Program dengan Search & Category Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#111827] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#064E3B]" />
                  <span>Daftar Rincian Program Kegiatan APBD</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transparansi rincian alokasi fisik & non-fisik desa yang dapat diedit langsung dari dashboard admin
                </p>
              </div>

              {/* Live Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari program / lokasi..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
              {["Semua", "Infrastruktur", "Pemberdayaan", "Kesehatan", "Pemerintahan", "Lingkungan"].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKategoriFilter(kat)}
                  className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 border ${
                    kategoriFilter === kat
                      ? "bg-[#064E3B] text-white border-[#064E3B] shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {kat === "Semua" ? "Semua Bidang" : kat}
                </button>
              ))}
            </div>

            {/* Grid Kartu Rincian Program */}
            {filteredProgram.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs space-y-1">
                <p className="font-bold">Tidak ada program yang sesuai dengan filter.</p>
                <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau pilih bidang lainnya.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProgram.map((prog) => {
                  const badgeClass = KATEGORI_COLORS[prog.kategori] || "bg-slate-100 text-slate-800 border-slate-200";
                  const isSelesai = prog.status === "selesai" || prog.progres === 100;

                  return (
                    <div
                      key={prog.id}
                      className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        {/* Header Kartu: Kategori & Pagu Anggaran */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
                            {prog.kategori}
                          </span>
                          <span className="text-xs sm:text-sm font-mono font-black text-[#064E3B] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
                            {prog.anggaran}
                          </span>
                        </div>

                        {/* Nama Program */}
                        <h4 className="text-sm sm:text-base font-black text-[#111827] group-hover:text-[#064E3B] transition-colors leading-snug pt-1">
                          {prog.nama}
                        </h4>

                        {/* Deskripsi Keterangan */}
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {prog.keterangan}
                        </p>

                        {/* Lokasi */}
                        {prog.lokasi && (
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 pt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{prog.lokasi}</span>
                          </div>
                        )}
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="pt-3 border-t border-slate-200/60 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500 flex items-center gap-1">
                            {isSelesai ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span className={isSelesai ? "text-emerald-700 font-black" : "text-amber-800"}>
                              {isSelesai ? "Pekerjaan Tuntas 100%" : "Sedang Tahap Pengerjaan"}
                            </span>
                          </span>
                          <span className="font-mono text-xs font-black text-[#111827]">
                            {prog.progres}%
                          </span>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isSelesai
                                ? "bg-gradient-to-r from-emerald-500 to-[#C5D82F]"
                                : "bg-gradient-to-r from-amber-400 to-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, prog.progres))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}