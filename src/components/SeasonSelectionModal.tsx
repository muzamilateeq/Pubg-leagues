"use client";

import { Season, Team, Match } from "@/lib/types";
import { Trophy, Calendar, CheckCircle, Clock, Hourglass, Shield, Users, ChevronRight, X, Sparkles } from "lucide-react";

interface SeasonSelectionModalProps {
  isOpen: boolean;
  seasons: Season[];
  teams: Team[];
  matches: Match[];
  selectedSeasonId: string;
  onSelectSeason: (id: string) => void;
  onClose: () => void;
}

export default function SeasonSelectionModal({
  isOpen,
  seasons,
  teams,
  matches,
  selectedSeasonId,
  onSelectSeason,
  onClose,
}: SeasonSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-xl bg-pubg-card border-2 border-pubg-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-pubg-card to-slate-950 border-b border-pubg-border flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pubg-gold to-pubg-orange p-[2px] shadow-neon-gold shrink-0">
              <div className="w-full h-full bg-pubg-dark rounded-[14px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-pubg-gold" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-pubg-gold/20 text-pubg-gold border border-pubg-gold/30 text-[10px] font-black uppercase tracking-wider">
                  WELCOME
                </span>
                <span className="text-xs text-slate-400 font-semibold">PUBG ESPORTS LEAGUE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight">
                SELECT TOURNAMENT <span className="text-pubg-gold">SEASON</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle message */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-pubg-border/50 text-xs text-slate-300">
          Choose a season below to inspect live leaderboard ranks, team performance, or upcoming match updates.
        </div>

        {/* Season List */}
        <div className="p-4 sm:p-6 space-y-3 overflow-y-auto max-h-[60vh]">
          {seasons.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No tournament seasons found.
            </div>
          ) : (
            seasons.map((season) => {
              const isSelected = season.id === selectedSeasonId;
              const seasonTeamsCount = teams.filter((t) => t.season_id === season.id).length;
              const publishedMatchesCount = matches.filter(
                (m) => m.season_id === season.id && m.status !== "upcoming" && m.is_published !== false
              ).length;

              const hasStarted = publishedMatchesCount > 0;

              return (
                <div
                  key={season.id}
                  onClick={() => {
                    onSelectSeason(season.id);
                    onClose();
                  }}
                  className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all group overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-950/40 via-pubg-card to-slate-900 border-pubg-gold shadow-neon-gold scale-[1.01]"
                      : "bg-slate-900/80 border-pubg-border hover:border-slate-600 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 truncate">
                      <div className={`p-3 rounded-xl border shrink-0 ${
                        isSelected
                          ? "bg-pubg-gold text-slate-950 border-pubg-gold"
                          : "bg-slate-950 text-pubg-gold border-slate-700"
                      }`}>
                        <Calendar className="w-5 h-5" />
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-base truncate group-hover:text-pubg-gold transition-colors">
                            {season.name}
                          </h3>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded bg-pubg-gold text-slate-950 text-[10px] font-black uppercase">
                              Selected
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" /> {seasonTeamsCount} Teams
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5 text-pubg-orange" /> {publishedMatchesCount} Matches Played
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-right shrink-0">
                      {hasStarted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> LIVE STANDINGS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40 text-[11px] font-bold">
                          <Hourglass className="w-3.5 h-3.5 animate-pulse text-amber-400" /> WAITING / UPCOMING
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-pubg-border flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Select a season to open its scoreboard dashboard.</p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-pubg-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-neon-gold hover:bg-amber-400 transition-colors"
          >
            Enter Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
}
