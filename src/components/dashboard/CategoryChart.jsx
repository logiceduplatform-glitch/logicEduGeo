import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CategoryChart({ data, lang = "el" }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        {lang === "el" ? "Δεν υπάρχουν δεδομένα ακόμα" : "No data yet"}
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey="correct"
            name={lang === "el" ? "Σωστά" : "Correct"}
            fill="#a855f7"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="games"
            name={lang === "el" ? "Παιχνίδια" : "Games"}
            fill="#ec4899"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
