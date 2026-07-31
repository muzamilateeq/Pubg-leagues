import { Season, Team, Match, MatchResult } from "./types";
import { getPlacementPoints } from "./pubgRules";

export const INITIAL_SEASONS: Season[] = [
  {
    id: "season-1",
    name: "PUBG Global Championship 2026 - Season 1",
    status: "active",
    created_at: new Date("2026-01-10").toISOString(),
  },
  {
    id: "season-2",
    name: "PUBG Masters Series - Season 2",
    status: "active",
    created_at: new Date("2026-03-01").toISOString(),
  },
  {
    id: "season-3",
    name: "PUBG Continental Series 2025 (Legacy)",
    status: "completed",
    created_at: new Date("2025-11-15").toISOString(),
  },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: "team-1",
    season_id: "season-1",
    team_name: "FaZe Clan",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=fazeclan",
    captain_name: "Inonix",
    contact: "contact@fazeclan.com",
    created_at: new Date().toISOString(),
  },
  {
    id: "team-2",
    season_id: "season-1",
    team_name: "Natus Vincere",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=navi",
    captain_name: "ubah",
    contact: "info@navi.gg",
    created_at: new Date().toISOString(),
  },
  {
    id: "team-3",
    season_id: "season-1",
    team_name: "17 Gaming",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=17gaming",
    captain_name: "LilGhost",
    contact: "team17@esports.cn",
    created_at: new Date().toISOString(),
  },
  {
    id: "team-4",
    season_id: "season-1",
    team_name: "Soniqs",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=soniqs",
    captain_name: "hwinn",
    contact: "admin@soniqs.gg",
    created_at: new Date().toISOString(),
  },
  {
    id: "team-5",
    season_id: "season-1",
    team_name: "Twisted Minds",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=twistedminds",
    captain_name: "BatulinS",
    contact: "managers@twistedminds.com",
    created_at: new Date().toISOString(),
  },
  {
    id: "team-6",
    season_id: "season-1",
    team_name: "Gen.G Esports",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=geng",
    captain_name: "Pio",
    contact: "pubg@geng.gg",
    created_at: new Date().toISOString(),
  },
  {
    id: "team-7",
    season_id: "season-1",
    team_name: "Four Angry Men",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=4am",
    captain_name: "GodV",
    contact: "4am@esports.cn",
    created_at: new Date().toISOString(),
  },
  {
    id: "team-8",
    season_id: "season-1",
    team_name: "Danawa e-sports",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=danawa",
    captain_name: "seoul",
    contact: "danawa@pubgkorea.com",
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: "match-1",
    season_id: "season-1",
    match_number: 1,
    map_name: "Erangel",
    match_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "completed",
  },
  {
    id: "match-2",
    season_id: "season-1",
    match_number: 2,
    map_name: "Miramar",
    match_date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    status: "completed",
  },
  {
    id: "match-3",
    season_id: "season-1",
    match_number: 3,
    map_name: "Taego",
    match_date: new Date(Date.now() - 86400000).toISOString(),
    status: "completed",
  },
  {
    id: "match-4",
    season_id: "season-1",
    match_number: 4,
    map_name: "Vikendi",
    match_date: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: "completed",
  },
  {
    id: "match-5",
    season_id: "season-1",
    match_number: 5,
    map_name: "Rondo",
    match_date: new Date(Date.now() + 3600000 * 2).toISOString(),
    status: "live",
  },
];

