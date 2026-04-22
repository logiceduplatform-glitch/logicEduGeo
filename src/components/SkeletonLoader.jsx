import React from "react";

export function EmptySearchState({ lang = "el", onClear }) {
  return (
    <div className="text-center py-16">
      <span className="text-5xl block mb-4" aria-hidden="true">🔍</span>
      <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
        {lang === "el" ? "Δεν βρέθηκαν αποτελέσματα" : "No results found"}
      </p>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
        {lang === "el" ? "Δοκίμασε διαφορετική αναζήτηση" : "Try a different search"}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="px-5 py-2.5 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors active:scale-95"
        >
          {lang === "el" ? "Καθαρισμός" : "Clear search"}
        </button>
      )}
    </div>
  );
}

export function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg animate-pulse">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3" />
          <div className="mt-4 h-10 bg-slate-200 dark:bg-slate-700 rounded-full w-28" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl mb-3" />
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-16 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-24" />
        </div>
      ))}
    </div>
  );
}

export function GameSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="flex-1">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-40 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-24" />
          </div>
        </div>
        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mb-6" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          ))}
        </div>
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6 font-medium">
          Loading game…
        </p>
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
