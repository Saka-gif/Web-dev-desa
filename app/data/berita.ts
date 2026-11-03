export interface BeritaItem {
  id: string;
  kategori: "berita" | "pengumuman" | "agenda";
  judul: string;
  ringkasan: string;
  tanggal: string;
  penulis: string;
  foto: string;
  badge: string;
  konten?: string;
}

export const DAFTAR_BERITA: BeritaItem[] = [
  {
    id: "b1",
    kategori: "berita",
    judul: "Gotong Royong Massal Drainase & Penanaman 300 Pohon RW 01–11",
    ringkasan: "Warga bersama Karang Taruna serentak bersihkan saluran air dan tanam peneduh menyambut musim hujan.",
    tanggal: "22 Okt 2024",
    penulis: "Humas Pemdes",
    foto: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/gotong-royong.jpg",
    badge: "Lingkungan",
    konten: `Dalam rangka mengantisipasi datangnya musim penghujan serta mewujudkan lingkungan desa yang asri dan bebas banjir, Pemerintah Desa Sawotratap bersama jajaran Karang Taruna dan ratusan warga menggelar aksi gotong royong serentak di wilayah RW 01 hingga RW 11 pada Minggu pagi.

Aksi gotong royong difokuskan pada pembersihan endapan sedimen lumpur, rumput liar, serta sampah rumah tangga yang menyumbat saluran drainase utama desa. Warga secara swadaya membawa peralatan cangkul, sekop, dan karung penampung sampah untuk memperlancar aliran air menuju saluran pembuangan akhir.

Selain normalisasi saluran air, kegiatan ini juga dirangkai dengan gerakan penghijauan melalui penanaman 300 bibit pohon peneduh dan pohon produktif, seperti bibit Tabebuya, Ketapang Kencana, dan pohon buah mangga. Penanaman dipusatkan di sepanjang jalan poros lingkungan dan area terbuka hijau fasilitas umum desa.

Kepala Desa Sawotratap menyampaikan apresiasi yang setinggi-tingginya kepada seluruh ketua RT, RW, tokoh masyarakat, serta generasi muda yang kompak turun langsung ke lapangan. Semangat kebersamaan dan kegotongroyongan warga merupakan modal sosial utama dalam menjaga ketahanan lingkungan desa.

Pemerintah Desa juga mengimbau seluruh warga agar senantiasa menjaga kebersihan saluran air di depan rumah masing-masing dan tidak membuang sampah sembarangan ke selokan demi kenyamanan dan kesehatan bersama seluruh keluarga di Desa Sawotratap.`,
  },
  {
    id: "b2",
    kategori: "berita",
    judul: "Pelayanan Mandiri Online: Cetak Surat Pengantar 1x24 Jam Bebas Pungli",
    ringkasan: "Balai Desa hadirkan sistem verifikasi digital terpadu untuk pengurusan administrasi tanpa antre.",
    tanggal: "18 Okt 2024",
    penulis: "PTSP Desa",
    foto: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/pelayanan.jpg",
    badge: "Layanan Publik",
    konten: `Pemerintah Desa Sawotratap resmi mengoperasikan sistem Pelayanan Mandiri Online terpadu yang dapat diakses langsung oleh masyarakat melalui portal web resmi desa. Inovasi ini dihadirkan guna mempermudah warga dalam mengurus aneka surat keterangan administrasi kependudukan tanpa harus mengantre panjang di loket Balai Desa.

Melalui portal Layanan Warga, masyarakat kini dapat mengajukan berbagai jenis dokumen, antara lain:
1. Surat Keterangan Domisili (SKD)
2. Surat Pengantar KTP-el dan Kartu Keluarga (KK)
3. Surat Keterangan Usaha (SKU) bagi pelaku UMKM
4. Surat Keterangan Tidak Mampu (SKTM) untuk kebutuhan beasiswa dan kesehatan
5. Permohonan Izin Kegiatan dan Peminjaman Fasilitas Gedung Desa

Sistem ini dilengkapi dengan mekanisme verifikasi digital terpadu. Begitu formulir dan berkas persyaratan diunggah oleh warga, petugas PTSP Balai Desa akan memverifikasi berkas dalam waktu maksimal 1x24 jam pada hari kerja. Setiap pemohon akan menerima kode resi pelacakan tiket digital sehingga status permohonan dapat dipantau secara transparan dan realtime.

Koordinator PTSP Desa menegaskan bahwa seluruh proses pengurusan surat mandiri online ini dijamin 100% bebas biaya (nol rupiah) dan bebas dari segala bentuk pungutan liar. Bagi warga lansia atau masyarakat yang belum terbiasa dengan teknologi digital, petugas pelayanan loket Balai Desa tetap siap sedia mendampingi proses pengisian di ruang pelayanan mandiri balai desa.`,
  },
  {
    id: "b3",
    kategori: "berita",
    judul: "Gebyar Pasar Rakyat & Pelatihan Legalitas NIB 150+ UMKM Sawotratap",
    ringkasan: "Fasilitasi sertifikasi halal dan perizinan usaha gratis bagi pedagang kuliner dan perajin lokal.",
    tanggal: "12 Okt 2024",
    penulis: "Pokja UMKM",
    foto: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/umkm-desa.jpg",
    badge: "Ekonomi",
    konten: `Perekonomian kerakyatan di Desa Sawotratap semakin menggeliat dengan terselenggaranya Gebyar Pasar Rakyat dan Pelatihan Legalitas Usaha yang diikuti oleh lebih dari 150 pelaku Usaha Mikro, Kecil, dan Menengah (UMKM). Acara yang berlangsung meriah di halaman Pendopo Balai Desa ini menjadi ajang promosi sekaligus pendampingan legalitas bagi para wirausahawan lokal.

Dalam kegiatan ini, Pokja UMKM Desa bekerja sama dengan dinas terkait memfasilitasi pendampingan pembuatan Nomor Induk Berusaha (NIB) berbasis Online Single Submission (OSS) secara gratis di tempat. Para pedagang kuliner tradisional, olahan keripik, konveksi, hingga perajin kriya lokal langsung menerima NIB resmi yang diterbitkan pada hari yang sama.

Selain legalitas perizinan usaha, peserta juga mendapatkan bimbingan teknis mengenai tata cara sertifikasi halal, standar higienitas kemasan produk pangan, serta tips foto produk menggunakan kamera smartphone agar terlihat menarik bagi konsumen modern.

Produk-produk UMKM warga yang telah terdaftar juga langsung dimasukkan ke dalam Etalase Katalog UMKM Digital di website resmi Desa Sawotratap. Melalui etalase ini, warga desa dan masyarakat luas dapat langsung melihat profil usaha, harga, serta memesan produk melalui kontak WhatsApp pemilik usaha.`,
  },
  {
    id: "b4",
    kategori: "berita",
    judul: "Revitalisasi Balai Desa & Pendopo Pertemuan Warga Tuntas",
    ringkasan: "Fasilitas baru ramah disabilitas, ruang laktasi, dan WiFi desa gratis siap digunakan musyawarah warga.",
    tanggal: "05 Okt 2024",
    penulis: "Kaur Perencanaan",
    foto: "https://s3-id-jkt-1.kilatstorage.id/sawotratap-image/berita/balai-desa.jpg",
    badge: "Infrastruktur",
    konten: `Pekerjaan revitalisasi dan penataan kawasan Balai Desa serta Pendopo Pertemuan Warga Sawotratap telah resmi rampung 100%. Gedung pusat pemerintahan dan kegiatan kemasyarakatan ini kini tampil lebih representatif, bersih, dan mengedepankan prinsip pelayanan publik yang inklusif serta ramah bagi seluruh kalangan.

Beberapa fasilitas baru yang kini siap dimanfaatkan warga antara lain:
1. Akses jalur ramp khusus pengguna kursi roda dan penyandang disabilitas
2. Ruang laktasi khusus ibu menyusui yang nyaman dan privat
3. Toilet terpisah yang higienis dengan fasilitas ramah difabel
4. Ruang tunggu loket ber-AC dengan display antrean nomor digital
5. Area hotspot WiFi desa gratis berkecepatan tinggi di sekitar pendopo
6. Sistem tata suara (sound system) dan pencahayaan modern untuk musyawarah desa

Pemerintah Desa Sawotratap berharap dengan tuntasnya pembenahan fasilitas balai desa ini, kenyamanan warga saat mengurus administrasi maupun saat menghadiri rapat koordinasi RT/RW, musrenbangdes, posyandu lansia, dan latihan kesenian tradisional dapat semakin meningkat. Fasilitas pendopo terbuka ini juga dapat dipinjam oleh warga desa untuk kegiatan sosial dan kemasyarakatan sesuai prosedur perizinan fasilitas desa.`,
  },
];