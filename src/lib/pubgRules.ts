import { PubgMapName } from "./types";

/**
 * Official PUBG Esports Placement Point Matrix
 */
export function getPlacementPoints(rank: number): number {
  if (rank === 1) return 10;
  if (rank === 2) return 6;
  if (rank === 3) return 5;
  if (rank === 4) return 4;
  if (rank === 5) return 3;
  if (rank === 6) return 2;
  if (rank === 7 || rank === 8) return 1;
  return 0;
}

export function computeTotalPoints(placementPts: number, killPts: number): number {
  return (placementPts || 0) + (killPts || 0);
}

export interface MapMetadata {
  name: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const PUBG_MAPS: MapMetadata[] = [
  {
    name: "Erangel",
    accentColor: "#10b981",
    badgeBg: "bg-emerald-950/80 border-emerald-500/30",
    badgeText: "text-emerald-400",
    description: "The Original Battleground - Grassy Woodlands & Urban Cities",
  },
  {
    name: "Miramar",
    accentColor: "#f59e0b",
    badgeBg: "bg-amber-950/80 border-amber-500/30",
    badgeText: "text-amber-400",
    description: "Desolate Desert Terrain - High Elevation & Long Range Combat",
  },
  {
    name: "Rondo",
    accentColor: "#ec4899",
    badgeBg: "bg-pink-950/80 border-pink-500/30",
    badgeText: "text-pink-400",
    description: "The Ground of Honor - Traditional Temples & Futuristic Metropolis",
  },
  {
    name: "Taego",
    accentColor: "#06b6d4",
    badgeBg: "bg-cyan-950/80 border-cyan-500/30",
    badgeText: "text-cyan-400",
    description: "8x8 Eastern Battleground - Multi-drop & Self AED",
  },
  {
    name: "Vikendi",
    accentColor: "#60a5fa",
    badgeBg: "bg-blue-950/80 border-blue-500/30",
    badgeText: "text-blue-400",
    description: "Snow-covered Subarctic Landscape - Cable Cars & Heavy Glaciers",
  },
  {
    name: "Sanhok",
    accentColor: "#22c55e",
    badgeBg: "bg-green-950/80 border-green-500/30",
    badgeText: "text-green-400",
    description: "Dense Tropical Jungle - Fast Paced Close Quarter Combat",
  },
  {
    name: "Karakin",
    accentColor: "#d97706",
    badgeBg: "bg-orange-950/80 border-orange-500/30",
    badgeText: "text-orange-400",
    description: "Dry Arid Island - Black Zone Demolition & Wall Penetration",
  },
  {
    name: "Livik",
    accentColor: "#a855f7",
    badgeBg: "bg-purple-950/80 border-purple-500/30",
    badgeText: "text-purple-400",
    description: "Nordic Mini Map - Waterfalls, Hot Springs & Rapid Action",
  },
  {
    name: "Paramo",
    accentColor: "#ef4444",
    badgeBg: "bg-red-950/80 border-red-500/30",
    badgeText: "text-red-400",
    description: "Volcano Highland - Dynamic Lava Rivers & Secret Rooms",
  },
  {
    name: "Nusa",
    accentColor: "#14b8a6",
    badgeBg: "bg-teal-950/80 border-teal-500/30",
    badgeText: "text-teal-400",
    description: "Resort Island - Ziplines & Elevator Combat",
  },
];

export function getMapInfo(mapName: string): MapMetadata {
  const found = PUBG_MAPS.find((m) => m.name.toLowerCase() === mapName.toLowerCase());
  return (
    found || {
      name: mapName,
      accentColor: "#f3af19",
      badgeBg: "bg-slate-800 border-slate-700",
      badgeText: "text-pubg-gold font-bold",
      description: "Custom Competitive PUBG Map",
    }
  );
}

export function getTeamLogoUrl(teamName: string, customLogo?: string): string {
  if (customLogo && customLogo.trim().length > 0) {
    return customLogo.trim();
  }
  const cleanName = encodeURIComponent(teamName.trim().toLowerCase());
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanName}&backgroundColor=121826,1f293d`;
}
