// Real-time PvP Quiz Battles via Firestore.
// Two players join a "battle" doc. Each round, current question + each player's answer is synced.
// Server timestamps + listeners give real-time updates.

import { db } from "../auth/firebase";
import {
  doc, collection, setDoc, updateDoc, getDoc, onSnapshot,
  serverTimestamp, deleteDoc, query, where, getDocs, limit, orderBy,
} from "firebase/firestore";

const COL = "onlineBattles";
const Q_BANK = [
  // Lightweight default bank — can be replaced by importing from MultiplayerService.
  { q: { el: "Πόσα πόδια έχει η αράχνη;", en: "How many legs does a spider have?" }, options: [{ el: "6", en: "6" }, { el: "8", en: "8" }, { el: "10", en: "10" }, { el: "4", en: "4" }], answer: 1 },
  { q: { el: "Ποιο είναι το μεγαλύτερο ωκεάνιο;", en: "What is the largest ocean?" }, options: [{ el: "Ατλαντικός", en: "Atlantic" }, { el: "Ινδικός", en: "Indian" }, { el: "Ειρηνικός", en: "Pacific" }, { el: "Αρκτικός", en: "Arctic" }], answer: 2 },
  { q: { el: "Πόσα χρώματα έχει το ουράνιο τόξο;", en: "How many colors in a rainbow?" }, options: [{ el: "5", en: "5" }, { el: "6", en: "6" }, { el: "7", en: "7" }, { el: "8", en: "8" }], answer: 2 },
  { q: { el: "Ποιο ζώο είναι το πιο γρήγορο;", en: "What is the fastest animal?" }, options: [{ el: "Λιοντάρι", en: "Lion" }, { el: "Γατόπαρδος", en: "Cheetah" }, { el: "Αετός", en: "Eagle" }, { el: "Δελφίνι", en: "Dolphin" }], answer: 1 },
  { q: { el: "Πόσοι πλανήτες έχει το ηλιακό μας σύστημα;", en: "How many planets in our solar system?" }, options: [{ el: "7", en: "7" }, { el: "8", en: "8" }, { el: "9", en: "9" }, { el: "10", en: "10" }], answer: 1 },
  { q: { el: "Ποιο είναι το χημικό σύμβολο του νερού;", en: "Chemical symbol for water?" }, options: [{ el: "CO2", en: "CO2" }, { el: "H2O", en: "H2O" }, { el: "O2", en: "O2" }, { el: "NaCl", en: "NaCl" }], answer: 1 },
  { q: { el: "Σε ποια ήπειρο είναι η Βραζιλία;", en: "Continent of Brazil?" }, options: [{ el: "Αφρική", en: "Africa" }, { el: "Ασία", en: "Asia" }, { el: "Ν. Αμερική", en: "S. America" }, { el: "Ευρώπη", en: "Europe" }], answer: 2 },
  { q: { el: "Πόσα δόντια έχει ένας ενήλικας;", en: "How many teeth does an adult have?" }, options: [{ el: "28", en: "28" }, { el: "30", en: "30" }, { el: "32", en: "32" }, { el: "34", en: "34" }], answer: 2 },
  { q: { el: "Ποιος ζωγράφισε τη Μόνα Λίζα;", en: "Who painted the Mona Lisa?" }, options: [{ el: "Πικάσο", en: "Picasso" }, { el: "Ντα Βίντσι", en: "Da Vinci" }, { el: "Μιχαήλ Άγγελος", en: "Michelangelo" }, { el: "Βαν Γκογκ", en: "Van Gogh" }], answer: 1 },
  { q: { el: "5 + 7 = ?", en: "5 + 7 = ?" }, options: [{ el: "10", en: "10" }, { el: "11", en: "11" }, { el: "12", en: "12" }, { el: "13", en: "13" }], answer: 2 },
  { q: { el: "9 × 6 = ?", en: "9 × 6 = ?" }, options: [{ el: "48", en: "48" }, { el: "54", en: "54" }, { el: "56", en: "56" }, { el: "63", en: "63" }], answer: 1 },
  { q: { el: "Ποια χώρα έχει πρωτεύουσα το Παρίσι;", en: "Which country has Paris as capital?" }, options: [{ el: "Ισπανία", en: "Spain" }, { el: "Ιταλία", en: "Italy" }, { el: "Γαλλία", en: "France" }, { el: "Γερμανία", en: "Germany" }], answer: 2 },
];

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function pickQuestions(count = 5) {
  return [...Q_BANK].sort(() => Math.random() - 0.5).slice(0, count);
}

