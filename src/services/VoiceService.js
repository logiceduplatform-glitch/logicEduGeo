const VOICE_PREFS_KEY = "geo:voicePrefs";

let voicesLoaded = false;
let cachedVoices = { el: null, en: null };

function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem(VOICE_PREFS_KEY)) || { enabled: true, rate: 0.9 };
  } catch {
    return { enabled: true, rate: 0.9 };
  }
}

function savePrefs(prefs) {
  localStorage.setItem(VOICE_PREFS_KEY, JSON.stringify(prefs));
}

function loadVoices() {
  if (!window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  voicesLoaded = true;

  // Greek voice priority:
  // 1. Google ελληνικά (best quality on Chrome)
  // 2. Any local el-GR voice
  // 3. Any voice with lang starting "el"
  const elVoices = voices.filter(v => v.lang.startsWith("el"));
  cachedVoices.el =
    elVoices.find(v => /google/i.test(v.name)) ||
    elVoices.find(v => v.localService && v.lang === "el-GR") ||
    elVoices.find(v => v.lang === "el-GR") ||
    elVoices.find(v => v.localService) ||
    elVoices[0] || null;

  // English voice priority: Google > local > any
  const enVoices = voices.filter(v => v.lang.startsWith("en"));
  cachedVoices.en =
    enVoices.find(v => /google/i.test(v.name) && v.lang === "en-US") ||
    enVoices.find(v => v.localService && v.lang === "en-US") ||
    enVoices.find(v => v.lang === "en-US") ||
    enVoices.find(v => v.localService) ||
    enVoices[0] || null;
}

// Voices load asynchronously in Chrome; listen for the event
if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

function getBestVoice(lang) {
  if (!voicesLoaded) loadVoices();
  return lang === "el" ? cachedVoices.el : cachedVoices.en;
}

export const VoiceService = {
  stopSpeaking() {
    try { window.speechSynthesis?.cancel(); } catch { /* */ }
  },

  isAvailable() {
    return typeof window !== "undefined" && !!window.speechSynthesis;
  },

  speak(text, lang = "el") {
    const prefs = getPrefs();
    if (!prefs.enabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Always set the correct BCP-47 language tag
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = prefs.rate;
    utterance.pitch = 1.1;

    // Assign a matching voice explicitly — this is the key fix.
    // Without this, many browsers ignore utterance.lang and use the system default (English).
    const voice = getBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  },

  /**
   * Lower-level speak for game components that need custom rate/pitch/volume.
   * Still ensures the correct voice is assigned.
   */
  speakCustom(text, { lang = "el", rate = 0.75, pitch = 1.1, volume = 1 } = {}) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    const voice = getBestVoice(lang);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
    return utterance;
  },

  speakInstruction(gameId, lang = "el", instructions = null) {
    if (!instructions) return;
    const instruction = instructions[gameId];
    if (instruction) {
      this.speak(instruction[lang] || instruction.el, lang);
    }
  },

  stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  isEnabled() {
    return getPrefs().enabled;
  },

  toggle() {
    const prefs = getPrefs();
    prefs.enabled = !prefs.enabled;
    savePrefs(prefs);
    if (!prefs.enabled) this.stop();
    return prefs.enabled;
  },

  setRate(rate) {
    const prefs = getPrefs();
    prefs.rate = Math.max(0.5, Math.min(2, rate));
    savePrefs(prefs);
  },

  getRate() {
    return getPrefs().rate;
  },

  /**
   * Get the cached voice for a language. Useful for components that
   * build their own utterances (e.g. GuessEmotionFromVoice).
   */
  getVoice(lang = "el") {
    return getBestVoice(lang);
  },
};
