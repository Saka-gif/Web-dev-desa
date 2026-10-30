"use client";

import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Users,
  FileText,
  CheckCircle2,
  Sparkles,
  MapPin,
  HeartHandshake,
  Layers,
  ChevronRight,
  Info,
  Award,
  BookOpen,
} from "lucide-react";

export interface HierarkiNode {
  id: string;
  label: string;
  subLabel?: string;
  category: "pimpinan" | "mitra" | "sekretariat" | "kaur-sekretariat" | "kasi" | "kaur-teknis" | "kadus" | "kaur-wilayah" | "lkd";
  level: "Pimpinan Utama" | "Mitra Legislasi & Pengawasan" | "Koordinator Sekretariat" | "Pelaksana Teknis" | "Staf Urusan (Kaur)" | "Unsur Kewilayahan" | "Lembaga Kemasyarakatan";
  type: "dark" | "light"; // dark = Hijau Tua (#124B28), light = Hijau Muda (#62A654)
  lineType: "komando" | "koordinasi";
  pejabat?: string;
  tupoksi: string;
  rincianTugas: string[];
  dasarHukum?: string;
  parent?: string;
}

export const HIERARKI_DATA: Record<string, HierarkiNode> = {
  kades: {
    id: "kades",
    label: "Kepala Desa",
    subLabel: "Pimpinan Eksekutif Tertinggi",
    category: "pimpinan",
    level: "Pimpinan Utama",
    type: "dark",
    lineType: "komando",
    pejabat: "H. Bambang Sutrisno, S.T.",
    tupoksi: "Memimpin penyelenggaraan pemerintahan desa, pembinaan kemasyarakatan, pelaksanaan pembangunan, dan penanggung jawab penuh keuangan desa (APBDes).",
    rincianTugas: [
      "Menetapkan Peraturan Desa (Perdes) yang telah disepakati bersama BPD.",
      "Memegang kekuasaan pengelolaan keuangan dan aset desa secara transparan.",
      "Membina ketentraman dan ketertiban masyarakat serta mengoordinasikan pembangunan wilayah.",
      "Mewakili desa di dalam dan di luar pengadilan atau menunjuk kuasa hukum.",
    ],
    dasarHukum: "Pasal 26 UU No. 6 Tahun 2014 tentang Desa",
  },
  bpd: {
    id: "bpd",
    label: "BPD",
    subLabel: "(Badan Permusyawaratan Desa)",
    category: "mitra",
    level: "Mitra Legislasi & Pengawasan",
    type: "light",
    lineType: "koordinasi",
    pejabat: "H. Moh. Sholeh, S.H. (Ketua BPD)",
    tupoksi: "Lembaga permusyawaratan desa yang menampung aspirasi masyarakat, menyusun regulasi desa, serta mengawasi kinerja Kepala Desa.",
    rincianTugas: [
      "Membahas dan menyepakati Rancangan Peraturan Desa bersama Kepala Desa.",
      "Menampung dan menyalurkan aspirasi masyarakat dari seluruh 11 RW.",
      "Melakukan pengawasan terhadap kinerja penyelenggaraan pemerintahan desa.",
      "Mengadakan Musyawarah Desa (Musdes) untuk isu-isu strategis warga.",
    ],
    dasarHukum: "Permendagri No. 110 Tahun 2016 tentang BPD",
  },
  lpm: {
    id: "lpm",
    label: "LPM Desa",
    subLabel: "Lembaga Pemberdayaan Masyarakat",
    category: "mitra",
    level: "Mitra Legislasi & Pengawasan",
    type: "dark",
    lineType: "koordinasi",
    pejabat: "Mitra Lembaga Warga",
    tupoksi: "Mitra strategis pemerintah desa dalam menumbuhkan dan menggerakkan partisipasi gotong royong masyarakat dalam pembangunan desa.",
    rincianTugas: [
      "Menyusun rencana pembangunan partisipatif berbasis aspirasi akar rumput.",
      "Menggerakkan swadaya dan gotong royong warga dalam proyek pembangunan.",
      "Mendampingi pelaksanaan dan pemeliharaan hasil-hasil pembangunan desa.",
      "Mendorong peningkatan kualitas sumber daya manusia dan kepedulian lingkungan.",
    ],
    dasarHukum: "Permendagri No. 18 Tahun 2018 tentang LKD & LAD",
  },
  sekdes: {
    id: "sekdes",
    label: "Sekretaris Desa",
    subLabel: "Koordinator Administrasi",
    category: "sekretariat",
    level: "Koordinator Sekretariat",
    type: "dark",
    lineType: "komando",
    pejabat: "Dra. Siti Rahmawati",
    tupoksi: "Membantu Kepala Desa dalam mengoordinasikan seluruh urusan administrasi ketatausahaan, keuangan, perencanaan, dan pelayanan umum.",
    rincianTugas: [
      "Mengoordinasikan penyusunan kebijakan, rancangan Perdes, dan RKPDes.",
      "Memverifikasi dokumen pengeluaran dan laporan pertanggungjawaban keuangan (SPJ).",
      "Memimpin dan membina seluruh Kepala Urusan (Kaur) di lingkungan sekretariat.",
      "Mengelola administrasi kepegawaian dan inventarisasi aset desa.",
    ],
    dasarHukum: "Permendagri No. 84 Tahun 2015 Pasal 7",
  },
  kaur_tu_perencanaan: {
    id: "kaur_tu_perencanaan",
    label: "KAUR. TU, Umum & Perencanaan",
    subLabel: "Tata Usaha & Dokumen Pembangunan",
    category: "kaur-sekretariat",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    pejabat: "Nurul Hidayati & M. Choirul Anam, S.Pd.",
    tupoksi: "Mengelola ketatausahaan, korespondensi dinas, pengadaan logistik, aset desa, serta dokumen perencanaan jangka menengah dan tahunan.",
    rincianTugas: [
      "Mengelola naskah dinas, ekspedisi surat masuk-keluar, dan arsip desa.",
      "Mencatat dan memelihara buku inventaris barang serta aset desa.",
      "Menyusun dokumen perencanaan desa (RPJMDes, RKPDes, dan Profil Desa).",
      "Mempersiapkan musyawarah rencana pembangunan desa (Musrenbangdes).",
    ],
    parent: "sekdes",
  },
  kaur_keuangan: {
    id: "kaur_keuangan",
    label: "KAUR. Keuangan",
    subLabel: "Bendahara & Pengelolaan APBDes",
    category: "kaur-sekretariat",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    pejabat: "Ahmad Zainuri, S.E.",
    tupoksi: "Menatausahakan seluruh penerimaan dan pengeluaran kas desa serta menyusun laporan keuangan APBDes secara berkala.",
    rincianTugas: [
      "Menatausahakan Buku Kas Umum (BKU), Buku Pembantu Pajak, dan Kas Pembantu Bank.",
      "Melakukan pembayaran atas belanja desa yang telah diverifikasi Sekretaris Desa.",
      "Membuat Surat Pertanggungjawaban (SPJ) dan laporan realisasi APBDes.",
      "Membantu pemungutan dan penyetoran pajak sesuai ketentuan perundang-undangan.",
    ],
    parent: "sekdes",
  },
  kasi_pemerintahan: {
    id: "kasi_pemerintahan",
    label: "Kasi Pemerintahan",
    subLabel: "Hukum, Trantibum & Kependudukan",
    category: "kasi",
    level: "Pelaksana Teknis",
    type: "dark",
    lineType: "komando",
    pejabat: "Ir. Joko Prasetyo",
    tupoksi: "Membantu Kepala Desa melaksanakan pembinaan ketentraman ketertiban, administrasi kependudukan, tata batas desa, dan produk hukum.",
    rincianTugas: [
      "Melaksanakan manajemen administrasi kependudukan dan catatan sipil.",
      "Mengoordinasikan pembinaan ketentraman, ketertiban umum (Trantibum), dan Linmas.",
      "Mengelola urusan pertanahan desa (letter C) dan pengamanan batas wilayah.",
      "Menyusun draft rancangan Peraturan Desa dan Keputusan Kepala Desa.",
    ],
  },
  kaur_kependudukan_catpil: {
    id: "kaur_kependudukan_catpil",
    label: "KAUR. Kependudukan & Catpil",
    subLabel: "Pencatatan Sipil & Data Warga",
    category: "kaur-teknis",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Pelaksana teknis registrasi warga, surat pindah/datang, pengantar KTP/KK, serta buku mutasi kependudukan.",
    rincianTugas: [
      "Pencatatan mutasi penduduk (kelahiran, kematian, pindah, datang).",
      "Verifikasi berkas pengantar pembuatan KTP-el dan Kartu Keluarga.",
      "Pengelolaan database statistik profil kependudukan 11 RW.",
      "Integrasi data kependudukan dengan Dispendukcapil Kabupaten.",
    ],
    parent: "kasi_pemerintahan",
  },
  kaur_pertanahan_aset: {
    id: "kaur_pertanahan_aset",
    label: "KAUR. Pertanahan & Aset",
    subLabel: "Letter C & Tanah Kas Desa",
    category: "kaur-teknis",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Membantu urusan tata kelola Buku Register Tanah Desa (Letter C), batas persil, fasilitasi sertifikasi, dan aset tanah kas desa.",
    rincianTugas: [
      "Pemeliharaan Buku Register Pertanahan Desa (Buku C Desa).",
      "Fasilitasi program sertifikasi tanah massal (PTSL).",
      "Pengecekan batas-batas kepemilikan tanah dan saksi peralihan hak tanah warga.",
      "Pengamanan dan pencatatan pemanfaatan Tanah Kas Desa (TKD).",
    ],
    parent: "kasi_pemerintahan",
  },
  kasi_kesejahteraan: {
    id: "kasi_kesejahteraan",
    label: "Kasi Kesejahteraan",
    subLabel: "Pemberdayaan, Sosial & Kesra",
    category: "kasi",
    level: "Pelaksana Teknis",
    type: "dark",
    lineType: "komando",
    pejabat: "Sulistiyowati, S.Sos.",
    tupoksi: "Membantu Kepala Desa dalam pembangunan sarana prasarana perdesaan, kesehatan, pendidikan, keagamaan, serta bantuan sosial kemasyarakatan.",
    rincianTugas: [
      "Pelaksanaan program penanggulangan kemiskinan dan penyaluran BLT-DD.",
      "Koordinasi bidang kesehatan warga (Posyandu, Posbindu, penanganan stunting).",
      "Pengawasan proyek pembangunan infrastruktur fisik desa (drainase, jalan, gapura).",
      "Pembinaan kegiatan keagamaan, kebudayaan, dan pembinaan pemuda.",
    ],
  },
  kaur_kesra_kemasyarakatan: {
    id: "kaur_kesra_kemasyarakatan",
    label: "KAUR. Kesra & Kemasyarakatan",
    subLabel: "Bansos, Posyandu & Keagamaan",
    category: "kaur-teknis",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Pelaksana teknis pendataan penerima bansos, kegiatan sosial warga, fasilitasi posyandu, dan perayaan hari besar keagamaan.",
    rincianTugas: [
      "Validasi data terpadu kesejahteraan sosial (DTKS) warga kurang mampu.",
      "Fasilitasi operasional kader posyandu balita dan lansia desa.",
      "Mendukung kegiatan keagamaan, peringatan hari nasional, dan seni budaya.",
      "Penyaluran logistik bantuan sosial tanggap bencana bagi warga rentan.",
    ],
    parent: "kasi_kesejahteraan",
  },
  kaur_pemberdayaan_masyarakat: {
    id: "kaur_pemberdayaan_masyarakat",
    label: "KAUR. Pemberdayaan Masyarakat",
    subLabel: "Pelatihan Warga & Ekonomi UMKM",
    category: "kaur-teknis",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Pendampingan peningkatan kapasitas ekonomi keluarga, pelatihan keterampilan kerja, penguatan UMKM, dan ketahanan pangan.",
    rincianTugas: [
      "Penyelenggaraan pelatihan vokasi wirausaha dan UMKM desa.",
      "Pengembangan potensi ekonomi desa dan penguatan modal mikro.",
      "Pemberdayaan kelompok tani, ternak, dan pekarangan pangan mandiri.",
      "Fasilitasi akses legalitas usaha (NIB) dan sertifikasi halal UMKM Sawotratap.",
    ],
    parent: "kasi_kesejahteraan",
  },
  lkd_rt_rw_karangtaruna_pkk: {
    id: "lkd_rt_rw_karangtaruna_pkk",
    label: "Ketua RT / RW\nKarang Taruna & PKK",
    subLabel: "Lembaga Kemasyarakatan Desa (LKD)",
    category: "lkd",
    level: "Lembaga Kemasyarakatan",
    type: "light",
    lineType: "koordinasi",
    pejabat: "Pengurus RT, RW, Karang Taruna & PKK Desa",
    tupoksi: "Garda terdepan kemitraan pemerintah desa di tingkat lingkungan untuk pelayanan warga, gotong royong, pemberdayaan pemuda dan keluarga.",
    rincianTugas: [
      "Rukun Warga (RW) & Rukun Tetangga (RT): Menjaga kerukunan, administrasi lingkungan, dan jembatan aspirasi warga ke balai desa.",
      "Karang Taruna: Wadah pengembangan kreativitas pemuda desa, olahraga, tanggap sosial bencana, dan kepeloporan lingkungan.",
      "PKK Desa: Penggerak 10 program pokok PKK untuk ketahanan pangan keluarga, kesehatan ibu-anak, dan sanitasi rumah tangga.",
    ],
    dasarHukum: "Permendagri No. 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa",
  },
  kasi_pelayanan: {
    id: "kasi_pelayanan",
    label: "Kasi Pelayanan",
    subLabel: "PTSP, Perizinan & Digitalisasi",
    category: "kasi",
    level: "Pelaksana Teknis",
    type: "dark",
    lineType: "komando",
    pejabat: "Budi Santoso, S.Kom.",
    tupoksi: "Membantu Kepala Desa melaksanakan mekanisme pelayanan administratif satu pintu, digitalisasi desa, media komunikasi, dan pengaduan warga.",
    rincianTugas: [
      "Pengoperasian loket Pelayanan Terpadu Satu Pintu (PTSP) Balai Desa.",
      "Verifikasi permohonan surat keterangan dan rekomendasi perizinan usaha warga.",
      "Pengembangan portal website, sistem layanan digital, dan platform aduan warga.",
      "Sosialisasi program kerja dan keterbukaan informasi publik desa.",
    ],
  },
  kaur_pelayanan_umum: {
    id: "kaur_pelayanan_umum",
    label: "KAUR. Pelayanan Umum & Kesejahteraan",
    subLabel: "Loket PTSP & Legalisasi Surat",
    category: "kaur-teknis",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Petugas loket terdepan dalam penerbitan surat keterangan warga, legalisasi dokumen desa, dan administrasi non-kependudukan.",
    rincianTugas: [
      "Penerbitan surat pengantar SKCK, surat keterangan tidak mampu (SKTM), surat domisili usaha.",
      "Pemeriksaan kelengkapan berkas fisik sebelum diajukan tanda tangan pejabat berwenang.",
      "Pengarsipan buku register nomor keluar surat keterangan pelayanan.",
      "Membantu warga lanjut usia / disabilitas di meja antrean layanan prioritas.",
    ],
    parent: "kasi_pelayanan",
  },
  kaur_infokom: {
    id: "kaur_infokom",
    label: "KAUR. Informasi & Komunikasi",
    subLabel: "Portal Web Desa & Media Warga",
    category: "kaur-teknis",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Pengelolaan publikasi website resmi desa, media sosial, papan transparansi APBDes, serta meja tanggap cepat aduan WhatsApp.",
    rincianTugas: [
      "Publikasi berita kegiatan, agenda pemdes, dan infografis APBDes berkala.",
      "Pengelolaan kanal aduan cepat WhatsApp dan hotline layanan desa.",
      "Dokumentasi foto dan video arsip kegiatan penting pemerintah desa.",
      "Menjamin terpenuhinya hak warga atas Keterbukaan Informasi Publik (KIP).",
    ],
    parent: "kasi_pelayanan",
  },
  kadus: {
    id: "kadus",
    label: "Kepala Dusun",
    subLabel: "Unsur Pelaksana Kewilayahan",
    category: "kadus",
    level: "Unsur Kewilayahan",
    type: "dark",
    lineType: "komando",
    pejabat: "Unsur Pamong Wilayah",
    tupoksi: "Membantu Kepala Desa dalam pelaksanaan tugas di wilayah kerjanya mencakup pembinaan ketentraman, pengawasan pembangunan, dan koordinasi antar RW.",
    rincianTugas: [
      "Pembinaan ketentraman dan ketertiban masyarakat di seluruh tingkatan dusun.",
      "Mengoordinasikan musyawarah dusun (Musdus) sebelum Musrenbangdes.",
      "Mengawasi pelaksanaan pembangunan fisik sarana prasarana di wilayah dusun.",
      "Menyampaikan laporan berkala mengenai dinamika sosial warga ke Kepala Desa.",
    ],
    dasarHukum: "Permendagri No. 84 Tahun 2015 Pasal 10",
  },
  kaur_wilayah_1: {
    id: "kaur_wilayah_1",
    label: "KAUR. Wilayah I",
    subLabel: "Koordinator Teritorial Barat & Selatan",
    category: "kaur-wilayah",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Pendamping operasional Kepala Dusun untuk wilayah zona I (RW binaan barat dan selatan).",
    rincianTugas: [
      "Pemantauan harian ketertiban dan fasilitas umum zona Wilayah I.",
      "Fasilitasi komunikasi antar ketua RW dan RT di zona Wilayah I.",
      "Pencatatan sarana penerangan jalan, saluran air, dan drainase lingkungan.",
      "Pendataan warga pendatang dan kontrakan di wilayah binaan.",
    ],
    parent: "kadus",
  },
  kaur_wilayah_2: {
    id: "kaur_wilayah_2",
    label: "KAUR. Wilayah II",
    subLabel: "Koordinator Teritorial Timur & Utara",
    category: "kaur-wilayah",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Pendamping operasional Kepala Dusun untuk wilayah zona II (RW binaan timur dan utara).",
    rincianTugas: [
      "Pemantauan harian ketertiban dan fasilitas umum zona Wilayah II.",
      "Fasilitasi komunikasi antar ketua RW dan RT di zona Wilayah II.",
      "Pencatatan sarana prasarana umum dan ruang terbuka hijau lingkungan.",
      "Koordinasi kegiatan kebersihan dan gotong royong kerja bakti teritorial.",
    ],
    parent: "kadus",
  },
  kaur_linmas: {
    id: "kaur_linmas",
    label: "KAUR. Linmas Keamanan",
    subLabel: "Satlinmas & Kesiapsiagaan Pos Ronda",
    category: "kaur-wilayah",
    level: "Staf Urusan (Kaur)",
    type: "light",
    lineType: "komando",
    tupoksi: "Komando lapangan satuan perlindungan masyarakat (Satlinmas), siskamling lingkungan, dan penanggulangan bencana darurat.",
    rincianTugas: [
      "Penyusunan jadwal dan pemantauan pos ronda siskamling malam di 11 RW.",
      "Pengamanan kegiatan kemasyarakatan, hari besar, dan pemilihan umum desa.",
      "Kesiapsiagaan regu tanggap bencana alam dan pemadaman kebakaran dini.",
      "Koordinasi berkala bersama Babinsa (TNI) dan Bhabinkamtibmas (Polri).",
    ],
    parent: "kadus",
  },
};

