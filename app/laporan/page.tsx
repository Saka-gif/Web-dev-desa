"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Wrench,
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Download,
  ExternalLink,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Eye,
  PlusCircle,
  X,
  Phone,
  Building2,
  Info,
  RefreshCw,
  Home,
  Check,
  AlertTriangle,
  FileBadge,
} from "lucide-react";

// Tipe Data Surat
interface BerkasLampiran {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

interface SuratUserItem {
  id: string;
  jenis_surat: string;
  keperluan: string;
  tanggal_pengajuan: string;
  status: string;
  step: number; // 1 - 4
  status_color: string;
  estimasi_selesai: string;
  catatan: string;
  nomor_surat?: string;
  berkas: BerkasLampiran[];
  nama_pemohon?: string;
  nik_pemohon?: string;
}

// Tipe Data Laporan Kerusakan
interface LaporanKerusakanItem {
  id: string;
  kategori: string;
  judul_masalah: string;
  lokasi: string;
  tanggal_lapor: string;
  status: "Menunggu Peninjauan" | "Inspeksi Lapangan" | "Dalam Perbaikan" | "Tuntas Selesai";
  step: number; // 1 - 4
  status_color: string;
  foto_url: string;
  catatan_petugas: string;
  penanggung_jawab: string;
  uraian: string;
}

// Tipe Data Perizinan Warga
interface PerizinanItem {
  id: string;
  jenis_izin: string;
  nama_kegiatan: string;
  lokasi_kegiatan: string;
  tanggal_pelaksanaan: string;
  tanggal_pengajuan: string;
  status: "Verifikasi Berkas" | "Pemeriksaan Lapangan" | "Rekomendasi Terbit" | "Izin Disetujui";
  step: number; // 1 - 4
  status_color: string;
  nomor_izin?: string;
  penanggung_jawab: string;
  persyaratan: string[];
  catatan: string;
}

export default function LaporanWargaPage() {
  // State Tab Utama: 'surat' | 'kerusakan' | 'perizinan'
  const [activeTab, setActiveTab] = useState<"surat" | "kerusakan" | "perizinan">("surat");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; nik?: string } | null>(null);

  // State Live Database Surat
  const [isLoadingSurat, setIsLoadingSurat] = useState(true);

  // State Modal Detail
  const [selectedSurat, setSelectedSurat] = useState<SuratUserItem | null>(null);
  const [selectedKerusakan, setSelectedKerusakan] = useState<LaporanKerusakanItem | null>(null);
  const [selectedPerizinan, setSelectedPerizinan] = useState<PerizinanItem | null>(null);

