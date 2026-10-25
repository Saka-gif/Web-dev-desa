"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
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
        { title: "Struktur Organisasi", href: "/pemerintahan#struktur" },
        { title: "Perangkat Desa", href: "/pemerintahan#perangkat" },
        { title: "BPD", href: "/pemerintahan#bpd" },
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

  const updateDropdownPosition = (name: string) => {
    const itemEl = itemRefs.current[name];
    const navEl = navRef.current;
    if (itemEl && navEl) {
      const itemRect = itemEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      const relativeLeft = itemRect.left - navRect.left - 14;
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
      handleMouseLeave();
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
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
  const isBubble = !isScrolled;

  return (
    <header
  className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 font-sans ${
    isBubble
      ? "pt-4 px-4 sm:px-8 bg-transparent"
      : "bg-[#06261D]/95 backdrop-blur-xl border-b border-emerald-800/60 shadow-lg py-3.5 px-4 sm:px-8 lg:px-12"
  }`}
>
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-300 ${
          isBubble
            ? "rounded-full bg-[#06261D]/85 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] px-6 py-3.5 text-white"
            : "text-white"
        }`}
      >
        {/* BRAND LOGO */}
        <a href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#064E3B] border border-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5 text-[#C5D82F]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[11px] sm:text-xs tracking-wider text-slate-300 uppercase">
                Pemerintah Desa
              </span>
              <span className="w-1 h-1 rounded-full bg-[#C5D82F]" />
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                Gedangan
              </span>
            </div>
            <span className="font-black text-sm sm:text-base tracking-wider text-white uppercase leading-none mt-0.5">
              Sawotratap
            </span>
          </div>
        </a>

        {/* NAVIGASI DESKTOP */}
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
                      ? "text-[#C5D82F]"
                      : "text-slate-100 hover:text-[#C5D82F]"
                  }`}
                >
                  <span>{item.name}</span>
                  {hasDropdown && (
                    <span
                      aria-hidden="true"
                      className={`inline-flex items-center justify-center w-3.5 h-3.5 text-xs font-bold ml-1 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isCurrentOpen
                          ? "text-[#C5D82F] translate-y-0.5 opacity-100 scale-110"
                          : "text-slate-300 opacity-0 -translate-y-0.5 scale-90"
                      }`}
                    >
                      ↓
                    </span>
                  )}
                </a>

                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#C5D82F] rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isCurrentOpen ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </div>
            );
          })}

          {/* FLOATING DROPDOWN CARD */}
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
            <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

            <div className="w-[260px] rounded-3xl bg-white p-5 shadow-2xl shadow-emerald-950/25 border border-slate-100 relative text-[#111827] overflow-hidden">
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
                          className="group/item flex items-center justify-between text-[15px] font-bold text-slate-800 hover:text-[#064E3B] hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap"
                        >
                          <span>{sub.title}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                        </a>
                      ))}
                    </div>
                  );
                })}

              <div className="pt-3.5 mt-3 border-t border-slate-100">
                <a
                  href="/"
                  onClick={() => {
                    setActiveDropdown(null);
                    setPrevActiveDropdown(null);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-[#064E3B] text-[#064E3B] hover:text-white border border-emerald-200 text-xs font-black uppercase tracking-wider shadow-xs transition-all duration-300 group/home"
                >
                  <Home className="w-4 h-4 text-[#064E3B] group-hover/home:text-white transition-colors" />
                  <span>Kembali ke Beranda</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* TOMBOL LOGIN */}
        <div className="hidden lg:flex items-center">
          <a
            href="/login"
            className="shine-hover inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#06261D] px-6 py-2.5 text-sm sm:text-base font-black shadow-md transition-all duration-300 hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </a>
        </div>

        {/* HAMBURGER BUTTON MOBILE */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 lg:hidden rounded-xl text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-md"
          aria-label="Buka Menu Navigasi"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* DRAWER MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 max-h-[80vh] overflow-y-auto rounded-3xl border border-emerald-800/50 bg-[#06261D] p-5 shadow-2xl text-white flex flex-col gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="pb-1">
            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-2xl bg-white/10 text-white border border-white/20 text-xs font-black uppercase tracking-wider transition-all duration-300 hover:bg-[#C5D82F] hover:text-[#06261D]"
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
                <div key={item.name} className="rounded-2xl border border-emerald-800/50 bg-emerald-950/40 overflow-hidden">
                  {hasDropdown ? (
                    <button
                      onClick={() => setMobileExpandedTab(isExpanded ? null : item.name)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-white hover:text-[#C5D82F] transition-colors"
                    >
                      <span>{item.name}</span>
                      <span className={`text-xs font-bold text-slate-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        ↓
                      </span>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-bold text-white hover:text-[#C5D82F]"
                    >
                      {item.name}
                    </a>
                  )}

                  {hasDropdown && isExpanded && item.dropdown && (
                    <div className="p-4 pt-1 space-y-3 bg-[#083327] border-t border-emerald-800/50">
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
                          className="block text-sm font-bold text-slate-200 hover:text-[#C5D82F] transition-colors py-1"
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

          <div className="pt-2">
            <a
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#C5D82F] text-[#06261D] text-sm font-black flex items-center justify-center gap-2 shadow-md"
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