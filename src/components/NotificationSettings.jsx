import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { NotificationService } from "../services/NotificationService";

const T = {
  el: {
    title: "🔔 Ειδοποιήσεις",
    desc: "Λάβε υπενθυμίσεις για να μη χάσεις το streak ή την ημερήσια πρόκληση.",
    enable: "Ενεργοποίηση ειδοποιήσεων",
    enabled: "✓ Ενεργοποιημένες",
    denied: "Έχουν αποκλειστεί. Άνοιξέ τες από τις ρυθμίσεις του browser.",
    unsupported: "Ο browser σου δεν υποστηρίζει ειδοποιήσεις.",
    streak: "Υπενθύμιση streak",
    daily: "Ημερήσια πρόκληση",
    achievement: "Νέο επίτευγμα",
    time: "Ώρα υπενθύμισης",
    test: "🧪 Δοκιμαστική ειδοποίηση",
    testSent: "Στάλθηκε!",
  },
  en: {
    title: "🔔 Notifications",
    desc: "Get reminders so you don't miss your streak or daily challenge.",
    enable: "Enable notifications",
    enabled: "✓ Enabled",
    denied: "Blocked. Enable from your browser settings.",
    unsupported: "Your browser doesn't support notifications.",
    streak: "Streak reminder",
    daily: "Daily challenge",
    achievement: "New achievement",
    time: "Reminder time",
    test: "🧪 Test notification",
    testSent: "Sent!",
  },
};

export default function NotificationSettings() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [perm, setPerm] = useState(NotificationService.permission());
  const [prefs, setPrefs] = useState(NotificationService.getPrefs());
  const [tested, setTested] = useState(false);

  useEffect(() => {
    setPerm(NotificationService.permission());
  }, []);

  const handleEnable = async () => {
    const r = await NotificationService.request();
    setPerm(r);
  };

  const handlePref = (key, value) => {
    const next = NotificationService.setPrefs({ [key]: value });
    setPrefs(next);
  };

  const handleTest = async () => {
    const ok = await NotificationService.show(l.title, {
      body: lang === "el" ? "Είσαι έτοιμος! Θα λαμβάνεις υπενθυμίσεις." : "All set! You'll receive reminders.",
      tag: "test",
    });
    if (ok) {
      setTested(true);
      setTimeout(() => setTested(false), 2500);
    }
  };

  if (perm === "unsupported") {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-1">{l.title}</h3>
        <p className="text-sm text-slate-500">{l.unsupported}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold text-slate-800 dark:text-white mb-1">{l.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{l.desc}</p>

      {perm !== "granted" ? (
        <>
          <button
            onClick={handleEnable}
            disabled={perm === "denied"}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition ${
              perm === "denied"
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {perm === "denied" ? l.denied : l.enable}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-bold text-emerald-600 mb-3">{l.enabled}</p>
          <div className="space-y-2">
            <Toggle label={l.streak} on={prefs.streakReminder} onChange={(v) => handlePref("streakReminder", v)} />
            <Toggle label={l.daily} on={prefs.dailyChallenge} onChange={(v) => handlePref("dailyChallenge", v)} />
            <Toggle label={l.achievement} on={prefs.newAchievement} onChange={(v) => handlePref("newAchievement", v)} />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{l.time}</label>
            <input
              type="time"
              value={prefs.reminderTime}
              onChange={(e) => handlePref("reminderTime", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none"
            />
          </div>
          <button
            onClick={handleTest}
            className="mt-3 w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold"
          >
            {tested ? l.testSent : l.test}
          </button>
        </>
      )}
    </div>
  );
}

function Toggle({ label, on, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`relative w-11 h-6 rounded-full transition ${on ? "bg-violet-500" : "bg-slate-300 dark:bg-slate-600"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
