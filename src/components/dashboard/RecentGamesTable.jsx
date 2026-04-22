import React, { useState } from "react";

export default function RecentGamesTable({ games, lang = "el" }) {
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  if (!games || games.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        {lang === "el" ? "Δεν υπάρχουν πρόσφατα παιχνίδια" : "No recent games"}
      </div>
    );
  }

  const sorted = [...games].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "date") cmp = new Date(a.date) - new Date(b.date);
    else if (sortBy === "score") cmp = (a.score / (a.total || 1)) - (b.score / (b.total || 1));
    else if (sortBy === "difficulty") cmp = (a.difficulty || 1) - (b.difficulty || 1);
    return sortDir === "desc" ? -cmp : cmp;
  });

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="text-slate-300 ml-1">↕</span>;
    return <span className="text-purple-500 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th
              className="text-left py-3 px-2 font-semibold text-slate-600 cursor-pointer hover:text-slate-800"
              onClick={() => handleSort("date")}
            >
              {lang === "el" ? "Ημερομηνία" : "Date"} <SortIcon col="date" />
            </th>
            <th className="text-left py-3 px-2 font-semibold text-slate-600">
              {lang === "el" ? "Παιχνίδι" : "Game"}
            </th>
            <th
              className="text-center py-3 px-2 font-semibold text-slate-600 cursor-pointer hover:text-slate-800"
              onClick={() => handleSort("score")}
            >
              {lang === "el" ? "Σκορ" : "Score"} <SortIcon col="score" />
            </th>
            <th
              className="text-center py-3 px-2 font-semibold text-slate-600 cursor-pointer hover:text-slate-800"
              onClick={() => handleSort("difficulty")}
            >
              {lang === "el" ? "Επίπεδο" : "Level"} <SortIcon col="difficulty" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((g, i) => {
            const pct = g.total > 0 ? Math.round((g.score / g.total) * 100) : 0;
            return (
              <tr
                key={`${g.date}-${i}`}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-2.5 px-2 text-slate-500">
                  {new Date(g.date).toLocaleDateString(lang === "el" ? "el-GR" : "en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-2.5 px-2 font-medium text-slate-700 truncate max-w-[150px]">
                  {g.gameId || g.title || "—"}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      pct >= 80
                        ? "bg-green-100 text-green-700"
                        : pct >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {g.score}/{g.total} ({pct}%)
                  </span>
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className="text-purple-600 font-semibold">{g.difficulty || 1}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
