"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Trophy, Shield, ArrowLeft, Flame, Award, Crosshair, HelpCircle, CheckCircle2, Zap } from "lucide-react";

export default function PointsPage() {
  return (
    <div className="min-h-screen bg-pubg-dark text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Standings
          </Link>
        </div>

        {/* Hero Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-pubg-border bg-gradient-to-r from-slate-950 via-pubg-card to-slate-950 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-pubg-gold/20 border border-pubg-gold/40 text-pubg-gold text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-neon-gold">
              <Zap className="w-3.5 h-3.5 fill-pubg-gold text-pubg-gold" /> OFFICIAL SUPER RULESET
            </span>
            <span className="text-xs text-slate-400 font-semibold">PUBG PRO LEAGUE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tight leading-none">
            POINT SYSTEM & <span className="text-pubg-gold drop-shadow-[0_2px_10px_rgba(243,175,25,0.5)]">RULES</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Official PUBG Esports SUPER Point System guidelines. Total points are calculated from match placement rank points plus individual kill elimination points.
          </p>
        </div>

        {/* Scoring Breakdown Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: WWCD Victory */}
          <div className="glass-panel gold-glow-card rounded-2xl p-6 flex flex-col justify-between space-y-4 bg-gradient-to-b from-amber-950/30 via-pubg-card to-slate-950">
            <div className="w-12 h-12 rounded-2xl bg-pubg-gold/20 border border-pubg-gold text-pubg-gold flex items-center justify-center shadow-neon-gold shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-pubg-gold font-black uppercase tracking-wider">MATCH WINNER</span>
              <h3 className="text-xl font-black text-white">WWCD Victory</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Awarded to the #1 surviving squad of each match. Earns <strong>10 Placement Points</strong> + a WWCD victory badge!
              </p>
            </div>
          </div>

          {/* Card 2: Kill Points */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4 border-pubg-orange/40 bg-gradient-to-b from-orange-950/20 via-pubg-card to-slate-950">
            <div className="w-12 h-12 rounded-2xl bg-pubg-orange/20 border border-pubg-orange text-pubg-orange flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,87,34,0.4)]">
              <Flame className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-pubg-orange font-black uppercase tracking-wider">ELIMINATION SCORE</span>
              <h3 className="text-xl font-black text-white">Kill Points</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every single enemy elimination earns <strong>1 Point</strong>. There is no cap on kill points!
              </p>
            </div>
          </div>

          {/* Card 3: Placement Points */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4 border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 via-pubg-card to-slate-950">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider">RANK SCORE</span>
              <h3 className="text-xl font-black text-white">Placement Points</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Points awarded to top-8 surviving teams at match end based on finishing rank.
              </p>
            </div>
          </div>

        </div>

        {/* Official Placement Points Table */}
        <div className="glass-panel rounded-2xl border border-pubg-border overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-pubg-border/60 pb-3">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Award className="w-5 h-5 text-pubg-gold" /> OFFICIAL PLACEMENT POINTS TABLE
            </h2>
            <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Per Match
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-pubg-gold/40">
              <span className="block text-[10px] text-pubg-gold font-extrabold uppercase">1st Place</span>
              <span className="text-2xl font-black text-pubg-gold">10 PTS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">2nd Place</span>
              <span className="text-2xl font-black text-white">6 PTS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">3rd Place</span>
              <span className="text-2xl font-black text-white">5 PTS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <span className="block text-[10px] text-slate-300 font-bold uppercase">4th Place</span>
              <span className="text-2xl font-black text-white">4 PTS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase">5th Place</span>
              <span className="text-xl font-bold text-slate-200">3 PTS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase">6th Place</span>
              <span className="text-xl font-bold text-slate-200">2 PTS</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase">7th – 8th Place</span>
              <span className="text-xl font-bold text-slate-200">1 PT</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="block text-[10px] text-slate-500 uppercase">9th – 16th Place</span>
              <span className="text-xl font-bold text-slate-500">0 PTS</span>
            </div>
          </div>
        </div>

        {/* Tiebreaker Rules Box */}
        <div className="glass-panel rounded-2xl p-6 border border-pubg-border space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-pubg-gold" /> TIEBREAKER RULES
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            If two or more teams tie on total points, ranks are ordered by:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pubg-gold text-slate-950 font-black flex items-center justify-center text-[10px]">1</span>
              <span>Total WWCD Victories</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pubg-orange text-white font-black flex items-center justify-center text-[10px]">2</span>
              <span>Total Elimination Kills</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black flex items-center justify-center text-[10px]">3</span>
              <span>Placement Points</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-pubg-border bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 PUBG Esports Tournament Management Portal.</p>
        </div>
      </footer>
    </div>
  );
}
