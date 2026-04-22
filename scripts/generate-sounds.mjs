import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "sounds");

const RATE = 44100;

function makeWav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buf;
}

function sine(freq, t) { return Math.sin(2 * Math.PI * freq * t); }
function tri(freq, t) { const p = (freq * t) % 1; return p < 0.5 ? 4 * p - 1 : 3 - 4 * p; }
function sq(freq, t) { return sine(freq, t) >= 0 ? 1 : -1; }

function envelope(t, attack, decay, sustain, release, total) {
  if (t < attack) return t / attack;
  if (t < attack + decay) return 1 - (1 - sustain) * ((t - attack) / decay);
  if (t < total - release) return sustain;
  return sustain * (1 - (t - (total - release)) / release);
}

function generate(duration, fn) {
  const n = Math.floor(RATE * duration);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    samples[i] = fn(i / RATE, i, n);
  }
  return samples;
}

function mix(...arrays) {
  const len = Math.max(...arrays.map(a => a.length));
  const out = new Float64Array(len);
  for (const a of arrays) for (let i = 0; i < a.length; i++) out[i] += a[i];
  return out;
}

function padStart(arr, delaySec) {
  const pad = Math.floor(delaySec * RATE);
  const out = new Float64Array(arr.length + pad);
  out.set(arr, pad);
  return out;
}

function save(name, samples) {
  const peak = samples.reduce((mx, s) => Math.max(mx, Math.abs(s)), 0) || 1;
  const norm = samples.map(s => s / peak * 0.85);
  writeFileSync(join(OUT, name + ".mp3"), makeWav(Array.from(norm)));
  console.log(`  ✓ ${name}.mp3`);
}

console.log("Generating sound effects...\n");

// ─── correct: cheerful ascending C-E-G chord ──────────────────
save("correct", generate(0.45, (t) => {
  const e = envelope(t, 0.01, 0.05, 0.6, 0.2, 0.45);
  const c = sine(523.25, t) * (t < 0.15 ? 1 : 0.3);
  const eNote = t > 0.08 ? sine(659.25, t) * (t < 0.25 ? 1 : 0.3) : 0;
  const g = t > 0.16 ? sine(783.99, t) : 0;
  const shimmer = sine(1567.98, t) * 0.15;
  return (c + eNote + g + shimmer) * 0.25 * e;
}));

// ─── wrong: descending minor buzz ──────────────────────────────
save("wrong", generate(0.4, (t) => {
  const e = envelope(t, 0.01, 0.1, 0.5, 0.15, 0.4);
  const f1 = 280 - t * 120;
  return (sine(f1, t) * 0.4 + sq(f1 * 0.5, t) * 0.1 + tri(f1 * 1.5, t) * 0.08) * e;
}));

// ─── click: short snap ──────────────────────────────────────────
save("click", generate(0.06, (t) => {
  const e = envelope(t, 0.002, 0.02, 0.2, 0.02, 0.06);
  return (sine(1200, t) * 0.3 + (Math.random() * 2 - 1) * 0.15) * e;
}));

// ─── pop: bubbly pop ───────────────────────────────────────────
save("pop", generate(0.12, (t) => {
  const e = envelope(t, 0.003, 0.03, 0.3, 0.05, 0.12);
  const f = 900 + (1 - t / 0.12) * 600;
  return (sine(f, t) * 0.5 + sine(f * 2, t) * 0.1) * e;
}));

// ─── swoosh: rising sweep ──────────────────────────────────────
save("swoosh", generate(0.25, (t) => {
  const e = envelope(t, 0.02, 0.05, 0.6, 0.1, 0.25);
  const f = 300 + t / 0.25 * 1200;
  return (sine(f, t) * 0.3 + (Math.random() * 2 - 1) * 0.08) * e;
}));

// ─── coin: retro coin collect ──────────────────────────────────
{
  const a = generate(0.08, (t) => {
    const e = envelope(t, 0.003, 0.02, 0.6, 0.03, 0.08);
    return sq(1318.5, t) * 0.2 * e;
  });
  const b = generate(0.12, (t) => {
    const e = envelope(t, 0.003, 0.02, 0.5, 0.05, 0.12);
    return sq(1568, t) * 0.18 * e;
  });
  save("coin", mix(a, padStart(b, 0.07)));
}

