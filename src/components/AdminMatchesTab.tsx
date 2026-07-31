"use client";

import { useState } from "react";
import { Match, Team, MatchResult, Season, PubgMapName } from "@/lib/types";
import { getPlacementPoints, computeTotalPoints, getMapInfo, PUBG_MAPS, getTeamLogoUrl } from "@/lib/pubgRules";
import { dbSaveMatch, dbSaveMatchResults, setLocalStoreData, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { Gamepad2, Plus, Calculator, Check, Flame, Trophy, Save, Eye, EyeOff, Radio, Sparkles, Trash2, Edit3 } from "lucide-react";

interface AdminMatchesTabProps {
  matches: Match[];
  teams: Team[];
  results: MatchResult[];
  seasons: Season[];
  activeSeasonId: string;
  onRefresh: () => void;
}

export default function AdminMatchesTab({
  matches,
  teams,
  results,
  seasons,
  activeSeasonId,
  onRefresh,
}: AdminMatchesTabProps) {
  const seasonTeams = teams.filter((t) => t.season_id === activeSeasonId);
  const seasonMatches = matches.filter((m) => m.season_id === activeSeasonId);

  // Selected Match for Scoreboard Entry
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    seasonMatches.length > 0 ? seasonMatches[0].id : ""
  );

  // Form to Create New Match666
  const [newMatchNumber, setNewMatchNumber] = useState<number>(seasonMatches.length + 1);
  const [selectedPresetMap, setSelectedPresetMap] = useState<string>("Rondo");
  const [customMapName, setCustomMapName] = useState<string>("");
  const [isCustomMap, setIsCustomMap] = useState<boolean>(false);
  const [newMatchStatus, setNewMatchStatus] = useState<"completed" | "live" | "upcoming">("completed");

  // Local Editable Score Matrix for selected match
  const currentMatchResults = results.filter((r) => r.match_id === selectedMatchId);

  const initialScoreState = () => {
    const map: Record<string, { rank: number; kills: number }> = {};
    seasonTeams.forEach((team, idx) => {
      const existing = currentMatchResults.find((r) => r.team_id === team.id);
      map[team.id] = {
        rank: existing ? existing.placement_rank : idx + 1,
        kills: existing ? existing.kill_points : 0,
      };
      
    });
    return map;
  };
  const [scoreMatrix, setScoreMatrix] = useState<Record<string, { rank: number; kills: number }>>(
    initialScoreState
  );

  // When selectedMatchId changes, reset editable score matrix
  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    const mapResults = results.filter((r) => r.match_id === matchId);
    const map: Record<string, { rank: number; kills: number }> = {};
    seasonTeams.forEach((team, idx) => {
      const existing = mapResults.find((r) => r.team_id === team.id);
      map[team.id] = {
        rank: existing ? existing.placement_rank : idx + 1,
        kills: existing ? existing.kill_points : 0,
      };
    });
    setScoreMatrix(map);
  };

  // Handle Score Input Change
  const handleScoreChange = (teamId: string, field: "rank" | "kills", value: number) => {
    setScoreMatrix((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [field]: Math.max(0, value),
      },
    }));
  };

  // Create New Match
  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalMapName = isCustomMap
      ? customMapName.trim() || "Custom Map"
      : selectedPresetMap;

    const created = await dbSaveMatch({
      season_id: activeSeasonId,
      match_number: newMatchNumber,
      map_name: finalMapName,
      status: newMatchStatus as any,
      is_published: false, // Default to draft editing state until published
    });

    if (created && created[0]) {
      setSelectedMatchId(created[0].id);
    }

    setNewMatchNumber(newMatchNumber + 1);
    setCustomMapName("");
    onRefresh();
  };

  // Delete Match
  const handleDeleteMatch = async (matchId: string) => {
    if (confirm("Are you sure you want to delete this match and all its score entries?")) {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("matches").delete().eq("id", matchId);
      } else {
        const updated = matches.filter((m) => m.id !== matchId);
        setLocalStoreData("MATCHES", updated);
      }
      setSelectedMatchId("");
      onRefresh();
    }
  };

  // Save Scoreboard Entry (Draft or Live)
  const handleSaveScoreboard = async (publishLive: boolean) => {
    if (!selectedMatchId) return;

    const payload = Object.entries(scoreMatrix).map(([teamId, data]) => {
      const placementPoints = getPlacementPoints(data.rank);
      return {
        team_id: teamId,
        placement_rank: data.rank,
        placement_points: placementPoints,
        kill_points: data.kills,
      };
    });

    await dbSaveMatchResults(selectedMatchId, payload);

    // Update match status and published flag
    const newStatus = publishLive ? "completed" : "draft";
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("matches")
        .update({ status: newStatus, is_published: publishLive })
        .eq("id", selectedMatchId);
    } else {
      const updated = matches.map((m) =>
        m.id === selectedMatchId ? { ...m, status: newStatus as any, is_published: publishLive } : m
      );
      setLocalStoreData("MATCHES", updated);
    }

    alert(
      publishLive
        ? "Match Standings PUBLISHED LIVE to Public Leaderboard!"
        : "Match Standings saved as DRAFT (Hidden from Public Leaderboard until Published)."
    );
    onRefresh();
  };

  // Toggle Live Publish Status
  const handleTogglePublish = async (matchId: string, currentPublished: boolean) => {
    const nextPublished = !currentPublished;
    const nextStatus = nextPublished ? "completed" : "draft";

    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("matches")
        .update({ is_published: nextPublished, status: nextStatus })
        .eq("id", matchId);
    } else {
      const updated = matches.map((m) =>
        m.id === matchId ? { ...m, is_published: nextPublished, status: nextStatus as any } : m
      );
      setLocalStoreData("MATCHES", updated);
    }
    onRefresh();
  };

  const selectedMatchObj = matches.find((m) => m.id === selectedMatchId);
  const selectedMapInfo = selectedMatchObj ? getMapInfo(selectedMatchObj.map_name) : null;
  const isMatchPublished = selectedMatchObj?.is_published ?? true;

  return (
    <div className="space-y-8">
      
      {/* Upper Grid: Create Match & Select Active Match */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Match Form */}
        <div className="glass-panel rounded-2xl p-6 border border-pubg-border h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-pubg-gold/15 text-pubg-gold border border-pubg-gold/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Create Match</h3>
              <p className="text-xs text-slate-400">Rondo, Erangel, Miramar or Custom Map</p>
            </div>
          </div>

          <form onSubmit={handleCreateMatch} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Match #</label>
                <input
                  type="number"
                  min="1"
                  value={newMatchNumber}
                  onChange={(e) => setNewMatchNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Map Selection</label>
                <select
                  value={isCustomMap ? "CUSTOM" : selectedPresetMap}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "CUSTOM") {
                      setIsCustomMap(true);
                    } else {
                      setIsCustomMap(false);
                      setSelectedPresetMap(val);
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold"
                >
                  {PUBG_MAPS.map((map) => (
                    <option key={map.name} value={map.name}>
                      {map.name}
                    </option>
                  ))}
                  <option value="CUSTOM">✏️ Custom / Manual Map Input...</option>
                </select>
              </div>
            </div>

            {/* Custom Map Text Input if selected */}
            {isCustomMap && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-pubg-gold uppercase mb-1.5 flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Type Custom Map Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanhok Night, TDM Arena, Deston"
                  value={customMapName}
                  onChange={(e) => setCustomMapName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-gold rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-pubg-gold"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Initial Match State</label>
              <select
                value={newMatchStatus}
                onChange={(e) => setNewMatchStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold"
              >
                <option value="completed">Ready for Scoring</option>
                <option value="live">Live Now</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-pubg-gold text-slate-950 font-black text-sm uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-neon-gold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Match to Season
            </button>
          </form>
        </div>

        {/* Select Match to Edit / View Scores */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-pubg-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pubg-orange/15 text-pubg-orange border border-pubg-orange/30">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Match List & Controls</h3>
                  <p className="text-xs text-slate-400">Total ({seasonMatches.length}) matches created in season</p>
                </div>
              </div>
            </div>

            {/* Match Cards List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {seasonMatches.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                  No matches created for this season yet. Use form on left to add Match 1.
                </div>
              ) : (
                seasonMatches.map((m) => {
                  const isSelected = m.id === selectedMatchId;
                  const isPub = m.is_published !== false;

                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMatch(m.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between group ${
                        isSelected
                          ? "bg-pubg-gold/15 border-pubg-gold shadow-neon-gold"
                          : "bg-pubg-card border-pubg-border hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black uppercase text-slate-400">Match #{m.match_number}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase border ${
                              isPub
                                ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                                : "bg-amber-950 text-amber-400 border-amber-500/40"
                            }`}
                          >
                            {isPub ? "LIVE" : "DRAFT"}
                          </span>
                        </div>
                        <h4 className={`text-base font-extrabold ${isSelected ? "text-pubg-gold" : "text-white"}`}>
                          {m.map_name}
                        </h4>
                      </div>

                      {/* Controls Footer */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectMatch(m.id);
                          }}
                          className={`w-full py-1.5 text-[10px] font-extrabold uppercase rounded border transition-colors flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-pubg-gold text-slate-950 border-pubg-gold shadow-neon-gold"
                              : "bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          {isSelected ? "Currently Editing" : "Edit Match Scores"}
                        </button>
                        
                        <div className="flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePublish(m.id, isPub);
                            }}
                            className={`flex-1 py-1 text-[10px] font-extrabold uppercase rounded border transition-colors flex items-center justify-center gap-1 ${
                              isPub
                                ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                                : "bg-pubg-gold text-slate-950 border-pubg-gold hover:bg-amber-400"
                            }`}
                          >
                            {isPub ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {isPub ? "Unpublish" : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMatch(m.id);
                            }}
                            className="p-1 rounded bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Delete Match"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {selectedMatchObj && selectedMapInfo && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-pubg-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${selectedMapInfo.badgeBg} ${selectedMapInfo.badgeText}`}>
                  {selectedMatchObj.map_name}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {selectedMapInfo.description}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1.5 border ${
                    isMatchPublished
                      ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                      : "bg-amber-950 text-amber-400 border-amber-500/40"
                  }`}
                >
                  <Radio className={`w-3 h-3 ${isMatchPublished ? "animate-pulse" : ""}`} />
                  {isMatchPublished ? "PUBLISHED LIVE" : "DRAFT MODE"}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteMatch(selectedMatchObj.id)}
                  className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/80 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Match
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Lower Section: Interactive Scoreboard Entry Table */}
      {selectedMatchId && seasonTeams.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-pubg-border shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-pubg-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                  Scoreboard Entry (Match #{selectedMatchObj?.match_number} - {selectedMatchObj?.map_name})
                  {isMatchPublished ? (
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold uppercase">
                      Live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] rounded bg-amber-950 text-amber-400 border border-amber-500/40 font-bold uppercase">
                      Draft Mode
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  WWCD is automatically awarded to Rank 1 (10 Placement Pts). Edit ranks and kill counts below.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveScoreboard(false)}
                className="px-5 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all border border-slate-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-slate-400" /> Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSaveScoreboard(true)}
                className="px-6 py-3 rounded-xl bg-pubg-gold text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-neon-gold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" /> Publish Live to Public
              </button>
            </div>
          </div>

          {/* Table Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-950/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-pubg-border">
                  <th className="py-3 px-4">Participating Team</th>
                  <th className="py-3 px-4 text-center w-36">Placement Rank (1-16)</th>
                  <th className="py-3 px-4 text-center w-36">WWCD Winner?</th>
                  <th className="py-3 px-4 text-center w-28">Placement Pts</th>
                  <th className="py-3 px-4 text-center w-36">Kill Count (Kills)</th>
                  <th className="py-3 px-4 text-center text-pubg-gold font-black w-28">Computed Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pubg-border/50 text-sm">
                {seasonTeams.map((team) => {
                  const entry = scoreMatrix[team.id] || { rank: 1, kills: 0 };
                  const placementPts = getPlacementPoints(entry.rank);
                  const total = computeTotalPoints(placementPts, entry.kills);
                  const isWWCD = entry.rank === 1;

                  return (
                    <tr
                      key={team.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isWWCD ? "bg-amber-950/20" : ""
                      }`}
                    >
                      {/* Team Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-950 border border-pubg-border p-1 flex items-center justify-center shrink-0">
                            <img
                              src={getTeamLogoUrl(team.team_name, team.logo_url)}
                              alt={team.team_name}
                              className="w-full h-full object-contain rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getTeamLogoUrl(team.team_name);
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-extrabold text-white text-sm">{team.team_name}</span>
                            {isWWCD && (
                              <span className="ml-2 text-[10px] uppercase font-black text-pubg-gold bg-pubg-gold/10 px-1.5 py-0.5 rounded border border-pubg-gold/30">
                                🏆 Rank 1 WWCD
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rank Input */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          min="1"
                          max="64"
                          value={entry.rank}
                          onChange={(e) =>
                            handleScoreChange(team.id, "rank", parseInt(e.target.value) || 1)
                          }
                          className="w-20 px-3 py-1.5 bg-slate-950 border border-pubg-border rounded-lg text-center font-bold text-white focus:outline-none focus:border-pubg-gold"
                        />
                      </td>

                      {/* WWCD Badge Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isWWCD ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pubg-gold text-slate-950 text-xs font-black uppercase shadow-neon-gold">
                            <Trophy className="w-3.5 h-3.5 fill-slate-950" /> WWCD WINNER
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">Rank #{entry.rank}</span>
                        )}
                      </td>

                      {/* Calculated Placement Pts */}
                      <td className="py-3.5 px-4 text-center font-bold text-cyan-400">
                        +{placementPts} pts
                      </td>

                      {/* Kill Count Input */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Flame className="w-4 h-4 text-pubg-orange" />
                          <input
                            type="number"
                            min="0"
                            value={entry.kills}
                            onChange={(e) =>
                              handleScoreChange(team.id, "kills", parseInt(e.target.value) || 0)
                            }
                            className="w-20 px-3 py-1.5 bg-slate-950 border border-pubg-border rounded-lg text-center font-bold text-pubg-orange focus:outline-none focus:border-pubg-orange"
                          />
                        </div>
                      </td>

                      {/* Total Points */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-base font-black ${isWWCD ? "text-pubg-gold" : "text-white"}`}>
                          {total} pts
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-pubg-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              * Note: Clicking <strong className="text-pubg-gold">Publish Live</strong> will instantly show this match on the public leaderboard.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveScoreboard(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all border border-slate-700"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSaveScoreboard(true)}
                className="px-8 py-3 rounded-xl bg-pubg-gold text-slate-950 font-black text-sm uppercase tracking-wider hover:bg-amber-400 transition-all shadow-neon-gold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" /> Publish Live Standings
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
