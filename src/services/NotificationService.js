const PERM_KEY = "geo:notifPermission";
const TOKEN_KEY = "geo:fcmToken";

let messaging = null;

async function getMessagingModule() {
  if (messaging) return messaging;
  try {
    const { getMessaging, getToken, onMessage } = await import("firebase/messaging");
    const { initializeApp, getApps } = await import("firebase/app");

    const hasConfig = !!(
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    );
    if (!hasConfig) return null;

    let app = getApps()[0];
    if (!app) {
      app = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
      });
    }
    messaging = { instance: getMessaging(app), getToken, onMessage };
    return messaging;
  } catch {
    return null;
  }
}

export const NotificationService = {
  _enabled: null,

  isSupported() {
    return "Notification" in window && "serviceWorker" in navigator;
  },

  isEnabled() {
    if (this._enabled === null) {
      this._enabled = localStorage.getItem(PERM_KEY) === "granted";
    }
    return this._enabled;
  },

  async requestPermission() {
    if (!this.isSupported()) return false;

    const permission = await Notification.requestPermission();
    const granted = permission === "granted";
    localStorage.setItem(PERM_KEY, permission);
    this._enabled = granted;

    if (granted) {
      await this._registerToken();
    }
    return granted;
  },

  async _registerToken() {
    try {
      const mod = await getMessagingModule();
      if (!mod) return null;

      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        if (import.meta.env.DEV) console.warn("[Notifications] Missing VITE_FIREBASE_VAPID_KEY");
        return null;
      }

      const token = await mod.getToken(mod.instance, { vapidKey });
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    } catch (err) {
      if (import.meta.env.DEV) console.warn("[Notifications] Token registration failed:", err);
      return null;
    }
  },

  async listenForeground(callback) {
    try {
      const mod = await getMessagingModule();
      if (!mod) return;

      mod.onMessage(mod.instance, (payload) => {
        const { title, body, icon } = payload.notification || {};
        if (callback) callback(payload);

        if (title && this.isSupported()) {
          new Notification(title, {
            body: body || "",
            icon: icon || "/icons/icon-192x192.png",
            badge: "/icons/icon-72x72.png",
          });
        }
      });
    } catch {}
  },

  sendLocal({ title, body, icon = "🎮", tag = "geo-local" }) {
    if (!this.isSupported() || Notification.permission !== "granted") return;
    try {
      new Notification(title, { body, icon: "/icons/icon-192x192.png", tag, badge: "/icons/icon-72x72.png" });
    } catch {}
  },

  scheduleStreakReminder(lang = "el") {
    if (!this.isEnabled()) return;
    const hour = new Date().getHours();
    if (hour >= 18 && hour <= 20) {
      this.sendLocal({
        title: lang === "el" ? "Μην χάσεις το σερί σου! 🔥" : "Don't lose your streak! 🔥",
        body: lang === "el" ? "Παίξε ένα παιχνίδι σήμερα για να κρατήσεις το σερί σου" : "Play a game today to keep your streak going",
        tag: "streak-reminder",
      });
    }
  },

  scheduleMissionReminder(lang = "el", pending = 0) {
    if (!this.isEnabled() || pending === 0) return;
    this.sendLocal({
      title: lang === "el" ? `${pending} αποστολές σε περιμένουν! 🎯` : `${pending} missions waiting! 🎯`,
      body: lang === "el" ? "Ολοκλήρωσε τις ημερήσιες αποστολές σου" : "Complete your daily missions",
      tag: "mission-reminder",
    });
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  async disable() {
    this._enabled = false;
    localStorage.setItem(PERM_KEY, "denied");
    localStorage.removeItem(TOKEN_KEY);
  },
};
