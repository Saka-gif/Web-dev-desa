import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "Pemerintah Desa Sawotratap – Portal Resmi & Layanan Digital",
  description: "Portal resmi pelayanan mandiri kependudukan, keterbukaan informasi publik, APBDes, dan direktori UMKM Desa Sawotratap, Gedangan, Sidoarjo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF9F4] text-[#111827] flex flex-col font-sans relative">
        {/* Global Navigation */}
        <Navbar />

        {/* Konten Utama Halaman */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Global Footer Resmi Desa */}
        <Footer />
      </body>
    </html>
  );
}