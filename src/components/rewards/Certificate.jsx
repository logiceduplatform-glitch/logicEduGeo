import React, { useRef } from "react";

export default function Certificate({ childName, date, category, score, total, lang = "el" }) {
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = 800;
    const H = 560;
    canvas.width = W;
    canvas.height = H;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#f3e8ff");
    grad.addColorStop(0.5, "#fce7f3");
    grad.addColorStop(1, "#e0e7ff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Star decorations
    ctx.font = "30px serif";
    ctx.fillText("⭐", 50, 70);
    ctx.fillText("⭐", W - 80, 70);
    ctx.fillText("🏆", W / 2 - 15, 80);
    ctx.fillText("⭐", 50, H - 50);
    ctx.fillText("⭐", W - 80, H - 50);

    // Title
    ctx.textAlign = "center";
    ctx.font = "bold 36px sans-serif";
    ctx.fillStyle = "#7c3aed";
    ctx.fillText(lang === "el" ? "ΠΙΣΤΟΠΟΙΗΤΙΚΟ ΕΠΙΤΥΧΙΑΣ" : "CERTIFICATE OF ACHIEVEMENT", W / 2, 140);

    // Line under title
    ctx.strokeStyle = "#e879f9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 160);
    ctx.lineTo(W - 150, 160);
    ctx.stroke();

    // Presented to
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(lang === "el" ? "Απονέμεται στον/στην" : "Presented to", W / 2, 200);

    // Child name
    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.fillText(childName || (lang === "el" ? "Μικρέ Πρωταθλητή" : "Little Champion"), W / 2, 245);

    // Category
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#7c3aed";
    ctx.fillText(
      lang === "el" ? `Κατηγορία: ${category || "Γενική"}` : `Category: ${category || "General"}`,
      W / 2, 290
    );

    // Score
    if (score !== undefined && total !== undefined) {
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#059669";
      ctx.fillText(
        lang === "el" ? `Σκορ: ${score}/${total}` : `Score: ${score}/${total}`,
        W / 2, 330
      );
    }

    // Date
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(
      `${lang === "el" ? "Ημερομηνία" : "Date"}: ${date || new Date().toLocaleDateString(lang === "el" ? "el-GR" : "en-US")}`,
      W / 2, 380
    );

    // Motivational text
    ctx.font = "italic 16px sans-serif";
    ctx.fillStyle = "#7c3aed";
    ctx.fillText(
      lang === "el" ? "Συνέχισε έτσι! Είσαι υπέροχος/η!" : "Keep it up! You're amazing!",
      W / 2, 430
    );

    // Kibloo branding
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#a855f7";
    ctx.fillText("Kibloo", W / 2, 490);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText(lang === "el" ? "Εκπαιδευτική Πλατφόρμα Παιχνιδιών" : "Educational Gaming Platform", W / 2, 510);

    // Download
    const link = document.createElement("a");
    link.download = `certificate-${(childName || "student").replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="text-center">
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
      >
        <span>📜</span>
        {lang === "el" ? "Κατέβασε Πιστοποιητικό" : "Download Certificate"}
      </button>
    </div>
  );
}
