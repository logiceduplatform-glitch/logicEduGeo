// Public profiles: a small, sharable subset of user data viewable by anyone.
// Stored at publicProfiles/{uid}. Owner writes, public reads.

import { db } from "../auth/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const COL = "publicProfiles";

export const PublicProfileService = {
  /** Fetch a public profile by uid. */
  async get(uid) {
    if (!uid) return null;
    try {
      const snap = await getDoc(doc(db, COL, uid));
      return snap.exists() ? { uid, ...snap.data() } : null;
    } catch {
      return null;
    }
  },

  /** Update / publish profile. */
  async publish(uid, data) {
    if (!uid) throw new Error("auth-required");
    await setDoc(
      doc(db, COL, uid),
      {
        ...data,
        uid,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  /** Auto-sync key stats from local progress (call after game completion). */
  async syncFromLocal(uid, opts = {}) {
    if (!uid) return;
    try {
      const stats = JSON.parse(localStorage.getItem("progressStats") || "{}");
      const xp = parseInt(localStorage.getItem("geo:xp") || "0", 10) || 0;
      const coins = parseInt(localStorage.getItem("geo:coins") || "0", 10) || 0;
      const streak = parseInt(localStorage.getItem("geo:streak") || "0", 10) || 0;
      const badges = JSON.parse(localStorage.getItem("geo:badges") || "[]");
      const certificates = JSON.parse(localStorage.getItem("geo:certificates") || "[]");
      const country = localStorage.getItem("geo:country") || "";

      const payload = {
        ...opts,
        stats: {
          totalGames: stats.totalGamesPlayed || 0,
          totalCorrect: stats.totalCorrect || 0,
          totalAttempts: stats.totalAttempts || 0,
          xp,
          coins,
          streak,
          level: Math.floor(Math.sqrt(xp / 50)) + 1,
        },
        badgeCount: Array.isArray(badges) ? badges.length : 0,
        certificateCount: Array.isArray(certificates) ? certificates.length : 0,
        country,
      };
      await this.publish(uid, payload);
    } catch {
      // best-effort
    }
  },
};
