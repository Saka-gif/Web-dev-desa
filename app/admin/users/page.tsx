"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  Trash2,
  KeyRound,
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
  Check,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  UserX,
} from "lucide-react";
import AdminSidebar from "@/app/components/admin-sidebar";
import LottieSuccessModal from "@/app/components/lottie-success-modal";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";

interface UserItem {
  id: string;
  name: string;
  email: string;
  nik?: string;
  password?: string;
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

export default function AdminUsersPage() {
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

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserItem | null>(null);
  const [deleteUserItem, setDeleteUserItem] = useState<UserItem | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    email: "",
    telepon: "",
    rw: "RW 01",
    alamat: "",
    role: "user",
    password: "",
    confirmPassword: "",
    is_active: true,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Reset Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Lottie Success Modal
  const [successPopup, setSuccessPopup] = useState<{
    title: string;
    message: string;
  } | null>(null);

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

  // Fetch users from API
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
      console.error("Gagal mengambil data user:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, rwFilter, statusFilter]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      nik: "",
      email: "",
      telepon: "",
      rw: "RW 01",
      alamat: "",
      role: "user",
      password: "",
      confirmPassword: "",
      is_active: true,
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: UserItem) => {
    setEditUser(user);
    setFormData({
      name: user.name || "",
      nik: user.nik || "",
      email: user.email || "",
      telepon: user.telepon || "",
      rw: user.rw || "RW 01",
      alamat: user.alamat || "",
      role: user.role || "user",
      password: "",
      confirmPassword: "",
      is_active: user.is_active !== false,
    });
    setFormError("");
  };

  // Submit Add User
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setFormError("Nama lengkap, email, dan kata sandi wajib diisi.");
      return;
    }

    if (formData.nik.trim() && formData.nik.trim().length !== 16) {
      setFormError("Nomor NIK harus 16 digit angka.");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Kata sandi minimal 6 karakter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          nik: formData.nik,
          email: formData.email,
          telepon: formData.telepon,
          rw: formData.rw,
          alamat: formData.alamat,
          role: formData.role,
          password: formData.password,
          is_active: formData.is_active,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setFormError(json.message || "Gagal membuat akun.");
        setIsSubmitting(false);
        return;
      }

