"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Store,
  ChevronDown,
  User,
  LayoutDashboard,
  ShieldCheck,
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
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sawotratap_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup user dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("sawotratap_user");
    } catch {}
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

  const handleNavigateAnchor = (hash: string) => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
          return;
        }
      }
      window.location.href = "/" + hash;
    }
  };

  // Sembunyikan Navbar di halaman login, register, dan dashboard admin
  if (
    pathname === "/login" ||
    pathname?.startsWith("/login") ||
    pathname === "/register" ||
    pathname?.startsWith("/register") ||
    pathname === "/admin" ||
    pathname?.startsWith("/admin") ||
    pathname === "/kades" ||
    pathname?.startsWith("/kades")
  ) {
    return null;
  }

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
          <img
            src="/Logo/IMG_1650.GIF"
            alt="Logo Resmi Desa Sawotratap"
            className="w-10 h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
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

        {/* TOMBOL LOGIN / STATUS AKUN & DROPDOWN USER */}
        <div className="hidden lg:flex items-center">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white px-3.5 py-2 text-xs font-bold transition-all backdrop-blur-md hover:scale-105 shadow-sm cursor-pointer"
                aria-expanded={isUserMenuOpen}
                aria-label="Menu akun pengguna"
              >
                <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-pulse" />
                <span className="max-w-[120px] truncate">{user.name?.split(" ")[0]}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-purple-200 text-purple-900"
                      : user.role === "kades"
                      ? "bg-amber-200 text-amber-900"
                      : "bg-emerald-200 text-emerald-900"
                  }`}
                >
                  {user.role}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180 text-[#C5D82F]" : "text-slate-300"
                  }`}
                />
              </button>

              {/* DROPDOWN USER: LAPORAN & UMKM */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-72 rounded-3xl bg-white p-3 shadow-2xl shadow-emerald-950/25 border border-slate-100 text-[#111827] z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* USER INFO HEADER */}
                  <div className="p-3 bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50/50 rounded-2xl border border-emerald-100/80 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {user.name || "Warga Sawotratap"}
                        </p>
                        <p className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="uppercase tracking-wider">
                            {user.role === "admin"
                              ? "Administrator Desa"
                              : user.role === "kades"
                              ? "Kepala Desa"
                              : "Warga Terdaftar"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MENU ITEMS */}
                  <div className="space-y-1">
                    {/* 1. MENU LAPORAN KHUSUS WARGA */}
                    <Link
                      href="/laporan"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-emerald-50 text-slate-800 hover:text-[#064E3B] transition-all group text-left cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#064E3B] flex items-center justify-center shrink-0 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold leading-snug">Laporan Saya</p>
                        <p className="text-[11px] text-slate-500 group-hover:text-emerald-700">
                          Surat, kerusakan & perizinan
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-[#064E3B] group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </Link>

                    {/* 2. MENU UMKM */}
                    <button
                      type="button"
                      onClick={() => handleNavigateAnchor("#umkm")}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-emerald-50 text-slate-800 hover:text-[#064E3B] transition-all group text-left cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-lime-100/80 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold leading-snug">UMKM</p>
                        <p className="text-[11px] text-slate-500 group-hover:text-emerald-700">
                          Katalog produk warga & binaan
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-[#064E3B] group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </button>

                    {/* SHORTCUT PANEL (JIKA ADMIN / KADES) */}
                    {user.role === "admin" && (
                      <a
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-purple-50 text-purple-900 transition-all group text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:bg-purple-800 group-hover:text-white transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold leading-snug">Dashboard Admin</p>
                          <p className="text-[11px] text-purple-600">Kelola web, surat & data</p>
                        </div>
                      </a>
                    )}

                    {user.role === "kades" && (
                      <a
                        href="/kades"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-amber-50 text-amber-900 transition-all group text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold leading-snug">Dashboard Kades</p>
                          <p className="text-[11px] text-amber-600">Verifikasi surat & disposisi</p>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* TOMBOL LOGOUT */}
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="shine-hover inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C5D82F] hover:bg-[#b8cb26] text-[#06261D] px-6 py-2.5 text-sm sm:text-base font-black shadow-md transition-all duration-300 hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </a>
          )}
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
            {user ? (
              <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/60 p-4 space-y-3">
                <div className="flex items-center gap-3 pb-2.5 border-b border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-[#C5D82F] text-[#06261D] flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                      {user.role === "admin"
                        ? "Admin Desa"
                        : user.role === "kades"
                        ? "Kepala Desa"
                        : "Warga Terdaftar"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/laporan"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C5D82F]" />
                    <span>Laporan</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleNavigateAnchor("#umkm")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5 text-[#C5D82F]" />
                    <span>UMKM</span>
                  </button>
                </div>

                {user.role === "admin" && (
                  <a
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard Admin</span>
                  </a>
                )}

                {user.role === "kades" && (
                  <a
                    href="/kades"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-amber-900/60 border border-amber-500/40 text-amber-200 text-xs font-bold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Dashboard Kades</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#C5D82F] text-[#06261D] text-sm font-black flex items-center justify-center gap-2 shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Aparatur / Warga</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}