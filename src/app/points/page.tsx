"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Trophy, ArrowLeft, Flame, Shield, Zap } from "lucide-react";
import { useEffect } from "react";

export default function PointsPage() {
  useEffect(() => {
    // Mark season modal seen so popup never triggers when returning to standings
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pubg_has_seen_season_modal", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-pubg-dark text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Standings
          </Link>
        </div>

        {/* Clean Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pubg-border bg-gradient-to-r from-slate-950 via-pubg-card to-slate-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-pubg-gold tracking-wider">OFFICIAL SUPER RULESET</span>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tight">
              POINT <span className="text-pubg-gold">SYSTEM</span>
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pubg-gold/20 border border-pubg-gold text-pubg-gold flex items-center justify-center shadow-neon-gold shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* 2 Quick Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-pubg-gold/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pubg-gold/20 text-pubg-gold flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold">1st Place (WWCD)</span>
              <span className="text-xl font-black text-pubg-gold">10 PTS</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-pubg-orange/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pubg-orange/20 text-pubg-orange flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Kill Points</span>
              <span className="text-xl font-black text-pubg-orange">1 PT / Kill</span>
            </div>
          </div>
        </div>

        {/* Simple Placement Points Table */}
        <div className="glass-panel rounded-2xl border border-pubg-border p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-pubg-border/60 pb-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-pubg-gold" /> Placement Points per Match
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-amber-950/40 border border-pubg-gold/50 font-bold text-pubg-gold">
              <span className="block text-[10px] uppercase">1st Place</span>
              <span className="text-lg font-black">10 PTS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white">
              <span className="block text-[10px] uppercase">2nd Place</span>
              <span className="text-lg font-black">6 PTS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white">
              <span className="block text-[10px] uppercase">3rd Place</span>
              <span className="text-lg font-black">5 PTS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white">
              <span className="block text-[10px] uppercase">4th Place</span>
              <span className="text-lg font-black">4 PTS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="block text-[10px] uppercase">5th Place</span>
              <span className="text-base font-bold">3 PTS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="block text-[10px] uppercase">6th Place</span>
              <span className="text-base font-bold">2 PTS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="block text-[10px] uppercase">7th – 8th</span>
              <span className="text-base font-bold">1 PT</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-500">
              <span className="block text-[10px] uppercase">9th – 16th</span>
              <span className="text-base font-bold">0 PTS</span>
            </div>
          </div>
        </div>

        {/* Short & Simple Rules */}
        <div className="p-4 rounded-xl bg-slate-950 border border-pubg-border text-xs text-slate-300 space-y-2">
          <p className="font-bold text-white uppercase text-[11px]">Rank Order Rules:</p>
          <p>• Total Score = Placement Points + Kill Points.</p>
          <p>• In case of a tie: WWCD wins &gt; Total Kills &gt; Placement Points.</p>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-pubg-border bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 PUBG Esports Tournament Management Portal.</p>
        </div>
      </footer>
    </div>
  );
}
