"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SeasonSelector from "@/components/SeasonSelector";
import StatCards from "@/components/StatCards";
import LeaderboardTable from "@/components/LeaderboardTable";
import TeamDetailModal from "@/components/TeamDetailModal";
import { computeLeaderboard, getLocalStoreData, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { Season, Team, Match, MatchResult, LeaderboardEntry } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/pubgRules";
import { Trophy, Radio, RefreshCw, Flame, Shield, MapPin, Zap, Clock, Hourglass, Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function PublicLeaderboardPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [selectedTeamEntry, setSelectedTeamEntry] = useState<LeaderboardEntry | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner with Season Switcher & Live Counter */}
        <div className="relative z-20 glass-panel rounded-3xl p-6 sm:p-10 border border-pubg-border bg-gradient-to-r from-slate-950 via-pubg-card to-slate-950">
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-pubg-gold/20 border border-pubg-gold/40 text-pubg-gold text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-neon-gold">
                  <Zap className="w-3.5 h-3.5 fill-pubg-gold text-pubg-gold" /> OFFICIAL PUBG ESPORTS
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" /> Live Leaderboard
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tight leading-none">
                CHAMPIONSHIP <span className="text-pubg-gold drop-shadow-[0_2px_10px_rgba(243,175,25,0.5)]">STANDINGS</span>
              </h1>
              
              <p className="text-sm text-slate-300">
                Track live placement ranks, WWCD victories, and total elimination scores in real-time.
                Click on any team row to inspect match-by-match performance breakdowns.
              </p>
            </div>

            {/* Season Selector & Quick Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {seasons.length > 0 && (
                <SeasonSelector
                  seasons={seasons}
                  selectedSeasonId={selectedSeasonId}
                  onSelectSeason={(id) => setSelectedSeasonId(id)}
                />
              )}

              <div className="p-3.5 rounded-xl bg-pubg-card border border-pubg-border text-center flex flex-col justify-center min-w-[120px]">
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
          /* CONDITION: If 0 Published Matches for Selected Season -> Render Gaming Banner */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-pubg-border text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-pubg-card to-slate-950">
              
              <div className="relative w-20 h-20 rounded-3xl bg-pubg-gold/10 border border-pubg-gold/30 text-pubg-gold flex items-center justify-center mx-auto shadow-neon-gold">
                {currentSeasonObj?.status === "completed" ? (
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                ) : (
                  <Hourglass className="w-10 h-10 animate-pulse text-pubg-gold" />
                )}
              </div>

              <div className="max-w-xl mx-auto space-y-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 border ${
                    currentSeasonObj?.status === "completed"
                      ? "bg-slate-800 text-slate-300 border-slate-700"
                      : "bg-amber-950/80 border border-amber-500/40 text-amber-400"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {currentSeasonObj?.status === "completed"
                    ? "SEASON COMPLETED / ARCHIVED"
                    : "MATCHES IN PROCESSING / COMING SOON"}
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tight">
                  {currentSeasonObj?.name || "SELECTED SEASON"}
                </h2>

                <p className="text-sm text-slate-300">
                  {currentSeasonObj?.status === "completed"
                    ? "This season has ended. No active match scores recorded for this tournament archive."
                    : "Matches for this season are currently live in progress or being recorded by tournament admins. Standings will be published live as soon as Match 1 scoring is completed!"}
                </p>
              </div>

              {/* Registered Teams Preview Card Grid */}
              {seasonTeams.length > 0 ? (
                <div className="pt-6 border-t border-pubg-border/60 max-w-4xl mx-auto">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-pubg-gold" /> REGISTERED TEAMS IN {currentSeasonObj?.name} ({seasonTeams.length})
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {seasonTeams.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-pubg-border flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shrink-0">
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-4 text-xs text-slate-500 font-medium">
                  No teams registered for this season yet. Use Admin Panel to add teams.
                </div>
              )}

            </div>
          </div>
        )}

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
