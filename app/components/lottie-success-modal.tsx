"use client";

import React, { useEffect, useRef } from "react";
import { X, Check } from "lucide-react";

interface LottieSuccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  loopTarget?: number; // default 2x
}

export default function LottieSuccessModal({
  isOpen,
  title = "Berhasil Diproses!",
  message,
  onClose,
  loopTarget = 2,
}: LottieSuccessModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    let loopCount = 0;

    // Load lottie-web secara dinamis di browser
    import("lottie-web").then((lottieModule) => {
      if (!isMounted || !containerRef.current) return;
      const lottie = lottieModule.default || lottieModule;

      // Bersihkan instance lama jika ada
      if (animInstanceRef.current) {
        animInstanceRef.current.destroy();
      }

      try {
        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/centang.json",
        });

        animInstanceRef.current = anim;

        anim.addEventListener("complete", () => {
          if (!isMounted) return;
          loopCount++;
          if (loopCount < loopTarget) {
            // Putar loop ke-2
            anim.goToAndPlay(0, true);
          } else {
            // 2x loop selesai: tutup otomatis setelah jeda singkat
            setTimeout(() => {
              if (isMounted) {
                onClose();
              }
            }, 500);
          }
        });
      } catch (err) {
        console.error("Gagal memuat animasi lottie centang:", err);
        // Fallback jika lottie gagal load: tutup otomatis setelah 3 detik
        setTimeout(() => {
          if (isMounted) onClose();
        }, 3000);
      }
    });

    return () => {
      isMounted = false;
      if (animInstanceRef.current) {
        try {
          animInstanceRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, loopTarget, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl border border-emerald-200/90 shadow-2xl p-6 text-center overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* TOMBOL CLOSE (X) DI POJOK KANAN ATAS */}
        <button
          onClick={onClose}
          aria-label="Tutup Jendela"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* CONTAINER ANIMASI LOTTIE CENTANG */}
        <div className="flex justify-center items-center my-1">
          <div
            ref={containerRef}
            className="w-28 h-28 flex items-center justify-center"
          />
        </div>

        {/* TEKS INFORMASI */}
        <div className="space-y-2 mt-1">
          <h4 className="text-base font-black text-[#064E3B] tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium px-2">
            {message}
          </p>
        </div>

        {/* TOMBOL TUTUP CEPAT */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-black shadow-[0_3px_0_0_#02261c] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-emerald-300" />
            <span>Tutup Jendela</span>
          </button>
        </div>

        {/* INDIKATOR AUTO CLOSE */}
        <p className="text-[10px] text-slate-400 mt-2 italic">
          Jendela akan tertutup otomatis setelah animasi selesai
        </p>

      </div>
    </div>
  );
}
