"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Minus,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface ActionNav {
  label: string;
  url: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actions?: ActionNav[];
}

const STORAGE_KEY = "sawotratap_chatbot_history";
const OPEN_STATE_KEY = "sawotratap_chatbot_open";

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-1",
  sender: "bot",
  text: "Halo warga Sawotratap! 👋 Saya **Asisten AI Desa Sawotratap**.\n\nAda yang bisa saya bantu terkait layanan surat mandiri, perizinan fasilitas, pengaduan kerusakan, atau informasi UMKM desa?",
  timestamp: "Baru saja",
  actions: [
    { label: "Buka Layanan Surat", url: "/layanan#surat" },
    { label: "Lapor Kerusakan", url: "/layanan#pengaduan" },
    { label: "Cek Riwayat Laporan", url: "/laporan" },
  ],
};

const QUICK_PROMPTS = [
  "📄 Cara buat surat online?",
  "⏰ Jam buka pelayanan balai desa?",
  "🛠️ Mana halaman lapor kerusakan?",
  "🛍️ Cara daftar UMKM desa?",
  "💰 Lihat transparansi APBDes",
];

// Helper: Pisahkan teks dan tag [NAV:Label|/url]
function parseMessageContent(rawText: string): { cleanText: string; actions: ActionNav[] } {
  const actions: ActionNav[] = [];
  const navRegex = /\[NAV:(.*?)\|(.*?)\]/g;

  let match;
  while ((match = navRegex.exec(rawText)) !== null) {
    if (match[1] && match[2]) {
      actions.push({
        label: match[1].trim(),
        url: match[2].trim(),
      });
    }
  }

  // Hapus tag [NAV:...] dari tampilan teks pesan agar rapi
  const cleanText = rawText.replace(navRegex, "").trim();
  return { cleanText, actions };
}

