import React from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { useSubscription } from "../../contexts/SubscriptionContext";

export default function CategoryMenu({ active, onSelect, items, sidebarTitle, onLockedClick }) {
  const { lang } = React.useContext(LanguageContext);
  const isEl = lang === "el";
  const { isGameFree } = useSubscription();

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
      <div className="p-3">
        <h2 className="px-3 py-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
          {sidebarTitle || (isEl ? "🧠 Κατηγορίες" : "🧠 Categories")}
        </h2>
        <nav className="space-y-2 mt-4">
          {items.map(({ id, icon: Icon, gradient, desc }, idx) => {
            const isActive = active === id;
            const locked = !isGameFree(idx);
            return (
              <button
                key={id}
                type="button"
                onClick={() => locked ? onLockedClick?.() : onSelect?.(id)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform",
                  locked
                    ? "opacity-60 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 shadow-sm"
                    : isActive
                      ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105`
                      : "text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] shadow-sm",
                ].join(" ")}
              >
                <div className={[
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  locked ? "bg-slate-200 dark:bg-slate-700" : isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700",
                ].join(" ")}>
                  {locked ? (
                    <span className="text-base">🔒</span>
                  ) : (
                    <Icon className={[
                      "h-5 w-5",
                      isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                    ].join(" ")} />
                  )}
                </div>
                <span className="truncate flex-1 text-left">{desc[isEl ? "el" : "en"]}</span>
                {locked && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold">PRO</span>
                )}
                {!locked && isActive && (
                  <span className="ml-auto inline-block h-3 w-3 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
