import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { PremiumContentService, PREMIUM_ITEMS } from "../../services/PremiumContentService";
import { FeatureFlagService } from "../../services/FeatureFlagService";

const T = {
  el: {
    title: "💎 Premium Content",
    subtitle: "Επίλεξε ποιά παιχνίδια & λειτουργίες θα είναι μόνο για Premium χρήστες",
    note: "💡 Όταν είναι ενεργό, οι free χρήστες βλέπουν οθόνη αναβάθμισης σε Premium. Αν το σύστημα συνδρομών είναι κλειστό (subs_enabled = OFF), τα μαρκαρίσματα αγνοούνται.",
    refresh: "🔄 Ανανέωση",
    search: "Αναζήτηση...",
    premiumOn: "💎 Premium",
    free: "Δωρεάν",
    enableAll: "💎 Όλα Premium",
    disableAll: "🆓 Όλα Free",
    confirmBulk: "Επιβεβαίωση μαζικής αλλαγής;",
    expand: "Άνοιγμα όλων",
    collapse: "Κλείσιμο όλων",
    counter: "{n}/{t} ως Premium",
    saved: "✓ Αποθηκεύτηκε",
    warning: "⚠️ Το σύστημα συνδρομών είναι κλειστό. Άνοιξέ το από Feature Flags για να ισχύσουν αυτά τα settings.",
    presets: "🎯 Έτοιμα Presets",
    presetFreemium: "Freemium (5 free games + όλα τα υπόλοιπα Premium)",
    presetPremiumAll: "Όλα Premium (μηδέν free)",
    presetAllFree: "Όλα Free (κανένα Premium)",
    presetAdult: "Μόνο Adult Premium",
  },
  en: {
    title: "💎 Premium Content",
    subtitle: "Choose which games & features are Premium-only",
    note: "💡 When enabled, free users see an upgrade screen. If subscriptions are disabled (subs_enabled = OFF), these settings are ignored.",
    refresh: "🔄 Refresh",
    search: "Search...",
    premiumOn: "💎 Premium",
    free: "Free",
    enableAll: "💎 All Premium",
    disableAll: "🆓 All Free",
    confirmBulk: "Confirm bulk change?",
    expand: "Expand all",
    collapse: "Collapse all",
    counter: "{n}/{t} as Premium",
    saved: "✓ Saved",
    warning: "⚠️ Subscriptions system is disabled. Enable it in Feature Flags for these settings to take effect.",
    presets: "🎯 Quick Presets",
    presetFreemium: "Freemium (5 free games + rest Premium)",
    presetPremiumAll: "All Premium (zero free)",
    presetAllFree: "All Free (zero Premium)",
    presetAdult: "Adult only Premium",
  },
};

const CATEGORY_LABELS = {
  games_age_2_3:    { el: "🎮 Παιχνίδια · 2-3 ετών", en: "🎮 Games · Age 2-3" },
  games_age_4_5:    { el: "🎮 Παιχνίδια · 4-5 ετών", en: "🎮 Games · Age 4-5" },
  games_age_6:      { el: "🎮 Παιχνίδια · 6 ετών", en: "🎮 Games · Age 6" },
  games_age_7_8:    { el: "🎮 Παιχνίδια · 7-8 ετών", en: "🎮 Games · Age 7-8" },
  games_age_9_10:   { el: "🎮 Παιχνίδια · 9-10 ετών", en: "🎮 Games · Age 9-10" },
  games_age_11_12:  { el: "🎮 Παιχνίδια · 11-12 ετών", en: "🎮 Games · Age 11-12" },
  games_age_adult:  { el: "🎮 Παιχνίδια · Ενήλικες", en: "🎮 Games · Adults" },
  features:         { el: "✨ Λειτουργίες", en: "✨ Features" },
  teacher:          { el: "👨‍🏫 Εργαλεία Δασκάλων", en: "👨‍🏫 Teacher Tools" },
  parent:           { el: "👨‍👩‍👧 Εργαλεία Γονέων", en: "👨‍👩‍👧 Parent Tools" },
};

const CATEGORY_ORDER = [
  "games_age_2_3",
  "games_age_4_5",
  "games_age_6",
  "games_age_7_8",
  "games_age_9_10",
  "games_age_11_12",
  "games_age_adult",
  "features",
  "teacher",
  "parent",
];

