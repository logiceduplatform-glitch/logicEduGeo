import React, { useEffect, useRef } from "react";
import QRCodeLib from "qrcode";

export default function QRCode({ value, size = 160, color = "#0f172a", background = "#ffffff", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    QRCodeLib.toCanvas(
      ref.current,
      value,
      {
        width: size,
        margin: 1,
        color: { dark: color, light: background },
        errorCorrectionLevel: "M",
      },
      (err) => {
        // best effort, ignore err
      }
    );
  }, [value, size, color, background]);

  return <canvas ref={ref} className={className} aria-label="QR code" />;
}
