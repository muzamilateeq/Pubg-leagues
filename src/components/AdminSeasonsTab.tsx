"use client";

import { useState } from "react";
import { Season } from "@/lib/types";
import { dbSaveSeason, dbSaveMatch, setLocalStoreData, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { Calendar, Plus, CheckCircle, Clock, Trash2, Trophy, Settings } from "lucide-react";

interface AdminSeasonsTabProps {
  seasons: Season[];
  onRefresh: () => void;
  onManageSeason?: (seasonId: string) => void;
}

const PRESET_MAPS = ["Erangel", "Miramar", "Sanhok", "Vikendi"];

export default function AdminSeasonsTab({ seasons, onRefresh, onManageSeason }: AdminSeasonsTabProps) {
  const [newSeasonName, setNewSeasonName] = useState("");
  const [newSeasonStatus, setNewSeasonStatus] = useState<"active" | "completed">("active");
  const [matchCount, setMatchCount] = useState(0);
  const [matchMaps, setMatchMaps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMatchCountChange = (count: number) => {
    const newCount = Math.max(0, Math.min(20, count));
    setMatchCount(newCount);
    // Keep existing maps if we shrink, otherwise pad with Erangel
    setMatchMaps((prev) => {
      const updated = [...prev];
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) updated.push("Erangel");
      }
      return updated.slice(0, newCount);
    });
  };

  const handleCreateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeasonName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const savedSeason = await dbSaveSeason({
        name: newSeasonName.trim(),
        status: newSeasonStatus,
      });

      const seasonId = savedSeason?.[0]?.id;

      if (seasonId && matchCount > 0) {
        for (let i = 0; i < matchCount; i++) {
          await dbSaveMatch({
            season_id: seasonId,
            match_number: i + 1,
            map_name: matchMaps[i],
            status: "draft",
            is_published: false,
          });
        }
      }

      setNewSeasonName("");
      setMatchCount(0);
      setMatchMaps([]);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (seasonId: string) => {
    const target = seasons.find((s) => s.id === seasonId);
    if (!target) return;
    const newStatus = target.status === "active" ? "completed" : "active";

    if (isSupabaseConfigured && supabase) {
      await supabase.from("seasons").update({ status: newStatus }).eq("id", seasonId);
    } else {
      const updated = seasons.map((s) => (s.id === seasonId ? { ...s, status: newStatus as any } : s));
      setLocalStoreData("SEASONS", updated);
    }
    onRefresh();
  };

  const handleDeleteSeason = async (seasonId: string) => {
    if (seasons.length <= 1) {
      alert("At least one season must remain in the database.");
      return;
    }
    if (confirm("Are you sure you want to delete this season and all its records?")) {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("seasons").delete().eq("id", seasonId);
      } else {
        const updated = seasons.filter((s) => s.id !== seasonId);
        setLocalStoreData("SEASONS", updated);
      }
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Create Season Form */}
      <div className="glass-panel rounded-2xl p-6 border border-pubg-border h-fit">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pubg-gold/15 text-pubg-gold border border-pubg-gold/30">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Create New Season</h3>
            <p className="text-xs text-slate-400">Initialize a new tournament bracket</p>
          </div>
        </div>

        <form onSubmit={handleCreateSeason} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Season Name</label>
            <input
              type="text"
              placeholder="e.g. PMSC Season 3 - Regional Finals"
              value={newSeasonName}
              onChange={(e) => setNewSeasonName(e.target.value)}
              className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Number of Matches</label>
            <input
              type="number"
              min="0"
              max="20"
              value={matchCount}
              onChange={(e) => handleMatchCountChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
              placeholder="e.g. 5"
            />
          </div>

          {matchCount > 0 && (
            <div className="space-y-3 p-4 border border-pubg-border/50 rounded-xl bg-slate-900/30">
              <label className="block text-xs font-bold text-slate-300 uppercase">Map Configuration</label>
              {matchMaps.map((mapName, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-16">Match {idx + 1}</span>
                  <select
                    value={mapName}
                    onChange={(e) => {
                      const newMaps = [...matchMaps];
                      newMaps[idx] = e.target.value;
                      setMatchMaps(newMaps);
                    }}
                    className="flex-1 px-3 py-2 bg-pubg-card border border-pubg-border rounded-lg text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
                  >
                    {PRESET_MAPS.map((preset) => (
                      <option key={preset} value={preset}>{preset}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Initial Status</label>
            <select
              value={newSeasonStatus}
              onChange={(e) => setNewSeasonStatus(e.target.value as "active" | "completed")}
              className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
            >
              <option value="active">Active (Accepting Matches)</option>
              <option value="completed">Completed (Archived)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-pubg-gold text-slate-950 font-black text-sm uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-neon-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> {isSubmitting ? "Creating..." : "Create Season"}
          </button>
        </form>
      </div>

      {/* Season List */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-pubg-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pubg-orange/15 text-pubg-orange border border-pubg-orange/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Tournament Seasons</h3>
              <p className="text-xs text-slate-400">Total ({seasons.length}) seasons created</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="p-4 rounded-xl bg-pubg-card border border-pubg-border flex items-center justify-between hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-pubg-gold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{season.name}</h4>
                  <p className="text-xs text-slate-400">Created: {new Date(season.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {onManageSeason && (
                  <button
                    onClick={() => onManageSeason(season.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold uppercase border bg-pubg-gold/10 text-pubg-gold border-pubg-gold/30 hover:bg-pubg-gold hover:text-slate-950 transition-colors flex items-center gap-1.5"
                    title="Manage this Season's Teams and Matches"
                  >
                    <Settings className="w-3.5 h-3.5" /> Manage
                  </button>
                )}

                <button
                  onClick={() => toggleStatus(season.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border transition-colors flex items-center gap-1.5 ${
                    season.status === "active"
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {season.status === "active" ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" /> Completed
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeleteSeason(season.id)}
                  className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Delete Season"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
