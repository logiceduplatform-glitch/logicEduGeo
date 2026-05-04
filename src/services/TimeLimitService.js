import { StorageService } from "./StorageService";
import { ProfileService } from "./ProfileService";

const LIMITS_KEY = "geo:timeLimits";
const SESSION_KEY = "geo:sessionStart";
const DAILY_USAGE_KEY = "geo:dailyUsage";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const TimeLimitService = {
  getLimits() {
    return StorageService.get(LIMITS_KEY) || {};
  },

  setLimit(childId, { dailyMinutes = 0, enabled = false }) {
    const limits = this.getLimits();
    limits[childId] = { dailyMinutes, enabled };
    StorageService.set(LIMITS_KEY, limits);
  },

  removeLimit(childId) {
    const limits = this.getLimits();
    delete limits[childId];
    StorageService.set(LIMITS_KEY, limits);
  },

  getChildLimit(childId) {
    const limits = this.getLimits();
    return limits[childId] || { dailyMinutes: 30, enabled: false };
  },

  startSession() {
    if (!localStorage.getItem(SESSION_KEY)) {
      localStorage.setItem(SESSION_KEY, Date.now().toString());
    }
  },

  getSessionStart() {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? parseInt(s, 10) : Date.now();
  },

  endSession() {
    const start = this.getSessionStart();
    const elapsed = Math.floor((Date.now() - start) / 60000);
    if (elapsed > 0) {
      this._addUsage(elapsed);
    }
    localStorage.removeItem(SESSION_KEY);
  },

  _addUsage(minutes) {
    const today = todayStr();
    const activeId = ProfileService.getActiveId();
    if (!activeId) return;

    const usage = StorageService.get(DAILY_USAGE_KEY) || {};
    const key = `${activeId}:${today}`;
    usage[key] = (usage[key] || 0) + minutes;
    StorageService.set(DAILY_USAGE_KEY, usage);
  },

  getTodayUsage(childId) {
    const today = todayStr();
    const usage = StorageService.get(DAILY_USAGE_KEY) || {};
    return usage[`${childId}:${today}`] || 0;
  },

  getRemainingMinutes(childId) {
    const limit = this.getChildLimit(childId);
    if (!limit.enabled) return Infinity;
    const used = this.getTodayUsage(childId);
    return Math.max(0, limit.dailyMinutes - used);
  },

  isTimeLimitReached(childId) {
    if (!childId) return false;
    const limit = this.getChildLimit(childId);
    if (!limit.enabled) return false;
    return this.getRemainingMinutes(childId) <= 0;
  },

  tickSession() {
    const activeId = ProfileService.getActiveId();
    if (!activeId) return;
    const start = this.getSessionStart();
    const elapsed = Math.floor((Date.now() - start) / 60000);
    if (elapsed >= 1) {
      this._addUsage(elapsed);
      localStorage.setItem(SESSION_KEY, Date.now().toString());
    }
  },

  getUsageHistory(childId, days = 7) {
    const usage = StorageService.get(DAILY_USAGE_KEY) || {};
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      result.push({ date: ds, minutes: usage[`${childId}:${ds}`] || 0 });
    }
    return result;
  },

  // ── Schedule windows ────────────────────────────────────────────
  // A "schedule" lets parents say e.g. "no play before 8am or after 9pm".
  // Stored on the same per-child limit object: { schedule: { start, end } }
  // where start/end are HH:MM strings. End < start means overnight is OK.
  setSchedule(childId, schedule) {
    const limits = this.getLimits();
    limits[childId] = { ...this.getChildLimit(childId), schedule };
    StorageService.set(LIMITS_KEY, limits);
  },

  getSchedule(childId) {
    return this.getChildLimit(childId).schedule || null;
  },

  isWithinSchedule(childId, now = new Date()) {
    const sched = this.getSchedule(childId);
    if (!sched || !sched.start || !sched.end) return true;
    const minutes = now.getHours() * 60 + now.getMinutes();
    const [sH, sM] = sched.start.split(":").map(Number);
    const [eH, eM] = sched.end.split(":").map(Number);
    const startM = sH * 60 + sM;
    const endM = eH * 60 + eM;
    if (startM <= endM) return minutes >= startM && minutes <= endM;
    // Window crosses midnight: e.g. 20:00 → 02:00
    return minutes >= startM || minutes <= endM;
  },

  // Aggregate usage across all children — used by parent dashboard.
  getAllChildrenUsage(days = 7) {
    const profiles = ProfileService.getAll();
    return profiles.map((p) => ({
      child: p,
      todayMinutes: this.getTodayUsage(p.id),
      limit: this.getChildLimit(p.id),
      remaining: this.getRemainingMinutes(p.id),
      schedule: this.getSchedule(p.id),
      history: this.getUsageHistory(p.id, days),
      withinSchedule: this.isWithinSchedule(p.id),
    }));
  },

  cleanOldData() {
    const usage = StorageService.get(DAILY_USAGE_KEY) || {};
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const cleaned = {};
    for (const [k, v] of Object.entries(usage)) {
      const date = k.split(":").pop();
      if (date >= cutoffStr) cleaned[k] = v;
    }
    StorageService.set(DAILY_USAGE_KEY, cleaned);
  },
};