// Komponen Parser Format Teks Markdown (Bold, Italic, Bullet Point, Numbering)
function FormattedChatMessage({ text, isUser }: { text: string; isUser: boolean }) {
  const lines = text.split("\n");

  const parseInline = (lineText: string) => {
    // Regex memisahkan **bold**, *italic*, dan _italic_
    const parts = lineText.split(/(\*\*.*?\*\*|\*[^\*\n]+?\*|_[^_\n]+?_)/g);

    return parts.map((part, idx) => {
      // Bold: **teks**
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        const content = part.slice(2, -2);
        return (
          <strong
            key={idx}
            className={`font-black ${isUser ? "text-white underline decoration-emerald-300/40" : "text-slate-900"}`}
          >
            {content}
          </strong>
        );
      }

      // Italic: *teks* atau _teks_
      if (
        (part.startsWith("*") && part.endsWith("*") && part.length >= 2) ||
        (part.startsWith("_") && part.endsWith("_") && part.length >= 2)
      ) {
        const content = part.slice(1, -1);
        return (
          <em
            key={idx}
            className={`italic font-medium ${isUser ? "text-emerald-100" : "text-slate-700"}`}
          >
            {content}
          </em>
        );
      }

      return part;
    });
  };

  return (
    <div className="space-y-1.5 text-[12px] sm:text-[13px] leading-relaxed break-words">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Paragraf kosong / jeda baris
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Poin Daftar / Bullet: baris diawali dengan "* ", "- ", atau "• "
        const isBullet = /^[\*\-•]\s+/.test(trimmed);
        if (isBullet) {
          const content = trimmed.replace(/^[\*\-•]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 my-1">
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  isUser ? "bg-[#C5D82F]" : "bg-emerald-600"
                }`}
              />
              <div className="flex-1">{parseInline(content)}</div>
            </div>
          );
        }

        // Nomor Berurutan: baris diawali dengan "1. ", "2. ", dll
        const isNumbered = /^\d+[\.\)]\s+/.test(trimmed);
        if (isNumbered) {
          const match = trimmed.match(/^(\d+[\.\)])\s+/);
          const prefix = match ? match[1] : "";
          const content = trimmed.replace(/^(\d+[\.\)])\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5 my-1">
              <span
                className={`font-black text-[11px] shrink-0 min-w-[18px] ${
                  isUser ? "text-[#C5D82F]" : "text-emerald-800"
                }`}
              >
                {prefix}
              </span>
              <div className="flex-1">{parseInline(content)}</div>
            </div>
          );
        }

        // Paragraf biasa
        return (
          <p key={idx} className="leading-relaxed">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function FloatingChatbot() {
  const pathname = usePathname();
  const router = useRouter();

  // Sembunyikan di halaman login, register, dashboard admin, dan dashboard kades
  const isExcludedPage =
    pathname === "/login" ||
    pathname?.startsWith("/login") ||
    pathname === "/register" ||
    pathname?.startsWith("/register") ||
    pathname === "/admin" ||
    pathname?.startsWith("/admin") ||
    pathname === "/kades" ||
    pathname?.startsWith("/kades");

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isInitialized, setIsInitialized] = useState(false);

  const buttonLottieRef = useRef<HTMLDivElement>(null);
  const headerLottieRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. INISIALISASI & PERSISTENSI CHAT (SESSION STORAGE)
  // Chat tetap tersimpan saat pindah-pindah halaman, tapi hilang jika di-Hard Refresh (Reload)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cek apakah halaman dibuka melalui Hard Refresh / Reload
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        if (nav.type === "reload") {
          isReload = true;
        }
      }
    } catch {
      // fallback jika performance API tidak tersedia
    }

    if (isReload) {
      // Jika di-hard refresh (F5/Reload): bersihkan histori dan mulai percakapan baru
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(OPEN_STATE_KEY);
      setMessages([INITIAL_MESSAGE]);
      setIsOpen(false);
    } else {
      // Jika navigasi biasa antar halaman: muat kembali riwayat chat dari sessionStorage
      try {
        const savedHistory = sessionStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
        const savedOpen = sessionStorage.getItem(OPEN_STATE_KEY);
        if (savedOpen === "true") {
          setIsOpen(true);
          setShowTooltip(false);
        }
      } catch (err) {
        console.warn("Gagal membaca riwayat chat:", err);
      }
    }

    setIsInitialized(true);
  }, []);

  // Simpan riwayat chat ke sessionStorage setiap kali ada perubahan pesan
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn("Gagal menyimpan riwayat chat:", err);
    }
  }, [messages, isInitialized]);

  // Simpan status buka/tutup chat ke sessionStorage
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    try {
      sessionStorage.setItem(OPEN_STATE_KEY, isOpen ? "true" : "false");
    } catch {
      // ignore
    }
  }, [isOpen, isInitialized]);

  // Auto-scroll ke pesan paling bawah saat ada pesan baru
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Render Animasi Lottie Robot Hijau di Tombol Mengambang
  useEffect(() => {
    if (isExcludedPage) return;

    let animInstance: any = null;
    let isMounted = true;

    if (buttonLottieRef.current) {
      import("lottie-web").then((lottieModule) => {
        if (!isMounted || !buttonLottieRef.current) return;
        const lottie = lottieModule.default || lottieModule;
        try {
          animInstance = lottie.loadAnimation({
            container: buttonLottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "/chatbot.json",
          });
        } catch (err) {
          console.warn("Gagal render lottie chatbot button:", err);
        }
      });
    }

    return () => {
      isMounted = false;
      if (animInstance) animInstance.destroy();
    };
  }, [isExcludedPage, isOpen]);

  // Render Animasi Lottie Robot Hijau di Header Modal
  useEffect(() => {
    if (!isOpen || isExcludedPage) return;

    let headerAnimInstance: any = null;
    let isMounted = true;

    if (headerLottieRef.current) {
      import("lottie-web").then((lottieModule) => {
        if (!isMounted || !headerLottieRef.current) return;
        const lottie = lottieModule.default || lottieModule;
        try {
          headerAnimInstance = lottie.loadAnimation({
            container: headerLottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "/chatbot.json",
          });
        } catch (err) {
          console.warn("Gagal render lottie chatbot header:", err);
        }
      });
    }

    return () => {
      isMounted = false;
      if (headerAnimInstance) headerAnimInstance.destroy();
    };
  }, [isOpen, isExcludedPage]);

  // Fungsi Kirim Pesan ke Backend AI (Load Balanced 5 API Keys)
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        // Parse tag navigasi [NAV:Label|/url]
        const { cleanText, actions } = parseMessageContent(data.reply);

        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: cleanText,
          actions: actions.length > 0 ? actions : undefined,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.message || "Gagal mendapat balasan.");
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: "bot-err-" + Date.now(),
        sender: "bot",
        text: "Maaf, koneksi ke asisten AI sedang dialihkan. Anda dapat langsung menggunakan tautan navigasi di bawah:",
        actions: [
          { label: "Buka Layanan Surat", url: "/layanan#surat" },
          { label: "Buka Lapor Kerusakan", url: "/layanan#pengaduan" },
          { label: "Hubungi Kontak Desa", url: "/kontak" },
        ],
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Navigasi Cepat Saat Warga Mengklik Tombol Aksi di Chat
  const handleNavigate = (url: string) => {
    if (!url) return;

    if (url.includes("#")) {
      const [path, hash] = url.split("#");
      // Jika saat ini sudah di halaman yang sama, scroll langsung ke ID elemennya
      if (pathname === path || (path === "" && pathname === "/layanan")) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${hash}`);
          return;
        }
      }
    }

    router.push(url);
  };

  const handleResetChat = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages([
      {
        id: "welcome-" + Date.now(),
        sender: "bot",
        text: "Percakapan telah direset. Ada informasi lain seputar Desa Sawotratap yang ingin Anda ketahui?",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        actions: [
          { label: "Lapor Kerusakan", url: "/layanan#pengaduan" },
          { label: "Buat Surat Mandiri", url: "/layanan#surat" },
        ],
      },
    ]);
  };

  // Jangan render jika di halaman yang dikecualikan (login, register, admin, kades)
  if (isExcludedPage) {
    return null;
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. JENDELA CHAT INTERAKTIF (MODAL/DRAWER DI POJOK KANAN BAWAH)            */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[410px] h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 duration-200"
          style={{ boxShadow: "0 25px 60px -15px rgba(6, 78, 59, 0.35)" }}
          role="dialog"
          aria-label="Asisten AI Desa Sawotratap"
        >
          {/* HEADER CHAT: SOLID HIJAU #064E3B (TANPA GRADASI) */}
          <div className="bg-[#064E3B] p-4 text-white flex items-center justify-between shrink-0 shadow-sm relative">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-[#ffd553] border-2 border-white/20 p-0.5 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                <div ref={headerLottieRef} className="w-full h-full scale-125" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight tracking-wide">
                    TratapBot AI
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#C5D82F] text-[#064E3B] text-[9px] font-black uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[11px] text-emerald-100 font-medium">
                    Asisten Desa Online 24 Jam
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Header */}
            <div className="flex items-center gap-1 relative z-10">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl hover:bg-white/15 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                title="Reset percakapan"
                aria-label="Reset percakapan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-emerald-100 hover:text-white transition-colors cursor-pointer"
                title="Tutup chat"
                aria-label="Tutup chat"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AREA PESAN CHAT (SOLID BG-SLATE-50 TANPA GRADASI) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-xs leading-relaxed">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#064E3B] border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 font-black text-[11px]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[82%] px-3.5 py-2.5 rounded-2xl shadow-2xs whitespace-pre-line ${
                      isUser
                        ? "bg-[#064E3B] text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                    }`}
                  >
                    <FormattedChatMessage text={msg.text} isUser={isUser} />

                    {/* TOMBOL AKSI NAVIGASI LANGSUNG (JIKA DIREKOMENDASIKAN AI) */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            type="button"
                            onClick={() => handleNavigate(act.url)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-[#C5D82F] hover:text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer group"
                            title={`Buka ${act.label}`}
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span
                      className={`text-[9px] block text-right mt-1.5 font-medium ${
                        isUser ? "text-emerald-200/80" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-[#064E3B] text-[#C5D82F] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Indikator AI Sedang Mengetik */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#064E3B] border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 rounded-tl-xs shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SARAN PERTANYAAN CEPAT (QUICK CHIPS) */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#064E3B] text-[11px] font-semibold transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT FORM CHAT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanya seputar layanan Desa Sawotratap..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#064E3B] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-2xl bg-[#064E3B] hover:bg-[#085a44] disabled:bg-slate-200 text-[#C5D82F] disabled:text-slate-400 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
              title="Kirim Pesan"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOMBOL MENGAMBANG DI POJOK KANAN BAWAH (FLOATING LOTTIE BADGE)        */}
      {/* ========================================================================= */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end">
          {/* Gelembung Ajakan / Tooltip */}
          {showTooltip && (
            <div className="mb-2 mr-1 px-3.5 py-2 rounded-2xl bg-white border border-emerald-200 shadow-xl flex items-center gap-2 text-xs font-bold text-slate-800 animate-in fade-in slide-from-bottom-2 duration-300 relative group">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Tanya Asisten AI Desa</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 cursor-pointer ml-1"
                aria-label="Tutup saran"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Ekor balon */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-emerald-200 rotate-45" />
            </div>
          )}

          {/* Tombol Utama Animasi Lottie Robot Hijau */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffd553] border-3 border-white shadow-2xl hover:shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer overflow-visible"
            style={{
              boxShadow: "0 15px 35px -5px rgba(6, 78, 59, 0.35), 0 0 0 1px rgba(6, 78, 59, 0.1)",
            }}
            aria-label="Buka Asisten AI Desa Sawotratap"
          >
            {/* Pulsing ring aura */}
            <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />

            {/* Container Animasi Lottie Maskot Hijau */}
            <div
              ref={buttonLottieRef}
              className="w-full h-full scale-110 pointer-events-none"
            />

            {/* Badge Status Online */}
            <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
          </button>
        </div>
      )}
    </>
  );
}
