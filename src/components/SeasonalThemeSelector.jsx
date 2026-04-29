import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { SEASONAL_THEMES, SeasonalThemeService, detectAutoTheme } from "../services/SeasonalThemeService";

const T = {
  el: { title: "🎨 Εποχιακό Θέμα", desc: "Διάλεξε θέμα ή άστο σε αυτόματο", autoCurrent: "Αυτόματα: τώρα" },
  en: { title: "🎨 Seasonal Theme", desc: "Pick a theme or leave it on auto", autoCurrent: "Auto: now" },
};

export default function SeasonalThemeSelector() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [current, setCurrent] = useState(() => SeasonalThemeService.get());

  useEffect(() => {
    const handler = () => setCurrent(SeasonalThemeService.get());
    window.addEventListener("geo:seasonalThemeChange", handler);
    return () => window.removeEventListener("geo:seasonalThemeChange", handler);
  }, []);

  const auto = detectAutoTheme();
  const autoTheme = SEASONAL_THEMES.find(t => t.id === auto);

  const apply = (id) => {
    SeasonalThemeService.set(id);
    setCurrent(id);
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-1">{l.title}</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.desc}</p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {SEASONAL_THEMES.map(t => {
          const active = current === t.id;
          const isAuto = t.id === "auto";
          return (
            <button
              key={t.id}
              onClick={() => apply(t.id)}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition ${active ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md" : "border-slate-200 dark:border-slate-700 hover:border-purple-300"}`}
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">{t.name[lang] || t.name.en}</span>
              {isAuto && autoTheme && (
                <span className="text-[10px] text-slate-400 truncate">{l.autoCurrent} {autoTheme.icon}</span>
              )}
              {active && <span className="absolute top-1 right-1 text-[10px]">✓</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
