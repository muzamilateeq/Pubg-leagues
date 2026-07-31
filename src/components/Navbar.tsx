"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Radio, ArrowLeft, Calendar, ShieldCheck } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

interface NavbarProps {
  onOpenSeasonModal?: () => void;
  currentSeasonName?: string;
}

export default function Navbar({ onOpenSeasonModal, currentSeasonName }: NavbarProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isRegister = pathname.startsWith("/register");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pubg-border bg-pubg-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pubg-gold via-amber-600 to-pubg-orange p-[2px] shadow-neon-gold group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-pubg-dark rounded-[10px] flex items-center justify-center">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-pubg-gold group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-wider text-white uppercase italic truncate">
                  PUBG<span className="text-pubg-gold">ESPORTS</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase rounded bg-pubg-orange/20 text-pubg-orange border border-pubg-orange/30 shrink-0">
                  PRO LEAGUE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">Tournament Management Portal</p>
            </div>
          </Link>

          {/* Navigation Links & Red Registration Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Season Selector Modal Trigger (User side) */}
            {!isAdmin && onOpenSeasonModal && (
              <button
                onClick={onOpenSeasonModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all shrink-0"
                title="Switch season"
              >
                <Calendar className="w-3.5 h-3.5 text-pubg-gold" />
                <span className="max-w-[120px] truncate">{currentSeasonName || "Seasons"}</span>
              </button>
            )}

            {/* Red Team Registration Button */}
            {!isAdmin && !isRegister && (
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="hidden xs:inline">Register Team</span>
                <span className="xs:hidden">Register</span>
              </Link>
            )}

            {/* Live Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-[11px] sm:text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 live-badge-glow" />
              <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
              <span>LIVE STANDINGS</span>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-2">
              {isAdmin ? (
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-pubg-border transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Public View</span>
                  <span className="sm:hidden">Exit</span>
                </Link>
              ) : (
                <Link
                  href="/"
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    !isRegister
                      ? "bg-pubg-gold/15 border border-pubg-gold/30 text-pubg-gold shadow-neon-gold"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </Link>
              )}
            </nav>

          </div>

        </div>
      </div>
    </header>
  );
}
