"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, ArrowLeft, Calendar, ShieldCheck, Zap, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onOpenSeasonModal?: () => void;
  currentSeasonName?: string;
}

export default function Navbar({ onOpenSeasonModal, currentSeasonName }: NavbarProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isRegister = pathname.startsWith("/register");
  const isPoints = pathname.startsWith("/points");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Record that user has interacted with site so popup won't show again
  const markModalSeen = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pubg_has_seen_season_modal", "true");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pubg-border bg-pubg-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <Link href="/" onClick={markModalSeen} className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pubg-gold via-amber-600 to-pubg-orange p-[2px] shadow-neon-gold group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-pubg-dark rounded-[10px] flex items-center justify-center">
                <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-pubg-gold group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-xl tracking-wider text-white uppercase italic truncate">
                  PUBG<span className="text-pubg-gold">ESPORTS</span>
                </span>
                <span className="px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase rounded bg-pubg-orange/20 text-pubg-orange border border-pubg-orange/30 shrink-0">
                  LEAGUE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
            
            {!isAdmin && onOpenSeasonModal && (
              <button
                onClick={() => {
                  markModalSeen();
                  onOpenSeasonModal();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
                title="Switch season"
              >
                <Calendar className="w-3.5 h-3.5 text-pubg-gold" />
                <span className="max-w-[100px] truncate">{currentSeasonName || "Seasons"}</span>
              </button>
            )}

            {!isAdmin && (
              <Link
                href="/points"
                onClick={markModalSeen}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  isPoints
                    ? "bg-pubg-gold/15 border-pubg-gold/40 text-pubg-gold shadow-neon-gold"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Zap className="w-4 h-4 text-pubg-gold" />
                <span>Point System</span>
              </Link>
            )}

            {!isAdmin && !isRegister && (
              <Link
                href="/register"
                onClick={markModalSeen}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all hover:scale-105 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Register Team</span>
              </Link>
            )}

            <nav className="flex items-center gap-2">
              {isAdmin ? (
                <Link
                  href="/"
                  onClick={markModalSeen}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-pubg-border transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Public View</span>
                </Link>
              ) : (
                <Link
                  href="/"
                  onClick={markModalSeen}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    !isRegister && !isPoints
                      ? "bg-pubg-gold/15 border border-pubg-gold/30 text-pubg-gold shadow-neon-gold"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </Link>
              )}
            </nav>

          </div>

          {/* Mobile Buttons Bar (Visible on mobile viewports < md) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            
            {!isAdmin && (
              <Link
                href="/points"
                onClick={markModalSeen}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                  isPoints
                    ? "bg-pubg-gold/20 border-pubg-gold text-pubg-gold"
                    : "bg-slate-900 border-slate-800 text-slate-300"
                }`}
                title="Point System"
              >
                <Zap className="w-4 h-4 text-pubg-gold" />
                <span className="text-[11px]">Points</span>
              </Link>
            )}

            {!isAdmin && (
              <Link
                href="/register"
                onClick={markModalSeen}
                className="px-2.5 py-2 rounded-xl bg-red-600 text-white font-black text-[11px] uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            )}

            {/* Mobile Menu Dropdown Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-pubg-gold" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-pubg-border/80 space-y-2 bg-slate-950/95 px-2 rounded-b-2xl animate-in slide-in-from-top-2">
            {!isAdmin && (
              <Link
                href="/"
                onClick={() => {
                  markModalSeen();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-extrabold ${
                  !isRegister && !isPoints
                    ? "bg-pubg-gold/20 text-pubg-gold border border-pubg-gold/30"
                    : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-pubg-gold" />
                  <span>Leaderboard & Standings</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">View</span>
              </Link>
            )}

            {!isAdmin && (
              <Link
                href="/points"
                onClick={() => {
                  markModalSeen();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-extrabold ${
                  isPoints
                    ? "bg-pubg-gold/20 text-pubg-gold border border-pubg-gold/30"
                    : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pubg-gold" />
                  <span>Point System & Rules</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">View</span>
              </Link>
            )}

            {!isAdmin && (
              <Link
                href="/register"
                onClick={() => {
                  markModalSeen();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-black bg-red-600 text-white border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Team Registration (RS 200 / 250)</span>
                </div>
                <span className="text-[10px] text-white/80 uppercase">Register</span>
              </Link>
            )}

            {!isAdmin && onOpenSeasonModal && (
              <button
                onClick={() => {
                  markModalSeen();
                  setMobileMenuOpen(false);
                  onOpenSeasonModal();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pubg-gold" />
                  <span>Switch Season</span>
                </div>
                <span className="text-[10px] text-pubg-gold font-black uppercase">{currentSeasonName || "Seasons"}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
