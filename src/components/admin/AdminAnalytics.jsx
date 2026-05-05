import React, { useContext, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { db } from "../../auth/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

/**
 * Admin → Analytics: A/B experiments overview.
 *
 * Reads `abExperiments/{id}` documents and computes per-variant CTR + lift
 * vs control. Uses the Wald 95% confidence interval to flag whether
 * differences are statistically significant.
 */

const T = {
  el: {
    title: "📈 A/B Tests & Conversions",
    sub: "Πραγματικά conversion rates ανά παραλλαγή. Δεδομένα Firestore.",
    none: "Δεν έχουν καταγραφεί events ακόμη.",
    impressions: "Εμφανίσεις",
    convs: "Conversions",
    rate: "CTR",
    lift: "Lift vs control",
    ci: "95% CI",
    confidence: "Σημαντικό;",
    yes: "ΝΑΙ ✓",
    no: "Όχι",
    needs: "Χρειάζονται περισσότερα data",
    variant: "Παραλλαγή",
    control: "control",
    updated: "Τελευταία ενημέρωση",
  },
  en: {
    title: "📈 A/B Tests & Conversions",
    sub: "Live conversion rates per variant. Source: Firestore.",
    none: "No events recorded yet.",
    impressions: "Impressions",
    convs: "Conversions",
    rate: "CTR",
    lift: "Lift vs control",
    ci: "95% CI",
    confidence: "Significant?",
    yes: "YES ✓",
    no: "No",
    needs: "Needs more data",
    variant: "Variant",
    control: "control",
    updated: "Last updated",
  },
};

function fmtPct(n) { return Number.isFinite(n) ? `${(n * 100).toFixed(2)}%` : "—"; }
function fmtSignedPct(n) {
  if (!Number.isFinite(n)) return "—";
  const v = (n * 100).toFixed(1);
  return n > 0 ? `+${v}%` : `${v}%`;
}

/**
 * Wald 95% CI for a binomial proportion p = k/n.
 * Returns [lo, hi]; null if n < 30 (too small to be meaningful).
 */
function waldCI(k, n) {
  if (n < 30) return null;
  const p = k / n;
  const se = Math.sqrt((p * (1 - p)) / n);
  return [Math.max(0, p - 1.96 * se), Math.min(1, p + 1.96 * se)];
}

/**
 * Naive significance test: Z-test for two proportions. Returns true if
 * |z| > 1.96 (95% confidence) AND both samples have n ≥ 100.
 */
function isSignificant(controlK, controlN, varK, varN) {
  if (controlN < 100 || varN < 100) return null;
  const p1 = controlK / controlN;
  const p2 = varK    / varN;
  const p  = (controlK + varK) / (controlN + varN);
  const se = Math.sqrt(p * (1 - p) * (1 / controlN + 1 / varN));
  if (se === 0) return false;
  const z = (p2 - p1) / se;
  return Math.abs(z) > 1.96;
}

export default function AdminAnalytics() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang === "el" ? "el" : "en"];
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    if (!db) return undefined;
    const q = query(collection(db, "abExperiments"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setExperiments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Compute per-experiment summary tables.
  const summaries = useMemo(() => experiments.map((exp) => {
    const variantsObj = exp.variants || {};
    const variantNames = Object.keys(variantsObj);
    const control = variantsObj.control || {};
    const controlImpr = control.impression || 0;
    // Sum all conv_<goal> counters into a single conversion total.
    const sumConv = (v) => Object.entries(v).reduce(
      (s, [k, n]) => k.startsWith("conv_") ? s + (n || 0) : s, 0,
    );
    const controlConv = sumConv(control);
    const controlRate = controlImpr > 0 ? controlConv / controlImpr : 0;

    const rows = variantNames.map((name) => {
      const v = variantsObj[name] || {};
      const impr = v.impression || 0;
      const conv = sumConv(v);
      const rate = impr > 0 ? conv / impr : 0;
      const ci = waldCI(conv, impr);
      const lift = (name !== "control" && controlRate > 0)
        ? (rate - controlRate) / controlRate
        : null;
      const sig = (name !== "control")
        ? isSignificant(controlConv, controlImpr, conv, impr)
        : null;
      return { name, impr, conv, rate, ci, lift, sig };
    });
    return { id: exp.id, rows, updated: exp.updatedAt };
  }), [experiments]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{l.title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{l.sub}</p>
      </div>

      {summaries.length === 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center text-slate-500">
          {l.none}
        </div>
      )}

      {summaries.map((exp) => (
        <div key={exp.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
            <div className="font-bold text-slate-800 dark:text-slate-100">🧪 {exp.id}</div>
            <div className="text-xs text-slate-400">
              {l.updated}: {exp.updated?.toDate?.()?.toLocaleString?.() || "—"}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/30">
                <tr>
                  <th className="text-left  px-4 py-2">{l.variant}</th>
                  <th className="text-right px-4 py-2">{l.impressions}</th>
                  <th className="text-right px-4 py-2">{l.convs}</th>
                  <th className="text-right px-4 py-2">{l.rate}</th>
                  <th className="text-center px-4 py-2">{l.ci}</th>
                  <th className="text-right px-4 py-2">{l.lift}</th>
                  <th className="text-center px-4 py-2">{l.confidence}</th>
                </tr>
              </thead>
              <tbody>
                {exp.rows.map((r) => (
                  <tr key={r.name} className={`border-t border-slate-100 dark:border-slate-700 ${r.name === "control" ? "bg-slate-50/50 dark:bg-slate-900/20" : ""}`}>
                    <td className="px-4 py-2 font-semibold">
                      {r.name}
                      {r.name === "control" && <span className="ml-2 text-xs text-slate-400">({l.control})</span>}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{r.impr.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{r.conv.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-bold tabular-nums">{fmtPct(r.rate)}</td>
                    <td className="px-4 py-2 text-center text-xs text-slate-500">
                      {r.ci ? `${fmtPct(r.ci[0])}–${fmtPct(r.ci[1])}` : l.needs}
                    </td>
                    <td className={`px-4 py-2 text-right font-bold tabular-nums ${
                      r.lift == null ? "text-slate-400" :
                      r.lift > 0     ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {r.lift != null ? fmtSignedPct(r.lift) : "—"}
                    </td>
                    <td className="px-4 py-2 text-center text-xs">
                      {r.sig === true  && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">{l.yes}</span>}
                      {r.sig === false && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{l.no}</span>}
                      {r.sig === null  && <span className="text-slate-400">{l.needs}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
