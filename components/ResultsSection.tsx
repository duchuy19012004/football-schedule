"use client";

import { useState, useMemo } from "react";
import { MatchEvent, VIETNAM_TEAM_ID } from "@/types/match";
import { getMatchResult } from "@/lib/utils";
import MatchList from "./MatchList";

type FilterOption = "all" | "win" | "draw" | "lose";

interface ResultsSectionProps {
  matches: MatchEvent[];
  title: string;
  emptyMessage: string;
}

const FILTERS: { key: FilterOption; label: string; color: string; activeClass: string }[] = [
  { key: "all",  label: "Tất cả", color: "gray",  activeClass: "bg-gray-700 text-white border-gray-600" },
  { key: "win",  label: "Thắng",  color: "green", activeClass: "bg-green-500/20 text-green-400 border-green-500/50" },
  { key: "draw", label: "Hòa",    color: "yellow", activeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" },
  { key: "lose", label: "Thua",   color: "red",   activeClass: "bg-red-500/20 text-red-400 border-red-500/50" },
];

export default function ResultsSection({ matches, title, emptyMessage }: ResultsSectionProps) {
  const [active, setActive] = useState<FilterOption>("all");

  const filtered = useMemo(() => {
    if (active === "all") return matches;
    return matches.filter((match) => {
      if (match.intHomeScore === null || match.intAwayScore === null) return false;
      const isHome = match.idHomeTeam === VIETNAM_TEAM_ID;
      const result = getMatchResult(match.intHomeScore, match.intAwayScore, isHome);
      return result === active;
    });
  }, [matches, active]);

  const counts = useMemo(() => {
    const win  = matches.filter((m) => m.intHomeScore !== null && m.intAwayScore !== null && getMatchResult(m.intHomeScore, m.intAwayScore, m.idHomeTeam === VIETNAM_TEAM_ID) === "win").length;
    const draw = matches.filter((m) => m.intHomeScore !== null && m.intAwayScore !== null && getMatchResult(m.intHomeScore, m.intAwayScore, m.idHomeTeam === VIETNAM_TEAM_ID) === "draw").length;
    const lose = matches.filter((m) => m.intHomeScore !== null && m.intAwayScore !== null && getMatchResult(m.intHomeScore, m.intAwayScore, m.idHomeTeam === VIETNAM_TEAM_ID) === "lose").length;
    return { win, draw, lose };
  }, [matches]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h2>
        <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
          {filtered.length} trận
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
              ${f.key === active
                ? f.activeClass
                : "bg-gray-800/50 text-gray-400 border-gray-700/50 hover:bg-gray-700 hover:text-gray-200"
              }
            `}
          >
            {f.label}{" "}
            {f.key === "all" ? matches.length : counts[f.key]}
          </button>
        ))}
      </div>

      <MatchList
        matches={filtered}
        title=""
        emptyMessage={active === "all" ? emptyMessage : "Không có trận nào"}
      />
    </section>
  );
}
