// src/components/games/exercises_4_5/SpotTheDifference.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function SpotTheDifference({ lang = "el", onComplete }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const [clickFeedback, setClickFeedback] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_IMAGES = 4; // 4 εικόνες

  const imagesData = {
    el: [
      {
        id: 1,
        name: "Κήπος",
        emoji: "🌻",
        color: "#10B981",
        differences: [
          { id: 1, x: 25, y: 30, label: "Λουλούδι", emoji: "🌸" },
          { id: 2, x: 50, y: 45, label: "Πεταλούδα", emoji: "🦋" },
          { id: 3, x: 75, y: 35, label: "Σύννεφο", emoji: "☁️" },
          { id: 4, x: 60, y: 70, label: "Χλόη", emoji: "🌿" },
          { id: 5, x: 35, y: 65, label: "Πέτρα", emoji: "🪨" },
        ]
      },
      {
        id: 2,
        name: "Δωμάτιο",
        emoji: "🏠",
        color: "#F59E0B",
        differences: [
          { id: 1, x: 30, y: 25, label: "Πίνακας", emoji: "🖼️" },
          { id: 2, x: 65, y: 40, label: "Λάμπα", emoji: "💡" },
          { id: 3, x: 45, y: 60, label: "Μαξιλάρι", emoji: "🛋️" },
          { id: 4, x: 75, y: 70, label: "Παιχνίδι", emoji: "🧸" },
          { id: 5, x: 20, y: 55, label: "Βιβλίο", emoji: "📚" },
        ]
      },
      {
        id: 3,
        name: "Παραλία",
        emoji: "🏖️",
        color: "#06B6D4",
        differences: [
          { id: 1, x: 40, y: 30, label: "Ήλιος", emoji: "☀️" },
          { id: 2, x: 55, y: 50, label: "Ομπρέλα", emoji: "⛱️" },
          { id: 3, x: 70, y: 65, label: "Αστερίας", emoji: "⭐" },
          { id: 4, x: 25, y: 70, label: "Κοχύλι", emoji: "🐚" },
          { id: 5, x: 60, y: 35, label: "Πουλί", emoji: "🐦" },
        ]
      },
      {
        id: 4,
        name: "Ζωολογικός Κήπος",
        emoji: "🦁",
        color: "#EF4444",
        differences: [
          { id: 1, x: 30, y: 35, label: "Ελέφαντας", emoji: "🐘" },
          { id: 2, x: 65, y: 40, label: "Καμηλοπάρδαλη", emoji: "🦒" },
          { id: 3, x: 50, y: 60, label: "Μαϊμού", emoji: "🐒" },
          { id: 4, x: 75, y: 70, label: "Παπαγάλος", emoji: "🦜" },
          { id: 5, x: 20, y: 65, label: "Δέντρο", emoji: "🌳" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        name: "Garden",
        emoji: "🌻",
        color: "#10B981",
        differences: [
          { id: 1, x: 25, y: 30, label: "Flower", emoji: "🌸" },
          { id: 2, x: 50, y: 45, label: "Butterfly", emoji: "🦋" },
          { id: 3, x: 75, y: 35, label: "Cloud", emoji: "☁️" },
          { id: 4, x: 60, y: 70, label: "Grass", emoji: "🌿" },
          { id: 5, x: 35, y: 65, label: "Stone", emoji: "🪨" },
        ]
      },
      {
        id: 2,
        name: "Room",
        emoji: "🏠",
        color: "#F59E0B",
        differences: [
          { id: 1, x: 30, y: 25, label: "Picture", emoji: "🖼️" },
          { id: 2, x: 65, y: 40, label: "Lamp", emoji: "💡" },
          { id: 3, x: 45, y: 60, label: "Pillow", emoji: "🛋️" },
          { id: 4, x: 75, y: 70, label: "Toy", emoji: "🧸" },
          { id: 5, x: 20, y: 55, label: "Book", emoji: "📚" },
        ]
      },
      {
        id: 3,
        name: "Beach",
        emoji: "🏖️",
        color: "#06B6D4",
        differences: [
          { id: 1, x: 40, y: 30, label: "Sun", emoji: "☀️" },
          { id: 2, x: 55, y: 50, label: "Umbrella", emoji: "⛱️" },
          { id: 3, x: 70, y: 65, label: "Starfish", emoji: "⭐" },
          { id: 4, x: 25, y: 70, label: "Shell", emoji: "🐚" },
          { id: 5, x: 60, y: 35, label: "Bird", emoji: "🐦" },
        ]
      },
      {
        id: 4,
        name: "Zoo",
        emoji: "🦁",
        color: "#EF4444",
        differences: [
          { id: 1, x: 30, y: 35, label: "Elephant", emoji: "🐘" },
          { id: 2, x: 65, y: 40, label: "Giraffe", emoji: "🦒" },
          { id: 3, x: 50, y: 60, label: "Monkey", emoji: "🐒" },
          { id: 4, x: 75, y: 70, label: "Parrot", emoji: "🦜" },
          { id: 5, x: 20, y: 65, label: "Tree", emoji: "🌳" },
        ]
      }
    ]
  };

  const images = imagesData[lang];
  const image = images[currentImage];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setFoundDifferences([]);
  }, [currentImage]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔍", "👀"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleImageClick = (e, imageNum) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked near a difference
    const clickedDiff = image.differences.find(diff => {
      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      return distance < 10 && !foundDifferences.includes(diff.id);
    });

    if (clickedDiff) {
      // Found a difference!
      correctSoundRef.current?.play().catch(() => {});

      const newFound = [...foundDifferences, clickedDiff.id];
      setFoundDifferences(newFound);

      const newScore = score + 1;
      setScore(newScore);

      // Show +1 score popup
      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      // Show click feedback
      setClickFeedback({ x: e.clientX - rect.left, y: e.clientY - rect.top, correct: true, imageNum });
      setTimeout(() => setClickFeedback(null), 1000);

      // Update progress
      updateProgress({
        title: "Spot the Difference",
        score: newScore,
        total: image.differences.length * TARGET_IMAGES,
        index: currentImage * image.differences.length + newFound.length,
      });

      completeQuiz({
        title: "Spot the Difference",
        score: 1,
        total: 1,
      });

      // Check if all differences found
      if (newFound.length === image.differences.length) {
        handleImageComplete();
      }
    } else {
      // Wrong click
      wrongSoundRef.current?.play().catch(() => {});

      setClickFeedback({ x: e.clientX - rect.left, y: e.clientY - rect.top, correct: false, imageNum });
      setTimeout(() => setClickFeedback(null), 800);
    }
  };

  const handleImageComplete = () => {
    setTimeout(() => {
      if (currentImage + 1 < TARGET_IMAGES) {
        setCurrentImage(prev => prev + 1);
      } else {
        // All images complete
        createCelebrationEmojis();
        setShowCelebration(true);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2500);
      }
    }, 2000);
  };

  const progressPercent = Math.round(((currentImage + 1) / TARGET_IMAGES) * 100);
  const imageProgress = Math.round((foundDifferences.length / image.differences.length) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-20"
          style={{
            left: `${item.x}%`,
            top: "50%",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{
            left: `${scorePopup.x}%`,
            top: "40%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Βρες τις Διαφορές" : "Spot the Differences"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Εικόνα ${currentImage + 1}/${TARGET_IMAGES}: ${image.name}`
                : `Image ${currentImage + 1}/${TARGET_IMAGES}: ${image.name}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            🔍 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4" style={{ borderColor: image.color }}>
          <div className="text-7xl mb-3">{image.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: image.color }}>
            {image.name}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === "el" ? "Βρες τις 5 διαφορές!" : "Find the 5 differences!"}
          </p>
          <div className="mt-3">
            <div className="inline-block bg-slate-100 rounded-xl px-6 py-2">
              <span className="text-lg font-bold text-slate-700">
                {foundDifferences.length} / {image.differences.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image 1 */}
          <div className="relative">
            <div
              onClick={(e) => handleImageClick(e, 1)}
              className="relative bg-white rounded-3xl shadow-2xl p-4 border-4 border-slate-200 cursor-crosshair overflow-hidden"
              style={{ minHeight: "400px" }}
            >
              <div className="absolute inset-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                {/* Show ALL differences as large emojis */}
                {image.differences.map(diff => (
                  <div
                    key={diff.id}
                    className="absolute"
                    style={{
                      left: `${diff.x}%`,
                      top: `${diff.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="text-7xl">{diff.emoji}</div>
                  </div>
                ))}
              </div>

              {/* Show green circles for found differences */}
              {image.differences.filter(diff => foundDifferences.includes(diff.id)).map(diff => (
                <div
                  key={`found-${diff.id}`}
                  className="absolute w-24 h-24 border-8 border-green-500 rounded-full bg-green-100/50"
                  style={{
                    left: `${diff.x}%`,
                    top: `${diff.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl">✅</span>
                  </div>
                </div>
              ))}

              {/* Click feedback for image 1 */}
              {clickFeedback && clickFeedback.imageNum === 1 && (
                <div
                  className={`absolute text-5xl animate-ping pointer-events-none`}
                  style={{
                    left: `${clickFeedback.x}px`,
                    top: `${clickFeedback.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {clickFeedback.correct ? '✅' : '❌'}
                </div>
              )}
            </div>
          </div>

          {/* Image 2 */}
          <div className="relative">
            <div
              onClick={(e) => handleImageClick(e, 2)}
              className="relative bg-white rounded-3xl shadow-2xl p-4 border-4 border-slate-200 cursor-crosshair overflow-hidden"
              style={{ minHeight: "400px" }}
            >
              <div className="absolute inset-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                {/* Show differences with slight variations (some missing, some different size) */}
                {image.differences.map((diff, index) => (
                  <div
                    key={diff.id}
                    className="absolute"
                    style={{
                      left: `${diff.x}%`,
                      top: `${diff.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Make differences: some items missing (opacity 0), some smaller, some different */}
                    <div
                      className={index % 2 === 0 ? "text-5xl" : "text-7xl"}
                      style={{ opacity: index % 3 === 0 ? 0 : 1 }}
                    >
                      {diff.emoji}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show green circles for found differences */}
              {image.differences.filter(diff => foundDifferences.includes(diff.id)).map(diff => (
                <div
                  key={`found-${diff.id}`}
                  className="absolute w-24 h-24 border-8 border-green-500 rounded-full bg-green-100/50"
                  style={{
                    left: `${diff.x}%`,
                    top: `${diff.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl">✅</span>
                  </div>
                </div>
              ))}

              {/* Click feedback for image 2 */}
              {clickFeedback && clickFeedback.imageNum === 2 && (
                <div
                  className={`absolute text-5xl animate-ping pointer-events-none`}
                  style={{
                    left: `${clickFeedback.x}px`,
                    top: `${clickFeedback.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {clickFeedback.correct ? '✅' : '❌'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${imageProgress}%`,
                  backgroundColor: image.color
                }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {imageProgress}%
            </span>
          </div>
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔍🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια Παρατηρητικότητα!" : "Perfect Observation!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}

