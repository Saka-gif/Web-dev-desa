import React, { useState, useEffect, useRef } from "react";
import { Layers, X, CheckCircle2, BookOpen } from "lucide-react";

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
  const [modalNode, setModalNode] = useState<HierarkiNode | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > 0 && containerWidth < 840) {
          setScale(containerWidth / 840);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setModalNode(HIERARKI_DATA[id] || null);
  };

  return (
    <div className="space-y-6">
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
            Struktur resmi tata kelola Pemerintah Desa Sawotratap sesuai Permendagri No. 84 Tahun 2015.
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

      {/* DIAGRAM BAGAN HIERARKI RESMI (TANPA CARD & SCALED RESPONSIVE) */}
      <div ref={containerRef} className="w-full flex justify-center overflow-hidden py-2">
        <div
          style={{
            width: 840 * scale,
            height: 650 * scale,
          }}
          className="relative shrink-0"
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="absolute top-0 left-0 w-[840px] h-[650px] select-none"
          >
            {/* ===================================================== */}
            {/* LAYER SVG KONEKTOR / GARIS ALUR HIERARKI */}
            {/* ===================================================== */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 840 650"
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
                <line x1="320" y1="550" x2="320" y2="570" stroke="#124B28" strokeWidth="2.5" />

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
      </div>

      {/* POPUP PENJELASAN SINGKAT JABATAN */}
      {modalNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setModalNode(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 p-6 sm:p-7 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {modalNode.level}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-[#111827] leading-snug">
                  {modalNode.label}
                </h4>
                {modalNode.pejabat && (
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Pejabat: {modalNode.pejabat}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => setModalNode(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Isi Ringkas Tupoksi */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Uraian Tugas Pokok & Fungsi
                </span>
                <p className="text-slate-700 font-medium">
                  {modalNode.tupoksi}
                </p>
              </div>

              {/* Rincian Singkat (Maksimal 3 poin) */}
              {modalNode.rincianTugas && modalNode.rincianTugas.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                    Fokus Wewenang:
                  </span>
                  <ul className="space-y-1.5">
                    {modalNode.rincianTugas.slice(0, 3).map((tugas, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tugas}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dasar Hukum */}
              {modalNode.dasarHukum && (
                <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-emerald-700 shrink-0" />
                  <span>Landasan: {modalNode.dasarHukum}</span>
                </div>
              )}
            </div>

            {/* Footer Tutup */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalNode(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black transition-all cursor-pointer shadow-xs"
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

