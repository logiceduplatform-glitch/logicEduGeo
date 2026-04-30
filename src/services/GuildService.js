// Guilds / Crews: small groups (3-20 members) with collective stats.
// Uses Firestore: `guilds/{id}` + `guildMembers/{id}` (membership docs).

import { db } from "../auth/firebase";
import {
  doc, collection, setDoc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, limit, serverTimestamp, deleteDoc, increment,
} from "firebase/firestore";

const GUILDS = "guilds";
const MEMBERS = "guildMembers";

function randomTag() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export const GuildService = {
  /** Create a new guild. Owner becomes first member. */
  async createGuild({ uid, ownerName, name, emoji = "🛡️", description = "" }) {
    if (!uid) throw new Error("auth-required");
    if (!name?.trim()) throw new Error("name-required");
    const ref = await addDoc(collection(db, GUILDS), {
      name: name.trim().slice(0, 40),
      emoji,
      description: description.trim().slice(0, 200),
      tag: randomTag(),
      ownerUid: uid,
      memberCount: 1,
      totalScore: 0,
      totalGames: 0,
      createdAt: serverTimestamp(),
    });
    // Add owner as member
    await this._addMember(ref.id, uid, ownerName, "owner");
    return ref.id;
  },

  async _addMember(guildId, uid, name, role = "member") {
    const memberId = `${guildId}_${uid}`;
    await setDoc(doc(db, MEMBERS, memberId), {
      guildId,
      uid,
      name: name || "Member",
      role,
      score: 0,
      gamesPlayed: 0,
      joinedAt: serverTimestamp(),
    });
  },

  async joinGuild({ guildId, uid, name }) {
    if (!uid) throw new Error("auth-required");
    const guildRef = doc(db, GUILDS, guildId);
    const snap = await getDoc(guildRef);
    if (!snap.exists()) throw new Error("not-found");
    const data = snap.data();
    if ((data.memberCount || 0) >= 20) throw new Error("guild-full");

    // Check if already a member
    const existing = await getDoc(doc(db, MEMBERS, `${guildId}_${uid}`));
    if (existing.exists()) return guildId;

    await this._addMember(guildId, uid, name);
    await updateDoc(guildRef, { memberCount: increment(1) });
    return guildId;
  },

  async leaveGuild({ guildId, uid }) {
    if (!uid) throw new Error("auth-required");
    const memberId = `${guildId}_${uid}`;
    const memberDoc = await getDoc(doc(db, MEMBERS, memberId));
    if (!memberDoc.exists()) return;
    if (memberDoc.data().role === "owner") throw new Error("owner-cannot-leave");
    await deleteDoc(doc(db, MEMBERS, memberId));
    await updateDoc(doc(db, GUILDS, guildId), { memberCount: increment(-1) });
  },

  async getGuild(guildId) {
    const snap = await getDoc(doc(db, GUILDS, guildId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getMembers(guildId) {
    const q = query(collection(db, MEMBERS), where("guildId", "==", guildId), orderBy("score", "desc"), limit(25));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Find guilds by name (prefix). */
  async searchGuilds(searchTerm = "") {
    const q = searchTerm
      ? query(collection(db, GUILDS), orderBy("name"), limit(50))
      : query(collection(db, GUILDS), orderBy("totalScore", "desc"), limit(20));
    const snap = await getDocs(q);
    let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      results = results.filter((g) => (g.name || "").toLowerCase().includes(t) || (g.tag || "").toLowerCase().includes(t));
    }
    return results.slice(0, 20);
  },

  /** Find user's guilds. */
  async getMyGuilds(uid) {
    if (!uid) return [];
    const q = query(collection(db, MEMBERS), where("uid", "==", uid));
    const snap = await getDocs(q);
    const guildIds = snap.docs.map((d) => d.data().guildId);
    if (!guildIds.length) return [];
    const guilds = await Promise.all(guildIds.map((id) => this.getGuild(id)));
    return guilds.filter(Boolean);
  },

  /** Add score to user's guild contribution. */
  async addScore({ guildId, uid, score = 0, games = 1 }) {
    if (!guildId || !uid || !score) return;
    try {
      await updateDoc(doc(db, MEMBERS, `${guildId}_${uid}`), {
        score: increment(score),
        gamesPlayed: increment(games),
      });
      await updateDoc(doc(db, GUILDS, guildId), {
        totalScore: increment(score),
        totalGames: increment(games),
      });
    } catch {}
  },

  /** Top guilds leaderboard. */
  async getTopGuilds(count = 20) {
    const q = query(collection(db, GUILDS), orderBy("totalScore", "desc"), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};
