"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AdminSeasonsTab from "@/components/AdminSeasonsTab";
import AdminTeamsTab from "@/components/AdminTeamsTab";
import AdminMatchesTab from "@/components/AdminMatchesTab";
import { getLocalStoreData, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { Season, Team, Match, MatchResult } from "@/lib/types";
import { Shield, Lock, Calendar, Users, Gamepad2, Unlock, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default unlocked for easy user access
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState<"seasons" | "teams" | "matches">("matches");

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [activeSeasonId, setActiveSeasonId] = useState<string>("");

  const loadData = async () => {
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

        if (sData && sData.length > 0 && !activeSeasonId) {
          const active = sData.find((s) => s.status === "active") || sData[0];
          setActiveSeasonId(active.id);
        }
        return;
      } catch (e) {
        console.error("Supabase fetch failed, falling back to local store:", e);
      }
    }

    // Local Storage Fallback
    const local = getLocalStoreData();
    setSeasons(local.seasons);
    setTeams(local.teams);
    setMatches(local.matches);
    setResults(local.results);

    if (local.seasons.length > 0 && !activeSeasonId) {
      const active = local.seasons.find((s) => s.status === "active") || local.seasons[0];
      setActiveSeasonId(active.id);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("pubg_store_update", handleUpdate);
    return () => window.removeEventListener("pubg_store_update", handleUpdate);
  }, []);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin" || passcode === "1234" || passcode === "pubg") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid passcode! Try 'admin' or '1234'");
    }
  };

  return (
    <div className="min-h-screen bg-pubg-dark text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Passcode Lock Screen (If locked) */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-3xl border border-pubg-border shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-pubg-orange/15 border border-pubg-orange/30 text-pubg-orange flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Admin Portal Security</h2>
              <p className="text-xs text-slate-400 mt-1">Enter admin passcode to unlock scoring & team controls</p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Passcode (default: admin)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-pubg-card border border-pubg-border rounded-xl text-center font-mono text-lg text-white focus:outline-none focus:border-pubg-gold"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-pubg-orange text-white font-black text-sm uppercase tracking-wider shadow-neon-orange hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Unlock Admin Panel
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Header Banner */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pubg-border flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-pubg-orange/20 border border-pubg-orange/40 text-pubg-orange text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> AUTHORIZED ADMIN DASHBOARD
                  </span>
                  <span className="text-xs text-slate-400">
                    Active Season:{" "}
                    <span className="text-pubg-gold font-extrabold">
                      {seasons.find((s) => s.id === activeSeasonId)?.name || "Default"}
                    </span>
                  </span>
                </div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                  TOURNAMENT MANAGEMENT CONTROL
                </h1>
              </div>

              {/* Season Switcher for Admin */}
              <div className="w-full md:w-72">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Active Season Scope
                </label>
                <select
                  value={activeSeasonId}
                  onChange={(e) => setActiveSeasonId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-xs text-white focus:outline-none focus:border-pubg-gold"
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Admin Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-pubg-border pb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("matches")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                  activeTab === "matches"
                    ? "bg-pubg-gold text-slate-950 shadow-neon-gold"
                    : "bg-pubg-card text-slate-400 hover:text-white border border-pubg-border"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                Scoreboard Entry & Matches
              </button>

              <button
                onClick={() => setActiveTab("teams")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                  activeTab === "teams"
                    ? "bg-pubg-gold text-slate-950 shadow-neon-gold"
                    : "bg-pubg-card text-slate-400 hover:text-white border border-pubg-border"
                }`}
              >
                <Users className="w-4 h-4" />
                Team Registration ({teams.filter((t) => t.season_id === activeSeasonId).length})
              </button>

              <button
                onClick={() => setActiveTab("seasons")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                  activeTab === "seasons"
                    ? "bg-pubg-gold text-slate-950 shadow-neon-gold"
                    : "bg-pubg-card text-slate-400 hover:text-white border border-pubg-border"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Seasons Manager ({seasons.length})
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === "matches" && (
              <AdminMatchesTab
                matches={matches}
                teams={teams}
                results={results}
                seasons={seasons}
                activeSeasonId={activeSeasonId}
                onRefresh={loadData}
              />
            )}

            {activeTab === "teams" && (
              <AdminTeamsTab
                teams={teams}
                seasons={seasons}
                activeSeasonId={activeSeasonId}
                onRefresh={loadData}
              />
            )}

            {activeTab === "seasons" && (
              <AdminSeasonsTab seasons={seasons} onRefresh={loadData} />
            )}

          </div>
        )}

      </main>
    </div>
  );
}