  // 1. DATA PENGAJUAN SURAT WARGA (Hanya milik user)
  const [daftarSurat, setDaftarSurat] = useState<SuratUserItem[]>([
    {
      id: "SWT-2026-8842",
      jenis_surat: "Surat Keterangan Tidak Mampu (SKTM)",
      keperluan: "Pengajuan beasiswa Kartu Indonesia Pintar Kuliah (KIP-K) di PTN.",
      tanggal_pengajuan: "28 Oktober 2026",
      status: "Antrean Verifikasi",
      step: 1,
      status_color: "bg-amber-100 text-amber-800 border-amber-300",
      estimasi_selesai: "1 x 24 Jam Kerja",
      catatan: "Berkas fotokopi KK, KTP, dan Pengantar RT/RW telah diterima loket PTSP Balai Desa.",
      nama_pemohon: "Hadi Purnomo",
      nik_pemohon: "3515082103900001",
      berkas: [
        { name: "KTP_Pemohon_Hadi.pdf", url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/gotong-royong.jpg", size: 145000, type: "application/pdf" },
        { name: "Kartu_Keluarga.pdf", url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg", size: 230000, type: "application/pdf" },
        { name: "Pengantar_RT02_RW03.jpg", url: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/balai-desa.jpg", size: 98000, type: "image/jpeg" },
      ],
    },
  ]);

  // Fungsi Fetch Data Asli Surat Langsung dari Supabase API (Khusus Surat Milik Pemohon Sendiri)
  const fetchSuratLive = async () => {
    try {
      setIsLoadingSurat(true);
      const res = await fetch("/api/admin/surat");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // HANYA ambil data surat milik pemohon yang sedang aktif (Hadi Purnomo)
        const userOnlyRaw = json.data.filter((item: any) => {
          const userFirst = (currentUser?.name || "Hadi").toLowerCase().split(" ")[0];
          const matchName = Boolean(item.nama_pemohon && item.nama_pemohon.toLowerCase().includes(userFirst));
          const matchNik = Boolean(currentUser?.nik && item.nik_pemohon && item.nik_pemohon === currentUser.nik);
          return matchName || matchNik;
        });

        const targetData =
          userOnlyRaw.length > 0
            ? userOnlyRaw
            : json.data.filter((item: any) => item.nama_pemohon?.toLowerCase().includes("hadi"));

        const mapped: SuratUserItem[] = targetData.map((item: any) => {
          const berkas = Array.isArray(item.berkas_urls)
            ? item.berkas_urls.map((b: any) => ({
                name: b.name || "Berkas_Lampiran.pdf",
                url: b.url || "#",
                size: b.size || 150000,
                type: b.type || "application/pdf",
              }))
            : [];

          let tgl = "Terbaru";
          if (item.created_at) {
            const d = new Date(item.created_at);
            tgl = d.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          }

          return {
            id: item.id,
            jenis_surat: item.jenis_surat,
            keperluan: item.keperluan || "Keperluan permohonan administrasi warga.",
            tanggal_pengajuan: tgl,
            status: item.status || "Antrean Verifikasi",
            step: typeof item.step === "number" ? item.step : 1,
            status_color: item.status_color || "bg-amber-100 text-amber-800 border-amber-300",
            estimasi_selesai: item.estimasi_selesai || "1 x 24 Jam Kerja",
            catatan: item.catatan || "Permohonan dalam antrean pelayanan balai desa.",
            nomor_surat: item.nomor_surat,
            berkas: berkas,
            nama_pemohon: item.nama_pemohon,
            nik_pemohon: item.nik_pemohon,
          };
        });

        setDaftarSurat(mapped);
      }
    } catch (err) {
      console.error("Gagal memuat data surat asli dari database:", err);
    } finally {
      setIsLoadingSurat(false);
    }
  };

  // Ambil profil user login dan jalankan sinkronisasi database
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sawotratap_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      } else {
        setCurrentUser({
          name: "Hadi Purnomo",
          role: "user",
          nik: "3515082103900001",
        });
      }
    } catch {
      // ignore
    }

