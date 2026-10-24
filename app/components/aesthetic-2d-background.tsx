"use client";

import React from "react";

export default function Aesthetic2DBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0 select-none">
      
      {/* 1. AMBIENT 2D GRADIENT LIGHT DRIFT */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#C5D82F]/10 via-emerald-400/5 to-transparent blur-3xl animate-float-leaf-2" />
      <div className="absolute top-1/3 -left-36 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-emerald-500/8 via-teal-400/5 to-transparent blur-3xl animate-float-leaf-1" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#064E3B]/8 via-[#C5D82F]/5 to-transparent blur-3xl animate-float-leaf-3" />

      {/* 2. FLOATING 2D STYLIZED LEAF MOTIFS (IKONIS POHON SAWO SAWOTRATAP) */}
      
      {/* Daun 1: Kanan Atas */}
      <div className="absolute top-24 right-10 sm:right-20 w-12 h-12 text-emerald-800/15 animate-float-leaf-1">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full transform rotate-12">
          <path d="M50 5 C20 30, 15 65, 50 95 C85 65, 80 30, 50 5 Z M50 20 L50 80 M35 40 L50 50 M65 40 L50 50 M35 60 L50 70 M65 60 L50 70" stroke="currentColor" strokeWidth="2" fillOpacity="0.4" />
        </svg>
      </div>

      {/* Daun 2: Kiri Tengah */}
      <div className="absolute top-[45%] left-6 sm:left-14 w-10 h-10 text-emerald-700/12 animate-float-leaf-2">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full transform -rotate-45">
          <path d="M50 5 C25 25, 20 60, 50 95 C80 60, 75 25, 50 5 Z M50 15 L50 85 M35 35 L50 45 M65 35 L50 45 M35 55 L50 65 M65 55 L50 65" stroke="currentColor" strokeWidth="2" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Daun 3: Kanan Bawah */}
      <div className="absolute bottom-32 right-12 sm:right-28 w-14 h-14 text-emerald-900/15 animate-float-leaf-3">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full transform rotate-45">
          <path d="M50 5 C20 30, 15 65, 50 95 C85 65, 80 30, 50 5 Z M50 20 L50 80 M32 38 L50 48 M68 38 L50 48 M32 58 L50 68 M68 58 L50 68" stroke="currentColor" strokeWidth="2.5" fillOpacity="0.35" />
        </svg>
      </div>

      {/* Daun 4: Kiri Bawah (Kecil) */}
      <div className="absolute bottom-60 left-16 sm:left-32 w-8 h-8 text-[#047857]/15 animate-float-leaf-1">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full transform rotate-180">
          <path d="M50 5 C22 28, 18 62, 50 95 C82 62, 78 28, 50 5 Z" fillOpacity="0.3" />
        </svg>
      </div>

      {/* 3. SUBTLE 2D GEOMETRIC MANDALA & COMPASS WATERMARKS */}
      <div className="absolute top-48 right-[-100px] w-96 h-96 text-emerald-800/[0.035] animate-spin-slow">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="w-full h-full">
          <circle cx="100" cy="100" r="90" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="65" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="100" y1="5" x2="100" y2="195" strokeWidth="0.8" />
          <line x1="5" y1="100" x2="195" y2="100" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="absolute bottom-20 left-[-80px] w-80 h-80 text-emerald-800/[0.03] animate-spin-reverse-slow">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="w-full h-full">
          <polygon points="100,10 120,75 190,75 135,115 155,185 100,145 45,185 65,115 10,75 80,75" strokeWidth="1" strokeDasharray="3 5" />
          <circle cx="100" cy="100" r="85" strokeWidth="0.8" />
        </svg>
      </div>

    </div>
  );
}
