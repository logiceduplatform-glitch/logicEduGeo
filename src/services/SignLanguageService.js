// Sign Language Service: maps common platform terms / instructions to sign-language video clips.
// Videos are stored on a CDN (or YouTube/Vimeo embed). For now we use placeholders + the ability
// to register custom videos.
//
// Languages supported:
//   - GSL (Greek Sign Language / Ελληνική Νοηματική)
//   - ASL (American Sign Language)
//
// Each entry maps a key → { gsl: { url, source }, asl: { url, source } }
// Sources: "youtube" | "vimeo" | "video" (direct file)

const KEY_PREFS = "geo:sign-prefs";

// NOTE: These are placeholder educational sign-language videos.
// In production, replace these URLs with your own hosted MP4s or curated YouTube videos
// using the AccessibilityAdminPanel (admin UI) or by editing this file.
const SIGN_VIDEOS = {
  // Greetings & basics
  hello: {
    gsl: { url: "https://www.youtube.com/embed/PdiWAbVidLU?autoplay=0", source: "youtube" },
    asl: { url: "https://www.youtube.com/embed/v1desDduz5M?autoplay=0", source: "youtube" },
  },
  thank_you: {
    gsl: { url: "https://www.youtube.com/embed/wsJtaWzNjsM?autoplay=0", source: "youtube" },
    asl: { url: "https://www.youtube.com/embed/cnPfX_MWFc4?autoplay=0", source: "youtube" },
  },
  yes: {
    asl: { url: "https://www.youtube.com/embed/_PdoNW9YS_w?autoplay=0", source: "youtube" },
  },
  no: {
    asl: { url: "https://www.youtube.com/embed/yqcsiBb5BAc?autoplay=0", source: "youtube" },
  },

  // Game instructions
  start: {
    gsl: { url: "https://www.youtube.com/embed/UxmK0jq7nyk?autoplay=0", source: "youtube" },
    asl: { url: "https://www.youtube.com/embed/3eNUXwQ7VlM?autoplay=0", source: "youtube" },
  },
  stop: {
    asl: { url: "https://www.youtube.com/embed/qXChsT0bA4I?autoplay=0", source: "youtube" },
  },
  next: {
    asl: { url: "https://www.youtube.com/embed/JbPm4tCnu7w?autoplay=0", source: "youtube" },
  },
  back: {
    asl: { url: "https://www.youtube.com/embed/I5lDHBijh-A?autoplay=0", source: "youtube" },
  },
  correct: {
    asl: { url: "https://www.youtube.com/embed/ck1fjHkrA4M?autoplay=0", source: "youtube" },
  },
  wrong: {
    asl: { url: "https://www.youtube.com/embed/XKJTHDRNd1A?autoplay=0", source: "youtube" },
  },
  play: {
    asl: { url: "https://www.youtube.com/embed/JmTkTb_xMLo?autoplay=0", source: "youtube" },
  },
  // Subjects
  math: {
    asl: { url: "https://www.youtube.com/embed/CBFxdImGcWE?autoplay=0", source: "youtube" },
  },
  science: {
    asl: { url: "https://www.youtube.com/embed/Pz3fJrNm1H0?autoplay=0", source: "youtube" },
  },
  reading: {
    asl: { url: "https://www.youtube.com/embed/GdWOVeJP3Y4?autoplay=0", source: "youtube" },
  },
};

const KEY_CUSTOM = "geo:sign-custom";

function loadCustom() {
  try { return JSON.parse(localStorage.getItem(KEY_CUSTOM) || "{}"); } catch { return {}; }
}

export const SignLanguageService = {
  getPrefs() {
    try {
      return { language: "gsl", autoShow: false, ...JSON.parse(localStorage.getItem(KEY_PREFS) || "{}") };
    } catch { return { language: "gsl", autoShow: false }; }
  },

  setPrefs(prefs) {
    try { localStorage.setItem(KEY_PREFS, JSON.stringify(prefs)); } catch {}
  },

  /** Return video info for a given key, falling back to ASL when GSL not available. */
  get(key, language) {
    const lang = language || this.getPrefs().language || "gsl";
    const custom = loadCustom();
    if (custom[key]?.[lang]) return custom[key][lang];
    if (SIGN_VIDEOS[key]?.[lang]) return SIGN_VIDEOS[key][lang];
    // Fallback chain: GSL → ASL → first available
    if (SIGN_VIDEOS[key]?.gsl) return SIGN_VIDEOS[key].gsl;
    if (SIGN_VIDEOS[key]?.asl) return SIGN_VIDEOS[key].asl;
    return null;
  },

  /** Add or override a video for a key/language (admin only). */
  setCustom(key, language, url, source = "youtube") {
    const custom = loadCustom();
    if (!custom[key]) custom[key] = {};
    custom[key][language] = { url, source };
    try { localStorage.setItem(KEY_CUSTOM, JSON.stringify(custom)); } catch {}
  },

  removeCustom(key, language) {
    const custom = loadCustom();
    if (custom[key]?.[language]) {
      delete custom[key][language];
      try { localStorage.setItem(KEY_CUSTOM, JSON.stringify(custom)); } catch {}
    }
  },

  getAllKeys() {
    return Object.keys({ ...SIGN_VIDEOS, ...loadCustom() });
  },

  LANGUAGES: [
    { id: "gsl", label: "Ελληνική Νοηματική (GSL)", flag: "🇬🇷" },
    { id: "asl", label: "American Sign Language (ASL)", flag: "🇺🇸" },
  ],
};
