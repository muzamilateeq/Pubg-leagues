"use client";

import { LeaderboardEntry } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/pubgRules";
import { Crown, Flame, Crosshair, Award } from "lucide-react";

interface StatCardsProps {
  standings: LeaderboardEntry[];
  onSelectTeam: (entry: LeaderboardEntry) => void;
}

export default function StatCards({ standings, onSelectTeam }: StatCardsProps) {
  if (!standings || standings.length === 0) return null;

  const firstPlace = standings[0];
  const secondPlace = standings.length > 1 ? standings[1] : null;
  const thirdPlace = standings.length > 2 ? standings[2] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      
      {/* 2nd Place - Silver */}
      {secondPlace && (
        <div 
          onClick={() => onSelectTeam(secondPlace)}
          className="order-2 md:order-1 relative cursor-pointer glass-panel silver-glow-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-400/20 to-transparent rounded-bl-full pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-200 text-xs font-black tracking-wider uppercase">
                <Award className="w-4 h-4 text-slate-300" /> #2 RUNNER UP
              </span>
              <span className="text-3xl font-black italic text-slate-400">2nd</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-xl bg-slate-900 border-2 border-slate-400 p-1 flex items-center justify-center shadow-lg group-hover:border-white transition-colors">
                <img
                  src={getTeamLogoUrl(secondPlace.team.team_name, secondPlace.team.logo_url)}
                  alt={secondPlace.team.team_name}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getTeamLogoUrl(secondPlace.team.team_name);
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-slate-200 transition-colors">
                  {secondPlace.team.team_name}
                </h3>
                <p className="text-xs text-slate-400">Captain: {secondPlace.team.captain_name || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Total Pts</p>
              <p className="text-xl font-black text-white">{secondPlace.totalPoints}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">WWCD</p>
              <p className="text-xl font-black text-slate-300">{secondPlace.wwcds}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Kills</p>
              <p className="text-xl font-black text-slate-300">{secondPlace.killPoints}</p>
            </div>
          </div>
        </div>
      )}

      {/* 1st Place - Gold (Center & Elevated) */}
      {firstPlace && (
        <div 
          onClick={() => onSelectTeam(firstPlace)}
          className="order-1 md:order-2 relative cursor-pointer glass-panel gold-glow-card rounded-2xl p-7 flex flex-col justify-between hover:scale-[1.03] transition-transform overflow-hidden group bg-gradient-to-b from-amber-950/40 via-pubg-card to-pubg-card md:-translate-y-3"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pubg-gold/30 to-transparent rounded-bl-full pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pubg-gold/20 border border-pubg-gold text-pubg-gold text-xs font-black tracking-wider uppercase shadow-neon-gold">
                <Crown className="w-4 h-4 text-pubg-gold animate-bounce" /> #1 TOURNAMENT LEADER
              </span>
              <span className="text-4xl font-black italic text-pubg-gold drop-shadow-[0_2px_10px_rgba(243,175,25,0.5)]">
                1st
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20 rounded-2xl bg-slate-900 border-2 border-pubg-gold p-1.5 flex items-center justify-center shadow-neon-gold group-hover:scale-105 transition-transform">
                <img
                  src={getTeamLogoUrl(firstPlace.team.team_name, firstPlace.team.logo_url)}
                  alt={firstPlace.team.team_name}
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getTeamLogoUrl(firstPlace.team.team_name);
                  }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-pubg-gold transition-colors">
                  {firstPlace.team.team_name}
                </h3>
                <p className="text-xs text-pubg-gold/80 font-semibold">Captain: {firstPlace.team.captain_name || "N/A"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    {firstPlace.wwcds} WWCD Winner
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-pubg-gold/20 text-center">
            <div className="bg-pubg-gold/10 p-2 rounded-xl border border-pubg-gold/30">
              <p className="text-[10px] text-pubg-gold uppercase font-black">Total Pts</p>
              <p className="text-2xl font-black text-pubg-gold">{firstPlace.totalPoints}</p>
            </div>
            <div className="p-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold">WWCD</p>
              <p className="text-2xl font-black text-white">{firstPlace.wwcds}</p>
            </div>
            <div className="p-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Kill Pts</p>
              <p className="text-2xl font-black text-pubg-orange">{firstPlace.killPoints}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3rd Place - Bronze */}
      {thirdPlace && (
        <div 
          onClick={() => onSelectTeam(thirdPlace)}
          className="order-3 relative cursor-pointer glass-panel bronze-glow-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-700/20 to-transparent rounded-bl-full pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-400 text-xs font-black tracking-wider uppercase">
                <Award className="w-4 h-4 text-amber-500" /> #3 THIRD PLACE
              </span>
              <span className="text-3xl font-black italic text-amber-600">3rd</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-xl bg-slate-900 border-2 border-amber-600 p-1 flex items-center justify-center shadow-lg group-hover:border-amber-400 transition-colors">
                <img
                  src={getTeamLogoUrl(thirdPlace.team.team_name, thirdPlace.team.logo_url)}
                  alt={thirdPlace.team.team_name}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getTeamLogoUrl(thirdPlace.team.team_name);
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {thirdPlace.team.team_name}
                </h3>
                <p className="text-xs text-slate-400">Captain: {thirdPlace.team.captain_name || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Total Pts</p>
              <p className="text-xl font-black text-white">{thirdPlace.totalPoints}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">WWCD</p>
              <p className="text-xl font-black text-slate-300">{thirdPlace.wwcds}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Kills</p>
              <p className="text-xl font-black text-slate-300">{thirdPlace.killPoints}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
