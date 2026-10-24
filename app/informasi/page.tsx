"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  FileText,
  Calendar,
  Sparkles,
  Search,
  ArrowRight,
  ChevronRight,
  Clock,
  Download,
  Share2,
  Tag,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface BeritaItem {
  id: string;
  kategori: "berita" | "pengumuman" | "agenda";
  judul: string;
  ringkasan: string;
  tanggal: string;
  penulis: string;
  foto: string;
  badge: string;
}

const DAFTAR_BERITA: BeritaItem[] = [
  {
    id: "b1",
    kategori: "berita",
    judul: "Gotong Royong Massal Drainase & Penanaman 300 Pohon RW 01–11",
    ringkasan: "Warga bersama Karang Taruna serentak bersihkan saluran air dan tanam peneduh menyambut musim hujan.",
    tanggal: "22 Okt 2024",
    penulis: "Humas Pemdes",
    foto: "/aset/gotong-royong.jpg",
    badge: "Lingkungan",
  },
  {
    id: "b2",
    kategori: "berita",
    judul: "Pelayanan Mandiri Online: Cetak Surat Pengantar 1x24 Jam Bebas Pungli",
    ringkasan: "Balai Desa hadirkan sistem verifikasi digital terpadu untuk pengurusan administrasi tanpa antre.",
    tanggal: "18 Okt 2024",
    penulis: "PTSP Desa",
    foto: "/aset/pelayanan.jpg",
    badge: "Layanan Publik",
  },
  {
    id: "b3",
    kategori: "berita",
    judul: "Gebyar Pasar Rakyat & Pelatihan Legalitas NIB 150+ UMKM Sawotratap",
    ringkasan: "Fasilitasi sertifikasi halal dan perizinan usaha gratis bagi pedagang kuliner dan perajin lokal.",
    tanggal: "12 Okt 2024",
    penulis: "Pokja UMKM",
    foto: "/aset/umkm-desa.jpg",
    badge: "Ekonomi",
  },
  {
    id: "b4",
    kategori: "berita",
    judul: "Revitalisasi Balai Desa & Pendopo Pertemuan Warga Tuntas",
    ringkasan: "Fasilitas baru ramah disabilitas, ruang laktasi, dan WiFi desa gratis siap digunakan musyawarah warga.",
    tanggal: "05 Okt 2024",
    penulis: "Kaur Perencanaan",
    foto: "/aset/balai-desa.jpg",
    badge: "Infrastruktur",
  },
];

