"use client";

import { LeaderboardEntry } from "@/lib/types";
import { getTeamLogoUrl, getMapInfo } from "@/lib/pubgRules";
import { X, Trophy, Flame, Shield, MapPin, Hash, User, Mail, Award } from "lucide-react";

interface TeamDetailModalProps {
  entry: LeaderboardEntry | null;
  onClose: () => void;
}

export default function TeamDetailModal({ entry, onClose }: TeamDetailModalProps) {
  if (!entry) return null;

  const { team, matchesPlayed, wwcds, placementPoints, killPoints, totalPoints, matchBreakdown } = entry;
  const avgPoints = matchesPlayed > 0 ? (totalPoints / matchesPlayed).toFixed(1) : "0.0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-pubg-card border border-pubg-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-pubg-card to-slate-900 border-b border-pubg-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-pubg-gold p-1.5 flex items-center justify-center shadow-neon-gold shrink-0">
              <img
                src={getTeamLogoUrl(team.team_name, team.logo_url)}
                alt={team.team_name}
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getTeamLogoUrl(team.team_name);
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{team.team_name}</h2>
                {wwcds > 0 && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {wwcds} WWCD
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-pubg-gold" /> Captain: {team.captain_name || "N/A"}
                </span>
                {team.contact && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <Mail className="w-3.5 h-3.5" /> {team.contact}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pubg-border text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Score</p>
              <p className="text-2xl font-black text-pubg-gold mt-1">{totalPoints}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pubg-border text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Kill Points</p>
              <p className="text-2xl font-black text-pubg-orange mt-1">{killPoints}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pubg-border text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Placement Pts</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">{placementPoints}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pubg-border text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Pts / Match</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{avgPoints}</p>
            </div>
          </div>

          {/* Match Performance Breakdown */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-pubg-gold" /> MATCH PERFORMANCE BREAKDOWN
            </h3>

            {matchBreakdown.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-pubg-border text-center text-slate-500 text-xs">
                No match entries recorded for this team in the selected season yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {matchBreakdown.map((m) => {
                  const mapInfo = getMapInfo(m.mapName);
                  const isWWCD = m.placementRank === 1;

                  return (
                    <div
                      key={m.matchNumber}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        isWWCD
                          ? "bg-amber-950/20 border-pubg-gold/50"
                          : "bg-slate-900/60 border-pubg-border hover:border-slate-700"
                      }`}
                    >
                      {/* Match & Map */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-950 border border-pubg-border">
                          <span className="text-[10px] text-slate-400 uppercase font-extrabold">Match</span>
                          <span className="text-sm font-black text-white">#{m.matchNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${mapInfo.badgeBg} ${mapInfo.badgeText}`}>
                              {m.mapName}
                            </span>
                            {isWWCD && (
                              <span className="px-2 py-0.5 text-[10px] font-black rounded bg-pubg-gold text-slate-950 flex items-center gap-1 shadow-neon-gold">
                                <Trophy className="w-3 h-3" /> WWCD WINNER
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Rank: <span className={`font-bold ${isWWCD ? "text-pubg-gold" : "text-slate-200"}`}>#{m.placementRank}</span>
                          </p>
                        </div>
                      </div>

                      {/* Points Breakdown */}
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Kills / Place</p>
                          <p className="text-xs font-semibold text-slate-300">
                            <span className="text-pubg-orange font-bold">{m.killPoints} kills</span> ({m.placementPoints} pts)
                          </p>
                        </div>
                        <div className="pl-3 border-l border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Match Total</p>
                          <p className={`text-base font-black ${isWWCD ? "text-pubg-gold" : "text-white"}`}>
                            {m.totalPoints} pts
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-pubg-border text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white text-xs transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