// ─── levelup: triumphant ascending arpeggio ────────────────────
{
  const notes = [523.25, 659.25, 783.99, 1046.50];
  const parts = notes.map((f, i) =>
    padStart(generate(0.25, (t) => {
      const e = envelope(t, 0.01, 0.05, 0.6, 0.1, 0.25);
      return (sine(f, t) * 0.25 + tri(f, t) * 0.1) * e;
    }), i * 0.14)
  );
  const chord = padStart(generate(0.5, (t) => {
    const e = envelope(t, 0.02, 0.1, 0.5, 0.25, 0.5);
    return (sine(1046.5, t) + sine(1318.5, t) + sine(1568, t)) * 0.08 * e;
  }), 0.56);
  save("levelup", mix(...parts, chord));
}

// ─── achievement: fanfare ──────────────────────────────────────
{
  const notes = [392, 523.25, 659.25, 783.99, 1046.50];
  const parts = notes.map((f, i) =>
    padStart(generate(0.22, (t) => {
      const e = envelope(t, 0.01, 0.04, 0.6, 0.08, 0.22);
      return (tri(f, t) * 0.2 + sine(f * 2, t) * 0.06) * e;
    }), i * 0.1)
  );
  const finale = padStart(generate(0.6, (t) => {
    const e = envelope(t, 0.02, 0.1, 0.4, 0.3, 0.6);
    return (sine(1046.5, t) + sine(1318.5, t) + sine(1568, t)) * 0.07 * e;
  }), 0.52);
  save("achievement", mix(...parts, finale));
}

// ─── game-start: ready set go ──────────────────────────────────
{
  const notes = [523.25, 659.25, 783.99];
  const parts = notes.map((f, i) =>
    padStart(generate(0.15, (t) => {
      const e = envelope(t, 0.008, 0.03, 0.5, 0.06, 0.15);
      return tri(f, t) * 0.2 * e;
    }), i * 0.1)
  );
  save("game-start", mix(...parts));
}

// ─── game-over: descending minor phrase ────────────────────────
save("game-over", (() => {
  const notes = [783.99, 659.25, 523.25, 392];
  const parts = notes.map((f, i) =>
    padStart(generate(0.2, (t) => {
      const e = envelope(t, 0.01, 0.05, 0.5, 0.08, 0.2);
      return sine(f, t) * 0.22 * e;
    }), i * 0.15)
  );
  return mix(...parts);
})());

// ─── streak: exciting ascending scale ──────────────────────────
{
  const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
  const parts = notes.map((f, i) =>
    padStart(generate(0.14, (t) => {
      const e = envelope(t, 0.008, 0.03, 0.5, 0.05, 0.14);
      return (tri(f, t) * 0.18 + sine(f * 2, t) * 0.05) * e;
    }), i * 0.08)
  );
  save("streak", mix(...parts));
}

// ─── mission-complete: victory melody ──────────────────────────
{
  const notes = [659.25, 783.99, 1046.5, 1318.5];
  const parts = notes.map((f, i) =>
    padStart(generate(0.18, (t) => {
      const e = envelope(t, 0.01, 0.04, 0.5, 0.06, 0.18);
      return sine(f, t) * 0.2 * e;
    }), i * 0.1)
  );
  const tail = padStart(generate(0.35, (t) => {
    const e = envelope(t, 0.02, 0.08, 0.4, 0.15, 0.35);
    return (sine(1046.5, t) + sine(1318.5, t)) * 0.06 * e;
  }), 0.42);
  save("mission-complete", mix(...parts, tail));
}

// ─── star: sparkle ─────────────────────────────────────────────
save("star", generate(0.18, (t) => {
  const e = envelope(t, 0.005, 0.03, 0.4, 0.08, 0.18);
  const f = 1568 + Math.sin(t * 80) * 200;
  return (sine(f, t) * 0.25 + sine(f * 2, t) * 0.08 + (Math.random() * 2 - 1) * 0.03) * e;
}));

// ─── timer: short tick ─────────────────────────────────────────
save("timer", generate(0.06, (t) => {
  const e = envelope(t, 0.002, 0.015, 0.3, 0.02, 0.06);
  return sq(1000, t) * 0.15 * e;
}));

// ─── countdown: tick/final ─────────────────────────────────────
save("countdown", generate(0.1, (t) => {
  const e = envelope(t, 0.003, 0.02, 0.4, 0.04, 0.1);
  return sq(800, t) * 0.15 * e;
}));

console.log("\n✅ All sound effects generated in public/sounds/");