const DAFTAR_PENGUMUMAN = [
  {
    id: "p1",
    nomor: "140/082/2024",
    judul: "Penyaluran BLT Dana Desa Triwulan IV",
    waktu: "28 – 30 Oktober 2024",
    lokasi: "Pendopo Balai Desa",
    syarat: "Bawa KTP & KK Asli",
    status: "Penting / Segera",
    statusColor: "bg-rose-100 text-rose-800 border-rose-300",
  },
  {
    id: "p2",
    nomor: "470/105/2024",
    judul: "Jemput Bola Perekaman KTP-el & IKD Digital",
    waktu: "Setiap Sabtu, 09.00 – 13.00 WIB",
    lokasi: "Balai RW 03 & 07",
    syarat: "Pemula usia 17 th bawa KK & Akta",
    status: "Layanan Terbuka",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "p3",
    nomor: "973/044/2024",
    judul: "Batas Akhir Pelunasan PBB-P2 Tahun 2024",
    waktu: "Batas: 15 November 2024",
    lokasi: "Loket Balai Desa / Bank Jatim",
    syarat: "Bawa SPPT PBB tahun berjalan",
    status: "Batas Waktu",
    statusColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
];

const DAFTAR_AGENDA = [
  {
    tanggal: "28 Okt 2024",
    jam: "19.30 WIB",
    kegiatan: "Malam Sumpah Pemuda & Pentas Seni Karang Taruna",
    lokasi: "Halaman Balai Desa",
  },
  {
    tanggal: "03 Nov 2024",
    jam: "08.00 WIB",
    kegiatan: "Posyandu Balita & Imunisasi Rutin Bebas Stunting",
    lokasi: "Balai RW 02 & 06",
  },
  {
    tanggal: "10 Nov 2024",
    jam: "06.30 WIB",
    kegiatan: "Kerja Bakti 'Minggu Bersih' & Senam Lansia",
    lokasi: "Serentak 11 RW",
  },
  {
    tanggal: "18 Nov 2024",
    jam: "09.00 WIB",
    kegiatan: "Musyawarah Perencanaan Desa (Musrenbangdes 2025)",
    lokasi: "Ruang Rapat Balai Desa",
  },
];

export default function InformasiPage() {
  const [activeTab, setActiveTab] = useState<"berita" | "pengumuman" | "agenda" | "galeri">("berita");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab with URL hash on mount & hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["berita", "pengumuman", "agenda", "galeri"].includes(hash)) {
        setActiveTab(hash as any);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const filteredBerita = DAFTAR_BERITA.filter((item) =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] pt-24 sm:pt-28 pb-20 font-sans">
      
      {/* 1. HERO HEADER INFORMASI */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06261D] via-[#083327] to-[#0A1F17] text-white py-14 sm:py-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#C5D82F]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
            <span>/</span>
            <span className="text-white font-bold">Pusat Informasi</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#064E3B]/80 px-4 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
            <span>Keterbukaan Informasi Publik • Pemerintah Desa Sawotratap</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Warta, Pengumuman & <br />
            <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
              Agenda Komunitas
            </span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
            Kanal rilis resmi: berita pembangunan, surat edaran penting, jadwal posyandu, dan dokumentasi kegiatan warga 11 RW.
          </p>

          {/* Search Box Visual */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita atau pengumuman..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:outline-none focus:border-[#C5D82F] text-xs sm:text-sm backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TAB NAVIGATOR STICKY */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3E8E2] px-6 sm:px-10 lg:px-16 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
          
          <button
            onClick={() => {
              setActiveTab("berita");
              window.history.replaceState(null, "", "#berita");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "berita"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-[#C5D82F]" />
            <span>Warta & Berita</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("pengumuman");
              window.history.replaceState(null, "", "#pengumuman");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "pengumuman"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Papan Edaran Resmi</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("agenda");
              window.history.replaceState(null, "", "#agenda");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "agenda"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal Agenda</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("galeri");
              window.history.replaceState(null, "", "#galeri");
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 ${
              activeTab === "galeri"
                ? "bg-[#064E3B] text-white shadow-sm ring-2 ring-[#C5D82F]/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Galeri Foto</span>
          </button>

        </div>
      </div>

      {/* 3. KONTEN DETAIL INFORMASI */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 space-y-16">
        
        {/* ========================================================= */}
        {/* SECTION 1: WARTA & BERITA TERKINI (#berita) */}
        {/* ========================================================= */}
        {activeTab === "berita" && (
          <section id="berita" className="scroll-mt-36 space-y-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E2]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Kabar Terkini</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Warta & Berita Resmi Desa</h2>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                {filteredBerita.length} Berita Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBerita.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-interactive-2d"
                >
                  <div>
                    {/* Foto Berita */}
                    <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.foto}
                        alt={item.judul}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 rounded-full bg-[#064E3B]/90 backdrop-blur-md px-3 py-1 text-[11px] font-black text-[#C5D82F] border border-[#C5D82F]/30 shadow-md">
                        {item.badge}
                      </div>
                      <div className="absolute bottom-4 right-4 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#C5D82F]" />
                        <span>{item.tanggal}</span>
                      </div>
                    </div>

                    {/* Metadata & Judul */}
                    <div className="p-6">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {item.penulis}
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-[#111827] group-hover:text-[#064E3B] transition-colors leading-snug">
                        {item.judul}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {item.ringkasan}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold">Rilis Resmi Desa</span>
                    <button className="inline-flex items-center gap-1 font-black text-[#064E3B] group-hover:text-emerald-700">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: PAPAN EDARAN RESMI (#pengumuman) */}
        {/* ========================================================= */}
        {activeTab === "pengumuman" && (
          <section id="pengumuman" className="scroll-mt-36 space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Pemberitahuan Warga</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Papan Surat Edaran Resmi</h2>
              </div>
            </div>

            <div className="space-y-4">
              {DAFTAR_PENGUMUMAN.map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-interactive-2d"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        No: {p.nomor}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${p.statusColor}`}>
                        {p.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#111827]">
                      {p.judul}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                      <div><strong className="text-slate-900">Jadwal:</strong> {p.waktu}</div>
                      <div><strong className="text-slate-900">Lokasi:</strong> {p.lokasi}</div>
                      <div><strong className="text-slate-900">Syarat:</strong> {p.syarat}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Salinan resmi edaran No: ${p.nomor} tersedia di Loket Balai Desa Sawotratap.`)}
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black shadow-sm transition-all shine-hover"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Edaran PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: AGENDA RUTIN WARGA (#agenda) */}
        {/* ========================================================= */}
        {activeTab === "agenda" && (
          <section id="agenda" className="scroll-mt-36 space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Jadwal Komunitas</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Agenda Kegiatan Desa</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DAFTAR_AGENDA.map((ag, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between card-interactive-2d"
                >
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ag.tanggal}</span>
                    </div>

                    <h3 className="text-sm font-black text-[#111827] leading-snug">
                      {ag.kegiatan}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{ag.jam}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{ag.lokasi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 4: GALERI DOKUMENTASI (#galeri) */}
        {/* ========================================================= */}
        {activeTab === "galeri" && (
          <section id="galeri" className="scroll-mt-36 space-y-8">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Potret Nyata</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Galeri Dokumentasi Warga & Desa</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs card-interactive-2d">
                <img src="/aset/balai-desa.jpg" alt="Balai Desa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-xs font-black">Kantor Balai Desa Sawotratap</div>
                  <div className="text-[10px] text-slate-300">Gedung PTSP Terpadu</div>
                </div>
              </div>

              <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs card-interactive-2d">
                <img src="/aset/pelayanan.jpg" alt="Pelayanan Warga" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-xs font-black">Pelayanan Loket Mandiri</div>
                  <div className="text-[10px] text-slate-300">Ramah, cepat, bebas pungli</div>
                </div>
              </div>

              <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs card-interactive-2d">
                <img src="/aset/umkm-desa.jpg" alt="Pasar UMKM" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-xs font-black">Pasar & Kuliner UMKM</div>
                  <div className="text-[10px] text-slate-300">Ekonomi kreatif warga 11 RW</div>
                </div>
              </div>

              <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs card-interactive-2d">
                <img src="/aset/gotong-royong.jpg" alt="Gotong Royong" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-xs font-black">Kerja Bakti Lingkungan RW</div>
                  <div className="text-[10px] text-slate-300">Budaya gotong royong warga asri</div>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
