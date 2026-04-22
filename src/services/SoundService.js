let audioCtx = null;
const bufferCache = {};

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

const AUDIO_BASE = "/sounds/";
const SOUND_FILES = {
  correct:         "correct.mp3",
  wrong:           "wrong.mp3",
  click:           "click.mp3",
  pop:             "pop.mp3",
  swoosh:          "swoosh.mp3",
  coin:            "coin.mp3",
  levelup:         "levelup.mp3",
  achievement:     "achievement.mp3",
  gameStart:       "game-start.mp3",
  gameOver:        "game-over.mp3",
  streak:          "streak.mp3",
  missionComplete: "mission-complete.mp3",
  star:            "star.mp3",
  timer:           "timer.mp3",
  countdown:       "countdown.mp3",
};

async function loadBuffer(key) {
  if (bufferCache[key]) return bufferCache[key];
  try {
    const ctx = getCtx();
    const res = await fetch(AUDIO_BASE + SOUND_FILES[key]);
    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    const audioBuf = await ctx.decodeAudioData(arrayBuf);
    bufferCache[key] = audioBuf;
    return audioBuf;
  } catch {
    return null;
  }
}

function playBuffer(buf, volume = 0.3) {
  if (!buf) return;
  try {
    const ctx = getCtx();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(0);
  } catch {}
}

async function playSoundFile(key, volume = 0.3) {
  const buf = await loadBuffer(key);
  if (buf) {
    playBuffer(buf, volume);
    return true;
  }
  return false;
}

// ─── Synthesized fallbacks (rich versions) ─────────────────────

function playTone(freq, duration = 0.15, type = "sine", volume = 0.2) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playChord(freqs, duration = 0.25, type = "sine", volume = 0.08) {
  freqs.forEach(f => playTone(f, duration, type, volume));
}

function playNoise(duration = 0.1, volume = 0.06) {
  try {
    const ctx = getCtx();
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * volume;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 4000;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + duration);
  } catch {}
}

function playMelody(notes, noteLen = 0.12, type = "sine", volume = 0.15) {
  notes.forEach((n, i) => {
    if (n > 0) setTimeout(() => playTone(n, noteLen, type, volume), i * (noteLen * 800));
  });
}

function synthCorrect() {
  playMelody([523.25, 659.25, 783.99], 0.1, "sine", 0.13);
  setTimeout(() => playNoise(0.04, 0.03), 50);
}

function synthWrong() {
  playTone(220, 0.12, "sawtooth", 0.08);
  setTimeout(() => playTone(196, 0.2, "sawtooth", 0.06), 120);
}

function synthClick() {
  playNoise(0.03, 0.04);
  playTone(1200, 0.03, "sine", 0.06);
}

function synthPop() {
  playTone(900, 0.05, "sine", 0.1);
  setTimeout(() => playTone(1100, 0.04, "sine", 0.06), 40);
}

function synthSwoosh() {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

function synthCoin() {
  playTone(1318.5, 0.06, "square", 0.08);
  setTimeout(() => playTone(1568, 0.1, "square", 0.06), 70);
}

function synthStreak() {
  playMelody([523.25, 587.33, 659.25, 783.99, 1046.5], 0.08, "triangle", 0.1);
}

function synthLevelup() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.2, "sine", 0.12), i * 150));
  setTimeout(() => playChord([1046.5, 1318.5, 1568], 0.4, "triangle", 0.06), 600);
}

function synthAchievement() {
  const notes = [392, 523.25, 659.25, 783.99, 1046.50];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.2, "triangle", 0.1), i * 100));
  setTimeout(() => {
    playChord([1046.5, 1318.5, 1568], 0.5, "sine", 0.05);
    playNoise(0.08, 0.03);
  }, 550);
}

function synthMissionComplete() {
  playMelody([659.25, 783.99, 1046.5, 1318.5], 0.1, "sine", 0.1);
  setTimeout(() => playChord([1046.5, 1318.5], 0.3, "triangle", 0.06), 400);
}

function synthGameStart() {
  playMelody([523.25, 659.25, 783.99], 0.08, "triangle", 0.08);
}

function synthGameOver() {
  playMelody([783.99, 659.25, 523.25, 392], 0.15, "sine", 0.1);
}

function synthTimer() {
  playTone(1000, 0.04, "square", 0.05);
}

function synthStar() {
  playTone(1568, 0.08, "sine", 0.1);
  setTimeout(() => {
    playTone(2093, 0.06, "sine", 0.08);
    playNoise(0.03, 0.02);
  }, 80);
}

function synthCountdown(n) {
  if (n > 0) playTone(800, 0.08, "square", 0.06);
  else playTone(1200, 0.15, "square", 0.08);
}

const SYNTH_FALLBACKS = {
  correct: synthCorrect,
  wrong: synthWrong,
  click: synthClick,
  pop: synthPop,
  swoosh: synthSwoosh,
  coin: synthCoin,
  streak: synthStreak,
  levelup: synthLevelup,
  achievement: synthAchievement,
  missionComplete: synthMissionComplete,
  gameStart: synthGameStart,
  gameOver: synthGameOver,
  timer: synthTimer,
  star: synthStar,
};

async function playSound(key, volume = 0.3, fallbackArg) {
  const played = await playSoundFile(key, volume);
  if (!played) {
    const fn = SYNTH_FALLBACKS[key];
    if (fn) fn(fallbackArg);
  }
}

export const SoundService = {
  _enabled: null,

  isEnabled() {
    if (this._enabled === null) {
      this._enabled = localStorage.getItem("geo:sounds") !== "false";
    }
    return this._enabled;
  },

  toggle() {
    this._enabled = !this.isEnabled();
    localStorage.setItem("geo:sounds", this._enabled.toString());
    return this._enabled;
  },

  preload() {
    if (!this.isEnabled()) return;
    const keys = ["correct", "wrong", "click", "coin", "levelup"];
    keys.forEach(k => loadBuffer(k).catch(() => {}));
  },

  correct()         { if (this.isEnabled()) playSound("correct", 0.35); },
  wrong()           { if (this.isEnabled()) playSound("wrong", 0.3); },
  click()           { if (this.isEnabled()) playSound("click", 0.2); },
  hover()           { if (this.isEnabled()) playTone(1400, 0.02, "sine", 0.03); },
  pop()             { if (this.isEnabled()) playSound("pop", 0.25); },
  swoosh()          { if (this.isEnabled()) playSound("swoosh", 0.25); },
  coin()            { if (this.isEnabled()) playSound("coin", 0.3); },
  streak()          { if (this.isEnabled()) playSound("streak", 0.3); },
  levelup()         { if (this.isEnabled()) playSound("levelup", 0.35); },
  achievement()     { if (this.isEnabled()) playSound("achievement", 0.35); },
  missionComplete() { if (this.isEnabled()) playSound("missionComplete", 0.3); },
  gameStart()       { if (this.isEnabled()) playSound("gameStart", 0.25); },
  gameOver()        { if (this.isEnabled()) playSound("gameOver", 0.3); },
  timer()           { if (this.isEnabled()) playSound("timer", 0.2); },
  star()            { if (this.isEnabled()) playSound("star", 0.3); },
  countdown(n)      { if (!this.isEnabled()) return; playSoundFile("countdown", 0.25).then(ok => { if (!ok) synthCountdown(n); }); },
};
