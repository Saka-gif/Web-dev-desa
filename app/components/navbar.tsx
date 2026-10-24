"use client";

import React, { useState, useEffect } from "react";
import {
  LogIn,
  Menu,
  X,
} from "lucide-react";

interface SubMenuItem {
  title: string;
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
  const [mobileExpandedTab, setMobileExpandedTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: MenuItem[] = [
    { name: "Home", href: "/" },
    {
      name: "Profil",
      href: "/profil",
      dropdown: [
        { title: "Sejarah Desa", href: "/profil#sejarah" },
        { title: "Visi & Misi", href: "/profil#visi-misi" },
        { title: "Geografis & 3D", href: "/profil#geografis" },
        { title: "Demografi Penduduk", href: "/profil#demografi" },
      ],
    },
    {
      name: "Pemerintahan",
      href: "/pemerintahan",
      dropdown: [
        { title: "Sambutan Kepala Desa", href: "/pemerintahan#sambutan" },
        { title: "Struktur Pamong", href: "/pemerintahan#pamong" },
        { title: "BPD & Lembaga Desa", href: "/pemerintahan#bpd" },
        { title: "Transparansi APBDes", href: "/pemerintahan#transparansi" },
      ],
    },
    {
      name: "Informasi",
      href: "/informasi",
      dropdown: [
        { title: "Warta & Berita", href: "/informasi#berita" },
        { title: "Papan Edaran Resmi", href: "/informasi#pengumuman" },
        { title: "Agenda Kegiatan", href: "/informasi#agenda" },
        { title: "Galeri Dokumentasi", href: "/informasi#galeri" },
      ],
    },
    {
      name: "Layanan",
      href: "/layanan",
      dropdown: [
        { title: "Surat Mandiri Online", href: "/layanan#surat" },
        { title: "Pengaduan Warga", href: "/layanan#pengaduan" },
        { title: "Direktori Pasar UMKM", href: "/layanan#umkm" },
        { title: "Cek Status Berkas", href: "/layanan#status" },
      ],
    },
    { name: "Kontak", href: "/kontak" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 font-sans ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md py-3"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-xs py-3.5 sm:py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        
        {/* BRAND LOGO PEMERINTAH DESA SAWOTRATAP */}
        <a href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#285726] border border-emerald-800 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5 text-[#C5D82F]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[11px] sm:text-xs tracking-wider text-slate-500 uppercase">
                Pemerintah Desa
              </span>
              <span className="w-1 h-1 rounded-full bg-[#285726]" />
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                Gedangan
              </span>
            </div>
            <span className="font-black text-sm sm:text-base tracking-wider text-[#285726] uppercase leading-none mt-0.5">
              Sawotratap
            </span>
          </div>
        </a>

        {/* NAVIGASI DESKTOP PERSIS SEPERTI GAMBAR */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => {
            const hasDropdown = Boolean(item.dropdown);
            const isCurrentOpen = activeDropdown === item.name;

            return (
              <div
                key={item.name}
                className="relative py-2"
                onMouseEnter={() => hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`inline-flex items-center gap-1 text-[15px] sm:text-base font-bold tracking-normal transition-colors ${
                    isCurrentOpen
                      ? "text-[#285726]"
                      : "text-slate-800 hover:text-[#285726]"
                  }`}
                >
                  <span>{item.name}</span>
                  {/* Panah bawah dengan animasi 2D halus */}
                  {hasDropdown && isCurrentOpen && (
                    <span className="text-xs font-bold text-slate-800 ml-0.5 inline-block animate-bounce-subtle">↓</span>
                  )}
                </a>

                {/* DROPDOWN POPUP: FLOATING WHITE CARD ROUNDED-3XL DENGAN ANIMASI 2D POP-IN */}
                {hasDropdown && item.dropdown && isCurrentOpen && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50 min-w-[210px] animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-200 pointer-events-auto"
                  >
                    <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-black/15 border border-slate-100 flex flex-col space-y-4">
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.title}
                          href={sub.href}
                          onClick={() => {
                            setActiveDropdown(null);
                            const parts = sub.href.split("#");
                            if (typeof window !== "undefined" && parts[1] && window.location.pathname === parts[0]) {
                              window.location.hash = parts[1];
                              window.dispatchEvent(new Event("hashchange"));
                            }
                          }}
                          className="text-base font-bold text-slate-800 hover:text-[#285726] hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap block"
                        >
                          {sub.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* TOMBOL LOGIN DENGAN SHINE SWEEP 2D HOVER */}
        <div className="hidden lg:flex items-center">
          <a
            href="/login"
            className="shine-hover inline-flex items-center justify-center gap-2 rounded-2xl bg-[#285726] hover:bg-[#1e421c] text-white px-6 py-2.5 text-sm sm:text-base font-bold shadow-md shadow-emerald-950/20 transition-all duration-300 hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </a>
        </div>

        {/* HAMBURGER BUTTON MOBILE */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 lg:hidden rounded-xl text-slate-800 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
          aria-label="Buka Menu Navigasi"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* DRAWER MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 max-h-[80vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl text-slate-900 flex flex-col gap-3 animate-in fade-in slide-in-from-top-3">
          
          <div className="space-y-1">
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.dropdown);
              const isExpanded = mobileExpandedTab === item.name;

              return (
                <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50/60 overflow-hidden">
                  {hasDropdown ? (
                    <button
                      onClick={() => setMobileExpandedTab(isExpanded ? null : item.name)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-800 hover:text-[#285726] transition-colors"
                    >
                      <span>{item.name}</span>
                      <span className="text-xs font-bold text-slate-600">↓</span>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-bold text-slate-800 hover:text-[#285726]"
                    >
                      {item.name}
                    </a>
                  )}

                  {/* Isi Submenu Mobile */}
                  {hasDropdown && isExpanded && item.dropdown && (
                    <div className="p-4 pt-1 space-y-3 bg-white border-t border-slate-100">
                      {item.dropdown.map((sub) => (
                        <a
                          key={sub.title}
                          href={sub.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            const parts = sub.href.split("#");
                            if (typeof window !== "undefined" && parts[1] && window.location.pathname === parts[0]) {
                              window.location.hash = parts[1];
                              window.dispatchEvent(new Event("hashchange"));
                            }
                          }}
                          className="block text-sm font-bold text-slate-800 hover:text-[#285726] transition-colors py-1"
                        >
                          {sub.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tombol Login Mobile */}
          <div className="pt-2">
            <a
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#285726] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Login Aparatur / Warga</span>
            </a>
          </div>

        </div>
      )}
    </header>
  );
}