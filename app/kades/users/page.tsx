"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Landmark,
  UserCheck,
  ChevronDown,
  UserX,
  Shield,
  Calendar,
  Lock,
} from "lucide-react";
import KadesSidebar from "@/app/components/kades-sidebar";

interface UserItem {
  id: string;
  name: string;
  email: string;
  nik?: string;
  role: "admin" | "kades" | "user" | string;
  avatar?: string;
  telepon?: string;
  rw?: string;
  alamat?: string;
  is_active?: boolean;
  created_at?: string;
}

interface UserStats {
  total: number;
  totalWarga: number;
  totalAdmin: number;
  totalKades: number;
  totalAktif: number;
  totalNonaktif: number;
}

const LIST_RW = [
  "RW 01",
  "RW 02",
  "RW 03",
  "RW 04",
  "RW 05",
  "RW 06",
  "RW 07",
  "RW 08",
  "RW 09",
  "RW 10",
];

export default function KadesUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    totalWarga: 0,
    totalAdmin: 0,
    totalKades: 0,
    totalAktif: 0,
    totalNonaktif: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [rwFilter, setRwFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dropdown states & refs
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isRwDropdownOpen, setIsRwDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const rwDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Modal Detail User (Hanya Memantau / Read-Only)
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserItem | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (rwDropdownRef.current && !rwDropdownRef.current.contains(e.target as Node)) {
        setIsRwDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch users from API (Sama persis sumber datanya dengan Admin)
  const fetchUsers = async () => {
    try {
      setIsRefreshing(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (rwFilter !== "all") params.set("rw", rwFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
        if (json.stats) {
          setStats(json.stats);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data user (Kades):", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, rwFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex font-sans antialiased">
      {/* SIDEBAR MEJA KEPALA DESA */}
      <KadesSidebar
        activeItem="users"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* HEADER TOP NAVBAR */}
        <header className="h-16 px-6 sm:px-8 bg-white border-b border-[#E3E8E2] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Pengawasan Desa</span>
                <span>/</span>
                <span className="text-[#064E3B] font-bold">Data User</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-[#111827]">
                Pemantauan Data Akun Pengguna
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Pemantauan Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Hak Akses: Pengawasan Eksekutif</span>
            </div>

            <button
              type="button"
              onClick={fetchUsers}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-700 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* BODY DASHBOARD */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* BANNER PENGAWASAN PIMPINAN */}
          <div className="bg-linear-to-r from-[#064E3B] to-[#0D382B] rounded-2xl p-6 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Meja Kepala Desa
                </span>
                <span className="text-xs text-emerald-200 font-semibold">
                  Sistem Informasi Desa Sawotratap
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Data Akun & Demografi Pengguna Terdaftar
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Halaman ini memberikan visibilitas penuh bagi Kepala Desa untuk memantau seluruh akun warga terdaftar, staf administrator, serta keaktifan pengguna sistem. Tata kelola teknis (tambah, ubah, hapus) dipegang oleh Meja Admin Desa.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs font-bold">
              <Lock className="w-4 h-4 text-amber-300" />
              <span>Mode Hanya Pantau (Read-Only)</span>
            </div>
          </div>

          {/* STATS METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Akun */}
            <div className="bg-white p-5 rounded-2xl border border-[#E3E8E2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Akun Terdaftar
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
                  {stats.total}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-1">
                  {stats.totalAktif} akun aktif sistem
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Akun Warga */}
            <div className="bg-white p-5 rounded-2xl border border-[#E3E8E2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Masyarakat / Warga
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#064E3B] mt-1">
                  {stats.totalWarga}
                </h3>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                  Pengguna Layanan Warga
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Staf Admin */}
            <div className="bg-white p-5 rounded-2xl border border-[#E3E8E2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Staf Administrator
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
                  {stats.totalAdmin}
                </h3>
                <p className="text-[11px] font-semibold text-blue-600 mt-1">
                  Operator & Petugas Desa
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Pimpinan (Kades) */}
            <div className="bg-white p-5 rounded-2xl border border-[#E3E8E2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pimpinan (Kades)
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
                  {stats.totalKades}
                </h3>
                <p className="text-[11px] font-semibold text-amber-600 mt-1">
                  Kepala Desa Sawotratap
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Landmark className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="bg-white p-4 rounded-2xl border border-[#E3E8E2] shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Form Pencarian */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama warga, nomor NIK, alamat email, atau no. telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  Cari
                </button>
              </form>

              {/* Dropdown Filters */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                {/* Filter Peran */}
                <div className="relative" ref={roleDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {roleFilter === "all"
                        ? "Semua Peran"
                        : roleFilter === "admin"
                        ? "Admin"
                        : roleFilter === "kades"
                        ? "Kepala Desa"
                        : "Warga"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {isRoleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30">
                      {[
                        { label: "Semua Peran", val: "all" },
                        { label: "Warga Desa", val: "user" },
                        { label: "Administrator", val: "admin" },
                        { label: "Kepala Desa", val: "kades" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            setRoleFilter(opt.val);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            roleFilter === opt.val
                              ? "bg-emerald-50 text-[#064E3B]"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter RW */}
                <div className="relative" ref={rwDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRwDropdownOpen(!isRwDropdownOpen)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{rwFilter === "all" ? "Semua RW" : rwFilter}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {isRwDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 max-h-60 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setRwFilter("all");
                          setIsRwDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          rwFilter === "all" ? "bg-emerald-50 text-[#064E3B]" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Semua RW
                      </button>
                      {LIST_RW.map((rw) => (
                        <button
                          key={rw}
                          type="button"
                          onClick={() => {
                            setRwFilter(rw);
                            setIsRwDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            rwFilter === rw ? "bg-emerald-50 text-[#064E3B]" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {rw}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter Status */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {statusFilter === "all"
                        ? "Semua Status"
                        : statusFilter === "aktif"
                        ? "Aktif"
                        : "Nonaktif"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30">
                      {[
                        { label: "Semua Status", val: "all" },
                        { label: "Aktif", val: "aktif" },
                        { label: "Nonaktif", val: "nonaktif" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            setStatusFilter(opt.val);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            statusFilter === opt.val
                              ? "bg-emerald-50 text-[#064E3B]"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reset Filters */}
                {(searchQuery || roleFilter !== "all" || rwFilter !== "all" || statusFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setRoleFilter("all");
                      setRwFilter("all");
                      setStatusFilter("all");
                    }}
                    className="px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABEL DATA USER (READ-ONLY FOR KADES) */}
          <div className="bg-white rounded-2xl border border-[#E3E8E2] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-[#E3E8E2] text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Pengguna & Peran</th>
                    <th className="py-4 px-6">Identitas (NIK & Email)</th>
                    <th className="py-4 px-6">Kontak & Wilayah</th>
                    <th className="py-4 px-6">Status Akun</th>
                    <th className="py-4 px-6 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-emerald-700" />
                          <span>Memuat daftar akun pengguna...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                        <UserX className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-black text-slate-600">Tidak ada akun ditemukan</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Coba sesuaikan kata kunci pencarian atau filter yang Anda pilih.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    users.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Nama, Avatar, Role */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={item.avatar || "/Logo/IMG_1650.GIF"}
                                alt={item.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-white"
                              />
                              {item.role === "admin" && (
                                <span
                                  title="Administrator"
                                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[9px]"
                                >
                                  ★
                                </span>
                              )}
                              {item.role === "kades" && (
                                <span
                                  title="Kepala Desa"
                                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[9px]"
                                >
                                  👑
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-xs sm:text-sm">
                                  {item.name}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                {item.role === "admin" ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                                    Administrator
                                  </span>
                                ) : item.role === "kades" ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                    Kepala Desa
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Warga Desa
                                  </span>
                                )}

                                {item.rw && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                    {item.rw}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Identitas (NIK & Email) */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="font-mono text-xs font-bold text-slate-800">
                              {item.nik ? item.nik : <span className="text-slate-400 italic">NIK Belum Disetel</span>}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Kontak & Wilayah */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {item.telepon ? (
                              <a
                                href={`https://wa.me/${item.telepon.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{item.telepon}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Tidak ada nomor</span>
                            )}
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                              {item.alamat || "Alamat belum dilengkapi"}
                            </p>
                          </div>
                        </td>

                        {/* Status Akun */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${
                              item.is_active !== false
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-rose-100 text-rose-800 border border-rose-300"
                            }`}
                          >
                            {item.is_active !== false ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Aktif</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-700" />
                                <span>Nonaktif</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Tombol Detail (Read-Only) */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedUserDetail(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Lihat Profil</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-[#E3E8E2] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>
                Menampilkan <b>{users.length}</b> akun pengguna sistem
              </span>
              <span className="text-[11px] text-slate-400">
                Pengawasan Meja Kepala Desa Sawotratap • Data live tersinkronisasi
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL DETAIL AKUN PENGGUNA (READ-ONLY KHUSUS KADES) */}
      {/* ========================================================================= */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Detail Profil Pengguna
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedUserDetail.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Card Profil Utama */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={selectedUserDetail.avatar || "/Logo/IMG_1650.GIF"}
                  alt={selectedUserDetail.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-white"
                />
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {selectedUserDetail.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedUserDetail.role === "admin" ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                        Administrator Sistem
                      </span>
                    ) : selectedUserDetail.role === "kades" ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                        Kepala Desa Sawotratap
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Warga Masyarakat
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        selectedUserDetail.is_active !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {selectedUserDetail.is_active !== false ? "Akun Aktif" : "Akun Dinonaktifkan"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Detail Identitas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nomor NIK (KTP)
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {selectedUserDetail.nik || "-"}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Alamat Email
                  </span>
                  <span className="font-medium text-slate-800 mt-0.5 block break-all">
                    {selectedUserDetail.email}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    WhatsApp / Telepon
                  </span>
                  {selectedUserDetail.telepon ? (
                    <a
                      href={`https://wa.me/${selectedUserDetail.telepon.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-700 font-bold mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedUserDetail.telepon}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic mt-0.5 block">Belum ada nomor</span>
                  )}
                </div>

                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Wilayah Domisili
                  </span>
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {selectedUserDetail.rw || "RW 01"}
                  </span>
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div className="p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Alamat Lengkap
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedUserDetail.alamat || "Alamat belum dilengkapi oleh pengguna."}
                </p>
              </div>

              {/* Tanggal Terdaftar */}
              {selectedUserDetail.created_at && (
                <div className="flex items-center gap-2 text-slate-500 text-[11px] px-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Terdaftar di sistem:{" "}
                    <b>
                      {new Date(selectedUserDetail.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </b>
                  </span>
                </div>
              )}

              {/* Notice Akses Kades */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5" />
                <span>
                  Informasi ini ditampilkan dalam rangka pengawasan pimpinan desa. Pembaruan data atau perubahan sandi akun hanya dapat diproses melalui panel Administrator Desa.
                </span>
              </div>

              {/* Tombol Tutup */}
              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUserDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#04382A] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Tutup Tinjauan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
