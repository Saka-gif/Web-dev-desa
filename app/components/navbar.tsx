"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LogIn,
  Menu,
  X,
  Home,
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
  const [prevActiveDropdown, setPrevActiveDropdown] = useState<string | null>(null);
  const [dropdownLeft, setDropdownLeft] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  // Menghitung posisi koordinat horizontal untuk floating card secara presisi
  const updateDropdownPosition = (name: string) => {
    const itemEl = itemRefs.current[name];
    const navEl = navRef.current;
    if (itemEl && navEl) {
      const itemRect = itemEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      // Selisih koordinat terhadap container navigasi
      const relativeLeft = itemRect.left - navRect.left - 14;
      // Batasi agar tidak meluap keluar batas kanan container
      const maxLeft = navRect.width - 260;
      const finalLeft = Math.max(0, Math.min(relativeLeft, maxLeft));
      setDropdownLeft(finalLeft);
    }
  };

  const handleMouseEnterItem = (name: string, hasDropdown: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (hasDropdown) {
      updateDropdownPosition(name);
      setPrevActiveDropdown(activeDropdown);
      setActiveDropdown(name);
    } else {
      // Jika kursor ke menu tanpa dropdown (seperti Home atau Kontak), mulai graceful exit buffer
      handleMouseLeave();
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Hover intent buffer 280ms agar perpindahan tenang, santai, dan tidak tergesa-gesa
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setPrevActiveDropdown(null);
    }, 280);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Re-kalkulasi posisi dropdown saat window di-resize
  useEffect(() => {
    const handleResize = () => {
      if (activeDropdown) {
        updateDropdownPosition(activeDropdown);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeDropdown]);

  const isSliding = Boolean(prevActiveDropdown && activeDropdown && prevActiveDropdown !== activeDropdown);
  const isOpen = Boolean(activeDropdown);

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

        {/* NAVIGASI DESKTOP DENGAN SMOOTH FLOATING DROPDOWN TRANSITION */}
        <nav
          ref={navRef}
          className="relative hidden lg:flex items-center gap-6 xl:gap-8"
          onMouseLeave={handleMouseLeave}
        >
          {navItems.map((item) => {
            const hasDropdown = Boolean(item.dropdown);
            const isCurrentOpen = activeDropdown === item.name;

            return (
              <div
                key={item.name}
                ref={(el) => {
                  itemRefs.current[item.name] = el;
                }}
                className="relative py-2"
                onMouseEnter={() => handleMouseEnterItem(item.name, hasDropdown)}
              >
                <a
                  href={item.href}
                  className={`inline-flex items-center text-[15px] sm:text-base font-bold tracking-normal transition-colors duration-200 ${
                    isCurrentOpen
                      ? "text-[#285726]"
                      : "text-slate-800 hover:text-[#285726]"
                  }`}
                >
                  <span>{item.name}</span>
                  
                  {/* Panah bawah dengan fixed width slot agar NOL layout shift (tidak bergeser sama sekali) */}
                  {hasDropdown && (
                    <span
                      aria-hidden="true"
                      className={`inline-flex items-center justify-center w-3.5 h-3.5 text-xs font-bold ml-1 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isCurrentOpen
                          ? "text-[#285726] translate-y-0.5 opacity-100 scale-110"
                          : "text-slate-400 opacity-0 -translate-y-0.5 scale-90"
                      }`}
                    >
                      ↓
                    </span>
                  )}
                </a>

                {/* Indikator garis halus bawah tab yang aktif */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#285726] rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCurrentOpen ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </div>
            );
          })}

          {/* FLOATING DROPDOWN CARD BERSAMA DENGAN BUTTERY GLIDE TRANSITION (520ms TENANG & HALUS) */}
          <div
            onMouseEnter={handleDropdownMouseEnter}
            className="absolute top-full z-50 pt-2.5"
            style={{
              left: `${dropdownLeft}px`,
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
              pointerEvents: isOpen ? "auto" : "none",
              visibility: isOpen ? "visible" : "hidden",
              transition: isSliding
                ? "left 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "left 0ms linear, opacity 380ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1), visibility 380ms",
            }}
          >
            {/* Invisible hit-test bridge penahan kursor diagonal */}
            <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

            {/* Container Putih Rounded-3xl Sesuai Desain Referensi */}
            <div className="w-[260px] rounded-3xl bg-white p-5 shadow-2xl shadow-emerald-950/15 border border-slate-100/90 relative overflow-hidden">
              {navItems
                .filter((item) => Boolean(item.dropdown))
                .map((item) => {
                  const isCurrentTab = activeDropdown === item.name;
                  return (
                    <div
                      key={item.name}
                      className={`transition-all duration-400 ease-out flex flex-col space-y-3 ${
                        isCurrentTab
                          ? "opacity-100 translate-x-0 relative pointer-events-auto"
                          : "opacity-0 absolute inset-0 p-5 pointer-events-none translate-x-2"
                      }`}
                    >
                      {item.dropdown?.map((sub) => (
                        <a
                          key={sub.title}
                          href={sub.href}
                          onClick={() => {
                            setActiveDropdown(null);
                            setPrevActiveDropdown(null);
                            const parts = sub.href.split("#");
                            if (typeof window !== "undefined" && parts[1] && window.location.pathname === parts[0]) {
                              window.location.hash = parts[1];
                              window.dispatchEvent(new Event("hashchange"));
                            }
                          }}
                          className="group/item flex items-center justify-between text-[15px] font-bold text-slate-800 hover:text-[#285726] hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap"
                        >
                          <span>{sub.title}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#285726] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                        </a>
                      ))}
                    </div>
                  );
                })}

              {/* TOMBOL KEMBALI KE BERANDA (DIPERLIHATKAN DENGAN JELAS & ESTETIK) */}
              <div className="pt-3.5 mt-3 border-t border-slate-100">
                <a
                  href="/"
                  onClick={() => {
                    setActiveDropdown(null);
                    setPrevActiveDropdown(null);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-2xl bg-emerald-50/90 hover:bg-[#285726] text-[#285726] hover:text-white border border-emerald-200/90 hover:border-[#285726] text-xs font-black uppercase tracking-wider shadow-xs hover:shadow-md transition-all duration-300 group/home"
                >
                  <Home className="w-4 h-4 text-[#285726] group-hover/home:text-white transition-colors" />
                  <span>Kembali ke Beranda</span>
                </a>
              </div>
            </div>
          </div>
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
          
          {/* Tombol Kembali ke Beranda Mobile (Diperlihatkan Jelas) */}
          <div className="pb-1">
            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-2xl bg-emerald-50 text-[#285726] border border-emerald-200/90 text-xs font-black uppercase tracking-wider shadow-xs hover:bg-[#285726] hover:text-white transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </a>
          </div>

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
                      <span className={`text-xs font-bold text-slate-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        ↓
                      </span>
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

        </div>
      )}
    </header>
  );
}