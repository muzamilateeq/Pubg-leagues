"use client";

import { Season, Team, Match } from "@/lib/types";
import { Trophy, Calendar, CheckCircle, Hourglass, Users, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl bg-pubg-card border-2 border-pubg-gold/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-pubg-card to-slate-950 border-b border-pubg-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pubg-gold to-pubg-orange p-[2px] shadow-neon-gold shrink-0">
              <div className="w-full h-full bg-pubg-dark rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-pubg-gold" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-pubg-gold/20 text-pubg-gold border border-pubg-gold/30 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                  WELCOME
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold truncate">PUBG ESPORTS</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white uppercase italic tracking-tight truncate">
                SELECT <span className="text-pubg-gold">SEASON</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
            title="Close popup"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Subtitle message */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900/60 border-b border-pubg-border/50 text-[11px] sm:text-xs text-slate-300">
          Choose a season to view leaderboard rankings and match performance.
        </div>

        {/* Season List */}
        <div className="p-3 sm:p-6 space-y-3 overflow-y-auto max-h-[55vh]">
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
                  className={`relative cursor-pointer p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all group overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-950/40 via-pubg-card to-slate-900 border-pubg-gold shadow-neon-gold"
                      : "bg-slate-900/80 border-pubg-border hover:border-slate-600 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                    
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2.5 sm:p-3 rounded-xl border shrink-0 ${
                        isSelected
                          ? "bg-pubg-gold text-slate-950 border-pubg-gold"
                          : "bg-slate-950 text-pubg-gold border-slate-700"
                      }`}>
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-white text-sm sm:text-base truncate group-hover:text-pubg-gold transition-colors">
                            {season.name}
                          </h3>
                          {isSelected && (
                            <span className="px-1.5 py-0.2 rounded bg-pubg-gold text-slate-950 text-[9px] font-black uppercase">
                              Selected
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 mt-1 text-[11px] sm:text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" /> {seasonTeamsCount} Teams
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-pubg-orange" /> {publishedMatchesCount} Matches
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start sm:self-auto shrink-0">
                      {hasStarted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-[11px] font-bold">
                          <CheckCircle className="w-3 h-3" /> LIVE STANDINGS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40 text-[10px] sm:text-[11px] font-bold">
                          <Hourglass className="w-3 h-3 animate-pulse text-amber-400" /> WAITING / UPCOMING
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
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-pubg-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-[10px] sm:text-[11px] text-slate-400 text-center sm:text-left">Select a season to view leaderboards.</p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pubg-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-neon-gold hover:bg-amber-400 transition-colors text-center"
          >
            Enter Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
}
