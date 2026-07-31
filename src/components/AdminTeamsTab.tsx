"use client";

import { useState } from "react";
import { Team, Season } from "@/lib/types";
import { getTeamLogoUrl } from "@/lib/pubgRules";
import { dbSaveTeam, setLocalStoreData, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { Users, UserPlus, Trash2, Shield, User, Mail, Sparkles } from "lucide-react";

interface AdminTeamsTabProps {
  teams: Team[];
  seasons: Season[];
  activeSeasonId: string;
  onRefresh: () => void;
}

export default function AdminTeamsTab({
  teams,
  seasons,
  activeSeasonId,
  onRefresh,
}: AdminTeamsTabProps) {
  const [teamName, setTeamName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [contact, setContact] = useState("");
  const [targetSeasonId, setTargetSeasonId] = useState(activeSeasonId);

  const [filterSeasonId, setFilterSeasonId] = useState(activeSeasonId);

  const handleRegisterTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    await dbSaveTeam({
      season_id: targetSeasonId,
      team_name: teamName.trim(),
      logo_url: logoUrl.trim() || undefined,
      captain_name: captainName.trim() || undefined,
      contact: contact.trim() || undefined,
    });

    setTeamName("");
    setLogoUrl("");
    setCaptainName("");
    setContact("");
    onRefresh();
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("teams").delete().eq("id", teamId);
      } else {
        const updated = teams.filter((t) => t.id !== teamId);
        setLocalStoreData("TEAMS", updated);
      }
      onRefresh();
    }
  };

  const filteredTeams = teams.filter((t) => t.season_id === filterSeasonId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Team Registration Form */}
      <div className="glass-panel rounded-2xl p-6 border border-pubg-border h-fit">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-pubg-gold/15 text-pubg-gold border border-pubg-gold/30">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Register New Team</h3>
            <p className="text-xs text-slate-400">Map team to tournament season</p>
          </div>
        </div>

        <form onSubmit={handleRegisterTeam} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Season Assignment</label>
            <select
              value={targetSeasonId}
              onChange={(e) => setTargetSeasonId(e.target.value)}
              className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Team Name *</label>
            <input
              type="text"
              placeholder="e.g. Soniqs Esports"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Logo URL <span className="text-slate-500 font-normal">(Optional - auto avatar generated if empty)</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Captain Name</label>
              <input
                type="text"
                placeholder="e.g. hwinn"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Contact Email</label>
              <input
                type="text"
                placeholder="team@esports.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-2.5 bg-pubg-card border border-pubg-border rounded-xl text-sm text-white focus:outline-none focus:border-pubg-gold transition-colors"
              />
            </div>
          </div>

          {/* Logo Preview */}
          {teamName && (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <img
                src={getTeamLogoUrl(teamName, logoUrl)}
                alt="Preview"
                className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-700"
              />
              <div>
                <p className="text-xs font-bold text-slate-200">Generated Badge Preview</p>
                <p className="text-[11px] text-slate-400">Ready to save</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-pubg-gold text-slate-950 font-black text-sm uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-neon-gold flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Save Team Registration
          </button>
        </form>
      </div>

      {/* Registered Teams Grid */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-pubg-border">
        
        {/* Header with Season Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pubg-orange/15 text-pubg-orange border border-pubg-orange/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Registered Teams</h3>
              <p className="text-xs text-slate-400">Total ({filteredTeams.length}) teams in season</p>
            </div>
          </div>

          <div className="w-full sm:w-60">
            <select
              value={filterSeasonId}
              onChange={(e) => setFilterSeasonId(e.target.value)}
              className="w-full px-3 py-2 bg-pubg-card border border-pubg-border rounded-xl text-xs text-white focus:outline-none focus:border-pubg-gold"
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  Filter: {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeams.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-slate-500 font-medium bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
              No teams registered for this season yet.
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-xl bg-pubg-card border border-pubg-border flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={getTeamLogoUrl(team.team_name, team.logo_url)}
                      alt={team.team_name}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getTeamLogoUrl(team.team_name);
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{team.team_name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-pubg-gold" /> Cap: {team.captain_name || "N/A"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Delete Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
