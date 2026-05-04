// Affiliate / Referral Program for teachers.
// Teachers get a unique code & link. When new users register via that link & subscribe,
// the affiliate gets commission credit (recorded as referral docs in Firestore).
//
// Data model:
//  - affiliates/{uid}            { uid, code, link, paypalEmail, totalReferrals, totalCommission, totalPaid, createdAt }
//  - referrals/{id}              { referrerUid, referrerCode, refereeUid, plan, status, commission, createdAt, paidAt }

import { db } from "../auth/firebase";
import {
  doc, collection, setDoc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp, increment, limit,
} from "firebase/firestore";

const AFFILIATES = "affiliates";
const REFERRALS = "referrals";
const REF_COOKIE = "geo:ref-code";
const COMMISSION_RATE = 0.30; // 30% of first month
const PRICE_BY_PLAN = { monthly: 4.99, yearly: 39.99, family: 7.99, school: 99 };

function generateCode(uid) {
  // Build a friendly short code (8 chars) from uid + random.
  const base = (uid || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base || "GEO"}${rand}`;
}

export const AffiliateService = {
  /** Get or create an affiliate for the current user. */
  async getOrCreate(uid, opts = {}) {
    if (!uid) throw new Error("auth-required");
    const ref = doc(db, AFFILIATES, uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };

    const code = generateCode(uid);
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${code}`;
    const data = {
      uid,
      code,
      link,
      paypalEmail: opts.paypalEmail || "",
      totalReferrals: 0,
      totalCommission: 0,
      totalPaid: 0,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, data);
    return { id: uid, ...data };
  },

  async update(uid, partial) {
    await updateDoc(doc(db, AFFILIATES, uid), partial);
  },

  async getReferrals(uid) {
    if (!uid) return [];
    const q = query(collection(db, REFERRALS), where("referrerUid", "==", uid), orderBy("createdAt", "desc"), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Find affiliate by code (public). */
  async getByCode(code) {
    if (!code) return null;
    const q = query(collection(db, AFFILIATES), where("code", "==", code), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  /** Track a click on a ref link - persist in localStorage cookie. */
  trackVisit(code) {
    if (!code) return;
    try { localStorage.setItem(REF_COOKIE, JSON.stringify({ code, at: Date.now() })); } catch {}
  },

  /** Read the stored referral code (set during visit). */
  getStoredCode() {
    try {
      const s = localStorage.getItem(REF_COOKIE);
      if (!s) return null;
      const { code, at } = JSON.parse(s);
      // 30-day cookie
      if (Date.now() - (at || 0) > 30 * 24 * 60 * 60 * 1000) return null;
      return code;
    } catch { return null; }
  },

  clearStoredCode() {
    try { localStorage.removeItem(REF_COOKIE); } catch {}
  },

  /** Called when a referee subscribes. Records commission. */
  async recordSubscription({ refereeUid, plan }) {
    const code = this.getStoredCode();
    if (!code) return null;
    const aff = await this.getByCode(code);
    if (!aff) return null;
    // Don't credit self-referrals
    if (aff.uid === refereeUid) return null;

    const price = PRICE_BY_PLAN[plan] || 0;
    const commission = +(price * COMMISSION_RATE).toFixed(2);

    await addDoc(collection(db, REFERRALS), {
      referrerUid: aff.uid,
      referrerCode: code,
      refereeUid,
      plan,
      price,
      commission,
      status: "pending", // pending → approved → paid
      createdAt: serverTimestamp(),
    });

    // Update affiliate aggregates
    try {
      await updateDoc(doc(db, AFFILIATES, aff.uid), {
        totalReferrals: increment(1),
        totalCommission: increment(commission),
      });
    } catch {}

    return { commission, code };
  },

  /** Called when referee just signs up (free). Counts towards "totalReferrals". */
  async recordSignup({ refereeUid }) {
    const code = this.getStoredCode();
    if (!code) return null;
    const aff = await this.getByCode(code);
    if (!aff || aff.uid === refereeUid) return null;
    try {
      await addDoc(collection(db, REFERRALS), {
        referrerUid: aff.uid,
        referrerCode: code,
        refereeUid,
        plan: "free",
        price: 0,
        commission: 0,
        status: "signup",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, AFFILIATES, aff.uid), { totalReferrals: increment(1) });
    } catch {}
    return { code };
  },

  /**
   * Public leaderboard of top affiliates. We expose only display-name +
   * referrals so we don't leak commission amounts.
   */
  async getLeaderboard(topN = 20) {
    try {
      const q = query(
        collection(db, AFFILIATES),
        orderBy("totalReferrals", "desc"),
        limit(topN),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d, i) => {
        const data = d.data();
        return {
          rank: i + 1,
          uid: d.id,
          code: data.code,
          referrals: data.totalReferrals || 0,
          // displayName/avatar should come from publicProfiles separately
        };
      });
    } catch {
      return [];
    }
  },

  /**
   * Pre-formatted share copy in EL/EN. The link is appended automatically.
   * Returns { subject, body } suitable for mailto: / WhatsApp / Twitter.
   */
  buildShareCopy({ link, lang = "el", channel = "generic" }) {
    const isEl = lang === "el";

    const templates = {
      generic: {
        el: {
          subject: "Δες την εκπαιδευτική πλατφόρμα που χρησιμοποιώ",
          body: `Έχω δοκιμάσει την Kibloo με τα παιδιά μου και είναι φανταστική: 350+ εκπαιδευτικά παιχνίδια χωρίς διαφημίσεις. Δοκίμασέ τη δωρεάν με το link μου: ${link}`,
        },
        en: {
          subject: "The educational platform my kids love",
          body: `I've been using Kibloo with my kids — 350+ educational games, no ads. Try it free with my link: ${link}`,
        },
      },
      teacher: {
        el: {
          subject: "Πρόταση εκπαιδευτικού εργαλείου",
          body: `Συνάδελφε, χρησιμοποιώ την Kibloo στην τάξη μου εδώ και μήνες — δωρεάν εργαλεία διαχείρισης τάξης + 350+ έτοιμα quiz. Σύστημά μου: ${link}`,
        },
        en: {
          subject: "Educational tool recommendation",
          body: `Fellow educator — I've been using Kibloo in my classroom for months. Free class management tools + 350+ ready quizzes. My link: ${link}`,
        },
      },
      twitter: {
        el: {
          subject: "",
          body: `📚 Δωρεάν εκπαιδευτικά παιχνίδια για παιδιά 2-12. Δοκίμασα την @kibloo και τα παιδιά την λατρεύουν. ${link} #εκπαίδευση #παιδιά`,
        },
        en: {
          subject: "",
          body: `📚 Free educational games for kids 2-12. Tried @kibloo and my kids love it. ${link} #edtech #kids`,
        },
      },
    };

    const tpl = templates[channel] || templates.generic;
    return isEl ? tpl.el : tpl.en;
  },

  // ── Constants ─────────────────────────────────────────────────────────
  COMMISSION_RATE,
  PRICE_BY_PLAN,
};

// Auto-track visit if URL has ?ref=
if (typeof window !== "undefined") {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) AffiliateService.trackVisit(ref);
  } catch {}
}
