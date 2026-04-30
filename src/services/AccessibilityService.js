// Accessibility Service: Manages all a11y preferences and applies them to the document.
// Settings are persisted in localStorage and applied as CSS classes on <html>.
//
// Modes:
//   - dyslexia: replaces font + adds spacing
//   - colorBlindMode: "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia"
//   - highContrast: bool
//   - largeText: bool (forces base font-size 18px → larger UI)
//   - reducedMotion: bool (disables animations & transitions)
//   - underlineLinks: bool
//   - simplifiedUI: bool (hides decorative elements)
//   - signLanguage: bool (shows sign language buttons throughout)

const KEY = "geo:a11y";

const DEFAULTS = {
  dyslexia: false,
  colorBlindMode: "none",
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  underlineLinks: false,
  simplifiedUI: false,
  signLanguage: false,
};

function loadPrefs() {
  try {
    const s = localStorage.getItem(KEY);
    return { ...DEFAULTS, ...(s ? JSON.parse(s) : {}) };
  } catch { return { ...DEFAULTS }; }
}

function persist(prefs) {
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch {}
}

function applyToDocument(prefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.classList.toggle("a11y-dyslexia", !!prefs.dyslexia);
  root.classList.toggle("a11y-high-contrast", !!prefs.highContrast);
  root.classList.toggle("a11y-large-text", !!prefs.largeText);
  root.classList.toggle("a11y-reduced-motion", !!prefs.reducedMotion);
  root.classList.toggle("a11y-underline-links", !!prefs.underlineLinks);
  root.classList.toggle("a11y-simplified", !!prefs.simplifiedUI);
  root.classList.toggle("a11y-sign-language", !!prefs.signLanguage);

  // Color-blind filter
  ["deuteranopia", "protanopia", "tritanopia", "achromatopsia"].forEach((mode) => {
    root.classList.toggle(`a11y-cb-${mode}`, prefs.colorBlindMode === mode);
  });
}

const listeners = new Set();
let _prefs = loadPrefs();

if (typeof window !== "undefined") {
  applyToDocument(_prefs);
}

export const AccessibilityService = {
  getPrefs() { return { ..._prefs }; },

  update(partial) {
    _prefs = { ..._prefs, ...partial };
    persist(_prefs);
    applyToDocument(_prefs);
    listeners.forEach((fn) => { try { fn(_prefs); } catch {} });
    return { ..._prefs };
  },

  reset() {
    _prefs = { ...DEFAULTS };
    persist(_prefs);
    applyToDocument(_prefs);
    listeners.forEach((fn) => { try { fn(_prefs); } catch {} });
    return { ..._prefs };
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  /** Re-apply current prefs (useful after route changes / DOM updates). */
  reapply() {
    applyToDocument(_prefs);
  },

  COLORBLIND_MODES: [
    { id: "none", labelEl: "Καμία", labelEn: "None" },
    { id: "deuteranopia", labelEl: "Δευτερανωπία (πιο συχνή)", labelEn: "Deuteranopia (most common)" },
    { id: "protanopia", labelEl: "Πρωτανωπία", labelEn: "Protanopia" },
    { id: "tritanopia", labelEl: "Τριτανωπία (μπλε-κίτρινο)", labelEn: "Tritanopia (blue-yellow)" },
    { id: "achromatopsia", labelEl: "Αχρωματοψία", labelEn: "Achromatopsia (no color)" },
  ],
};
