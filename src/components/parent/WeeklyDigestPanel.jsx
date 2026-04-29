import React, { useContext, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { ProfileService } from "../../services/ProfileService";
import { ProgressService } from "../../services/ProgressService";
import { StorageService } from "../../services/StorageService";
import { DigestService } from "../../services/DigestService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const T = {
  el: {
    title: "Εβδομαδιαία Αναφορά",
    subtitle: "Σύνοψη της προόδου των παιδιών για τις τελευταίες 7 ημέρες",
    selectChild: "Επίλεξε παιδί",
    allChildren: "Όλα τα παιδιά",
    weekStats: "Στατιστικά εβδομάδας",
    games: "Παιχνίδια",
    minutes: "Λεπτά",
    correct: "Σωστές",
    streak: "Σερί",
    daysActive: "Ενεργές μέρες",
    accuracy: "Ακρίβεια",
    dailyActivity: "Ημερήσια δραστηριότητα",
    achievements: "Νέα επιτεύγματα",
    noAchievements: "Καμία νέα ταυτότητα αυτή την εβδομάδα",
    sendEmail: "📧 Αποστολή στο Email",
    sending: "Αποστολή...",
    sent: "✅ Στάλθηκε!",
    emailFailed: "Η αποστολή απέτυχε. Δοκίμασε ξανά.",
    enterEmail: "Πληκτρολόγησε email",
    autoEmail: "Αυτόματη εβδομαδιαία αποστολή",
    autoSaved: "Ρυθμίσεις αποθηκεύτηκαν!",
    noActivity: "Καμία δραστηριότητα αυτή την εβδομάδα",
    summary: "Σύνοψη",
  },
  en: {
    title: "Weekly Report",
    subtitle: "Summary of your children's progress for the last 7 days",
    selectChild: "Select child",
    allChildren: "All children",
    weekStats: "Week stats",
    games: "Games",
    minutes: "Minutes",
    correct: "Correct",
    streak: "Streak",
    daysActive: "Active days",
    accuracy: "Accuracy",
    dailyActivity: "Daily activity",
    achievements: "New achievements",
    noAchievements: "No new badges this week",
    sendEmail: "📧 Send to Email",
    sending: "Sending...",
    sent: "✅ Sent!",
    emailFailed: "Sending failed. Try again.",
    enterEmail: "Enter email",
    autoEmail: "Auto-send weekly digest",
    autoSaved: "Settings saved!",
    noActivity: "No activity this week",
    summary: "Summary",
  },
};

function readScopedDigest(profileId) {
  const savedScope = StorageService.getScope();
  StorageService.setScope(profileId || null);
  try {
    return DigestService.prepareDigestData();
  } finally {
    if (savedScope) {
      const id = savedScope.replace("profile:", "").replace(/:$/, "");
      StorageService.setScope(id);
    } else {
      StorageService.setScope(null);
    }
  }
}

