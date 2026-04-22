import React from "react";
import { LanguageContext } from "../../i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = React.useContext(LanguageContext);

  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-xs text-slate-600 dark:text-slate-400">{lang === "el" ? "Γλώσσα" : "Language"}</label>
      <select
        className="text-sm border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 bg-white dark:bg-slate-800 dark:text-white"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value="el">Ελληνικά</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}