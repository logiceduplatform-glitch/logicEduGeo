import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

function generateProblem(round) {
  const r = Math.random();
  if (round < 4) {
    const a = Math.floor(Math.random() * 12) + 2;
    const b = Math.floor(Math.random() * 12) + 2;
    return { question: `${a} × ${b}`, answer: a * b, type: "multiplication" };
  } else if (round < 8) {
    const denom = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
    const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
    const num2 = Math.floor(Math.random() * (denom - 1)) + 1;
    const sum = num1 + num2;
    return {
      question: `${num1}/${denom} + ${num2}/${denom}`,
      answer: sum >= denom ? `${Math.floor(sum / denom)} ${sum % denom}/${denom}` : `${sum}/${denom}`,
      answerNum: sum / denom,
      type: "fractions",
    };
  } else if (round < 11) {
    const base = Math.floor(Math.random() * 8) + 2;
    const exp = [2, 3][Math.floor(Math.random() * 2)];
    return { question: `${base}${exp === 2 ? "²" : "³"}`, answer: Math.pow(base, exp), type: "powers" };
  } else {
    const x = Math.floor(Math.random() * 15) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const result = x + b;
    return { question: `x + ${b} = ${result}`, answer: x, type: "equations", prefix: "x = " };
  }
}

function generateOptions(answer, isFraction) {
  if (isFraction) {
    return null;
  }
  const ans = typeof answer === "number" ? answer : parseInt(answer);
  const opts = new Set([ans]);
  while (opts.size < 4) {
    const off = Math.floor(Math.random() * 10) - 5;
    const v = Math.max(0, ans + (off === 0 ? 1 : off));
    opts.add(v);
  }
  return [...opts].sort((a, b) => a - b);
}

const MONSTERS = ["👹", "🐉", "👾", "🧟", "💀", "🦇", "🕷️", "🐍", "🦂", "👻", "🧌", "🤖"];
const WEAPONS = ["⚔️", "🗡️", "🏹", "🔥", "⚡", "💫"];

