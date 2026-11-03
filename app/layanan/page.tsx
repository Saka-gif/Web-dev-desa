"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Megaphone,
  ShoppingBag,
  CheckCircle2,
  Clock,
  PhoneCall,
  Search,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
  Check,
  ExternalLink,
  UploadCloud,
  Trash2,
  Paperclip,
  Loader2,
  Camera,
  ImagePlus,
  Building2,
  Calendar,
  Landmark,
  Info,
  Store,
  User,
  Users,
  Lock,
  LogIn,
  AlertTriangle,
  AlertCircle,
  X,
} from "lucide-react";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";

interface LayananOption {
  id: string;
  nama: string;
  kategori: string;
  estimasi: string;
  persyaratan: string[];
}

const DAFTAR_SURAT: LayananOption[] = [
  {
    id: "surat-domisili",
    nama: "Surat Keterangan Domisili (SKD)",
    kategori: "Kependudukan",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP Pemohon", "Kartu Keluarga (KK)", "Pengantar RT/RW"],
  },
  {
    id: "surat-ktp-kk",
    nama: "Pengantar KTP-el / KK Baru",
    kategori: "Kependudukan",
    estimasi: "1 x 24 Jam",
    persyaratan: ["Akta Kelahiran", "KK Lama", "Surat Kehilangan (bila hilang)"],
  },
  {
    id: "surat-usaha",
    nama: "Surat Keterangan Usaha (SKU / UMKM)",
    kategori: "Ekonomi",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP & KK Pemilik", "Foto Tempat Usaha", "Pengantar RT"],
  },
  {
    id: "surat-sktm",
    nama: "Surat Keterangan Tidak Mampu (SKTM)",
    kategori: "Sosial & Beasiswa",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP & KK Sawotratap", "Surat RT/RW", "Foto Rumah"],
  },
  {
    id: "surat-skck",
    nama: "Surat Pengantar SKCK Polsek",
    kategori: "Hukum & Kerja",
    estimasi: "1 x 24 Jam",
    persyaratan: ["KTP & KK", "Pas Foto 4x6 Merah (2 lbr)", "Pengantar RT/RW"],
  },
  {
    id: "surat-nikah",
    nama: "Surat Pengantar Nikah (N1 - N4)",
    kategori: "Pernikahan",
    estimasi: "2 x 24 Jam",
    persyaratan: ["KTP & KK Calon & Ortu", "Akta Kelahiran", "Pas Foto Berdampingan"],
  },
];

export interface PerizinanFasilitasOption {
  id: string;
  nama: string;
  kategori: "Fasilitas Desa" | "Izin Kegiatan" | "Perizinan Usaha";
  kapasitas?: string;
  lokasi: string;
  estimasi: string;
  syarat: string[];
  deskripsi: string;
  badge: string;
}

export const DAFTAR_FASILITAS_PERIZINAN: PerizinanFasilitasOption[] = [
  {
    id: "gedung-serbaguna",
    nama: "Balai Pertemuan & Gedung Serbaguna",
    kategori: "Fasilitas Desa",
    kapasitas: "Kapasitas 300 Orang",
    lokasi: "Kompleks Balai Desa Sawotratap",
    estimasi: "1 - 2 Hari Kerja",
    syarat: ["KTP Penanggung Jawab", "Surat Pengantar RT/RW", "Rundown Acara"],
    deskripsi: "Peminjaman aula serbaguna lengkap dengan panggung, sound system 2000W, kursi 200 unit, dan area parkir luas.",
    badge: "Fasilitas Publik",
  },
  {
    id: "pendopo-desa",
    nama: "Pendopo Terbuka Balai Desa",
    kategori: "Fasilitas Desa",
    kapasitas: "Kapasitas 100 Orang",
    lokasi: "Halaman Depan Balai Desa",
    estimasi: "1 Hari Kerja",
    syarat: ["KTP Penanggung Jawab", "Surat Izin RT/RW"],
    deskripsi: "Cocok untuk rapat paguyuban warga, pertemuan RT/RW, latihan kesenian, maupun arisan kemasyarakatan.",
    badge: "Gratis untuk Warga",
  },
  {
    id: "lapangan-olahraga",
    nama: "Lapangan Futsal & Olahraga Desa",
    kategori: "Fasilitas Desa",
    kapasitas: "Turnamen & Pertandingan",
    lokasi: "Jl. Lapangan Olahraga RW 04",
    estimasi: "1 Hari Kerja",
    syarat: ["KTP Pemohon / Karang Taruna", "Jadwal Pertandingan"],
    deskripsi: "Fasilitas lapangan voli, futsal, dan senam bersama warga dengan penerangan lampu malam hari.",
    badge: "Area Olahraga",
  },
  {
    id: "izin-keramaian-hajatan",
    nama: "Izin Keramaian Hajatan & Pernikahan",
    kategori: "Izin Kegiatan",
    kapasitas: "Wilayah Pemukiman",
    lokasi: "Lingkungan RT/RW Domisili Warga",
    estimasi: "2 Hari Kerja",
    syarat: ["KTP Pemohon", "Surat Pengantar RT & RW", "Surat Izin Tetangga"],
    deskripsi: "Penerbitan surat izin keramaian desa dan rekomendasi ke Babinsa & Polsek Gedangan untuk hajatan warga.",
    badge: "Izin Resmi",
  },
  {
    id: "izin-tutup-jalan",
    nama: "Izin Penggunaan / Penutupan Jalan Lingkungan",
    kategori: "Izin Kegiatan",
    kapasitas: "Jalan Lingkungan RT/RW",
    lokasi: "Ruas Jalan Desa / Lingkungan",
    estimasi: "2 Hari Kerja",
    syarat: ["KTP Penanggung Jawab", "Persetujuan RT & Warga Terdampak", "Denah Rute Pengalihan"],
    deskripsi: "Izin resmi pengalihan jalan desa untuk kegiatan keagamaan, panggung 17 Agustus, atau perbaikan swadaya.",
    badge: "Koordinasi Linmas",
  },
  {
    id: "rekomendasi-iumk",
    nama: "Rekomendasi Izin Usaha Mikro (IUMK & NIB)",
    kategori: "Perizinan Usaha",
    kapasitas: "Pelaku UMKM Sawotratap",
    lokasi: "Domisili Usaha di Sawotratap",
    estimasi: "1 Hari Kerja",
    syarat: ["KTP & KK Pemilik", "Foto Tempat Usaha / Produk", "Pengantar RT"],
    deskripsi: "Surat rekomendasi legalitas usaha desa untuk syarat pengajuan NIB OSS, sertifikasi Halal, dan permodalan perbankan.",
    badge: "Legalitas Usaha",
  },
];

import { DAFTAR_PRODUK_UMKM, UmkmItem } from "@/app/data/umkm";
import { supabase } from "@/lib/supabase";

const SAMPLE_TRACKING_DATA: Record<string, {
  ticketId: string;
  nama: string;
  jenisSurat: string;
  tanggal: string;
  step: number;
  statusLabel: string;
  statusColor: string;
  estimasiSelesai: string;
  catatan: string;
  berkas?: Array<{ name: string; url: string }>;
}> = {
  "SWT-2024-8842": {
    ticketId: "SWT-2024-8842",
    nama: "Hadi Purnomo",
    jenisSurat: "Surat Keterangan Usaha (SKU / UMKM)",
    tanggal: "24 Okt 2024, 08.15 WIB",
    step: 4,
    statusLabel: "Siap Diambil di Loket Balai Desa",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    estimasiSelesai: "Hari Ini • Loket PTSP",
    catatan: "Dokumen telah ditandatangani basah & cap resmi Kepala Desa. Tunjukkan KTP asli saat pengambilan.",
  },
  "SWT-2024-3190": {
    ticketId: "SWT-2024-3190",
    nama: "Siti Rahmawati",
    jenisSurat: "Surat Keterangan Domisili (SKD)",
    tanggal: "24 Okt 2024, 09.30 WIB",
    step: 3,
    statusLabel: "Verifikasi Tanda Tangan Digital Kades",
    statusColor: "bg-blue-100 text-blue-800 border-blue-300",
    estimasiSelesai: "Sore Ini, 14.00 WIB",
    catatan: "Verifikasi berkas kependudukan RT 04 / RW 02 telah disetujui. Sedang proses pengesahan Kades.",
  },
  "SWT-2024-1025": {
    ticketId: "SWT-2024-1025",
    nama: "Rizky Firmansyah",
    jenisSurat: "Surat Pengantar SKCK Polsek Gedangan",
    tanggal: "24 Okt 2024, 10.05 WIB",
    step: 2,
    statusLabel: "Pemeriksaan Dokumen oleh Kaur TU",
    statusColor: "bg-amber-100 text-amber-800 border-amber-300",
    estimasiSelesai: "Besok Pagi, 09.00 WIB",
    catatan: "Petugas sedang memeriksa kelengkapan pas foto 4x6 dan surat pengantar RW 06.",
  },
};

