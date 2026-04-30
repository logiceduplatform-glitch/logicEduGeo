// Background music service using Web Audio API.
// Generates simple loopable melodies per "mood" — no audio files required, low bandwidth.
// Each track is a short pattern of synthesized notes that loops.
//
// Tracks are tied to mood IDs from `shopItems.js > music`.

const KEY_PREFS = "geo:music-prefs";

let ctx = null;
let masterGain = null;
let currentLoop = null;
let currentMood = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.15;
      masterGain.connect(ctx.destination);
    } catch { return null; }
  }
  if (ctx?.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

// Note frequencies (A4 = 440)
function noteFreq(name) {
  const NOTES = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
  const m = name.match(/^([A-G]#?)(\d)$/);
  if (!m) return 440;
  const semis = NOTES[m[1]] + (parseInt(m[2], 10) - 4) * 12;
  return 440 * Math.pow(2, (semis - 9) / 12);
}

// Pattern format: array of { note, dur (s), vol, type } — null note = rest
const PATTERNS = {
  focus: {
    bpm: 80,
    type: "sine",
    notes: ["C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4"],
  },
  chill: {
    bpm: 60,
    type: "sine",
    notes: ["E4", null, "G4", null, "C5", null, "B4", null, "A4", null, "G4", null, "E4", null, null, null],
  },
  energy: {
    bpm: 130,
    type: "triangle",
    notes: ["C4", "G4", "E4", "G4", "F4", "A4", "G4", "C5", "E4", "G4", "C5", "G4", "B4", "G4", "F4", "E4"],
  },
  arcade: {
    bpm: 140,
    type: "square",
    notes: ["C4", "C5", "G4", "C5", "E4", "G4", "C5", "E5", "F4", "C5", "A4", "C5", "G4", "C5", "B4", "G4"],
  },
  lullaby: {
    bpm: 50,
    type: "sine",
    notes: ["C5", null, "A4", null, "G4", null, "E4", null, "F4", null, "G4", null, "C4", null, null, null],
  },
  epic: {
    bpm: 100,
    type: "sawtooth",
    notes: ["C4", "C4", "G4", "G4", "F4", "F4", "E4", "E4", "D4", "G4", "C5", "B4", "A4", "F4", "G4", "C5"],
  },
};

function playNote(time, freq, dur, type, vol = 0.2) {
  if (!ctx || !masterGain) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(vol, time + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function scheduleLoop(pattern) {
  if (!getCtx()) return;
  const { bpm, type, notes } = pattern;
  const stepTime = 60 / bpm / 2; // eighth-notes
  let step = 0;
  let nextTime = ctx.currentTime + 0.05;

  const tick = () => {
    if (!currentMood) return;
    while (nextTime < ctx.currentTime + 0.3) {
      const note = notes[step % notes.length];
      if (note) {
        playNote(nextTime, noteFreq(note), stepTime * 1.6, type, 0.15);
      }
      // Optional bass on every 4th step
      if (step % 4 === 0 && note) {
        const bassNote = note.replace(/\d/, (d) => Math.max(2, parseInt(d, 10) - 1));
        playNote(nextTime, noteFreq(bassNote), stepTime * 2.5, "sine", 0.08);
      }
      step++;
      nextTime += stepTime;
    }
    currentLoop = setTimeout(tick, 100);
  };
  tick();
}

export const MusicService = {
  getPrefs() {
    try { return { enabled: false, volume: 0.15, mood: "focus", ...JSON.parse(localStorage.getItem(KEY_PREFS) || "{}") }; }
    catch { return { enabled: false, volume: 0.15, mood: "focus" }; }
  },

  setPrefs(prefs) {
    try { localStorage.setItem(KEY_PREFS, JSON.stringify(prefs)); } catch {}
    if (prefs.enabled) this.play(prefs.mood, prefs.volume);
    else this.stop();
    if (masterGain) masterGain.gain.value = prefs.volume ?? 0.15;
  },

  play(mood, volume) {
    if (!PATTERNS[mood]) return;
    if (currentMood === mood && currentLoop) return;
    this.stop();
    if (!getCtx()) return;
    if (volume != null && masterGain) masterGain.gain.value = volume;
    currentMood = mood;
    scheduleLoop(PATTERNS[mood]);
  },

  stop() {
    if (currentLoop) { clearTimeout(currentLoop); currentLoop = null; }
    currentMood = null;
  },

  isPlaying() { return !!currentLoop; },

  getCurrentMood() { return currentMood; },

  setVolume(v) {
    if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
  },

  /** Play a short preview (~3s) of a mood without affecting current loop. */
  preview(mood) {
    if (!PATTERNS[mood] || !getCtx()) return;
    const wasMood = currentMood;
    const wasLoop = currentLoop;
    this.stop();
    currentMood = mood;
    scheduleLoop(PATTERNS[mood]);
    setTimeout(() => {
      this.stop();
      if (wasMood) {
        currentMood = wasMood;
        scheduleLoop(PATTERNS[wasMood]);
      }
    }, 3000);
  },

  // List of mood IDs that have patterns
  AVAILABLE_MOODS: Object.keys(PATTERNS),
};

// Auto-resume music on user interaction (browsers block until user gesture)
if (typeof window !== "undefined") {
  const init = () => {
    const prefs = MusicService.getPrefs();
    if (prefs.enabled && !currentLoop) MusicService.play(prefs.mood, prefs.volume);
    document.removeEventListener("click", init);
    document.removeEventListener("keydown", init);
  };
  document.addEventListener("click", init, { once: true });
  document.addEventListener("keydown", init, { once: true });
}
