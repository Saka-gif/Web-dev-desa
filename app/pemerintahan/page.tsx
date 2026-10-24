"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  BadgeCheck,
  Quote,
  Sparkles,
  Users,
  ChevronRight,
  Target,
  FileText,
  PhoneCall,
  UserCheck,
  Flame,
  Check,
  Layers,
  MapPin,
  ExternalLink,
} from "lucide-react";

interface PamongPejabat {
  nama: string;
  jabatan: string;
  sub: string;
  avatarColor: string;
  tagColor: string;
  tags: string[];
  telepon: string;
}

const DAFTAR_KAUR: PamongPejabat[] = [
  {
    nama: "Ahmad Zainuri, S.E.",
    jabatan: "Kaur Keuangan",
    sub: "Bendahara APBDes",
    avatarColor: "from-emerald-600 to-teal-800",
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    tags: ["Pagu Rp 2.85 M", "Realisasi Kas", "SPJ Keuangan RW"],
    telepon: "0812-3456-7891",
  },
  {
    nama: "M. Choirul Anam, S.Pd.",
    jabatan: "Kaur Perencanaan",
    sub: "Pembangunan Desa",
    avatarColor: "from-amber-600 to-orange-800",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    tags: ["RKPDes 2025", "Musrenbang Dusun", "Peta Proyek Fisik"],
    telepon: "0812-3456-7892",
  },
  {
    nama: "Nurul Hidayati",
    jabatan: "Kaur TU & Umum",
    sub: "Aset & Rumah Tangga",
    avatarColor: "from-purple-600 to-indigo-800",
    tagColor: "bg-purple-50 text-purple-800 border-purple-200",
    tags: ["Inventaris Balai", "Agenda Surat Masuk", "Logistik PTSP"],
    telepon: "0812-3456-7893",
  },
];

const DAFTAR_KASI: PamongPejabat[] = [
  {
    nama: "Ir. Joko Prasetyo",
    jabatan: "Kasi Pemerintahan",
    sub: "Hukum & Trantib",
    avatarColor: "from-blue-600 to-sky-800",
    tagColor: "bg-blue-50 text-blue-800 border-blue-200",
    tags: ["KTP-el & KK", "Peraturan Desa", "Linmas & Siskamling"],
    telepon: "0812-3456-7894",
  },
  {
    nama: "Sulistiyowati, S.Sos.",
    jabatan: "Kasi Kesejahteraan",
    sub: "Sosial & Warga",
    avatarColor: "from-rose-600 to-pink-800",
    tagColor: "bg-rose-50 text-rose-800 border-rose-200",
    tags: ["Penyaluran BLT", "Bebas Stunting", "Pavingisasi RW"],
    telepon: "0812-3456-7895",
  },
  {
    nama: "Budi Santoso, S.Kom.",
    jabatan: "Kasi Pelayanan",
    sub: "Digital & PTSP",
    avatarColor: "from-teal-600 to-emerald-800",
    tagColor: "bg-teal-50 text-teal-800 border-teal-200",
    tags: ["Surat 1 Hari", "Loket Mandiri", "Meja Aduan WA"],
    telepon: "0812-3456-7896",
  },
];