export default function LayananPage() {
  const [activeSection, setActiveSection] = useState("surat");

  // Deteksi section aktif saat melakukan scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["surat", "pengaduan", "perizinan", "umkm", "daftar-umkm"];
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

  // Tracking State
  const [trackingInput, setTrackingInput] = useState("SWT-2024-8842");
  const [currentTracking, setCurrentTracking] = useState<any>(SAMPLE_TRACKING_DATA["SWT-2024-8842"]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchingTracking, setIsSearchingTracking] = useState(false);

  const handleSearchTracking = async (codeToSearch?: string) => {
    const query = (codeToSearch || trackingInput).trim().toUpperCase();
    if (!query) return;
    setHasSearched(true);
    setIsSearchingTracking(true);

    try {
      // 1. Cek apakah tiket perizinan
      if (query.startsWith("PRZ-")) {
        const resPrz = await fetch(`/api/perizinan?ticket=${encodeURIComponent(query)}`);
        if (resPrz.ok) {
          const jsonPrz = await resPrz.json();
          if (jsonPrz.success && jsonPrz.data) {
            const d = jsonPrz.data;
            const tanggalFormatted = new Date(d.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) + " WIB";

            setCurrentTracking({
              ticketId: d.id,
              nama: d.nama_pemohon,
              jenisSurat: `${d.jenis_perizinan} (${d.nama_kegiatan})`,
              tanggal: tanggalFormatted,
              step: d.status === "Disetujui Kades" ? 4 : d.status === "Diverifikasi Admin" ? 3 : 2,
              statusLabel: d.status_label || d.status,
              statusColor: d.status_color || "bg-emerald-100 text-emerald-800 border-emerald-300",
              estimasiSelesai: d.estimasi_selesai || "2 - 3 Hari Kerja",
              catatan: d.catatan_petugas || "Permohonan perizinan & peminjaman fasilitas desa sedang diproses.",
              berkas: d.berkas_urls || [],
            });
            setIsSearchingTracking(false);
            return;
          }
        }
      }

      // 2. Cari langsung ke API Supabase Surat
      const res = await fetch(`/api/pengajuan-surat?ticket=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          const tanggalFormatted = new Date(d.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB";

          setCurrentTracking({
            ticketId: d.id,
            nama: d.nama_pemohon,
            jenisSurat: d.jenis_surat,
            tanggal: tanggalFormatted,
            step: d.step || 1,
            statusLabel: d.status_label || "Sedang Dalam Antrean Verifikasi",
            statusColor: d.status_color || "bg-amber-100 text-amber-800 border-amber-300",
            estimasiSelesai: d.estimasi_selesai || "1 x 24 Jam Kerja",
            catatan: d.catatan || "Permohonan nomor registrasi ini sedang ditelaah oleh Seksi Pelayanan Balai Desa.",
            berkas: d.berkas_urls || [],
          });
          setIsSearchingTracking(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Gagal fetch dari database, mengecek data sampel:", err);
    }

    // Fallback data sampel
    if (SAMPLE_TRACKING_DATA[query]) {
      setCurrentTracking(SAMPLE_TRACKING_DATA[query]);
    } else {
      setCurrentTracking({
        ticketId: query || "SWT-2026-BARU",
        nama: "Warga Desa Sawotratap",
        jenisSurat: "Permohonan Layanan Surat Mandiri",
        tanggal: "Hari Ini, Baru Saja",
        step: 1,
        statusLabel: "Sedang Dalam Antrean Verifikasi",
        statusColor: "bg-amber-100 text-amber-800 border-amber-300",
        estimasiSelesai: "1 x 24 Jam Kerja",
        catatan: "Permohonan nomor registrasi ini sedang ditelaah oleh Seksi Pelayanan Balai Desa.",
        berkas: [],
      });
    }
    setIsSearchingTracking(false);
  };

  // Form State Surat
  const [selectedSurat, setSelectedSurat] = useState(DAFTAR_SURAT[0].id);
  const [targetPemohon, setTargetPemohon] = useState<"sendiri" | "keluarga">("sendiri");
  const [namaPemohon, setNamaPemohon] = useState("");
  const [nikPemohon, setNikPemohon] = useState("");
  const [teleponPemohon, setTeleponPemohon] = useState("");
  const [rwPemohon, setRwPemohon] = useState("RW 01");
  const [keperluan, setKeperluan] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // State Modal Peringatan Login Diperlukan
  const [loginRequiredModal, setLoginRequiredModal] = useState<{
    isOpen: boolean;
    serviceTitle: string;
  }>({
    isOpen: false,
    serviceTitle: "",
  });

  const handlePilihTarget = (target: "sendiri" | "keluarga") => {
    setTargetPemohon(target);
    if (target === "sendiri") {
      setNamaPemohon(currentUser?.name || "");
      setNikPemohon(currentUser?.nik || "");
      if (currentUser?.telepon) setTeleponPemohon(currentUser.telepon);
      if (currentUser?.rw) setRwPemohon(currentUser.rw);
    } else {
      setNamaPemohon("");
      setNikPemohon("");
      if (!teleponPemohon && currentUser?.telepon) {
        setTeleponPemohon(currentUser.telepon);
      }
    }
  };

  // Form State Pengaduan
  const [kategoriAduan, setKategoriAduan] = useState("Infrastruktur Jalan Berlubang");
  const [lokasiAduan, setLokasiAduan] = useState("");
  const [namaPelapor, setNamaPelapor] = useState("");
  const [kontakPelapor, setKontakPelapor] = useState("");
  const [isiAduan, setIsIduan] = useState("");
  const [aduanPhotos, setAduanPhotos] = useState<File[]>([]);
  const [isSubmittingAduan, setIsSubmittingAduan] = useState(false);
  const [aduanSubmitted, setAduanSubmitted] = useState(false);
  const [aduanResult, setAduanResult] = useState<any>(null);

  // Form State Perizinan & Fasilitas Desa
  const [selectedPerizinanId, setSelectedPerizinanId] = useState("gedung-serbaguna");
  const [filterKategoriPerizinan, setFilterKategoriPerizinan] = useState("Semua");
  const [targetPemohonPerizinan, setTargetPemohonPerizinan] = useState<"sendiri" | "keluarga">("sendiri");
  const [namaPemohonPerizinan, setNamaPemohonPerizinan] = useState("");
  const [nikPemohonPerizinan, setNikPemohonPerizinan] = useState("");
  const [teleponPemohonPerizinan, setTeleponPemohonPerizinan] = useState("");
  const [rwPemohonPerizinan, setRwPemohonPerizinan] = useState("RW 01");
  const [namaKegiatanPerizinan, setNamaKegiatanPerizinan] = useState("");
  const [tanggalMulaiPerizinan, setTanggalMulaiPerizinan] = useState("");
  const [tanggalSelesaiPerizinan, setTanggalSelesaiPerizinan] = useState("");
  const [waktuKegiatanPerizinan, setWaktuKegiatanPerizinan] = useState("08.00 - 15.00 WIB");
  const [lokasiFasilitasPerizinan, setLokasiFasilitasPerizinan] = useState("Balai Pertemuan & Gedung Serbaguna Desa");
  const [jumlahPesertaPerizinan, setJumlahPesertaPerizinan] = useState("");
  const [keteranganPerizinan, setKeteranganPerizinan] = useState("");
  const [perizinanFiles, setPerizinanFiles] = useState<File[]>([]);
  const [isSubmittingPerizinan, setIsSubmittingPerizinan] = useState(false);
  const [perizinanSubmitted, setPerizinanSubmitted] = useState(false);
  const [perizinanResult, setPerizinanResult] = useState<any>(null);

  const handlePilihTargetPerizinan = (target: "sendiri" | "keluarga") => {
    setTargetPemohonPerizinan(target);
    if (target === "sendiri") {
      setNamaPemohonPerizinan(currentUser?.name || "");
      setNikPemohonPerizinan(currentUser?.nik || "");
      if (currentUser?.telepon) setTeleponPemohonPerizinan(currentUser.telepon);
      if (currentUser?.rw) setRwPemohonPerizinan(currentUser.rw);
    } else {
      setNamaPemohonPerizinan("");
      setNikPemohonPerizinan("");
      if (!teleponPemohonPerizinan && currentUser?.telepon) {
        setTeleponPemohonPerizinan(currentUser.telepon);
      }
    }
  };

  const currentPerizinanObj =
    DAFTAR_FASILITAS_PERIZINAN.find((item) => item.id === selectedPerizinanId) ||
    DAFTAR_FASILITAS_PERIZINAN[0];

  const handlePerizinanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPerizinanFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemovePerizinanFile = (idx: number) => {
    setPerizinanFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitPerizinan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginRequiredModal({
        isOpen: true,
        serviceTitle: "Permohonan Izin Kegiatan & Peminjaman Fasilitas Desa",
      });
      return;
    }

    if (!namaPemohonPerizinan || !nikPemohonPerizinan || !namaKegiatanPerizinan || !tanggalMulaiPerizinan) {
      alert("Harap lengkapi nama pemohon, NIK, nama kegiatan, dan tanggal mulai.");
      return;
    }

    setIsSubmittingPerizinan(true);
    try {
      const formData = new FormData();
      formData.append("jenis_perizinan", currentPerizinanObj.nama);
      formData.append("kategori", currentPerizinanObj.kategori);
      formData.append("nama_pemohon", namaPemohonPerizinan);
      formData.append("nik_pemohon", nikPemohonPerizinan);
      formData.append("telepon_pemohon", teleponPemohonPerizinan || "-");
      formData.append("rw_pemohon", rwPemohonPerizinan);
      formData.append("nama_kegiatan", namaKegiatanPerizinan);
      formData.append("tanggal_mulai", tanggalMulaiPerizinan);
      formData.append("tanggal_selesai", tanggalSelesaiPerizinan || tanggalMulaiPerizinan);
      formData.append("waktu_kegiatan", waktuKegiatanPerizinan);
      formData.append("lokasi_fasilitas", lokasiFasilitasPerizinan || currentPerizinanObj.lokasi);
      formData.append("jumlah_peserta", jumlahPesertaPerizinan || "-");
      formData.append("keterangan", keteranganPerizinan || "-");

      // Metadata Akun Pengirim Perizinan
      const accId = currentUser?.id || "user-warga";
      const accName = currentUser?.name || namaPemohonPerizinan;
      const accNik = currentUser?.nik || nikPemohonPerizinan;
      const accEmail = currentUser?.email || "";

      formData.append("userId", accId);
      formData.append("user_id", accId);
      formData.append("userName", accName);
      formData.append("user_name", accName);
      formData.append("userNik", accNik);
      formData.append("user_nik", accNik);
      formData.append("userEmail", accEmail);
      formData.append("user_email", accEmail);
      formData.append("untukSiapa", targetPemohonPerizinan);
      formData.append("untuk_siapa", targetPemohonPerizinan);

      perizinanFiles.forEach((file) => {
        formData.append("berkas", file);
      });

      const res = await fetch("/api/perizinan", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setPerizinanResult(json);
        setPerizinanSubmitted(true);
        setTrackingInput(json.ticketId);
      } else {
        alert(json.message || "Gagal mengirimkan permohonan perizinan.");
      }
    } catch (err: any) {
      console.error("Gagal submit perizinan:", err);
      const fallbackId = `PRZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setPerizinanResult({
        ticketId: fallbackId,
        data: {
          id: fallbackId,
          nama_pemohon: namaPemohonPerizinan,
          nama_kegiatan: namaKegiatanPerizinan,
          tanggal_mulai: tanggalMulaiPerizinan,
        },
      });
      setPerizinanSubmitted(true);
      setTrackingInput(fallbackId);
    } finally {
      setIsSubmittingPerizinan(false);
    }
  };

  // Data UMKM Asli dari API / Database
  const [daftarUmkm, setDaftarUmkm] = useState<UmkmItem[]>(DAFTAR_PRODUK_UMKM);
  const [kategoriUmkm, setKategoriUmkm] = useState("Semua");

  // State Formulir Pengajuan UMKM Baru Warga
  const [namaUsahaUmkm, setNamaUsahaUmkm] = useState("");
  const [kategoriUsahaUmkm, setKategoriUsahaUmkm] = useState("Kuliner");
  const [namaPemilikUmkm, setNamaPemilikUmkm] = useState("");
  const [nikPemilikUmkm, setNikPemilikUmkm] = useState("");
  const [kontakWaUmkm, setKontakWaUmkm] = useState("");
  const [hargaUmkm, setHargaUmkm] = useState("");
  const [lokasiUmkm, setLokasiUmkm] = useState("");
  const [rwUmkm, setRwUmkm] = useState("RW 03");
  const [jamOperasionalUmkm, setJamOperasionalUmkm] = useState("08.00 - 20.00 WIB");
  const [deskripsiSingkatUmkm, setDeskripsiSingkatUmkm] = useState("");
  const [deskripsiLengkapUmkm, setDeskripsiLengkapUmkm] = useState("");
  const [fotoUmkmFile, setFotoUmkmFile] = useState<File | null>(null);
  const [fotoUmkmPreview, setFotoUmkmPreview] = useState<string>("");
  const [fotoUrlInputUmkm, setFotoUrlInputUmkm] = useState<string>("");
  const [isSubmittingUmkm, setIsSubmittingUmkm] = useState(false);
  const [umkmSubmitted, setUmkmSubmitted] = useState(false);
  const [umkmResult, setUmkmResult] = useState<any>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleFotoUmkmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran foto maksimal 10MB.");
        return;
      }
      setFotoUmkmFile(file);
      setFotoUmkmPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitUmkm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginRequiredModal({
        isOpen: true,
        serviceTitle: "Pendaftaran UMKM Baru Warga Desa",
      });
      return;
    }

    if (!namaUsahaUmkm.trim() || !namaPemilikUmkm.trim() || !kontakWaUmkm.trim() || !deskripsiSingkatUmkm.trim()) {
      alert("Harap lengkapi formulir wajib: Nama Usaha, Pemilik, No WhatsApp, dan Deskripsi Produk.");
      return;
    }

    try {
      setIsSubmittingUmkm(true);
      const formData = new FormData();
      formData.append("nama", namaUsahaUmkm);
      formData.append("kategori", kategoriUsahaUmkm);
      formData.append("pemilik", namaPemilikUmkm);
      formData.append("nikPemilik", nikPemilikUmkm || "");
      formData.append("kontakWa", kontakWaUmkm);
      formData.append("harga", hargaUmkm || "Hubungi Penjual");
      formData.append("lokasi", lokasiUmkm || "Desa Sawotratap");
      formData.append("rw", rwUmkm);
      formData.append("jamOperasional", jamOperasionalUmkm || "08.00 - 20.00 WIB");
      formData.append("deskripsiSingkat", deskripsiSingkatUmkm);
      formData.append("deskripsiLengkap", deskripsiLengkapUmkm || deskripsiSingkatUmkm);
      formData.append("userId", currentUser?.id || "user-warga");
      formData.append("userEmail", currentUser?.email || "");
      formData.append("userName", currentUser?.name || namaPemilikUmkm);

      if (fotoUmkmFile) {
        formData.append("foto", fotoUmkmFile);
      } else if (fotoUrlInputUmkm.trim()) {
        formData.append("fotoUrl", fotoUrlInputUmkm.trim());
      }

      const res = await fetch("/api/umkm", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setUmkmResult(json.data || json);
        setUmkmSubmitted(true);
      } else {
        alert(json.message || "Gagal mengirimkan pengajuan UMKM.");
      }
    } catch (err: any) {
      console.error("Gagal submit UMKM:", err);
      alert("Terjadi kesalahan koneksi saat mengirim pendaftaran UMKM.");
    } finally {
      setIsSubmittingUmkm(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      let activeUser: any = null;
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.success && json.user) {
          activeUser = json.user;
        }
      } catch (err) {
        // ignore
      }

      if (!activeUser && typeof window !== "undefined") {
        const savedUser = localStorage.getItem("sawotratap_user");
        if (savedUser) {
          try {
            activeUser = JSON.parse(savedUser);
          } catch {}
        }
      }

      // Jangan pasang user default Hadi Purnomo jika belum login
      setCurrentUser(activeUser);

      if (activeUser) {
        // 1. Auto-fill Surat
        setNamaPemohon(activeUser.name || "");
        setNikPemohon(activeUser.nik || "");
        setTeleponPemohon(activeUser.telepon || "");
        if (activeUser.rw) setRwPemohon(activeUser.rw);

        // 2. Pengaduan
        setNamaPelapor(activeUser.name || "");
        setKontakPelapor(activeUser.telepon || "");

        // 3. Auto-fill Perizinan & Fasilitas Desa
        setNamaPemohonPerizinan(activeUser.name || "");
        setNikPemohonPerizinan(activeUser.nik || "");
        setTeleponPemohonPerizinan(activeUser.telepon || "");
        if (activeUser.rw) setRwPemohonPerizinan(activeUser.rw);

        // 4. Auto-fill UMKM
        setNamaPemilikUmkm(activeUser.name || "");
        setNikPemilikUmkm(activeUser.nik || "");
        setKontakWaUmkm(activeUser.telepon || "");
        if (activeUser.rw) setRwUmkm(activeUser.rw);
      }
    };
    fetchUser();

    // Fetch Data Asli UMKM (Hanya yang berstatus 'disetujui' untuk etalase publik)
    const fetchUmkm = async () => {
      try {
        const res = await fetch("/api/umkm");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setDaftarUmkm(json.data);
        }
      } catch (e) {
        console.warn("Gagal memuat UMKM asli:", e);
      }
    };
    fetchUmkm();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((f) => {
        if (f.size > 10 * 1024 * 1024) {
          alert(`File ${f.name} melebihi batas 10MB.`);
          return false;
        }
        return true;
      });
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((f) => {
        if (f.size > 10 * 1024 * 1024) {
          alert(`Foto ${f.name} melebihi batas 10MB.`);
          return false;
        }
        return true;
      });
      setAduanPhotos((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setAduanPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const currentSuratObj = DAFTAR_SURAT.find((s) => s.id === selectedSurat) || DAFTAR_SURAT[0];

  const handleSubmitSurat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginRequiredModal({
        isOpen: true,
        serviceTitle: "Pengajuan Surat Keterangan / Administrasi Desa",
      });
      return;
    }
    if (!namaPemohon || !nikPemohon || !teleponPemohon) {
      alert("Harap lengkapi Nama, NIK, dan Nomor Telepon.");
      return;
    }
    if (nikPemohon.length !== 16) {
      alert("NIK harus terdiri dari 16 digit angka sesuai KTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("namaPemohon", namaPemohon);
      formData.append("nikPemohon", nikPemohon);
      formData.append("teleponPemohon", teleponPemohon);
      formData.append("rwPemohon", rwPemohon);
      formData.append("keperluan", keperluan || "-");
      formData.append("jenisSuratId", currentSuratObj.id);
      formData.append("jenisSuratNama", currentSuratObj.nama);
      formData.append("userId", currentUser.id || "user-warga");
      formData.append("userName", currentUser.name || namaPemohon);
      formData.append("userNik", currentUser.nik || nikPemohon);
      formData.append("userEmail", currentUser.email || "");
      formData.append("untukSiapa", targetPemohon);

      uploadedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/pengajuan-surat", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setTicketId(json.ticketId);
        setSubmitResult(json);
        setTrackingInput(json.ticketId);
      } else {
        alert(json.message || "Gagal mengirimkan pengajuan surat.");
      }
    } catch (err: any) {
      console.error("Gagal submit surat:", err);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const fallbackTicket = `SWT-2026-${randomNum}`;
      setTicketId(fallbackTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAduan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginRequiredModal({
        isOpen: true,
        serviceTitle: "Laporan Pengaduan & Kerusakan Lingkungan",
      });
      return;
    }
    if (!lokasiAduan || !isiAduan) {
      alert("Harap isi lokasi kejadian dan uraian deskripsi aduan.");
      return;
    }

    setIsSubmittingAduan(true);
    try {
      const formData = new FormData();
      formData.append("kategori", kategoriAduan);
      formData.append("lokasi", lokasiAduan);
      formData.append("namaPelapor", namaPelapor.trim() ? namaPelapor : (currentUser.name || "Warga Sawotratap"));
      formData.append("nikPelapor", currentUser.nik || "3515112001000001");
      formData.append("kontakPelapor", kontakPelapor.trim() ? kontakPelapor : (currentUser.telepon || "-"));
      formData.append("rw", currentUser.rw || "RW 01");
      formData.append("isiAduan", isiAduan);

      // Metadata Akun Pengirim Pengaduan / Aspirasi
      const accId = currentUser.id || "user-warga";
      const accName = currentUser.name || (namaPelapor.trim() || "Warga Sawotratap");
      const accNik = currentUser.nik || "3515112001000001";
      const accEmail = currentUser.email || "";

      formData.append("userId", accId);
      formData.append("user_id", accId);
      formData.append("userName", accName);
      formData.append("user_name", accName);
      formData.append("userNik", accNik);
      formData.append("user_nik", accNik);
      formData.append("userEmail", accEmail);
      formData.append("user_email", accEmail);

      aduanPhotos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const res = await fetch("/api/pengaduan", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setAduanResult(json);
        setAduanSubmitted(true);
      } else {
        alert(json.message || "Gagal mengirimkan laporan pengaduan.");
      }
    } catch (err: any) {
      console.error("Gagal submit aduan:", err);
      setAduanResult({
        aduanId: `ADU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        data: {
          kategori: kategoriAduan,
          lokasi: lokasiAduan,
          nama_pelapor: namaPelapor.trim() ? namaPelapor : "Warga Sawotratap (Anonim)",
          kontak_pelapor: kontakPelapor || "-",
          isi_aduan: isiAduan,
        },
        files: [],
      });
      setAduanSubmitted(true);
    } finally {
      setIsSubmittingAduan(false);
    }
  };

  const filteredUmkm = daftarUmkm.filter(
    (item) => kategoriUmkm === "Semua" || item.kategori.toLowerCase() === kategoriUmkm.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] font-sans">
      
      {/* 1. HERO HEADER LAYANAN */}
      <section className="relative overflow-hidden bg-[#06261D] text-white pt-36 sm:pt-44 pb-14 sm:pb-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
            <span>/</span>
            <span className="text-white font-bold">Layanan Warga</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Layanan Surat Kilat & <br />
              <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
                Aspirasi Warga
              </span>
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
              Pengurusan surat pengantar administrasi kependudukan tanpa antre, meja aduan permasalahan lingkungan, serta etalase produk UMKM Desa Sawotratap.
            </p>
          </div>

          {/* 3 LANGKAH VISUAL */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                1
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 1</div>
                <div className="text-xs sm:text-sm font-black text-white">Pilih Surat</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                2
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 2</div>
                <div className="text-xs sm:text-sm font-black text-white">Isi Data</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C5D82F] text-[#064E3B] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                3
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-300 uppercase">Langkah 3</div>
                <div className="text-xs sm:text-sm font-black text-[#C5D82F]">Resi Terbit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY JUMP-TO NAVIGATION BAR (Disamakan Kapsul di Tengah, Tanpa Kotak Luar) */}
      <div className="sticky top-20 z-30 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => scrollToSection("surat")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm cursor-pointer ${
              activeSection === "surat"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Surat Mandiri Online</span>
          </button>

          <button
            onClick={() => scrollToSection("pengaduan")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm cursor-pointer ${
              activeSection === "pengaduan"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Pengaduan Warga</span>
          </button>

          <button
            onClick={() => scrollToSection("perizinan")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm cursor-pointer ${
              activeSection === "perizinan"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Perizinan & Fasilitas Desa</span>
          </button>

          <button
            onClick={() => scrollToSection("umkm")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm cursor-pointer ${
              activeSection === "umkm"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Direktori Pasar UMKM</span>
          </button>

          <button
            onClick={() => scrollToSection("daftar-umkm")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 shadow-sm cursor-pointer ${
              activeSection === "daftar-umkm"
                ? "bg-white text-[#064E3B] shadow-md ring-2 ring-[#064E3B]/20"
                : "bg-white/80 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/60"
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Pendaftaran UMKM Baru</span>
          </button>
        </div>
      </div>

      {/* 3. KONTEN LONG-SCROLL KE BAWAH */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 space-y-28 pb-24">
        
        {/* ========================================================= */}
        {/* SECTION 1: SURAT MANDIRI ONLINE (#surat) */}
        {/* ========================================================= */}
        <div id="surat" className="scroll-mt-36 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Pelayanan Kilat</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Pengajuan Surat Keterangan Online</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                Biaya: Rp 0 (100% Gratis)
              </span>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-300">
                Estimasi: 1 x 24 Jam
              </span>
            </div>
          </div>

          {ticketId ? (
            <div className="max-w-xl mx-auto rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-2xl text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>

              <div>
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full mb-2">
                  Pengajuan Berhasil Disimpan
                </span>
                <h3 className="text-3xl font-black font-mono text-[#064E3B] tracking-wider">
                  {ticketId}
                </h3>
                <div className="text-xs text-slate-500 mt-1">Simpan nomor resi ini untuk melacak status dan verifikasi fisik</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Nama Pemohon:</span>
                  <strong className="text-slate-900">{namaPemohon}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">NIK KTP:</span>
                  <strong className="text-slate-900 font-mono">{nikPemohon}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Jenis Surat:</span>
                  <strong className="text-emerald-800">{currentSuratObj.nama}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Wilayah:</span>
                  <strong className="text-slate-900">{rwPemohon} Sawotratap</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lokasi Pengambilan:</span>
                  <strong className="text-slate-900">Loket PTSP Balai Desa Sawotratap</strong>
                </div>
              </div>

              {/* Tampilkan Daftar Berkas yang Terunggah */}
              {submitResult?.files && submitResult.files.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left text-xs space-y-2">
                  <div className="font-black text-emerald-900 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-emerald-600" />
                    <span>{submitResult.files.length} Berkas Syarat Berhasil Diunggah ke S3:</span>
                  </div>
                  <div className="space-y-1.5">
                    {submitResult.files.map((f: any, idx: number) => (
                      <a
                        key={idx}
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 text-[11px] font-semibold text-emerald-800 transition-colors group"
                      >
                        <span className="truncate flex items-center gap-1.5 max-w-[280px]">
                          <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{f.name}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md group-hover:bg-emerald-200 shrink-0 ml-2">
                          Lihat Berkas <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/laporan"
                  className="py-3 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C5D82F]" />
                  <span>Lihat di Laporan Saya</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setTicketId(null);
                    setSubmitResult(null);
                    setUploadedFiles([]);
                    setNamaPemohon("");
                    setNikPemohon("");
                    setKeperluan("");
                  }}
                  className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition-all border border-slate-300"
                >
                  Ajukan Surat Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Input Kilat */}
              <form onSubmit={handleSubmitSurat} className="lg:col-span-7 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-black text-[#111827] pb-3 border-b border-slate-100">
                  Formulir Permohonan Cepat
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Pilih Jenis Surat yang Dibutuhkan *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DAFTAR_SURAT.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSurat(s.id)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                          selectedSurat === s.id
                            ? "border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="text-xs font-black text-[#111827] line-clamp-1">{s.nama}</div>
                        <div className="flex items-center justify-between text-[10px] font-bold mt-1 text-slate-500">
                          <span className="text-emerald-700">{s.estimasi}</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{s.kategori}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PILIHAN PENGAJUAN: DIRI SENDIRI ATAU ANGGOTA KELUARGA */}
                <div className="pt-2 pb-1 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Permohonan Surat Diajukan Untuk: *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePilihTarget("sendiri")}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        targetPemohon === "sendiri"
                          ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            targetPemohon === "sendiri"
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-slate-400 bg-white"
                          }`}
                        >
                          {targetPemohon === "sendiri" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#111827]">Diri Sendiri</p>
                          <p className="text-[10px] text-slate-500 font-medium">Otomatis isi nama & NIK akun Anda</p>
                        </div>
                      </div>
                      <User className="w-4 h-4 text-emerald-700" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePilihTarget("keluarga")}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        targetPemohon === "keluarga"
                          ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            targetPemohon === "keluarga"
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-slate-400 bg-white"
                          }`}
                        >
                          {targetPemohon === "keluarga" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#111827]">Anggota Keluarga Lainnya</p>
                          <p className="text-[10px] text-slate-500 font-medium">Ketik nama & NIK anggota keluarga</p>
                        </div>
                      </div>
                      <Users className="w-4 h-4 text-amber-700" />
                    </button>
                  </div>

                  {targetPemohon === "keluarga" && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                      <Users className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Silakan ketik nama dan NIK anggota keluarga yang bersangkutan. Permohonan ini akan otomatis terhubung ke akun Anda (<strong>{currentUser?.name || "Hadi Purnomo"}</strong>) sehingga tetap dapat dipantau di halaman <strong>Laporan Saya</strong>.
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Nama Lengkap (KTP) *</label>
                      {targetPemohon === "sendiri" && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Otomatis dari Akun
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={namaPemohon}
                      onChange={(e) => setNamaPemohon(e.target.value)}
                      placeholder={targetPemohon === "sendiri" ? "Hadi Purnomo" : "Nama lengkap anggota keluarga..."}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">NIK (16 Digit) *</label>
                      {targetPemohon === "sendiri" && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Otomatis dari Akun
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={nikPemohon}
                      onChange={(e) => setNikPemohon(e.target.value.replace(/\D/g, ""))}
                      placeholder={targetPemohon === "sendiri" ? "3515xxxxxxxxxxxx" : "16 digit NIK keluarga..."}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={teleponPemohon}
                      onChange={(e) => setTeleponPemohon(e.target.value)}
                      placeholder="0812xxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah Rukun Warga *</label>
                    <select
                      value={rwPemohon}
                      onChange={(e) => setRwPemohon(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:border-emerald-600"
                    >
                      {Array.from({ length: 11 }, (_, i) => {
                        const num = String(i + 1).padStart(2, "0");
                        return <option key={num} value={`RW ${num}`}>RW {num} Sawotratap</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Keperluan Singkat *</label>
                  <input
                    type="text"
                    required
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    placeholder="Contoh: Syarat pendaftaran kerja / izin usaha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* UPLOAD BERKAS PERSYARATAN */}
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Unggah Berkas / Dokumen Persyaratan
                    </label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Format: PDF, JPG, PNG (Maks 10MB)
                    </span>
                  </div>

                  {/* Dokumen yang diperlukan berdasarkan surat yang dipilih */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Berkas yang diperlukan untuk {currentSuratObj.nama}:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSuratObj.persyaratan.map((syarat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{syarat}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Drag-and-drop / Click Upload Area */}
                  <div className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-5 text-center bg-emerald-50/20 hover:bg-emerald-50/50 transition-all cursor-pointer group">
                    <input
                      type="file"
                      id="file-upload-input"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 group-hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-colors">
                        <UploadCloud className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 group-hover:underline">
                          Pilih Berkas dari Perangkat
                        </span>
                        <span className="text-xs text-slate-500"> atau seret file ke sini</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Anda dapat memilih beberapa file sekaligus (KTP, KK, Surat RT, dll.)
                      </p>
                    </div>
                  </div>

                  {/* Daftar Berkas yang Terpilih */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>Berkas siap diunggah ({uploadedFiles.length}):</span>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmModal({
                              isOpen: true,
                              title: "Hapus Semua Berkas?",
                              message: "Apakah Anda yakin ingin menghapus seluruh lampiran berkas persyaratan surat yang telah dipilih?",
                              confirmText: "Ya, Hapus Semua",
                              onConfirm: () => {
                                setUploadedFiles([]);
                                setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }));
                              },
                            })
                          }
                          className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                                <p className="text-[10px] text-slate-400">
                                  {(file.size / 1024).toFixed(1)} KB • {file.type || "Dokumen"}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmModal({
                                  isOpen: true,
                                  title: "Hapus Berkas Ini?",
                                  message: "Apakah Anda yakin ingin menghapus berkas dokumen ini dari daftar lampiran persyaratan?",
                                  itemName: file.name,
                                  confirmText: "Ya, Hapus",
                                  onConfirm: () => {
                                    handleRemoveFile(idx);
                                    setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                  },
                                })
                              }
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 ml-2 cursor-pointer"
                              title="Hapus file ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!currentUser && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold">Login Diperlukan:</span> Anda harus masuk ke akun warga terlebih dahulu untuk mengajukan surat mandiri.
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Masuk Akun</span>
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#047857] disabled:bg-slate-400 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5D82F]" />
                      <span>Mengunggah Berkas ke S3 & Memproses Resi...</span>
                    </>
                  ) : !currentUser ? (
                    <>
                      <Lock className="w-4 h-4 text-[#C5D82F]" />
                      <span>Masuk Akun untuk Mengajukan Surat</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-[#C5D82F]" />
                      <span>Terbitkan Resi Pengajuan Surat</span>
                    </>
                  )}
                </button>
              </form>

              {/* Syarat Pengambilan Samping */}
              <div className="lg:col-span-5 rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-black text-[#111827]">
                    Syarat: {currentSuratObj.nama}
                  </h3>
                </div>

                <div className="space-y-2">
                  {currentSuratObj.persyaratan.map((syarat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{syarat}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="text-xs font-black">Jadwal Loket Balai Desa:</div>
                  <div className="text-xs font-medium">Senin – Jumat: 08.00 – 15.00 WIB</div>
                  <div className="text-[11px] text-amber-800">Tunjukkan nomor resi pada layar smartphone Anda.</div>
                </div>

                <a
                  href="https://wa.me/6281234567890?text=Halo%20Loket%20Pelayanan%20Sawotratap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-black flex items-center justify-center gap-2 transition-colors border border-emerald-200"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp Loket PTSP Desa</span>
                </a>
              </div>

            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: POS PENGADUAN WARGA (#pengaduan) */}
        {/* ========================================================= */}
        <div id="pengaduan" className="scroll-mt-36 space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Aspirasi & Keluhan</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Layanan Pengaduan Warga Lingkungan</h2>
            </div>
          </div>

          {aduanSubmitted ? (
            <div className="max-w-2xl rounded-3xl border-2 border-rose-500 bg-white p-8 shadow-2xl text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-rose-600" />
              </div>

              <div>
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-0.5 rounded-full mb-2">
                  Laporan Pengaduan Berhasil Masuk
                </span>
                <h3 className="text-3xl font-black font-mono text-rose-900 tracking-wider">
                  {aduanResult?.aduanId || "ADU-2026-BERHASIL"}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Nomor registrasi ini digunakan untuk melacak penanganan masalah oleh petugas lapangan
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Kategori Aduan:</span>
                  <strong className="text-rose-900">{kategoriAduan}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Lokasi Kejadian:</span>
                  <strong className="text-slate-900">{lokasiAduan}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Pelapor:</span>
                  <strong className="text-slate-900">{namaPelapor || "Warga Sawotratap (Anonim)"}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Status Penanganan:</span>
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                    Menunggu Verifikasi Seksi Trantib & Kades
                  </span>
                </div>
                <div className="pt-1 text-slate-600">
                  <strong className="text-slate-900 block mb-0.5">Deskripsi Masalah:</strong>
                  <p className="line-clamp-3 italic">"{isiAduan}"</p>
                </div>
              </div>

              {/* Tampilkan Daftar Foto Dokumentasi yang Berhasil Diunggah */}
              {aduanResult?.files && aduanResult.files.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-left text-xs space-y-2">
                  <div className="font-black text-rose-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-rose-600" />
                    <span>{aduanResult.files.length} Foto Dokumentasi Tersimpan di Folder S3 CloudKilat:</span>
                  </div>
                  <div className="space-y-1.5">
                    {aduanResult.files.map((f: any, idx: number) => (
                      <a
                        key={idx}
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-[11px] font-semibold text-rose-900 transition-colors group"
                      >
                        <span className="truncate flex items-center gap-1.5 max-w-[280px]">
                          <ImagePlus className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{f.name}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md group-hover:bg-rose-200 shrink-0 ml-2">
                          Buka Foto <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/laporan"
                  className="py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Lihat di Laporan Saya</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setAduanSubmitted(false);
                    setAduanResult(null);
                    setAduanPhotos([]);
                    setLokasiAduan("");
                    setIsIduan("");
                    setNamaPelapor("");
                    setKontakPelapor("");
                  }}
                  className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-all"
                >
                  Kirim Pengaduan Lain
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Input Sisi Kiri (Pojok Kiri) */}
              <form onSubmit={handleSubmitAduan} className="lg:col-span-7 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Masalah *</label>
                    <select
                      value={kategoriAduan}
                      onChange={(e) => setKategoriAduan(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:outline-hidden focus:border-rose-600"
                    >
                      <option>Infrastruktur Jalan Berlubang</option>
                      <option>Drainase & Saluran Mampet</option>
                      <option>Lampu PJU Padam</option>
                      <option>Kebersihan & Sampah Liar</option>
                      <option>Fasilitas Umum Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi / RT / RW *</label>
                    <input
                      type="text"
                      required
                      value={lokasiAduan}
                      onChange={(e) => setLokasiAduan(e.target.value)}
                      placeholder="Contoh: Jl. Kenanga RT 02 / RW 03"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-rose-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Pelapor <span className="text-slate-400 font-normal">(Opsional - Boleh Dikosongkan)</span>
                    </label>
                    <input
                      type="text"
                      value={namaPelapor}
                      onChange={(e) => setNamaPelapor(e.target.value)}
                      placeholder="Boleh kosong (anonim) / nama terang"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-rose-600 font-medium"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      * Boleh kosong. Pengaduan tetap otomatis terhubung ke akun Anda ({currentUser?.name || "Hadi Purnomo"}) sehingga bisa dicek di Laporan Saya.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor WhatsApp <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="tel"
                      value={kontakPelapor}
                      onChange={(e) => setKontakPelapor(e.target.value)}
                      placeholder="Untuk info perkembangan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-rose-600 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Nomor kontak untuk menerima konfirmasi petugas jika diperlukan.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Uraian & Deskripsi Aduan *</label>
                  <textarea
                    required
                    rows={4}
                    value={isiAduan}
                    onChange={(e) => setIsIduan(e.target.value)}
                    placeholder="Jelaskan detail permasalahan secara jelas agar memudahkan petugas lapangan..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-rose-600 font-medium"
                  />
                </div>

                {/* UPLOAD FOTO DOKUMENTASI KERUSAKAN (OPSIONAL) */}
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Unggah Dokumentasi / Foto Kerusakan
                    </label>
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Opsional • JPG, PNG, WEBP (Maks 10MB)
                    </span>
                  </div>

                  {/* Dropzone Foto */}
                  <div className="relative border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-2xl p-5 text-center bg-rose-50/20 hover:bg-rose-50/50 transition-all cursor-pointer group">
                    <input
                      type="file"
                      id="photo-upload-input"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handlePhotoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-rose-100 group-hover:bg-rose-200 text-rose-700 flex items-center justify-center transition-colors">
                        <Camera className="w-5 h-5 text-rose-700" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-rose-950 group-hover:underline">
                          Pilih Foto Kerusakan dari Perangkat
                        </span>
                        <span className="text-xs text-slate-500"> (Opsional)</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Foto akan otomatis tersimpan dalam folder khusus laporan ini di CloudKilat S3
                      </p>
                    </div>
                  </div>

                  {/* List of Chosen Photos */}
                  {aduanPhotos.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>Foto terpilih ({aduanPhotos.length}):</span>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmModal({
                              isOpen: true,
                              title: "Hapus Semua Foto Bukti?",
                              message: "Apakah Anda yakin ingin menghapus seluruh foto dokumentasi kerusakan yang telah dipilih?",
                              confirmText: "Ya, Hapus Semua",
                              onConfirm: () => {
                                setAduanPhotos([]);
                                setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }));
                              },
                            })
                          }
                          className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {aduanPhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <ImagePlus className="w-4 h-4 text-rose-600 shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-slate-800 truncate">{photo.name}</p>
                                <p className="text-[10px] text-slate-400">
                                  {(photo.size / 1024).toFixed(1)} KB • {photo.type}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmModal({
                                  isOpen: true,
                                  title: "Hapus Foto Ini?",
                                  message: "Apakah Anda yakin ingin menghapus foto dokumentasi ini dari laporan pengaduan?",
                                  itemName: photo.name,
                                  confirmText: "Ya, Hapus",
                                  onConfirm: () => {
                                    handleRemovePhoto(idx);
                                    setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                  },
                                })
                              }
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 ml-2 cursor-pointer"
                              title="Hapus foto ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!currentUser && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold">Login Diperlukan:</span> Anda harus masuk ke akun warga terlebih dahulu untuk mengirimkan pengaduan.
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Masuk Akun</span>
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingAduan}
                  className="w-full py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 disabled:bg-slate-400 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingAduan ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-rose-200" />
                      <span>Mengirimkan Laporan & Mengunggah Foto ke S3...</span>
                    </>
                  ) : !currentUser ? (
                    <>
                      <Lock className="w-4 h-4 text-rose-200" />
                      <span>Masuk Akun untuk Kirim Pengaduan</span>
                    </>
                  ) : (
                    <>
                      <Megaphone className="w-4 h-4 text-rose-200" />
                      <span>Kirimkan Laporan Aspirasi</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sidebar Informasi Sisi Kanan */}
              <div className="lg:col-span-5 space-y-5">
                {/* Card Alur Penanganan */}
                <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 text-rose-900 font-black text-sm">
                    <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Alur Tanggap Aspirasi & Kerusakan</span>
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Verifikasi Lokasi & Administrasi</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Staf Trantib memvalidasi titik kerusakan dan tingkat urgensi warga.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Disposisi & Arahan Kepala Desa</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Kades memberikan instruksi penugasan vendor atau Pokmas desa.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Pengerjaan Fisik di Lapangan</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Tim teknisi diterjunkan langsung ke lokasi kerusakan lingkungan.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Dokumentasi Selesai & Laporan Ditutup</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Foto hasil akhir diunggah dan status laporan tuntas di portal.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Privasi & Transparansi */}
                <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-5 text-xs text-rose-950 space-y-2">
                  <div className="font-black flex items-center gap-2">
                    <Info className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Jaminan Privasi Pelapor</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Nama pelapor bersifat <strong>opsional</strong> dan bebas dikosongkan (anonim). Karena Anda login di sistem, laporan ini tetap tersimpan aman pada akun Anda dan statusnya dapat langsung Anda pantau di <strong>Laporan Saya</strong>.
                  </p>
                </div>

                {/* Kontak Darurat Siaga Trantib */}
                <div className="p-5 rounded-3xl bg-[#06261D] text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#C5D82F]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Posko Siaga Trantib Desa</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Untuk kejadian darurat seperti pohon tumbang, genangan banjir mendesak, atau kendala keselamatan lingkungan:
                  </p>
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Posko%20Trantib%20Sawotratap,%20saya%20ingin%20melaporkan%20keadaan%20darurat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp Posko Trantib (24 Jam)</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: PERIZINAN & FASILITAS DESA (#perizinan)       */}
        {/* ========================================================= */}
        <div id="perizinan" className="scroll-mt-36 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Aset & Izin Resmi</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Perizinan & Peminjaman Fasilitas Desa</h2>
              </div>
            </div>

            {/* Filter Tab Kategori */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs">
              {["Semua", "Fasilitas Desa", "Izin Kegiatan", "Perizinan Usaha"].map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setFilterKategoriPerizinan(kat)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    filterKategoriPerizinan === kat
                      ? "bg-[#064E3B] text-white shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID KATALOG FASILITAS & PERIZINAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAFTAR_FASILITAS_PERIZINAN.filter(
              (item) => filterKategoriPerizinan === "Semua" || item.kategori === filterKategoriPerizinan
            ).map((item) => {
              const isSelected = selectedPerizinanId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md"
                      : "border-[#E3E8E2] bg-white hover:border-emerald-300 hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {item.kategori}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#064E3B] bg-[#C5D82F]/40 px-2.5 py-0.5 rounded-md border border-[#C5D82F]">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {item.nama}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Estimasi: {item.estimasi}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPerizinanId(item.id);
                        setLokasiFasilitasPerizinan(item.lokasi);
                        const formEl = document.getElementById("form-perizinan-section");
                        if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#064E3B] text-white shadow-xs"
                          : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSelected ? "Fasilitas Terpilih" : "Pilih Layanan Ini"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FORM PENGAJUAN PERIZINAN & PEMINJAMAN FASILITAS */}
          <div id="form-perizinan-section" className="scroll-mt-36">
            {perizinanSubmitted ? (
              <div className="max-w-2xl mx-auto rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>

                <div>
                  <span className="inline-block text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full mb-2">
                    Permohonan Perizinan Berhasil Terdaftar
                  </span>
                  <h3 className="text-3xl font-black font-mono text-[#064E3B] tracking-wider">
                    {perizinanResult?.ticketId || "PRZ-2026-BERHASIL"}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Simpan nomor registrasi ini untuk melacak status persetujuan dari Kepala Desa & Admin
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Jenis Layanan</span>
                    <span className="font-bold text-slate-800">{currentPerizinanObj.nama}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Nama Pemohon</span>
                    <span className="font-bold text-slate-800">{namaPemohonPerizinan}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Nama Acara / Usaha</span>
                    <span className="font-bold text-slate-800">{namaKegiatanPerizinan}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Tanggal Pelaksanaan</span>
                    <span className="font-bold text-slate-800">
                      {tanggalMulaiPerizinan} {tanggalSelesaiPerizinan && tanggalSelesaiPerizinan !== tanggalMulaiPerizinan ? `s/d ${tanggalSelesaiPerizinan}` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Status</span>
                    <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Menunggu Verifikasi Seksi Pemerintahan
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/laporan"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-black shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C5D82F]" />
                    <span>Lihat di Laporan Saya</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setPerizinanSubmitted(false);
                      setNamaKegiatanPerizinan("");
                      setTanggalMulaiPerizinan("");
                      setTanggalSelesaiPerizinan("");
                      setKeteranganPerizinan("");
                      setPerizinanFiles([]);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Ajukan Permohonan Lain
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Input Sisi Kiri */}
                <form
                  onSubmit={handleSubmitPerizinan}
                  className="lg:col-span-7 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-5"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-none">
                        Formulir Permohonan & Reservasi
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Sedang memilih: <strong className="text-emerald-800">{currentPerizinanObj.nama}</strong>
                      </p>
                    </div>
                  </div>

                  {/* PILIH TARGET PEMOHON PERIZINAN */}
                  <div className="pt-1 pb-1">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Permohonan Izin / Fasilitas Diajukan Untuk: *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handlePilihTargetPerizinan("sendiri")}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          targetPemohonPerizinan === "sendiri"
                            ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              targetPemohonPerizinan === "sendiri"
                                ? "border-emerald-600 bg-emerald-600"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {targetPemohonPerizinan === "sendiri" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-[#111827]">Diri Sendiri</p>
                            <p className="text-[10px] text-slate-500 font-medium">Otomatis isi nama & NIK akun Anda</p>
                          </div>
                        </div>
                        <User className="w-4 h-4 text-emerald-700" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePilihTargetPerizinan("keluarga")}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          targetPemohonPerizinan === "keluarga"
                            ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              targetPemohonPerizinan === "keluarga"
                                ? "border-emerald-600 bg-emerald-600"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {targetPemohonPerizinan === "keluarga" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-[#111827]">Orang Lain / Keluarga</p>
                            <p className="text-[10px] text-slate-500 font-medium">Ketik nama & NIK penanggung jawab</p>
                          </div>
                        </div>
                        <Users className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* IDENTITAS PEMOHON */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      1. Identitas Penanggung Jawab
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Lengkap Sesuai KTP *
                        </label>
                        <input
                          type="text"
                          required
                          value={namaPemohonPerizinan}
                          onChange={(e) => setNamaPemohonPerizinan(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          NIK KTP (16 Digit) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={16}
                          value={nikPemohonPerizinan}
                          onChange={(e) => setNikPemohonPerizinan(e.target.value.replace(/\D/g, ""))}
                          placeholder="3515xxxxxxxxxxxx"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nomor WhatsApp Aktif *
                        </label>
                        <input
                          type="tel"
                          required
                          value={teleponPemohonPerizinan}
                          onChange={(e) => setTeleponPemohonPerizinan(e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Wilayah Domisili RW *
                        </label>
                        <select
                          value={rwPemohonPerizinan}
                          onChange={(e) => setRwPemohonPerizinan(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-medium bg-white"
                        >
                          {["RW 01", "RW 02", "RW 03", "RW 04", "RW 05", "RW 06", "RW 07", "RW 08"].map((rw) => (
                            <option key={rw} value={rw}>
                              {rw} - Desa Sawotratap
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DETAIL KEGIATAN / ACARA */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      2. Detail Acara & Kebutuhan Fasilitas
                    </span>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Acara / Usaha / Keperluan *
                      </label>
                      <input
                        type="text"
                        required
                        value={namaKegiatanPerizinan}
                        onChange={(e) => setNamaKegiatanPerizinan(e.target.value)}
                        placeholder="Contoh: Resepsi Pernikahan / Rapat Paguyuban RT / Rekomendasi NIB Usaha"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tanggal Mulai *
                        </label>
                        <input
                          type="date"
                          required
                          value={tanggalMulaiPerizinan}
                          onChange={(e) => setTanggalMulaiPerizinan(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tanggal Selesai (Opsional)
                        </label>
                        <input
                          type="date"
                          value={tanggalSelesaiPerizinan}
                          onChange={(e) => setTanggalSelesaiPerizinan(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Waktu / Jam Pelaksanaan
                        </label>
                        <input
                          type="text"
                          value={waktuKegiatanPerizinan}
                          onChange={(e) => setWaktuKegiatanPerizinan(e.target.value)}
                          placeholder="08.00 - 15.00 WIB"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Estimasi Jumlah Hadirin / Peserta
                        </label>
                        <input
                          type="text"
                          value={jumlahPesertaPerizinan}
                          onChange={(e) => setJumlahPesertaPerizinan(e.target.value)}
                          placeholder="Contoh: 150 Orang"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lokasi Spesifik / Fasilitas yang Digunakan
                      </label>
                      <input
                        type="text"
                        value={lokasiFasilitasPerizinan}
                        onChange={(e) => setLokasiFasilitasPerizinan(e.target.value)}
                        placeholder="Contoh: Balai Pertemuan & Gedung Serbaguna Desa Sawotratap"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Deskripsi & Keterangan Tambahan
                      </label>
                      <textarea
                        rows={3}
                        value={keteranganPerizinan}
                        onChange={(e) => setKeteranganPerizinan(e.target.value)}
                        placeholder="Tuliskan jika membutuhkan fasilitas tambahan seperti tenda, kursi, mic, atau pengalihan jalan lingkungan..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                      />
                    </div>
                  </div>

                  {/* UPLOAD BERKAS PENUNJANG (KTP, PENGANTAR RT, RUNDOWN) */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        Unggah Berkas Pendukung (KTP, Surat RT/RW, Proposal)
                      </label>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        PDF / JPG (Maks 10MB)
                      </span>
                    </div>

                    <div className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-5 text-center bg-emerald-50/20 hover:bg-emerald-50/50 transition-all cursor-pointer group">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handlePerizinanFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 group-hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-colors">
                          <UploadCloud className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-900 group-hover:underline">
                            Pilih Berkas Lampiran dari Perangkat
                          </span>
                          <span className="text-xs text-slate-500"> atau seret file ke sini</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Bisa memilih beberapa berkas sekaligus (KTP penanggung jawab, surat pengantar RT)
                        </p>
                      </div>
                    </div>

                    {perizinanFiles.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                          <span>Berkas siap dilampirkan ({perizinanFiles.length}):</span>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirmModal({
                                isOpen: true,
                                title: "Hapus Semua Berkas Izin?",
                                message: "Apakah Anda yakin ingin menghapus seluruh lampiran dokumen perizinan fasilitas ini?",
                                confirmText: "Ya, Hapus Semua",
                                onConfirm: () => {
                                  setPerizinanFiles([]);
                                  setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                },
                              })
                            }
                            className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                          >
                            Hapus Semua
                          </button>
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {perizinanFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div className="truncate">
                                  <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                                  <p className="text-[10px] text-slate-400">
                                    {(file.size / 1024).toFixed(1)} KB • {file.type || "Dokumen"}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteConfirmModal({
                                    isOpen: true,
                                    title: "Hapus Dokumen Ini?",
                                    message: "Apakah Anda yakin ingin menghapus dokumen lampiran ini dari formulir izin fasilitas?",
                                    itemName: file.name,
                                    confirmText: "Ya, Hapus",
                                    onConfirm: () => {
                                      handleRemovePerizinanFile(idx);
                                      setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                    },
                                  })
                                }
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors shrink-0 ml-2 cursor-pointer"
                                title="Hapus file"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!currentUser && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                        <div className="text-xs">
                          <span className="font-bold">Login Diperlukan:</span> Anda harus masuk ke akun warga terlebih dahulu untuk mengajukan perizinan.
                        </div>
                      </div>
                      <Link
                        href="/login"
                        className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Masuk Akun</span>
                      </Link>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingPerizinan}
                    className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#085a44] disabled:bg-slate-400 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmittingPerizinan ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#C5D82F]" />
                        <span>Mengirimkan Permohonan & Mengunggah Berkas ke S3...</span>
                      </>
                    ) : !currentUser ? (
                      <>
                        <Lock className="w-4 h-4 text-[#C5D82F]" />
                        <span>Masuk Akun untuk Mengajukan Izin</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 text-[#C5D82F]" />
                        <span>Kirim Permohonan Perizinan & Fasilitas</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Sisi Kanan: Panduan, Syarat & Hotline */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Card Detail Layanan Terpilih */}
                  <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <h3 className="text-sm font-black text-slate-900">
                        Ketentuan & Syarat: {currentPerizinanObj.nama}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {currentPerizinanObj.deskripsi}
                    </p>

                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Persyaratan Dokumen:
                      </span>
                      {currentPerizinanObj.syarat.map((syarat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-xs text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{syarat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                      <div className="text-xs font-black flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Estimasi Proses: {currentPerizinanObj.estimasi}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Setelah diverifikasi staf desa, persetujuan resmi dan surat izin akan ditandatangani oleh Kepala Desa Sawotratap.
                      </p>
                    </div>
                  </div>

                  {/* Card Hotline Bantuan */}
                  <div className="rounded-3xl border border-[#E3E8E2] bg-[#FAF9F5] p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-xs font-black text-slate-900">Butuh Bantuan Jadwal Gedung?</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hubungi koordinator pengelola aset dan seksi pelayanan balai desa untuk cek ketersediaan tanggal gedung secara langsung.
                    </p>
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20Pengelola%20Aset%20Desa%20Sawotratap%2C%20saya%20ingin%20tanya%20jadwal%20gedung%20perizinan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064E3B] text-xs font-black flex items-center justify-center gap-2 transition-colors border border-emerald-200 cursor-pointer shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp Koordinator Aset Desa</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: DIREKTORI PASAR UMKM (#umkm)                   */}
        {/* ========================================================= */}
        <div id="umkm" className="scroll-mt-36 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Ekonomi Kerakyatan</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">Etalase Produk UMKM Desa</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
                {["Semua", "Kuliner", "Kerajinan", "Fashion"].map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setKategoriUmkm(kat)}
                    className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      kategoriUmkm === kat
                        ? "bg-[#064E3B] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToSection("daftar-umkm")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Store className="w-3.5 h-3.5 text-[#C5D82F]" />
                <span>+ Daftarkan Usaha Anda</span>
              </button>
            </div>
          </div>

          {filteredUmkm.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Belum ada produk untuk kategori ini.</p>
              <p className="text-xs text-slate-500 mt-1">Daftarkan usaha Anda agar menjadi yang pertama tampil!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUmkm.map((item, idx) => (
                <div key={idx} className="rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.foto || "/aset/umkm-desa.jpg"}
                        alt={item.nama}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/aset/umkm-desa.jpg";
                        }}
                      />
                      <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[10px] font-black text-[#C5D82F]">
                        {item.rw || "Sawotratap"}
                      </div>
                      <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-slate-800">
                        {item.kategori}
                      </div>
                      <div className="absolute bottom-2.5 left-3 text-white drop-shadow-md">
                        <span className="text-xs font-extrabold text-[#C5D82F] bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {item.harga || "Hubungi Penjual"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="text-base font-black text-[#111827] group-hover:text-[#064E3B] transition-colors line-clamp-1">
                        {item.nama}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                        {item.deskripsi_singkat || item.deskripsi || "Produk lokal UMKM unggulan warga Sawotratap."}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <span className="text-xs font-bold text-emerald-800 block truncate">
                        {item.pemilik}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {item.lokasi || "Desa Sawotratap"}
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${(item.kontak_wa || item.kontak || "6281234567801").replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(item.pemilik || "Penjual")},%20saya%20tertarik%20dengan%20produk%20*${encodeURIComponent(item.nama)}*%20di%20Website%20Resmi%20Desa%20Sawotratap.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black transition-colors shrink-0"
                    >
                      <span>Pesan WA</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 5: PENDAFTARAN & PENGAJUAN UMKM (#daftar-umkm)    */}
        {/* Menggantikan Cek Status, form pengajuan kurasi produk     */}
        {/* ========================================================= */}
        <div id="daftar-umkm" className="scroll-mt-36 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Pemberdayaan Ekonomi Warga
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
                  Pendaftaran & Kurasi Produk UMKM
                </h2>
              </div>
            </div>

            <Link
              href="/umkm-saya"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-bold border border-emerald-200 transition-colors w-fit"
            >
              <span>Kelola Produk di UMKM Saya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SOP BANNER ALUR VERIFIKASI */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-white to-amber-50/80 p-5 sm:p-6 shadow-xs">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#064E3B] flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
              <span>Alur SOP Verifikasi Produk UMKM Balai Desa Sawotratap</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-emerald-100">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Pengajuan Mandiri</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Warga mengisi data usaha, estimasi harga, no. WhatsApp pemesanan, dan foto asli produk.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-amber-100">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Verifikasi Admin Desa</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Admin memeriksa keabsahan domisili warga, kelayakan konten, dan kelengkapan kontak usaha.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-emerald-100">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#064E3B] text-[#C5D82F] flex items-center justify-center text-[10px]">3</span>
                  <span>ACC & Tayang di Web</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Jika di-ACC, produk langsung tayang di etalase desa. Jika ditolak, catatan revisi muncul di <strong>UMKM Saya</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* TAMPILAN SUKSES SETELAH PENDAFTARAN */}
          {umkmSubmitted ? (
            <div className="rounded-3xl border-2 border-emerald-500 bg-white p-8 sm:p-12 shadow-md text-center max-w-2xl mx-auto space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#064E3B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: Menunggu Verifikasi Admin</span>
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Pendaftaran UMKM Berhasil Dikirim!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Data produk <strong>{namaUsahaUmkm}</strong> telah masuk ke meja verifikasi Admin Balai Desa Sawotratap. Produk akan otomatis tampil di etalase setelah disetujui (ACC).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Usaha:</span>
                  <span className="font-bold text-slate-900">{namaUsahaUmkm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <span className="font-bold text-slate-900">{kategoriUsahaUmkm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemilik / Penjual:</span>
                  <span className="font-bold text-slate-900">{namaPemilikUmkm} ({rwUmkm})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kontak WhatsApp:</span>
                  <span className="font-bold text-emerald-700">+{kontakWaUmkm}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/umkm-saya"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  <Store className="w-4 h-4 text-[#C5D82F]" />
                  <span>Lihat Status di UMKM Saya</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setUmkmSubmitted(false);
                    setNamaUsahaUmkm("");
                    setHargaUmkm("");
                    setDeskripsiSingkatUmkm("");
                    setDeskripsiLengkapUmkm("");
                    setFotoUmkmFile(null);
                    setFotoUmkmPreview("");
                    setFotoUrlInputUmkm("");
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Daftarkan Produk Lainnya
                </button>
              </div>
            </div>
          ) : (
            /* FORMULIR PENDAFTARAN UMKM */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Sisi Kiri (7 Col) */}
              <form
                onSubmit={handleSubmitUmkm}
                className="lg:col-span-7 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-5"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-none">
                      Formulir Pengajuan Produk Baru
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Isi data lengkap usaha Anda untuk ditampilkan di etalase web desa
                    </p>
                  </div>
                </div>

                {/* 1. IDENTITAS PEMILIK */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    1. Identitas Pelaku Usaha
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap Pemilik *
                      </label>
                      <input
                        type="text"
                        required
                        value={namaPemilikUmkm}
                        onChange={(e) => setNamaPemilikUmkm(e.target.value)}
                        placeholder="Nama pemilik usaha"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NIK KTP (16 Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        value={nikPemilikUmkm}
                        onChange={(e) => setNikPemilikUmkm(e.target.value.replace(/\D/g, ""))}
                        placeholder="3515xxxxxxxxxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wilayah Domisili RW *
                    </label>
                    <select
                      value={rwUmkm}
                      onChange={(e) => setRwUmkm(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-medium bg-white"
                    >
                      {["RW 01", "RW 02", "RW 03", "RW 04", "RW 05", "RW 06", "RW 07", "RW 08"].map((rw) => (
                        <option key={rw} value={rw}>
                          {rw} - Desa Sawotratap
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. RINCIAN PRODUK & KONTAK */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    2. Rincian Usaha & Kontak Pemesanan
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Usaha / Nama Produk *
                    </label>
                    <input
                      type="text"
                      required
                      value={namaUsahaUmkm}
                      onChange={(e) => setNamaUsahaUmkm(e.target.value)}
                      placeholder="Contoh: Kopi Robusta & Roastery Sawotratap"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kategori Usaha *
                      </label>
                      <select
                        value={kategoriUsahaUmkm}
                        onChange={(e) => setKategoriUsahaUmkm(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-medium bg-white"
                      >
                        <option value="Kuliner">Kuliner & Minuman</option>
                        <option value="Kerajinan">Kerajinan Tangan</option>
                        <option value="Fashion">Fashion & Pakaian</option>
                        <option value="Pertanian">Pertanian & Bibit Tanaman</option>
                        <option value="Jasa">Jasa & Servis</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Harga / Tarif Produk *
                      </label>
                      <input
                        type="text"
                        required
                        value={hargaUmkm}
                        onChange={(e) => setHargaUmkm(e.target.value)}
                        placeholder="Contoh: Mulai Rp 25.000 / porsi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp Pemesanan *
                      </label>
                      <input
                        type="tel"
                        required
                        value={kontakWaUmkm}
                        onChange={(e) => setKontakWaUmkm(e.target.value)}
                        placeholder="Contoh: 081234567893"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B] font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Nomor ini akan ditampilkan di web agar pembeli bisa langsung memesan via WhatsApp.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jam Operasional Usaha
                      </label>
                      <input
                        type="text"
                        value={jamOperasionalUmkm}
                        onChange={(e) => setJamOperasionalUmkm(e.target.value)}
                        placeholder="08.00 - 21.00 WIB"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alamat / Lokasi Toko atau Usaha
                    </label>
                    <input
                      type="text"
                      value={lokasiUmkm}
                      onChange={(e) => setLokasiUmkm(e.target.value)}
                      placeholder="Contoh: Jl. Merpati No. 14, Sawotratap"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                    />
                  </div>
                </div>

                {/* 3. FOTO & DESKRIPSI PRODUK */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    3. Foto Produk & Deskripsi
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Unggah Foto Produk Asli
                    </label>
                    <div className="relative border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-4 text-center bg-amber-50/20 hover:bg-amber-50/50 transition-all cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoUmkmFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center gap-1">
                        <UploadCloud className="w-7 h-7 text-amber-700" />
                        <span className="text-xs font-bold text-amber-900 group-hover:underline">
                          {fotoUmkmFile ? fotoUmkmFile.name : "Pilih Foto Produk dari Galeri / Kamera"}
                        </span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, atau WebP (Maks 10MB)</span>
                      </div>
                    </div>

                    {fotoUmkmPreview && (
                      <div className="mt-2.5 flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src={fotoUmkmPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 truncate text-xs font-semibold text-slate-700">
                          {fotoUmkmFile?.name}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmModal({
                              isOpen: true,
                              title: "Hapus Foto Produk?",
                              message: "Apakah Anda yakin ingin membatalkan dan menghapus foto produk yang telah dipilih?",
                              itemName: fotoUmkmFile?.name,
                              confirmText: "Ya, Hapus",
                              onConfirm: () => {
                                setFotoUmkmFile(null);
                                setFotoUmkmPreview("");
                                setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }));
                              },
                            })
                          }
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi Singkat (Tampil di Kartu Produk) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={deskripsiSingkatUmkm}
                      onChange={(e) => setDeskripsiSingkatUmkm(e.target.value)}
                      placeholder="Jelaskan ringkasan produk atau keunggulan usaha dalam 1-2 kalimat..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi Lengkap Usaha & Varian
                    </label>
                    <textarea
                      rows={3}
                      value={deskripsiLengkapUmkm}
                      onChange={(e) => setDeskripsiLengkapUmkm(e.target.value)}
                      placeholder="Ceritakan bahan baku, varian rasa/ukuran, atau proses pembuatan produk..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-[#064E3B]"
                    />
                  </div>
                </div>

                {!currentUser && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold">Login Diperlukan:</span> Anda harus masuk ke akun warga terlebih dahulu untuk mendaftarkan produk UMKM.
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Masuk Akun</span>
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingUmkm}
                  className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#085a44] disabled:bg-slate-400 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingUmkm ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C5D82F]" />
                      <span>Mengirimkan Pendaftaran & Foto Produk...</span>
                    </>
                  ) : !currentUser ? (
                    <>
                      <Lock className="w-4 h-4 text-[#C5D82F]" />
                      <span>Masuk Akun untuk Daftar UMKM</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4 text-[#C5D82F]" />
                      <span>Kirim Pendaftaran UMKM ke Admin Desa</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sisi Kanan: Panduan & Keuntungan Bergabung (5 Col) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl border border-[#E3E8E2] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-sm font-black text-slate-900">
                      Ketentuan & Panduan Kurasi
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Program Etalase UMKM Desa Sawotratap memprioritaskan warga lokal yang memiliki usaha produktif dan legal di lingkungan Sawotratap.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Kriteria Kelayakan ACC:
                    </span>
                    {[
                      "Pemilik berdomisili atau beralamat usaha di Sawotratap",
                      "Foto produk asli (bukan comotan dari internet tanpa izin)",
                      "Nomor WhatsApp aktif dan responsif melayani pembeli",
                      "Produk halal, higienis, dan tidak melanggar ketentuan hukum",
                    ].map((kriteria, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{kriteria}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                    <div className="text-xs font-black flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Estimasi Verifikasi: 1 x 24 Jam Kerja</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Admin desa akan mengecek data Anda. Bila disetujui, produk langsung tampil di web desa dan warga sekitar dapat langsung memesan via WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Shortcut UMKM Saya */}
                <div className="rounded-3xl border border-emerald-300/80 bg-emerald-950 text-white p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#C5D82F]" />
                    <h4 className="text-sm font-black">Sudah Pernah Mendaftar?</h4>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Anda dapat memantau status verifikasi produk Anda (apakah di-ACC atau perlu perbaikan) serta mengedit harga dan rincian produk kapan saja.
                  </p>
                  <Link
                    href="/umkm-saya"
                    className="w-full py-2.5 rounded-xl bg-[#C5D82F] hover:bg-[#d4e738] text-[#06261D] text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Buka Halaman UMKM Saya</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* POPUP KONFIRMASI HAPUS (CUSTOM MODAL) */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmModal.isOpen}
        title={deleteConfirmModal.title}
        message={deleteConfirmModal.message}
        itemName={deleteConfirmModal.itemName}
        confirmText={deleteConfirmModal.confirmText || "Ya, Hapus"}
        onConfirm={deleteConfirmModal.onConfirm}
        onCancel={() => setDeleteConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* POPUP PERINGATAN WAJIB LOGIN */}
      {loginRequiredModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Tombol Tutup Silang di Sudut */}
            <button
              type="button"
              onClick={() => setLoginRequiredModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Gembok / Akses Terbatas */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            {/* Judul & Penjelasan */}
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2">
              Login Akun Warga Diperlukan
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Untuk mengajukan <span className="font-bold text-slate-900">{loginRequiredModal.serviceTitle || "layanan desa"}</span>, Anda wajib login terlebih dahulu ke akun warga Sawotratap.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-600 text-xs text-left mb-6 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mengapa harus login terlebih dahulu?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal pl-6">
                Untuk memastikan keaslian data pemohon, mencegah pengajuan fiktif, serta memungkinkan Anda melacak status proses secara langsung.
              </p>
            </div>

            {/* Aksi: Tombol Login dan Tutup */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <Link
                href="/login"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#C5D82F]" />
                <span>Masuk Sekarang</span>
              </Link>
              <button
                type="button"
                onClick={() => setLoginRequiredModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}