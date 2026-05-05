import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";
import { FeatureFlagService } from "../../services/FeatureFlagService";
import {
  getGamesCatalog,
  gameItemId,
  AGE_LABELS,
  MODE_LABELS,
} from "../../config/gamesCatalog";

const T = {
  el: {
    title: "🎮 Παιχνίδια · On / Off ξεχωριστά",
    subtitle:
      "Ενεργοποίησε ή απενεργοποίησε κάθε παιχνίδι ξεχωριστά. Όταν είναι κλειστό, εξαφανίζεται από όλους τους χρήστες.",
    refresh: "🔄 Ανανέωση",
    search: "Αναζήτηση παιχνιδιού...",
    enabled: "Ενεργό",
    disabled: "Κρυφό",
    enableAll: "✅ Όλα ON",
    disableAll: "⏸️ Όλα OFF",
    confirmBulk: "Επιβεβαίωση: αλλαγή σε όλα τα παιχνίδια αυτού του τμήματος;",
    counter: "{n}/{t} ενεργά",
    expandAll: "Άνοιγμα όλων",
    collapseAll: "Κλείσιμο όλων",
    saved: "✓ Αποθηκεύτηκε",
    noResults: "Δεν βρέθηκαν παιχνίδια.",
    note: "💡 Οι αλλαγές προπαγανδίζονται σε όλους τους χρήστες μετά την επόμενη φόρτωση σελίδας.",
    totalGames: "{n} παιχνίδια συνολικά",
  },
  en: {
    title: "🎮 Games · Per-game On / Off",
    subtitle: "Enable or disable each game individually. When off, it disappears for all users.",
    refresh: "🔄 Refresh",
    search: "Search game...",
    enabled: "Enabled",
    disabled: "Hidden",
    enableAll: "✅ All ON",
    disableAll: "⏸️ All OFF",
    confirmBulk: "Confirm: change all games in this section?",
    counter: "{n}/{t} enabled",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    saved: "✓ Saved",
    noResults: "No games found.",
    note: "💡 Changes propagate to all users on next page load.",
    totalGames: "{n} games total",
  },
};

function gameTitle(label, lang) {
  if (!label) return "";
  if (typeof label === "string") return label;
  return label[lang] || label.en || label.el || "";
}

