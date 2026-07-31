"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, MessageCircle, ArrowLeft, Clock, Zap, CheckCircle2, Copy, Check, Users, PhoneCall } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const [copied, setCopied] = useState(false);
  const whatsappNumber = "03098541632";
  const whatsappFormatted = "+92 309 8541632";
  const whatsappLink = `https://wa.me/923098541632?text=${encodeURIComponent(
    "Hello PUBG League Admins! I want to register my team for the upcoming tournament."
  )}`;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-pubg-dark text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Standings
          </Link>
        </div>

        {/* Registration Card */}
        <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border-2 border-red-500/40 bg-gradient-to-b from-red-950/20 via-pubg-card to-slate-950 shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden space-y-8">
          
          {/* Top Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pubg-border/60 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider">
                  OFFICIAL LEAGUE REGISTRATION
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tight mt-1">
                  TEAM <span className="text-red-500">REGISTRATION</span>
                </h1>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 animate-pulse" /> REGISTRATION OPEN
            </div>
          </div>


          {/* Main Action Box: WhatsApp Registration */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <MessageCircle className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                REGISTER VIA WHATSAPP
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Contact our tournament organizers on WhatsApp to submit your team details and lock in your slot for the upcoming season!
              </p>
            </div>

            {/* Display WhatsApp Number */}
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 max-w-lg w-full mx-auto">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <span className="text-xs text-slate-400 font-bold uppercase">WhatsApp Number:</span>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400 tracking-wider">
                {whatsappNumber}
              </span>
              <button
                onClick={handleCopyNumber}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Big Green Direct WhatsApp Chat Button */}
            <div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <MessageCircle className="w-6 h-6 fill-white" /> Click To Register On WhatsApp
              </a>
            </div>
          </div>

          {/* Details Needed Checklist */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-pubg-border space-y-4">
            <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-pubg-gold" /> DETAILS TO SEND VIA WHATSAPP
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. Official Team Name</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2. Captain Name & In-Game ID</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3. Player Roster (4 Main Players + 1 Sub)</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4. Contact Phone Number & Logo</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-pubg-border bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 PUBG Esports Tournament Management Portal. Built with Next.js, Supabase & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
