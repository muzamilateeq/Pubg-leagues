"use client";

import { useState } from "react";
import { LeaderboardEntry } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/pubgRules";
import { Trophy, Crown, Flame, Search, ChevronRight } from "lucide-react";

interface LeaderboardTableProps {
  standings: LeaderboardEntry[];
  onSelectTeam: (entry: LeaderboardEntry) => void;
}

export default function LeaderboardTable({ standings, onSelectTeam }: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStandings = standings.filter((entry) =>
    entry.team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.team.captain_name && entry.team.captain_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="glass-panel rounded-2xl border border-pubg-border overflow-hidden shadow-2xl">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-pubg-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pubg-gold/15 border border-pubg-gold/30 text-pubg-gold shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg tracking-wide flex items-center gap-2">
              OVERALL LEADERBOARD
            </h3>
            <p className="text-xs text-slate-400">
              Sorted by Total Points &gt; WWCD &gt; Kills &gt; Placement Pts
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search team or captain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-pubg-card border border-pubg-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pubg-gold transition-all"
          />
        </div>
      </div>

      {/* MOBILE RESPONSIVE CARD VIEW (Shown on phones < md) */}
      <div className="block md:hidden divide-y divide-pubg-border/50">
        {filteredStandings.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No tournament teams found matching your query.
          </div>
        ) : (
          filteredStandings.map((entry, index) => {
            const rank = index + 1;
            const isGold = rank === 1;
            const isSilver = rank === 2;
            const isBronze = rank === 3;

            return (
              <div
                key={entry.team.id}
                onClick={() => onSelectTeam(entry)}
                className={`p-4 cursor-pointer transition-all active:bg-slate-800/80 ${
                  isGold
                    ? "bg-amber-950/20"
                    : isSilver
                    ? "bg-slate-900/40"
                    : isBronze
                    ? "bg-amber-900/10"
                    : "bg-pubg-dark/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  {/* Rank & Team info */}
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {isGold && (
                        <span className="w-8 h-8 rounded-full bg-gold-gradient text-slate-950 flex items-center justify-center font-black shadow-neon-gold text-xs">
                          <Crown className="w-4 h-4" />
                        </span>
                      )}
                      {isSilver && (
                        <span className="w-8 h-8 rounded-full bg-silver-gradient text-slate-950 flex items-center justify-center font-black text-xs">
                          2
                        </span>
                      )}
                      {isBronze && (
                        <span className="w-8 h-8 rounded-full bg-bronze-gradient text-white flex items-center justify-center font-black text-xs">
                          3
                        </span>
                      )}
                      {!isGold && !isSilver && !isBronze && (
                        <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 font-bold flex items-center justify-center text-xs">
                          #{rank}
                        </span>
                      )}
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-pubg-border p-1 flex items-center justify-center shrink-0">
                      <img
                        src={getTeamLogoUrl(entry.team.team_name, entry.team.logo_url)}
                        alt={entry.team.team_name}
                        className="w-full h-full object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getTeamLogoUrl(entry.team.team_name);
                        }}
                      />
                    </div>

                    <div className="truncate">
                      <h4 className="font-extrabold text-white text-sm truncate flex items-center gap-1.5">
                        {entry.team.team_name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        Cap: {entry.team.captain_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Total Points Pill */}
                  <div className="text-right shrink-0">
                    <div className="px-3 py-1 rounded-xl bg-pubg-gold/15 border border-pubg-gold/40 text-pubg-gold font-black text-base shadow-neon-gold">
                      {entry.totalPoints} <span className="text-[10px] uppercase font-bold text-slate-300">pts</span>
                    </div>
                  </div>
                </div>

                {/* Sub Stats Grid */}
                <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-pubg-border/30 text-xs">
                  <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Matches</span>
                    <span className="font-bold text-white">{entry.matchesPlayed}</span>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">WWCD</span>
                    <span className={`font-bold ${entry.wwcds > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                      {entry.wwcds}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Kills</span>
                    <span className="font-bold text-pubg-orange">{entry.killPoints}</span>
                  </div>
                  <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Place Pts</span>
                    <span className="font-bold text-cyan-400">{entry.placementPoints}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Shown on md screens and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-950/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-pubg-border">
              <th className="py-4 px-4 text-center w-16">Rank</th>
              <th className="py-4 px-6">Team Name</th>
              <th className="py-4 px-4 text-center">Matches</th>
              <th className="py-4 px-4 text-center">WWCD</th>
              <th className="py-4 px-4 text-center">Kill Pts</th>
              <th className="py-4 px-4 text-center">Place Pts</th>
              <th className="py-4 px-6 text-center text-pubg-gold font-black">Total Pts</th>
              <th className="py-4 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pubg-border/50 text-sm">
            {filteredStandings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                  No tournament teams found matching your query.
                </td>
              </tr>
            ) : (
              filteredStandings.map((entry, index) => {
                const rank = index + 1;
                const isGold = rank === 1;
                const isSilver = rank === 2;
                const isBronze = rank === 3;

                return (
                  <tr
                    key={entry.team.id}
                    onClick={() => onSelectTeam(entry)}
                    className={`cursor-pointer transition-all hover:bg-slate-800/60 group ${
                      isGold
                        ? "bg-amber-950/20 hover:bg-amber-950/30"
                        : isSilver
                        ? "bg-slate-900/30 hover:bg-slate-800/40"
                        : isBronze
                        ? "bg-amber-900/10 hover:bg-amber-900/20"
                        : ""
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-4 px-4 text-center font-black">
                      <div className="flex justify-center items-center">
                        {isGold && (
                          <span className="w-8 h-8 rounded-full bg-gold-gradient text-slate-950 flex items-center justify-center font-black shadow-neon-gold">
                            <Crown className="w-4 h-4" />
                          </span>
                        )}
                        {isSilver && (
                          <span className="w-8 h-8 rounded-full bg-silver-gradient text-slate-950 flex items-center justify-center font-black">
                            2
                          </span>
                        )}
                        {isBronze && (
                          <span className="w-8 h-8 rounded-full bg-bronze-gradient text-white flex items-center justify-center font-black">
                            3
                          </span>
                        )}
                        {!isGold && !isSilver && !isBronze && (
                          <span className="text-slate-400 text-sm font-bold">#{rank}</span>
                        )}
                      </div>
                    </td>

                    {/* Team Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-pubg-border p-1 flex items-center justify-center shrink-0 group-hover:border-pubg-gold transition-colors">
                          <img
                            src={getTeamLogoUrl(entry.team.team_name, entry.team.logo_url)}
                            alt={entry.team.team_name}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getTeamLogoUrl(entry.team.team_name);
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white group-hover:text-pubg-gold transition-colors flex items-center gap-2">
                            {entry.team.team_name}
                            {isGold && (
                              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-pubg-gold text-slate-950">
                                #1
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Cap: <span className="text-slate-300 font-medium">{entry.team.captain_name || "N/A"}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Matches Played */}
                    <td className="py-4 px-4 text-center font-bold text-slate-300">
                      {entry.matchesPlayed}
                    </td>

                    {/* WWCD (Winner Winner Chicken Dinner) */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                          entry.wwcds > 0
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                            : "text-slate-500 font-normal"
                        }`}
                      >
                        {entry.wwcds > 0 && <Trophy className="w-3 h-3 text-emerald-400" />}
                        {entry.wwcds}
                      </span>
                    </td>

                    {/* Kill Points */}
                    <td className="py-4 px-4 text-center font-bold text-pubg-orange">
                      <span className="flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {entry.killPoints}
                      </span>
                    </td>

                    {/* Placement Points */}
                    <td className="py-4 px-4 text-center font-bold text-cyan-400">
                      {entry.placementPoints}
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-lg font-black tracking-tight ${
                          isGold ? "text-pubg-gold text-xl drop-shadow-[0_0_10px_rgba(243,175,25,0.5)]" : "text-white"
                        }`}
                      >
                        {entry.totalPoints}
                      </span>
                    </td>

                    {/* Drill-down Arrow */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-pubg-gold group-hover:text-slate-950 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