export const INITIAL_MATCH_RESULTS: MatchResult[] = [
  // Match 1 (Erangel) - Winner: FaZe Clan
  { id: "mr-1-1", match_id: "match-1", team_id: "team-1", placement_rank: 1, placement_points: getPlacementPoints(1), kill_points: 12, total_points: getPlacementPoints(1) + 12 },
  { id: "mr-1-2", match_id: "match-1", team_id: "team-2", placement_rank: 2, placement_points: getPlacementPoints(2), kill_points: 7, total_points: getPlacementPoints(2) + 7 },
  { id: "mr-1-3", match_id: "match-1", team_id: "team-3", placement_rank: 3, placement_points: getPlacementPoints(3), kill_points: 5, total_points: getPlacementPoints(3) + 5 },
  { id: "mr-1-4", match_id: "match-1", team_id: "team-4", placement_rank: 4, placement_points: getPlacementPoints(4), kill_points: 4, total_points: getPlacementPoints(4) + 4 },
  { id: "mr-1-5", match_id: "match-1", team_id: "team-5", placement_rank: 5, placement_points: getPlacementPoints(5), kill_points: 3, total_points: getPlacementPoints(5) + 3 },
  { id: "mr-1-6", match_id: "match-1", team_id: "team-6", placement_rank: 6, placement_points: getPlacementPoints(6), kill_points: 2, total_points: getPlacementPoints(6) + 2 },
  { id: "mr-1-7", match_id: "match-1", team_id: "team-7", placement_rank: 7, placement_points: getPlacementPoints(7), kill_points: 1, total_points: getPlacementPoints(7) + 1 },
  { id: "mr-1-8", match_id: "match-1", team_id: "team-8", placement_rank: 8, placement_points: getPlacementPoints(8), kill_points: 0, total_points: getPlacementPoints(8) + 0 },

  // Match 2 (Miramar) - Winner: 17 Gaming
  { id: "mr-2-3", match_id: "match-2", team_id: "team-3", placement_rank: 1, placement_points: getPlacementPoints(1), kill_points: 14, total_points: getPlacementPoints(1) + 14 },
  { id: "mr-2-5", match_id: "match-2", team_id: "team-5", placement_rank: 2, placement_points: getPlacementPoints(2), kill_points: 9, total_points: getPlacementPoints(2) + 9 },
  { id: "mr-2-1", match_id: "match-2", team_id: "team-1", placement_rank: 3, placement_points: getPlacementPoints(3), kill_points: 8, total_points: getPlacementPoints(3) + 8 },
  { id: "mr-2-4", match_id: "match-2", team_id: "team-4", placement_rank: 4, placement_points: getPlacementPoints(4), kill_points: 6, total_points: getPlacementPoints(4) + 6 },
  { id: "mr-2-2", match_id: "match-2", team_id: "team-2", placement_rank: 5, placement_points: getPlacementPoints(5), kill_points: 4, total_points: getPlacementPoints(5) + 4 },
  { id: "mr-2-8", match_id: "match-2", team_id: "team-8", placement_rank: 6, placement_points: getPlacementPoints(6), kill_points: 3, total_points: getPlacementPoints(6) + 3 },
  { id: "mr-2-6", match_id: "match-2", team_id: "team-6", placement_rank: 7, placement_points: getPlacementPoints(7), kill_points: 2, total_points: getPlacementPoints(7) + 2 },
  { id: "mr-2-7", match_id: "match-2", team_id: "team-7", placement_rank: 8, placement_points: getPlacementPoints(8), kill_points: 1, total_points: getPlacementPoints(8) + 1 },

  // Match 3 (Taego) - Winner: NAVI
  { id: "mr-3-2", match_id: "match-3", team_id: "team-2", placement_rank: 1, placement_points: getPlacementPoints(1), kill_points: 15, total_points: getPlacementPoints(1) + 15 },
  { id: "mr-3-4", match_id: "match-3", team_id: "team-4", placement_rank: 2, placement_points: getPlacementPoints(2), kill_points: 10, total_points: getPlacementPoints(2) + 10 },
  { id: "mr-3-1", match_id: "match-3", team_id: "team-1", placement_rank: 3, placement_points: getPlacementPoints(3), kill_points: 6, total_points: getPlacementPoints(3) + 6 },
  { id: "mr-3-3", match_id: "match-3", team_id: "team-3", placement_rank: 4, placement_points: getPlacementPoints(4), kill_points: 5, total_points: getPlacementPoints(4) + 5 },
  { id: "mr-3-5", match_id: "match-3", team_id: "team-5", placement_rank: 5, placement_points: getPlacementPoints(5), kill_points: 4, total_points: getPlacementPoints(5) + 4 },
  { id: "mr-3-7", match_id: "match-3", team_id: "team-7", placement_rank: 6, placement_points: getPlacementPoints(6), kill_points: 3, total_points: getPlacementPoints(6) + 3 },
  { id: "mr-3-6", match_id: "match-3", team_id: "team-6", placement_rank: 7, placement_points: getPlacementPoints(7), kill_points: 2, total_points: getPlacementPoints(7) + 2 },
  { id: "mr-3-8", match_id: "match-3", team_id: "team-8", placement_rank: 8, placement_points: getPlacementPoints(8), kill_points: 1, total_points: getPlacementPoints(8) + 1 },

  // Match 4 (Vikendi) - Winner: Soniqs
  { id: "mr-4-4", match_id: "match-4", team_id: "team-4", placement_rank: 1, placement_points: getPlacementPoints(1), kill_points: 11, total_points: getPlacementPoints(1) + 11 },
  { id: "mr-4-1", match_id: "match-4", team_id: "team-1", placement_rank: 2, placement_points: getPlacementPoints(2), kill_points: 9, total_points: getPlacementPoints(2) + 9 },
  { id: "mr-4-5", match_id: "match-4", team_id: "team-5", placement_rank: 3, placement_points: getPlacementPoints(3), kill_points: 7, total_points: getPlacementPoints(3) + 7 },
  { id: "mr-4-3", match_id: "match-4", team_id: "team-3", placement_rank: 4, placement_points: getPlacementPoints(4), kill_points: 4, total_points: getPlacementPoints(4) + 4 },
  { id: "mr-4-2", match_id: "match-4", team_id: "team-2", placement_rank: 5, placement_points: getPlacementPoints(5), kill_points: 3, total_points: getPlacementPoints(5) + 3 },
  { id: "mr-4-8", match_id: "match-4", team_id: "team-8", placement_rank: 6, placement_points: getPlacementPoints(6), kill_points: 2, total_points: getPlacementPoints(6) + 2 },
  { id: "mr-4-6", match_id: "match-4", team_id: "team-6", placement_rank: 7, placement_points: getPlacementPoints(7), kill_points: 1, total_points: getPlacementPoints(7) + 1 },
  { id: "mr-4-7", match_id: "match-4", team_id: "team-7", placement_rank: 8, placement_points: getPlacementPoints(8), kill_points: 0, total_points: getPlacementPoints(8) + 0 },
];
