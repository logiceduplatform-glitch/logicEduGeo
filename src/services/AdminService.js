import { db } from "../auth/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
  addDoc,
  updateDoc,
} from "firebase/firestore";

// Hardcoded "super admin" - cannot be removed via UI.
const SUPER_ADMINS = [
  "logic.edu.platform@gmail.com",
];

const ADMINS_COLLECTION = "admins";
const FLAGS_COLLECTION = "featureFlags";
const ANNOUNCEMENTS_COLLECTION = "systemAnnouncements";
const LOGS_COLLECTION = "adminLogs";

let _cachedIsAdmin = null;
let _cachedUid = null;

export const AdminService = {
  SUPER_ADMINS,

  isSuperAdmin(user) {
    if (!user?.email) return false;
    return SUPER_ADMINS.includes(user.email.toLowerCase());
  },

  /**
   * Check if user is admin. Reads from Firestore + super admin list.
   * Also checks Firebase Auth custom claims if available.
   */
  async isAdmin(user) {
    if (!user) return false;
    if (this.isSuperAdmin(user)) return true;
    if (_cachedUid === user.uid && _cachedIsAdmin !== null) return _cachedIsAdmin;
    try {
      // Custom claims check
      if (typeof user.getIdTokenResult === "function") {
        try {
          const token = await user.getIdTokenResult();
          if (token?.claims?.admin === true) {
            _cachedUid = user.uid;
            _cachedIsAdmin = true;
            return true;
          }
        } catch {}
      }
      const ref = doc(db, ADMINS_COLLECTION, user.uid);
      const snap = await getDoc(ref);
      const ok = snap.exists() && snap.data()?.active !== false;
      _cachedUid = user.uid;
      _cachedIsAdmin = ok;
      return ok;
    } catch (e) {
      console.error("[AdminService] isAdmin failed", e);
      return false;
    }
  },

  clearCache() {
    _cachedIsAdmin = null;
    _cachedUid = null;
  },

  // ── Admins ──────────────────────────────────────────────
  async listAdmins() {
    try {
      const snap = await getDocs(collection(db, ADMINS_COLLECTION));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.error("[AdminService] listAdmins failed", e);
      return [];
    }
  },

  async addAdmin({ uid, email, name }, addedByEmail) {
    if (!uid) throw new Error("uid required");
    await setDoc(doc(db, ADMINS_COLLECTION, uid), {
      uid,
      email: email || "",
      name: name || "",
      active: true,
      addedAt: serverTimestamp(),
      addedBy: addedByEmail || "",
    });
    await this.log("admin.add", { targetUid: uid, targetEmail: email });
  },

  async removeAdmin(uid) {
    await deleteDoc(doc(db, ADMINS_COLLECTION, uid));
    await this.log("admin.remove", { targetUid: uid });
  },

  // ── Users ───────────────────────────────────────────────
  async listUsers({ limit = 100, role = null } = {}) {
    try {
      let q = collection(db, "users");
      if (role) {
        q = query(q, where("role", "==", role), fbLimit(limit));
      } else {
        q = query(q, fbLimit(limit));
      }
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.error("[AdminService] listUsers failed", e);
      return [];
    }
  },

  async setUserRole(uid, role) {
    await updateDoc(doc(db, "users", uid), { role, updatedAt: serverTimestamp() });
    await this.log("user.role.change", { targetUid: uid, role });
  },

  async banUser(uid, reason = "") {
    await updateDoc(doc(db, "users", uid), {
      banned: true,
      bannedAt: serverTimestamp(),
      banReason: reason,
    });
    await this.log("user.ban", { targetUid: uid, reason });
  },

  async unbanUser(uid) {
    await updateDoc(doc(db, "users", uid), {
      banned: false,
      banReason: "",
    });
    await this.log("user.unban", { targetUid: uid });
  },

  async setTeacherVerified(uid, verified) {
    await updateDoc(doc(db, "users", uid), {
      teacherVerified: !!verified,
      teacherVerifiedAt: verified ? serverTimestamp() : null,
    });
    await this.log("user.teacherVerify", { targetUid: uid, verified });
  },

  // ── Feature Flags ───────────────────────────────────────
  async listFlags() {
    try {
      const snap = await getDocs(collection(db, FLAGS_COLLECTION));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.error("[AdminService] listFlags failed", e);
      return [];
    }
  },

  async setFlag(id, enabled, meta = {}) {
    await setDoc(doc(db, FLAGS_COLLECTION, id), {
      id,
      enabled: !!enabled,
      updatedAt: serverTimestamp(),
      ...meta,
    }, { merge: true });
    await this.log("flag.toggle", { id, enabled });
  },

  // ── Announcements ───────────────────────────────────────
  async listAnnouncements() {
    try {
      const q = query(collection(db, ANNOUNCEMENTS_COLLECTION), orderBy("createdAt", "desc"), fbLimit(50));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.error("[AdminService] listAnnouncements failed", e);
      return [];
    }
  },

  async createAnnouncement({ title, message, type = "info", active = true, createdByEmail = "" }) {
    const ref = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), {
      title,
      message,
      type,
      active,
      createdAt: serverTimestamp(),
      createdBy: createdByEmail,
    });
    await this.log("announcement.create", { id: ref.id, title });
    return ref.id;
  },

  async updateAnnouncement(id, updates) {
    await updateDoc(doc(db, ANNOUNCEMENTS_COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
    await this.log("announcement.update", { id });
  },

  async deleteAnnouncement(id) {
    await deleteDoc(doc(db, ANNOUNCEMENTS_COLLECTION, id));
    await this.log("announcement.delete", { id });
  },

  // ── Active announcement (public read) ───────────────────
  async getActiveAnnouncement() {
    try {
      const q = query(
        collection(db, ANNOUNCEMENTS_COLLECTION),
        where("active", "==", true),
        orderBy("createdAt", "desc"),
        fbLimit(1)
      );
      const snap = await getDocs(q);
      let item = null;
      snap.forEach((d) => { item = { id: d.id, ...d.data() }; });
      return item;
    } catch (e) {
      return null;
    }
  },

  // ── Maintenance mode ────────────────────────────────────
  async getMaintenanceMode() {
    try {
      const snap = await getDoc(doc(db, "system", "maintenance"));
      if (!snap.exists()) return { enabled: false, message: "" };
      return snap.data();
    } catch {
      return { enabled: false, message: "" };
    }
  },

  async setMaintenanceMode(enabled, message = "") {
    await setDoc(doc(db, "system", "maintenance"), {
      enabled: !!enabled,
      message,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await this.log("maintenance.toggle", { enabled });
  },

  // ── Subscriptions / Premium grants ──────────────────────
  async grantPremium(uid, days = 30) {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
    await updateDoc(doc(db, "users", uid), {
      premium: true,
      premiumExpiresAt: expiresAt,
      premiumGrantedAt: serverTimestamp(),
    });
    await this.log("premium.grant", { targetUid: uid, days });
  },

  async revokePremium(uid) {
    await updateDoc(doc(db, "users", uid), {
      premium: false,
      premiumExpiresAt: null,
    });
    await this.log("premium.revoke", { targetUid: uid });
  },

  // ── Moderation: leaderboard cleanup ─────────────────────
  async listLeaderboardEntries(limit = 100) {
    try {
      const q = query(collection(db, "globalLeaderboard"), orderBy("score", "desc"), fbLimit(limit));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.error("[AdminService] listLeaderboardEntries", e);
      return [];
    }
  },

  async deleteLeaderboardEntry(id) {
    await deleteDoc(doc(db, "globalLeaderboard", id));
    await this.log("leaderboard.delete", { id });
  },

  // ── Reports ─────────────────────────────────────────────
  async listReports(status = "open") {
    try {
      const q = query(collection(db, "reports"), where("status", "==", status), orderBy("createdAt", "desc"), fbLimit(100));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      return [];
    }
  },

  async resolveReport(id, resolution = "resolved") {
    await updateDoc(doc(db, "reports", id), {
      status: resolution,
      resolvedAt: serverTimestamp(),
    });
    await this.log("report.resolve", { id, resolution });
  },

  // ── Logs ────────────────────────────────────────────────
  async log(action, payload = {}) {
    try {
      await addDoc(collection(db, LOGS_COLLECTION), {
        action,
        payload,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      // Logging failures should be silent
    }
  },

  async listLogs(limit = 200) {
    try {
      const q = query(collection(db, LOGS_COLLECTION), orderBy("createdAt", "desc"), fbLimit(limit));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      return [];
    }
  },

  // ── Counts (best-effort, may need optimization) ─────────
  async getCounts() {
    const out = { users: 0, classrooms: 0, leaderboard: 0, reports: 0, admins: 0 };
    try {
      const u = await getDocs(query(collection(db, "users"), fbLimit(1000)));
      out.users = u.size;
    } catch {}
    try {
      const c = await getDocs(query(collection(db, "classroomQuizzes"), fbLimit(1000)));
      out.classrooms = c.size;
    } catch {}
    try {
      const l = await getDocs(query(collection(db, "globalLeaderboard"), fbLimit(1000)));
      out.leaderboard = l.size;
    } catch {}
    try {
      const r = await getDocs(query(collection(db, "reports"), where("status", "==", "open"), fbLimit(100)));
      out.reports = r.size;
    } catch {}
    try {
      const a = await getDocs(collection(db, ADMINS_COLLECTION));
      out.admins = a.size + SUPER_ADMINS.length;
    } catch {}
    return out;
  },
};
