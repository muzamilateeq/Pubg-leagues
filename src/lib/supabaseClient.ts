import { createClient } from "@supabase/supabase-js";
import { Season, Team, Match, MatchResult, LeaderboardEntry } from "./types";
import { INITIAL_SEASONS, INITIAL_TEAMS, INITIAL_MATCHES, INITIAL_MATCH_RESULTS } from "./mockData";
import { getPlacementPoints } from "./pubgRules";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Storage Keys for offline / preview fallback mode
const STORAGE_KEYS = {
  SEASONS: "pubg_seasons_v1",
  TEAMS: "pubg_teams_v1",
  MATCHES: "pubg_matches_v1",
  RESULTS: "pubg_results_v1",
};

/**
 * Initialize local storage seed data if empty
 */
export function getLocalStoreData() {
  if (typeof window === "undefined") {
    return {
      seasons: INITIAL_SEASONS,
      teams: INITIAL_TEAMS,
      matches: INITIAL_MATCHES,
      results: INITIAL_MATCH_RESULTS,
    };
  }

  try {
    const rawSeasons = localStorage.getItem(STORAGE_KEYS.SEASONS);
    const rawTeams = localStorage.getItem(STORAGE_KEYS.TEAMS);
    const rawMatches = localStorage.getItem(STORAGE_KEYS.MATCHES);
    const rawResults = localStorage.getItem(STORAGE_KEYS.RESULTS);

    let seasons: Season[] = rawSeasons ? JSON.parse(rawSeasons) : INITIAL_SEASONS;
    let teams: Team[] = rawTeams ? JSON.parse(rawTeams) : INITIAL_TEAMS;
    let matches: Match[] = rawMatches ? JSON.parse(rawMatches) : INITIAL_MATCHES;
    let results: MatchResult[] = rawResults ? JSON.parse(rawResults) : INITIAL_MATCH_RESULTS;

    // Clean out old testing seasons from cache
    seasons = seasons.filter((s) => s.name && !s.name.toLowerCase().includes("testiing") && !s.name.toLowerCase().includes("testing"));
    if (seasons.length === 0) {
      seasons = INITIAL_SEASONS;
      localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(seasons));
    }

    // Refresh if cached team count is less than initial seed
    if (teams.length < INITIAL_TEAMS.length) {
      const primarySeasonId = seasons[0]?.id || "season-1";
      teams = INITIAL_TEAMS.map((t) => ({ ...t, season_id: primarySeasonId }));
      matches = INITIAL_MATCHES.map((m) => ({ ...m, season_id: primarySeasonId }));
      results = INITIAL_MATCH_RESULTS;
      
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
    }

    if (!rawSeasons) localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(seasons));
    if (!rawTeams) localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    if (!rawMatches) localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    if (!rawResults) localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));

    return { seasons, teams, matches, results };
  } catch (err) {
    console.error("Local storage error, using mock defaults:", err);
    return {
      seasons: INITIAL_SEASONS,
      teams: INITIAL_TEAMS,
      matches: INITIAL_MATCHES,
      results: INITIAL_MATCH_RESULTS,
    };
  }
}

export function setLocalStoreData(key: keyof typeof STORAGE_KEYS, value: any) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
      window.dispatchEvent(new Event("pubg_store_update"));
    } catch (e) {
      console.error("Failed to write to local storage", e);
    }
  }
}

// Async Helper: Save Season (Supabase DB + Local Storage Sync)
export async function dbSaveSeason(season: Partial<Season> & { name: string; status: string }) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("seasons").insert([season]).select();
    if (error) console.error("Supabase insert season error:", error);
    return data;
  }
  const current = getLocalStoreData().seasons;
  const newSeason: Season = {
    id: "season-" + Date.now(),
    name: season.name,
    status: (season.status as any) || "active",
    created_at: new Date().toISOString(),
  };
  setLocalStoreData("SEASONS", [newSeason, ...current]);
  return [newSeason];
}

// Async Helper: Save Team
export async function dbSaveTeam(team: Partial<Team> & { season_id: string; team_name: string }) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("teams").insert([team]).select();
    if (error) console.error("Supabase insert team error:", error);
    return data;
  }
  const current = getLocalStoreData().teams;
  const newTeam: Team = {
    id: "team-" + Date.now(),
    season_id: team.season_id,
    team_name: team.team_name,
    logo_url: team.logo_url,
    captain_name: team.captain_name,
    contact: team.contact,
    created_at: new Date().toISOString(),
  };
  setLocalStoreData("TEAMS", [newTeam, ...current]);
  return [newTeam];
}

