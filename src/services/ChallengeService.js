// Friend Challenges — async 1v1 quiz dueling.
//
// Flow:
//   1) Player A picks a quiz/topic and a "challenge" doc is created in
//      Firestore at /challenges/{id} with fromUid + score + answers.
//   2) Player A shares a link or a 6-char code with Player B.
//   3) Player B opens the link, plays the SAME questions, submits their
//      score; the doc is updated and both can see the result.
//
// Firestore shape:
//   {
//     fromUid, fromName, fromScore, fromAnswers, fromTimeMs,
//     toUid?, toName?, toScore?, toAnswers?, toTimeMs?,
//     topic, questionIds, status: "open"|"completed",
//     createdAt, completedAt?
//   }

import { db, auth } from "../auth/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  serverTimestamp,
} from "firebase/firestore";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function genCode(len = 6) {
  return Array.from({ length: len }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

export const ChallengeService = {
  /**
   * Create a challenge from the current user. Returns the new doc id (== code).
   */
  async create({ topic, questionIds, fromName, fromScore, fromAnswers, fromTimeMs }) {
    const user = auth?.currentUser;
    if (!user || !db) return { ok: false, reason: "auth_required" };

    const code = genCode(6);
    try {
      await setDoc(doc(db, "challenges", code), {
        code,
        fromUid: user.uid,
        fromName: fromName || user.displayName || "Player 1",
        fromScore: Number(fromScore) || 0,
        fromAnswers: fromAnswers || [],
        fromTimeMs: Number(fromTimeMs) || 0,
        topic: topic || "general",
        questionIds: questionIds || [],
        status: "open",
        createdAt: serverTimestamp(),
      });
      return { ok: true, code };
    } catch (e) {
      console.warn("[Challenge] create failed", e);
      return { ok: false, reason: "write_failed" };
    }
  },

  /**
   * Look up a challenge by code. Returns null if not found / expired.
   */
  async getByCode(code) {
    if (!code || !db) return null;
    try {
      const ref = doc(db, "challenges", String(code).toUpperCase());
      const snap = await getDoc(ref);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (e) {
      console.warn("[Challenge] getByCode failed", e);
      return null;
    }
  },

  /**
   * Submit player B's response. The original doc is upgraded to "completed".
   */
  async submit({ code, toName, toScore, toAnswers, toTimeMs }) {
    const user = auth?.currentUser;
    if (!user || !db) return { ok: false, reason: "auth_required" };

    try {
      await updateDoc(doc(db, "challenges", String(code).toUpperCase()), {
        toUid: user.uid,
        toName: toName || user.displayName || "Player 2",
        toScore: Number(toScore) || 0,
        toAnswers: toAnswers || [],
        toTimeMs: Number(toTimeMs) || 0,
        status: "completed",
        completedAt: serverTimestamp(),
      });
      return { ok: true };
    } catch (e) {
      console.warn("[Challenge] submit failed", e);
      return { ok: false, reason: "write_failed" };
    }
  },

  /**
   * List recent challenges where the current user is either side.
   * Used by the "My challenges" tab.
   */
  async listForCurrentUser(maxItems = 20) {
    const user = auth?.currentUser;
    if (!user || !db) return [];
    try {
      // Two queries (Firestore can't OR on different fields easily) and merge.
      const fromQ = query(
        collection(db, "challenges"),
        where("fromUid", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(maxItems),
      );
      const toQ = query(
        collection(db, "challenges"),
        where("toUid", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(maxItems),
      );
      const [fromSnap, toSnap] = await Promise.all([getDocs(fromQ), getDocs(toQ)]);
      const map = new Map();
      [...fromSnap.docs, ...toSnap.docs].forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
      return Array.from(map.values()).sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
    } catch (e) {
      console.warn("[Challenge] list failed", e);
      return [];
    }
  },

  /**
   * Build a shareable URL for a challenge.
   */
  buildShareUrl(code) {
    return `${window.location.origin}/challenges?code=${encodeURIComponent(code)}`;
  },
};

export default ChallengeService;
