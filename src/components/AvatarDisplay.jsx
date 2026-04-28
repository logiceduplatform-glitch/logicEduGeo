import React from "react";

export const AVATAR_PARTS = {
  face: [
    { id: "f1", emoji: "😊", label: "Happy" },
    { id: "f2", emoji: "😎", label: "Cool" },
    { id: "f3", emoji: "🤓", label: "Nerd" },
    { id: "f4", emoji: "😄", label: "Grin" },
    { id: "f5", emoji: "🥰", label: "Love" },
    { id: "f6", emoji: "🤩", label: "Star" },
  ],
  eyes: [
    { id: "e1", svg: "circle", color: "#3B82F6", label: "Blue" },
    { id: "e2", svg: "circle", color: "#10B981", label: "Green" },
    { id: "e3", svg: "circle", color: "#8B5CF6", label: "Purple" },
    { id: "e4", svg: "circle", color: "#F59E0B", label: "Amber" },
    { id: "e5", svg: "circle", color: "#EC4899", label: "Pink" },
    { id: "e6", svg: "circle", color: "#06B6D4", label: "Cyan" },
    { id: "e7", svg: "circle", color: "#6366F1", label: "Indigo" },
    { id: "e8", svg: "circle", color: "#F97316", label: "Orange" },
  ],
  mouth: [
    { id: "m1", path: "M 8 18 Q 16 24 24 18", label: "Smile" },
    { id: "m2", path: "M 8 20 L 24 20", label: "Neutral" },
    { id: "m3", path: "M 10 18 Q 16 26 22 18", label: "Big Smile" },
    { id: "m4", path: "M 10 20 Q 16 16 22 20", label: "Sad" },
    { id: "m5", path: "M 12 18 Q 16 22 20 18", label: "Tiny Smile" },
    { id: "m6", path: "M 10 18 C 12 24 20 24 22 18", label: "Grin" },
  ],
  hair: [
    { id: "h1", emoji: "👦", color: "#92400E", label: "Short Brown" },
    { id: "h2", emoji: "👧", color: "#F59E0B", label: "Long Blonde" },
    { id: "h3", emoji: "🧑", color: "#1F2937", label: "Short Black" },
    { id: "h4", emoji: "👩", color: "#DC2626", label: "Long Red" },
    { id: "h5", emoji: "🧒", color: "#7C3AED", label: "Short Purple" },
    { id: "h6", emoji: "👱", color: "#FCD34D", label: "Blonde" },
    { id: "h7", emoji: "🧔", color: "#78350F", label: "Beard" },
    { id: "h8", emoji: "👩‍🦱", color: "#92400E", label: "Curly" },
    { id: "h9", emoji: "👩‍🦰", color: "#F97316", label: "Orange" },
    { id: "h10", emoji: "👨‍🦳", color: "#9CA3AF", label: "Silver" },
  ],
  accessory: [
    { id: "a0", emoji: "", label: "None" },
    { id: "a1", emoji: "👓", label: "Glasses" },
    { id: "a2", emoji: "🕶️", label: "Sunglasses" },
    { id: "a3", emoji: "🎀", label: "Bow" },
    { id: "a4", emoji: "⭐", label: "Star" },
    { id: "a5", emoji: "🌸", label: "Flower" },
    { id: "a6", emoji: "💎", label: "Diamond", locked: true, unlockLevel: 5 },
    { id: "a7", emoji: "🦋", label: "Butterfly", locked: true, unlockLevel: 8 },
    { id: "a8", emoji: "✨", label: "Sparkle", locked: true, shopId: "avatar_sparkle" },
  ],
  hat: [
    { id: "ht0", emoji: "", label: "None" },
    { id: "ht1", emoji: "🎩", label: "Top Hat" },
    { id: "ht2", emoji: "👑", label: "Crown", locked: true, unlockLevel: 10 },
    { id: "ht3", emoji: "🧢", label: "Cap" },
    { id: "ht4", emoji: "🎓", label: "Graduation", locked: true, unlockLevel: 15 },
    { id: "ht5", emoji: "🪖", label: "Explorer", locked: true, shopId: "avatar_explorer_hat" },
    { id: "ht6", emoji: "🤠", label: "Cowboy", locked: true, shopId: "avatar_cowboy_hat" },
  ],
  bg: [
    { id: "bg1", color: "#EFF6FF", label: "Sky Blue" },
    { id: "bg2", color: "#F0FDF4", label: "Mint" },
    { id: "bg3", color: "#FEF3C7", label: "Sunny" },
    { id: "bg4", color: "#FDF2F8", label: "Rose" },
    { id: "bg5", color: "#F5F3FF", label: "Lavender" },
    { id: "bg6", color: "#ECFDF5", label: "Emerald" },
    { id: "bg7", color: "#FFF7ED", label: "Peach" },
    { id: "bg8", color: "#F0F9FF", label: "Ice" },
  ],
};

