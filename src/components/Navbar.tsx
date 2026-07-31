"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Trophy, LayoutDashboard, Radio } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pubg-border bg-pubg-dark/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pubg-gold via-amber-600 to-pubg-orange p-[2px] shadow-neon-gold group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-pubg-dark rounded-[10px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-pubg-gold group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white uppercase italic">
                  PUBG<span className="text-pubg-gold">ESPORTS</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-pubg-orange/20 text-pubg-orange border border-pubg-orange/30">
                  PRO LEAGUE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Tournament Management Portal</p>
            </div>
          </Link>

          {/* Navigation Links & Live Status */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 live-badge-glow" />
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE STANDINGS</span>
            </div>

            {/* Supabase Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-slate-300">
                {isSupabaseConfigured ? "Supabase Live" : "Demo Mode"}
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-2 bg-pubg-card p-1 rounded-xl border border-pubg-border">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  !isAdmin
                    ? "bg-pubg-gold text-slate-950 shadow-neon-gold font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </Link>
              
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isAdmin
                    ? "bg-pubg-orange text-white shadow-neon-orange font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            </nav>

          </div>

        </div>
      </div>
    </header>
  );
}
