-- ==============================================================
-- SCHEMA & DATA RESMI DESA SAWOTRATAP (SUPABASE + CLOUDKILAT S3)
-- Jalankan script SQL ini di Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. TABEL BERITA
CREATE TABLE IF NOT EXISTS public.berita (
  id TEXT PRIMARY KEY,
  kategori TEXT NOT NULL DEFAULT 'berita',
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  penulis TEXT NOT NULL,
  foto TEXT NOT NULL,
  badge TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PENGUMUMAN / EDARAN
CREATE TABLE IF NOT EXISTS public.pengumuman (
  id TEXT PRIMARY KEY,
  nomor TEXT NOT NULL,
  judul TEXT NOT NULL,
  waktu TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  syarat TEXT NOT NULL,
  status TEXT NOT NULL,
  status_color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL AGENDA KEGIATAN
CREATE TABLE IF NOT EXISTS public.agenda (
  id TEXT PRIMARY KEY,
  tanggal TEXT NOT NULL,
  jam TEXT NOT NULL,
  kegiatan TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS) & IZINKAN AKSES PUBLIK (SELECT & INSERT)
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on berita" ON public.berita FOR SELECT USING (true);
CREATE POLICY "Allow public insert on berita" ON public.berita FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on berita" ON public.berita FOR UPDATE USING (true);

CREATE POLICY "Allow public read on pengumuman" ON public.pengumuman FOR SELECT USING (true);
CREATE POLICY "Allow public insert on pengumuman" ON public.pengumuman FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on pengumuman" ON public.pengumuman FOR UPDATE USING (true);

CREATE POLICY "Allow public read on agenda" ON public.agenda FOR SELECT USING (true);
CREATE POLICY "Allow public insert on agenda" ON public.agenda FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on agenda" ON public.agenda FOR UPDATE USING (true);

-- ==============================================================
-- INSERT DATA DENGAN URL FOTO CLOUDKILAT S3
-- ==============================================================

-- DATA BERITA
INSERT INTO public.berita (id, kategori, judul, ringkasan, tanggal, penulis, foto, badge)
VALUES
  (
    'b1',
    'berita',
    'Gotong Royong Massal Drainase & Penanaman 300 Pohon RW 01–11',
    'Warga bersama Karang Taruna serentak bersihkan saluran air dan tanam peneduh menyambut musim hujan.',
    '22 Okt 2024',
    'Humas Pemdes',
    'https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/gotong-royong.jpg',
    'Lingkungan'
  ),
  (
    'b2',
    'berita',
    'Pelayanan Mandiri Online: Cetak Surat Pengantar 1x24 Jam Bebas Pungli',
    'Balai Desa hadirkan sistem verifikasi digital terpadu untuk pengurusan administrasi tanpa antre.',
    '18 Okt 2024',
    'PTSP Desa',
    'https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg',
    'Layanan Publik'
  ),
  (
    'b3',
    'berita',
    'Gebyar Pasar Rakyat & Pelatihan Legalitas NIB 150+ UMKM Sawotratap',
    'Fasilitasi sertifikasi halal dan perizinan usaha gratis bagi pedagang kuliner dan perajin lokal.',
    '12 Okt 2024',
    'Pokja UMKM',
    'https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/umkm-desa.jpg',
    'Ekonomi'
  ),
  (
    'b4',
    'berita',
    'Revitalisasi Balai Desa & Pendopo Pertemuan Warga Tuntas',
    'Fasilitas baru ramah disabilitas, ruang laktasi, dan WiFi desa gratis siap digunakan musyawarah warga.',
    '05 Okt 2024',
    'Kaur Perencanaan',
    'https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/balai-desa.jpg',
    'Infrastruktur'
  )
ON CONFLICT (id) DO UPDATE SET
  judul = EXCLUDED.judul,
  ringkasan = EXCLUDED.ringkasan,
  tanggal = EXCLUDED.tanggal,
  penulis = EXCLUDED.penulis,
  foto = EXCLUDED.foto,
  badge = EXCLUDED.badge;

-- DATA PENGUMUMAN
INSERT INTO public.pengumuman (id, nomor, judul, waktu, lokasi, syarat, status, status_color)
VALUES
  (
    'p1',
    '140/082/2024',
    'Penyaluran BLT Dana Desa Triwulan IV',
    '28 – 30 Oktober 2024',
    'Pendopo Balai Desa',
    'Bawa KTP & KK Asli',
    'Penting / Segera',
    'bg-rose-100 text-rose-800 border-rose-300'
  ),
  (
    'p2',
    '470/105/2024',
    'Jemput Bola Perekaman KTP-el & IKD Digital',
    'Setiap Sabtu, 09.00 – 13.00 WIB',
    'Balai RW 03 & 07',
    'Pemula usia 17 th bawa KK & Akta',
    'Layanan Terbuka',
    'bg-emerald-100 text-emerald-800 border-emerald-300'
  ),
  (
    'p3',
    '973/044/2024',
    'Batas Akhir Pelunasan PBB-P2 Tahun 2024',
    'Batas: 15 November 2024',
    'Loket Balai Desa / Bank Jatim',
    'Bawa SPPT PBB tahun berjalan',
    'Batas Waktu',
    'bg-amber-100 text-amber-800 border-amber-300'
  )
ON CONFLICT (id) DO UPDATE SET
  nomor = EXCLUDED.nomor,
  judul = EXCLUDED.judul,
  waktu = EXCLUDED.waktu,
  lokasi = EXCLUDED.lokasi,
  syarat = EXCLUDED.syarat,
  status = EXCLUDED.status,
  status_color = EXCLUDED.status_color;

-- DATA AGENDA
INSERT INTO public.agenda (id, tanggal, jam, kegiatan, lokasi)
VALUES
  (
    'a1',
    '28 Okt 2024',
    '19.30 WIB',
    'Malam Sumpah Pemuda & Pentas Seni Karang Taruna',
    'Halaman Balai Desa'
  ),
  (
    'a2',
    '03 Nov 2024',
    '08.00 WIB',
    'Posyandu Balita & Imunisasi Rutin Bebas Stunting',
    'Balai RW 02 & 06'
  ),
  (
    'a3',
    '10 Nov 2024',
    '06.30 WIB',
    'Kerja Bakti ''Minggu Bersih'' & Senam Lansia',
    'Serentak 11 RW'
  ),
  (
    'a4',
    '18 Nov 2024',
    '09.00 WIB',
    'Musyawarah Perencanaan Desa (Musrenbangdes 2025)',
    'Ruang Rapat Balai Desa'
  )
ON CONFLICT (id) DO UPDATE SET
  tanggal = EXCLUDED.tanggal,
  jam = EXCLUDED.jam,
  kegiatan = EXCLUDED.kegiatan,
  lokasi = EXCLUDED.lokasi;

-- 4. AKTIFKAN BROADCAST REALTIME KE FRONTEND (Agar saat diedit di DB, web langsung update seketika tanpa refresh)
ALTER PUBLICATION supabase_realtime ADD TABLE public.berita;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pengumuman;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agenda;

-- 5. TABEL PENGAJUAN SURAT KETERANGAN ONLINE & UPLOAD BERKAS
CREATE TABLE IF NOT EXISTS public.pengajuan_surat (
  id TEXT PRIMARY KEY, -- Nomor Tiket/Resi, contoh: 'SWT-2026-8842'
  jenis_surat TEXT NOT NULL,
  jenis_surat_id TEXT NOT NULL,
  nama_pemohon TEXT NOT NULL,
  nik_pemohon VARCHAR(16) NOT NULL,
  telepon_pemohon TEXT NOT NULL,
  rw_pemohon TEXT NOT NULL,
  keperluan TEXT NOT NULL,
  berkas_urls JSONB DEFAULT '[]'::jsonb, -- Daftar file yang diunggah [{ name, url, size, type }]
  status TEXT DEFAULT 'Antrean Verifikasi' NOT NULL,
  step INTEGER DEFAULT 1 NOT NULL, -- 1: Antrean Verifikasi, 2: Pemeriksaan Berkas, 3: TTD Kades, 4: Siap Diambil
  status_label TEXT DEFAULT 'Sedang Dalam Antrean Verifikasi',
  status_color TEXT DEFAULT 'bg-amber-100 text-amber-800 border-amber-300',
  estimasi_selesai TEXT DEFAULT '1 x 24 Jam Kerja',
  catatan TEXT DEFAULT 'Berkas permohonan telah diterima sistem dan menunggu verifikasi petugas pelayanan Balai Desa.',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Kebijakan Akses
ALTER TABLE public.pengajuan_surat ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read pengajuan_surat" ON public.pengajuan_surat;
CREATE POLICY "Allow public read pengajuan_surat" ON public.pengajuan_surat FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert pengajuan_surat" ON public.pengajuan_surat;
CREATE POLICY "Allow public insert pengajuan_surat" ON public.pengajuan_surat FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update pengajuan_surat" ON public.pengajuan_surat;
CREATE POLICY "Allow public update pengajuan_surat" ON public.pengajuan_surat FOR UPDATE TO anon, authenticated USING (true);

-- Aktifkan Realtime untuk pengajuan_surat
ALTER PUBLICATION supabase_realtime ADD TABLE public.pengajuan_surat;

-- 6. TABEL PENGADUAN WARGA LINGKUNGAN & DOKUMENTASI KERUSAKAN
CREATE TABLE IF NOT EXISTS public.pengaduan_warga (
  id TEXT PRIMARY KEY, -- Nomor Tiket Pengaduan, misal: 'ADU-2026-8821'
  kategori TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  nama_pelapor TEXT DEFAULT 'Warga Sawotratap',
  kontak_pelapor TEXT DEFAULT '-',
  isi_aduan TEXT NOT NULL,
  foto_urls JSONB DEFAULT '[]'::jsonb, -- Daftar foto dokumentasi kerusakan [{ name, url, size, type, s3Path }]
  status TEXT DEFAULT 'Menunggu Verifikasi' NOT NULL, -- 'Menunggu Verifikasi', 'Diteruskan ke Trantib/RT', 'Sedang Ditangani', 'Selesai'
  status_color TEXT DEFAULT 'bg-amber-100 text-amber-800 border-amber-300',
  catatan_petugas TEXT DEFAULT 'Laporan aduan telah dicatat dan menunggu peninjauan seksi terkait.',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hak Akses (RLS) Pengaduan
ALTER TABLE public.pengaduan_warga ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read pengaduan_warga" ON public.pengaduan_warga;
CREATE POLICY "Allow public read pengaduan_warga" ON public.pengaduan_warga FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert pengaduan_warga" ON public.pengaduan_warga;
CREATE POLICY "Allow public insert pengaduan_warga" ON public.pengaduan_warga FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update pengaduan_warga" ON public.pengaduan_warga;
CREATE POLICY "Allow public update pengaduan_warga" ON public.pengaduan_warga FOR UPDATE TO anon, authenticated USING (true);

-- Aktifkan Realtime untuk pengaduan_warga
ALTER PUBLICATION supabase_realtime ADD TABLE public.pengaduan_warga;

-- ==============================================================================
-- 7. TABEL APBD DESA (RINGKASAN ANGGARAN & RINCIAN PROGRAM KEGIATAN)
-- ==============================================================================

-- 7A. TABEL RINGKASAN ANGGARAN APBD (Sangat mudah diedit langsung di Table Editor)
CREATE TABLE IF NOT EXISTS public.apbd_ringkasan (
  id TEXT PRIMARY KEY, -- '2026'
  tahun TEXT NOT NULL,
  total_pagu TEXT NOT NULL,         -- Contoh: 'Rp 2.85 M'
  realisasi_dana TEXT NOT NULL,     -- Contoh: 'Rp 2.62 M'
  persen_penyerapan TEXT NOT NULL,  -- Contoh: '91.9%'
  alokasi_fisik TEXT NOT NULL,      -- Contoh: 'Rp 1.25 M'
  surplus_kas TEXT NOT NULL,        -- Contoh: 'Rp 230 Jt'
  status_verifikasi TEXT DEFAULT 'Terverifikasi Resmi BPD' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data Ringkasan APBD 2026
INSERT INTO public.apbd_ringkasan (id, tahun, total_pagu, realisasi_dana, persen_penyerapan, alokasi_fisik, surplus_kas, status_verifikasi)
VALUES (
  '2026',
  '2026',
  'Rp 2.85 M',
  'Rp 2.62 M',
  '91.9%',
  'Rp 1.25 M',
  'Rp 230 Jt',
  'Terverifikasi Resmi BPD'
)
ON CONFLICT (id) DO UPDATE SET
  total_pagu = EXCLUDED.total_pagu,
  realisasi_dana = EXCLUDED.realisasi_dana,
  persen_penyerapan = EXCLUDED.persen_penyerapan,
  alokasi_fisik = EXCLUDED.alokasi_fisik,
  surplus_kas = EXCLUDED.surplus_kas,
  status_verifikasi = EXCLUDED.status_verifikasi,
  updated_at = timezone('utc'::text, now());

-- 7B. TABEL RINCIAN PROGRAM KEGIATAN DESA (Tabel datar, kolom simpel, mudah diedit)
CREATE TABLE IF NOT EXISTS public.apbd_program (
  id TEXT PRIMARY KEY,               -- 'prog-1', 'prog-2', dst.
  tahun TEXT DEFAULT '2026' NOT NULL,
  nama TEXT NOT NULL,                -- Nama Program
  kategori TEXT NOT NULL,            -- 'Infrastruktur', 'Pemberdayaan', 'Kesehatan', 'Pemerintahan', 'Lingkungan'
  anggaran TEXT NOT NULL,            -- 'Rp 450 Juta'
  status TEXT NOT NULL,              -- 'selesai' atau 'proses'
  progres INTEGER DEFAULT 100 NOT NULL, -- Angka 0 - 100
  keterangan TEXT NOT NULL,          -- Deskripsi singkat pengerjaan
  lokasi TEXT DEFAULT 'Desa Sawotratap',
  urutan INTEGER DEFAULT 1 NOT NULL, -- Urutan tampil di website
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data Program APBD 2026
INSERT INTO public.apbd_program (id, tahun, nama, kategori, anggaran, status, progres, keterangan, lokasi, urutan)
VALUES
  (
    'prog-1',
    '2026',
    'Betonisasi Jalan Usaha Tani & Lingkungan RW 01 - 04',
    'Infrastruktur',
    'Rp 450 Juta',
    'selesai',
    100,
    'Selesai diaspal dan dicor beton kualitas K-350.',
    'RW 01 s/d RW 04',
    1
  ),
  (
    'prog-2',
    '2026',
    'Rehab Saluran Drainase & Normalisasi Kali Desa',
    'Infrastruktur',
    'Rp 320 Juta',
    'selesai',
    100,
    'Pengerukan lumpur dan pemasangan U-Ditch beton.',
    'RW 02 & RW 07',
    2
  ),
  (
    'prog-3',
    '2026',
    'Bantuan Permodalan & Pelatihan Digital UMKM',
    'Pemberdayaan',
    'Rp 210 Juta',
    'selesai',
    100,
    'Penyaluran alat produksi dan pendampingan izin PIRT.',
    'Sentra UMKM Desa',
    3
  ),
  (
    'prog-4',
    '2026',
    'Penerangan Jalan Umum (PJU) Tenaga Surya',
    'Infrastruktur',
    'Rp 180 Juta',
    'selesai',
    100,
    'Pemasangan 45 titik lampu hemat energi di titik rawan.',
    'Jalan Lingkungan 11 RW',
    4
  ),
  (
    'prog-5',
    '2026',
    'Revitalisasi Posyandu & Pemberian PMT Balita',
    'Kesehatan',
    'Rp 150 Juta',
    'selesai',
    100,
    'Pemberian makanan tambahan dan alat cek kesehatan posyandu.',
    'Balai RW 02, 06, 09',
    5
  ),
  (
    'prog-6',
    '2026',
    'Pembangunan Gedung Serbaguna & Balai Latihan Warga',
    'Infrastruktur',
    'Rp 680 Juta',
    'proses',
    75,
    'Tahap finishing interior dan instalasi kelistrikan lantai 2.',
    'Kompleks Balai Desa',
    6
  ),
  (
    'prog-7',
    '2026',
    'Digitalisasi Arsip Kependudukan & Smart Dashboard',
    'Pemerintahan',
    'Rp 95 Juta',
    'proses',
    60,
    'Integrasi database kependudukan dengan loket mandiri desa.',
    'Kantor Balai Desa',
    7
  ),
  (
    'prog-8',
    '2026',
    'Program Penghijauan Taman Desa & Bank Sampah Mandiri',
    'Lingkungan',
    'Rp 85 Juta',
    'proses',
    40,
    'Pengadaan mesin pencacah sampah organik dan bibit pohon.',
    'RW 05 & RW 10',
    8
  )
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  kategori = EXCLUDED.kategori,
  anggaran = EXCLUDED.anggaran,
  status = EXCLUDED.status,
  progres = EXCLUDED.progres,
  keterangan = EXCLUDED.keterangan,
  lokasi = EXCLUDED.lokasi,
  urutan = EXCLUDED.urutan;

-- RLS Kebijakan Akses
ALTER TABLE public.apbd_ringkasan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read apbd_ringkasan" ON public.apbd_ringkasan;
CREATE POLICY "Allow public read apbd_ringkasan" ON public.apbd_ringkasan FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow public all apbd_ringkasan" ON public.apbd_ringkasan;
CREATE POLICY "Allow public all apbd_ringkasan" ON public.apbd_ringkasan FOR ALL TO anon, authenticated USING (true);

ALTER TABLE public.apbd_program ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read apbd_program" ON public.apbd_program;
CREATE POLICY "Allow public read apbd_program" ON public.apbd_program FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow public all apbd_program" ON public.apbd_program;
CREATE POLICY "Allow public all apbd_program" ON public.apbd_program FOR ALL TO anon, authenticated USING (true);

-- Aktifkan Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.apbd_ringkasan;
ALTER PUBLICATION supabase_realtime ADD TABLE public.apbd_program;

-- ==============================================================================
-- 8. TABEL DIREKTORI & STORE UMKM DESA SAWOTRATAP
-- ==============================================================================
-- Dirancang untuk etalase produk, persiapan halaman detail (/umkm/[id atau slug]),
-- pemesanan/tanya via WhatsApp langsung (tanpa keranjang belanja),
-- dan persiapan formulir pendaftaran UMKM warga dengan sistem persetujuan admin (status: 'menunggu' / 'disetujui' / 'ditolak').

CREATE TABLE IF NOT EXISTS public.umkm (
  id TEXT PRIMARY KEY,                       -- Contoh: 'umkm-1', 'umkm-kue-basah'
  slug TEXT UNIQUE NOT NULL,                 -- Siap untuk routing halaman detail: /umkm/[slug]
  nama TEXT NOT NULL,                        -- Nama produk / usaha
  kategori TEXT NOT NULL,                    -- 'Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Jasa'
  pemilik TEXT NOT NULL,                     -- Nama pemilik / pelaku usaha
  nik_pemilik VARCHAR(16),                   -- NIK pemohon untuk verifikasi administrasi desa
  kontak_wa TEXT NOT NULL,                   -- Nomor WhatsApp aktif format internasional (contoh: '6281234567890')
  harga TEXT NOT NULL,                       -- Contoh: 'Mulai Rp 15.000'
  harga_angka NUMERIC DEFAULT 0,             -- Angka nominal untuk filter/sortir
  rating NUMERIC(2,1) DEFAULT 4.9,           -- Nilai ulasan/rating (misal: 4.9, 5.0)
  lokasi TEXT NOT NULL,                      -- Alamat ringkas, misal: 'Jl. Merpati No. 4, RW 02'
  rw TEXT NOT NULL,                          -- Wilayah RW (contoh: 'RW 02')
  foto TEXT NOT NULL,                        -- URL foto produk / usaha utama
  foto_gallery JSONB DEFAULT '[]'::jsonb,    -- Array URL foto tambahan untuk galeri halaman detail
  deskripsi_singkat TEXT NOT NULL,           -- Ringkasan 1-2 kalimat untuk kartu di etalase
  deskripsi_lengkap TEXT DEFAULT '',         -- Deskripsi komprehensif, cerita usaha, bahan & keunggulan untuk halaman detail
  jam_operasional TEXT DEFAULT '08.00 - 20.00 WIB', -- Jam buka untuk halaman detail
  alamat_lengkap TEXT DEFAULT '',            -- Patokan lokasi spesifik
  status TEXT DEFAULT 'disetujui' NOT NULL,  -- 'menunggu' (butuh acc admin), 'disetujui' (tampil di web), 'ditolak'
  catatan_admin TEXT DEFAULT '',             -- Catatan verifikator admin desa
  is_unggulan BOOLEAN DEFAULT false,         -- Ditampilkan di slot highlight utama
  urutan INTEGER DEFAULT 1 NOT NULL,         -- Urutan posisi tampilan
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Data Awal UMKM Desa Sawotratap (Semua berstatus 'disetujui' siap tampil)
INSERT INTO public.umkm (
  id, slug, nama, kategori, pemilik, nik_pemilik, kontak_wa, harga, harga_angka,
  rating, lokasi, rw, foto, foto_gallery, deskripsi_singkat, deskripsi_lengkap,
  jam_operasional, alamat_lengkap, status, is_unggulan, urutan
)
VALUES
  (
    'umkm-1',
    'kue-basah-tradisional-sri-rejeki',
    'Kue Basah & Jajanan Tradisional Sawotratap',
    'Kuliner',
    'Ibu Sri Rejeki',
    '3515085002850001',
    '6281234567801',
    'Mulai Rp 15.000',
    15000,
    4.9,
    'Jl. Merpati No. 4, RW 02',
    'RW 02',
    '/aset/umkm-desa.jpg',
    '["/aset/umkm-desa.jpg", "/aset/pedesaan.jpg"]'::jsonb,
    'Menyediakan aneka jajanan pasar khas Jawa Timur: lemper, lumpia, pastel, nagasari, dan kue lapis gurih higienis tanpa bahan pengawet.',
    'Usaha kuliner rumahan keluarga Ibu Sri Rejeki yang telah berdiri lebih dari 10 tahun melayani pesanan tumpeng jajan pasar, snack box rapat instansi, dan arisan warga Sawotratap. Dibuat setiap subuh dengan bahan alami terbaik.',
    '05.30 - 18.00 WIB',
    'Jl. Merpati No. 4 RT 03 / RW 02, Dekat Masjid Baiturrahman Sawotratap',
    'disetujui',
    true,
    1
  ),
  (
    'umkm-2',
    'kerupuk-puli-kupang-suwandi',
    'Kerupuk Puli & Kupang Khas Sidoarjo Delta',
    'Kuliner',
    'Pak Suwandi',
    '3515081204780002',
    '6281234567802',
    'Mulai Rp 12.000',
    12000,
    4.8,
    'Kawasan Niaga RW 05',
    'RW 05',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    'Kerupuk puli renyah gurih bawang dan kerupuk olahan kupang laut khas delta Sidoarjo, diproses dengan resep bumbu rempah turun temurun.',
    'Pilihan oleh-oleh khas Sawotratap yang gurih dan renyah. Siap melayani pembelian partai grosir toko, warung makan, maupun eceran kemasan oleh-oleh 250gr & 500gr.',
    '08.00 - 20.00 WIB',
    'Sentra UMKM RW 05 Gang Buntu No. 12, Sawotratap',
    'disetujui',
    true,
    2
  ),
  (
    'umkm-3',
    'kerajinan-anyaman-rotan-melati',
    'Kerajinan Anyaman Rotan & Tas Anyam Cantik',
    'Kerajinan',
    'Kelompok Usaha Melati RW 08',
    '3515086007880003',
    '6281234567803',
    'Mulai Rp 35.000',
    35000,
    4.9,
    'Perumahan Graha RW 08',
    'RW 08',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    'Koleksi tas keranjang anyam jali-jali, wadah hampers serbaguna, dan tatakan rotan ramah lingkungan buatan tangan ibu-ibu terampil desa.',
    'Karya kelompok pemberdayaan wanita tani dan PKK RW 08. Tas anyaman kuat, anti air, warna cerah modern, sangat cocok untuk souvenir hajatan, tas belanja pasar, hingga hampers hari raya.',
    '09.00 - 17.00 WIB',
    'Sekretariat KWT Melati, Balai RW 08 Perum Graha Sawotratap',
    'disetujui',
    true,
    3
  ),
  (
    'umkm-4',
    'batik-tulis-delta-sawotratap',
    'Batik Tulis & Cap Corak Khas Delta Sawotratap',
    'Fashion',
    'Sanggar Batik Sawotratap',
    '3515082103750004',
    '6281234567804',
    'Mulai Rp 120.000',
    120000,
    5.0,
    'Jl. Sawotratap Krajan RW 01',
    'RW 01',
    'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    'Kain batik tulis dan semi-tulis dengan motif flora daun sawo dan pesisir delta Sidoarjo berbahan katun primissima adem.',
    'Sanggar batik budaya yang melestarikan seni batik khas pesisir Sidoarjo dengan sentuhan modern. Melayani seragam dinas instansi, kebaya keluarga, kemeja batik pria, dan pelatihan membatik pemula.',
    '08.30 - 17.00 WIB',
    'Jl. Sawotratap Krajan No. 88 (Dekat Kantor Balai Desa RW 01)',
    'disetujui',
    true,
    4
  ),
  (
    'umkm-5',
    'sambal-bandeng-asap-bu-marfuah',
    'Sambal Bandeng Asap & Olahan Ikan Segar',
    'Kuliner',
    'Dapur Bu Marfuah',
    '3515084509820005',
    '6281234567805',
    'Mulai Rp 25.000',
    25000,
    4.9,
    'Jl. Kenanga RW 04',
    'RW 04',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    'Sambal kemasan botol siap saji dengan suwiran daging ikan bandeng asap gurih pedas manis, tahan 3 bulan dengan segel higienis.',
    'Olahan bandeng segar tanpa duri dengan bumbu rempah cabai rawit pedas mantap. Sangat cocok dinikmati dengan nasi hangat atau dibawa bekal perjalanan ibadah / dinas luar kota.',
    '08.00 - 21.00 WIB',
    'Jl. Kenanga RT 02 / RW 04 No. 19, Sawotratap',
    'disetujui',
    false,
    5
  ),
  (
    'umkm-6',
    'sawotratap-creative-apparel',
    'Konveksi Sablon Kaos & Bordir Komunitas',
    'Fashion',
    'Sawotratap Creative Apparel',
    '3515081908920006',
    '6281234567806',
    'Mulai Rp 45.000',
    45000,
    4.8,
    'Kawasan Pemuda RW 07',
    'RW 07',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    'Jasa pembuatan seragam kaos, polo shirt, jaket komunitas Karang Taruna, dan merchandise event sablon plastisol berkualitas tinggi.',
    'Rintisan usaha kreatif pemuda pemudi Karang Taruna RW 07 Sawotratap. Menyediakan bahan cotton combed 24s/30s adem, jahitan rantai standar distro, pengerjaan tepat waktu dengan harga ramah kantong.',
    '09.00 - 20.00 WIB',
    'Kavling Pemuda RW 07 No. 05, Sawotratap',
    'disetujui',
    false,
    6
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  nama = EXCLUDED.nama,
  kategori = EXCLUDED.kategori,
  pemilik = EXCLUDED.pemilik,
  kontak_wa = EXCLUDED.kontak_wa,
  harga = EXCLUDED.harga,
  harga_angka = EXCLUDED.harga_angka,
  rating = EXCLUDED.rating,
  lokasi = EXCLUDED.lokasi,
  rw = EXCLUDED.rw,
  foto = EXCLUDED.foto,
  foto_gallery = EXCLUDED.foto_gallery,
  deskripsi_singkat = EXCLUDED.deskripsi_singkat,
  deskripsi_lengkap = EXCLUDED.deskripsi_lengkap,
  jam_operasional = EXCLUDED.jam_operasional,
  alamat_lengkap = EXCLUDED.alamat_lengkap,
  status = EXCLUDED.status,
  is_unggulan = EXCLUDED.is_unggulan,
  urutan = EXCLUDED.urutan,
  updated_at = timezone('utc'::text, now());

-- Hak Akses (RLS) UMKM
ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;

-- 1. Siapapun (publik pengunjung) dapat membaca UMKM yang disetujui (status = 'disetujui')
DROP POLICY IF EXISTS "Allow public read approved umkm" ON public.umkm;
CREATE POLICY "Allow public read approved umkm" ON public.umkm
  FOR SELECT TO anon, authenticated
  USING (status = 'disetujui');

-- 2. Warga dapat mengajukan pendaftaran UMKM baru (otomatis status default 'menunggu')
DROP POLICY IF EXISTS "Allow public submit pendaftaran umkm" ON public.umkm;
CREATE POLICY "Allow public submit pendaftaran umkm" ON public.umkm
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 3. Kebijakan penuh untuk kemudahan kelola/admin
DROP POLICY IF EXISTS "Allow public all umkm" ON public.umkm;
CREATE POLICY "Allow public all umkm" ON public.umkm
  FOR ALL TO anon, authenticated
  USING (true);

-- Aktifkan Realtime agar setiap acc admin atau edit produk langsung muncul live
ALTER PUBLICATION supabase_realtime ADD TABLE public.umkm;

-- ==============================================================================
-- 9. TABEL PENGGUNA & AUTENTIKASI MULTI-ROLE (ADMIN, KADES, USER/WARGA)
-- ==============================================================================
-- Struktur Role disesuaikan 100% dengan database UKL Kelas 11:
-- 1. 'admin': Administrator Pengelola Web & Konten Desa (admin@sawotratap.com / admin123)
-- 2. 'kades': Kepala Desa untuk persetujuan surat & perizinan (kades@sawotratap.desa.id / password)
-- 3. 'user': Warga Desa untuk pengajuan layanan mandiri (user@sawotratap.com / user123)

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nik VARCHAR(16) UNIQUE,
  password TEXT NOT NULL,                  -- Kata sandi akun
  role TEXT NOT NULL DEFAULT 'user',       -- 'admin', 'kades', 'user' (warga)
  avatar TEXT DEFAULT '/Logo/IMG_1650.GIF',
  telepon TEXT DEFAULT '',
  rw TEXT DEFAULT 'RW 01',
  alamat TEXT DEFAULT '',                  -- Alamat rumah lengkap & patokan lokasi warga
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Akun Default (Sesuai UKL Kelas 11 & Portal Desa Sawotratap)
INSERT INTO public.users (id, name, email, nik, password, role, avatar, telepon, rw)
VALUES
  (
    'usr-admin-1',
    'Admin Desa Sawotratap',
    'admin@sawotratap.com',
    '3515111101900001',
    'admin123',
    'admin',
    '/Logo/IMG_1650.GIF',
    '081234567891',
    'RW 01'
  ),
  (
    'usr-kades-1',
    'Kepala Desa Sawotratap',
    'kades@sawotratap.desa.id',
    '3515110101750001',
    'password',
    'kades',
    '/aset/kades.jpg',
    '081234567892',
    'RW 01'
  ),
  (
    'usr-warga-1',
    'Hadi Purnomo (Warga Sawotratap)',
    'user@sawotratap.com',
    '3515112001000001',
    'user123',
    'user',
    '/Logo/IMG_1650.GIF',
    '081234567893',
    'RW 03'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  nik = EXCLUDED.nik,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  avatar = EXCLUDED.avatar;

-- Hak Akses (RLS) Pengguna
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read users" ON public.users;
CREATE POLICY "Allow public read users" ON public.users
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public all users" ON public.users;
CREATE POLICY "Allow public all users" ON public.users
  FOR ALL TO anon, authenticated
  USING (true);

-- Aktifkan Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