export default function PemerintahanPage() {
  const [activeTab, setActiveTab] = useState<"struktur" | "bpd" | "transparansi">("struktur");

  // Sync tab with URL hash on mount & hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "sambutan" || hash === "pamong" || hash === "bagan" || hash === "struktur") {
        setActiveTab("struktur");
        setTimeout(() => {
          const targetId = hash === "pamong" ? "bagan" : hash;
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else if (hash === "bpd") {
        setActiveTab("bpd");
        setTimeout(() => {
          const el = document.getElementById("bpd");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else if (hash === "transparansi" || hash === "apbd") {
        setActiveTab("transparansi");
        setTimeout(() => {
          const el = document.getElementById("transparansi");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] pt-24 sm:pt-28 pb-20 font-sans">
      
      {/* 1. HERO HEADER VISUAL PEMERINTAHAN DESA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06261D] via-[#083327] to-[#0A1F17] text-white py-14 sm:py-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#C5D82F]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
            <span>/</span>
            <span className="text-white font-bold">Pemerintahan Desa</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#064E3B]/80 px-4 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
            <span>Pemerintah Desa Sawotratap • Melayani Cepat, Transparan & Akuntabel</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Struktur Pamong & <br />
            <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
              Tata Kelola Desa
            </span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
            Bagan resmi aparatur pamong Desa Sawotratap yang siap melayani 8.234 warga, didukung pengawasan BPD dan transparansi penuh APBDes 2024.
          </p>

          {/* Quick Visual Counters (Icon Badges, No Boring Paragraphs!) */}
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5D82F]/20 text-[#C5D82F] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300">Pusat Layanan</div>
                <div className="text-sm sm:text-base font-black text-white">1 Balai PTSP</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300">Aparatur Pamong</div>
                <div className="text-sm sm:text-base font-black text-white">9 Pejabat Aktif</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300">Mitra Warga</div>
                <div className="text-sm sm:text-base font-black text-white">9 Kursi BPD</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300">Penyerapan Dana</div>
                <div className="text-sm sm:text-base font-black text-[#C5D82F]">91.9% Realisasi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TAB NAVIGATOR STICKY */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3E8E2] px-6 sm:px-10 lg:px-16 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
          
          <button
            onClick={() => {
              setActiveTab("struktur");
              window.history.replaceState(null, "", "#struktur");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "struktur"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#C5D82F]" />
            <span>Sambutan Kades & Bagan Struktur</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("bpd");
              window.history.replaceState(null, "", "#bpd");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "bpd"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BPD & Lembaga Warga</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("transparansi");
              window.history.replaceState(null, "", "#transparansi");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "transparansi"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Infografis APBDes 2024</span>
          </button>

        </div>
      </div>

      {/* 3. KONTEN DETAIL PEMERINTAHAN */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 space-y-20">
        
        {/* ========================================================================= */}
        {/* BAGIAN STRUKTUR: MENYATUKAN SAMBUTAN KADES + BAGAN STRUKTUR SECARA VISUAL */}
        {/* ========================================================================= */}
        {activeTab === "struktur" && (
          <div className="space-y-16">
            
            {/* ------------------------------------------------------------- */}
            {/* 1. SAMBUTAN RESMI KEPALA DESA (MAHKOTA STRUKTUR ORGANISASI) */}
            {/* ------------------------------------------------------------- */}
            <section id="sambutan" className="scroll-mt-36">
              
              <div className="rounded-3xl border-2 border-emerald-600/40 bg-gradient-to-br from-[#06261D] via-[#093527] to-[#0A1B14] text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                
                {/* Background Geometric Accent */}
                <div className="pointer-events-none absolute -right-12 -bottom-12 w-80 h-80 opacity-5">
                  <Quote className="w-full h-full text-[#C5D82F]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                  
                  {/* FOTO RESMI KEPALA DESA BERSERAGAM PUTIH (PDU) + FRAME EMAS (5 COLS) */}
                  <div className="lg:col-span-5 flex flex-col items-center text-center">
                    <div className="relative group">
                      
                      {/* 2D Breathing Glow Aura Ring */}
                      <div className="absolute -inset-2.5 rounded-[2.5rem] bg-gradient-to-r from-[#C5D82F] to-emerald-400 opacity-40 blur-xl animate-pulse-subtle transition duration-700" />
                      
                      {/* Frame Foto Resmi Kades */}
                      <div className="relative w-64 sm:w-72 h-88 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#C5D82F] shadow-2xl bg-black/60">
                        <img
                          src="/aset/kades.jpg"
                          alt="H. Bambang Sutrisno, S.T. - Kepala Desa Sawotratap"
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        {/* Badge Nama & Pangkat di Atas Foto */}
                        <div className="absolute bottom-4 inset-x-3 text-center">
                          <span className="inline-block bg-[#064E3B]/90 backdrop-blur-md border border-[#C5D82F]/50 px-3 py-1 rounded-full text-[10px] font-black text-[#C5D82F] uppercase tracking-wider mb-1.5 shadow-md">
                            Pimpinan Tertinggi Desa
                          </span>
                          <div className="text-base sm:text-lg font-black text-white tracking-wide leading-tight">
                            H. Bambang Sutrisno, S.T.
                          </div>
                          <div className="text-xs font-bold text-emerald-300 mt-0.5">
                            Kepala Desa Sawotratap
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Masa Bakti & SK Resmi */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-emerald-200">
                        <BadgeCheck className="w-3.5 h-3.5 text-[#C5D82F]" />
                        <span>Masa Bakti: 2020 – 2026</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-bold text-[#C5D82F]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SK Bupati Sidoarjo</span>
                      </span>
                    </div>
                  </div>

                  {/* KONTEN TEKS SAMBUTAN KADES (VISUAL, PUNCHY, MINIM TEKS) (7 COLS) */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#C5D82F]/15 border border-[#C5D82F]/40 px-3.5 py-1 text-xs font-black text-[#C5D82F]">
                      <Sparkles className="w-3.5 h-3.5 animate-bounce-subtle" />
                      <span>Sambutan Resmi Kepala Desa di Struktur Organisasi</span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                        &ldquo;Melayani dengan Hati, Bekerja dengan Bukti, Membangun Sawotratap Mandiri!&rdquo;
                      </h2>
                      <p className="text-xs sm:text-sm text-emerald-300 font-bold">
                        Assalamu’alaikum Wr. Wb., Salam Gotong Royong untuk Seluruh Warga Sawotratap.
                      </p>
                    </div>

                    {/* Pesan Kades: Padat, Tegas & Mudah Dipahami (Anti-Boring Text) */}
                    <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
                      Selaku Kepala Desa, saya bersama jajaran pamong berkomitmen memberikan pelayanan kependudukan yang cepat, transparan, dan bebas pungli. Seluruh perangkat desa di bawah ini siap melayani kebutuhan administrasi warga dengan sepenuh hati.
                    </p>

                    {/* 4 KARTU GARANSI PELAYANAN (HIGHLY VISUAL BADGES WITH 2D INTERACTION) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      
                      <div className="card-interactive-2d shine-hover p-3 rounded-2xl bg-white/10 border border-white/15 text-center transition-all">
                        <div className="w-8 h-8 rounded-xl bg-[#C5D82F]/20 text-[#C5D82F] mx-auto flex items-center justify-center font-bold text-xs mb-1.5">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-300">Surat Online</div>
                        <div className="text-xs sm:text-sm font-black text-[#C5D82F] mt-0.5">1x24 Jam Jadi</div>
                      </div>

                      <div className="card-interactive-2d shine-hover p-3 rounded-2xl bg-white/10 border border-white/15 text-center transition-all">
                        <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 mx-auto flex items-center justify-center font-bold text-xs mb-1.5">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-300">Biaya Layanan</div>
                        <div className="text-xs sm:text-sm font-black text-emerald-300 mt-0.5">Rp 0 (Gratis)</div>
                      </div>

                      <div className="card-interactive-2d shine-hover p-3 rounded-2xl bg-white/10 border border-white/15 text-center transition-all">
                        <div className="w-8 h-8 rounded-xl bg-sky-400/20 text-sky-300 mx-auto flex items-center justify-center font-bold text-xs mb-1.5">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-300">Aduan Warga</div>
                        <div className="text-xs sm:text-sm font-black text-sky-300 mt-0.5">Respon Cepat</div>
                      </div>

                      <div className="card-interactive-2d shine-hover p-3 rounded-2xl bg-white/10 border border-white/15 text-center transition-all">
                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center font-bold text-xs mb-1.5">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-300">Status IDM</div>
                        <div className="text-xs sm:text-sm font-black text-amber-300 mt-0.5">Desa Mandiri</div>
                      </div>

                    </div>

                    {/* Footer Sambutan: Stempel Verifikasi & Tombol Aksi Langsung */}
                    <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-[#C5D82F] flex items-center justify-center font-black text-[9px] text-[#C5D82F] uppercase text-center leading-tight">
                          SEAL<br/>DESA
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-300">Legalitas & Mandat:</div>
                          <div className="font-extrabold text-sm text-white">H. Bambang Sutrisno, S.T.</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href="https://wa.me/6281234567890?text=Halo%20Pak%20Kades%20Sawotratap%2C%20saya%20warga%20ingin%20menyampaikan%20aspirasi"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black shadow-md transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>WhatsApp Pak Kades</span>
                        </a>

                        <a
                          href="#bagan"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#063325] text-xs font-black uppercase tracking-wider transition-all shadow-md"
                        >
                          <span>Lihat Bagan</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* ------------------------------------------------------------- */}
            {/* 2. BAGAN STRUKTUR ORGANISASI APARATUR (FLOWCHART INTERAKTIF) */}
            {/* ------------------------------------------------------------- */}
            <div id="pamong" className="scroll-mt-36" />
            <section id="bagan" className="scroll-mt-36 space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Hirarki Pelayanan Desa</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Bagan Struktur Aparatur Pemdes</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-[#E3E8E2] px-3.5 py-1.5 rounded-full shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pelayanan Kantor: 08.00 – 15.00 WIB</span>
                </div>
              </div>

              {/* FLOWCHART STRUKTUR: KEPALA DESA (LEVEL 1) */}
              <div className="max-w-md mx-auto relative">
                <div className="rounded-3xl border-2 border-emerald-600 bg-gradient-to-b from-white to-emerald-50/40 p-5 shadow-lg text-center relative group hover:shadow-xl transition-all">
                  
                  {/* Badge Pucuk Pimpinan */}
                  <span className="inline-block text-[9px] font-black uppercase tracking-widest text-white bg-[#064E3B] px-3 py-0.5 rounded-full mb-3 shadow-xs">
                    Pimpinan Tertinggi & Penanggung Jawab
                  </span>

                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border-2 border-emerald-600 shadow-md mb-2">
                    <img src="/aset/kades.jpg" alt="Kepala Desa" className="w-full h-full object-cover object-top" />
                  </div>

                  <h3 className="text-base font-black text-[#111827]">H. Bambang Sutrisno, S.T.</h3>
                  <div className="text-xs font-bold text-emerald-700">Kepala Desa Sawotratap</div>
                  
                  {/* Visual Duty Chips */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#064E3B] px-2 py-0.5 rounded-md">
                      Kebijakan Desa
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#064E3B] px-2 py-0.5 rounded-md">
                      Penyelenggara APBDes
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#064E3B] px-2 py-0.5 rounded-md">
                      Pengayom 11 RW
                    </span>
                  </div>
                </div>

                {/* Garis Penghubung Turun ke Sekdes */}
                <div className="flex justify-center my-1">
                  <div className="w-0.5 h-8 bg-emerald-500" />
                </div>
              </div>

              {/* LEVEL 2: SEKRETARIS DESA (KOORDINATOR ADMINISTRASI) */}
              <div className="max-w-md mx-auto relative">
                <div className="rounded-3xl border-2 border-blue-500 bg-gradient-to-b from-white to-blue-50/40 p-5 shadow-md text-center group hover:shadow-lg transition-all">
                  
                  <span className="inline-block text-[9px] font-black uppercase tracking-widest text-blue-900 bg-blue-100 px-3 py-0.5 rounded-full mb-2">
                    Koordinator Sekretariat Desa
                  </span>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white mx-auto flex items-center justify-center font-black text-lg shadow-sm mb-2">
                    SR
                  </div>

                  <h4 className="text-base font-black text-[#111827]">Dra. Siti Rahmawati</h4>
                  <div className="text-xs font-bold text-blue-700">Sekretaris Desa (Sekdes)</div>
                  
                  <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      Pengendali Administrasi
                    </span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      Verifikasi RKPDes
                    </span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      PNS Pamong
                    </span>
                  </div>
                </div>

                {/* Garis Cabang ke Sayap Kiri (Kaur) dan Sayap Kanan (Kasi) */}
                <div className="hidden lg:block relative h-10 -my-1">
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-5 bg-emerald-400 top-0" />
                  <div className="absolute left-1/4 right-1/4 h-0.5 bg-emerald-400 top-5" />
                  <div className="absolute left-1/4 w-0.5 h-5 bg-emerald-400 top-5" />
                  <div className="absolute right-1/4 w-0.5 h-5 bg-emerald-400 top-5" />
                </div>
              </div>

              {/* LEVEL 3: DUA SAYAP (SAYAP URUSAN / KAUR & SAYAP SEKSI / KASI) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                
                {/* SAYAP KIRI: 3 KEPALA URUSAN (KEUANGAN, PERENCANAAN, UMUM) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-950">
                      Unsur Pelaksana Urusan (Kaur)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {DAFTAR_KAUR.map((k, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#E3E8E2] bg-white p-4 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${k.avatarColor} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}>
                            {k.nama.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {k.sub}
                            </div>
                            <h4 className="text-sm font-black text-[#111827]">
                              {k.nama}
                            </h4>
                            <div className="text-xs font-bold text-emerald-700">
                              {k.jabatan}
                            </div>

                            {/* Tags Tugas Visual */}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {k.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${k.tagColor}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/62${k.telepon.replace(/\D/g, "").slice(1)}?text=Halo%20${encodeURIComponent(k.jabatan)}%20Sawotratap`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-[#064E3B] transition-colors"
                          title="Hubungi Petugas"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SAYAP KANAN: 3 KEPALA SEKSI (PEMERINTAHAN, KESEJAHTERAAN, PELAYANAN) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-blue-950">
                      Unsur Pelaksana Seksi (Kasi)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {DAFTAR_KASI.map((s, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#E3E8E2] bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.avatarColor} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}>
                            {s.nama.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {s.sub}
                            </div>
                            <h4 className="text-sm font-black text-[#111827]">
                              {s.nama}
                            </h4>
                            <div className="text-xs font-bold text-blue-700">
                              {s.jabatan}
                            </div>

                            {/* Tags Tugas Visual */}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {s.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${s.tagColor}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/62${s.telepon.replace(/\D/g, "").slice(1)}?text=Halo%20${encodeURIComponent(s.jabatan)}%20Sawotratap`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                          title="Hubungi Petugas"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* LEVEL 4: KEWILAYAHAN DUSUN & 11 RUKUN WARGA (RW 01 - RW 11) */}
              <div className="mt-8 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm sm:text-base font-black text-[#111827]">
                      Unsur Kewilayahan: Kepala Dusun & 11 Rukun Warga (RW)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                    Kasun Krajan: H. Mustofa
                  </span>
                </div>

                {/* Grid Visual 11 RW */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
                  {[
                    { rw: "RW 01", label: "Krajan Barat" },
                    { rw: "RW 02", label: "Krajan Sentral" },
                    { rw: "RW 03", label: "Sawotratap Timur" },
                    { rw: "RW 04", label: "Graha Sawotratap" },
                    { rw: "RW 05", label: "Kawasan Niaga" },
                    { rw: "RW 06", label: "Sawotratap Utara" },
                    { rw: "RW 07", label: "Sawotratap Asri" },
                    { rw: "RW 08", label: "Kavling Mandiri" },
                    { rw: "RW 09", label: "Sawotratap Selatan" },
                    { rw: "RW 10", label: "Perumahan Delta" },
                    { rw: "RW 11", label: "Perbatasan Juanda" },
                    { rw: "54 RT", label: "Total RT Terkoordinasi" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                    >
                      <div className="font-mono font-black text-sm text-[#064E3B]">{item.rw}</div>
                      <div className="text-[10px] font-semibold text-slate-500 truncate mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </section>

          </div>
        )}

        {/* ========================================================================= */}
        {/* BAGIAN BPD & LEMBAGA KEMASYARAKATAN                                       */}
        {/* ========================================================================= */}
        {activeTab === "bpd" && (
          <section id="bpd" className="scroll-mt-36 space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Mitra Musyawarah & Pengawas</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Badan Permusyawaratan Desa (BPD) & Lembaga</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Kartu BPD */}
              <div className="rounded-3xl border-2 border-blue-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      9 Kursi RW
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">BPD Sawotratap</h3>
                  <p className="text-xs font-bold text-blue-700 mt-0.5">Ketua: Drs. H. Mulyono</p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Membahas & menyepakati Peraturan Desa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Menyalurkan aspirasi warga 11 RW</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Mengawasi kinerja pelaksanaan APBDes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700">
                  Masa Keanggotaan: 2020 – 2026
                </div>
              </div>

              {/* Kartu Karang Taruna */}
              <div className="rounded-3xl border-2 border-amber-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Pemuda Digital
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">Karang Taruna &quot;Tratap Muda&quot;</h3>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">Ketua: Dimas Aditya, S.T.</p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Kepanitiaan HUT RI & festival kesenian</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Pelatihan wirausaha digital & konten kreatif</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Relawan tanggap bencana & penghijauan</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
                  Aktif di 11 Unit RW Pemuda
                </div>
              </div>

              {/* Kartu PKK */}
              <div className="rounded-3xl border-2 border-rose-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-rose-900 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      Ibu Sehat & Sejahtera
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#111827]">Tim Penggerak PKK</h3>
                  <p className="text-xs font-bold text-rose-700 mt-0.5">Ketua: Hj. Endah Sutrisno</p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Pemeriksaan rutin posyandu balita & lansia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Gerakan cegah stunting & gizi seimbang</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Koperasi simpan pinjam & olahan pangan</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-bold text-rose-700">
                  Kader Posyandu di 11 RW
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* BAGIAN TRANSPARANSI APBDES 2024: INFOGRAFIS TOTAL (ANTI-TEKS BERBELIT)     */}
        {/* ========================================================================= */}
        {activeTab === "transparansi" && (
          <section id="transparansi" className="scroll-mt-36 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Keterbukaan Anggaran</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Infografis Realisasi APBDes 2024</h2>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-300">
                Opini WTP BPK & Inspektorat Sidoarjo
              </span>
            </div>

            {/* DASHBOARD CARD ANGGARAN RAKSASA */}
            <div className="rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0A1F17] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
                
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-[#C5D82F]">Total Pagu Anggaran 2024</div>
                  <div className="text-4xl sm:text-6xl font-black font-mono text-white mt-1">Rp 2.85 M</div>
                  <div className="text-xs text-emerald-100/90 mt-2">
                    Sumber: Dana Desa (DD), ADD Kab. Sidoarjo, Bagi Hasil Pajak, & PADes.
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-emerald-200">
                    <span>Realisasi Penyerapan</span>
                    <span className="text-[#C5D82F]">91.9%</span>
                  </div>
                  <div className="text-3xl sm:text-5xl font-black font-mono text-[#C5D82F] mt-1">Rp 2.62 M</div>
                  <div className="w-full bg-black/40 rounded-full h-3 mt-3 overflow-hidden">
                    <div className="bg-[#C5D82F] h-full rounded-full w-[91.9%]" />
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                  <div className="text-xs font-bold text-slate-300">Dana Cadangan & Tanggap Darurat</div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">Rp 230 Juta</div>
                  <div className="text-[11px] text-emerald-200 mt-1">Siaga mitigasi genangan hujan & bansos insidental.</div>
                </div>

              </div>
            </div>

            {/* 4 PILAR ALOKASI ANGGARAN (VISUAL PROGRESS & PERSENTASE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="rounded-3xl border-2 border-emerald-500/30 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Pembangunan Fisik</span>
                  <span className="text-emerald-700 font-mono font-black text-sm">43.8%</span>
                </div>
                <div className="text-2xl font-black text-[#111827] font-mono">Rp 1.250 Jt</div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-[43.8%]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px] font-bold text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Paving Jalan</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Drainase RW</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">PJU Tenaga Surya</span>
                </div>
              </div>

              <div className="rounded-3xl border-2 border-blue-500/30 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Operasional Pemdes</span>
                  <span className="text-blue-700 font-mono font-black text-sm">31.2%</span>
                </div>
                <div className="text-2xl font-black text-[#111827] font-mono">Rp 890 Jt</div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[31.2%]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px] font-bold text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Siltap Pamong</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">PTSP Balai</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Server Digital</span>
                </div>
              </div>

              <div className="rounded-3xl border-2 border-purple-500/30 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Bansos & Posyandu</span>
                  <span className="text-purple-700 font-mono font-black text-sm">12.6%</span>
                </div>
                <div className="text-2xl font-black text-[#111827] font-mono">Rp 360 Jt</div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full w-[12.6%]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px] font-bold text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">BLT Dana Desa</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">PMT Balita</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Cek Lansia</span>
                </div>
              </div>

              <div className="rounded-3xl border-2 border-amber-500/30 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Pemberdayaan UMKM</span>
                  <span className="text-amber-700 font-mono font-black text-sm">12.4%</span>
                </div>
                <div className="text-2xl font-black text-[#111827] font-mono">Rp 350 Jt</div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full w-[12.4%]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px] font-bold text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Bazar Rakyat</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Fasilitasi NIB</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Pelatihan Digital</span>
                </div>
              </div>

            </div>
          </section>
        )}

      </div>

    </div>
  );
}
