"use client";

import { useState } from "react";
import { LeaderboardEntry } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/pubgRules";
import { Trophy, Crown, Flame, Crosshair, Search, ChevronRight, Hash } from "lucide-react";

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
          <div className="p-2.5 rounded-xl bg-pubg-gold/15 border border-pubg-gold/30 text-pubg-gold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg tracking-wide flex items-center gap-2">
              OVERALL LEADERBOARD
            </h3>
            <p className="text-xs text-slate-400">
              Sorted by Total Points &gt; WWCD &gt; Kill Points &gt; Placement Points
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

      {/* Table Content */}
      <div className="overflow-x-auto">
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
