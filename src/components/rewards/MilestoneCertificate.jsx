import React, { useRef, useCallback, useEffect, useState } from "react";

const COLORS = {
  gamesPlayed: { from: "#7c3aed", to: "#ec4899", border: "#a855f7", bg1: "#f3e8ff", bg2: "#fce7f3" },
  level:       { from: "#0ea5e9", to: "#6366f1", border: "#3b82f6", bg1: "#e0f2fe", bg2: "#e0e7ff" },
  streak:      { from: "#f97316", to: "#ef4444", border: "#f59e0b", bg1: "#fff7ed", bg2: "#fef2f2" },
  correct:     { from: "#10b981", to: "#14b8a6", border: "#059669", bg1: "#ecfdf5", bg2: "#f0fdfa" },
};

export default function MilestoneCertificate({ cert, userName, lang = "el", onClose }) {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const scheme = COLORS[cert?.type] || COLORS.gamesPlayed;

  useEffect(() => {
    if (cert) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [cert]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cert) return null;

    const ctx = canvas.getContext("2d");
    const W = 800, H = 560;
    canvas.width = W;
    canvas.height = H;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, scheme.bg1);
    grad.addColorStop(1, scheme.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = scheme.border;
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = scheme.from;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.font = "40px serif";
    ctx.textAlign = "center";
    ctx.fillText(cert.icon || "🏆", W / 2, 90);

    ctx.font = "30px serif";
    ctx.fillText("⭐", 60, 70);
    ctx.fillText("⭐", W - 60, 70);
    ctx.fillText("⭐", 60, H - 50);
    ctx.fillText("⭐", W - 60, H - 50);

    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = scheme.from;
    ctx.fillText(
      lang === "el" ? "ΠΙΣΤΟΠΟΙΗΤΙΚΟ ΕΠΙΤΕΥΓΜΑΤΟΣ" : "MILESTONE CERTIFICATE",
      W / 2, 140
    );

    ctx.strokeStyle = scheme.to;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(140, 160);
    ctx.lineTo(W - 140, 160);
    ctx.stroke();

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(
      lang === "el" ? "Απονέμεται στον/στην" : "Awarded to",
      W / 2, 200
    );

    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.fillText(
      userName || (lang === "el" ? "Παίκτη" : "Player"),
      W / 2, 240
    );

    ctx.font = "bold 28px sans-serif";
    ctx.fillStyle = scheme.from;
    ctx.fillText(cert.title?.[lang] || cert.title?.en || "", W / 2, 300);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(cert.desc?.[lang] || cert.desc?.en || "", W / 2, 340);

    const dateStr = cert.earnedAt
      ? new Date(cert.earnedAt).toLocaleDateString(lang === "el" ? "el-GR" : "en-US")
      : new Date().toLocaleDateString(lang === "el" ? "el-GR" : "en-US");
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(
      `${lang === "el" ? "Ημερομηνία" : "Date"}: ${dateStr}`,
      W / 2, 390
    );

    ctx.font = "italic 16px sans-serif";
    ctx.fillStyle = scheme.to;
    ctx.fillText(
      lang === "el" ? "Συνέχισε έτσι! Είσαι φανταστικός/ή!" : "Keep going! You're fantastic!",
      W / 2, 440
    );

    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = scheme.border;
    ctx.fillText("Kibloo", W / 2, 490);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(
      lang === "el" ? "Εκπαιδευτική Πλατφόρμα Παιχνιδιών" : "Educational Gaming Platform",
      W / 2, 510
    );

    return canvas.toDataURL("image/png");
  }, [cert, userName, lang, scheme]);

  const handleDownload = () => {
    const dataUrl = draw();
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = `certificate-${cert.id}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const dataUrl = draw();
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `certificate-${cert.id}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: cert.title?.[lang] || "Certificate" });
      }
    } catch {}
  };

  if (!cert) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`relative max-w-lg w-full mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform transition-all duration-500 ${visible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <canvas ref={canvasRef} className="hidden" />

        <div className="text-center mb-4">
          <div className="text-5xl mb-2 animate-bounce">{cert.icon}</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {lang === "el" ? "Νέο Πιστοποιητικό!" : "New Certificate!"}
          </h2>
          <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-100">
            {cert.title?.[lang] || cert.title?.en}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {cert.desc?.[lang] || cert.desc?.en}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg text-sm"
          >
            <span>📥</span>
            {lang === "el" ? "Κατέβασε" : "Download"}
          </button>
          {"share" in navigator && (
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg text-sm"
            >
              <span>📤</span>
              {lang === "el" ? "Μοιράσου" : "Share"}
            </button>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold hover:scale-105 transition-transform text-sm"
          >
            {lang === "el" ? "Κλείσιμο" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
