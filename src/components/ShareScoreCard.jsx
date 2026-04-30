import React, { useRef, useCallback, useContext, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const TEXTS = {
  el: {
    share: "Κοινοποίηση",
    copyLink: "Αντιγραφή",
    copied: "Αντιγράφηκε!",
    shareTitle: "Πέτυχα σκορ στο Kibloo!",
    shareText: (score, total, game) =>
      `🎈 Πέτυχα ${score}/${total} στο "${game}" στο Kibloo! Δοκίμασε κι εσύ!`,
    downloadCard: "Λήψη Κάρτας",
  },
  en: {
    share: "Share",
    copyLink: "Copy Link",
    copied: "Copied!",
    shareTitle: "My Kibloo Score!",
    shareText: (score, total, game) =>
      `🎈 I scored ${score}/${total} in "${game}" on Kibloo! Try it too!`,
    downloadCard: "Download Card",
  },
};

function drawScoreCard(canvas, { score, total, gameName, icon, lang }) {
  const ctx = canvas.getContext("2d");
  const w = 600, h = 340;
  canvas.width = w;
  canvas.height = h;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#7c3aed");
  grad.addColorStop(0.5, "#a855f7");
  grad.addColorStop(1, "#ec4899");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 24);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.arc(w - 60, 60, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(60, h - 40, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Kibloo", 30, 44);

  ctx.font = "48px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(icon || "🎮", w / 2, 110);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.fillText(gameName, w / 2, 150);

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  ctx.font = "bold 64px system-ui, sans-serif";
  ctx.fillText(`${pct}%`, w / 2, 225);

  ctx.font = "20px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(`${score} / ${total}`, w / 2, 260);

  const stars = pct >= 90 ? "⭐⭐⭐" : pct >= 70 ? "⭐⭐" : pct >= 50 ? "⭐" : "";
  if (stars) {
    ctx.font = "32px system-ui, sans-serif";
    ctx.fillText(stars, w / 2, 300);
  }

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "13px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("kibloo.app — Δοκίμασε κι εσύ!", w - 20, h - 16);
}

export default function ShareScoreCard({ score = 0, total = 0, gameName = "", icon = "🎮" }) {
  const { lang } = useContext(LanguageContext);
  const l = TEXTS[lang] || TEXTS.en;
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://kibloo.app";
  const shareText = l.shareText(score, total, gameName);

  const generateCard = useCallback(() => {
    if (!canvasRef.current) return null;
    drawScoreCard(canvasRef.current, { score, total, gameName, icon, lang });
    return canvasRef.current.toDataURL("image/png");
  }, [score, total, gameName, icon, lang]);

  const handleNativeShare = useCallback(async () => {
    const dataUrl = generateCard();
    const shareData = { title: l.shareTitle, text: shareText, url: shareUrl };

    if (navigator.canShare && dataUrl) {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "geolo-score.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      } catch {}
    }

    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    }
  }, [generateCard, shareText, shareUrl, l.shareTitle]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [shareText, shareUrl]);

  const handleDownload = useCallback(() => {
    const dataUrl = generateCard();
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `geolo-score-${Date.now()}.png`;
    a.click();
  }, [generateCard]);

  const handleSocialShare = useCallback((platform) => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  }, [shareText, shareUrl]);

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-wrap gap-2 justify-center">
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-transform shadow-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {l.share}
          </button>
        )}

        <button
          onClick={() => handleSocialShare("facebook")}
          className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
          aria-label="Facebook"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>

        <button
          onClick={() => handleSocialShare("twitter")}
          className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
          aria-label="X / Twitter"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>

        <button
          onClick={() => handleSocialShare("whatsapp")}
          className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
          aria-label="WhatsApp"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          {copied ? "✓" : "📋"} {copied ? l.copied : l.copyLink}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          ⬇️ {l.downloadCard}
        </button>
      </div>
    </div>
  );
}
