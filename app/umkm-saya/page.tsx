"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit3,
  Search,
  ExternalLink,
  Phone,
  MapPin,
  Tag,
  ArrowLeft,
  X,
  Upload,
  Sparkles,
  ShoppingBag,
  Info,
  Calendar,
  Layers,
  Save,
  Check,
  Home,
  ChevronRight,
  Trash2,
  Lock,
  LogIn,
  Loader2,
} from "lucide-react";
import ConfirmDeleteModal from "@/app/components/confirm-delete-modal";
import { UmkmItem } from "@/app/data/umkm";

export default function UmkmSayaPage() {
  // 1. User Auth State
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    nik?: string;
    rw?: string;
    telepon?: string;
  } | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // 2. Data State
  const [products, setProducts] = useState<UmkmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "disetujui" | "menunggu" | "ditolak">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Modal Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<UmkmItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: "",
    kategori: "Kuliner",
    harga: "",
    kontak_wa: "",
    lokasi: "",
    rw: "RW 03",
    jam_operasional: "08.00 - 20.00 WIB",
    foto: "",
    deskripsi_singkat: "",
    deskripsi_lengkap: "",
  });

  // 4. Modal Tambah Produk Baru State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [createForm, setCreateForm] = useState({
    nama: "",
    kategori: "Kuliner",
    harga: "",
    kontak_wa: "",
    lokasi: "",
    rw: "RW 03",
    jam_operasional: "08.00 - 20.00 WIB",
    foto: "",
    deskripsi_singkat: "",
    deskripsi_lengkap: "",
  });

  // 5. Toast / Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 6. Delete State
  const [deleteProductItem, setDeleteProductItem] = useState<UmkmItem | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const handleDeleteProduct = async () => {
    if (!deleteProductItem) return;
    setIsDeletingProduct(true);
    try {
      const res = await fetch(`/api/umkm?id=${deleteProductItem.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Produk "${deleteProductItem.nama}" berhasil dihapus.`);
        setDeleteProductItem(null);
        fetchMyProducts();
      } else {
        showToast(json.message || "Gagal menghapus produk.");
      }
    } catch (err: any) {
      showToast("Terjadi kesalahan saat menghapus produk.");
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Helper untuk memverifikasi apakah item benar-benar milik user yang login
  const isUserMatch = (item: UmkmItem) => {
    if (!currentUser) return false;
    const user = currentUser;

    // 1. Cek NIK
    if (user.nik && item.nik_pemilik) {
      const uNik = user.nik.trim();
      const pNik = item.nik_pemilik.trim();
      if (uNik === pNik) return true;
    }

    // 2. Cek Nama Pemilik
    if (user.name && item.pemilik) {
      const uName = user.name.toLowerCase().trim();
      const pName = item.pemilik.toLowerCase().trim();
      if (pName === uName) return true;
      const uFirst = uName.split(" ")[0];
      if (uFirst.length > 2 && pName.includes(uFirst)) return true;
    }

    return false;
  };

  // Baca User Session secara aman (localStorage + cookie api)
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        // 1. Cek localStorage
        const saved = localStorage.getItem("sawotratap_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.name || parsed.nik || parsed.email)) {
            if (isMounted) {
              setCurrentUser(parsed);
              setIsAuthChecking(false);
            }
            return;
          }
        }

        // 2. Fallback cek session cookie via /api/auth/me
        try {
          const res = await fetch("/api/auth/me");
          const data = await res.json();
          if (data.authenticated && data.user) {
            if (isMounted) {
              setCurrentUser(data.user);
              try {
                localStorage.setItem("sawotratap_user", JSON.stringify(data.user));
              } catch {}
              setIsAuthChecking(false);
            }
            return;
          }
        } catch {
          // ignore API error
        }
      } catch {
        // ignore parse error
      }

      // Jika tidak ada user yang sedang login
      if (isMounted) {
        setCurrentUser(null);
        setIsAuthChecking(false);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Otomatis arahkan ke halaman login jika terbukti belum login
  useEffect(() => {
    if (!isAuthChecking && !currentUser) {
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAuthChecking, currentUser]);

  // Fetch Produk Milik User dari API
  const fetchMyProducts = async () => {
    if (!currentUser) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const user = currentUser;

      const params = new URLSearchParams({
        nik: user.nik || "",
        pemilik: user.name || "",
        status: "all",
      });

      const res = await fetch(`/api/umkm?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        // Double-check: HANYA simpan produk yang lolos verifikasi kepemilikan
        const filtered = (json.data as UmkmItem[]).filter(isUserMatch);
        setProducts(filtered);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn("Gagal mengambil data UMKM Saya:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyProducts();
    }
  }, [currentUser]);

  // Statistik Produk Saya
  const stats = useMemo(() => {
    const total = products.length;
    const disetujui = products.filter((p) => p.status === "disetujui").length;
    const menunggu = products.filter((p) => p.status === "menunggu" || !p.status).length;
    const ditolak = products.filter((p) => p.status === "ditolak").length;
    return { total, disetujui, menunggu, ditolak };
  }, [products]);

  // Filter & Search List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Filter Tab
      if (activeTab === "disetujui" && p.status !== "disetujui") return false;
      if (activeTab === "menunggu" && p.status !== "menunggu" && p.status !== undefined) return false;
      if (activeTab === "ditolak" && p.status !== "ditolak") return false;

      // Filter Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNama = p.nama?.toLowerCase().includes(q);
        const matchKategori = p.kategori?.toLowerCase().includes(q);
        const matchDeskripsi = p.deskripsi_singkat?.toLowerCase().includes(q) || p.deskripsi?.toLowerCase().includes(q);
        return matchNama || matchKategori || matchDeskripsi;
      }

      return true;
    });
  }, [products, activeTab, searchQuery]);

  // Handle Buka Modal Edit
  const handleOpenEdit = (product: UmkmItem) => {
    setEditingProduct(product);
    setEditForm({
      nama: product.nama || "",
      kategori: product.kategori || "Kuliner",
      harga: product.harga || "",
      kontak_wa: product.kontak_wa || product.kontak || "",
      lokasi: product.lokasi || "",
      rw: product.rw || "RW 03",
      jam_operasional: product.jam_operasional || "08.00 - 20.00 WIB",
      foto: product.foto || "",
      deskripsi_singkat: product.deskripsi_singkat || product.deskripsi || "",
      deskripsi_lengkap: product.deskripsi_lengkap || "",
    });
    setIsEditModalOpen(true);
  };

  // Simpan Perubahan Edit Produk
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editForm.nama.trim() || !editForm.kontak_wa.trim() || !editForm.deskripsi_singkat.trim()) {
      alert("Harap lengkapi Nama Produk, No WhatsApp, dan Deskripsi Singkat.");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/umkm", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          ...editForm,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Perubahan data produk berhasil disimpan!");
        setIsEditModalOpen(false);
        setEditingProduct(null);
        // Refresh live data
        fetchMyProducts();
      } else {
        alert(json.message || "Gagal memperbarui produk UMKM.");
      }
    } catch (err: any) {
      console.error("Error saving UMKM edit:", err);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Submit Produk Baru
  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Sesi login Anda berakhir. Silakan login terlebih dahulu.");
      window.location.href = "/login";
      return;
    }

    const user = currentUser;

    if (!createForm.nama.trim() || !createForm.deskripsi_singkat.trim()) {
      alert("Harap isi Nama Produk dan Deskripsi Singkat.");
      return;
    }

    try {
      setIsSubmittingNew(true);
      const res = await fetch("/api/umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          pemilik: user.name,
          nik_pemilik: user.nik || "",
          rw: createForm.rw || user.rw || "RW 03",
          kontak_wa: createForm.kontak_wa || user.telepon || "",
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Pendaftaran produk baru berhasil dikirim untuk verifikasi!");
        setIsCreateModalOpen(false);
        setCreateForm({
          nama: "",
          kategori: "Kuliner",
          harga: "",
          kontak_wa: "",
          lokasi: "",
          rw: "RW 03",
          jam_operasional: "08.00 - 20.00 WIB",
          foto: "",
          deskripsi_singkat: "",
          deskripsi_lengkap: "",
        });
        fetchMyProducts();
      } else {
        alert(json.message || "Gagal mendaftarkan produk.");
      }
    } catch (err) {
      console.error("Error submit new UMKM:", err);
      alert("Terjadi kesalahan saat mendaftarkan produk.");
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // State 1: Memeriksa Sesi
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#06261D] text-white flex flex-col items-center justify-center p-6 selection:bg-[#C5D82F]/30">
        <div className="w-12 h-12 rounded-full border-4 border-[#C5D82F] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-200">Memeriksa status login...</p>
      </div>
    );
  }

  // State 2: Belum Login -> Akses Ditolak & Tampilkan Tombol Login
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] text-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
              Akses Khusus Warga & Pelaku Usaha
            </span>
            <h2 className="text-2xl font-black text-[#111827]">
              Akses Masuk Diperlukan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Halaman <strong>Katalog & Kelola UMKM Saya</strong> hanya dapat dibuka setelah Anda masuk (login) ke sistem resmi desa.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white font-black text-xs shadow-md transition-all cursor-pointer hover:scale-102"
            >
              <LogIn className="w-4 h-4 text-[#C5D82F]" />
              <span>Masuk ke Akun Sekarang</span>
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-400">
            Mengarahkan otomatis ke halaman login dalam beberapa detik...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-slate-900 pb-24 font-sans selection:bg-[#C5D82F]/30 selection:text-[#064E3B]">
      {/* TOAST NOTIFIKASI */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-[#064E3B] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-400/40 animate-in fade-in slide-in-from-top duration-300">
          <div className="w-7 h-7 rounded-full bg-[#C5D82F] text-[#064E3B] flex items-center justify-center shrink-0 font-bold">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* 1. HERO HEADER RESMI WARGA (1 WARNA SOLID #06261D SAMA SEPERTI DI LAPORAN SAYA) */}
      <section className="relative bg-[#06261D] text-white pt-36 sm:pt-40 pb-16 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60 shadow-sm">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb navigasi */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            <Link href="/" className="hover:text-[#C5D82F] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <Link href="/layanan" className="hover:text-[#C5D82F] transition-colors">
              <span>Layanan</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-[#C5D82F]">Katalog & Kelola UMKM Saya</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Kolom Kiri: Judul & Keterangan */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B3D30] border border-emerald-800 text-[#C5D82F] text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-pulse" />
                <span>Portal Usaha & Produk Warga Terverifikasi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Katalog & Kelola <span className="text-[#C5D82F]">UMKM Saya</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Pantau status verifikasi produk usaha Anda, kelola katalog resmi yang tayang di etalase desa, dan perbarui rincian produk kapan saja.
              </p>

              {/* Tombol Aksi */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#C5D82F] hover:bg-[#d4e738] text-[#06261D] font-extrabold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Daftarkan Produk Baru</span>
                </button>
                <Link
                  href="/#umkm"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#093529] hover:bg-[#0c4737] text-white font-semibold text-sm border border-emerald-800 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#C5D82F]" />
                  <span>Lihat Etalase Publik</span>
                </Link>
              </div>
            </div>

            {/* Kolom Kanan: Kartu Profil Warga (Solid #093529 seperti di laporan saya) */}
            <div className="lg:col-span-4">
              <div className="p-5 rounded-3xl bg-[#093529] border border-emerald-800 text-white shadow-lg space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5D82F] text-[#06261D] font-black text-lg flex items-center justify-center shadow-md">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "H"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Pelaku UMKM Terdaftar</p>
                    <p className="text-base font-black text-white truncate">{currentUser?.name || "Hadi Purnomo"}</p>
                    <p className="text-xs font-mono text-emerald-300">NIK: {currentUser?.nik || "3515112001000001"}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span>Domisili Usaha:</span>
                  <span className="font-bold text-white">{currentUser?.rw || "RW 03 Sawotratap"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 STAT METRICS CARD (Solid #093529 seperti di laporan saya) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
            {/* Card 1: Total Produk */}
            <div className="bg-[#093529] rounded-2xl p-4 sm:p-5 border border-emerald-800 text-white shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-[#C5D82F]" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-slate-300 font-medium">Total Produk Anda</p>
                <p className="text-xl sm:text-2xl font-black text-white">{stats.total}</p>
              </div>
            </div>

            {/* Card 2: Disetujui / Tayang */}
            <div className="bg-[#093529] rounded-2xl p-4 sm:p-5 border border-emerald-700 text-white shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#C5D82F]" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-emerald-200 font-medium">Disetujui (Aktif di Web)</p>
                <p className="text-xl sm:text-2xl font-black text-[#C5D82F]">{stats.disetujui}</p>
              </div>
            </div>

            {/* Card 3: Menunggu Verifikasi */}
            <div className="bg-[#093529] rounded-2xl p-4 sm:p-5 border border-amber-600/60 text-white shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-amber-200 font-medium">Menunggu Verifikasi</p>
                <p className="text-xl sm:text-2xl font-black text-amber-300">{stats.menunggu}</p>
              </div>
            </div>

            {/* Card 4: Ditolak */}
            <div className="bg-[#093529] rounded-2xl p-4 sm:p-5 border border-rose-600/60 text-white shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-rose-200 font-medium">Perlu Perbaikan / Ditolak</p>
                <p className="text-xl sm:text-2xl font-black text-rose-300">{stats.ditolak}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 mt-8">
        {/* FILTER BAR & SEARCH */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#064E3B] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("disetujui")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "disetujui"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Disetujui ({stats.disetujui})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("menunggu")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "menunggu"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu ({stats.menunggu})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ditolak")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "ditolak"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Ditolak ({stats.ditolak})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama produk Anda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#064E3B] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* NOTICE PRIVACY & KEPEMILIKAN */}
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-start sm:items-center gap-3 text-xs text-emerald-900">
          <Info className="w-4 h-4 text-[#064E3B] shrink-0 mt-0.5 sm:mt-0" />
          <p>
            Halaman ini terisolasi secara privat. Hanya produk yang terdaftar atas nama <strong>{currentUser?.name || "Hadi Purnomo"}</strong> yang ditampilkan di sini. Produk milik warga lain tidak dapat dilihat atau diedit dari akun Anda.
          </p>
        </div>

        {/* DAFTAR PRODUK GRID */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#064E3B]/20 border-t-[#064E3B] animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-600">Memuat katalog UMKM Anda...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/80 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {searchQuery ? "Produk tidak ditemukan" : "Belum Ada Produk Terdaftar"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              {searchQuery
                ? `Tidak ada produk dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                : "Anda belum mendaftarkan produk usaha pada kategori ini. Daftarkan usaha Anda sekarang untuk dipromosikan di portal resmi desa."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Daftarkan Usaha Sekarang</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredProducts.map((item) => {
              const isApproved = item.status === "disetujui";
              const isPending = item.status === "menunggu" || !item.status;
              const isRejected = item.status === "ditolak";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Foto Produk & Status Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={item.foto || "/aset/umkm-desa.jpg"}
                      alt={item.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/aset/umkm-desa.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Status Badge Pojok Kiri Atas */}
                    <div className="absolute top-3 left-3">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5D82F]" />
                          <span>Disetujui (Tayang)</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-extrabold shadow-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Verifikasi</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Perlu Perbaikan</span>
                        </span>
                      )}
                    </div>

                    {/* Kategori Badge Pojok Kanan Atas */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-sm">
                        {item.kategori || "Kuliner"}
                      </span>
                    </div>

                    {/* Harga di pojok kiri bawah foto */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-[11px] text-white/80 font-medium">Harga / Tarif</p>
                      <p className="text-base font-extrabold text-[#C5D82F] drop-shadow-sm">
                        {item.harga || "Hubungi Penjual"}
                      </p>
                    </div>
                  </div>

                  {/* Konten Card */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-[#064E3B] transition-colors">
                        {item.nama}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.deskripsi_singkat || item.deskripsi || "Produk lokal UMKM Sawotratap"}
                      </p>

                      {/* Detail Info Ringkas */}
                      <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.lokasi || "Sawotratap"} ({item.rw || "RW 03"})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium">WA: +{item.kontak_wa || item.kontak || "-"}</span>
                        </div>
                        {item.jam_operasional && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.jam_operasional}</span>
                          </div>
                        )}
                      </div>

                      {/* Catatan Admin jika ada */}
                      {item.catatan_admin && (
                        <div
                          className={`mt-3.5 p-3 rounded-2xl text-[11px] leading-relaxed border ${
                            isApproved
                              ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                              : isPending
                              ? "bg-amber-50/70 border-amber-200 text-amber-800"
                              : "bg-rose-50/70 border-rose-200 text-rose-800"
                          }`}
                        >
                          <p className="font-bold mb-0.5 flex items-center gap-1">
                            <span>Catatan Verifikasi Admin:</span>
                          </p>
                          <p>{item.catatan_admin}</p>
                        </div>
                      )}
                    </div>

                    {/* Tombol Aksi Bawah */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#064E3B] text-slate-800 hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Produk</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteProductItem(item)}
                        className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Produk Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {isApproved && (
                        <Link
                          href="/#umkm"
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-bold transition-all cursor-pointer"
                          title="Lihat di Etalase Desa"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL EDIT PRODUK */}
      {/* ======================================================== */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Edit Data Usaha Warga
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Edit {editingProduct.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Edit */}
            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Produk */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Usaha / Produk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nama}
                    onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                    placeholder="Contoh: Kopi Robusta & Roastery Sawotratap"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Usaha <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editForm.kategori}
                    onChange={(e) => setEditForm({ ...editForm, kategori: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B] bg-white"
                  >
                    <option value="Kuliner">Kuliner</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Pertanian">Pertanian & Bibit</option>
                    <option value="Jasa">Jasa & Servis</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Harga */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Harga / Tarif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.harga}
                    onChange={(e) => setEditForm({ ...editForm, harga: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Contoh: Mulai Rp 28.000 atau Rp 15.000"
                  />
                </div>

                {/* Kontak WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Pemesanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.kontak_wa}
                    onChange={(e) => setEditForm({ ...editForm, kontak_wa: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Contoh: 081234567893"
                  />
                </div>

                {/* Jam Operasional */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={editForm.jam_operasional}
                    onChange={(e) => setEditForm({ ...editForm, jam_operasional: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="08.00 - 21.00 WIB"
                  />
                </div>

                {/* Lokasi / Alamat */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat / Lokasi Usaha
                  </label>
                  <input
                    type="text"
                    value={editForm.lokasi}
                    onChange={(e) => setEditForm({ ...editForm, lokasi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Jl. Merpati No. 14"
                  />
                </div>

                {/* RW Domisili */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilayah RW
                  </label>
                  <select
                    value={editForm.rw}
                    onChange={(e) => setEditForm({ ...editForm, rw: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B] bg-white"
                  >
                    <option value="RW 01">RW 01</option>
                    <option value="RW 02">RW 02</option>
                    <option value="RW 03">RW 03</option>
                    <option value="RW 04">RW 04</option>
                    <option value="RW 05">RW 05</option>
                    <option value="RW 06">RW 06</option>
                    <option value="RW 07">RW 07</option>
                  </select>
                </div>

                {/* URL Foto Produk */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Foto Produk / Banner
                  </label>
                  <input
                    type="text"
                    value={editForm.foto}
                    onChange={(e) => setEditForm({ ...editForm, foto: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="https://... atau /aset/umkm-desa.jpg"
                  />
                  {editForm.foto && (
                    <div className="mt-2 w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={editForm.foto}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/aset/umkm-desa.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Deskripsi Singkat */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi Singkat (Muncul di Kartu) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editForm.deskripsi_singkat}
                    onChange={(e) => setEditForm({ ...editForm, deskripsi_singkat: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Ringkasan produk/layanan maksimal 2 kalimat..."
                  />
                </div>

                {/* Deskripsi Lengkap */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi Lengkap & Keunggulan
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.deskripsi_lengkap}
                    onChange={(e) => setEditForm({ ...editForm, deskripsi_lengkap: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Ceritakan proses pembuatan, varian rasa, ukuran, atau ketentuan pemesanan..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs sm:text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL PENDAFTARAN PRODUK BARU */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Formulir Warga Sawotratap
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Daftarkan Usaha / Produk Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info SOP ACC */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Setelah formulir dikirim, status produk akan menjadi <strong>Menunggu Verifikasi</strong>. Admin Balai Desa akan memeriksa kesesuaian data sebelum produk tampil di etalase publik desa.
              </p>
            </div>

            {/* Form Tambah */}
            <form onSubmit={handleCreateNew} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Produk */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Usaha / Produk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.nama}
                    onChange={(e) => setCreateForm({ ...createForm, nama: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Contoh: Keripik Singkong Renyah Mas Hadi"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Usaha <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={createForm.kategori}
                    onChange={(e) => setCreateForm({ ...createForm, kategori: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B] bg-white"
                  >
                    <option value="Kuliner">Kuliner</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Pertanian">Pertanian & Bibit</option>
                    <option value="Jasa">Jasa & Servis</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Harga */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Harga / Tarif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.harga}
                    onChange={(e) => setCreateForm({ ...createForm, harga: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Mulai Rp 20.000"
                  />
                </div>

                {/* Kontak WA */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Pemesanan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.kontak_wa}
                    onChange={(e) => setCreateForm({ ...createForm, kontak_wa: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="081234567893"
                  />
                </div>

                {/* Jam Buka */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={createForm.jam_operasional}
                    onChange={(e) => setCreateForm({ ...createForm, jam_operasional: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="08.00 - 20.00 WIB"
                  />
                </div>

                {/* Alamat / Lokasi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat / Jalan
                  </label>
                  <input
                    type="text"
                    value={createForm.lokasi}
                    onChange={(e) => setCreateForm({ ...createForm, lokasi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Jl. Merpati RT 02 / RW 03"
                  />
                </div>

                {/* RW */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Wilayah RW
                  </label>
                  <select
                    value={createForm.rw}
                    onChange={(e) => setCreateForm({ ...createForm, rw: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B] bg-white"
                  >
                    <option value="RW 01">RW 01</option>
                    <option value="RW 02">RW 02</option>
                    <option value="RW 03">RW 03</option>
                    <option value="RW 04">RW 04</option>
                    <option value="RW 05">RW 05</option>
                    <option value="RW 06">RW 06</option>
                    <option value="RW 07">RW 07</option>
                  </select>
                </div>

                {/* URL Foto */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Foto Produk
                  </label>
                  <input
                    type="text"
                    value={createForm.foto}
                    onChange={(e) => setCreateForm({ ...createForm, foto: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="https://images.unsplash.com/... (atau kosongkan untuk foto standar)"
                  />
                </div>

                {/* Deskripsi Singkat */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi Singkat Usaha <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={createForm.deskripsi_singkat}
                    onChange={(e) => setCreateForm({ ...createForm, deskripsi_singkat: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#064E3B]"
                    placeholder="Jelaskan produk atau keunggulan usaha Anda..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmittingNew}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs sm:text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingNew ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Kirim Pendaftaran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* POPUP KONFIRMASI HAPUS (CUSTOM MODAL) */}
      <ConfirmDeleteModal
        isOpen={deleteProductItem !== null}
        title="Hapus Produk UMKM?"
        message="Apakah Anda yakin ingin menghapus produk ini dari daftar UMKM Anda? Produk tidak akan lagi tayang di etalase website desa."
        itemName={deleteProductItem?.nama}
        confirmText="Ya, Hapus Produk"
        isLoading={isDeletingProduct}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteProductItem(null)}
      />
    </div>
  );
}