export default function BaganHierarkiSection() {
  const [selectedId, setSelectedId] = useState<string>("kades");
  const [filterKat, setFilterKat] = useState<string>("Semua");

  const activeNode = HIERARKI_DATA[selectedId] || HIERARKI_DATA["kades"];

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const categories = [
    { key: "Semua", label: "Semua" },
    { key: "Pimpinan", label: "Pimpinan & Pengawasan" },
    { key: "Sekretariat", label: "Sekretariat & Keuangan" },
    { key: "Teknis", label: "Pelaksana Teknis (Kasi/Kaur)" },
    { key: "Kewilayahan", label: "Kewilayahan & Linmas" },
  ];

  const filteredNodeList = Object.values(HIERARKI_DATA).filter((node) => {
    if (filterKat === "Semua") return true;
    if (filterKat === "Pimpinan") return node.category === "pimpinan" || node.category === "mitra";
    if (filterKat === "Sekretariat") return node.category === "sekretariat" || node.category === "kaur-sekretariat";
    if (filterKat === "Teknis") return node.category === "kasi" || node.category === "kaur-teknis";
    if (filterKat === "Kewilayahan") return node.category === "kadus" || node.category === "kaur-wilayah" || node.category === "lkd";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* HEADER SECTION BAGAN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E3E8E2]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#064E3B] text-xs font-bold border border-emerald-200 mb-2">
            <Layers className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Permendagri No. 84 Th. 2015 & UU Desa No. 6 Th. 2014</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
            Bagan Struktur Hierarki & Alur Koordinasi Pemdes
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Struktur resmi tata kelola Pemerintah Desa Sawotratap. Klik pada kotak bagan di sebelah kiri untuk melihat uraian tugas pokok, dasar hukum, dan wewenang di sebelah kanan.
          </p>
        </div>

        {/* LEGENDA GARIS & KOTAK */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#124B28] shrink-0" />
            <span className="text-slate-700">Pimpinan / Kasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#62A654] shrink-0" />
            <span className="text-slate-700">KAUR / Staf</span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-[#124B28] shrink-0 inline-block" />
            <span className="text-slate-600">Garis Komando</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 border-t-2 border-dashed border-[#124B28] shrink-0 inline-block" />
            <span className="text-slate-600">Garis Koordinasi</span>
          </div>
        </div>
      </div>

      {/* GRID UTAMA: KIRI = DIAGRAM, KANAN = PENJELASAN */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================= */}
        {/* KOLOM KIRI: DIAGRAM STRUKTUR SESUAI GAMBAR */}
        {/* ========================================================= */}
        <div className="xl:col-span-7 bg-white rounded-3xl border border-[#E3E8E2] p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col">
          
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 text-xs">
            <span className="font-extrabold text-[#064E3B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C5D82F]" />
              Diagram Bagan Hierarki Resmi
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Geser horizontal bila tampilan terpotong
            </span>
          </div>

          {/* KANVAS DIAGRAM SCROLLABLE */}
          <div className="overflow-x-auto pb-6 pt-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-300">
            <div className="relative min-w-[840px] h-[720px] mx-auto select-none">
              
              {/* ===================================================== */}
              {/* LAYER SVG KONEKTOR / GARIS ALUR HIERARKI */}
              {/* ===================================================== */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                viewBox="0 0 840 720"
                fill="none"
              >
                {/* 1. Garis Koordinasi Kepala Desa ke BPD (Dashed) */}
                {/* Dari sisi kiri Kades (340, 50) -> belok kiri ke X=130 -> turun ke BPD top (130, 95) */}
                <path
                  d="M 340 50 L 130 50 L 130 95"
                  stroke="#124B28"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. Garis Vertikal Utama dari Kepala Desa */}
                {/* Dari Kades bottom (440, 78) turun lurus ke bus distributor (440, 320) */}
                <line
                  x1="440"
                  y1="78"
                  x2="440"
                  y2="320"
                  stroke="#124B28"
                  strokeWidth="2.5"
                />

                {/* 3. Garis Cabang Horizontal ke Sekretaris Desa */}
                {/* Dari batang tengah (440, 125) ke Sekdes left (620, 125) */}
                <line
                  x1="440"
                  y1="125"
                  x2="620"
                  y2="125"
                  stroke="#124B28"
                  strokeWidth="2.5"
                />

                {/* 4. Garis Cabang Horizontal ke LPM Desa */}
                {/* Dari batang tengah (440, 215) ke LPM Desa right (220, 215) */}
                <line
                  x1="440"
                  y1="215"
                  x2="220"
                  y2="215"
                  stroke="#124B28"
                  strokeWidth="2.5"
                />

                {/* 5. Garis Vertikal Sekdes ke KAUR TU & Keuangan */}
                {/* Dari Sekdes bottom (715, 155) ke Kaur TU top (715, 175) */}
                <line
                  x1="715"
                  y1="155"
                  x2="715"
                  y2="175"
                  stroke="#124B28"
                  strokeWidth="2.5"
                />
                {/* Dari Kaur TU bottom (715, 230) ke Kaur Keuangan top (715, 250) */}
                <line
                  x1="715"
                  y1="230"
                  x2="715"
                  y2="250"
                  stroke="#124B28"
                  strokeWidth="2.5"
                />

                {/* 6. Bus Distributor Horizontal Menuju 4 Lini Pelaksana */}
                {/* Dari X=125 (Kasi Pem) s/d X=715 (Kadus) pada Y=320 */}
                <line
                  x1="125"
                  y1="320"
                  x2="715"
                  y2="320"
                  stroke="#124B28"
                  strokeWidth="2.5"
                />

                {/* 7. Dropdown Vertikal dari Bus ke 4 Kasi/Kadus */}
                {/* Col 1: Kasi Pem (125, 320) -> (125, 345) */}
                <line x1="125" y1="320" x2="125" y2="345" stroke="#124B28" strokeWidth="2.5" />
                {/* Col 2: Kasi Kesra (320, 320) -> (320, 345) */}
                <line x1="320" y1="320" x2="320" y2="345" stroke="#124B28" strokeWidth="2.5" />
                {/* Col 3: Kasi Yan (520, 320) -> (520, 345) */}
                <line x1="520" y1="320" x2="520" y2="345" stroke="#124B28" strokeWidth="2.5" />
                {/* Col 4: Kadus (715, 320) -> (715, 345) */}
                <line x1="715" y1="320" x2="715" y2="345" stroke="#124B28" strokeWidth="2.5" />

                {/* 8. Garis Vertikal Dalam Kolom 1 (Kasi Pemerintahan) */}
                <line x1="125" y1="400" x2="125" y2="420" stroke="#124B28" strokeWidth="2.5" />
                <line x1="125" y1="475" x2="125" y2="495" stroke="#124B28" strokeWidth="2.5" />

                {/* 9. Garis Vertikal Dalam Kolom 2 (Kasi Kesejahteraan) */}
                <line x1="320" y1="400" x2="320" y2="420" stroke="#124B28" strokeWidth="2.5" />
                <line x1="320" y1="475" x2="320" y2="495" stroke="#124B28" strokeWidth="2.5" />

                {/* 10. Garis Koordinasi RT/RW/Karang Taruna/PKK (Dashed seperti foto) */}
                {/* Garis bracket putus-putus di sebelah kiri Kasi Kesra */}
                <path
                  d="M 245 375 L 230 375 L 230 595 L 245 595"
                  stroke="#124B28"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Garis putus-putus dari bawah RT/RW menyambung ke jalur pembinaan */}
                <path
                  d="M 230 635 L 230 670 L 440 670 L 440 320"
                  stroke="#124B28"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 11. Garis Vertikal Dalam Kolom 3 (Kasi Pelayanan) */}
                <line x1="520" y1="400" x2="520" y2="420" stroke="#124B28" strokeWidth="2.5" />
                <line x1="520" y1="475" x2="520" y2="495" stroke="#124B28" strokeWidth="2.5" />

                {/* 12. Garis Vertikal Dalam Kolom 4 (Kepala Dusun) */}
                <line x1="715" y1="400" x2="715" y2="420" stroke="#124B28" strokeWidth="2.5" />
                <line x1="715" y1="475" x2="715" y2="495" stroke="#124B28" strokeWidth="2.5" />
                <line x1="715" y1="550" x2="715" y2="570" stroke="#124B28" strokeWidth="2.5" />
              </svg>

              {/* ===================================================== */}
              {/* LAYER ELEMEN KOTAK DIAGRAM (INTERACTIVE BUTTONS) */}
              {/* ===================================================== */}

              {/* 1. KEPALA DESA (Center Top) */}
              <div className="absolute left-[340px] top-[20px] w-[200px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kades"]}
                  isSelected={selectedId === "kades"}
                  onClick={() => handleSelect("kades")}
                />
              </div>

              {/* 2. BPD (Left Top) */}
              <div className="absolute left-[35px] top-[95px] w-[190px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["bpd"]}
                  isSelected={selectedId === "bpd"}
                  onClick={() => handleSelect("bpd")}
                />
              </div>

              {/* 3. LPM DESA (Left Mid) */}
              <div className="absolute left-[35px] top-[185px] w-[185px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["lpm"]}
                  isSelected={selectedId === "lpm"}
                  onClick={() => handleSelect("lpm")}
                />
              </div>

              {/* 4. SEKRETARIS DESA (Right Top) */}
              <div className="absolute left-[620px] top-[95px] w-[190px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["sekdes"]}
                  isSelected={selectedId === "sekdes"}
                  onClick={() => handleSelect("sekdes")}
                />
              </div>

              {/* 5. KAUR TU, UMUM & PERENCANAAN (Right Mid 1) */}
              <div className="absolute left-[620px] top-[175px] w-[190px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_tu_perencanaan"]}
                  isSelected={selectedId === "kaur_tu_perencanaan"}
                  onClick={() => handleSelect("kaur_tu_perencanaan")}
                />
              </div>

              {/* 6. KAUR KEUANGAN (Right Mid 2) */}
              <div className="absolute left-[620px] top-[250px] w-[190px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_keuangan"]}
                  isSelected={selectedId === "kaur_keuangan"}
                  onClick={() => handleSelect("kaur_keuangan")}
                />
              </div>

              {/* ===================================================== */}
              {/* BARIS BAWAH: 4 LINI PELAKSANA & KEWILAYAHAN */}
              {/* ===================================================== */}

              {/* --- KOLOM 1: KASI PEMERINTAHAN --- */}
              <div className="absolute left-[35px] top-[345px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kasi_pemerintahan"]}
                  isSelected={selectedId === "kasi_pemerintahan"}
                  onClick={() => handleSelect("kasi_pemerintahan")}
                />
              </div>
              <div className="absolute left-[35px] top-[420px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_kependudukan_catpil"]}
                  isSelected={selectedId === "kaur_kependudukan_catpil"}
                  onClick={() => handleSelect("kaur_kependudukan_catpil")}
                />
              </div>
              <div className="absolute left-[35px] top-[495px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_pertanahan_aset"]}
                  isSelected={selectedId === "kaur_pertanahan_aset"}
                  onClick={() => handleSelect("kaur_pertanahan_aset")}
                />
              </div>

              {/* --- KOLOM 2: KASI KESEJAHTERAAN --- */}
              <div className="absolute left-[230px] top-[345px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kasi_kesejahteraan"]}
                  isSelected={selectedId === "kasi_kesejahteraan"}
                  onClick={() => handleSelect("kasi_kesejahteraan")}
                />
              </div>
              <div className="absolute left-[230px] top-[420px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_kesra_kemasyarakatan"]}
                  isSelected={selectedId === "kaur_kesra_kemasyarakatan"}
                  onClick={() => handleSelect("kaur_kesra_kemasyarakatan")}
                />
              </div>
              <div className="absolute left-[230px] top-[495px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_pemberdayaan_masyarakat"]}
                  isSelected={selectedId === "kaur_pemberdayaan_masyarakat"}
                  onClick={() => handleSelect("kaur_pemberdayaan_masyarakat")}
                />
              </div>
              <div className="absolute left-[230px] top-[570px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["lkd_rt_rw_karangtaruna_pkk"]}
                  isSelected={selectedId === "lkd_rt_rw_karangtaruna_pkk"}
                  onClick={() => handleSelect("lkd_rt_rw_karangtaruna_pkk")}
                />
              </div>

              {/* --- KOLOM 3: KASI PELAYANAN --- */}
              <div className="absolute left-[430px] top-[345px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kasi_pelayanan"]}
                  isSelected={selectedId === "kasi_pelayanan"}
                  onClick={() => handleSelect("kasi_pelayanan")}
                />
              </div>
              <div className="absolute left-[430px] top-[420px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_pelayanan_umum"]}
                  isSelected={selectedId === "kaur_pelayanan_umum"}
                  onClick={() => handleSelect("kaur_pelayanan_umum")}
                />
              </div>
              <div className="absolute left-[430px] top-[495px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_infokom"]}
                  isSelected={selectedId === "kaur_infokom"}
                  onClick={() => handleSelect("kaur_infokom")}
                />
              </div>

              {/* --- KOLOM 4: KEPALA DUSUN (KEWILAYAHAN) --- */}
              <div className="absolute left-[625px] top-[345px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kadus"]}
                  isSelected={selectedId === "kadus"}
                  onClick={() => handleSelect("kadus")}
                />
              </div>
              <div className="absolute left-[625px] top-[420px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_wilayah_1"]}
                  isSelected={selectedId === "kaur_wilayah_1"}
                  onClick={() => handleSelect("kaur_wilayah_1")}
                />
              </div>
              <div className="absolute left-[625px] top-[495px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_wilayah_2"]}
                  isSelected={selectedId === "kaur_wilayah_2"}
                  onClick={() => handleSelect("kaur_wilayah_2")}
                />
              </div>
              <div className="absolute left-[625px] top-[570px] w-[180px] z-10">
                <NodeButton
                  node={HIERARKI_DATA["kaur_linmas"]}
                  isSelected={selectedId === "kaur_linmas"}
                  onClick={() => handleSelect("kaur_linmas")}
                />
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              Tip: Sentuh atau klik kotak pada diagram untuk berpindah sorotan
            </span>
            <span className="font-bold text-[#064E3B]">
              Total 18 Jabatan & Elemen Hierarki
            </span>
          </div>

        </div>

        {/* ========================================================= */}
        {/* KOLOM KANAN: PENJELASAN TUGAS & WEWENANG LENGKAP */}
        {/* ========================================================= */}
        <div className="xl:col-span-5 space-y-5 xl:sticky xl:top-24">
          
          {/* KARTU SOROTAN JABATAN AKTIF (SPOTLIGHT CARD) */}
          <div className="rounded-3xl border-2 border-emerald-800/30 bg-gradient-to-br from-[#06261D] to-[#0A3D2E] text-white p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#C5D82F]/10 blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5D82F]/20 text-[#C5D82F] text-[10px] font-black uppercase tracking-wider border border-[#C5D82F]/30 mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>{activeNode.level}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {activeNode.label}
                  </h4>
                  {activeNode.subLabel && (
                    <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
                      {activeNode.subLabel}
                    </p>
                  )}
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  activeNode.type === "dark"
                    ? "bg-[#124B28] border border-[#C5D82F]/40 text-[#C5D82F]"
                    : "bg-[#62A654] border border-white/30 text-white"
                }`}>
                  {activeNode.category === "pimpinan" && <Award className="w-6 h-6" />}
                  {activeNode.category === "mitra" && <ShieldCheck className="w-6 h-6" />}
                  {activeNode.category === "sekretariat" && <Building2 className="w-6 h-6" />}
                  {activeNode.category === "kasi" && <FileText className="w-6 h-6" />}
                  {activeNode.category === "kadus" && <MapPin className="w-6 h-6" />}
                  {(activeNode.category.startsWith("kaur") || activeNode.category === "lkd") && <Users className="w-6 h-6" />}
                </div>
              </div>

              {/* PEJABAT AKTIF */}
              {activeNode.pejabat && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-medium">Pejabat / Penanggung Jawab:</span>
                  <span className="text-xs font-black text-[#C5D82F]">{activeNode.pejabat}</span>
                </div>
              )}

              {/* URAIAN TUPOKSI */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                  Tugas Pokok & Fungsi (Tupoksi)
                </div>
                <p className="text-xs leading-relaxed text-slate-200">
                  {activeNode.tupoksi}
                </p>
              </div>

              {/* RINCIAN WEWENANG / TANGGUNG JAWAB */}
              <div className="space-y-2 pt-2 border-t border-emerald-800/60">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                  Rincian Wewenang Operasional:
                </div>
                <ul className="space-y-2">
                  {activeNode.rincianTugas.map((tugas, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-200/90 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#C5D82F] shrink-0 mt-0.5" />
                      <span>{tugas}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DASAR HUKUM */}
              {activeNode.dasarHukum && (
                <div className="pt-2 border-t border-emerald-800/60 flex items-center gap-2 text-[10px] text-emerald-300/80 font-mono">
                  <BookOpen className="w-3.5 h-3.5 text-[#C5D82F] shrink-0" />
                  <span>Landasan: {activeNode.dasarHukum}</span>
                </div>
              )}
            </div>
          </div>

          {/* DAFTAR PENJELASAN SELURUH ELEMEN STRUKTUR (BERDASARKAN FILTER) */}
          <div className="rounded-3xl border border-[#E3E8E2] bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                Daftar Penjelasan Jabatan
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                {filteredNodeList.length} Jabatan
              </span>
            </div>

            {/* FILTER KATEGORI TABS */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilterKat(cat.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    filterKat === cat.key
                      ? "bg-[#064E3B] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* LIST KARTU MINI SCROLLABLE */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {filteredNodeList.map((item) => {
                const isCurrent = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                      isCurrent
                        ? "bg-emerald-50/80 border-[#064E3B] ring-1 ring-[#064E3B]"
                        : "bg-white border-slate-200/70 hover:border-emerald-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          item.type === "dark" ? "bg-[#124B28]" : "bg-[#62A654]"
                        }`} />
                        <span className="text-xs font-black text-slate-900 group-hover:text-[#064E3B] transition-colors">
                          {item.label.replace("\n", " & ")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 pl-4">
                        {item.tupoksi}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isCurrent ? "text-[#064E3B] translate-x-1" : "text-slate-400 group-hover:text-slate-600"
                    }`} />
                  </div>
                );
              })}
            </div>

            {/* RINGKASAN TATA KELOLA TIGA PILAR */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-black text-[#064E3B] block">Garis Komando Vertikal</span>
                <span className="text-slate-500 mt-0.5 block">Kepala Desa membawahi Sekdes, Kasi, dan Kepala Dusun.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-black text-emerald-800 block">Kemitraan Sejajar</span>
                <span className="text-slate-500 mt-0.5 block">BPD & LPM berfungsi sebagai mitra pengawas & aspirasi.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// =========================================================
// SUB-KOMPONEN KOTAK DIAGRAM (NODE BUTTON)
// =========================================================
function NodeButton({
  node,
  isSelected,
  onClick,
}: {
  node: HierarkiNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isDark = node.type === "dark";

  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full text-center px-2 py-2.5 rounded-2xl font-bold transition-all duration-200 flex flex-col items-center justify-center min-h-[56px] shadow-sm cursor-pointer group relative ${
        isDark
          ? "bg-[#124B28] text-white hover:bg-[#0e3d20] border-2 border-[#1E6738]"
          : "bg-[#62A654] text-white hover:bg-[#549347] border-2 border-[#76BA67]"
      } ${
        isSelected
          ? "ring-4 ring-[#C5D82F] ring-offset-2 scale-[1.03] shadow-lg border-white"
          : "hover:scale-[1.01] hover:shadow-md"
      }`}
    >
      {/* BADGE PULSE JIKA TERPILIH */}
      {isSelected && (
        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#C5D82F] ring-2 ring-white animate-pulse" />
      )}

      <span className="text-[11px] leading-tight font-extrabold tracking-wide whitespace-pre-line drop-shadow-xs">
        {node.label}
      </span>

      {node.pejabat && (
        <span className="text-[9px] font-medium opacity-80 mt-0.5 truncate max-w-[170px] text-emerald-100">
          {node.pejabat.split(",")[0]}
        </span>
      )}
    </button>
  );
}

