"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Send,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Navigation,
  Building,
  Ambulance,
  Phone,
  Shield,
  Flame,
} from "lucide-react";

export default function KontakPage() {
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [pesan, setPesan] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !telepon || !pesan) {
      alert("Harap lengkapi semua isian formulir.");
      return;
    }
    setSubmitted(true);
  };

  const googleMapsEmbedUrl = "https://maps.google.com/maps?q=Sawotratap,+Kecamatan+Gedangan,+Kabupaten+Sidoarjo,+Jawa+Timur&t=m&z=15&ie=UTF8&iwloc=&output=embed";
  const externalMapsLink = "https://www.google.com/maps/place/Sawotratap,+Gedangan,+Sidoarjo+Regency,+East+Java";

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#111827] pt-24 sm:pt-28 pb-20 font-sans">
      
      {/* 1. HERO HEADER KONTAK */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#06261D] via-[#083327] to-[#0A1F17] text-white py-14 sm:py-20 px-6 sm:px-10 lg:px-16 border-b border-emerald-900/60">
        
        <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#C5D82F]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80">
            <a href="/" className="hover:text-[#C5D82F] transition-colors">Beranda</a>
            <span>/</span>
            <span className="text-white font-bold">Kontak & Lokasi</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#064E3B]/80 px-4 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C5D82F] animate-ping" />
            <span>Pusat Komunikasi Resmi Balai Desa Sawotratap</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Lokasi Balai & <br />
            <span className="text-[#C5D82F] drop-shadow-[0_4px_24px_rgba(197,216,47,0.3)]">
              Kontak Siaga 24 Jam
            </span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
            Alamat kantor desa, jadwal pelayanan tatap muka PTSP, peta penunjuk arah dari Flyover Aloha, dan nomor kontak darurat.
          </p>
        </div>
      </section>

      {/* 2. KONTEN DETAIL KONTAK & PETA */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 space-y-16">
        
        {/* GRID KARTU KONTAK UTAMA (VISUAL CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-6 rounded-3xl border border-[#E3E8E2] bg-white shadow-xs space-y-2 card-interactive-2d">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#111827]">Alamat Kantor Desa</h3>
            <p className="text-xs text-slate-600 font-medium">
              Jl. Raya Sawotratap No. 1, Kec. Gedangan, Kab. Sidoarjo 61254.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[#E3E8E2] bg-white shadow-xs space-y-2 card-interactive-2d">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#111827]">Jam Pelayanan PTSP</h3>
            <div className="text-xs text-slate-600 space-y-0.5 font-medium">
              <div>Senin – Kamis: 08.00 – 15.00 WIB</div>
              <div>Jumat: 08.00 – 14.30 WIB</div>
              <div className="text-emerald-700 font-bold pt-1">Online: 24 Jam Non-Stop</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-[#E3E8E2] bg-white shadow-xs space-y-2 card-interactive-2d">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#111827]">WhatsApp Siaga Balai</h3>
            <div className="text-xs text-slate-600 space-y-0.5">
              <div className="font-mono font-black text-slate-900 text-sm">0812-3456-7890</div>
              <div className="text-[11px] text-slate-500">Piket Pelayanan Balai Desa</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-[#E3E8E2] bg-white shadow-xs space-y-2 card-interactive-2d">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#111827]">Email & Portal Resmi</h3>
            <div className="text-xs text-slate-600 space-y-0.5 font-medium">
              <div className="font-mono text-emerald-800 font-bold">pemdes@sawotratap.desa.id</div>
              <div className="text-[11px] text-slate-500">Respon Resmi 1x24 Jam</div>
            </div>
          </div>

        </div>

        {/* PETA INTERAKTIF & FORMULIR PESAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Embed Google Maps */}
          <div className="lg:col-span-7 rounded-3xl border border-[#E3E8E2] bg-white overflow-hidden shadow-xs card-interactive-2d">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#111827]">Peta Lokasi Desa Sawotratap</h3>
                <p className="text-xs text-slate-500 font-medium">Gedangan • Sidoarjo, Jawa Timur</p>
              </div>
              <a
                href={externalMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#064E3B] text-xs font-bold hover:bg-emerald-100 transition-colors shine-hover"
              >
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="relative h-96 w-full bg-slate-100">
              <iframe
                title="Peta Google Maps Desa Sawotratap Sidoarjo"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-4 bg-slate-50 text-xs text-slate-700 flex items-center gap-2 font-medium">
              <Navigation className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Akses Cepat: 5 menit dari Flyover Aloha, 12 menit dari Terminal Bandara Juanda T1 & T2.</span>
            </div>
          </div>

          {/* Form Kirim Pesan */}
          <div className="lg:col-span-5 rounded-3xl border border-[#E3E8E2] bg-white p-6 sm:p-8 shadow-xs space-y-4 card-interactive-2d">
            <h3 className="text-base font-black text-[#111827] pb-3 border-b border-slate-100">
              Kirim Pesan Langsung ke Pamong
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-emerald-950">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <h4 className="text-base font-bold">Pesan Terkirim!</h4>
                <p className="text-xs text-slate-600">
                  Terima kasih <strong>{nama}</strong>. Tim sekretariat akan segera merespons ke nomor WhatsApp Anda.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setNama("");
                    setTelepon("");
                    setPesan("");
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pesan / Pertanyaan *</label>
                  <textarea
                    rows={4}
                    required
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder="Tuliskan pertanyaan seputar administrasi atau surat desa..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#064E3B] hover:bg-[#047857] text-white font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shine-hover"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5D82F]" />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* NOMOR SIAGA DARURAT SIDOARJO (VISUAL INSTANT CALL CARDS) */}
        <section className="rounded-3xl border-2 border-rose-200 bg-rose-50/50 p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Siaga 24 Jam Non-Stop</span>
                <h3 className="text-xl font-black text-[#111827]">Hotline Darurat Sawotratap & Sidoarjo</h3>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-rose-700 bg-white px-3 py-1 rounded-full border border-rose-200">
              Panggilan Cepat Darurat
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <a
              href="tel:0318912110"
              className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-400 hover:shadow-md transition-all space-y-1 block group card-interactive-2d"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 group-hover:text-rose-700 transition-colors">Polsek Gedangan</span>
                <Shield className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-mono text-rose-700 font-black text-sm">(031) 8912110</div>
              <div className="text-slate-400 text-[11px]">Keamanan Lingkungan</div>
            </a>

            <a
              href="tel:0318914567"
              className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-400 hover:shadow-md transition-all space-y-1 block group card-interactive-2d"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 group-hover:text-rose-700 transition-colors">Puskesmas / Pustu</span>
                <Phone className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-mono text-rose-700 font-black text-sm">(031) 8914567</div>
              <div className="text-slate-400 text-[11px]">Kesehatan & Medis</div>
            </a>

            <a
              href="tel:081234567899"
              className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-400 hover:shadow-md transition-all space-y-1 block group card-interactive-2d"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 group-hover:text-rose-700 transition-colors">Ambulans Desa</span>
                <Ambulance className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-mono text-rose-700 font-black text-sm">0812-3456-7899</div>
              <div className="text-slate-400 text-[11px]">Gratis Warga Sawotratap</div>
            </a>

            <a
              href="tel:113"
              className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-400 hover:shadow-md transition-all space-y-1 block group card-interactive-2d"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 group-hover:text-rose-700 transition-colors">Damkar Waru-Gedangan</span>
                <Flame className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-mono text-rose-700 font-black text-sm">113 / (031) 8962100</div>
              <div className="text-slate-400 text-[11px]">Siaga Kebakaran</div>
            </a>
          </div>
        </section>

      </div>

    </div>
  );
}