export default function AdminGames() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [overrides, setOverrides] = useState({}); // gameItemId → boolean
  const [busy, setBusy] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(() => {
    // Collapse all by default (lots of games)
    return { _all_collapsed_initially: true };
  });

  const catalog = useMemo(() => getGamesCatalog(), []);

  const load = async () => {
    await FeatureFlagService.init();
    const all = FeatureFlagService.getAll();
    // Build a map: gameItemId → enabled (read from cache via getGameOverride),
    // but `getAll()` only includes DEFAULT flags. We must read raw cache.
    // Easier: iterate catalog and call getGameOverride for each.
    const map = {};
    for (const g of catalog) {
      const id = gameItemId(g.ageGroup, g.mode, g.gameId);
      const o = FeatureFlagService.getGameOverride(g.ageGroup, g.mode, g.gameId);
      map[id] = o === undefined ? true : o; // default ON
    }
    setOverrides(map);
    // unused but keeps lint happy
    void all;
  };

  useEffect(() => { load(); }, [catalog]);

  // Group: ageGroup → mode → games[]
  const grouped = useMemo(() => {
    const out = {};
    const q = search.trim().toLowerCase();
    for (const g of catalog) {
      const id = gameItemId(g.ageGroup, g.mode, g.gameId);
      const title = gameTitle(g.label, lang).toLowerCase();
      if (q && !title.includes(q) && !g.gameId.toLowerCase().includes(q)) continue;
      if (!out[g.ageGroup]) out[g.ageGroup] = {};
      if (!out[g.ageGroup][g.mode]) out[g.ageGroup][g.mode] = [];
      out[g.ageGroup][g.mode].push({ ...g, _id: id, enabled: overrides[id] !== false });
    }
    return out;
  }, [catalog, overrides, search, lang]);

  const totalGames = catalog.length;
  const totalEnabled = useMemo(
    () => Object.values(overrides).filter((v) => v !== false).length,
    [overrides]
  );

  const toggle = async (gameItemKey) => {
    const current = overrides[gameItemKey] !== false;
    setBusy(gameItemKey);
    try {
      await AdminService.setFlag(gameItemKey, !current, { kind: "perGame" });
      setOverrides((prev) => ({ ...prev, [gameItemKey]: !current }));
      // Patch local cache so isGameEnabled() sees the new value immediately
      try {
        const raw = localStorage.getItem("geo:featureFlags");
        const cache = raw ? JSON.parse(raw) : {};
        cache[gameItemKey] = !current;
        localStorage.setItem("geo:featureFlags", JSON.stringify(cache));
      } catch {}
      setSavedId(gameItemKey);
      setTimeout(() => setSavedId(null), 1500);
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(null);
  };

  const bulkToggle = async (items, enable) => {
    if (!window.confirm(l.confirmBulk)) return;
    setBusy("bulk");
    try {
      const next = { ...overrides };
      for (const item of items) {
        if ((next[item._id] !== false) !== enable) {
          await AdminService.setFlag(item._id, enable, { kind: "perGame" });
          next[item._id] = enable;
        }
      }
      // Patch local cache
      try {
        const raw = localStorage.getItem("geo:featureFlags");
        const cache = raw ? JSON.parse(raw) : {};
        for (const item of items) cache[item._id] = enable;
        localStorage.setItem("geo:featureFlags", JSON.stringify(cache));
      } catch {}
      setOverrides(next);
    } catch (e) {
      alert("Error: " + e.message);
    }
    setBusy(null);
  };

  const ageOrder = ["2_3", "4_5", "6", "7_8", "9_10", "11_12", "adult"];
  const modeOrder = ["school", "fun", "logic", "brain", "board"];

  const expandAll = () => {
    const next = {};
    for (const a of ageOrder) {
      next[a] = false;
      for (const m of modeOrder) next[`${a}__${m}`] = false;
    }
    setCollapsed(next);
  };
  const collapseAll = () => {
    const next = {};
    for (const a of ageOrder) {
      next[a] = true;
      for (const m of modeOrder) next[`${a}__${m}`] = true;
    }
    setCollapsed(next);
  };

  const isCatCollapsed = (key) => {
    if (search.trim()) return false; // auto-expand on search
    if (collapsed._all_collapsed_initially && collapsed[key] === undefined) return true;
    return !!collapsed[key];
  };

  const renderedAges = ageOrder.filter((a) => grouped[a]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h2>
          <p className="text-sm text-slate-500">
            {l.subtitle}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            <strong>{l.counter.replace("{n}", totalEnabled).replace("{t}", totalGames)}</strong>
            {" · "}
            {l.totalGames.replace("{n}", totalGames)}
          </p>
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

      {renderedAges.length === 0 && (
        <div className="text-center text-sm text-slate-500 py-12">{l.noResults}</div>
      )}

      <div className="space-y-3">
        {renderedAges.map((age) => {
          const ageCollapsed = isCatCollapsed(age);
          const allInAge = Object.values(grouped[age]).flat();
          const enabledInAge = allInAge.filter((g) => g.enabled).length;
          return (
            <section
              key={age}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
                <button
                  onClick={() =>
                    setCollapsed((c) => ({ ...c, [age]: !isCatCollapsed(age), _all_collapsed_initially: false }))
                  }
                  className="flex items-center gap-2 text-left flex-1 min-w-0"
                  aria-expanded={!ageCollapsed}
                >
                  <span className={`text-xs transition-transform ${ageCollapsed ? "" : "rotate-90"}`}>▶</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">
                    {AGE_LABELS[age]?.[lang] || age}
                  </h3>
                  <span className="text-xs text-slate-500 shrink-0">
                    ({l.counter.replace("{n}", enabledInAge).replace("{t}", allInAge.length)})
                  </span>
                </button>
                <div className="flex gap-1 shrink-0">
                  <button
                    disabled={busy === "bulk" || enabledInAge === allInAge.length}
                    onClick={() => bulkToggle(allInAge, true)}
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 disabled:opacity-30"
                  >
                    {l.enableAll}
                  </button>
                  <button
                    disabled={busy === "bulk" || enabledInAge === 0}
                    onClick={() => bulkToggle(allInAge, false)}
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-30"
                  >
                    {l.disableAll}
                  </button>
                </div>
              </header>

              {!ageCollapsed && (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {modeOrder
                    .filter((m) => grouped[age][m]?.length)
                    .map((mode) => {
                      const modeKey = `${age}__${mode}`;
                      const modeCollapsed = isCatCollapsed(modeKey);
                      const items = grouped[age][mode];
                      const enabledInMode = items.filter((g) => g.enabled).length;
                      return (
                        <div key={modeKey}>
                          <div className="px-5 py-2 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-2 flex-wrap">
                            <button
                              onClick={() =>
                                setCollapsed((c) => ({
                                  ...c,
                                  [modeKey]: !isCatCollapsed(modeKey),
                                  _all_collapsed_initially: false,
                                }))
                              }
                              className="flex items-center gap-2 text-left flex-1 min-w-0"
                              aria-expanded={!modeCollapsed}
                            >
                              <span className={`text-[10px] transition-transform ${modeCollapsed ? "" : "rotate-90"}`}>▶</span>
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {MODE_LABELS[mode]?.[lang] || mode}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                ({l.counter.replace("{n}", enabledInMode).replace("{t}", items.length)})
                              </span>
                            </button>
                            <div className="flex gap-1 shrink-0">
                              <button
                                disabled={busy === "bulk" || enabledInMode === items.length}
                                onClick={() => bulkToggle(items, true)}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 disabled:opacity-30"
                              >
                                ON
                              </button>
                              <button
                                disabled={busy === "bulk" || enabledInMode === 0}
                                onClick={() => bulkToggle(items, false)}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-30"
                              >
                                OFF
                              </button>
                            </div>
                          </div>
                          {!modeCollapsed && (
                            <ul>
                              {items.map((g) => (
                                <li
                                  key={g._id}
                                  className="px-5 py-2 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                >
                                  <div className="min-w-0 flex items-center gap-2">
                                    <span className="text-xl shrink-0">{g.icon || "🎮"}</span>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                        {gameTitle(g.label, lang) || g.gameId}
                                      </p>
                                      <p className="text-[10px] text-slate-500 font-mono truncate">{g._id}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {savedId === g._id && (
                                      <span className="text-[10px] font-bold text-emerald-600">{l.saved}</span>
                                    )}
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        g.enabled
                                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                                          : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                                      }`}
                                    >
                                      {g.enabled ? l.enabled : l.disabled}
                                    </span>
                                    <Toggle
                                      on={g.enabled}
                                      disabled={busy === g._id || busy === "bulk"}
                                      onClick={() => toggle(g._id)}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                </div>
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
      className={`relative w-11 h-6 rounded-full transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${
        on ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
      } ${disabled ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
