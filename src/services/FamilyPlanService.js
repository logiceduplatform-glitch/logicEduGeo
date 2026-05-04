// Family Plan support.
//
// A family subscription unlocks Premium for up to N child profiles linked
// to the SAME owner account. The owner remains the billing user; children
// are sub-profiles created via ProfileService.
//
// Why a separate service vs hard-coded numbers?
//   - Lets us A/B test member limits (4 vs 6) without redeploying schema.
//   - Centralises tier→limit mapping for guards across the app.

import { ProfileService } from "./ProfileService";

export const FAMILY_LIMITS = {
  free: 1,
  premium: 1,
  family: 6,
  school: 999,
};

export const FamilyPlanService = {
  /**
   * Maximum number of child profiles allowed for the given tier.
   */
  getMemberLimit(tier = "free") {
    return FAMILY_LIMITS[tier] ?? FAMILY_LIMITS.free;
  },

  /**
   * Returns true if the user can add another child profile under their
   * current tier. Used to gate the "Add child" button on family pages.
   */
  canAddMember(tier = "free") {
    const limit = this.getMemberLimit(tier);
    const current = ProfileService.getAll().length;
    return current < limit;
  },

  /**
   * Returns slots available for new members. Negative values clamp to 0.
   */
  remainingSlots(tier = "free") {
    return Math.max(0, this.getMemberLimit(tier) - ProfileService.getAll().length);
  },

  /**
   * Quick-look summary for the family management UI.
   */
  getSummary(tier = "free") {
    const limit = this.getMemberLimit(tier);
    const profiles = ProfileService.getAll();
    return {
      tier,
      limit,
      used: profiles.length,
      remaining: Math.max(0, limit - profiles.length),
      atCapacity: profiles.length >= limit,
      profiles,
    };
  },
};

export default FamilyPlanService;
