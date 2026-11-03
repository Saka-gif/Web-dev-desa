"use client";

import React, { useState, useEffect } from "react";
import { DAFTAR_BERITA, BeritaItem } from "@/app/data/berita";
import { supabase } from "@/lib/supabase";
import {
  Megaphone,
  FileText,
  Calendar,
  Sparkles,
  Search,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  ShieldCheck,
  X,
  Share2,
  Check,
  User,
  BookOpen,
} from "lucide-react";

interface PengumumanItem {
  id: string;
  nomor: string;
  judul: string;
  waktu: string;
  lokasi: string;
  syarat: string;
  status: string;
  statusColor?: string;
  status_color?: string;
}

interface AgendaItem {
  id?: string;
  tanggal: string;
  jam: string;
  kegiatan: string;
  lokasi: string;
}

const DAFTAR_PENGUMUMAN_FALLBACK: PengumumanItem[] = [
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

const DAFTAR_AGENDA_FALLBACK: AgendaItem[] = [
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
  const [activeSection, setActiveSection] = useState("berita");
  const [searchQuery, setSearchQuery] = useState("");
  const [daftarBerita, setDaftarBerita] = useState<BeritaItem[]>(DAFTAR_BERITA);
  const [daftarPengumuman, setDaftarPengumuman] = useState<PengumumanItem[]>(DAFTAR_PENGUMUMAN_FALLBACK);
  const [daftarAgenda, setDaftarAgenda] = useState<AgendaItem[]>(DAFTAR_AGENDA_FALLBACK);

  // State Modal Detail Berita Lengkap
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadDataFromSupabase = async () => {
    try {
      const [resBerita, resPengumuman, resAgenda] = await Promise.all([
        supabase.from("berita").select("*").order("id", { ascending: true }),
        supabase.from("pengumuman").select("*").order("id", { ascending: true }),
        supabase.from("agenda").select("*").order("id", { ascending: true }),
      ]);

      if (!resBerita.error && resBerita.data && resBerita.data.length > 0) {
        const enriched = resBerita.data.map((item: BeritaItem) => {
          const fallback = DAFTAR_BERITA.find((b) => b.id === item.id);
          return {
            ...item,
            konten: item.konten || fallback?.konten || item.ringkasan,
          };
        });
        setDaftarBerita(enriched);
      }
      if (!resPengumuman.error && resPengumuman.data && resPengumuman.data.length > 0) {
        setDaftarPengumuman(
          resPengumuman.data.map((p) => ({
            ...p,
            statusColor: p.status_color || p.statusColor || "bg-emerald-100 text-emerald-800 border-emerald-300",
          }))
        );
      }
      if (!resAgenda.error && resAgenda.data && resAgenda.data.length > 0) {
        setDaftarAgenda(resAgenda.data);
      }
    } catch (err) {
      console.warn("Gagal memuat data dari Supabase, menggunakan data lokal:", err);
    }
  };

  // Cek parameter ?berita=id di URL agar berita langsung terbuka
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const beritaId = urlParams.get("berita");
      if (beritaId) {
        const found = daftarBerita.find((b) => b.id === beritaId);
        if (found) {
          setSelectedBerita(found);
        }
      }
    }
  }, [daftarBerita]);

  const handleOpenBerita = (item: BeritaItem) => {
    setSelectedBerita(item);
    setCopiedLink(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("berita", item.id);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleCloseBerita = () => {
    setSelectedBerita(null);
    setCopiedLink(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("berita");
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && selectedBerita) {
      const shareUrl = `${window.location.origin}/informasi?berita=${selectedBerita.id}#berita`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  useEffect(() => {
    loadDataFromSupabase();

    const channel = supabase
      .channel("realtime-informasi-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "berita" }, () => loadDataFromSupabase())
      .on("postgres_changes", { event: "*", schema: "public", table: "pengumuman" }, () => loadDataFromSupabase())
      .on("postgres_changes", { event: "*", schema: "public", table: "agenda" }, () => loadDataFromSupabase())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["berita", "pengumuman", "agenda", "galeri"];
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

  const filteredBerita = daftarBerita.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] font-sans">
      
      {/* 1. HERO HEADER INFORMASI (Background 1 Warna Hijau Gelap Solid, Tanpa Glow/Shadow) */}
      <section className="relative overflow-hidden bg-[#06261D] text-white pt-36 sm:pt-44 pb-14 sm:pb-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
            <span>/</span>
            <span className="text-white font-bold">Pusat Informasi</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Warta, Pengumuman & <br />
              <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
                Agenda Komunitas
              </span>
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
              Kanal rilis resmi: berita pembangunan, surat edaran penting, jadwal posyandu, dan dokumentasi kegiatan warga 11 RW.
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
                    Keterbukaan Informasi Publik
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-100/80">
                  Pemerintah Desa Sawotratap • Transparan, Akurat & Terpercaya.
                </p>
              </div>
            </div>
          </div>

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

      {/* 2. STICKY JUMP-TO NAVIGATION BAR (Disamakan Kapsul di Tengah, Tanpa Kotak Luar) */}
      <div className="sticky top-20 z-30 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => scrollToSection("berita")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "berita"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Warta & Berita</span>
          </button>

          <button
            onClick={() => scrollToSection("pengumuman")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "pengumuman"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Papan Edaran Resmi</span>
          </button>

          <button
            onClick={() => scrollToSection("agenda")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "agenda"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Jadwal Agenda</span>
          </button>

          <button
            onClick={() => scrollToSection("galeri")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm ${
              activeSection === "galeri"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Galeri Foto</span>
          </button>

        </div>
      </div>

      {/* 3. KONTEN BERDERET KE BAWAH (LONG SCROLL SATU HALAMAN) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-12 space-y-28 pb-24">
        
        {/* ========================================================= */}
        {/* SECTION 1: WARTA & BERITA TERKINI (#berita) */}
        {/* ========================================================= */}
        <div id="berita" className="scroll-mt-36 space-y-8">
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
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              {filteredBerita.length} Berita Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBerita.map((item) => (
              <article
                key={item.id}
                onClick={() => handleOpenBerita(item)}
                className="rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBerita(item);
                    }}
                    className="inline-flex items-center gap-1 font-black text-[#064E3B] group-hover:text-emerald-700 cursor-pointer"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: PAPAN EDARAN RESMI (#pengumuman) */}
        {/* ========================================================= */}
        <div id="pengumuman" className="scroll-mt-36 space-y-8">
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
            {daftarPengumuman.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
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
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Edaran PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: AGENDA RUTIN WARGA (#agenda) */}
        {/* ========================================================= */}
        <div id="agenda" className="scroll-mt-36 space-y-8">
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
            {daftarAgenda.map((ag, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
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
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: GALERI DOKUMENTASI (#galeri) */}
        {/* ========================================================= */}
        <div id="galeri" className="scroll-mt-36 space-y-8">
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
            <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs">
              <img src="/aset/balai-desa.jpg" alt="Balai Desa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="text-xs font-black">Kantor Balai Desa Sawotratap</div>
                <div className="text-[10px] text-slate-300">Gedung PTSP Terpadu</div>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs">
              <img src="/aset/pelayanan.jpg" alt="Pelayanan Warga" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="text-xs font-black">Pelayanan Loket Mandiri</div>
                <div className="text-[10px] text-slate-300">Ramah, cepat, bebas pungli</div>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs">
              <img src="/aset/umkm-desa.jpg" alt="Pasar UMKM" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="text-xs font-black">Pasar & Kuliner UMKM</div>
                <div className="text-[10px] text-slate-300">Ekonomi kreatif warga 11 RW</div>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden h-64 border border-[#E3E8E2] shadow-xs">
              <img src="/aset/gotong-royong.jpg" alt="Gotong Royong" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="text-xs font-black">Kerja Bakti Lingkungan RW</div>
                <div className="text-[10px] text-slate-300">Budaya gotong royong warga asri</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* POPUP MODAL BACA BERITA LENGKAP */}
      {selectedBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header Sticky / Tombol Tutup */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-xs z-10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedBerita.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Warta Resmi Desa Sawotratap</span>
              </div>
              <button
                type="button"
                onClick={handleCloseBerita}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup berita"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Foto Cover Berita */}
              <div className="relative rounded-2xl overflow-hidden aspect-video w-full bg-slate-100 shadow-md">
                <img
                  src={selectedBerita.foto}
                  alt={selectedBerita.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-[#C5D82F]" />
                  <span>{selectedBerita.tanggal}</span>
                </div>
              </div>

              {/* Meta Penulis & Tanggal */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{selectedBerita.penulis}</span>
                </div>
                <span>•</span>
                <span>Dipublikasikan {selectedBerita.tanggal}</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Kategori: {selectedBerita.badge}</span>
              </div>

              {/* Judul Berita Utama */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                {selectedBerita.judul}
              </h1>

              {/* Lead Paragraph / Ringkasan Highlight */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border-l-4 border-emerald-700 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
                "{selectedBerita.ringkasan}"
              </div>

              {/* Isi Teks Berita Lengkap */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                {(selectedBerita.konten || selectedBerita.ringkasan)
                  .split("\n\n")
                  .map((paragraf, pIdx) => (
                    <p key={pIdx} className="text-justify font-normal leading-relaxed">
                      {paragraf}
                    </p>
                  ))}
              </div>

              {/* Footer Modal: Tombol Aksi */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Tautan Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-500" />
                      <span>Bagikan / Salin Tautan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCloseBerita}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Tutup Berita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}