// Async Helper: Save Match
export async function dbSaveMatch(match: Partial<Match> & { season_id: string; match_number: number; map_name: string }) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("matches").insert([match]).select();
    if (error) console.error("Supabase insert match error:", error);
    return data;
  }
  const current = getLocalStoreData().matches;
  const newMatch: Match = {
    id: "match-" + Date.now(),
    season_id: match.season_id,
    match_number: match.match_number,
    map_name: match.map_name,
    match_date: match.match_date || new Date().toISOString(),
    status: (match.status as any) || "completed",
  };
  setLocalStoreData("MATCHES", [newMatch, ...current]);
  return [newMatch];
}

// Async Helper: Upsert Match Results
export async function dbSaveMatchResults(matchId: string, resultsPayload: Array<{ team_id: string; placement_rank: number; placement_points: number; kill_points: number }>) {
  if (isSupabaseConfigured && supabase) {
    const insertPayload = resultsPayload.map((r) => ({
      match_id: matchId,
      team_id: r.team_id,
      placement_rank: r.placement_rank,
      placement_points: r.placement_points,
      kill_points: r.kill_points,
    }));
    const { data, error } = await supabase.from("match_results").upsert(insertPayload, { onConflict: "match_id,team_id" });
    if (error) console.error("Supabase upsert results error:", error);
    return data;
  }
  const currentResults = getLocalStoreData().results.filter((r) => r.match_id !== matchId);
  const newResults: MatchResult[] = resultsPayload.map((r) => ({
    id: `mr-${matchId}-${r.team_id}`,
    match_id: matchId,
    team_id: r.team_id,
    placement_rank: r.placement_rank,
    placement_points: r.placement_points,
    kill_points: r.kill_points,
    total_points: r.placement_points + r.kill_points,
    created_at: new Date().toISOString(),
  }));
  setLocalStoreData("RESULTS", [...currentResults, ...newResults]);
  return newResults;
}

/**
 * Compute Leaderboard Standings
 * Sorted by: Total Points -> WWCDs (Wins) -> Kill Points -> Placement Points
 */
export function computeLeaderboard(
  seasonId: string,
  allTeams: Team[],
  allMatches: Match[],
  allResults: MatchResult[]
): LeaderboardEntry[] {
  // 1. Filter teams & matches for the target seasonId
  let seasonTeams = allTeams.filter((t) => t.season_id === seasonId);
  let seasonMatches = allMatches.filter(
    (m) => m.season_id === seasonId && m.status !== "upcoming" && m.is_published !== false
  );

  const seasonMatchIds = new Set(seasonMatches.map((m) => m.id));

  const leaderboardMap: Map<string, LeaderboardEntry> = new Map();

  seasonTeams.forEach((team) => {
    leaderboardMap.set(team.id, {
      team,
      matchesPlayed: 0,
      wwcds: 0,
      placementPoints: 0,
      killPoints: 0,
      totalPoints: 0,
      matchBreakdown: [],
    });
  });

  allResults.forEach((res) => {
    if (!seasonMatchIds.has(res.match_id)) return;
    const entry = leaderboardMap.get(res.team_id);
    if (!entry) return;

    const match = seasonMatches.find((m) => m.id === res.match_id);
    if (!match) return;

    entry.matchesPlayed += 1;
    if (res.placement_rank === 1) {
      entry.wwcds += 1;
    }

    const calcPlacement = res.placement_points ?? getPlacementPoints(res.placement_rank);
    const calcKill = res.kill_points ?? 0;
    const calcTotal = calcPlacement + calcKill;

    entry.placementPoints += calcPlacement;
    entry.killPoints += calcKill;
    entry.totalPoints += calcTotal;

    entry.matchBreakdown.push({
      matchNumber: match.match_number,
      mapName: match.map_name,
      placementRank: res.placement_rank,
      placementPoints: calcPlacement,
      killPoints: calcKill,
      totalPoints: calcTotal,
    });
  });

  const standings = Array.from(leaderboardMap.values());
  standings.forEach((s) => {
    s.matchBreakdown.sort((a, b) => a.matchNumber - b.matchNumber);
  });

  standings.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.wwcds !== a.wwcds) return b.wwcds - a.wwcds;
    if (b.killPoints !== a.killPoints) return b.killPoints - a.killPoints;
    return b.placementPoints - a.placementPoints;
  });

  return standings;
}
