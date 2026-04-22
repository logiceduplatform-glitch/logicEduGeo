import React, { useContext, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { DigestService } from "../services/DigestService";

const T = {
  el: {
    title: "Εβδομαδιαίες Αναφορές Email",
    description: "Λάβε email με την πρόοδο του παιδιού σου",
    enable: "Ενεργοποίηση αναφορών email",
    email: "Email",
    frequency: "Συχνότητα",
    weekly: "Εβδομαδιαία",
    monthly: "Μηνιαία",
    saved: "Αποθηκεύτηκε!",
    save: "Αποθήκευση",
    comingSoon: "Η αποστολή email θα είναι σύντομα διαθέσιμη",
  },
  en: {
    title: "Weekly Email Reports",
    description: "Receive email updates about your child's progress",
    enable: "Enable email reports",
    email: "Email",
    frequency: "Frequency",
    weekly: "Weekly",
    monthly: "Monthly",
    saved: "Saved!",
    save: "Save",
    comingSoon: "Email delivery coming soon",
  },
};

export default function EmailDigestSettings() {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const [prefs, setPrefs] = useState(() => DigestService.getPreferences());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    DigestService.setPreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" aria-hidden="true">📧</span>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{l.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{l.description}</p>
        </div>
      </div>

      <label className="flex items-center gap-3 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={prefs.enabled}
          onChange={(e) => setPrefs({ ...prefs, enabled: e.target.checked })}
          className="w-4 h-4 rounded border-slate-300 text-purple-500 focus:ring-purple-400"
        />
        <span className="text-sm text-slate-700 dark:text-slate-300">{l.enable}</span>
      </label>

      {prefs.enabled && (
        <div className="space-y-3 ml-7">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">{l.email}</label>
            <input
              type="email"
              value={prefs.email}
              onChange={(e) => setPrefs({ ...prefs, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">{l.frequency}</label>
            <select
              value={prefs.frequency}
              onChange={(e) => setPrefs({ ...prefs, frequency: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            >
              <option value="weekly">{l.weekly}</option>
              <option value="monthly">{l.monthly}</option>
            </select>
          </div>

          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">{l.comingSoon}</p>
        </div>
      )}

      <button
        onClick={handleSave}
        className={`mt-4 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
          saved
            ? "bg-emerald-500 text-white"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {saved ? l.saved : l.save}
      </button>
    </div>
  );
}
