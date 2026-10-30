"use client";

import React, { useState, useEffect } from "react";
import BaganHierarkiSection from "../components/bagan-hierarki";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  BadgeCheck,
  Quote,
  Sparkles,
  Users,
  ChevronRight,
  PhoneCall,
  FileText,
  Home,
} from "lucide-react";

interface PerangkatItem {
  nama: string;
  jabatan: string;
  kategori: string;
  sub: string;
  avatarColor: string;
  tagColor: string;
  tags: string[];
  telepon: string;
  foto?: string;
}

const DAFTAR_PERANGKAT: PerangkatItem[] = [
  {
    nama: "H. Bambang Sutrisno, S.T.",
    jabatan: "Kepala Desa",
    kategori: "Pimpinan",
    sub: "Pimpinan Tertinggi & Penanggung Jawab",
    avatarColor: "from-emerald-700 to-teal-900",
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    tags: ["Kebijakan Desa", "Penyelenggara APBDes", "Pengayom 11 RW"],
    telepon: "0812-3456-7890",
    foto: "/aset/kades.jpg",
  },
  {
    nama: "Dra. Siti Rahmawati",
    jabatan: "Sekretaris Desa (Sekdes)",
    kategori: "Sekretariat",
    sub: "Koordinator Sekretariat & Administrasi",
    avatarColor: "from-blue-600 to-indigo-800",
    tagColor: "bg-blue-50 text-blue-800 border-blue-200",
    tags: ["Pengendali Administrasi", "Verifikasi RKPDes", "PNS Pamong"],
    telepon: "0812-3456-7891",
  },
  {
    nama: "Ahmad Zainuri, S.E.",
    jabatan: "Kaur Keuangan",
    kategori: "Kaur",
    sub: "Bendahara & Pengelolaan APBDes",
    avatarColor: "from-emerald-600 to-teal-800",
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    tags: ["Pagu Rp 2.85 M", "Realisasi Kas", "SPJ Keuangan RW"],
    telepon: "0812-3456-7892",
  },
  {
    nama: "M. Choirul Anam, S.Pd.",
    jabatan: "Kaur Perencanaan",
    kategori: "Kaur",
    sub: "Pembangunan & Perencanaan Desa",
    avatarColor: "from-amber-600 to-orange-800",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    tags: ["RKPDes 2025", "Musrenbang Dusun", "Peta Proyek Fisik"],
    telepon: "0812-3456-7893",
  },
  {
    nama: "Nurul Hidayati",
    jabatan: "Kaur TU & Umum",
    kategori: "Kaur",
    sub: "Aset & Rumah Tangga Desa",
    avatarColor: "from-purple-600 to-indigo-800",
    tagColor: "bg-purple-50 text-purple-800 border-purple-200",
    tags: ["Inventaris Balai", "Agenda Surat Masuk", "Logistik PTSP"],
    telepon: "0812-3456-7894",
  },
  {
    nama: "Ir. Joko Prasetyo",
    jabatan: "Kasi Pemerintahan",
    kategori: "Kasi",
    sub: "Hukum, Trantib & Kependudukan",
    avatarColor: "from-sky-600 to-blue-800",
    tagColor: "bg-sky-50 text-sky-800 border-sky-200",
    tags: ["KTP-el & KK", "Peraturan Desa", "Linmas & Siskamling"],
    telepon: "0812-3456-7895",
  },
  {
    nama: "Sulistiyowati, S.Sos.",
    jabatan: "Kasi Kesejahteraan",
    kategori: "Kasi",
    sub: "Sosial, Pemberdayaan & Ekonomi",
    avatarColor: "from-rose-600 to-pink-800",
    tagColor: "bg-rose-50 text-rose-800 border-rose-200",
    tags: ["Penyaluran BLT", "Bebas Stunting", "Pavingisasi RW"],
    telepon: "0812-3456-7896",
  },
  {
    nama: "Budi Santoso, S.Kom.",
    jabatan: "Kasi Pelayanan",
    kategori: "Kasi",
    sub: "Digital, PTSP & Aspirasi Warga",
    avatarColor: "from-teal-600 to-emerald-800",
    tagColor: "bg-teal-50 text-teal-800 border-teal-200",
    tags: ["Surat 1 Hari", "Loket Mandiri", "Meja Aduan WA"],
    telepon: "0812-3456-7897",
  },
];

