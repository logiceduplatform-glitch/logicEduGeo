import React from "react";

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 flex-wrap text-sm">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">/</span>
              )}
              {item.onClick && !isLast ? (
                <button
                  onClick={item.onClick}
                  className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </button>
              ) : (
                <span className={isLast
                  ? "text-slate-800 dark:text-slate-100 font-semibold"
                  : "text-slate-500 dark:text-slate-400 font-medium"
                }>
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