export default function WeeklyDigestPanel() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const children = useMemo(() => ProfileService.getAll(), []);
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || "");
  const [prefs, setPrefs] = useState(() => DigestService.getPreferences());
  const [emailStatus, setEmailStatus] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const child = children.find(c => c.id === selectedChildId);
  const data = useMemo(() => selectedChildId ? readScopedDigest(selectedChildId) : null, [selectedChildId]);

  if (!child || !data) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <span className="text-4xl">📧</span>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">{isEl ? "Δεν υπάρχουν παιδικά προφίλ" : "No child profiles"}</p>
      </div>
    );
  }

  const weekly = data.weeklyStats || [];
  const totalGames = weekly.reduce((s, d) => s + (d.gamesPlayed || 0), 0);
  const totalCorrect = weekly.reduce((s, d) => s + (d.totalCorrect || 0), 0);
  const totalAttempts = weekly.reduce((s, d) => s + (d.totalAttempts || 0), 0);
  const totalMinutes = weekly.reduce((s, d) => s + (d.minutesPlayed || 0), 0);
  const daysActive = weekly.filter(d => (d.gamesPlayed || 0) > 0).length;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const chartData = weekly.map(d => ({
    name: d.date.slice(5),
    games: d.gamesPlayed || 0,
    minutes: d.minutesPlayed || 0,
  }));

  const recentAchievements = (data.achievements || []).slice(-3);

  const handleSavePrefs = () => {
    DigestService.setPreferences(prefs);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const buildPlainTextReport = () => {
    return [
      `${l.title} - ${child.name}`,
      `${l.summary} (${weekly[0]?.date} → ${weekly[weekly.length - 1]?.date})`,
      "",
      `${l.games}: ${totalGames}`,
      `${l.minutes}: ${totalMinutes}`,
      `${l.correct}: ${totalCorrect}/${totalAttempts}`,
      `${l.accuracy}: ${accuracy}%`,
      `${l.daysActive}: ${daysActive}/7`,
      `${l.streak}: ${data.streak?.current || 0}`,
      "",
      `${l.achievements}:`,
      ...(recentAchievements.length > 0
        ? recentAchievements.map(a => `- ${a.name || a.id}`)
        : [`(${l.noAchievements})`]),
      "",
      "— GeoLearn",
    ].join("\n");
  };

  const sendEmail = async () => {
    if (!prefs.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prefs.email)) {
      alert(l.enterEmail);
      return;
    }
    setEmailStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xpwzgkdl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: prefs.email,
          subject: `${l.title} - ${child.name}`,
          name: `GeoLearn Weekly Digest`,
          message: buildPlainTextReport(),
        }),
      });
      if (res.ok) {
        setEmailStatus("sent");
        setTimeout(() => setEmailStatus(null), 3500);
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
        <span className="inline-block text-4xl mb-2">📧📊</span>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
      </div>

      {children.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {children.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedChildId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedChildId === c.id ? "bg-purple-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
            >
              {c.avatar || "👤"} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <DigestStat icon="🎮" label={l.games} value={totalGames} color="from-blue-500 to-cyan-500" />
        <DigestStat icon="⏱️" label={l.minutes} value={totalMinutes} color="from-purple-500 to-pink-500" />
        <DigestStat icon="🎯" label={l.accuracy} value={`${accuracy}%`} color="from-emerald-500 to-teal-500" />
        <DigestStat icon="🔥" label={l.streak} value={data.streak?.current || 0} color="from-orange-500 to-red-500" />
      </div>

      {/* Daily activity chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">📈 {l.dailyActivity}</h4>
        {totalGames === 0 ? (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">{l.noActivity}</p>
        ) : (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="games" fill="#a855f7" radius={[4, 4, 0, 0]} name={l.games} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">🏆 {l.achievements}</h4>
        {recentAchievements.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{l.noAchievements}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recentAchievements.map((a, i) => (
              <div key={i} className="px-3 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                🏅 {a.name || a.id}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email send */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
        <input
          type="email"
          value={prefs.email}
          onChange={e => setPrefs({ ...prefs, email: e.target.value })}
          placeholder={l.enterEmail}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-purple-400 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={prefs.enabled}
            onChange={e => setPrefs({ ...prefs, enabled: e.target.checked })}
            className="rounded text-purple-500"
          />
          {l.autoEmail}
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={sendEmail}
            disabled={emailStatus === "sending"}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-sm hover:shadow-md transition disabled:opacity-60"
          >
            {emailStatus === "sending" ? l.sending : emailStatus === "sent" ? l.sent : emailStatus === "error" ? l.emailFailed : l.sendEmail}
          </button>
          <button
            onClick={handleSavePrefs}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold"
          >
            {savedFlash ? l.autoSaved : (isEl ? "Αποθήκευση" : "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function DigestStat({ icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-3 text-white shadow-sm`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
      <div className="text-xs opacity-90">{label}</div>
    </div>
  );
}