export default function AdminPremium() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [premium, setPremium] = useState({});
  const [busy, setBusy] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(() => {
    const init = {};
    for (const c of CATEGORY_ORDER) {
      if (c.startsWith("games_age_")) init[c] = true;
    }
    return init;
  });

  const subsEnabled = FeatureFlagService.isEnabled("subs_enabled");

  const load = async () => {
    await PremiumContentService.init();
    setPremium(PremiumContentService.getAll());
  };

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const out = {};
    for (const item of PREMIUM_ITEMS) {
      const cat = item.category;
      if (!out[cat]) out[cat] = [];
      out[cat].push({ ...item, premium: !!premium[item.id] });
    }
    return out;
  }, [premium]);

  const totalPremium = useMemo(() => Object.keys(premium).filter((k) => premium[k]).length, [premium]);
  const totalAll = PREMIUM_ITEMS.length;

  const filteredCats = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = [];
    for (const cat of CATEGORY_ORDER) {
      if (!grouped[cat]) continue;
      const items = q
        ? grouped[cat].filter((it) =>
            (it.label?.[lang] || it.label?.en || "").toLowerCase().includes(q) ||
            it.id.toLowerCase().includes(q)
          )
        : grouped[cat];
      if (items.length > 0) result.push([cat, items]);
    }
    return result;
  }, [grouped, search, lang]);

  const toggle = async (id, current) => {
    setBusy(id);
    try {
      await PremiumContentService.setPremium(id, !current);
      setPremium(PremiumContentService.getAll());
      setSavedId(id);
      setTimeout(() => setSavedId(null), 1500);
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(null);
  };

  const bulk = async (cat, items, makePremium) => {
    if (!window.confirm(l.confirmBulk)) return;
    setBusy("bulk_" + cat);
    try {
      const ids = items.map((it) => it.id).filter((id) => !!premium[id] !== makePremium);
      await PremiumContentService.setBulk(ids, makePremium);
      setPremium(PremiumContentService.getAll());
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(null);
  };

  // Presets
  const applyPreset = async (preset) => {
    if (!window.confirm(l.confirmBulk)) return;
    setBusy("preset");
    try {
      let toPremium = [];
      let toFree = [];
      const allIds = PREMIUM_ITEMS.map((it) => it.id);
      if (preset === "freemium") {
        // School (= sample 1) + first fun = free, the rest premium
        const freeKeep = new Set([
          "games_age_2_3_school", "games_age_2_3_fun",
          "games_age_4_5_school", "games_age_4_5_fun",
          "games_age_6_school",
          "games_age_7_8_school",
          "games_age_9_10_school",
          "games_age_11_12_school",
          "feature_dailyChallenge", "feature_avatar",
        ]);
        toPremium = allIds.filter((id) => !freeKeep.has(id));
        toFree = allIds.filter((id) => freeKeep.has(id));
      } else if (preset === "all_premium") {
        toPremium = allIds;
      } else if (preset === "all_free") {
        toFree = allIds;
      } else if (preset === "adult") {
        toPremium = allIds.filter((id) => id.startsWith("games_age_adult_"));
        toFree = allIds.filter((id) => !id.startsWith("games_age_adult_"));
      }
      if (toPremium.length) await PremiumContentService.setBulk(toPremium, true);
      if (toFree.length) await PremiumContentService.setBulk(toFree, false);
      setPremium(PremiumContentService.getAll());
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
          <p className="text-sm text-slate-500">
            {l.subtitle} · <strong>{l.counter.replace("{n}", totalPremium).replace("{t}", totalAll)}</strong>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { const next = {}; for (const c of CATEGORY_ORDER) next[c] = false; setCollapsed(next); }} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{l.expand}</button>
          <button onClick={() => { const next = {}; for (const c of CATEGORY_ORDER) next[c] = true; setCollapsed(next); }} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{l.collapse}</button>
          <button onClick={load} className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{l.refresh}</button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={l.search}
        aria-label={l.search}
        className="w-full mb-3 px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
      />

      <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4">{l.note}</p>

      {!subsEnabled && (
        <p className="text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3 mb-4 font-bold">{l.warning}</p>
      )}

      {/* Presets */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
        <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-3">{l.presets}</h3>
        <div className="flex flex-wrap gap-2">
          <button disabled={busy === "preset"} onClick={() => applyPreset("freemium")} className="text-xs font-bold px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md disabled:opacity-50">
            🎯 {l.presetFreemium}
          </button>
          <button disabled={busy === "preset"} onClick={() => applyPreset("all_premium")} className="text-xs font-bold px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 disabled:opacity-50">
            💎 {l.presetPremiumAll}
          </button>
          <button disabled={busy === "preset"} onClick={() => applyPreset("all_free")} className="text-xs font-bold px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 disabled:opacity-50">
            🆓 {l.presetAllFree}
          </button>
          <button disabled={busy === "preset"} onClick={() => applyPreset("adult")} className="text-xs font-bold px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 disabled:opacity-50">
            🍷 {l.presetAdult}
          </button>
        </div>
      </section>

      <div className="space-y-3">
        {filteredCats.map(([cat, items]) => {
          const isCollapsed = !!collapsed[cat] && !search.trim();
          const onItems = items.filter((it) => it.premium).length;
          const bulkBusy = busy === "bulk_" + cat;
          return (
            <section key={cat} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
                <button onClick={() => setCollapsed((c) => ({ ...c, [cat]: !c[cat] }))} className="flex items-center gap-2 text-left flex-1 min-w-0" aria-expanded={!isCollapsed}>
                  <span className={`text-xs transition-transform ${isCollapsed ? "" : "rotate-90"}`}>▶</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{CATEGORY_LABELS[cat]?.[lang] || CATEGORY_LABELS[cat]?.en || cat}</h3>
                  <span className="text-xs text-slate-500 shrink-0">({onItems}/{items.length} 💎)</span>
                </button>
                <div className="flex gap-1 shrink-0">
                  <button disabled={bulkBusy} onClick={() => bulk(cat, items, true)} className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 disabled:opacity-30">
                    {l.enableAll}
                  </button>
                  <button disabled={bulkBusy} onClick={() => bulk(cat, items, false)} className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 disabled:opacity-30">
                    {l.disableAll}
                  </button>
                </div>
              </header>
              {!isCollapsed && (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {items.map((it) => {
                    const label = it.label?.[lang] || it.label?.en || it.id;
                    return (
                      <li key={it.id} className="px-5 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{label}</p>
                          <p className="text-xs text-slate-500 font-mono">{it.id}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {savedId === it.id && <span className="text-[10px] font-bold text-emerald-600">{l.saved}</span>}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${it.premium ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"}`}>
                            {it.premium ? l.premiumOn : l.free}
                          </span>
                          <Toggle on={it.premium} disabled={busy === it.id} onClick={() => toggle(it.id, it.premium)} />
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
      className={`relative w-11 h-6 rounded-full transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${on ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"} ${disabled ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
