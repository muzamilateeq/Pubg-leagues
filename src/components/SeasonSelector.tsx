"use client";

import { Season } from "@/lib/types";
import { ChevronDown, Calendar, CheckCircle, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeasonId: string;
  onSelectSeason: (id: string) => void;
}

export default function SeasonSelector({
  seasons,
  selectedSeasonId,
  onSelectSeason,
}: SeasonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSeason = seasons.find((s) => s.id === selectedSeasonId) || seasons[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        Select Tournament Season
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-80 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-pubg-card border border-pubg-border text-left hover:border-pubg-gold/50 transition-all shadow-md group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-lg bg-pubg-gold/10 text-pubg-gold border border-pubg-gold/20 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-white text-sm truncate">{currentSeason?.name || "Select Season"}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              {currentSeason?.status === "active" ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle className="w-3 h-3" /> Active Season
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Clock className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-pubg-gold" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 rounded-xl bg-pubg-card border border-pubg-border shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
            {seasons.map((season) => {
              const isSelected = season.id === selectedSeasonId;
              return (
                <button
                  key={season.id}
                  onClick={() => {
                    onSelectSeason(season.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                    isSelected
                      ? "bg-pubg-gold/15 border border-pubg-gold/40 text-white font-bold"
                      : "hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="text-sm font-semibold truncate">{season.name}</div>
                    <div className="text-xs text-slate-400 font-normal">
                      Created: {new Date(season.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border ${
                      season.status === "active"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {season.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
