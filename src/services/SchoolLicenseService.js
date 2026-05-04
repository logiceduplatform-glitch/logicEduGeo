// School Licenses — bulk B2B subscription model.
//
// Pricing model (proposed):
//   - Small school   (up to  50 students):  €499/year
//   - Medium school  (up to 200 students):  €1499/year
//   - Large school   (up to 500 students):  €2999/year
//   - Enterprise     (unlimited):           contact sales
//
// Implementation notes:
//   - Each school has a unique licenseKey (issued by admin).
//   - A teacher/admin enters the key once; it links them to the school
//     and unlocks Premium for all students under that organization.
//   - The license document lives in Firestore at /schoolLicenses/{key}.

import { db, auth } from "../auth/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

export const SCHOOL_TIERS = [
  { id: "small",      maxStudents:   50, priceEur:  499 },
  { id: "medium",     maxStudents:  200, priceEur: 1499 },
  { id: "large",      maxStudents:  500, priceEur: 2999 },
  { id: "enterprise", maxStudents:  Infinity, priceEur: 0 }, // contact sales
];

const SCHOOL_KEY_LS = "kibloo:schoolLicense";

export const SchoolLicenseService = {
  TIERS: SCHOOL_TIERS,

  /**
   * Returns the license info cached locally (faster than Firestore).
   * Shape: { key, schoolName, tier, expiresAt }
   */
  getLocalLicense() {
    try {
      const raw = localStorage.getItem(SCHOOL_KEY_LS);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setLocalLicense(license) {
    try {
      localStorage.setItem(SCHOOL_KEY_LS, JSON.stringify(license));
    } catch {
      /* storage full */
    }
  },

  clearLocalLicense() {
    try { localStorage.removeItem(SCHOOL_KEY_LS); } catch { /* */ }
  },

  /**
   * Look up a license by key. Returns null if not found / expired.
   * The Firestore document MUST exist at /schoolLicenses/{key}.
   */
  async lookup(key) {
    if (!key || !db) return null;
    try {
      const ref = doc(db, "schoolLicenses", String(key).trim().toUpperCase());
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data();
      // Honour explicit expiry timestamp (millis or ISO string).
      if (data.expiresAt) {
        const exp = typeof data.expiresAt === "number"
          ? data.expiresAt
          : new Date(data.expiresAt).getTime();
        if (Date.now() > exp) return null;
      }
      return { key: snap.id, ...data };
    } catch (e) {
      console.warn("[SchoolLicense] lookup failed", e);
      return null;
    }
  },

  /**
   * Activate a license for the current authenticated user. The user is
   * appended to the license's `members[]` array; the license is mirrored
   * to localStorage so all subsequent app loads grant Premium instantly.
   */
  async activate(key) {
    const license = await this.lookup(key);
    if (!license) return { ok: false, reason: "not_found" };
    if (license.tier !== "enterprise" && license.activeCount >= license.maxStudents) {
      return { ok: false, reason: "capacity" };
    }
    const user = auth?.currentUser;
    if (!user) return { ok: false, reason: "auth_required" };

    try {
      const ref = doc(db, "schoolLicenses", license.key);
      await updateDoc(ref, {
        members: arrayUnion(user.uid),
        activeCount: (license.activeCount || 0) + 1,
        updatedAt: serverTimestamp(),
      });
      this.setLocalLicense({
        key: license.key,
        schoolName: license.schoolName,
        tier: license.tier,
        expiresAt: license.expiresAt,
      });
      return { ok: true, license };
    } catch (e) {
      console.warn("[SchoolLicense] activate failed", e);
      return { ok: false, reason: "write_failed" };
    }
  },

  /**
   * Returns the license owned by this teacher/admin (if any).
   * Use this for the school-admin dashboard.
   */
  async findOwnedByCurrentUser() {
    const user = auth?.currentUser;
    if (!user || !db) return null;
    try {
      const q = query(
        collection(db, "schoolLicenses"),
        where("ownerUid", "==", user.uid),
        limit(1),
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { key: d.id, ...d.data() };
    } catch (e) {
      console.warn("[SchoolLicense] findOwned failed", e);
      return null;
    }
  },

  /**
   * Issue a new license. Admin-only — the Firestore rules enforce
   * that only admins can write to /schoolLicenses/{key}.
   */
  async issue({ key, schoolName, tier, ownerUid, expiresAt, contactEmail }) {
    if (!db) return { ok: false, reason: "no_db" };
    const t = SCHOOL_TIERS.find((s) => s.id === tier) || SCHOOL_TIERS[0];
    try {
      await setDoc(doc(db, "schoolLicenses", key.toUpperCase()), {
        key: key.toUpperCase(),
        schoolName,
        tier: t.id,
        maxStudents: t.maxStudents === Infinity ? 999999 : t.maxStudents,
        ownerUid: ownerUid || null,
        contactEmail: contactEmail || null,
        members: [],
        activeCount: 0,
        expiresAt: expiresAt || null,
        createdAt: serverTimestamp(),
      });
      return { ok: true };
    } catch (e) {
      console.warn("[SchoolLicense] issue failed", e);
      return { ok: false, reason: "write_failed" };
    }
  },

  /**
   * Quick predicate used by gates: is the user under an active school
   * license right now?
   */
  isActiveLocally() {
    const lic = this.getLocalLicense();
    if (!lic) return false;
    if (!lic.expiresAt) return true;
    const exp = typeof lic.expiresAt === "number"
      ? lic.expiresAt
      : new Date(lic.expiresAt).getTime();
    return Date.now() < exp;
  },

  /**
   * Generate a human-friendly random license key (e.g. KIBL-XXXX-XXXX).
   * Use only on the admin side; keys must be uppercase A-Z + 0-9.
   */
  generateKey() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
    const block = () => Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    return `KIBL-${block()}-${block()}`;
  },
};

export default SchoolLicenseService;
