import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import {
  EVENT_TEMPLATES,
  TOURNAMENTS,
  getCurrentEvent,
  getUpcomingEvents,
  daysUntilNextWeek,
  getEventProgress,
} from "../config/eventsConfig";

const T = {
  el: {
    title: "Events & Τουρνουά",
    subtitle: "Πάρε μέρος, νίκησε, κέρδισε έπαθλα!",
    back: "Πίσω",
    activeEvent: "Ενεργό Event",
    upcoming: "Επόμενα",
    tournaments: "Τουρνουά",
    progress: "Πρόοδος",
    reward: "Έπαθλο",
    rules: "Κανόνες",
    play: "Παίξε",
    days: "ημέρες",
    nextWeek: "Σε",
    leaderboard: "Δες κατάταξη",
    completed: "Ολοκληρώθηκε!",
    coinsReward: "coins",
    badgeReward: "+ ταυτότητα",
    info: "Τα events ανανεώνονται κάθε εβδομάδα. Παίξε για να εμφανιστείς στις λίστες!",
  },
  en: {
    title: "Events & Tournaments",
    subtitle: "Join, win, earn rewards!",
    back: "Back",
    activeEvent: "Active Event",
    upcoming: "Upcoming",
    tournaments: "Tournaments",
    progress: "Progress",
    reward: "Reward",
    rules: "Rules",
    play: "Play",
    days: "days",
    nextWeek: "In",
    leaderboard: "View leaderboard",
    completed: "Completed!",
    coinsReward: "coins",
    badgeReward: "+ badge",
    info: "Events refresh weekly. Play to appear on the leaderboards!",
  },
};

export default function EventsPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const current = getCurrentEvent();
  const upcoming = getUpcomingEvents(3);
  const daysLeft = daysUntilNextWeek();
  const progress = getEventProgress(current);
  const pct = Math.min(100, Math.round((progress / current.target) * 100));
  const completed = progress >= current.target;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={l.title} description={l.subtitle} canonical="/events" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-purple-600 mb-4">← {l.back}</button>

        <header className="text-center mb-8">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{l.subtitle}</p>
        </header>

        {/* Active event */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">{l.activeEvent}</h2>
          <div className={`relative bg-gradient-to-br ${current.color} rounded-3xl p-5 sm:p-8 text-white shadow-2xl overflow-hidden`}>
            <div aria-hidden className="absolute top-0 right-0 text-[120px] sm:text-[180px] opacity-10 leading-none pointer-events-none select-none">{current.icon}</div>
            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-2">⏰ {l.nextWeek} {daysLeft} {l.days}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                    <span>{current.icon}</span> {current.title[lang] || current.title.en}
                  </h3>
                  <p className="text-white/90 text-sm mt-1">{current.desc[lang] || current.desc.en}</p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
                <p className="text-xs font-bold uppercase opacity-80 mb-1">{l.rules}</p>
                <p className="text-sm">{current.rules[lang] || current.rules.en}</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{l.progress}</span>
                  <span>{progress} / {current.target}</span>
                </div>
                <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
                </div>
                {completed && <p className="text-center mt-2 font-bold">🎉 {l.completed}</p>}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={current.cta.path}
                  className="px-5 py-2.5 rounded-xl bg-white text-purple-700 font-bold shadow-lg hover:shadow-xl transition"
                >
                  ▶️ {current.cta.label[lang] || current.cta.label.en}
                </Link>
                <span className="text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg">
                  🪙 {current.reward.coins} {l.coinsReward} {current.reward.badgeId && l.badgeReward}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming events */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">{l.upcoming}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {upcoming.map((ev, i) => (
              <div key={ev.id + i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${ev.color} text-white text-xs font-bold mb-2`}>
                  {ev.icon} {l.nextWeek} {(i + 1) * 7} {l.days}
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100">{ev.title[lang] || ev.title.en}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ev.desc[lang] || ev.desc.en}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-semibold">🪙 {ev.reward.coins} {l.coinsReward}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tournaments */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">{l.tournaments}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {TOURNAMENTS.map(t => (
              <div key={t.id} className={`bg-gradient-to-br ${t.color} rounded-2xl p-6 text-white shadow-xl`}>
                <div className="text-4xl mb-2">{t.icon}</div>
                <h3 className="text-xl font-extrabold">{t.title[lang] || t.title.en}</h3>
                <p className="text-sm text-white/90 mb-4">{t.desc[lang] || t.desc.en}</p>
                <div className="bg-white/15 backdrop-blur rounded-xl p-3 mb-3 space-y-1">
                  {t.rewards.map(r => (
                    <div key={r.rank} className="flex justify-between text-sm">
                      <span>{r.label} #{r.rank}</span>
                      <span className="font-bold">🪙 {r.coins}</span>
                    </div>
                  ))}
                </div>
                <Link to={`/leaderboard`} className="block w-full text-center py-2 bg-white text-slate-800 rounded-lg font-bold hover:shadow-lg transition">
                  📊 {l.leaderboard}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic">{l.info}</p>
      </main>
    </div>
  );
}
