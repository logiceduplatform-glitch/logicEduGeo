import React, { useContext, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { COUNTRIES, CountryService } from "../config/countries";

const T = {
  el: { title: "🌍 Χώρα", desc: "Εμφανίζεται δίπλα από το όνομά σου σε κατατάξεις" },
  en: { title: "🌍 Country", desc: "Shown next to your name on leaderboards" },
};

export default function CountryPicker() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [code, setCode] = useState(() => CountryService.get());

  const handle = (e) => {
    const c = e.target.value;
    setCode(c);
    CountryService.set(c);
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{l.desc}</p>
        </div>
        <select
          value={code}
          onChange={handle}
          aria-label={l.title}
          className="px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-400"
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name[lang] || c.name.en}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
