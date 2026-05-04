import React, { useState, useContext, useMemo, useCallback } from "react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { TimeLimitService } from "../services/TimeLimitService";

const T = {
  el: {
    title: "Διαχείριση Χρόνου",
    subtitle: "Όρισε όρια ασφαλούς χρήσης για κάθε παιδί.",
    noChildren: "Δεν υπάρχουν προφίλ παιδιών. Πρόσθεσε ένα από τη σελίδα προφίλ.",
    enabledLimit: "Ενεργό όριο",
    minutesPerDay: "Λεπτά την ημέρα",
    schedule: "Επιτρεπόμενο πρόγραμμα",
    from: "Από",
    to: "Έως",
    todayUsage: "Χρήση σήμερα",
    remaining: "Απομένουν",
    minutes: "λεπτά",
    save: "Αποθήκευση",
    saved: "Αποθηκεύτηκε ✓",
    history: "Ιστορικό 7 ημερών",
    presets: "Έτοιμα",
    preset30: "30 λεπτά",
    preset60: "1 ώρα",
    preset90: "1.5 ώρα",
    preset120: "2 ώρες",
    schoolHours: "Σχολικές (15:00-21:00)",
    weekend: "Σαββατοκύριακο",
    night: "Όχι μετά τις 21:00",
    locked: "🔒 Όριο ξεπεράστηκε",
    outsideSchedule: "🌙 Εκτός ωραρίου",
    ok: "✅ Εντός ορίων",
    explainTitle: "Γιατί είναι σημαντικό;",
    explain: "Οι περιορισμοί οθόνης βοηθούν τα παιδιά να αναπτύξουν υγιείς συνήθειες και να εξισορροπήσουν το παιχνίδι με άλλες δραστηριότητες.",
  },
  en: {
    title: "Time Management",
    subtitle: "Set safe-use limits for each child.",
    noChildren: "No child profiles yet. Add one from the profile page.",
    enabledLimit: "Active limit",
    minutesPerDay: "Minutes per day",
    schedule: "Allowed schedule",
    from: "From",
    to: "To",
    todayUsage: "Today's usage",
    remaining: "Remaining",
    minutes: "minutes",
    save: "Save",
    saved: "Saved ✓",
    history: "7-day history",
    presets: "Presets",
    preset30: "30 min",
    preset60: "1 hour",
    preset90: "1.5 hours",
    preset120: "2 hours",
    schoolHours: "After school (15:00-21:00)",
    weekend: "Weekend",
    night: "Not after 21:00",
    locked: "🔒 Limit reached",
    outsideSchedule: "🌙 Outside schedule",
    ok: "✅ Within limits",
    explainTitle: "Why does this matter?",
    explain: "Screen-time limits help children develop healthy habits and balance play with other activities.",
  },
};

function ChildCard({ entry, lang, onSave }) {
  const l = T[lang] || T.en;
  const [enabled, setEnabled] = useState(entry.limit.enabled);
  const [minutes, setMinutes] = useState(entry.limit.dailyMinutes || 60);
  const [start, setStart] = useState(entry.schedule?.start || "");
  const [end, setEnd] = useState(entry.schedule?.end || "");
  const [savedFlash, setSavedFlash] = useState(false);

  const status = useMemo(() => {
    if (entry.remaining === 0) return { kind: "locked", label: l.locked, cls: "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200" };
    if (!entry.withinSchedule) return { kind: "schedule", label: l.outsideSchedule, cls: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200" };
    return { kind: "ok", label: l.ok, cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200" };
  }, [entry, l]);

  const maxHistory = Math.max(1, ...entry.history.map((h) => h.minutes));

  const handleSave = () => {
    TimeLimitService.setLimit(entry.child.id, { dailyMinutes: minutes, enabled });
    if (start && end) {
      TimeLimitService.setSchedule(entry.child.id, { start, end });
    } else {
      TimeLimitService.setSchedule(entry.child.id, null);
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
    onSave?.();
  };

  const applyPreset = (mins) => setMinutes(mins);
  const applySchedulePreset = (s, e) => { setStart(s); setEnd(e); };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{entry.child.avatar || "🧒"}</span>
          <div>
            <div className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{entry.child.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{entry.child.age || "—"}</div>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.cls}`}>{status.label}</span>
      </div>

      {/* Today's usage */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg p-3">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">{l.todayUsage}</div>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{entry.todayMinutes} <span className="text-xs font-normal">{l.minutes}</span></div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg p-3">
          <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400">{l.remaining}</div>
          <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
            {entry.remaining === Infinity ? "∞" : entry.remaining} <span className="text-xs font-normal text-slate-500">{l.minutes}</span>
          </div>
        </div>
      </div>

      {/* 7-day history */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{l.history}</div>
        <div className="flex items-end gap-1 h-16">
          {entry.history.map((h) => (
            <div key={h.date} className="flex-1 flex flex-col items-center justify-end" title={`${h.date}: ${h.minutes} ${l.minutes}`}>
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t"
                style={{ height: `${(h.minutes / maxHistory) * 100}%`, minHeight: h.minutes > 0 ? 3 : 0 }}
              />
              <div className="text-[9px] text-slate-400 mt-0.5">{h.date.slice(-2)}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-4 border-slate-200 dark:border-slate-700" />

      {/* Settings */}
      <label className="flex items-center justify-between mb-3 cursor-pointer">
        <span className="font-semibold text-slate-700 dark:text-slate-300">{l.enabledLimit}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-5 h-5 accent-purple-600"
        />
      </label>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{l.minutesPerDay}</label>
        <input
          type="number"
          min="0"
          max="600"
          step="15"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value) || 0)}
          disabled={!enabled}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 disabled:opacity-50"
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {[30, 60, 90, 120].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => applyPreset(m)}
              disabled={!enabled}
              className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
            >
              {l[`preset${m}`]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{l.schedule}</label>
        <div className="flex items-center gap-2">
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100" />
          <span className="text-slate-500">→</span>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100" />
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <button type="button" onClick={() => applySchedulePreset("15:00", "21:00")} className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{l.schoolHours}</button>
          <button type="button" onClick={() => applySchedulePreset("09:00", "21:00")} className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{l.weekend}</button>
          <button type="button" onClick={() => applySchedulePreset("07:00", "21:00")} className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">{l.night}</button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow hover:from-purple-700 hover:to-pink-700 active:scale-95"
      >
        {savedFlash ? l.saved : l.save}
      </button>
    </div>
  );
}

export default function TimeManagementPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [refreshKey, setRefreshKey] = useState(0);

  const entries = useMemo(
    () => TimeLimitService.getAllChildrenUsage(7),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey]
  );

  const handleSave = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/time-management" />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">⏰</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {entries.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-slate-500">
              {l.noChildren}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entries.map((entry) => (
                <ChildCard key={entry.child.id} entry={entry} lang={lang} onSave={handleSave} />
              ))}
            </div>
          )}

          <div className="mt-8 p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">💡 {l.explainTitle}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">{l.explain}</p>
          </div>
        </div>
      </main>
    </>
  );
}
