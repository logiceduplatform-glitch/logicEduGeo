// Browser local notification service.
// Used for streak reminders, daily challenge, achievements, etc.
// Works without a backend. Real "push" requires a server with VAPID keys.

const PREF_KEY = "geo:notifications";
const DAILY_REMINDER_KEY = "geo:notif:lastReminder";

const DEFAULT_PREFS = {
  streakReminder: true,
  dailyChallenge: true,
  newAchievement: true,
  reminderTime: "18:30", // HH:MM (local time)
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PREFS };
}

function savePrefs(p) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch {}
}

export const NotificationService = {
  isSupported() {
    return typeof window !== "undefined" && "Notification" in window;
  },

  permission() {
    if (!this.isSupported()) return "unsupported";
    return Notification.permission;
  },

  async request() {
    if (!this.isSupported()) return "unsupported";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    try {
      const r = await Notification.requestPermission();
      return r;
    } catch {
      return "denied";
    }
  },

  getPrefs() { return loadPrefs(); },

  setPrefs(updates) {
    const next = { ...loadPrefs(), ...updates };
    savePrefs(next);
    return next;
  },

  /** Show a notification immediately (if permission granted). */
  async show(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== "granted") return false;
    try {
      // Prefer SW notifications (work even when tab is closed)
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.showNotification(title, {
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            ...options,
          });
          return true;
        }
      }
      new Notification(title, { icon: "/icon-192.png", ...options });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Daily reminder: if user hasn't been reminded today and current time
   * matches preference, show notification.
   * Call this on app start + on visibility change.
   */
  async maybeRunDailyReminder() {
    if (!this.isSupported() || Notification.permission !== "granted") return;
    const prefs = loadPrefs();
    if (!prefs.streakReminder && !prefs.dailyChallenge) return;

    const today = new Date().toISOString().slice(0, 10);
    let last = "";
    try { last = localStorage.getItem(DAILY_REMINDER_KEY) || ""; } catch {}
    if (last === today) return;

    // Check time window: only fire if current time >= reminder time
    const [hh, mm] = (prefs.reminderTime || "18:30").split(":").map((x) => parseInt(x, 10) || 0);
    const now = new Date();
    const remToday = new Date();
    remToday.setHours(hh, mm, 0, 0);
    if (now < remToday) return;

    const lang = (typeof navigator !== "undefined" && navigator.language?.startsWith("el")) ? "el" : "en";
    const messages = lang === "el"
      ? [
          { title: "🔥 Μην χάσεις το streak σου!", body: "Παίξε λίγο σήμερα για να συνεχίσεις τη σειρά σου." },
          { title: "🎯 Ημερήσια Πρόκληση", body: "Έχει νέα πρόκληση να σε περιμένει! Πάμε;" },
          { title: "✨ Ώρα για μάθηση", body: "5 λεπτά παιχνιδιού = 1 βήμα πιο κοντά σε νέο επίτευγμα!" },
        ]
      : [
          { title: "🔥 Don't lose your streak!", body: "Play a bit today to keep your streak going." },
          { title: "🎯 Daily Challenge", body: "A new challenge is waiting for you. Let's go!" },
          { title: "✨ Time to learn", body: "5 mins of play = 1 step closer to a new achievement!" },
        ];
    const m = messages[Math.floor(Math.random() * messages.length)];
    await this.show(m.title, { body: m.body, tag: "daily-reminder", data: { url: "/daily" } });
    try { localStorage.setItem(DAILY_REMINDER_KEY, today); } catch {}
  },
};

// Auto-init: check on visibility / online / start
if (typeof window !== "undefined") {
  let _booted = false;
  const boot = () => {
    if (_booted) return;
    _booted = true;
    setTimeout(() => NotificationService.maybeRunDailyReminder(), 4000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        NotificationService.maybeRunDailyReminder();
      }
    });
  };
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
}