export const DEFAULT_AVATAR = {
  face: "f1",
  eyes: "e1",
  mouth: "m1",
  hair: "h1",
  accessory: "a0",
  hat: "ht0",
  bg: "bg1",
};

export function getAvatarData() {
  try { return JSON.parse(localStorage.getItem("geo:avatar")) || DEFAULT_AVATAR; } catch { return DEFAULT_AVATAR; }
}

export function saveAvatarData(data) {
  localStorage.setItem("geo:avatar", JSON.stringify(data));
}

function getPart(category, id) {
  return AVATAR_PARTS[category]?.find(p => p.id === id);
}

export default function AvatarDisplay({ avatar, size = 48, className = "" }) {
  const data = avatar || getAvatarData();
  const face = getPart("face", data.face) || AVATAR_PARTS.face[0];
  const eyes = getPart("eyes", data.eyes) || AVATAR_PARTS.eyes[0];
  const mouth = getPart("mouth", data.mouth) || AVATAR_PARTS.mouth[0];
  const hair = getPart("hair", data.hair) || AVATAR_PARTS.hair[0];
  const accessory = getPart("accessory", data.accessory);
  const hat = getPart("hat", data.hat);
  const bg = getPart("bg", data.bg) || AVATAR_PARTS.bg[0];

  const s = size;
  const innerS = Math.round(s * 0.7);

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ width: s, height: s, backgroundColor: bg.color }}
    >
      <svg viewBox="0 0 32 32" width={innerS} height={innerS} className="relative z-10">
        {/* Hair background */}
        <circle cx="16" cy="10" r="8" fill={hair.color} opacity="0.9" />
        {hair.id !== "h1" && hair.id !== "h3" && hair.id !== "h5" && (
          <ellipse cx="16" cy="16" rx="10" ry="6" fill={hair.color} opacity="0.4" />
        )}
        {/* Face circle */}
        <circle cx="16" cy="16" r="7" fill="#FBBF7D" />
        {/* Eyes */}
        <circle cx="13" cy="14" r="1.8" fill="white" />
        <circle cx="19" cy="14" r="1.8" fill="white" />
        <circle cx="13" cy="14" r="1" fill={eyes.color} />
        <circle cx="19" cy="14" r="1" fill={eyes.color} />
        <circle cx="13.3" cy="13.7" r="0.3" fill="white" />
        <circle cx="19.3" cy="13.7" r="0.3" fill="white" />
        {/* Mouth */}
        <path d={mouth.path} fill="none" stroke="#B45309" strokeWidth="0.8" strokeLinecap="round" />
        {/* Nose */}
        <ellipse cx="16" cy="16.5" rx="0.6" ry="0.4" fill="#D97706" opacity="0.5" />
      </svg>

      {/* Accessory overlay */}
      {accessory && accessory.emoji && (
        <span className="absolute z-20" style={{ fontSize: s * 0.25, top: "10%", right: "10%" }}>
          {accessory.emoji}
        </span>
      )}

      {/* Hat overlay */}
      {hat && hat.emoji && (
        <span className="absolute z-30" style={{ fontSize: s * 0.3, top: "-5%", left: "50%", transform: "translateX(-50%)" }}>
          {hat.emoji}
        </span>
      )}
    </div>
  );
}