const DAFTAR_BPD = [
  {
    nama: "H. Moh. Sholeh, S.H.",
    jabatan: "Ketua BPD",
    kategori: "Pimpinan BPD",
    deskripsi: "Memimpin pengawasan kebijakan desa dan menampung aspirasi masyarakat 11 RW.",
    telepon: "0812-9876-5431",
  },
  {
    nama: "Dra. Hj. Lailatul Badriyah",
    jabatan: "Wakil Ketua BPD",
    kategori: "Pimpinan BPD",
    deskripsi: "Mengkoordinasikan bidang legislasi peraturan desa dan evaluasi APBDes.",
    telepon: "0812-9876-5432",
  },
  {
    nama: "Drs. H. M. Zainal Arifin",
    jabatan: "Sekretaris BPD",
    kategori: "Sekretariat",
    deskripsi: "Mengelola administrasi persidangan, risalah rapat, dan dokumentasi produk hukum desa.",
    telepon: "0812-9876-5433",
  },
  {
    nama: "Ahmad Fauzi, S.Pd.",
    jabatan: "Anggota Bidang Pemerintahan",
    kategori: "Komisi Pengawasan",
    deskripsi: "Mengawasi penyelenggaraan pemerintahan, pelayanan publik, dan tertib administrasi kependudukan.",
    telepon: "0812-9876-5434",
  },
  {
    nama: "Siti Aminah, S.E.",
    jabatan: "Anggota Bidang Pembangunan",
    kategori: "Komisi Pengawasan",
    deskripsi: "Mengawasi pelaksanaan proyek fisik infrastruktur, drainase, dan RKPDes tahun berjalan.",
    telepon: "0812-9876-5435",
  },
  {
    nama: "Rizal Effendi, S.T.",
    jabatan: "Anggota Bidang Kemasyarakatan",
    kategori: "Komisi Pengawasan",
    deskripsi: "Mengawal program pemberdayaan sosial, pemuda, karang taruna, dan kesejahteraan warga.",
    telepon: "0812-9876-5436",
  },
];

