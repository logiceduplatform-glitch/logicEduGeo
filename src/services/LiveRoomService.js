// Live Classroom — Kahoot-style synchronous quiz rooms.
//
// Strategy:
//   - The teacher creates a room and gets a 6-char join code shown on
//     the projector. The room doc lives at /liveRooms/{code}.
//   - Students open /live/{code} on their phones, type a name, and join.
//     Their entries land inside `players` (an object keyed by uid/anonId).
//   - Both sides subscribe to the doc via onSnapshot; the teacher
//     advances questions by updating `currentQ` + `phase`.
//
// Realtime via Firestore (not Realtime DB) keeps the dependency surface
// small. For 30-50 concurrent classroom users this is more than enough.

import { db, auth } from "../auth/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function genCode(len = 6) {
  return Array.from({ length: len }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

function makeAnonId() {
  const existing = sessionStorage.getItem("kibloo:anonId");
  if (existing) return existing;
  const id = "anon_" + Math.random().toString(36).slice(2, 10);
  try { sessionStorage.setItem("kibloo:anonId", id); } catch { /* */ }
  return id;
}

export const LiveRoomService = {
  /**
   * Host: create a new room with a question deck.
   * Returns { ok, code }.
   */
  async create({ topic, questions = [], hostName }) {
    const user = auth?.currentUser;
    if (!user || !db) return { ok: false, reason: "auth_required" };
    const code = genCode(6);
    try {
      await setDoc(doc(db, "liveRooms", code), {
        code,
        hostUid: user.uid,
        hostName: hostName || user.displayName || "Teacher",
        topic: topic || "general",
        questions: questions.slice(0, 30), // hard cap
        currentQ: -1, // -1 = lobby
        phase: "lobby", // lobby | question | results | done
        players: {}, // { [playerId]: { name, score, answers } }
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { ok: true, code };
    } catch (e) {
      console.warn("[LiveRoom] create failed", e);
      return { ok: false, reason: "write_failed" };
    }
  },

  /**
   * Subscribe to room updates. Returns the unsubscribe function.
   */
  subscribe(code, onUpdate) {
    if (!code || !db) return () => {};
    const ref = doc(db, "liveRooms", String(code).toUpperCase());
    return onSnapshot(
      ref,
      (snap) => onUpdate(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (err) => console.warn("[LiveRoom] snapshot error", err),
    );
  },

  /**
   * Player: join a room by code with a display name.
   * Returns the playerId used for subsequent actions.
   */
  async join(code, name) {
    if (!code || !db) return { ok: false, reason: "no_db" };
    const user = auth?.currentUser;
    const playerId = user?.uid || makeAnonId();
    try {
      await updateDoc(doc(db, "liveRooms", String(code).toUpperCase()), {
        [`players.${playerId}`]: {
          name: (name || "Player").slice(0, 20),
          score: 0,
          answers: {},
          joinedAt: Date.now(),
        },
        updatedAt: serverTimestamp(),
      });
      return { ok: true, playerId };
    } catch (e) {
      console.warn("[LiveRoom] join failed", e);
      return { ok: false, reason: "write_failed" };
    }
  },

  /**
   * Player: submit an answer for the current question.
   * Score is computed client-side and merged into the doc.
   */
  async answer({ code, playerId, qIdx, choice, correctChoice, timeMs = 0 }) {
    if (!db || playerId == null) return { ok: false };
    const isCorrect = choice === correctChoice;
    // Faster answers earn more (max 1000, decays over 20s).
    const speedBonus = Math.max(0, 1000 - Math.min(1000, Math.round(timeMs / 20)));
    const points = isCorrect ? 500 + speedBonus : 0;

    try {
      const ref = doc(db, "liveRooms", String(code).toUpperCase());
      // Read-modify-write: we need the current score. We do it via
      // updateDoc with a dotted path and FieldValue.increment if available.
      // To avoid extra dependency, we read first then write.
      const { getDoc } = await import("firebase/firestore");
      const snap = await getDoc(ref);
      if (!snap.exists()) return { ok: false };
      const data = snap.data();
      const player = (data.players || {})[playerId] || { score: 0, answers: {} };
      const newAnswers = { ...(player.answers || {}), [qIdx]: { choice, correct: isCorrect, timeMs, points } };
      const newScore = (player.score || 0) + points;

      await updateDoc(ref, {
        [`players.${playerId}.score`]: newScore,
        [`players.${playerId}.answers`]: newAnswers,
        updatedAt: serverTimestamp(),
      });
      return { ok: true, points, correct: isCorrect, totalScore: newScore };
    } catch (e) {
      console.warn("[LiveRoom] answer failed", e);
      return { ok: false };
    }
  },

  /**
   * Host: advance to the next question.
   */
  async next(code) {
    if (!db) return;
    try {
      const ref = doc(db, "liveRooms", String(code).toUpperCase());
      const { getDoc } = await import("firebase/firestore");
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      const nextIdx = (data.currentQ ?? -1) + 1;
      const phase = nextIdx >= (data.questions?.length || 0) ? "done" : "question";
      await updateDoc(ref, {
        currentQ: nextIdx,
        phase,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("[LiveRoom] next failed", e);
    }
  },

  /**
   * Host: reveal the leaderboard between questions.
   */
  async reveal(code) {
    if (!db) return;
    try {
      await updateDoc(doc(db, "liveRooms", String(code).toUpperCase()), {
        phase: "results",
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("[LiveRoom] reveal failed", e);
    }
  },

  /**
   * Host: close the room.
   */
  async close(code) {
    if (!db) return;
    try {
      await updateDoc(doc(db, "liveRooms", String(code).toUpperCase()), {
        phase: "done",
        closedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("[LiveRoom] close failed", e);
    }
  },

  /**
   * Host: kick a player.
   */
  async kick(code, playerId) {
    if (!db) return;
    try {
      await updateDoc(doc(db, "liveRooms", String(code).toUpperCase()), {
        [`players.${playerId}`]: deleteField(),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("[LiveRoom] kick failed", e);
    }
  },

  /**
   * Build the join URL students should open on their phones.
   */
  buildJoinUrl(code) {
    return `${window.location.origin}/live/${code}`;
  },
};

export default LiveRoomService;
