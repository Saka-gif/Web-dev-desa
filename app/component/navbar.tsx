"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Deteksi scroll layar secara dinamis
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Berita", href: "#berita" },
    { name: "Layanan", href: "#layanan" },
    { name: "Transparansi", href: "#transparansi" },
    { name: "UMKM", href: "#umkm" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 px-6 sm:px-10 lg:px-16 ${
        isScrolled
          ? "py-3 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/40"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LOGO & IDENTITAS DESA */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 bg-slate-900 border border-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white shadow-md transition-all group-hover:border-[#C7D42B] group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-[#64A8E5]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-10.5v2.25a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-2.25m-13.5 0M12 3v18M12 3l7.5 7.5M12 3L4.5 10.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight text-white leading-none group-hover:text-[#C7D42B] transition-colors">
              Sawotratap
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#64A8E5] uppercase mt-0.5">
              Smart Service
            </span>
          </div>
        </a>

        {/* NAVIGASI UTAMA DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-semibold tracking-wide text-slate-300 hover:text-[#C7D42B] transition-all duration-200"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* TOMBOL PORTAL WARGA */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <a
            href="#login"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 px-6 py-2.5 text-xs font-black shadow-lg transition-all duration-300 hover:bg-[#C7D42B] hover:scale-105 active:scale-95"
          >
            <span>Portal Warga</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* HAMBURGER MOBILE */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 md:hidden rounded-lg transition-colors text-white hover:bg-white/10"
          aria-label="Toggle Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>

      </div>

      {/* DROPDOWN MENU MOBILE */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 p-4 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/10 flex flex-col gap-2">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-200 rounded-xl hover:bg-white/10 hover:text-[#C7D42B]"
            >
              {item.name}
            </a>
          ))}
          <a
            href="#login"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 text-center bg-[#C7D42B] text-slate-950 text-xs font-black py-3 rounded-xl shadow-md"
          >
            Portal Warga
          </a>
        </div>
      )}
    </header>
  );
}