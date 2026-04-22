import React, { useRef, useState, useEffect } from "react";

export default function DrawingExercise({
  width = 600,
  height = 400,
  title = { en: "Drawing Exercise", el: "Άσκηση Ζωγραφικής" },
  lang = "el"
}) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const displayTitle = typeof title === "string" ? title : (title?.[lang] || title?.en || "Drawing");

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
    "#800080", "#FFC0CB", "#8B4513", "#808080"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [width, height]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.type.includes("touch")) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setDrawing(true);
    const { x, y } = getCoordinates(e);
    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoordinates(e);

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{displayTitle}</h2>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          {lang === 'el' ? 'Καθαρισμός' : 'Clear'}
        </button>
      </div>

      {/* Tools */}
      <div className="mb-4 space-y-3">
        {/* Color Palette */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            {lang === 'el' ? 'Χρώμα:' : 'Color:'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === c ? "border-slate-900 dark:border-white scale-110" : "border-slate-300 dark:border-slate-600"
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            {lang === 'el' ? 'Μέγεθος πινέλου:' : 'Brush Size:'} {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="border-2 border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="cursor-crosshair touch-none"
          style={{ display: 'block' }}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
        {lang === 'el'
          ? '🎨 Χρησιμοποίησε το ποντίκι ή το δάχτυλό σου για να ζωγραφίσεις!'
          : '🎨 Use your mouse or finger to draw!'
        }
      </div>
    </div>
  );
}
