"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, MessageCircle, ArrowLeft, CheckCircle2, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const [copied, setCopied] = useState(false);
  const whatsappNumber = "03098541632";
  const whatsappLink = `https://wa.me/923098541632?text=${encodeURIComponent(
    "Hello PUBG League Admins! I want to register a team."
  )}`;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-pubg-dark text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Standings
          </Link>
        </div>

        {/* Clean Registration Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 bg-gradient-to-b from-red-950/20 via-pubg-card to-slate-950 shadow-[0_0_40px_rgba(239,68,68,0.15)] space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-pubg-border/60 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-400">PUBG PRO LEAGUE</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">
                TEAM <span className="text-red-500">REGISTRATION</span>
              </h1>
            </div>
          </div>

          {/* Clean Pricing Cards */}
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Standard Fee */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Standard Fee</span>
              <span className="text-lg font-black text-slate-400 line-through">RS 250</span>
            </div>

            {/* Reference Fee */}
            <div className="p-3.5 rounded-2xl bg-amber-950/60 border-2 border-pubg-gold shadow-neon-gold">
              <span className="block text-[10px] text-pubg-gold uppercase font-black">With Reference</span>
              <span className="text-xl font-black text-pubg-gold">RS 200</span>
            </div>
          </div>

          {/* Reference Notice */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-pubg-border text-center text-xs text-slate-300">
            💡 Mention your <strong>Reference Name</strong> when messaging on WhatsApp to get the <strong>RS 200 rate</strong>!
          </div>

          {/* WhatsApp Direct Section */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center space-y-4 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Registration</span>
            </div>

            <div className="font-mono text-2xl font-black text-white tracking-wider flex items-center justify-center gap-3">
              <span>{whatsappNumber}</span>
              <button
                onClick={handleCopyNumber}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                title="Copy number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 w-full"
            >
              <MessageCircle className="w-5 h-5 fill-white" /> Register On WhatsApp
            </a>
          </div>

          {/* Simple Checklist */}
          <div className="space-y-2 text-xs text-slate-300">
            <p className="font-bold text-slate-400 uppercase text-[11px] mb-2">Required Info for WhatsApp:</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Team Name & Logo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Captain Name & In-Game ID</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Player Roster (4 Players + 1 Sub)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pubg-gold shrink-0" />
              <span className="text-pubg-gold font-bold">Reference Name (To get RS 200 rate)</span>
            </div>
          </div>

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
