import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { getPet, getPetCurrentStage, getPetMood } from "../config/petConfig";

export default function PetWidget() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [pet, setPet] = useState(() => getPet());

  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = getPet();
      setPet(fresh ? { ...fresh } : null);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!pet) {
    return (
      <button onClick={() => navigate("/pet")} className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl p-4 border-2 border-dashed border-pink-300 dark:border-pink-700 hover:scale-[1.02] transition-all w-full text-center">
        <div className="text-3xl mb-1">🥚</div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{isEl ? "Υιοθέτησε κατοικίδιο!" : "Adopt a pet!"}</p>
      </button>
    );
  }

  const stage = getPetCurrentStage(pet);
  const mood = getPetMood(pet);
  const needsAttention = pet.hunger < 30 || pet.happiness < 30;

  return (
    <button onClick={() => navigate("/pet")} className={`relative bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 ${needsAttention ? "border-red-300 dark:border-red-700 animate-pulse" : "border-slate-100 dark:border-slate-700"} hover:scale-[1.02] transition-all w-full shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className="text-4xl">{stage.emoji}</div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-800 dark:text-white truncate">{pet.name}</span>
            <span className="text-sm">{mood.emoji}</span>
          </div>
          <div className="flex gap-1 mt-1">
            <Mini icon="🍎" value={pet.hunger} />
            <Mini icon="❤️" value={pet.happiness} />
            <Mini icon="⚡" value={pet.energy} />
          </div>
        </div>
      </div>
      {needsAttention && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">!</span>
      )}
    </button>
  );
}

function Mini({ icon, value }) {
  const cls = value < 30 ? "bg-red-100 dark:bg-red-900/30" : value < 60 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30";
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cls} flex items-center gap-0.5`}>
      <span>{icon}</span>
      <span className="font-bold">{Math.round(value)}</span>
    </span>
  );
}
