// Lightweight guest trial manager using localStorage

const STORAGE_KEY = "guestTrial/v1";

const DEFAULTS = {
  minutes: 10,   // χρόνος
  plays: 2       // αριθμός sessions (π.χ. Tests ή Category plays)
};

export function startGuestTrial(overrides = {}) {
  const now = Date.now();
  const minutes = overrides.minutes ?? DEFAULTS.minutes;
  const plays = overrides.plays ?? DEFAULTS.plays;

  const trial = {
    startedAt: now,
    expiresAt: now + minutes * 60_000,
    totalPlays: plays,
    playsLeft: plays
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trial));
  return trial;
}

export function getGuestTrial() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const t = JSON.parse(raw);
    return t;
  } catch {
    return null;
  }
}

export function clearGuestTrial() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isGuestActive() {
  const t = getGuestTrial();
  if (!t) return false;
  if (Date.now() > t.expiresAt) {
    clearGuestTrial();
    return false;
  }
  if (t.playsLeft <= 0) return false;
  return true;
}

export function timeLeftMs() {
  const t = getGuestTrial();
  if (!t) return 0;
  return Math.max(0, t.expiresAt - Date.now());
}

export function consumeGuestPlay() {
  const t = getGuestTrial();
  if (!t) return false;
  if (Date.now() > t.expiresAt) {
    clearGuestTrial();
    return false;
  }
  if (t.playsLeft <= 0) return false;
  const updated = { ...t, playsLeft: t.playsLeft - 1 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
}
