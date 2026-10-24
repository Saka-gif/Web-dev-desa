import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Aesthetic2DBackground from "./components/aesthetic-2d-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FAF9F4] text-[#111827] flex flex-col font-sans relative">
        {/* Ambient Aesthetic 2D Background Animation */}
        <Aesthetic2DBackground />

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