export default function MathBattleGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const [round, setRound] = useState(0);
  const [problem, setProblem] = useState(() => generateProblem(0));
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [monsterHP, setMonsterHP] = useState(3);
  const [playerHP, setPlayerHP] = useState(5);
  const [showCelebration, setShowCelebration] = useState(false);
  const [monster, setMonster] = useState(MONSTERS[0]);
  const [shake, setShake] = useState(false);
  const [defeated, setDefeated] = useState(0);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const isEl = lang === "el";
  const TARGET_ROUNDS = 14;
  const options = generateOptions(problem.answer, problem.type === "fractions");

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  const speakQuestion = () => {
    const text = isEl
      ? `Τέρας ${monster}! Λύσε: ${problem.question}`
      : `Monster ${monster}! Solve: ${problem.question}`;
    VoiceService.speak(text, lang);
  };

  useEffect(() => { speakQuestion(); }, [round]);

  const handleAnswer = (ans) => {
    if (showResult) return;
    const isCorrect = problem.type === "fractions"
      ? Math.abs(ans - problem.answerNum) < 0.01
      : ans === problem.answer;
    setSelected(ans);
    setShowResult(true);

    if (isCorrect) {
      correctRef.current?.play();
      setScore(prev => prev + 1);
      const newHP = monsterHP - 1;
      setMonsterHP(newHP);
      setShake(true);
      safeTimeout(() => setShake(false), 500);

      if (newHP <= 0) {
        setDefeated(prev => prev + 1);
        VoiceService.speak(isEl ? "Νίκη! Το τέρας ηττήθηκε!" : "Victory! Monster defeated!", lang);
      }
    } else {
      wrongRef.current?.play();
      setPlayerHP(prev => prev - 1);
    }

    updateProgress({ title: "mathBattleGame", score: score + (isCorrect ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS || playerHP <= 1) {
        setShowCelebration(true);
        const finalScore = score + (isCorrect ? 1 : 0);
        completeQuiz({ title: "mathBattleGame", score: finalScore, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: finalScore, total: TARGET_ROUNDS }), 2500);
      } else {
        const nextRound = round + 1;
        setRound(nextRound);
        setProblem(generateProblem(nextRound));
        setSelected(null);
        setShowResult(false);
        if (monsterHP <= 1 && isCorrect) {
          setMonster(MONSTERS[Math.floor(Math.random() * MONSTERS.length)]);
          setMonsterHP(3);
        }
      }
    }, 1500);
  };

  if (showCelebration) {
    const won = playerHP > 0;
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">{won ? "🏆" : "💀"}</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {won ? (isEl ? "Νίκη!" : "Victory!") : (isEl ? "Ήττα!" : "Defeat!")}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS} | Τέρατα: ${defeated}` : `Score: ${score}/${TARGET_ROUNDS} | Monsters: ${defeated}`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Μαθηματική Μονομαχία" : "Math Battle"} ⚔️
          </div>
          <div className="text-sm font-bold text-slate-500">
            {round + 1}/{TARGET_ROUNDS}
          </div>
        </div>

        {/* HP bars */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-600 mb-1">🧑 {isEl ? "Εσύ" : "You"}</p>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all" style={{ width: `${(playerHP / 5) * 100}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-red-600 mb-1">{monster} {isEl ? "Τέρας" : "Monster"}</p>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all" style={{ width: `${(monsterHP / 3) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Monster */}
        <div className={`text-center mb-4 ${shake ? "animate-[shake_0.3s]" : ""}`}>
          <span className="text-6xl inline-block transition-transform">{monster}</span>
        </div>

        {/* Type badge */}
        <div className="text-center mb-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            {problem.type === "multiplication" ? (isEl ? "Πολλαπλασιασμός" : "Multiplication")
              : problem.type === "fractions" ? (isEl ? "Κλάσματα" : "Fractions")
              : problem.type === "powers" ? (isEl ? "Δυνάμεις" : "Powers")
              : (isEl ? "Εξίσωση" : "Equation")}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
            {problem.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {options ? options.map((opt) => {
            const isCorrect = opt === problem.answer;
            const isSelected = selected === opt;
            return (
              <button key={opt} onClick={() => handleAnswer(opt)}
                disabled={showResult}
                className={[
                  "px-4 py-4 rounded-xl text-lg font-bold transition-all border-2",
                  showResult && isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 scale-105"
                    : showResult && isSelected && !isCorrect ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-purple-400 hover:shadow-md",
                ].join(" ")}>
                {problem.prefix || ""}{opt}
              </button>
            );
          }) : (
            // Fraction input
            [problem.answerNum, problem.answerNum + 0.5, problem.answerNum - 0.25, problem.answerNum * 2].sort(() => Math.random() - 0.5).map((opt, i) => {
              const display = opt === Math.floor(opt) ? `${opt}` : `${Math.round(opt * 100) / 100}`;
              const isCorrect = Math.abs(opt - problem.answerNum) < 0.01;
              const isSelected = selected === opt;
              return (
                <button key={i} onClick={() => handleAnswer(opt)}
                  disabled={showResult}
                  className={[
                    "px-4 py-4 rounded-xl text-lg font-bold transition-all border-2",
                    showResult && isCorrect ? "bg-emerald-100 border-emerald-400 text-emerald-700 scale-105"
                      : showResult && isSelected ? "bg-red-100 border-red-400 text-red-700"
                      : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-purple-400",
                  ].join(" ")}>
                  {typeof problem.answer === "string" && isCorrect ? problem.answer : display}
                </button>
              );
            })
          )}
        </div>

        {/* Score */}
        <div className="flex justify-center mt-4 gap-4 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⚔️ {score}</span>
          <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700">{WEAPONS[defeated % WEAPONS.length]} {defeated} {isEl ? "νικημένα" : "defeated"}</span>
        </div>
      </div>

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}
