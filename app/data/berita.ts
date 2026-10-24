export interface BeritaItem {
  id: string;
  kategori: "berita" | "pengumuman" | "agenda";
  judul: string;
  ringkasan: string;
  tanggal: string;
  penulis: string;
  foto: string;
  badge: string;
}

export const DAFTAR_BERITA: BeritaItem[] = [
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