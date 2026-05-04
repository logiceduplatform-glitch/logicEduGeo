// Founding Member badge — first 30 days of public launch.
//
// Strategy:
//  - We freeze a LAUNCH_DATE constant (the day Kibloo opens to the public).
//  - Anyone whose Firebase Auth account was created within
//    LAUNCH_WINDOW_DAYS of that date gets the "Founding Member" badge.
//  - Bonus: 30% lifetime discount eligibility flag (consumed by Stripe
//    coupon code "FOUNDING30" — wired up in the pricing page later).
//
// To open / close the window after launch, just bump LAUNCH_DATE or
// LAUNCH_WINDOW_DAYS — no migrations needed, the check is purely
// client-side and based on user's creationTime.

const LAUNCH_DATE = new Date("2026-05-01T00:00:00Z").getTime();
const LAUNCH_WINDOW_DAYS = 30;
const LAUNCH_WINDOW_MS = LAUNCH_WINDOW_DAYS * 24 * 60 * 60 * 1000;
const GUEST_FIRST_SEEN_KEY = "kibloo:firstSeen";

function getGuestFirstSeen() {
  try {
    const stored = localStorage.getItem(GUEST_FIRST_SEEN_KEY);
    if (stored) return parseInt(stored, 10);
    const now = Date.now();
    localStorage.setItem(GUEST_FIRST_SEEN_KEY, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

export const FoundingMemberService = {
  LAUNCH_DATE,
  LAUNCH_WINDOW_DAYS,

  /**
   * Returns true if the user qualifies as a Founding Member.
   * Accepts a Firebase user object (uses metadata.creationTime).
   * Falls back to localStorage first-seen timestamp for guests.
   */
  isFoundingMember(user) {
    const created = user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime).getTime()
      : getGuestFirstSeen();
    if (!created || isNaN(created)) return false;
    return created >= LAUNCH_DATE && created <= LAUNCH_DATE + LAUNCH_WINDOW_MS;
  },

  /**
   * Returns true while the launch window is still open
   * (used to show "Limited time!" banners).
   */
  isWindowOpen() {
    const now = Date.now();
    return now >= LAUNCH_DATE && now <= LAUNCH_DATE + LAUNCH_WINDOW_MS;
  },

  /**
   * Days remaining in the launch window. Returns 0 once it closes.
   */
  daysLeft() {
    const remainingMs = LAUNCH_DATE + LAUNCH_WINDOW_MS - Date.now();
    return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
  },

  /**
   * Stripe coupon code that grants 30% off for life. Surface this in
   * the checkout flow when isFoundingMember() returns true.
   */
  couponCode() {
    return "FOUNDING30";
  },

  /**
   * Render-friendly badge metadata.
   */
  badge(lang = "el") {
    const isEl = lang === "el";
    return {
      id: "founding_member",
      icon: "🌟",
      label: isEl ? "Founding Member" : "Founding Member",
      desc: isEl
        ? "Ένας από τους πρώτους χρήστες της Kibloo!"
        : "One of the first members of Kibloo!",
      tooltip: isEl
        ? "Σου χρωστάμε χάρη! 💚 30% έκπτωση εφ' όρου ζωής στο Premium."
        : "We owe you one! 💚 30% lifetime discount on Premium.",
    };
  },
};

export default FoundingMemberService;
