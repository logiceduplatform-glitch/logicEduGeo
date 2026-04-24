import React, { useContext, useMemo, useState, useRef } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const FREE_AVATARS = ["🦊", "🐼", "🦁", "🐸", "🐶", "🐱", "🐰", "🦄", "🐻", "🐧", "🦋", "🐝"];

const T = {
  el: { title: "Επίλεξε Avatar", free: "Δωρεάν", premium: "Premium", select: "Επιλογή", locked: "Κλειδωμένο", close: "Κλείσιμο", uploadPhoto: "Ανέβασε φωτογραφία", or: "ή" },
  en: { title: "Choose Avatar", free: "Free", premium: "Premium", select: "Select", locked: "Locked", close: "Close", uploadPhoto: "Upload photo", or: "or" },
};

function resizeImage(file, maxSize = 128) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AvatarPicker({ currentAvatar, currentPhotoUrl, onSelect, onPhotoUpload, onClose, ownedAvatars = [] }) {
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const [selected, setSelected] = useState(currentAvatar || "");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const premiumAvatars = useMemo(() => {
    try {
      const owned = JSON.parse(localStorage.getItem("geo:shop:owned")) || [];
      return owned.filter((item) => item.type === "avatar").map((item) => item.emoji);
    } catch { return []; }
  }, []);

  const allAvatars = useMemo(() => {
    const combined = [...FREE_AVATARS];
    for (const pa of premiumAvatars) {
      if (!combined.includes(pa)) combined.push(pa);
    }
    for (const oa of ownedAvatars) {
      if (!combined.includes(oa)) combined.push(oa);
    }
    return combined;
  }, [premiumAvatars, ownedAvatars]);

  const handleConfirm = () => {
    if (selected) {
      setPhotoPreview(null);
      onSelect(selected);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file, 128);
      setPhotoPreview(dataUrl);
      setSelected("");
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoConfirm = () => {
    if (photoPreview && onPhotoUpload) {
      onPhotoUpload(photoPreview);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={l.title}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center mb-5">
          {l.title}
        </h2>

        {/* Photo upload */}
        <div className="mb-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="preview" className="w-12 h-12 rounded-xl object-cover" />
            ) : currentPhotoUrl ? (
              <img src={currentPhotoUrl} alt="current" className="w-12 h-12 rounded-xl object-cover opacity-60" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">📷</div>
            )}
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{l.uploadPhoto}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">JPG, PNG</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">{l.or}</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Emoji avatars */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {allAvatars.map((emoji) => (
            <button
              key={emoji}
              onClick={() => { setSelected(emoji); setPhotoPreview(null); }}
              className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition-all ${
                selected === emoji && !photoPreview
                  ? "bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-500 scale-110 shadow-lg"
                  : "bg-slate-100 dark:bg-slate-700 border-2 border-transparent hover:border-purple-300 hover:scale-105"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {l.close}
          </button>
          {photoPreview ? (
            <button
              onClick={handlePhotoConfirm}
              className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              {l.select}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {l.select}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
