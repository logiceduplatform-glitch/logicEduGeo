export async function exportToPDF(elementId, filename = "report.pdf") {
  const element = document.getElementById(elementId);
  if (!element) return;

  const html2pdf = (await import("html2pdf.js")).default;

  const opt = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  return html2pdf().set(opt).from(element).save();
}
