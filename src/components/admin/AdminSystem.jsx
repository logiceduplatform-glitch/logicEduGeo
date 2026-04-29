import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";

const T = {
  el: {
    title: "⚙️ Σύστημα",
    maintenance: "🚧 Maintenance Mode",
    maintenanceDesc: "Όταν ενεργό, οι χρήστες βλέπουν μήνυμα συντήρησης.",
    enable: "Ενεργοποίηση",
    disable: "Απενεργοποίηση",
    message: "Μήνυμα προς χρήστες",
    save: "Αποθήκευση",
    saved: "✓ Αποθηκεύτηκε",
    cache: "🧹 Cache",
    cacheDesc: "Καθάρισε τοπικά την cache του admin (επανεκκινεί έλεγχο δικαιωμάτων).",
    clearCache: "Καθαρισμός cache",
    cacheCleared: "✓ Καθαρίστηκε",
    bootstrap: "🚀 Bootstrap admin",
    bootstrapDesc: "Super admin emails που είναι hardcoded:",
  },
  en: {
    title: "⚙️ System",
    maintenance: "🚧 Maintenance Mode",
    maintenanceDesc: "When active, users see a maintenance message.",
    enable: "Enable",
    disable: "Disable",
    message: "Message to users",
    save: "Save",
    saved: "✓ Saved",
    cache: "🧹 Cache",
    cacheDesc: "Clear admin permission cache locally.",
    clearCache: "Clear cache",
    cacheCleared: "✓ Cleared",
    bootstrap: "🚀 Bootstrap admin",
    bootstrapDesc: "Hardcoded super admin emails:",
  },
};

export default function AdminSystem() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [savedAt, setSavedAt] = useState(0);
  const [cacheCleared, setCacheCleared] = useState(false);

  const load = async () => {
    const m = await AdminService.getMaintenanceMode();
    setEnabled(!!m.enabled);
    setMessage(m.message || "");
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await AdminService.setMaintenanceMode(enabled, message);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(0), 2000);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{l.title}</h2>

      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.maintenance}</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">{l.maintenanceDesc}</p>
        <label className="flex items-center gap-2 mb-3">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{enabled ? l.disable : l.enable}</span>
        </label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={l.message} rows={3} className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 mb-3" />
        <div className="flex items-center gap-3">
          <button onClick={save} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">{l.save}</button>
          {savedAt > 0 && <span className="text-xs font-bold text-emerald-600">{l.saved}</span>}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.cache}</h3>
        <p className="text-xs text-slate-500 mt-1 mb-3">{l.cacheDesc}</p>
        <button
          onClick={() => { AdminService.clearCache(); setCacheCleared(true); setTimeout(() => setCacheCleared(false), 2000); }}
          className="px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm"
        >
          {cacheCleared ? l.cacheCleared : l.clearCache}
        </button>
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">{l.bootstrap}</h3>
        <p className="text-xs text-slate-500 mt-1 mb-2">{l.bootstrapDesc}</p>
        <ul className="text-xs font-mono text-slate-700 dark:text-slate-200 space-y-1">
          {AdminService.SUPER_ADMINS.map((email) => (
            <li key={email} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700/50 inline-block mr-2">🛡️ {email}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
