import React, { useContext, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { ProfileService } from "../../services/ProfileService";
import { ProgressService } from "../../services/ProgressService";
import { StorageService } from "../../services/StorageService";

const T = {
  el: {
    title: "Ορόσημα & Επιτυχίες",
    subtitle: "Όλες οι επιτυχίες των παιδιών σου σε ένα μέρος",
    allChildren: "Όλα",
    noEvents: "Δεν υπάρχουν ορόσημα ακόμα. Παίξτε για να δείτε εδώ τις επιτυχίες!",
    levelUp: "Επίπεδο Up!",
    streak: "Σερί",
    days: "ημέρες",
    achievement: "Νέα ταυτότητα",
    firstGame: "Πρώτο Παιχνίδι!",
    perfectScore: "Τέλειο Σκορ!",
    bigWin: "Μεγάλη Νίκη",
    newSkill: "Νέα δεξιότητα",
    enableNotif: "Ενεργοποίηση ειδοποιήσεων browser",
    notifEnabled: "✅ Οι ειδοποιήσεις είναι ενεργές",
    notifDenied: "Μπλοκαρίστηκαν",
    notifTip: "Αν εγκαταστήσεις την εφαρμογή σαν PWA, θα λαμβάνεις ειδοποιήσεις και κλειστή.",
    today: "Σήμερα",
    yesterday: "Χθες",
    daysAgo: "πριν λίγες μέρες",
  },
  en: {
    title: "Milestones & Wins",
    subtitle: "All your kids' achievements in one place",
    allChildren: "All",
    noEvents: "No milestones yet. Play to see wins here!",
    levelUp: "Level Up!",
    streak: "Streak",
    days: "days",
    achievement: "New badge",
    firstGame: "First Game!",
    perfectScore: "Perfect Score!",
    bigWin: "Big Win",
    newSkill: "New skill",
    enableNotif: "Enable browser notifications",
    notifEnabled: "✅ Notifications enabled",
    notifDenied: "Blocked",
    notifTip: "Install as a PWA to get notifications even when closed.",
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "days ago",
  },
};

function readScopedEvents(profileId, isEl, l) {
  const savedScope = StorageService.getScope();
  StorageService.setScope(profileId);
  try {
    const events = [];
    const overall = ProgressService.getOverallStats() || { totalGamesPlayed: 0 };
    const xp = ProgressService.getXP() || { level: 1, total: 0 };
    const streak = ProgressService.getStreak() || { current: 0, best: 0 };
    const achievements = ProgressService.getUnlockedAchievements() || [];
    const allProg = ProgressService.getAllGameProgress() || {};

    if (overall.totalGamesPlayed === 1) {
      events.push({ icon: "🎮", title: l.firstGame, desc: "", date: new Date().toISOString() });
    }
    if (xp.level >= 2) {
      events.push({ icon: "⬆️", title: `${l.levelUp} ${xp.level}`, desc: `${xp.total} XP`, date: new Date().toISOString() });
    }
    if (streak.current >= 3) {
      events.push({ icon: "🔥", title: `${streak.current}-${l.days} ${l.streak}`, desc: `Best: ${streak.best}`, date: new Date().toISOString() });
    }

    achievements.slice(-15).forEach(a => {
      events.push({ icon: a.icon || "🏆", title: a.name || a.id || l.achievement, desc: a.description || "", date: a.unlockedAt || new Date().toISOString() });
    });

    Object.entries(allProg).forEach(([key, v]) => {
      const gameId = key.replace("progress:game:", "");
      if (v?.history) {
        v.history.slice(-30).forEach(h => {
          const pct = h.total > 0 ? Math.round((h.score / h.total) * 100) : 0;
          if (pct === 100) {
            events.push({ icon: "💯", title: l.perfectScore, desc: `${h.title || gameId}`, date: h.date });
          } else if (pct >= 90) {
            events.push({ icon: "🌟", title: l.bigWin, desc: `${h.title || gameId} - ${pct}%`, date: h.date });
          }
        });
      }
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    return events.slice(0, 50);
  } finally {
    if (savedScope) {
      const id = savedScope.replace("profile:", "").replace(/:$/, "");
      StorageService.setScope(id);
    } else {
      StorageService.setScope(null);
    }
  }
}

function fmtDate(dateStr, l) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return l.today;
  if (diff === 1) return l.yesterday;
  if (diff <= 7) return `${diff} ${l.daysAgo}`;
  return d.toLocaleDateString();
}

export default function MilestonesFeed() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const children = useMemo(() => ProfileService.getAll(), []);
  const [filterId, setFilterId] = useState("all");
  const [notifPerm, setNotifPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");

  const events = useMemo(() => {
    const all = [];
    children.forEach(c => {
      if (filterId !== "all" && filterId !== c.id) return;
      const evs = readScopedEvents(c.id, isEl, l);
      evs.forEach(e => all.push({ ...e, child: c }));
    });
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    return all;
  }, [children, filterId, isEl, l]);

  const requestNotifPerm = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifPerm(result);
    if (result === "granted") {
      try {
        new Notification("GeoLearn", {
          body: isEl ? "Οι ειδοποιήσεις ενεργοποιήθηκαν!" : "Notifications enabled!",
          icon: "/favicon.svg",
        });
      } catch {}
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
        <span className="inline-block text-3xl mb-1">🎉🏆</span>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      {/* Notification permission */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔔</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {notifPerm === "granted" ? l.notifEnabled : notifPerm === "denied" ? l.notifDenied : l.enableNotif}
          </span>
        </div>
        {notifPerm !== "granted" && notifPerm !== "denied" && (
          <button onClick={requestNotifPerm} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-500 text-white">
            ✓
          </button>
        )}
      </div>

      {/* Child filter */}
      {children.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterId("all")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filterId === "all" ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
            {l.allChildren}
          </button>
          {children.map(c => (
            <button key={c.id} onClick={() => setFilterId(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${filterId === c.id ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
              {c.avatar} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Events feed */}
      {events.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <span className="text-3xl">🌱</span>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">{l.noEvents}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((e, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex items-start gap-3">
              <div className="text-3xl flex-shrink-0">{e.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{e.title}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{fmtDate(e.date, l)}</span>
                </div>
                {e.desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{e.desc}</p>}
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">
                  {e.child.avatar} {e.child.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {notifPerm !== "granted" && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">{l.notifTip}</p>
      )}
    </div>
  );
}
