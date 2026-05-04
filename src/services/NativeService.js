/**
 * NativeService — abstracts Capacitor APIs so the rest of the app stays
 * platform-agnostic. Every method gracefully degrades to a web fallback
 * when running outside a native shell.
 *
 * We deliberately use dynamic imports so Capacitor doesn't bloat the web
 * bundle — the modules only load when running inside an app shell.
 */
let capacitorPromise = null;
let isNative = false;

async function getCapacitor() {
  if (capacitorPromise) return capacitorPromise;
  capacitorPromise = (async () => {
    try {
      const { Capacitor } = await import("@capacitor/core");
      isNative = Capacitor.isNativePlatform();
      return Capacitor;
    } catch {
      return null;
    }
  })();
  return capacitorPromise;
}

export const NativeService = {
  async isNative() {
    await getCapacitor();
    return isNative;
  },

  async getPlatform() {
    const Cap = await getCapacitor();
    if (!Cap) return "web";
    return Cap.getPlatform(); // "web" | "ios" | "android"
  },

  // ── Status bar ────────────────────────────────────────────────────────
  async setStatusBarColor(color = "#7c3aed", style = "DARK") {
    if (!isNative) return;
    try {
      const { StatusBar, Style } = await import("@capacitor/status-bar");
      await StatusBar.setBackgroundColor({ color });
      await StatusBar.setStyle({ style: Style[style] || Style.Dark });
    } catch { /* plugin not available */ }
  },

  async hideStatusBar() {
    if (!isNative) return;
    try {
      const { StatusBar } = await import("@capacitor/status-bar");
      await StatusBar.hide();
    } catch { /* noop */ }
  },

  // ── Splash screen ─────────────────────────────────────────────────────
  async hideSplash() {
    if (!isNative) return;
    try {
      const { SplashScreen } = await import("@capacitor/splash-screen");
      await SplashScreen.hide();
    } catch { /* noop */ }
  },

  // ── Haptics (game feedback) ──────────────────────────────────────────
  async hapticImpact(style = "MEDIUM") {
    if (!isNative) {
      if (navigator.vibrate) navigator.vibrate(style === "HEAVY" ? 50 : 20);
      return;
    }
    try {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: ImpactStyle[style] || ImpactStyle.Medium });
    } catch { /* noop */ }
  },

  async hapticSuccess() {
    if (!isNative) {
      if (navigator.vibrate) navigator.vibrate([20, 30, 60]);
      return;
    }
    try {
      const { Haptics, NotificationType } = await import("@capacitor/haptics");
      await Haptics.notification({ type: NotificationType.Success });
    } catch { /* noop */ }
  },

  // ── Persistent storage (faster + larger than localStorage on native) ──
  async storageGet(key) {
    if (!isNative) {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    try {
      const { Preferences } = await import("@capacitor/preferences");
      const { value } = await Preferences.get({ key });
      return value;
    } catch { return null; }
  },

  async storageSet(key, value) {
    if (!isNative) {
      try { localStorage.setItem(key, value); } catch { /* noop */ }
      return;
    }
    try {
      const { Preferences } = await import("@capacitor/preferences");
      await Preferences.set({ key, value });
    } catch { /* noop */ }
  },

  // ── Native share sheet ───────────────────────────────────────────────
  async share({ title, text, url, dialogTitle }) {
    if (!isNative) {
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return true;
        } catch { return false; }
      }
      try {
        await navigator.clipboard.writeText(url || text || "");
        return true;
      } catch { return false; }
    }
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title, text, url, dialogTitle });
      return true;
    } catch { return false; }
  },

  // ── App lifecycle (back button, pause/resume) ─────────────────────────
  async onBackButton(handler) {
    if (!isNative) return () => {};
    try {
      const { App } = await import("@capacitor/app");
      const sub = await App.addListener("backButton", handler);
      return () => sub.remove();
    } catch { return () => {}; }
  },

  async onAppStateChange(handler) {
    if (!isNative) {
      const fn = () => handler({ isActive: !document.hidden });
      document.addEventListener("visibilitychange", fn);
      return () => document.removeEventListener("visibilitychange", fn);
    }
    try {
      const { App } = await import("@capacitor/app");
      const sub = await App.addListener("appStateChange", handler);
      return () => sub.remove();
    } catch { return () => {}; }
  },
};

// Auto-init on module load: hide splash + set status bar.
if (typeof window !== "undefined") {
  setTimeout(async () => {
    if (await NativeService.isNative()) {
      NativeService.hideSplash();
      NativeService.setStatusBarColor("#7c3aed", "DARK");
    }
  }, 100);
}