    // Ambil data surat asli dari Supabase
    fetchSuratLive();
  }, []);

  // 2. DATA LAPORAN KERUSAKAN & PENGADUAN FASILITAS LINGKUNGAN
  const [daftarKerusakan, setDaftarKerusakan] = useState<LaporanKerusakanItem[]>([
    {
      id: "ADU-2026-4192",
      kategori: "Infrastruktur Jalan Lingkungan",
      judul_masalah: "Jalan Aspal Berlubang Cukup Dalam Pasca Hujan Deras",
      lokasi: "Jl. Sawotratap Barat Gang 3, Depan Musholla Al-Ikhlas (RW 04)",
      tanggal_lapor: "26 Oktober 2026",
      uraian: "Terdapat lubang berdiameter sekitar 80 cm dengan kedalaman 10 cm yang membahayakan pengendara motor, terutama saat malam hari karena genangan air.",
      status: "Dalam Perbaikan",
      step: 3,
      status_color: "bg-purple-100 text-purple-800 border-purple-300",
      foto_url: "/aset/pedesaan.jpg",
      catatan_petugas: "Tim Seksi Pembangunan Balai Desa bersama Dinas PUPR telah mengalokasikan material aspal coldmix. Penambalan sedang berjalan.",
      penanggung_jawab: "Seksi Pembangunan Desa & Tim Lapangan RW 04",
    },
    {
      id: "ADU-2026-3981",
      kategori: "Penerangan Jalan Umum (PJU)",
      judul_masalah: "Lampu Penerangan PJU Padam Mengakibatkan Jalan Gelap",
      lokasi: "Pertigaan Jl. Gelatik Menuju RW 03 RT 02",
      tanggal_lapor: "19 Oktober 2026",
      uraian: "Lampu tiang PJU sudah mati sejak 4 hari lalu, membuat akses jalan warga gelap gulita dan rawan kecelakaan.",
      status: "Tuntas Selesai",
      step: 4,
      status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      foto_url: "/aset/balai-desa.jpg",
      catatan_petugas: "Petugas teknis desa telah mengganti modul lampu LED 60 Watt baru. Penerangan sudah normal kembali.",
      penanggung_jawab: "Sarpras Balai Desa Sawotratap",
    },
    {
      id: "ADU-2026-3720",
      kategori: "Saluran Drainase & Banjir",
      judul_masalah: "Saluran Air Tersumbat Sedimen Lumpur & Sampah Liar",
      lokasi: "Saluran Sekunder RW 01 Samping Lapangan Voli",
      tanggal_lapor: "15 Oktober 2026",
      uraian: "Aliran air tersendat saat hujan lebat mengakibatkan luapan air ke teras rumah warga sekitar.",
      status: "Tuntas Selesai",
      step: 4,
      status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      foto_url: "/aset/gotong-royong.jpg",
      catatan_petugas: "Kerja bakti pembersihan gorong-gorong dan pengangkutan endapan lumpur telah tuntas dilaksanakan bersama warga.",
      penanggung_jawab: "Pokja Kebersihan Lingkungan RW 01",
    },
  ]);

  // 3. DATA PENGAJUAN PERIZINAN WARGA
  const [daftarPerizinan, setDaftarPerizinan] = useState<PerizinanItem[]>([
    {
      id: "IZN-2026-1024",
      jenis_izin: "Surat Rekomendasi Izin Keramaian & Hajatan Warga",
      nama_kegiatan: "Resepsi Pernikahan & Doa Bersama Warga Lingkungan",
      lokasi_kegiatan: "Halaman Tempat Tinggal Pemohon (Jl. Kenari No. 14, RT 03 RW 03)",
      tanggal_pelaksanaan: "15 November 2026 (09.00 - 21.00 WIB)",
      tanggal_pengajuan: "22 Oktober 2026",
      status: "Izin Disetujui",
      step: 4,
      status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      nomor_izin: "300 / 042 / 404.7.2.14 / KRM / 2026",
      penanggung_jawab: "Hadi Purnomo (Pemohon Utama)",
      persyaratan: [
        "Surat Pengantar Ketua RT 03 & RW 03",
        "Pernyataan Persetujuan Tetangga Sekitar (Kiri, Kanan, Depan)",
        "Kesepakatan Jam Berakhir Musik Maksimal 22.00 WIB",
        "Koordinasi Linmas & Keamanan Setempat",
      ],
      catatan: "Rekomendasi izin keramaian desa telah terbit dan diteruskan tembusan ke Polsek Gedangan dan Koramil.",
    },
    {
      id: "IZN-2026-0941",
      jenis_izin: "Izin Penutupan Sebagian Jalan Lingkungan (Pemasangan Tenda)",
      nama_kegiatan: "Tenda Tasyakuran Khitanan & Pengajian Warga",
      lokasi_kegiatan: "Jl. Sawotratap Gang 2 (Menyisakan 1 Lajur Sepeda Motor)",
      tanggal_pelaksanaan: "08 November 2026",
      tanggal_pengajuan: "25 Oktober 2026",
      status: "Pemeriksaan Lapangan",
      step: 2,
      status_color: "bg-blue-100 text-blue-800 border-blue-300",
      penanggung_jawab: "Hadi Purnomo & Pengurus RT 03",
      persyaratan: [
        "Peta Denah Jalur Alternatif Kendaraan",
        "Pemasangan Rambu Petunjuk Arah",
        "Petugas Pengatur Lalu Lintas Lingkungan dari Linmas",
      ],
      catatan: "Babinsa dan Trantib Desa mengonfirmasi survei jalur alternatif jalan pada 31 Oktober 2026.",
    },
    {
      id: "IZN-2026-0815",
      jenis_izin: "Surat Izin Rekomendasi Tempat Usaha Mikro (NIB)",
      nama_kegiatan: "Legalitas Usaha Kedai Kuliner Tradisional Sawotratap",
      lokasi_kegiatan: "Sentra Kuliner Pujasera Warga RT 02 RW 03",
      tanggal_pelaksanaan: "Berlaku Tetap (Kegiatan Usaha Berkelanjutan)",
      tanggal_pengajuan: "10 Oktober 2026",
      status: "Izin Disetujui",
      step: 4,
      status_color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      nomor_izin: "503 / 115 / 404.7.2.14 / IUMK / 2026",
      penanggung_jawab: "Hadi Purnomo (Pemilik Usaha)",
      persyaratan: [
        "Fotokopi KTP & Kartu Keluarga",
        "Foto Tempat Usaha & Produk",
        "Surat Keterangan Lokasi Usaha dari RT/RW",
      ],
      catatan: "Surat rekomendasi usaha telah divalidasi dan terdaftar di direktori UMKM Binaan Desa Sawotratap.",
    },
  ]);

  // Filter pencarian & status untuk Surat (Hanya milik pemohon aktif)
  const filteredSurat = daftarSurat.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jenis_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keperluan.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "semua") return matchSearch;
    if (statusFilter === "selesai") return matchSearch && (item.step === 4 || item.status.includes("Terbit") || item.status.includes("Selesai"));
    if (statusFilter === "proses") return matchSearch && item.step >= 1 && item.step <= 3;
    return matchSearch;
  });

  // Filter pencarian & status untuk Kerusakan
  const filteredKerusakan = daftarKerusakan.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.judul_masalah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "semua") return matchSearch;
    if (statusFilter === "selesai") return matchSearch && item.step === 4;
    if (statusFilter === "proses") return matchSearch && item.step >= 1 && item.step <= 3;
    return matchSearch;
  });

  // Filter pencarian & status untuk Perizinan
  const filteredPerizinan = daftarPerizinan.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jenis_izin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi_kegiatan.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "semua") return matchSearch;
    if (statusFilter === "selesai") return matchSearch && item.step === 4;
    if (statusFilter === "proses") return matchSearch && item.step >= 1 && item.step <= 3;
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] font-sans pb-24">
      {/* 1. HERO HEADER LAPORAN RESMI WARGA (1 WARNA SOLID #06261D) */}
      <section className="relative bg-[#06261D] text-white pt-36 sm:pt-40 pb-16 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60 shadow-sm">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb navigasi */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            <Link href="/" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-[#C5D82F]">Pusat Riwayat Laporan Warga</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Kolom Kiri: Judul & Keterangan */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B3D30] border border-emerald-800 text-[#C5D82F] text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-pulse" />
                <span>Pelayanan Mandiri Kependudukan Terpadu</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Pusat Riwayat & <span className="text-[#C5D82F]">Laporan Saya</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Pantau seluruh arsip berkas pengajuan surat resmi, disposisi laporan kerusakan fasilitas umum,
                serta permohonan izin lingkungan Anda secara transparan dalam satu portal terpadu.
              </p>
            </div>

            {/* Kolom Kanan: Kartu Profil Warga (Solid #093529) */}
            <div className="lg:col-span-4">
              <div className="p-5 rounded-3xl bg-[#093529] border border-emerald-800 text-white shadow-lg space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5D82F] text-[#06261D] font-black text-lg flex items-center justify-center shadow-md">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "H"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Pemohon Terdaftar</p>
                    <p className="text-base font-black text-white truncate">{currentUser?.name || "Hadi Purnomo"}</p>
                    <p className="text-xs font-mono text-emerald-300">NIK: {currentUser?.nik || "3515082103900001"}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#C5D82F]" />
                    <span>Akun Terverifikasi</span>
                  </span>
                  <Link
                    href="/layanan"
                    className="text-xs font-bold text-[#C5D82F] hover:underline flex items-center gap-1"
                  >
                    <span>Ajukan Layanan Baru</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK RINGKAS 3 PILAR */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Pengajuan Surat */}
          <button
            type="button"
            onClick={() => setActiveTab("surat")}
            className={`p-5 rounded-3xl border transition-all duration-200 text-left cursor-pointer shadow-md flex items-center justify-between ${
              activeTab === "surat"
                ? "bg-[#064E3B] text-white border-[#C5D82F] ring-2 ring-[#C5D82F]/50 scale-[1.02]"
                : "bg-white text-slate-800 border-[#E3E8E2] hover:border-emerald-600 hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === "surat"
                    ? "bg-[#C5D82F] text-[#06261D]"
                    : "bg-emerald-100 text-[#064E3B]"
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === "surat" ? "text-slate-200" : "text-slate-500"}`}>
                  Pilar Administrasi
                </p>
                <p className="text-base sm:text-lg font-black tracking-tight">Pengajuan Surat</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black ${activeTab === "surat" ? "text-[#C5D82F]" : "text-[#064E3B]"}`}>
                {daftarSurat.length}
              </span>
              <p className="text-[10px] font-semibold opacity-80 uppercase">Dokumen</p>
            </div>
          </button>

          {/* Card 2: Laporan Kerusakan */}
          <button
            type="button"
            onClick={() => setActiveTab("kerusakan")}
            className={`p-5 rounded-3xl border transition-all duration-200 text-left cursor-pointer shadow-md flex items-center justify-between ${
              activeTab === "kerusakan"
                ? "bg-[#064E3B] text-white border-[#C5D82F] ring-2 ring-[#C5D82F]/50 scale-[1.02]"
                : "bg-white text-slate-800 border-[#E3E8E2] hover:border-amber-600 hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === "kerusakan"
                    ? "bg-[#C5D82F] text-[#06261D]"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === "kerusakan" ? "text-slate-200" : "text-slate-500"}`}>
                  Pilar Pengaduan
                </p>
                <p className="text-base sm:text-lg font-black tracking-tight">Laporan Kerusakan</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black ${activeTab === "kerusakan" ? "text-[#C5D82F]" : "text-amber-800"}`}>
                {daftarKerusakan.length}
              </span>
              <p className="text-[10px] font-semibold opacity-80 uppercase">Aduan</p>
            </div>
          </button>

          {/* Card 3: Perizinan */}
          <button
            type="button"
            onClick={() => setActiveTab("perizinan")}
            className={`p-5 rounded-3xl border transition-all duration-200 text-left cursor-pointer shadow-md flex items-center justify-between ${
              activeTab === "perizinan"
                ? "bg-[#064E3B] text-white border-[#C5D82F] ring-2 ring-[#C5D82F]/50 scale-[1.02]"
                : "bg-white text-slate-800 border-[#E3E8E2] hover:border-blue-600 hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === "perizinan"
                    ? "bg-[#C5D82F] text-[#06261D]"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === "perizinan" ? "text-slate-200" : "text-slate-500"}`}>
                  Pilar Perizinan
                </p>
                <p className="text-base sm:text-lg font-black tracking-tight">Perizinan Warga</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black ${activeTab === "perizinan" ? "text-[#C5D82F]" : "text-blue-800"}`}>
                {daftarPerizinan.length}
              </span>
              <p className="text-[10px] font-semibold opacity-80 uppercase">Izin</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. KONTROL FILTER & SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mt-10">
        <div className="bg-white rounded-3xl border border-[#E3E8E2] p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* LABEL FILTER & PENCARIAN */}
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
            <span className="p-1.5 rounded-xl bg-emerald-50 text-[#064E3B]">
              <Filter className="w-4 h-4" />
            </span>
            <span>Filter & Pencarian Riwayat</span>
          </div>

          {/* SEARCH & FILTER STATUS */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari no. tiket / nama..."
                className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#064E3B] cursor-pointer"
            >
              <option value="semua">Semua Status</option>
              <option value="proses">Sedang Diproses</option>
              <option value="selesai">Tuntas / Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. AREA KONTEN: DIPISAH SENDIRI-SENDIRI SESUAI TAB */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mt-8">
        
        {/* =========================================================================
            TAB 1: DAFTAR PENGAJUAN SURAT (TERPISAH KHUSUS SURAT)
            ========================================================================= */}
        {activeTab === "surat" && (
          <section className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#E3E8E2]">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-100 text-[#064E3B]">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span>Pengajuan Surat Administrasi Kependudukan</span>
                  </h2>

                  <button
                    type="button"
                    onClick={fetchSuratLive}
                    disabled={isLoadingSurat}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    title="Segarkan status surat terbaru"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSurat ? "animate-spin text-[#064E3B]" : ""}`} />
                    <span className="hidden sm:inline">Segarkan</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Daftar seluruh berkas pengajuan surat keterangan resmi atas nama Anda yang diproses Balai Desa Sawotratap.
                </p>
              </div>

              {/* Tombol Tambah Surat */}
              <Link
                href="/layanan#surat"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-black shadow-sm transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-[#C5D82F]" />
                <span>Ajukan Surat Baru</span>
              </Link>
            </div>

            {filteredSurat.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
                <FileText className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-base text-slate-700">Tidak ada pengajuan surat yang ditemukan</p>
                <p className="text-xs text-slate-400">Silakan ubah filter status atau ajukan permohonan surat baru.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredSurat.map((surat) => (
                  <div
                    key={surat.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3E8E2] hover:border-emerald-600/50 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    {/* Header Item */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-black">
                          {surat.id}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{surat.tanggal_pengajuan}</span>
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${surat.status_color}`}
                      >
                        {surat.step === 4 ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{surat.status}</span>
                      </span>
                    </div>

                    {/* Konten Surat */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">{surat.jenis_surat}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        <span className="font-semibold text-slate-700">Keperluan:</span> {surat.keperluan}
                      </p>
                      {surat.nomor_surat && (
                        <p className="text-xs font-mono font-bold text-[#064E3B] mt-1">
                          No. Registrasi Desa: {surat.nomor_surat}
                        </p>
                      )}
                    </div>

                    {/* Status Step Tracker */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-bold text-slate-500">
                        <div className={`p-2 rounded-xl ${surat.step >= 1 ? "bg-emerald-50 text-[#064E3B] font-black" : "bg-slate-50"}`}>
                          1. Antrean Masuk
                        </div>
                        <div className={`p-2 rounded-xl ${surat.step >= 2 ? "bg-emerald-50 text-[#064E3B] font-black" : "bg-slate-50"}`}>
                          2. Verifikasi Berkas
                        </div>
                        <div className={`p-2 rounded-xl ${surat.step >= 3 ? "bg-emerald-50 text-[#064E3B] font-black" : "bg-slate-50"}`}>
                          3. Disposisi Kades
                        </div>
                        <div className={`p-2 rounded-xl ${surat.step >= 4 ? "bg-emerald-600 text-white font-black shadow-xs" : "bg-slate-50"}`}>
                          4. Surat Terbit
                        </div>
                      </div>
                    </div>

                    {/* Footer Item & Aksi */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-slate-500 italic">
                        Estimasi: <span className="font-bold text-slate-700 not-italic">{surat.estimasi_selesai}</span>
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSurat(surat)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rincian Berkas</span>
                        </button>

                        {surat.step === 4 && (
                          <button
                            type="button"
                            onClick={() => alert(`Mengunduh file surat ${surat.jenis_surat} (${surat.id}) dalam format PDF resmi...`)}
                            className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-[#C5D82F]" />
                            <span>Unduh PDF</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            TAB 2: DAFTAR LAPORAN KERUSAKAN & FASILITAS (TERPISAH KHUSUS KERUSAKAN)
            ========================================================================= */}
        {activeTab === "kerusakan" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E3E8E2]">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Wrench className="w-5 h-5" />
                  </span>
                  <span>Laporan Kerusakan & Pengaduan Fasilitas Lingkungan</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Pemantauan keluhan infrastruktur jalan, drainase, PJU, dan sarana warga yang ditindaklanjuti tim teknis desa.
                </p>
              </div>

              <Link
                href="/layanan#pengaduan"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-sm transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Lapor Kerusakan Baru</span>
              </Link>
            </div>

            {filteredKerusakan.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
                <Wrench className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-base text-slate-700">Tidak ada laporan kerusakan yang tercatat</p>
                <p className="text-xs text-slate-400">Apabila Anda menemukan fasilitas umum yang rusak, silakan sampaikan pengaduan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredKerusakan.map((laporan) => (
                  <div
                    key={laporan.id}
                    className="p-5 rounded-3xl bg-white border border-[#E3E8E2] hover:border-amber-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Header Item */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-black">
                          {laporan.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${laporan.status_color}`}
                        >
                          <span>{laporan.status}</span>
                        </span>
                      </div>

                      {/* Judul & Kategori */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          {laporan.kategori}
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-1.5 leading-snug">
                          {laporan.judul_masalah}
                        </h3>
                      </div>

                      {/* Lokasi */}
                      <p className="text-xs text-slate-600 flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{laporan.lokasi}</span>
                      </p>

                      {/* Uraian Masalah */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {laporan.uraian}
                      </p>
                    </div>

                    {/* Bagian Bawah: Penanggung Jawab & Tombol */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{laporan.tanggal_lapor}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedKerusakan(laporan)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tinjau Progres</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            TAB 3: DAFTAR PERIZINAN WARGA (TERPISAH KHUSUS PERIZINAN)
            ========================================================================= */}
        {activeTab === "perizinan" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E3E8E2]">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <FileCheck2 className="w-5 h-5" />
                  </span>
                  <span>Pengajuan Perizinan & Rekomendasi Warga</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Arsip izin keramaian hajatan, penutupan jalan lingkungan, serta rekomendasi izin usaha mikro resmi.
                </p>
              </div>

              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-black shadow-sm transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Permohonan Izin Baru</span>
              </Link>
            </div>

            {filteredPerizinan.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
                <FileCheck2 className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-base text-slate-700">Tidak ada data perizinan aktif</p>
                <p className="text-xs text-slate-400">Silakan hubungi loket perizinan desa untuk keperluan acara atau rekomendasi usaha.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredPerizinan.map((izin) => (
                  <div
                    key={izin.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E3E8E2] hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    {/* Header Item */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-black">
                          {izin.id}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Diajukan: {izin.tanggal_pengajuan}</span>
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${izin.status_color}`}
                      >
                        {izin.step === 4 ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{izin.status}</span>
                      </span>
                    </div>

                    {/* Judul & Detail Kegiatan */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">{izin.jenis_izin}</h3>
                      <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                        Kegiatan: <span className="font-normal text-slate-600">{izin.nama_kegiatan}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{izin.lokasi_kegiatan}</span>
                      </p>
                    </div>

                    {/* Info Surat Keputusan Izin */}
                    {izin.nomor_izin && (
                      <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
                        <div>
                          <p className="font-black">Nomor SK / Rekomendasi Terbit:</p>
                          <p className="font-mono mt-0.5">{izin.nomor_izin}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-blue-200 text-blue-950 font-bold text-[10px]">
                          Sah & Berlaku
                        </span>
                      </div>
                    )}

                    {/* Footer Item */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-slate-500">
                        Waktu Kegiatan: <span className="font-bold text-slate-700">{izin.tanggal_pelaksanaan}</span>
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPerizinan(izin)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rincian Berkas Izin</span>
                        </button>

                        {izin.step === 4 && (
                          <button
                            type="button"
                            onClick={() => alert(`Mencetak dokumen rekomendasi izin ${izin.id}...`)}
                            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-white" />
                            <span>Unduh Surat Izin</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* =========================================================================
          MODAL DETAIL PENGAJUAN SURAT
          ========================================================================= */}
      {selectedSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header Modal (Solid #064E3B) */}
            <div className="p-6 bg-[#064E3B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#C5D82F]">
                  Rincian Dokumen Surat
                </span>
                <h3 className="text-lg font-black">{selectedSurat.jenis_surat}</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{selectedSurat.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSurat(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Modal */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Keperluan Surat:</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{selectedSurat.keperluan}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <p className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#064E3B]" />
                  <span>Catatan Petugas PTSP:</span>
                </p>
                <p className="text-xs text-emerald-900 leading-relaxed">{selectedSurat.catatan}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Berkas Persyaratan yang Dilampirkan:</p>
                <div className="space-y-2">
                  {selectedSurat.berkas.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <span className="font-semibold text-slate-800">{f.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Tervalidasi</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSurat(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              {selectedSurat.step === 4 && (
                <button
                  type="button"
                  onClick={() => {
                    alert(`Mengunduh PDF surat ${selectedSurat.id}...`);
                    setSelectedSurat(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#083327] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5D82F]" />
                  <span>Unduh Dokumen</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DETAIL LAPORAN KERUSAKAN
          ========================================================================= */}
      {selectedKerusakan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 bg-amber-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-200">
                  Laporan Pengaduan Fasilitas
                </span>
                <h3 className="text-lg font-black">{selectedKerusakan.judul_masalah}</h3>
                <p className="text-xs text-amber-200 font-mono mt-0.5">{selectedKerusakan.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedKerusakan(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Titik Lokasi:</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{selectedKerusakan.lokasi}</span>
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Uraian Masalah:</p>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedKerusakan.uraian}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <p className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-700" />
                  <span>Tindak Lanjut & Penanganan:</span>
                </p>
                <p className="text-xs text-amber-900 leading-relaxed">{selectedKerusakan.catatan_petugas}</p>
                <p className="text-[11px] font-bold text-amber-800">
                  Pelaksana: {selectedKerusakan.penanggung_jawab}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedKerusakan(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DETAIL PERIZINAN WARGA
          ========================================================================= */}
      {selectedPerizinan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 bg-blue-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-200">
                  Dokumen Permohonan Perizinan
                </span>
                <h3 className="text-lg font-black">{selectedPerizinan.jenis_izin}</h3>
                <p className="text-xs text-blue-200 font-mono mt-0.5">{selectedPerizinan.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPerizinan(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Nama Kegiatan / Usaha:</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">{selectedPerizinan.nama_kegiatan}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Lokasi & Waktu:</p>
                <p className="text-xs text-slate-700 mt-0.5">{selectedPerizinan.lokasi_kegiatan}</p>
                <p className="text-xs font-semibold text-blue-800 mt-0.5">Jadwal: {selectedPerizinan.tanggal_pelaksanaan}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Daftar Persyaratan & Validasi:</p>
                <div className="space-y-1.5">
                  {selectedPerizinan.persyaratan.map((syarat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{syarat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <p className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Keterangan Otoritas Desa:</span>
                </p>
                <p className="text-xs text-blue-900 leading-relaxed">{selectedPerizinan.catatan}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedPerizinan(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              {selectedPerizinan.step === 4 && (
                <button
                  type="button"
                  onClick={() => {
                    alert(`Mengunduh dokumen izin resmi ${selectedPerizinan.id}...`);
                    setSelectedPerizinan(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Unduh Surat Izin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