      setIsAddModalOpen(false);
      setSuccessPopup({
        title: "Akun Berhasil Dibuat!",
        message: `Akun atas nama ${formData.name} dengan peran ${formData.role.toUpperCase()} berhasil ditambahkan ke sistem desa.`,
      });
      fetchUsers();
    } catch (err: any) {
      setFormError(err?.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit User
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Nama lengkap dan email wajib diisi.");
      return;
    }

    if (formData.nik.trim() && formData.nik.trim().length !== 16) {
      setFormError("Nomor NIK harus 16 digit angka.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editUser.id,
          name: formData.name,
          nik: formData.nik,
          email: formData.email,
          telepon: formData.telepon,
          rw: formData.rw,
          alamat: formData.alamat,
          role: formData.role,
          is_active: formData.is_active,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setFormError(json.message || "Gagal memperbarui akun.");
        setIsSubmitting(false);
        return;
      }

      setEditUser(null);
      setSuccessPopup({
        title: "Data Akun Diperbarui!",
        message: `Profil akun ${formData.name} berhasil disimpan dengan perubahan terbaru.`,
      });
      fetchUsers();
    } catch (err: any) {
      setFormError(err?.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle User Active Status (Cepat)
  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.is_active === false;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          is_active: nextStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchUsers();
      } else {
        alert(json.message || "Gagal mengubah status akun.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Reset Password
  const handleSubmitResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    setResetError("");

    if (newPassword.length < 6) {
      setResetError("Kata sandi baru minimal harus 6 karakter.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resetPasswordUser.id,
          password: newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setResetError(json.message || "Gagal mengatur ulang kata sandi.");
        setIsResetting(false);
        return;
      }

      const userName = resetPasswordUser.name;
      setResetPasswordUser(null);
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessPopup({
        title: "Kata Sandi Berhasil Direset!",
        message: `Kata sandi baru untuk akun ${userName} telah aktif. Pengguna dapat langsung masuk dengan sandi baru ini.`,
      });
      fetchUsers();
    } catch (err: any) {
      setResetError(err?.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsResetting(false);
    }
  };

  // Submit Delete User
  const handleConfirmDelete = async () => {
    if (!deleteUserItem) return;

    setIsDeletingUser(true);
    try {
      const res = await fetch(`/api/admin/users?id=${deleteUserItem.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setFormError(json.message || "Gagal menghapus akun pengguna.");
        setIsDeletingUser(false);
        return;
      }

      const deletedName = deleteUserItem.name;
      setDeleteUserItem(null);
      setSuccessPopup({
        title: "Akun Berhasil Dihapus",
        message: `Akun atas nama ${deletedName} telah dihapus dari sistem desa.`,
      });
      fetchUsers();
    } catch (err: any) {
      setFormError(err?.message || "Terjadi kesalahan jaringan saat menghapus akun.");
    } finally {
      setIsDeletingUser(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex font-sans antialiased">
      {/* SIDEBAR ADMIN RESMI */}
      <AdminSidebar
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
                <span>Kelola Data</span>
                <span>/</span>
                <span className="text-[#064E3B] font-bold">Data User</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-[#111827]">
                Kelola Data Akun Pengguna
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Akun</span>
            </button>
          </div>
        </header>

        {/* BODY DASHBOARD */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STATS METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Akun */}
            <div className="bg-white p-5 rounded-2xl border border-[#E3E8E2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Akun
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
                  {stats.total}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-1">
                  {stats.totalAktif} akun aktif
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
                  Akun Warga
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#064E3B] mt-1">
                  {stats.totalWarga}
                </h3>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                  Masyarakat Sawotratap
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
                  Administrator
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
                  {stats.totalAdmin}
                </h3>
                <p className="text-[11px] font-semibold text-blue-600 mt-1">
                  Petugas Tata Kelola
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Kepala Desa */}
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
                  placeholder="Cari nama pengguna, NIK, alamat email, atau no. telepon..."
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
                {/* Filter Peran (Role) */}
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

          {/* TABEL DATA USER */}
          <div className="bg-white rounded-2xl border border-[#E3E8E2] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-[#E3E8E2] text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Pengguna & Peran</th>
                    <th className="py-4 px-6">Identitas (NIK & Email)</th>
                    <th className="py-4 px-6">Kontak & Alamat</th>
                    <th className="py-4 px-6">Status Akun</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
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
                    users.map((item) => {
                      const isMasterAdmin = item.id === "usr-admin-1" || item.email === "admin@sawotratap.com";
                      const isMasterKades = item.id === "usr-kades-1";

                      return (
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

                          {/* Kontak & Alamat */}
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
                                {item.alamat || "Alamat domisili belum dilengkapi"}
                              </p>
                            </div>
                          </td>

                          {/* Status & Toggle Cepat */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(item)}
                                disabled={isMasterAdmin}
                                title={
                                  isMasterAdmin
                                    ? "Akun Super Admin utama tidak dapat dinonaktifkan"
                                    : item.is_active !== false
                                    ? "Klik untuk menonaktifkan akun"
                                    : "Klik untuk mengaktifkan akun"
                                }
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                                  item.is_active !== false
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                    : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"
                                } ${isMasterAdmin ? "opacity-75 cursor-not-allowed" : ""}`}
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
                              </button>
                            </div>
                          </td>

                          {/* Tombol Aksi */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Profil */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                                title="Edit Data Pengguna"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Reset Kata Sandi */}
                              <button
                                type="button"
                                onClick={() => {
                                  setResetPasswordUser(item);
                                  setNewPassword("");
                                  setConfirmNewPassword("");
                                  setResetError("");
                                }}
                                className="p-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                                title="Atur Ulang Kata Sandi"
                              >
                                <KeyRound className="w-4 h-4" />
                              </button>

                              {/* Hapus Akun */}
                              {!isMasterAdmin && !isMasterKades ? (
                                <button
                                  type="button"
                                  onClick={() => setDeleteUserItem(item)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                  title="Hapus Akun"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <span
                                  title="Akun Utama Terlindungi"
                                  className="p-2 text-slate-300 cursor-not-allowed"
                                >
                                  <ShieldAlert className="w-4 h-4" />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
                Sistem Informasi Desa Sawotratap • Data tersinkronisasi
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH AKUN BARU */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Tambah Akun Pengguna Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Radhitya Akbar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              {/* Grid: NIK & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor NIK (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="3515112001000001"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })
                    }
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@sawotratap.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
              </div>

              {/* Grid: Telepon & RW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilayah RW
                  </label>
                  <select
                    value={formData.rw}
                    onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  >
                    {LIST_RW.map((rw) => (
                      <option key={rw} value={rw}>
                        {rw}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Peran / Hak Akses */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peran & Hak Akses Akun <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "user", label: "Warga", desc: "Akses Layanan Warga" },
                    { id: "admin", label: "Admin", desc: "Panel Tata Kelola" },
                    { id: "kades", label: "Kepala Desa", desc: "Verifikasi Final & ACC" },
                  ].map((roleOpt) => (
                    <button
                      key={roleOpt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: roleOpt.id })}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.role === roleOpt.id
                          ? "border-[#064E3B] bg-emerald-50/70 text-[#064E3B] font-black"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                      }`}
                    >
                      <div className="text-xs">{roleOpt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {roleOpt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap / Domisili
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. Garuda No. ..., RT 02 / RW 01, Sawotratap"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              {/* Grid: Kata Sandi & Konfirmasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Konfirmasi Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ketik ulang sandi"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
              </div>

              {/* Status Akun */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="add-status"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="add-status" className="text-xs font-bold text-slate-700">
                  Aktifkan akun ini sekarang
                </label>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#04382A] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Akun Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT AKUN PENGGUNA */}
      {/* ========================================================================= */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Edit Data Akun Pengguna
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {editUser.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              {/* Grid: NIK & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor NIK (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })
                    }
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
              </div>

              {/* Grid: Telepon & RW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilayah RW
                  </label>
                  <select
                    value={formData.rw}
                    onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                  >
                    {LIST_RW.map((rw) => (
                      <option key={rw} value={rw}>
                        {rw}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Peran / Hak Akses */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peran & Hak Akses Akun
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "user", label: "Warga", desc: "Akses Layanan Warga" },
                    { id: "admin", label: "Admin", desc: "Panel Tata Kelola" },
                    { id: "kades", label: "Kepala Desa", desc: "Verifikasi Final & ACC" },
                  ].map((roleOpt) => (
                    <button
                      key={roleOpt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: roleOpt.id })}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.role === roleOpt.id
                          ? "border-[#064E3B] bg-emerald-50/70 text-[#064E3B] font-black"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                      }`}
                    >
                      <div className="text-xs">{roleOpt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {roleOpt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap / Domisili
                </label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              {/* Status Akun */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-status"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="edit-status" className="text-xs font-bold text-slate-700">
                  Akun dalam keadaan aktif (bisa login ke portal)
                </label>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#04382A] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RESET KATA SANDI AKUN */}
      {/* ========================================================================= */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Reset Kata Sandi Akun
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{resetPasswordUser.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResetPassword} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                Admin dapat menetapkan kata sandi baru untuk akun ini jika warga atau staf lupa kata sandi mereka.
              </div>

              {resetError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{resetError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang kata sandi baru"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-[#064E3B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Kata Sandi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: KONFIRMASI HAPUS AKUN (CUSTOM POPUP) */}
      {/* ========================================================================= */}
      <ConfirmDeleteModal
        isOpen={deleteUserItem !== null}
        title="Hapus Akun Pengguna?"
        message="Apakah Anda yakin ingin menghapus akun ini dari database sistem desa? Tindakan ini tidak dapat dibatalkan."
        itemName={deleteUserItem ? `${deleteUserItem.name} (${deleteUserItem.email})` : undefined}
        confirmText="Ya, Hapus Akun"
        isLoading={isDeletingUser}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteUserItem(null)}
      />

      {/* LOTTIE SUCCESS MODAL */}
      <LottieSuccessModal
        isOpen={successPopup !== null}
        title={successPopup?.title}
        message={successPopup?.message || ""}
        onClose={() => setSuccessPopup(null)}
      />
    </div>
  );
}
