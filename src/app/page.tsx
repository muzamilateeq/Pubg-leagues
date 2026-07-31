"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SeasonSelector from "@/components/SeasonSelector";
import StatCards from "@/components/StatCards";
import LeaderboardTable from "@/components/LeaderboardTable";
import TeamDetailModal from "@/components/TeamDetailModal";
import SeasonSelectionModal from "@/components/SeasonSelectionModal";
import { computeLeaderboard, getLocalStoreData, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { Season, Team, Match, MatchResult, LeaderboardEntry } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/pubgRules";
import { Trophy, Radio, RefreshCw, Flame, Shield, Zap, Clock, Hourglass, Users, CheckCircle, Radar, Layers } from "lucide-react";

export default function PublicLeaderboardPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [selectedTeamEntry, setSelectedTeamEntry] = useState<LeaderboardEntry | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(true); // Popup open on 1st load

  // Load Data function (from Supabase or local store)
  const fetchData = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sData } = await supabase.from("seasons").select("*").order("created_at", { ascending: false });
        const { data: tData } = await supabase.from("teams").select("*");
        const { data: mData } = await supabase.from("matches").select("*").order("match_number", { ascending: true });
        const { data: rData } = await supabase.from("match_results").select("*");

        if (sData && sData.length > 0) setSeasons(sData);
        if (tData) setTeams(tData);
        if (mData) setMatches(mData);
        if (rData) setResults(rData);

        if (sData && sData.length > 0 && !selectedSeasonId) {
          const active = sData.find((s) => s.status === "active") || sData[0];
          setSelectedSeasonId(active.id);
        }
        setIsLoading(false);
        return;
      } catch (err) {
        console.error("Supabase load error, utilizing local store:", err);
      }
    }

    // Local Storage / Demo Fallback
    const local = getLocalStoreData();
    setSeasons(local.seasons);
    setTeams(local.teams);
    setMatches(local.matches);
    setResults(local.results);

    if (local.seasons.length > 0 && !selectedSeasonId) {
      const active = local.seasons.find((s) => s.status === "active") || local.seasons[0];
      setSelectedSeasonId(active.id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Setup Supabase Realtime Subscription if configured
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel("pubg_realtime_standings")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "match_results" },
          () => {
            fetchData();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "matches" },
          () => {
            fetchData();
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }

    // Local Storage sync listener across tabs / updates
    const handleUpdate = () => fetchData();
    window.addEventListener("pubg_store_update", handleUpdate);
    return () => window.removeEventListener("pubg_store_update", handleUpdate);
  }, []);

  // Compute standings for selected season
  const standings = selectedSeasonId
    ? computeLeaderboard(selectedSeasonId, teams, matches, results)
    : [];

  const currentSeasonObj = seasons.find((s) => s.id === selectedSeasonId);
  const seasonTeams = teams.filter((t) => t.season_id === selectedSeasonId);
  
  const publishedCompletedMatches = matches.filter(
    (m) => m.season_id === selectedSeasonId && m.status !== "upcoming" && m.is_published !== false
  );

  const hasRecordedMatchData = publishedCompletedMatches.length > 0 || standings.some((s) => s.matchesPlayed > 0);

  return (
    <div className="min-h-screen bg-pubg-dark text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenSeasonModal={() => setIsSeasonModalOpen(true)}
        currentSeasonName={currentSeasonObj?.name}
      />

      {/* Season Selection Popup Modal on 1st Load / Request */}
      <SeasonSelectionModal
        isOpen={isSeasonModalOpen}
        seasons={seasons}
        teams={teams}
        matches={matches}
        selectedSeasonId={selectedSeasonId}
        onSelectSeason={(id) => {
          setSelectedSeasonId(id);
          setIsSeasonModalOpen(false);
        }}
        onClose={() => setIsSeasonModalOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Hero Banner with Season Switcher & Live Counter */}
        <div className="relative z-20 glass-panel rounded-3xl p-5 sm:p-8 md:p-10 border border-pubg-border bg-gradient-to-r from-slate-950 via-pubg-card to-slate-950">
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-pubg-gold/20 border border-pubg-gold/40 text-pubg-gold text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-neon-gold">
                  <Zap className="w-3.5 h-3.5 fill-pubg-gold text-pubg-gold" /> OFFICIAL PUBG ESPORTS
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" /> Live Standings Portal
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase italic tracking-tight leading-none">
                CHAMPIONSHIP <span className="text-pubg-gold drop-shadow-[0_2px_10px_rgba(243,175,25,0.5)]">STANDINGS</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300">
                Track live placement ranks, WWCD victories, and total elimination scores in real-time.
                Click on any team row to inspect match performance breakdowns.
              </p>
            </div>

            {/* Season Selector, Register Team & Quick Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <Shield className="w-4 h-4 text-white" />
                <span>Register Team</span>
              </Link>

              <button
                onClick={() => setIsSeasonModalOpen(true)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-pubg-card border-2 border-pubg-gold/50 text-left hover:border-pubg-gold transition-all shadow-neon-gold group shrink-0"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-pubg-gold/20 text-pubg-gold border border-pubg-gold/30">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[10px] text-slate-400 uppercase font-black">Active Season</span>
                    <h4 className="font-bold text-white text-sm truncate">{currentSeasonObj?.name || "Select Season"}</h4>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-pubg-gold text-slate-950 shrink-0">
                  Switch
                </span>
              </button>

              <div className="p-3.5 rounded-xl bg-pubg-card border border-pubg-border text-center flex flex-col justify-center min-w-[110px] shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-black">Published Matches</span>
                <span className="text-xl font-black text-white">{publishedCompletedMatches.length}</span>
              </div>
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pubg-gold/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* CONDITION: If Season has Recorded Match Data -> Render Podium & Table */}
        {hasRecordedMatchData ? (
          <>
            {/* Podium Top 3 Highlight Cards */}
            {standings.length > 0 && (
              <StatCards
                standings={standings}
                onSelectTeam={(entry) => setSelectedTeamEntry(entry)}
              />
            )}

            {/* Dynamic Leaderboard Table */}
            <LeaderboardTable
              standings={standings}
              onSelectTeam={(entry) => setSelectedTeamEntry(entry)}
            />
          </>
        ) : (
          /* CONDITION: If 0 Published Matches for Selected Season -> Render Gaming Waiting Dashboard */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="glass-panel rounded-3xl p-6 sm:p-12 border border-pubg-border text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-pubg-card to-slate-950 shadow-2xl">
              
              {/* Radar Scanner Animation Icon */}
              <div className="relative w-24 h-24 rounded-full bg-slate-950 border-2 border-pubg-gold/40 flex items-center justify-center mx-auto shadow-neon-gold group">
                <div className="absolute inset-0 rounded-full border border-pubg-gold/20 animate-ping" />
                <Radar className="w-10 h-10 text-pubg-gold animate-spin" style={{ animationDuration: '6s' }} />
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-400 live-badge-glow" />
              </div>

              <div className="max-w-xl mx-auto space-y-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 border bg-amber-950/80 border-amber-500/40 text-amber-400 shadow-lg">
                  <Hourglass className="w-3.5 h-3.5 animate-pulse" />
                  SEASON REGISTERED • WAITING FOR MATCH SCORES
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tight">
                  {currentSeasonObj?.name || "SELECTED SEASON"}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Teams are registered and lobby scoring is currently in progress. As soon as tournament organizers submit and publish Match 1 scores, live standings and WWCD leaderboards will appear right here!
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => fetchData()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pubg-gold font-bold text-xs border border-pubg-gold/40 transition-colors shadow-md"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Check For Live Updates
                  </button>
                </div>
              </div>

              {/* Registered Teams Preview Card Grid */}
              {seasonTeams.length > 0 ? (
                <div className="pt-6 border-t border-pubg-border/60 max-w-4xl mx-auto">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-pubg-gold" /> REGISTERED TEAMS IN {currentSeasonObj?.name} ({seasonTeams.length})
                  </h3>

                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {seasonTeams.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-pubg-border flex items-center gap-3 hover:border-pubg-gold/40 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={getTeamLogoUrl(t.team_name, t.logo_url)}
                            alt={t.team_name}
                            className="w-full h-full object-contain rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getTeamLogoUrl(t.team_name);
                            }}
                          />
                        </div>
                        <div className="text-left truncate">
                          <p className="text-xs font-bold text-white truncate">{t.team_name}</p>
                          <p className="text-[10px] text-slate-400 truncate">Cap: {t.captain_name || "N/A"}</p>
                          <span className="inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                            READY FOR DROP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-4 text-xs text-slate-500 font-medium">
                  No teams registered for this season yet.
                </div>
              )}

            </div>
          </div>
        )}

        {/* Easy To Understand: Point System & Rules Guide for Spectators & Players */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-pubg-border bg-slate-900/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pubg-border/50 pb-3 gap-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-pubg-gold" /> OFFICIAL PUBG ESPORTS POINT SYSTEM
            </h3>
            <span className="self-start sm:self-auto text-[10px] text-slate-400 font-semibold uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              SUPER Ruleset
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-pubg-border/60 space-y-1">
              <div className="flex items-center gap-2 font-bold text-pubg-gold text-sm">
                <Trophy className="w-4 h-4 text-pubg-gold" /> WWCD Victory
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Awarded to the last surviving team of a match. <strong>Winner Winner Chicken Dinner!</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-pubg-border/60 space-y-1">
              <div className="flex items-center gap-2 font-bold text-pubg-orange text-sm">
                <Flame className="w-4 h-4 text-pubg-orange" /> Kill Points (1 pt / Kill)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Each team earns <strong>1 Point per elimination</strong> scored during matches.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-pubg-border/60 space-y-1">
              <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
                <Shield className="w-4 h-4 text-cyan-400" /> Placement Points
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                1st = 10 pts • 2nd = 6 pts • 3rd = 5 pts • 4th = 4 pts • 5th = 3 pts • 6th = 2 pts • 7th-8th = 1 pt.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Team Details Modal */}
      <TeamDetailModal
        entry={selectedTeamEntry}
        onClose={() => setSelectedTeamEntry(null)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-pubg-border bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 PUBG Esports Tournament Management Portal. Built with Next.js, Supabase & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
