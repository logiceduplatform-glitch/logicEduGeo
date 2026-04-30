import React from "react";

/**
 * Kibloo brand logo.
 *
 * variants:
 *  - "full"   : icon + wordmark (default, used in header / footer / auth)
 *  - "icon"   : just the bloom icon (used as favicon-like marks)
 *  - "stack"  : icon on top of wordmark (used on auth/landing hero)
 *
 * The mark is a stylised "bloom" — a curious flower whose petals form a "K".
 * It deliberately reads as both a letter and a friendly creature, so it
 * doubles as the platform mascot.
 */
export default function KiblooLogo({
  variant = "full",
  size = 40,
  tagline = null,
  className = "",
  monochrome = false,
}) {
  const iconSize = size;

  const Icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="kibloo-grad-1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#EC4899" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="kibloo-grad-2" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Outer bloom petals */}
      <g>
        <circle cx="32" cy="14" r="9" fill={monochrome ? "currentColor" : "url(#kibloo-grad-1)"} opacity={monochrome ? 0.85 : 1} />
        <circle cx="50" cy="32" r="9" fill={monochrome ? "currentColor" : "url(#kibloo-grad-1)"} opacity={monochrome ? 0.7 : 0.92} />
        <circle cx="32" cy="50" r="9" fill={monochrome ? "currentColor" : "url(#kibloo-grad-1)"} opacity={monochrome ? 0.55 : 0.85} />
        <circle cx="14" cy="32" r="9" fill={monochrome ? "currentColor" : "url(#kibloo-grad-1)"} opacity={monochrome ? 0.7 : 0.92} />
      </g>

      {/* Centre face */}
      <circle cx="32" cy="32" r="11" fill={monochrome ? "white" : "url(#kibloo-grad-2)"} />

      {/* Eyes */}
      <circle cx="28.5" cy="31" r="1.7" fill="#1f2937" />
      <circle cx="35.5" cy="31" r="1.7" fill="#1f2937" />

      {/* Smile */}
      <path
        d="M27.5 35.5 Q32 39 36.5 35.5"
        stroke="#1f2937"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Sparkle accent */}
      <g opacity={monochrome ? 0.4 : 0.9}>
        <path
          d="M52 10 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4z"
          fill={monochrome ? "currentColor" : "#FCD34D"}
        />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return <span className={className}>{Icon}</span>;
  }

  if (variant === "stack") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        {Icon}
        <span
          className="font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent"
          style={{ fontSize: Math.max(20, size * 0.7) }}
        >
          Kibloo
        </span>
        {tagline && (
          <span className="text-xs text-slate-500 dark:text-slate-400 tracking-wide">
            {tagline}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Icon}
      <div className="flex flex-col leading-none">
        <span
          className="font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent"
          style={{ fontSize: Math.max(16, size * 0.55) }}
        >
          Kibloo
        </span>
        {tagline && (
          <span className="text-[10px] mt-0.5 text-slate-500 dark:text-slate-400 tracking-wide">
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
