"use client";

import React, { useState, useEffect } from "react";
import {
  Landmark,
  Compass,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  Building,
  Target,
  Clock,
  TreePine,
  Navigation,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function ProfilPage() {
  const [activeSection, setActiveSection] = useState("sejarah");

  // Deteksi section yang sedang aktif saat discroll ke bawah
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["sejarah", "visi-misi", "geografis", "demografi"];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk scroll mulus saat menu diklik
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] font-sans">
      
      {/* 1. HERO HEADER PROFIL DESA */}
      <section className="relative overflow-hidden bg-[#06261D] text-white pt-36 sm:pt-44 pb-14 sm:pb-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Breadcrumb Clean Style (Tanpa Box) */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
            <span>/</span>
            <span className="text-white font-bold">Profil Desa</span>
          </div>

          {/* JUDUL UTAMA */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Profil Visual <br />
              <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
                Desa Sawotratap
              </span>
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
              Potret komprehensif sejarah peradaban, arah pembangunan visi misi, peta segitiga emas Aloha-Juanda, dan statistik warga secara visual.
            </p>
          </div>

          {/* KAPSUL DESA MANDIRI BERKEMBANG (1 Warna Menyatu dengan Background) */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#06261D] border border-[#C5D82F]/30 shadow-sm">
              
              {/* Box Ikon Hijau Gelap dengan Border Lime */}
              <div className="w-10 h-10 rounded-xl bg-[#083327] border border-[#C5D82F]/40 flex items-center justify-center shrink-0 text-[#C5D82F]">
                <ShieldCheck className="w-5 h-5" />
              </div>

              {/* Teks Keterangan */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5D82F] shrink-0" />
                  <span className="text-xs font-black tracking-wider text-[#C5D82F] uppercase">
                    Desa Mandiri Berkembang
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-100/80">
                  Resmi menyandang status IDM Tertinggi dari Kemendesa PDTT Republik Indonesia.
                </p>
              </div>

            </div>
          </div>

          {/* 4 Quick Stat Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5D82F]/20 text-[#C5D82F] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Status IDM</div>
                <div className="text-sm font-black text-[#C5D82F]">Desa Mandiri</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Luas Wilayah</div>
                <div className="text-sm font-black text-white">2.45 km²</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Penduduk</div>
                <div className="text-sm font-black text-white">8.234 Jiwa</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Wilayah Warga</div>
                <div className="text-sm font-black text-white">11 RW • 54 RT</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STICKY JUMP-TO NAVIGATION BAR */}
      <div className="sticky top-20 z-30 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => scrollToSection("sejarah")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "sejarah"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Infografis Sejarah</span>
          </button>

          <button
            onClick={() => scrollToSection("visi-misi")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "visi-misi"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Visi & 5 Misi Pokok</span>
          </button>

          <button
            onClick={() => scrollToSection("geografis")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "geografis"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Peta Batas & Spasial</span>
          </button>

          <button
            onClick={() => scrollToSection("demografi")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "demografi"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Statistik Populasi</span>
          </button>

        </div>
      </div>

      {/* 3. KONTEN BERDERET KE BAWAH */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12 space-y-28 pb-24">
        
        {/* SEJARAH */}
        <div id="sejarah" className="scroll-mt-36 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Rekam Jejak Historis</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Asal-Usul Nama & Sejarah Sawotratap</h2>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              Arsip Sejarah Gedangan, Sidoarjo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/20 p-6 sm:p-8 shadow-xs flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#064E3B] text-[#C5D82F] flex items-center justify-center shrink-0 font-black text-xl shadow-md">
                <TreePine className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Unsur Pertama
                </span>
                <h3 className="text-2xl font-black text-[#111827] mt-1">&quot;SAWO&quot;</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                  Deretan pohon sawo rindang berbuah manis peneduh jalur niaga Sidoarjo-Surabaya tempo dulu.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simbol Kesuburan & Keasrian Lingkungan</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 via-white to-amber-50/20 p-6 sm:p-8 shadow-xs flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 font-black text-xl shadow-md">
                <Navigation className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Unsur Kedua
                </span>
                <h3 className="text-2xl font-black text-[#111827] mt-1">&quot;TRATAP&quot;</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                  Dari kata lokal <em>&apos;tarap / trap&apos;</em> yang berarti tingkatan tempat singgah istirahat para pedagang pedati perintis.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-amber-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simbol Titik Temu Strategis & Perdagangan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-base font-black text-[#111827] flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Lini Masa Perjalanan Desa Sawotratap</span>
              <Clock className="w-4 h-4 text-emerald-700" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Abad ke-19</span>
                  <h4 className="text-sm font-black text-[#111827] mt-3">Pos Niaga Tebu & Perintis</h4>
                  <p className="text-xs text-slate-500 mt-1">Jalur angkut hasil perkebunan tradisional menuju Surabaya.</p>
                </div>
                <div className="text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-200 mt-3">Fase Perintisan</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">Tahun 1952</span>
                  <h4 className="text-sm font-black text-[#111827] mt-3">Struktur Pamong Definitif</h4>
                  <p className="text-xs text-slate-500 mt-1">Pendirian Balai Desa dan penataan dusun krajan pertama.</p>
                </div>
                <div className="text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-200 mt-3">Fase Kemerdekaan</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">Tahun 1995</span>
                  <h4 className="text-sm font-black text-[#111827] mt-3">Kawasan Hunian & Niaga</h4>
                  <p className="text-xs text-slate-500 mt-1">Pertumbuhan perumahan baru seiring ekspansi Bandara Juanda.</p>
                </div>
                <div className="text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-200 mt-3">Fase Urbanisasi</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#06261D] text-white shadow-md flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-black text-[#C5D82F] bg-white/10 px-2.5 py-0.5 rounded border border-white/20">2024 - Sekarang</span>
                  <h4 className="text-sm font-black text-white mt-3">Desa Mandiri Digital</h4>
                  <p className="text-xs text-emerald-100 mt-1">Integrasi Flyover Aloha Juanda dan layanan publik tanpa antre.</p>
                </div>
                <div className="text-[10px] text-[#C5D82F] font-bold pt-3 border-t border-white/20 mt-3">Era Keemasan</div>
              </div>
            </div>
          </div>
        </div>

        {/* VISI MISI */}
        <div id="visi-misi" className="scroll-mt-36 space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Arah Pembangunan Jangka Panjang</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Visi & 5 Misi Pokok Desa Sawotratap</h2>
            </div>
          </div>

          <div className="rounded-3xl bg-[#06261D] text-white p-6 sm:p-10 shadow-lg border border-emerald-900/40">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#083327] border border-[#C5D82F]/30 px-3.5 py-1 text-xs font-bold text-[#C5D82F]">
                <Target className="w-3.5 h-3.5 text-[#C5D82F]" />
                <span>Visi Kepemimpinan Kepala Desa & Pamong</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black leading-snug tracking-tight text-white">
                &ldquo;Mewujudkan Desa Sawotratap yang Mandiri, Sejahtera, Transparan, dan Berdaya Saing Melalui Pelayanan Publik Cepat Berbasis Gotong Royong.&rdquo;
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-[#E3E8E2] bg-white flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-3xl font-black text-emerald-600 font-mono">01</div>
                <h4 className="text-base font-black text-[#111827] mt-2">Pelayanan Publik Mandiri</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">Surat online 1x24 jam, loket PTSP ramah warga, dan 100% bebas pungli.</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700">Target: Efisiensi Berkas 100%</div>
            </div>

            <div className="p-5 rounded-3xl border border-[#E3E8E2] bg-white flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-3xl font-black text-blue-600 font-mono">02</div>
                <h4 className="text-base font-black text-[#111827] mt-2">Infrastruktur & Drainase</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">Pavingisasi jalan pemukiman 11 RW dan normalisasi saluran air anti genangan.</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-blue-700">Target: Jalan Mulus & Bebas Banjir</div>
            </div>

            <div className="p-5 rounded-3xl border border-[#E3E8E2] bg-white flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-3xl font-black text-amber-600 font-mono">03</div>
                <h4 className="text-base font-black text-[#111827] mt-2">Pemberdayaan UMKM Warga</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">Pendampingan izin NIB, fasilitasi halal, dan bazar pasar rakyat berkala.</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-amber-700">Target: 150+ Usaha Mandiri</div>
            </div>

            <div className="p-5 rounded-3xl border border-[#E3E8E2] bg-white flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-3xl font-black text-purple-600 font-mono">04</div>
                <h4 className="text-base font-black text-[#111827] mt-2">Kesehatan & Bebas Stunting</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">Posyandu aktif di 11 RW, bantuan makanan bergizi balita, dan cek lansia gratis.</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-purple-700">Target: Zero Stunting Baru</div>
            </div>

            <div className="p-5 rounded-3xl border border-[#E3E8E2] bg-white flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-3xl font-black text-rose-600 font-mono">05</div>
                <h4 className="text-base font-black text-[#111827] mt-2">Kepemudaan & Keamanan</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">Aktivasi Karang Taruna digital, pentas seni warga, dan pos kamling RW aktif.</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-rose-700">Target: Lingkungan Aman & Guyub</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#06261D] text-white flex flex-col justify-between shadow-md border border-emerald-900/40">
              <div>
                <span className="text-[10px] font-bold text-[#C5D82F] uppercase">Realisasi Anggaran</span>
                <h4 className="text-base font-black text-white mt-1">Dukungan APBDes 2026</h4>
                <p className="text-xs text-emerald-200 mt-1">Semua misi dibiayai dana resmi desa sebesar Rp 2.85 Miliar.</p>
              </div>
              <a href="/pemerintahan#transparansi" className="inline-flex items-center gap-1.5 text-xs font-black text-[#C5D82F] mt-3 hover:underline">
                <span>Buka Realisasi APBDes</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* GEOGRAFIS */}
        <div id="geografis" className="scroll-mt-36 space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Tata Ruang & Geospasial</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Kondisi Geografis & Batas 4 Penjuru</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm mb-2">U</div>
              <div className="text-[10px] font-bold uppercase text-slate-500">Sebelah Utara</div>
              <div className="text-base font-black text-[#111827] mt-0.5">Kecamatan Waru</div>
              <div className="text-xs text-slate-500 mt-1">Berbatasan Desa Pepelegi & Medaeng. Pintu gerbang Surabaya.</div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm mb-2">S</div>
              <div className="text-[10px] font-bold uppercase text-slate-500">Sebelah Selatan</div>
              <div className="text-base font-black text-[#111827] mt-0.5">Keboansikep</div>
              <div className="text-xs text-slate-500 mt-1">Berbatasan Gedangan pusat. Menuju Alun-alun Sidoarjo.</div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm mb-2">T</div>
              <div className="text-[10px] font-bold uppercase text-slate-500">Sebelah Timur</div>
              <div className="text-base font-black text-[#111827] mt-0.5">Kawasan Bandara Juanda</div>
              <div className="text-xs text-slate-500 mt-1">Berbatasan Sedati Gede & akses tol bandara internasional.</div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm mb-2">B</div>
              <div className="text-[10px] font-bold uppercase text-slate-500">Sebelah Barat</div>
              <div className="text-base font-black text-[#111827] mt-0.5">Lintasan Rel Kereta Api</div>
              <div className="text-xs text-slate-500 mt-1">Berbatasan rel Stasiun Waru-Gedangan & Desa Bohar.</div>
            </div>
          </div>
        </div>

        {/* DEMOGRAFI */}
        <div id="demografi" className="scroll-mt-36 space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Data Kependudukan Semester Terkini</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Statistik Demografi Warga Sawotratap</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl border-2 border-blue-200 bg-blue-50/50 shadow-xs">
              <div className="text-xs font-bold text-blue-900 uppercase">Laki-Laki</div>
              <div className="text-4xl font-black text-blue-700 font-mono mt-1">4.123</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">50.07% dari total populasi</div>
            </div>

            <div className="p-6 rounded-3xl border-2 border-pink-200 bg-pink-50/50 shadow-xs">
              <div className="text-xs font-bold text-pink-900 uppercase">Perempuan</div>
              <div className="text-4xl font-black text-pink-700 font-mono mt-1">4.111</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">49.93% dari total populasi</div>
            </div>

            <div className="p-6 rounded-3xl border-2 border-emerald-200 bg-emerald-50/50 shadow-xs">
              <div className="text-xs font-bold text-emerald-900 uppercase">Usia Produktif</div>
              <div className="text-4xl font-black text-emerald-700 font-mono mt-1">68.2%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">5.618 jiwa usia 15–64 th</div>
            </div>

            <div className="p-6 rounded-3xl border-2 border-purple-200 bg-purple-50/50 shadow-xs">
              <div className="text-xs font-bold text-purple-900 uppercase">Kepala Keluarga</div>
              <div className="text-4xl font-black text-purple-700 font-mono mt-1">3.820</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Tersebar di 11 RW</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}