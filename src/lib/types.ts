export type SeasonStatus = 'active' | 'completed';
export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'draft';
export type PubgMapName = 'Erangel' | 'Miramar' | 'Taego' | 'Vikendi' | 'Rondo';

export interface Season {
  id: string;
  name: string;
  status: SeasonStatus;
  created_at: string;
}

export interface Team {
  id: string;
  season_id: string;
  team_name: string;
  logo_url?: string;
  captain_name?: string;
  contact?: string;
  created_at: string;
}

export interface Match {
  id: string;
  season_id: string;
  match_number: number;
  map_name: PubgMapName | string;
  match_date: string;
  status: MatchStatus;
  is_published?: boolean;
  created_at?: string;
}

export interface MatchResult {
  id: string;
  match_id: string;
  team_id: string;
  placement_rank: number;
  placement_points: number;
  kill_points: number;
  total_points: number;
  created_at?: string;
}

export interface LeaderboardEntry {
  team: Team;
  matchesPlayed: number;
  wwcds: number; // Winner Winner Chicken Dinner count
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
  matchBreakdown: {
    matchNumber: number;
    mapName: string;
    placementRank: number;
    placementPoints: number;
    killPoints: number;
    totalPoints: number;
  }[];
}
