export interface UmkmItem {
  id: string;
  slug: string;
  nama: string;
  kategori: "Kuliner" | "Kerajinan" | "Fashion" | "Pertanian" | "Jasa" | string;
  pemilik: string;
  penjual?: string; // alias pemilik
  nik_pemilik?: string;
  kontak_wa: string;
  kontak?: string; // alias kontak_wa
  harga: string;
  harga_angka?: number;
  rating: string | number;
  lokasi: string;
  rw: string;
  foto: string;
  foto_gallery?: string[];
  deskripsi_singkat?: string;
  deskripsi?: string;
  deskripsi_lengkap?: string;
  jam_operasional?: string;
  alamat_lengkap?: string;
  status?: "menunggu" | "disetujui" | "ditolak" | string;
  catatan_admin?: string;
  is_unggulan?: boolean;
  urutan?: number;
  created_at?: string;
  updated_at?: string;
}

export const DAFTAR_PRODUK_UMKM: UmkmItem[] = [
  {
    id: "umkm-1",
    slug: "kue-basah-tradisional-sri-rejeki",
    nama: "Kue Basah & Jajanan Tradisional Sawotratap",
    kategori: "Kuliner",
    pemilik: "Ibu Sri Rejeki",
    penjual: "Ibu Sri Rejeki (RW 02)",
    kontak_wa: "6281234567801",
    kontak: "6281234567801",
    harga: "Mulai Rp 15.000",
    harga_angka: 15000,
    rating: "4.9",
    lokasi: "Jl. Merpati No. 4, RW 02",
    rw: "RW 02",
    foto: "/aset/umkm-desa.jpg",
    foto_gallery: ["/aset/umkm-desa.jpg", "/aset/pedesaan.jpg"],
    deskripsi_singkat: "Menyediakan aneka jajanan pasar khas Jawa Timur: lemper, lumpia, pastel, nagasari, dan kue lapis gurih higienis tanpa bahan pengawet.",
    deskripsi: "Menyediakan aneka jajanan pasar khas Jawa Timur: lemper, lumpia, pastel, nagasari, dan kue lapis gurih higienis tanpa bahan pengawet.",
    deskripsi_lengkap: "Usaha kuliner rumahan keluarga Ibu Sri Rejeki yang telah berdiri lebih dari 10 tahun melayani pesanan tumpeng jajan pasar, snack box rapat instansi, dan arisan warga Sawotratap. Dibuat setiap subuh dengan bahan alami terbaik.",
    jam_operasional: "05.30 - 18.00 WIB",
    alamat_lengkap: "Jl. Merpati No. 4 RT 03 / RW 02, Dekat Masjid Baiturrahman Sawotratap",
    status: "disetujui",
    is_unggulan: true,
    urutan: 1,
  },
  {
    id: "umkm-2",
    slug: "kerupuk-puli-kupang-suwandi",
    nama: "Kerupuk Puli & Kupang Khas Sidoarjo Delta",
    kategori: "Kuliner",
    pemilik: "Pak Suwandi",
    penjual: "Pak Suwandi (RW 05)",
    kontak_wa: "6281234567802",
    kontak: "6281234567802",
    harga: "Mulai Rp 12.000",
    harga_angka: 12000,
    rating: "4.8",
    lokasi: "Kawasan Niaga RW 05",
    rw: "RW 05",
    foto: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    foto_gallery: ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"],
    deskripsi_singkat: "Kerupuk puli renyah gurih bawang dan kerupuk olahan kupang laut khas delta Sidoarjo, diproses dengan resep bumbu rempah turun temurun.",
    deskripsi: "Kerupuk puli renyah gurih bawang dan kerupuk olahan kupang laut khas delta Sidoarjo, diproses dengan resep bumbu rempah turun temurun.",
    deskripsi_lengkap: "Pilihan oleh-oleh khas Sawotratap yang gurih dan renyah. Siap melayani pembelian partai grosir toko, warung makan, maupun eceran kemasan oleh-oleh 250gr & 500gr.",
    jam_operasional: "08.00 - 20.00 WIB",
    alamat_lengkap: "Sentra UMKM RW 05 Gang Buntu No. 12, Sawotratap",
    status: "disetujui",
    is_unggulan: true,
    urutan: 2,
  },
  {
    id: "umkm-3",
    slug: "kerajinan-anyaman-rotan-melati",
    nama: "Kerajinan Anyaman Rotan & Tas Anyam Cantik",
    kategori: "Kerajinan",
    pemilik: "Kelompok Usaha Melati RW 08",
    penjual: "Kelompok Usaha Melati RW 08",
    kontak_wa: "6281234567803",
    kontak: "6281234567803",
    harga: "Mulai Rp 35.000",
    harga_angka: 35000,
    rating: "4.9",
    lokasi: "Perumahan Graha RW 08",
    rw: "RW 08",
    foto: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    foto_gallery: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"],
    deskripsi_singkat: "Koleksi tas keranjang anyam jali-jali, wadah hampers serbaguna, dan tatakan rotan ramah lingkungan buatan tangan ibu-ibu terampil desa.",
    deskripsi: "Koleksi tas keranjang anyam jali-jali, wadah hampers serbaguna, dan tatakan rotan ramah lingkungan buatan tangan ibu-ibu terampil desa.",
    deskripsi_lengkap: "Karya kelompok pemberdayaan wanita tani dan PKK RW 08. Tas anyaman kuat, anti air, warna cerah modern, sangat cocok untuk souvenir hajatan, tas belanja pasar, hingga hampers hari raya.",
    jam_operasional: "09.00 - 17.00 WIB",
    alamat_lengkap: "Sekretariat KWT Melati, Balai RW 08 Perum Graha Sawotratap",
    status: "disetujui",
    is_unggulan: true,
    urutan: 3,
  },
  {
    id: "umkm-4",
    slug: "batik-tulis-delta-sawotratap",
    nama: "Batik Tulis & Cap Corak Khas Delta Sawotratap",
    kategori: "Fashion",
    pemilik: "Sanggar Batik Sawotratap",
    penjual: "Sanggar Batik Sawotratap",
    kontak_wa: "6281234567804",
    kontak: "6281234567804",
    harga: "Mulai Rp 120.000",
    harga_angka: 120000,
    rating: "5.0",
    lokasi: "Jl. Sawotratap Krajan RW 01",
    rw: "RW 01",
    foto: "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&q=80&w=800",
    foto_gallery: ["https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&q=80&w=800"],
    deskripsi_singkat: "Kain batik tulis dan semi-tulis dengan motif flora daun sawo dan pesisir delta Sidoarjo berbahan katun primissima adem.",
    deskripsi: "Kain batik tulis dan semi-tulis dengan motif flora daun sawo dan pesisir delta Sidoarjo berbahan katun primissima adem.",
    deskripsi_lengkap: "Sanggar batik budaya yang melestarikan seni batik khas pesisir Sidoarjo dengan sentuhan modern. Melayani seragam dinas instansi, kebaya keluarga, kemeja batik pria, dan pelatihan membatik pemula.",
    jam_operasional: "08.30 - 17.00 WIB",
    alamat_lengkap: "Jl. Sawotratap Krajan No. 88 (Dekat Kantor Balai Desa RW 01)",
    status: "disetujui",
    is_unggulan: true,
    urutan: 4,
  },
  {
    id: "umkm-5",
    slug: "sambal-bandeng-asap-bu-marfuah",
    nama: "Sambal Bandeng Asap & Olahan Ikan Segar",
    kategori: "Kuliner",
    pemilik: "Dapur Bu Marfuah",
    penjual: "Dapur Bu Marfuah (RW 04)",
    kontak_wa: "6281234567805",
    kontak: "6281234567805",
    harga: "Mulai Rp 25.000",
    harga_angka: 25000,
    rating: "4.9",
    lokasi: "Jl. Kenanga RW 04",
    rw: "RW 04",
    foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    foto_gallery: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"],
    deskripsi_singkat: "Sambal kemasan botol siap saji dengan suwiran daging ikan bandeng asap gurih pedas manis, tahan 3 bulan dengan segel higienis.",
    deskripsi: "Sambal kemasan botol siap saji dengan suwiran daging ikan bandeng asap gurih pedas manis, tahan 3 bulan dengan segel higienis.",
    deskripsi_lengkap: "Olahan bandeng segar tanpa duri dengan bumbu rempah cabai rawit pedas mantap. Sangat cocok dinikmati dengan nasi hangat atau dibawa bekal perjalanan ibadah / dinas luar kota.",
    jam_operasional: "08.00 - 21.00 WIB",
    alamat_lengkap: "Jl. Kenanga RT 02 / RW 04 No. 19, Sawotratap",
    status: "disetujui",
    is_unggulan: false,
    urutan: 5,
  },
  {
    id: "umkm-6",
    slug: "sawotratap-creative-apparel",
    nama: "Konveksi Sablon Kaos & Bordir Komunitas",
    kategori: "Fashion",
    pemilik: "Sawotratap Creative Apparel",
    penjual: "Sawotratap Creative Apparel (RW 07)",
    kontak_wa: "6281234567806",
    kontak: "6281234567806",
    harga: "Mulai Rp 45.000",
    harga_angka: 45000,
    rating: "4.8",
    lokasi: "Kawasan Pemuda RW 07",
    rw: "RW 07",
    foto: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    foto_gallery: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"],
    deskripsi_singkat: "Jasa pembuatan seragam kaos, polo shirt, jaket komunitas Karang Taruna, dan merchandise event sablon plastisol berkualitas tinggi.",
    deskripsi: "Jasa pembuatan seragam kaos, polo shirt, jaket komunitas Karang Taruna, dan merchandise event sablon plastisol berkualitas tinggi.",
    deskripsi_lengkap: "Rintisan usaha kreatif pemuda pemudi Karang Taruna RW 07 Sawotratap. Menyediakan bahan cotton combed 24s/30s adem, jahitan rantai standar distro, pengerjaan tepat waktu dengan harga ramah kantong.",
    jam_operasional: "09.00 - 20.00 WIB",
    alamat_lengkap: "Kavling Pemuda RW 07 No. 05, Sawotratap",
    status: "disetujui",
    is_unggulan: false,
    urutan: 6,
  },
];