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
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(() => {
    // By default collapse all game-related categories (lots of flags)
    const init = {};
    for (const c of CATEGORY_ORDER) {
      if (c.startsWith("games_age_")) init[c] = true;
    }
    return init;
  });

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

  // Apply search filter
  const filteredCats = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = [];
    const seenCats = new Set();

    // Process in defined order first
    for (const cat of CATEGORY_ORDER) {
      if (!grouped[cat]) continue;
      const items = q
        ? grouped[cat].filter((f) => {
            const label = (f.label?.[lang] || f.label?.en || "").toLowerCase();
            return label.includes(q) || f.id.toLowerCase().includes(q);
          })
        : grouped[cat];
      if (items.length > 0) {
        result.push([cat, items]);
        seenCats.add(cat);
      }
    }
    // Add any unknown categories at end
    for (const cat of Object.keys(grouped)) {
      if (seenCats.has(cat)) continue;
      const items = q
        ? grouped[cat].filter((f) => {
            const label = (f.label?.[lang] || f.label?.en || "").toLowerCase();
            return label.includes(q) || f.id.toLowerCase().includes(q);
          })
        : grouped[cat];
      if (items.length > 0) result.push([cat, items]);
    }
    return result;
  }, [grouped, search, lang]);

  const totalOn = useMemo(() => Object.values(flags).filter((f) => f.enabled).length, [flags]);
  const totalAll = Object.keys(flags).length;

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

  const bulkToggle = async (cat, items, enable) => {
    if (!window.confirm(l.confirmBulk)) return;
    setBusy("bulk_" + cat);
    try {
      for (const item of items) {
        if (item.enabled !== enable) {
          await AdminService.setFlag(item.id, enable);
        }
      }
      await load();
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(null);
  };

  const expandAll = () => {
    const next = {};
    for (const c of CATEGORY_ORDER) next[c] = false;
    setCollapsed(next);
  };
  const collapseAll = () => {
    const next = {};
    for (const c of CATEGORY_ORDER) next[c] = true;
    setCollapsed(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
          <p className="text-sm text-slate-500">{l.subtitle} · <strong>{l.onCount.replace("{n}", totalOn).replace("{t}", totalAll)}</strong></p>
        </div>
        <div className="flex gap-2">
          <button onClick={expandAll} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{l.expandAll}</button>
          <button onClick={collapseAll} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{l.collapseAll}</button>
          <button onClick={load} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50">{l.refresh}</button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={l.search}
        aria-label={l.search}
        className="w-full mb-3 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-400"
      />

      <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-6">{l.note}</p>

      <div className="space-y-3">
        {filteredCats.map(([cat, items]) => {
          const isCollapsed = !!collapsed[cat] && !search.trim();
          const onItems = items.filter((f) => f.enabled).length;
          const bulkBusy = busy === "bulk_" + cat;
          return (
            <section key={cat} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
                <button
                  onClick={() => setCollapsed((c) => ({ ...c, [cat]: !c[cat] }))}
                  className="flex items-center gap-2 text-left flex-1 min-w-0"
                  aria-expanded={!isCollapsed}
                >
                  <span className={`text-xs transition-transform ${isCollapsed ? "" : "rotate-90"}`}>▶</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{CATEGORY_LABELS[cat]?.[lang] || CATEGORY_LABELS[cat]?.en || cat}</h3>
                  <span className="text-xs text-slate-500 shrink-0">({l.onCount.replace("{n}", onItems).replace("{t}", items.length)})</span>
                </button>
                <div className="flex gap-1 shrink-0">
                  <button
                    disabled={bulkBusy || onItems === items.length}
                    onClick={() => bulkToggle(cat, items, true)}
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 disabled:opacity-30"
                  >
                    {l.enableAll}
                  </button>
                  <button
                    disabled={bulkBusy || onItems === 0}
                    onClick={() => bulkToggle(cat, items, false)}
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-30"
                  >
                    {l.disableAll}
                  </button>
                </div>
              </header>
              {!isCollapsed && (
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
              )}
            </section>
          );
        })}
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
