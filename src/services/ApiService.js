import { auth, db } from "../auth/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";

const devWarn = (...args) => { if (import.meta.env.DEV) console.warn(...args); };

function uid() {
  return auth?.currentUser?.uid || null;
}

function userDoc(path) {
  const u = uid();
  if (!u || !db) return null;
  return doc(db, "users", u, ...path.split("/").filter(Boolean));
}

export const ApiService = {
  clearTokenCache() { /* no-op for Firestore */ },

  isAvailable() {
    return !!(auth?.currentUser && db);
  },

  // ─── Profiles ───────────────────────────────────────────
  async getProfiles() {
    const u = uid();
    if (!u || !db) return { ok: false, data: [] };
    try {
      const snap = await getDocs(collection(db, "users", u, "profiles"));
      const profiles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return { ok: true, data: profiles };
    } catch (e) {
      devWarn("[ApiService] getProfiles:", e);
      return { ok: false, data: [] };
    }
  },

  async saveProfile(profile) {
    const ref = userDoc(`profiles/${profile.id}`);
    if (!ref) return { ok: false };
    try {
      await setDoc(ref, {
        name: profile.name || "",
        age: profile.age || "",
        avatar: profile.avatar || "",
        objective: profile.objective || "",
        createdAt: profile.createdAt || new Date().toISOString(),
      }, { merge: true });
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] saveProfile:", e);
      return { ok: false };
    }
  },

  async deleteProfile(clientId) {
    const ref = userDoc(`profiles/${clientId}`);
    if (!ref) return { ok: false };
    try {
      await deleteDoc(ref);
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] deleteProfile:", e);
      return { ok: false };
    }
  },

  // ─── Progress ───────────────────────────────────────────
  async saveProgress(gameId, data) {
    const ref = userDoc(`progress/${gameId}`);
    if (!ref) return { ok: false };
    try {
      await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] saveProgress:", e);
      return { ok: false };
    }
  },

  async getAllProgress() {
    const u = uid();
    if (!u || !db) return { ok: false, data: {} };
    try {
      const snap = await getDocs(collection(db, "users", u, "progress"));
      const result = {};
      snap.docs.forEach((d) => { result[d.id] = d.data(); });
      return { ok: true, data: result };
    } catch (e) {
      devWarn("[ApiService] getAllProgress:", e);
      return { ok: false, data: {} };
    }
  },

  // ─── Favorites ──────────────────────────────────────────
  async saveFavorites(favoritesList) {
    const ref = userDoc("data/favorites");
    if (!ref) return { ok: false };
    try {
      await setDoc(ref, { list: favoritesList });
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] saveFavorites:", e);
      return { ok: false };
    }
  },

  async getFavorites() {
    const ref = userDoc("data/favorites");
    if (!ref) return { ok: false, data: [] };
    try {
      const snap = await getDoc(ref);
      return { ok: true, data: snap.exists() ? snap.data().list || [] : [] };
    } catch (e) {
      devWarn("[ApiService] getFavorites:", e);
      return { ok: false, data: [] };
    }
  },

  // ─── Stats ──────────────────────────────────────────────
  async saveStat(key, data) {
    const safeKey = key.replace(/:/g, "_");
    const ref = userDoc(`stats/${safeKey}`);
    if (!ref) return { ok: false };
    try {
      await setDoc(ref, { value: data, updatedAt: new Date().toISOString() });
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] saveStat:", e);
      return { ok: false };
    }
  },

  async getAllStats() {
    const u = uid();
    if (!u || !db) return { ok: false, data: {} };
    try {
      const snap = await getDocs(collection(db, "users", u, "stats"));
      const result = {};
      snap.docs.forEach((d) => {
        const originalKey = d.id.replace(/_/g, ":");
        result[originalKey] = d.data().value;
      });
      return { ok: true, data: result };
    } catch (e) {
      devWarn("[ApiService] getAllStats:", e);
      return { ok: false, data: {} };
    }
  },

  // ─── Custom Quizzes ─────────────────────────────────────
  async saveQuiz(quiz) {
    const ref = userDoc(`quizzes/${quiz.id}`);
    if (!ref) return { ok: false };
    try {
      await setDoc(ref, {
        title: quiz.title,
        questions: quiz.questions,
        updatedAt: new Date().toISOString(),
      });
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] saveQuiz:", e);
      return { ok: false };
    }
  },

  async getQuizzes() {
    const u = uid();
    if (!u || !db) return { ok: false, data: [] };
    try {
      const snap = await getDocs(collection(db, "users", u, "quizzes"));
      return {
        ok: true,
        data: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
      };
    } catch (e) {
      devWarn("[ApiService] getQuizzes:", e);
      return { ok: false, data: [] };
    }
  },

  async deleteQuiz(clientId) {
    const ref = userDoc(`quizzes/${clientId}`);
    if (!ref) return { ok: false };
    try {
      await deleteDoc(ref);
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] deleteQuiz:", e);
      return { ok: false };
    }
  },

  // ─── Stripe Checkout ───────────────────────────────────
  async createCheckoutSession(plan, period = "monthly") {
    const baseUrl = import.meta.env.VITE_STRIPE_API_URL;
    if (!baseUrl || !auth?.currentUser) return { ok: false, error: "Not configured" };

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${baseUrl}/stripe-checkout.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan, period }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error || "Checkout failed" };
      return { ok: true, url: data.url, sessionId: data.session_id };
    } catch (e) {
      devWarn("[ApiService] createCheckoutSession:", e);
      return { ok: false, error: e.message };
    }
  },

  // ─── Subscription Status ─────────────────────────────
  async getSubscription() {
    const ref = userDoc("data/subscription");
    if (!ref) return { ok: false, data: null };
    try {
      const snap = await getDoc(ref);
      return { ok: true, data: snap.exists() ? snap.data() : null };
    } catch (e) {
      devWarn("[ApiService] getSubscription:", e);
      return { ok: false, data: null };
    }
  },

  // ─── Bulk Sync ──────────────────────────────────────────
  async pullAll() {
    if (!this.isAvailable()) return { ok: false, data: null };
    try {
      const [profiles, progress, favorites, stats, quizzes] = await Promise.all([
        this.getProfiles(),
        this.getAllProgress(),
        this.getFavorites(),
        this.getAllStats(),
        this.getQuizzes(),
      ]);
      return {
        ok: true,
        data: {
          profiles: profiles.data || [],
          progress: progress.data || {},
          favorites: favorites.data || [],
          stats: stats.data || {},
          quizzes: quizzes.data || [],
        },
      };
    } catch (e) {
      devWarn("[ApiService] pullAll:", e);
      return { ok: false, data: null };
    }
  },

  async pushAll(localData) {
    if (!this.isAvailable()) return { ok: false };
    try {
      const promises = [];

      if (localData.profiles?.length) {
        for (const p of localData.profiles) {
          promises.push(this.saveProfile({ id: p.client_id || p.id, ...p }));
        }
      }

      if (localData.favorites?.length) {
        promises.push(this.saveFavorites(localData.favorites));
      }

      if (localData.progress) {
        for (const [gameId, data] of Object.entries(localData.progress)) {
          promises.push(this.saveProgress(gameId, data));
        }
      }

      if (localData.stats) {
        for (const [key, data] of Object.entries(localData.stats)) {
          promises.push(this.saveStat(key, data));
        }
      }

      if (localData.quizzes?.length) {
        for (const q of localData.quizzes) {
          promises.push(this.saveQuiz(q));
        }
      }

      await Promise.all(promises);
      return { ok: true };
    } catch (e) {
      devWarn("[ApiService] pushAll:", e);
      return { ok: false };
    }
  },
};
