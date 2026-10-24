"use client";

import React, { useState } from "react";
import {
  Users,
  Home,
  Zap,
  MapPin,
  Baby,
  Backpack,
  BookOpen,
  School,
  GraduationCap,
  ScrollText,
  Landmark,
  Briefcase,
  Store,
  Factory,
  BookText,
  Medal,
  Bike,
  HeartHandshake,
  CheckCircle2,
  Map as MapIcon,
  Satellite,
  Activity,
  Building,
  User,
  Sparkles,
} from "lucide-react";

// Data Kependudukan Sesuai Referensi & Realistis untuk Sawotratap
const DATA_GENDER = {
  pria: 4123,
  wanita: 4111,
  total: 8234,
};

const DATA_RENTANG_USIA = [
  { rentang: "0 - 4 Tahun", label: "Balita", jumlah: 523, persen: 6.35, warna: "bg-emerald-500" },
  { rentang: "5 - 9 Tahun", label: "Kanak-kanak", jumlah: 601, persen: 7.30, warna: "bg-teal-500" },
  { rentang: "10 - 14 Tahun", label: "Remaja Awal", jumlah: 678, persen: 8.23, warna: "bg-cyan-500" },
  { rentang: "15 - 19 Tahun", label: "Remaja Akhir", jumlah: 734, persen: 8.91, warna: "bg-sky-500" },
  { rentang: "20 - 24 Tahun", label: "Pemuda", jumlah: 712, persen: 8.65, warna: "bg-blue-500" },
  { rentang: "25 - 29 Tahun", label: "Dewasa Muda", jumlah: 765, persen: 9.29, warna: "bg-indigo-500" },
  { rentang: "30 - 39 Tahun", label: "Dewasa Produktif", jumlah: 1320, persen: 16.03, warna: "bg-violet-500" },
  { rentang: "40 - 49 Tahun", label: "Paruh Baya", jumlah: 1210, persen: 14.69, warna: "bg-purple-500" },
  { rentang: "50 - 59 Tahun", label: "Pra-Lansia", jumlah: 1135, persen: 13.78, warna: "bg-amber-500" },
  { rentang: "60+ Tahun", label: "Lansia", jumlah: 556, persen: 6.75, warna: "bg-rose-500" },
];

const DATA_PENDIDIKAN = [
  { jenjang: "Belum / Tidak Sekolah", jumlah: 612, persen: 7.43, icon: Baby },
  { jenjang: "SD / Sederajat", jumlah: 1480, persen: 17.97, icon: Backpack },
  { jenjang: "SMP / Sederajat", jumlah: 1850, persen: 22.47, icon: BookOpen },
  { jenjang: "SMA / SMK / MA", jumlah: 2942, persen: 35.73, icon: School },
  { jenjang: "Diploma (D1 - D4)", jumlah: 450, persen: 5.47, icon: GraduationCap },
  { jenjang: "Sarjana (S1)", jumlah: 810, persen: 9.84, icon: ScrollText },
  { jenjang: "Pascasarjana (S2 / S3)", jumlah: 90, persen: 1.09, icon: Landmark },
];

const DATA_PEKERJAAN = [
  { bidang: "Karyawan Swasta", jumlah: 3120, persen: 37.89, icon: Briefcase },
  { bidang: "Wiraswasta / UMKM & Pedagang", jumlah: 1840, persen: 22.35, icon: Store },
  { bidang: "Buruh Pabrik / Industri", jumlah: 1250, persen: 15.18, icon: Factory },
  { bidang: "Pelajar / Mahasiswa", jumlah: 820, persen: 9.96, icon: BookText },
  { bidang: "PNS / TNI / Polri / BUMN", jumlah: 480, persen: 5.83, icon: Medal },
  { bidang: "Jasa Transportasi & Logistik", jumlah: 420, persen: 5.10, icon: Bike },
  { bidang: "Ibu Rumah Tangga / Lainnya", jumlah: 304, persen: 3.69, icon: HeartHandshake },
];

