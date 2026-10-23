"use client";

import { useState, useEffect } from "react";

interface SubMenuItem {
  title: string;
  desc?: string;
  href: string;
}

interface MenuItem {
  name: string;
  href: string;
  dropdown?: SubMenuItem[];
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: MenuItem[] = [
    { name: "Home", href: "#hero" },
    {
      name: "Profil",
      href: "#profil",
      dropdown: [
        { title: "Sejarah Desa", desc: "Asal-usul & rekam jejak Sawotratap", href: "#sejarah" },
        { title: "Visi & Misi", desc: "Arah pembangunan & komitmen desa", href: "#visi-misi" },
        { title: "Geografis", desc: "Peta wilayah & batas batas administratif", href: "#geografis" },
        { title: "Demografi Warga", desc: "Statistik struktur populasi warga", href: "#demografi" },
      ],
    },
    {
      name: "Pemerintahan",
      href: "#pemerintahan",
      dropdown: [
        { title: "Struktur Organisasi", desc: "Bagan tata kelola perangkat desa", href: "#pamong" },
        { title: "Lembaga Desa", desc: "BPD, LPKMD, Karang Taruna, & PKK", href: "#lembaga" },
        { title: "APBD & Transparansi", desc: "Realisasi anggaran & keuangan desa", href: "#transparansi" },
      ],
    },
    {
      name: "Informasi",
      href: "#informasi",
      dropdown: [
        { title: "Berita Terbaru", desc: "Kabar dan kegiatan terkini desa", href: "#berita" },
        { title: "Pengumuman Resmi", desc: "Edaran & kebijakan pemerintah desa", href: "#pengumuman" },
        { title: "Galeri Dokumentasi", desc: "Foto & video potret kegiatan warga", href: "#galeri" },
      ],
    },
    {
      name: "Layanan",
      href: "#layanan",
      dropdown: [
        { title: "Surat Mandiri Online", desc: "Pengajuan KTP, KK, & Surat Pengantar", href: "#surat" },
        { title: "Pengaduan Masyarakat", desc: "Layanan aspirasi & keluhan warga", href: "#pengaduan" },
        { title: "Direktori UMKM", desc: "Promosi produk ekonomi kreatif warga", href: "#umkm" },
      ],
    },
    { name: "Kontak", href: "#kontak" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 px-6 sm:px-10 lg:px-16 ${
        isScrolled
          ? "py-3.5 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50"
          : "py-6 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* BRAND & LOGO DESA SAWOTRATAP */}
        <a href="#" className="flex items-center gap-3.5 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2961B1] to-slate-900 border border-white/20 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#C7D42B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-white leading-none group-hover:text-[#C7D42B] transition-colors">
              PEMERINTAH DESA
            </span>
            <span className="font-extrabold text-xs tracking-wider text-[#64A8E5] uppercase mt-0.5">
              SAWOTRATAP
            </span>
          </div>
        </a>

        {/* NAVIGASI DESKTOP BER-DROPDOWN */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative py-2"
              onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={item.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide text-slate-200 hover:text-[#C7D42B] transition-all rounded-full hover:bg-white/5"
              >
                <span>{item.name}</span>
                {item.dropdown && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-3 h-3 transition-transform duration-300 ${
                      activeDropdown === item.name ? "rotate-180 text-[#C7D42B]" : "text-slate-400"
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                )}
              </a>

              {/* DROPDOWN MENU KAPSUL GLASS */}
              {item.dropdown && activeDropdown === item.name && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl border border-white/15 bg-slate-950/90 p-2.5 backdrop-blur-2xl shadow-2xl shadow-black/80 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1">
                    {item.dropdown.map((sub) => (
                      <a
                        key={sub.title}
                        href={sub.href}
                        className="group/sub flex flex-col rounded-xl p-2.5 transition-all hover:bg-white/10"
                      >
                        <span className="text-xs font-bold text-slate-100 group-hover/sub:text-[#C7D42B] transition-colors">
                          {sub.title}
                        </span>
                        {sub.desc && (
                          <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">
                            {sub.desc}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* TOMBOL LOGIN PORTAL WARGA */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <a
            href="#login"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C7D42B] text-slate-950 px-6 py-2.5 text-xs font-black shadow-xl shadow-[#C7D42B]/20 transition-all duration-300 hover:bg-[#b5c225] hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H8.25" />
            </svg>
            <span>Login Warga</span>
          </a>
        </div>

        {/* HAMBURGER BUTTON MOBILE */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 lg:hidden rounded-xl text-white bg-white/5 border border-white/10 hover:bg-white/10"
          aria-label="Toggle Navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>

      </div>

      {/* DROPDOWN NAVIGATION MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 max-h-[75vh] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/95 p-4 backdrop-blur-2xl shadow-2xl flex flex-col gap-3">
          {navItems.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#C7D42B] px-3 py-1">
                {item.name}
              </div>
              {item.dropdown ? (
                <div className="pl-3 space-y-1 border-l border-white/10 my-1">
                  {item.dropdown.map((sub) => (
                    <a
                      key={sub.title}
                      href={sub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold text-slate-200 rounded-lg hover:bg-white/10"
                    >
                      {sub.title}
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold text-slate-200 rounded-lg hover:bg-white/10"
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}
          <a
            href="#login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 text-center bg-[#C7D42B] text-slate-950 text-xs font-black py-3 rounded-xl shadow-md"
          >
            Login Warga
          </a>
        </div>
      )}
    </header>
  );
}