import React from "react";

export default function LockedGameOverlay({ lang = "el", onClick }) {
  const isEl = lang === "el";

  return (
    <div
      className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-900/70"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Premium
      </span>
      <p className="text-white/80 text-[10px] mt-1.5 font-medium">
        {isEl ? "Πάτα για αναβάθμιση" : "Tap to upgrade"}
      </p>
    </div>
  );
}
