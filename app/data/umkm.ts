export interface UmkmItem {
  id: number;
  nama: string;
  penjual: string;
  harga: string;
  rating: string;
  lokasi: string;
  kategori: string;
  foto: string;
}

export const DAFTAR_PRODUK_UMKM: UmkmItem[] = [
  {
    id: 1,
    nama: "Kue Basah & Jajanan Tradisional Sawotratap",
    penjual: "Ibu Sri Rejeki (RW 02)",
    harga: "Mulai Rp 15.000",
    rating: "4.9",
    lokasi: "Jl. Merpati No. 4, RW 02",
    kategori: "Kuliner",
    foto: "/aset/umkm-desa.jpg",
  },
  {
    id: 2,
    nama: "Kerupuk Puli & Kupang Khas Sidoarjo",
    penjual: "Pak Suwandi (RW 05)",
    harga: "Mulai Rp 12.000",
    rating: "4.8",
    lokasi: "Kawasan Niaga RW 05",
    kategori: "Kuliner",
    foto: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    nama: "Kerajinan Anyaman Rotan & Tas Anyam",
    penjual: "Kelompok Usaha Melati RW 08",
    harga: "Mulai Rp 35.000",
    rating: "4.9",
    lokasi: "Perumahan Graha RW 08",
    kategori: "Kerajinan",
    foto: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    nama: "Batik Tulis Corak Khas Sidoarjo Delta",
    penjual: "Sanggar Batik Sawotratap",
    harga: "Mulai Rp 120.000",
    rating: "5.0",
    lokasi: "Jl. Sawotratap Krajan RW 01",
    kategori: "Kerajinan",
    foto: "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&q=80&w=600",
  },
];