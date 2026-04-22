import React from "react";

export default function StatCard({ icon, label, value, sublabel, gradient = "from-purple-500 to-pink-500" }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500 truncate">{label}</div>
        {sublabel && <div className="text-xs text-slate-400">{sublabel}</div>}
      </div>
    </div>
  );
}