const DATA_WILAYAH_RW = [
  { rw: "RW 01", dusun: "Sawotratap Barat", kk: 224, jiwa: 785 },
  { rw: "RW 02", dusun: "Sawotratap Krajan", kk: 260, jiwa: 890 },
  { rw: "RW 03", dusun: "Sawotratap Timur", kk: 242, jiwa: 815 },
  { rw: "RW 04", dusun: "Perumahan Graha", kk: 230, jiwa: 770 },
  { rw: "RW 05", dusun: "Kawasan Industri & Niaga", kk: 198, jiwa: 694 },
  { rw: "RW 06", dusun: "Sawotratap Utara", kk: 255, jiwa: 870 },
  { rw: "RW 07", dusun: "Sawotratap Asri", kk: 245, jiwa: 825 },
  { rw: "RW 08", dusun: "Kavling Mandiri", kk: 220, jiwa: 755 },
  { rw: "RW 09", dusun: "Sawotratap Selatan", kk: 236, jiwa: 810 },
  { rw: "RW 10", dusun: "Perumahan Delta", kk: 188, jiwa: 590 },
  { rw: "RW 11", dusun: "Perbatasan Juanda", kk: 120, jiwa: 430 },
];

export default function DemografiSection() {
  const [activeTab, setActiveTab] = useState<"usia" | "pendidikan" | "pekerjaan" | "wilayah">("usia");
  const [mapType, setMapType] = useState<"3d" | "m" | "k">("3d"); // '3d' for 3D isometric, 'm' for regular map, 'k' for satellite

  const maxRentang = Math.max(...DATA_RENTANG_USIA.map((d) => d.jumlah));

  // Link resmi pencarian Google Maps untuk Sawotratap, Gedangan, Sidoarjo
  const googleMapsUrl = `https://maps.google.com/maps?q=Sawotratap,+Kecamatan+Gedangan,+Kabupaten+Sidoarjo,+Jawa+Timur&t=${mapType === "3d" ? "m" : mapType}&z=15&ie=UTF8&iwloc=&output=embed`;
  const externalMapsLink = "https://www.google.com/maps/place/Sawotratap,+Gedangan,+Sidoarjo+Regency,+East+Java";
  const directionsLink = "https://www.google.com/maps/dir/?api=1&destination=Desa+Sawotratap,+Kecamatan+Gedangan,+Kabupaten+Sidoarjo";

  return (
    <section id="demografi" className="relative z-10 bg-gradient-to-b from-[#FAF9F4] via-[#F4F7F2] to-[#FAF9F4] py-24 px-4 sm:px-8 lg:px-16 text-slate-900 border-t border-[#E3E8E2] overflow-hidden">
      {/* Invisible anchors for #geografis, #profil, #sejarah, #visi-misi */}
      <div id="geografis" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="profil" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="sejarah" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="visi-misi" className="absolute -top-24 left-0 pointer-events-none" />

      {/* SUBTLE GEOMETRIC BACKGROUND ACCENT */}
      <div className="pointer-events-none absolute -right-24 bottom-20 w-88 h-88 opacity-[0.025] -z-0">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#064E3B]" fill="currentColor">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#064E3B" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#064E3B" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#064E3B" strokeWidth="1" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* ========================================================= */}
        {/* HEADER SECTION */}
        {/* ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3.5 py-1 text-xs font-bold text-[#064E3B] shadow-xs mb-3.5">
            <span className="h-2 w-2 rounded-full bg-[#047857] animate-pulse" />
            <span>Pusat Data Kependudukan & Geospasial Desa</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827]">
            Demografi Desa
          </h2>
          <p className="mt-2 text-base sm:text-lg font-bold text-[#064E3B]">
            Data Kependudukan dan Peta Wilayah
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Statistik penduduk resmi semester terbaru dan pemetaan batas wilayah administratif Desa Sawotratap, Kecamatan Gedangan, Kabupaten Sidoarjo, Jawa Timur.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 4 KARTU STATISTIK UTAMA (EXECUTIVE SUMMARY) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10">
          
          {/* Card 1: Total Penduduk */}
          <div className="group rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all card-interactive-2d">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Penduduk
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center text-sm font-bold shadow-xs">
                <Users className="w-4 h-4 text-[#064E3B]" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight tabular-nums">
              8,234
              <span className="text-xs sm:text-sm font-semibold text-slate-500 ml-1.5">Jiwa</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>+1.2% pertumbuhan tahunan</span>
            </div>
          </div>

          {/* Card 2: Kepala Keluarga */}
          <div className="group rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all card-interactive-2d">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kepala Keluarga
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shadow-xs">
                <Home className="w-4 h-4 text-blue-700" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight tabular-nums">
              2,418
              <span className="text-xs sm:text-sm font-semibold text-slate-500 ml-1.5">KK</span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">
              Rata-rata 3.4 jiwa / rumah tangga
            </div>
          </div>

          {/* Card 3: Usia Produktif */}
          <div className="group rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all card-interactive-2d">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Usia Produktif
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold shadow-xs">
                <Zap className="w-4 h-4 text-amber-700" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight tabular-nums">
              68.2%
              <span className="text-xs sm:text-sm font-semibold text-slate-500 ml-1.5">5,618 Jiwa</span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-amber-800">
              Bonus Demografi Unggul (15-64 th)
            </div>
          </div>

          {/* Card 4: Kepadatan & Luas */}
          <div className="group rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all card-interactive-2d">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Luas Wilayah
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold shadow-xs">
                <MapPin className="w-4 h-4 text-purple-700" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight tabular-nums">
              2.45
              <span className="text-xs sm:text-sm font-semibold text-slate-500 ml-1.5">km²</span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">
              11 RW • 54 RT (3,360 jiwa/km²)
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* GRID UTAMA: KOLOM KIRI (DEMOGRAFI) & KOLOM KANAN (MAPS) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ----------------------------------------------------- */}
          {/* KOLOM KIRI: DEMOGRAFI KEPENDUDUKAN (5 COLUMNS / DESKTOP) */}
          {/* ----------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* KARTU 1: BERDASARKAN JENIS KELAMIN */}
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-7 shadow-xs">
              
              {/* Header Kartu Gender */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E8E2]/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#111827]">
                    Berdasarkan Jenis Kelamin
                  </h3>
                </div>

                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  Rasio 100.3
                </span>
              </div>

              {/* Baris Laki-laki */}
              <div className="mt-5 space-y-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-bold">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">Laki-laki</div>
                        <div className="text-[11px] font-medium text-slate-500">50.07% dari populasi</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#111827]">
                        {DATA_GENDER.pria.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">Jiwa</span>
                    </div>
                  </div>

                  {/* Progress bar Laki-laki */}
                  <div className="mt-3 w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-sky-400 h-2 rounded-full w-[50.07%]" />
                  </div>
                </div>

                {/* Baris Perempuan */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-pink-50/50 border border-pink-100/80 hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center text-xs font-bold">
                        <User className="w-4 h-4 text-pink-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">Perempuan</div>
                        <div className="text-[11px] font-medium text-slate-500">49.93% dari populasi</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#111827]">
                        {DATA_GENDER.wanita.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">Jiwa</span>
                    </div>
                  </div>

                  {/* Progress bar Perempuan */}
                  <div className="mt-3 w-full bg-pink-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-2 rounded-full w-[49.93%]" />
                  </div>
                </div>
              </div>

              {/* CARD TOTAL HIGHLIGHT */}
              <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#064E3B] via-[#094738] to-[#0f2c22] p-4 sm:p-5 text-white shadow-lg shadow-emerald-950/20 border border-emerald-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C5D82F]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#C5D82F] font-extrabold block">
                      Total Penduduk
                    </span>
                    <span className="text-[11px] text-emerald-100/80">Sawotratap, Gedangan</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                    {DATA_GENDER.total.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs font-medium text-emerald-200 ml-1.5">Jiwa</span>
                </div>
              </div>

            </div>

            {/* KARTU 2: RENTANG USIA & TAB DISTRIBUSI INTERAKTIF */}
            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-7 shadow-xs">
              
              {/* Header Tab Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E8E2]/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 20V10" />
                      <path d="M12 20V4" />
                      <path d="M6 20v-6" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#111827]">
                    Distribusi Statistik
                  </h3>
                </div>

                {/* Pill Tab Switcher */}
                <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto max-w-full">
                  <button
                    onClick={() => setActiveTab("usia")}
                    className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === "usia"
                        ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Rentang Usia
                  </button>
                  <button
                    onClick={() => setActiveTab("pendidikan")}
                    className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === "pendidikan"
                        ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Pendidikan
                  </button>
                  <button
                    onClick={() => setActiveTab("pekerjaan")}
                    className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === "pekerjaan"
                        ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Pekerjaan
                  </button>
                  <button
                    onClick={() => setActiveTab("wilayah")}
                    className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === "wilayah"
                        ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                        : "hover:text-slate-900"
                    }`}
                  >
                    Per RW
                  </button>
                </div>
              </div>

              {/* ISI TAB 1: RENTANG USIA */}
              {activeTab === "usia" && (
                <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {DATA_RENTANG_USIA.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col p-2.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#111827]">{item.rentang}</span>
                          <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            {item.label}
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-mono font-bold text-[#111827]">
                            {item.jumlah.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[11px] text-slate-500 w-11 text-right">
                            ({item.persen}%)
                          </span>
                        </div>
                      </div>

                      {/* Visual Bar Relatif */}
                      <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-700 ${item.warna}`}
                          style={{ width: `${(item.jumlah / maxRentang) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ISI TAB 2: PENDIDIKAN */}
              {activeTab === "pendidikan" && (
                <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {DATA_PENDIDIKAN.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-[#E3E8E2]/70 hover:border-emerald-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4 text-[#064E3B]" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-extrabold text-[#111827]">{item.jenjang}</div>
                            <div className="text-[11px] text-slate-500">{item.persen}% dari warga</div>
                          </div>
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold text-[#111827]">
                          {item.jumlah.toLocaleString("id-ID")} <span className="text-xs text-slate-500">Org</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ISI TAB 3: PEKERJAAN */}
              {activeTab === "pekerjaan" && (
                <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {DATA_PEKERJAAN.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-[#E3E8E2]/70 hover:border-emerald-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                            <IconComponent className="w-4 h-4 text-[#064E3B]" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-extrabold text-[#111827]">{item.bidang}</div>
                            <div className="text-[11px] text-slate-500">{item.persen}% angkatan kerja</div>
                          </div>
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold text-[#111827]">
                          {item.jumlah.toLocaleString("id-ID")} <span className="text-xs text-slate-500">Jiwa</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ISI TAB 4: PERSEBARAN WILAYAH RW */}
              {activeTab === "wilayah" && (
                <div className="mt-4 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 gap-2">
                    {DATA_WILAYAH_RW.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-[#E3E8E2]/70 hover:border-emerald-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#064E3B]">{item.rw}</span>
                          <span className="text-[10px] font-bold text-slate-500">{item.kk} KK</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 truncate mt-0.5">{item.dusun}</div>
                        <div className="text-xs font-mono font-bold text-[#111827] mt-1">{item.jiwa} Jiwa</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer info kartu */}
              <div className="mt-4 pt-3 border-t border-[#E3E8E2]/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Sumber: Sistem Informasi Desa (SID) Sawotratap</span>
                <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tervalidasi BPS</span>
                </span>
              </div>

            </div>

          </div>

          {/* ----------------------------------------------------- */}
          {/* KOLOM KANAN: PETA DESA SAWOTRATAP (7 COLUMNS / DESKTOP) */}
          {/* ----------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 sm:p-7 shadow-xs flex flex-col h-full">
              
              {/* Header Kartu Peta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3E8E2]/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-[#111827] flex items-center gap-2">
                      Peta Desa Sawotratap
                      <span className="hidden sm:inline-block text-[10px] font-extrabold bg-emerald-50 text-[#064E3B] border border-emerald-200/70 px-2 py-0.5 rounded-full">
                        Gedangan, Sidoarjo
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Batas wilayah dan peta geospasial resmi Desa Sawotratap
                    </p>
                  </div>
                </div>

                {/* Kontrol Tampilan Peta */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setMapType("3d")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        mapType === "3d"
                          ? "bg-[#064E3B] text-[#C5D82F] shadow-sm font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Miniatur 3D</span>
                    </button>
                    <button
                      onClick={() => setMapType("m")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        mapType === "m"
                          ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Peta Jalan</span>
                    </button>
                    <button
                      onClick={() => setMapType("k")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        mapType === "k"
                          ? "bg-white text-[#064E3B] shadow-sm font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <Satellite className="w-3.5 h-3.5" />
                      <span>Satelit</span>
                    </button>
                  </div>

                  <a
                    href={externalMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] border border-emerald-200/80 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                    title="Buka langsung di Google Maps"
                  >
                    <span>Buka Maps</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* WRAPPER EMBED GOOGLE MAPS ATAU MINIATUR 3D */}
              <div className="relative mt-4 w-full h-[460px] sm:h-[500px] lg:h-[520px] rounded-2xl overflow-hidden border border-[#E3E8E2] shadow-inner bg-slate-100">
                {mapType === "3d" ? (
                  <div className="relative w-full h-full bg-[#FAFAF5] flex items-center justify-center overflow-hidden group">
                    <img
                      src="/aset/peta-desa-3d.jpg"
                      alt="Peta Miniatur 3D Desa Sawotratap"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5D82F]" />
                        <span className="font-bold">Visualisasi Isometrik 3D Wilayah Desa Sawotratap</span>
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">11 RW • 54 RT • Gedangan</span>
                    </div>
                  </div>
                ) : (
                  <iframe
                    title="Peta Interaktif Desa Sawotratap Gedangan Sidoarjo"
                    src={googleMapsUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}

                {/* FLOATING INFO BADGE ATAS KIRI PETA */}
                <div className="absolute top-3 left-3 z-10 max-w-[280px] sm:max-w-xs rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-[#E3E8E2] pointer-events-auto">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-[#C5D82F] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#111827] leading-tight">
                        Desa Sawotratap
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Kec. Gedangan, Kab. Sidoarjo, Jawa Timur
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <a
                          href={directionsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#064E3B] hover:bg-[#047857] text-white px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                        >
                          <span>Rute Arah</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A2 2 0 012.553 15.382V4.618a2 2 0 011.106-1.789L9 1m0 19l6-3m-6 3V1m6 16.724l5.447 2.724A2 2 0 0021.447 18.382V7.618a2 2 0 00-1.106-1.789L15 4m0 13.724V4M9 1l6 3" />
                          </svg>
                        </a>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Kode Pos: 61254
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FLOATING STATUS BADGE BAWAH KANAN */}
                <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 rounded-full bg-[#111827]/85 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-bold text-white shadow-lg border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
                  <span>Geospasial Aktif • Kec. Gedangan</span>
                </div>
              </div>

              {/* BATAS-BATAS WILAYAH ADMINISTRATIF */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Utara</span>
                  <span className="text-xs font-bold text-slate-800">Kecamatan Waru</span>
                  <span className="text-[10px] text-slate-500 block">Bungurasih & Medaeng</span>
                </div>

                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Selatan</span>
                  <span className="text-xs font-bold text-slate-800">Desa Keboansikep</span>
                  <span className="text-[10px] text-slate-500 block">Kec. Gedangan</span>
                </div>

                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Barat</span>
                  <span className="text-xs font-bold text-slate-800">Pepelegi / Aloha</span>
                  <span className="text-[10px] text-slate-500 block">Flyover Aloha Sidoarjo</span>
                </div>

                <div className="rounded-xl bg-[#FAF9F4] border border-[#E3E8E2] p-2.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Batas Timur</span>
                  <span className="text-xs font-bold text-slate-800">Kecamatan Sedati</span>
                  <span className="text-[10px] text-slate-500 block">Area Bandara Juanda</span>
                </div>
              </div>

              {/* FOOTER INFO FASILITAS UTAMA DI SAWOTRATAP */}
              <div className="mt-4 pt-3.5 border-t border-[#E3E8E2]/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-semibold text-slate-700">Fasilitas Sekitar:</span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <Landmark className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Balai Desa</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <Activity className="w-3.5 h-3.5 text-rose-600" />
                    <span>Pustu Sawotratap</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <School className="w-3.5 h-3.5 text-blue-600" />
                    <span>SDN Sawotratap</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200/60 text-slate-800">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>Masjid Baiturrahman</span>
                  </span>
                </div>

                <a
                  href="#layanan"
                  className="text-xs font-bold text-[#064E3B] hover:text-[#047857] inline-flex items-center gap-1"
                >
                  <span>Layanan Desa</span>
                  <span>→</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
