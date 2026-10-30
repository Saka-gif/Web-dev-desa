"use client";

import React, { useEffect } from "react";
import { Trash2, AlertTriangle, X, RefreshCw } from "lucide-react";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  title = "Konfirmasi Hapus Data",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  itemName,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  loadingText,
  icon,
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDeleteModalProps) {
  const handleClose = onCancel || onClose || (() => {});

  // Tutup dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Tombol Tutup Silang di Sudut */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Bahaya / Hapus / Custom */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          {icon || <Trash2 className="w-7 h-7" />}
        </div>

        {/* Judul & Pesan */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {message}
        </p>

        {/* Nama Item yang akan dihapus jika ada */}
        {itemName && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 break-words line-clamp-2">
            &ldquo;{itemName}&rdquo;
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex items-center justify-center gap-2.5 mt-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{loadingText || "Memproses..."}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
