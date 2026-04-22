import { ApiService } from "./ApiService";
import { StorageService } from "./StorageService";
import { ProfileService } from "./ProfileService";

let syncInProgress = false;
let pendingQueue = [];
let flushTimer = null;

function withParentScope(fn) {
  const savedScope = StorageService.getScope();
  StorageService.setScope(null);
  try {
    return fn();
  } finally {
    if (savedScope) {
      const id = savedScope.replace("profile:", "").replace(/:$/, "");
      StorageService.setScope(id);
    }
  }
}

function collectLocalData() {
  const profiles = ProfileService.getAll().map((p) => ({
    client_id: p.id,
    name: p.name,
    age: p.age,
    avatar: p.avatar,
    objective: p.objective,
  }));

  const favorites = StorageService.get("progress:favorites") || [];
  const progress = StorageService.getAll("progress:game:");
  const cleanProgress = {};
  for (const [key, value] of Object.entries(progress)) {
    const gameId = key.replace("progress:game:", "");
    cleanProgress[gameId] = value;
  }

  const statKeys = [
    "stats:streak",
    "stats:overall",
    "stats:xp",
    "achievements:unlocked",
  ];
  const stats = {};
  for (const sk of statKeys) {
    const val = StorageService.get(sk);
    if (val !== null) stats[sk] = val;
  }

  const allDaily = StorageService.getAll("stats:daily:");
  for (const [key, value] of Object.entries(allDaily)) {
    stats[key] = value;
  }
  const allMonthly = StorageService.getAll("stats:monthly:");
  for (const [key, value] of Object.entries(allMonthly)) {
    stats[key] = value;
  }

  let quizzes = [];
  try {
    quizzes = JSON.parse(localStorage.getItem("geo:customQuizzes")) || [];
  } catch { /* empty */ }

  return { profiles, favorites, progress: cleanProgress, stats, quizzes };
}

function applyCloudData(cloud) {
  if (!cloud) return;

  if (cloud.profiles?.length) {
    const existing = ProfileService.getAll();
    for (const cp of cloud.profiles) {
      const localId = cp.id || cp.client_id;
      if (!existing.find((p) => p.id === localId)) {
        const profiles = JSON.parse(
          localStorage.getItem("geo:childProfiles") || "[]"
        );
        profiles.push({
          id: localId,
          name: cp.name,
          age: cp.age,
          avatar: cp.avatar,
          objective: cp.objective,
          createdAt: cp.createdAt || cp.created_at,
        });
        localStorage.setItem("geo:childProfiles", JSON.stringify(profiles));
      }
    }
  }

  if (cloud.favorites?.length) {
    const localFavs = StorageService.get("progress:favorites") || [];
    const merged = [...new Set([...localFavs, ...cloud.favorites])];
    StorageService.set("progress:favorites", merged);
  }

  if (cloud.progress) {
    for (const [gameId, data] of Object.entries(cloud.progress)) {
      const localData = StorageService.get(`progress:game:${gameId}`);
      if (
        !localData ||
        (data.lastPlayedAt &&
          (!localData.lastPlayedAt ||
            data.lastPlayedAt > localData.lastPlayedAt))
      ) {
        StorageService.set(`progress:game:${gameId}`, data);
      }
    }
  }

  if (cloud.stats) {
    for (const [key, data] of Object.entries(cloud.stats)) {
      const localVal = StorageService.get(key);
      if (!localVal) {
        StorageService.set(key, data);
      }
    }
  }

  if (cloud.quizzes?.length) {
    let localQuizzes = [];
    try {
      localQuizzes =
        JSON.parse(localStorage.getItem("geo:customQuizzes")) || [];
    } catch { /* empty */ }
    const localIds = new Set(localQuizzes.map((q) => q.id));
    for (const q of cloud.quizzes) {
      if (!localIds.has(q.id)) {
        localQuizzes.push(q);
      }
    }
    localStorage.setItem("geo:customQuizzes", JSON.stringify(localQuizzes));
  }
}

export const SyncService = {
  async fullSync() {
    if (!ApiService.isAvailable() || syncInProgress) return;
    syncInProgress = true;

    try {
      const pullRes = await ApiService.pullAll();
      if (pullRes.ok && pullRes.data) {
        withParentScope(() => applyCloudData(pullRes.data));
      }

      const localData = withParentScope(() => collectLocalData());
      await ApiService.pushAll(localData);
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[SyncService] Full sync failed:", e);
    } finally {
      syncInProgress = false;
    }
  },

  enqueue(action) {
    if (!ApiService.isAvailable()) return;
    pendingQueue.push(action);
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => this._flush(), 300);
  },

  async _flush() {
    if (!ApiService.isAvailable() || syncInProgress) return;

    const batch = [...pendingQueue];
    pendingQueue = [];
    if (!batch.length) return;

    for (const action of batch) {
      try {
        await action();
      } catch (e) {
        if (import.meta.env.DEV) console.warn("[SyncService] Queued action failed:", e);
      }
    }
  },

  syncProgress(gameId, data) {
    this.enqueue(() => ApiService.saveProgress(gameId, data));
  },

  syncFavoriteAdd(gameId) {
    this.enqueue(() => {
      const favs = withParentScope(() => StorageService.get("progress:favorites") || []);
      return ApiService.saveFavorites(favs);
    });
  },

  syncFavoriteRemove(gameId) {
    this.enqueue(() => {
      const favs = withParentScope(() => StorageService.get("progress:favorites") || []);
      return ApiService.saveFavorites(favs);
    });
  },

  syncStat(key, data) {
    this.enqueue(() => ApiService.saveStat(key, data));
  },

  syncProfile(profile) {
    this.enqueue(() => ApiService.saveProfile(profile));
  },

  syncProfileDelete(clientId) {
    this.enqueue(() => ApiService.deleteProfile(clientId));
  },

  syncQuiz(quiz) {
    this.enqueue(() => ApiService.saveQuiz(quiz));
  },

  syncQuizDelete(clientId) {
    this.enqueue(() => ApiService.deleteQuiz(clientId));
  },
};