export default function PemerintahanPage() {
  const [activeSection, setActiveSection] = useState("struktur");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["struktur", "perangkat", "bpd"];
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredPerangkat = DAFTAR_PERANGKAT.filter(
    (item) => kategoriFilter === "Semua" || item.kategori === kategoriFilter
  );

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] font-sans">
      
      {/* 1. HERO HEADER PEMERINTAHAN (Background 1 Warna Hijau Gelap Solid, Tanpa Glow/Shadow) */}
      <section className="relative overflow-hidden bg-[#06261D] text-white pt-36 sm:pt-44 pb-14 sm:pb-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Breadcrumb Clean Style (Tanpa Box) */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
            <span>/</span>
            <span className="text-white font-bold">Pemerintahan Desa</span>
          </div>

          {/* JUDUL UTAMA */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Struktur Organisasi & <br />
              <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
                Aparatur Pemdes Sawotratap
              </span>
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
              Informasi lengkap mengenai bagan struktur kepengurusan desa, profil perangkat desa aktif, serta mitra pengawasan Badan Permusyawaratan Desa (BPD).
            </p>
          </div>

          {/* KAPSUL STATUS (1 Warna Menyatu dengan Background) */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#06261D] border border-[#C5D82F]/30 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#083327] border border-[#C5D82F]/40 flex items-center justify-center shrink-0 text-[#C5D82F]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5D82F] shrink-0" />
                  <span className="text-xs font-black tracking-wider text-[#C5D82F] uppercase">
                    Pemerintah Desa Sawotratap
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-100/80">
                  Transparan, Akuntabel & Komitmen Melayani Warga Sepenuh Hati.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5D82F]/20 text-[#C5D82F] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300">Pusat Layanan</div>
                <div className="text-sm font-black text-white">1 Balai PTSP</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300 uppercase">Aparatur Pamong</div>
                <div className="text-sm font-black text-white">8 Pejabat Aktif</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300">Mitra Pengawasan</div>
                <div className="text-sm font-black text-white">6 Pimpinan BPD</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-300">Status Desa</div>
                <div className="text-sm font-black text-[#C5D82F]">Desa Mandiri</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY JUMP-TO NAVIGATION BAR (Disamakan seperti Profil: Kapsul di Tengah, Tanpa Kotak Luar) */}
      <div className="sticky top-20 z-30 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => scrollToSection("struktur")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "struktur"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Struktur Organisasi</span>
          </button>

          <button
            onClick={() => scrollToSection("perangkat")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "perangkat"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Perangkat Desa</span>
          </button>

          <button
            onClick={() => scrollToSection("bpd")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "bpd"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>BPD (Badan Permusyawaratan Desa)</span>
          </button>

        </div>
      </div>

      {/* 3. KONTEN LONG-SCROLL KE BAWAH */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12 space-y-28 pb-24">
        
        {/* ========================================================= */}
        {/* SECTION 1: STRUKTUR ORGANISASI (#struktur) */}
        {/* ========================================================= */}
        <div id="struktur" className="scroll-mt-36 space-y-12">
          
          <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tata Kelola Pemerintahan</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Struktur Organisasi Desa Sawotratap</h2>
            </div>
          </div>

          {/* SAMBUTAN KEPALA DESA (Banner disamakan 1 warna solid hijau gelap) */}
          <div className="rounded-3xl bg-[#06261D] text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-emerald-900/40 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="relative w-60 h-72 sm:h-80 rounded-3xl overflow-hidden border-2 border-[#C5D82F] shadow-2xl bg-black/60">
                    <img
                      src="/aset/kades.jpg"
                      alt="H. Bambang Sutrisno, S.T."
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 inset-x-3 text-center">
                      <span className="inline-block bg-[#064E3B]/90 backdrop-blur-md border border-[#C5D82F]/50 px-3 py-1 rounded-full text-[10px] font-black text-[#C5D82F] uppercase tracking-wider mb-1">
                        Pimpinan Tertinggi
                      </span>
                      <div className="text-base font-black text-white">H. Bambang Sutrisno, S.T.</div>
                      <div className="text-xs font-bold text-emerald-300">Kepala Desa Sawotratap</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#083327] border border-[#C5D82F]/30 px-3.5 py-1 text-xs font-black text-[#C5D82F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5D82F]" />
                  <span>Sambutan Kepala Desa Sawotratap</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  &ldquo;Melayani dengan Hati, Bekerja dengan Bukti, Membangun Sawotratap Mandiri!&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
                  Pemerintahan Desa Sawotratap berkomitmen penuh memberikan pelayanan publik yang cepat, transparan, dan akuntabel. Melalui sistem pelayanan digital terintegrasi, warga dapat mengurus administrasi kependudukan tanpa hambatan birokrasi yang rumit.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Pak%20Kades%20Sawotratap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black shadow-md transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* BAGAN VISUAL STRUKTUR HIERARKI (DIAGRAM DI KIRI, PENJELASAN DI KANAN) */}
          <BaganHierarkiSection />

        </div>

        {/* ========================================================= */}
        {/* SECTION 2: PERANGKAT DESA (#perangkat) */}
        {/* ========================================================= */}
        <div id="perangkat" className="scroll-mt-36 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Aparatur Desa</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Daftar Perangkat Desa Aktif</h2>
              </div>
            </div>

            {/* FILTER KATEGORI */}
            <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
              {["Semua", "Pimpinan", "Sekretariat", "Kaur", "Kasi"].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setKategoriFilter(kat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    kategoriFilter === kat ? "bg-white text-[#064E3B] shadow-xs font-extrabold" : "text-slate-600"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerangkat.map((p, idx) => (
              <div key={idx} className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.avatarColor} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                      {p.nama.slice(0, 2)}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {p.kategori}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.sub}</span>
                    <h3 className="text-base font-black text-[#111827] group-hover:text-[#064E3B] transition-colors mt-0.5">{p.nama}</h3>
                    <div className="text-xs font-bold text-emerald-700">{p.jabatan}</div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map((t, tIdx) => (
                      <span key={tIdx} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${p.tagColor}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-slate-500">{p.telepon}</span>
                  <a
                    href={`https://wa.me/62${p.telepon.replace(/\D/g, "").slice(1)}?text=Halo%20${encodeURIComponent(p.jabatan)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-black transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ========================================================= */}
        {/* SECTION 3: BPD & LEMBAGA DESA (#bpd) */}
        {/* ========================================================= */}
        <div id="bpd" className="scroll-mt-36 space-y-8">
          
          <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Mitra Pengawasan Warga</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Badan Permusyawaratan Desa (BPD)</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAFTAR_BPD.map((b, idx) => (
              <div key={idx} className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
                <div className="space-y-3">
                  <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {b.kategori}
                  </span>
                  <div>
                    <h3 className="text-base font-black text-[#111827] group-hover:text-amber-800 transition-colors">{b.nama}</h3>
                    <div className="text-xs font-bold text-amber-700">{b.jabatan}</div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.deskripsi}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-slate-500">{b.telepon}</span>
                  <a
                    href={`https://wa.me/62${b.telepon.replace(/\D/g, "").slice(1)}?text=Halo%20${encodeURIComponent(b.jabatan)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Kontak BPD</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}