export const OnlineBattleService = {
  /**
   * Create a new battle. Caller becomes player1 (host).
   * Returns the battle code.
   */
  async createBattle({ uid, name, avatar = "🦊", count = 5 }) {
    if (!uid) throw new Error("auth-required");
    const code = randomCode();
    const ref = doc(db, COL, code);
    await setDoc(ref, {
      code,
      status: "waiting", // waiting | playing | done
      currentRound: 0,
      totalRounds: count,
      questions: pickQuestions(count),
      player1: { uid, name: name || "Player 1", avatar, score: 0, ready: true },
      player2: null,
      answers: {}, // { "round_<n>_<uid>": optionIdx }
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });
    return code;
  },

  async joinBattle({ code, uid, name, avatar = "🐯" }) {
    if (!uid) throw new Error("auth-required");
    const ref = doc(db, COL, code);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("not-found");
    const data = snap.data();
    if (data.player1?.uid === uid) return code; // re-joining own battle
    if (data.player2 && data.player2.uid !== uid) throw new Error("battle-full");
    if (data.status !== "waiting") throw new Error("battle-started");
    await updateDoc(ref, {
      player2: { uid, name: name || "Player 2", avatar, score: 0, ready: true },
      lastActivity: serverTimestamp(),
    });
    return code;
  },

  /** Start the battle (host only). */
  async start(code) {
    const ref = doc(db, COL, code);
    await updateDoc(ref, { status: "playing", currentRound: 1, lastActivity: serverTimestamp() });
  },

  /** Submit an answer for current round. */
  async submitAnswer({ code, uid, round, optionIdx }) {
    const ref = doc(db, COL, code);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("not-found");
    const data = snap.data();
    if (data.currentRound !== round) return; // stale
    const key = `answers.round_${round}_${uid}`;
    const isCorrect = data.questions?.[round - 1]?.answer === optionIdx;

    const updates = { [key]: { optionIdx, correct: isCorrect, at: Date.now() }, lastActivity: serverTimestamp() };
    if (isCorrect) {
      const isP1 = data.player1?.uid === uid;
      const isP2 = data.player2?.uid === uid;
      if (isP1) updates["player1.score"] = (data.player1?.score || 0) + 1;
      if (isP2) updates["player2.score"] = (data.player2?.score || 0) + 1;
    }
    await updateDoc(ref, updates);
  },

  /** Move to next round (or finish). */
  async nextRound(code) {
    const ref = doc(db, COL, code);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data();
    const next = (data.currentRound || 0) + 1;
    if (next > (data.totalRounds || 5)) {
      await updateDoc(ref, { status: "done", lastActivity: serverTimestamp() });
    } else {
      await updateDoc(ref, { currentRound: next, lastActivity: serverTimestamp() });
    }
  },

  /** Subscribe to battle updates. */
  subscribe(code, callback) {
    const ref = doc(db, COL, code);
    return onSnapshot(ref, (snap) => {
      callback(snap.exists() ? snap.data() : null);
    });
  },

  /** Quick matchmaking: find a waiting battle or create one. */
  async findOrCreate({ uid, name, avatar }) {
    try {
      const q = query(
        collection(db, COL),
        where("status", "==", "waiting"),
        orderBy("createdAt", "asc"),
        limit(5)
      );
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        const data = d.data();
        // Skip own waiting rooms
        if (data.player1?.uid === uid) continue;
        if (data.player2) continue;
        try {
          await this.joinBattle({ code: d.id, uid, name, avatar });
          return d.id;
        } catch {
          // try next
        }
      }
    } catch {}
    return await this.createBattle({ uid, name, avatar });
  },

  async deleteBattle(code) {
    try { await deleteDoc(doc(db, COL, code)); } catch {}
  },
};
