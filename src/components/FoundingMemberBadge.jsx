import React, { useContext, useMemo } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { FoundingMemberService } from "../services/FoundingMemberService";

/**
 * Founding Member badge — appears on profile pages and (optionally) the
 * pricing page for users who joined within the launch window.
 *
 * Variants:
 *   - "compact": small inline pill (great for headers next to avatar)
 *   - "card":    full callout card with discount CTA (great for profile / pricing)
 */
export default function FoundingMemberBadge({ variant = "compact" }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};

  const isFounding = useMemo(
    () => FoundingMemberService.isFoundingMember(user),
    [user]
  );

  if (!isFounding) return null;

  const badge = FoundingMemberService.badge(lang);
  const isEl = lang === "el";

  if (variant === "compact") {
    return (
      <span
        title={badge.tooltip}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 shadow-sm border border-amber-300"
      >
        <span aria-hidden>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  }

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-2 border-amber-300 dark:border-amber-700 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-4xl flex-shrink-0">{badge.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-amber-900 dark:text-amber-100">
            {badge.label}
          </div>
          <p className="text-sm text-amber-800 dark:text-amber-200 mt-0.5">
            {badge.desc}
          </p>
          <p className="text-xs mt-2 text-amber-900 dark:text-amber-200 bg-white/40 dark:bg-black/20 rounded-lg px-2.5 py-1.5 inline-block">
            🎁 {isEl ? "30% έκπτωση εφ' όρου ζωής με κωδικό" : "30% lifetime discount with code"}{" "}
            <code className="font-mono font-bold">{FoundingMemberService.couponCode()}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
