"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Radio, ArrowLeft } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

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
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white uppercase italic">
                  PUBG<span className="text-pubg-gold">ESPORTS</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase rounded bg-pubg-orange/20 text-pubg-orange border border-pubg-orange/30">
                  PRO LEAGUE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">Tournament Management Portal</p>
            </div>
          </Link>

          {/* Navigation Links & Live Status */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-[11px] sm:text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 live-badge-glow" />
              <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
              <span className="hidden sm:inline">LIVE STANDINGS</span>
            </div>

            {/* Supabase Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-slate-300">
                {isSupabaseConfigured ? "Supabase Live" : "Demo Mode"}
              </span>
            </div>

            {/* Navigation Tabs - Hidden Admin link on user side */}
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
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-pubg-gold/15 border border-pubg-gold/30 text-pubg-gold text-xs sm:text-sm font-extrabold shadow-neon-gold">
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </div>
              )}
            </nav>

          </div>

        </div>
      </div>
    </header>
  );
}
