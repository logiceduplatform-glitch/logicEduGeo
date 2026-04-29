import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";
import { FeatureFlagService, DEFAULT_FLAGS } from "../../services/FeatureFlagService";

const T = {
  el: {
    title: "🎛️ Feature Flags",
    subtitle: "Ενεργοποίησε/Απενεργοποίησε λειτουργίες της πλατφόρμας",
    refresh: "🔄 Ανανέωση",
    enabled: "Ενεργό",
    disabled: "Ανενεργό",
    note: "💡 Οι αλλαγές προπαγανδίζονται σε όλους τους χρήστες μετά την επόμενη φόρτωση της σελίδας.",
    saving: "Αποθήκευση...",
    saved: "✓ Αποθηκεύτηκε",
    enableAll: "✅ Όλα ON",
    disableAll: "⏸️ Όλα OFF",
    flags: "λειτουργίες",
    onCount: "{n}/{t} ενεργές",
    search: "Αναζήτηση...",
    expandAll: "Άνοιγμα όλων",
    collapseAll: "Κλείσιμο όλων",
    confirmBulk: "Επιβεβαίωση: αλλαγή σε όλες τις λειτουργίες της κατηγορίας;",
  },
  en: {
    title: "🎛️ Feature Flags",
    subtitle: "Toggle platform features on/off",
    refresh: "🔄 Refresh",
    enabled: "Enabled",
    disabled: "Disabled",
    note: "💡 Changes propagate to all users on next page load.",
    saving: "Saving...",
    saved: "✓ Saved",
    enableAll: "✅ All ON",
    disableAll: "⏸️ All OFF",
    flags: "flags",
    onCount: "{n}/{t} on",
    search: "Search...",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    confirmBulk: "Confirm: change all flags in this category?",
  },
};

const CATEGORY_LABELS = {
  subscriptions:    { el: "💎 Συνδρομές & Πλάνα", en: "💎 Subscriptions & Plans" },
  games_age_2_3:    { el: "🎮 Παιχνίδια · 2-3 ετών", en: "🎮 Games · Age 2-3" },
  games_age_4_5:    { el: "🎮 Παιχνίδια · 4-5 ετών", en: "🎮 Games · Age 4-5" },
  games_age_6:      { el: "🎮 Παιχνίδια · 6 ετών", en: "🎮 Games · Age 6" },
  games_age_7_8:    { el: "🎮 Παιχνίδια · 7-8 ετών", en: "🎮 Games · Age 7-8" },
  games_age_9_10:   { el: "🎮 Παιχνίδια · 9-10 ετών", en: "🎮 Games · Age 9-10" },
  games_age_11_12:  { el: "🎮 Παιχνίδια · 11-12 ετών", en: "🎮 Games · Age 11-12" },
  games_age_adult:  { el: "🎮 Παιχνίδια · Ενήλικες", en: "🎮 Games · Adults" },
  students:  { el: "👦 Λειτουργίες Μαθητών", en: "👦 Student Features" },
  ai:        { el: "🤖 AI & Voice", en: "🤖 AI & Voice" },
  progress:  { el: "📊 Πρόοδος & Συναγωνισμός", en: "📊 Progress & Competition" },
  teachers:  { el: "👨‍🏫 Δάσκαλοι", en: "👨‍🏫 Teachers" },
  parents:   { el: "👨‍👩‍👧 Γονείς", en: "👨‍👩‍👧 Parents" },
  marketing: { el: "📈 Marketing", en: "📈 Marketing" },
};

// Order categories for display
const CATEGORY_ORDER = [
  "subscriptions",
  "games_age_2_3",
  "games_age_4_5",
  "games_age_6",
  "games_age_7_8",
  "games_age_9_10",
  "games_age_11_12",
  "games_age_adult",
  "students",
  "ai",
  "progress",
  "teachers",
  "parents",
  "marketing",
];

export default function AdminFlags() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [flags, setFlags] = useState({});
  const [busy, setBusy] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const load = async () => {
    await FeatureFlagService.init();
    setFlags(FeatureFlagService.getAll());
  };

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const out = {};
    for (const [id, f] of Object.entries(flags)) {
      const cat = f.category || "other";
      if (!out[cat]) out[cat] = [];
      out[cat].push({ id, ...f });
    }
    return out;
  }, [flags]);

  const toggle = async (id, current) => {
    setBusy(id);
    try {
      await AdminService.setFlag(id, !current);
      await load();
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
          <p className="text-sm text-slate-500">{l.subtitle}</p>
        </div>
        <button onClick={load} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50">{l.refresh}</button>
      </div>

      <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-6">{l.note}</p>

      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{CATEGORY_LABELS[cat]?.[lang] || CATEGORY_LABELS[cat]?.en || cat}</h3>
            </header>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.map((f) => {
                const label = f.label?.[lang] || f.label?.en || f.id;
                return (
                  <li key={f.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{label}</p>
                      <p className="text-xs text-slate-500 font-mono">{f.id}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {savedId === f.id && <span className="text-[10px] font-bold text-emerald-600">{l.saved}</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.enabled ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                        {f.enabled ? l.enabled : l.disabled}
                      </span>
                      <Toggle on={f.enabled} disabled={busy === f.id} onClick={() => toggle(f.id, f.enabled)} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on, disabled, onClick }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${on ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"} ${disabled ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
