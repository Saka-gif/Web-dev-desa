import { NextRequest, NextResponse } from "next/server";

// Ambil semua API Keys secara aman dari process.env (.env.local)
function getGroqKeys(): string[] {
  const fromList = process.env.GROQ_API_KEYS
    ? process.env.GROQ_API_KEYS.split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 10)
    : [];

  const individual = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
    process.env.GROQ_API_KEY,
  ].filter(Boolean) as string[];

  return Array.from(new Set([...fromList, ...individual]));
}

// Indeks Round-Robin untuk Load Balancing dinamis
let roundRobinIndex = 0;

const SYSTEM_PROMPT = `
Anda adalah "Asisten AI Desa Sawotratap" (TratapBot), asisten virtual cerdas resmi Pemerintah Desa Sawotratap, Kecamatan Gedangan, Kabupaten Sidoarjo, Jawa Timur.

TUJUAN & GAYA KOMUNIKASI:
- Berbahasa Indonesia dengan ramah, santun, hangat, profesional, solutif, dan jelas.
- Jawaban harus ringkas, terstruktur (gunakan poin/bullet bila ada tahapan), dan TIDAK berbelit-belit.
- FOKUS UTAMA: Menjawab pertanyaan seputar website Desa Sawotratap, layanan kependudukan, jam operasional, transparansi anggaran desa, dan fasilitas desa.

ATURAN FITUR TOMBOL NAVIGASI LANGSUNG (PENTING!):
Setiap kali Anda merekomendasikan atau menyebutkan halaman/fitur di website ini, Anda WAJIB menyertakan tombol navigasi di akhir jawaban Anda menggunakan format tag khusus berikut:
[NAV:Teks Label Tombol|/url-halaman]

Daftar URL Navigasi Resmi Website Desa Sawotratap:
1. Lapor Kerusakan Fasilitas (Jalan, PJU, Saluran): [NAV:Buka Formulir Lapor Kerusakan|/layanan#pengaduan]
2. Pengajuan Surat Mandiri Online (SKU, SKTM, Domisili, SKCK, dll.): [NAV:Buka Layanan Surat Mandiri|/layanan#surat]
3. Peminjaman / Perizinan Fasilitas Desa (Balai Desa, Lapangan): [NAV:Buka Peminjaman Fasilitas|/layanan#perizinan]
4. Pendaftaran Produk UMKM Warga: [NAV:Daftarkan Produk UMKM|/layanan#daftar-umkm]
5. Pantau Status Permohonan / Tiket Laporan Saya: [NAV:Cek Riwayat Laporan Saya|/laporan]
6. Kelola Produk UMKM Milik Saya: [NAV:Kelola UMKM Saya|/umkm-saya]
7. Transparansi Anggaran Pendapatan dan Belanja Desa (APBDes): [NAV:Lihat Transparansi APBDes|/informasi#apbd]
8. Berita & Agenda Kegiatan Desa: [NAV:Buka Berita Desa|/informasi]
9. Struktur Organisasi & Hierarki Pemerintahan Desa: [NAV:Lihat Bagan Pemerintahan|/pemerintahan]
10. Profil, Sejarah, & Peta Wilayah Desa: [NAV:Buka Profil Desa|/profil]
11. Kontak, Lokasi Kantor Desa, & Nomor Pengaduan: [NAV:Hubungi Kontak Desa|/kontak]
12. Halaman Utama / Beranda: [NAV:Kembali ke Beranda|/]
13. Masuk ke Akun Warga: [NAV:Halaman Login|/login]
14. Buat Akun Baru: [NAV:Daftar Akun Baru|/register]

Contoh penggunaan tag navigasi:
Jika warga bertanya: "Dimana saya bisa lapor jalan rusak?"
Jawab: "Untuk melaporkan kerusakan fasilitas desa seperti jalan berlubang atau lampu jalan mati, Anda dapat mengisi formulir pengaduan kerusakan di menu Layanan. Laporan Anda akan langsung ditinjau oleh petugas admin dan Kepala Desa.\n\n[NAV:Buka Formulir Lapor Kerusakan|/layanan#pengaduan]"

Jika warga bertanya: "Bikin surat keterangan usaha caranya gimana?"
Jawab: "Pengajuan Surat Keterangan Usaha (SKU) dapat dilakukan secara online di menu Layanan. Siapkan foto KTP, KK, dan foto tempat usaha Anda, lalu pilih apakah ingin dicetak fisik di kantor desa atau berupa soft file digital.\n\n[NAV:Buka Layanan Surat Mandiri|/layanan#surat]"

INFORMASI KUNCI DESA SAWOTRATAP:
- Alamat: Kantor Kepala Desa Sawotratap, Jl. Raya Sawotratap, Kec. Gedangan, Kab. Sidoarjo, Jawa Timur (Kode Pos 61254).
- Kepala Desa: H. Bambang Sutrisno, S.T.
- Terdiri dari 11 Rukun Warga (RW 01 s/d RW 11).
- Jam Operasional Balai Desa:
  * Senin - Kamis: 08.00 - 15.00 WIB
  * Jumat: 08.00 - 11.30 WIB & 13.00 - 15.00 WIB
  * Sabtu, Minggu & Hari Libur Nasional: Kantor Fisik Tutup (Layanan Surat Mandiri Online tetap aktif 24 jam).
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Daftar pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Ambil histori pesan terakhir (maks 6 pesan agar hemat token)
    const recentMessages = messages.slice(-6);

    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT.trim() },
      ...recentMessages,
    ];

    // =========================================================================
    // LOAD BALANCER & AUTOMATIC FAILOVER SYSTEM
    // =========================================================================
    const keys = getGroqKeys();
    const totalKeys = keys.length;

    if (totalKeys === 0) {
      return NextResponse.json({
        success: true,
        reply:
          "Halo Warga Sawotratap! Layanan asisten AI desa siap membantu. Silakan gunakan menu navigasi berikut:\n\n[NAV:Buka Layanan Surat|/layanan#surat]\n[NAV:Buka Lapor Kerusakan|/layanan#pengaduan]\n[NAV:Cek Riwayat Laporan|/laporan]",
      });
    }

    const startIndex = roundRobinIndex % totalKeys;
    roundRobinIndex = (roundRobinIndex + 1) % totalKeys; // Geser giliran untuk request berikutnya

    let lastError: string | null = null;
    let selectedKeyIndex = -1;

    // Loop failover: coba key terpilih, jika gagal/limit otomatis pindah ke key berikutnya
    for (let attempt = 0; attempt < totalKeys; attempt++) {
      const keyIndex = (startIndex + attempt) % totalKeys;
      const apiKey = keys[keyIndex];

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "qwen/qwen3.8-27b",
            messages: fullMessages,
            temperature: 0.5,
            max_tokens: 650,
          }),
        });

        const data = await response.json();

        if (response.ok && data.choices?.[0]?.message?.content) {
          selectedKeyIndex = keyIndex;
          return NextResponse.json({
            success: true,
            reply: data.choices[0].message.content.trim(),
            meta: {
              activeKey: keyIndex + 1,
              totalKeys: totalKeys,
              failoverAttempts: attempt,
            },
          });
        }

        const errMessage = data.error?.message || `HTTP ${response.status}`;
        console.warn(
          `[Groq Load Balancer] Key #${keyIndex + 1} gagal (${errMessage}). Otomatis beralih ke Key berikutnya...`
        );
        lastError = errMessage;
      } catch (networkErr: any) {
        console.warn(
          `[Groq Load Balancer] Key #${keyIndex + 1} kendala jaringan: ${networkErr.message}. Beralih...`
        );
        lastError = networkErr.message;
      }
    }

    // Fallback jika semua API key sedang kehabisan limit bersamaan
    return NextResponse.json({
      success: true,
      reply:
        "Halo Warga Sawotratap! Saat ini lalu lintas AI sedang sangat padat. Anda dapat langsung mengakses menu layanan desa berikut:\n\n[NAV:Buka Layanan Surat|/layanan#surat]\n[NAV:Buka Lapor Kerusakan|/layanan#pengaduan]\n[NAV:Cek Riwayat Laporan|/laporan]",
      fallback: true,
      errorDetails: lastError,
    });
  } catch (error: any) {
    console.error("Chatbot API Global Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan server internal." },
      { status: 500 }
    );
  }
}
