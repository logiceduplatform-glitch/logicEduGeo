import React, { useState, useEffect } from "react";

const TESTIMONIALS = {
  el: [
    {
      name: "Μαρία Κ.",
      role: "Μητέρα 2 παιδιών",
      emoji: "👩‍👧‍👦",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      stars: 5,
      verified: true,
      text: "Ο 6χρονος γιος μου πλέον ξέρει τα γράμματα μόνος του — σε 3 εβδομάδες χρήσης! Η μικρή μου (4) ζητάει κάθε βράδυ «τα παιχνιδάκια». Το dashboard γονέα με βοηθάει να βλέπω ακριβώς τι μαθαίνουν.",
    },
    {
      name: "Γιώργος Π.",
      role: "Δάσκαλος Β' Δημοτικού",
      emoji: "👨‍🏫",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      stars: 5,
      verified: true,
      text: "Χρησιμοποιώ την πλατφόρμα στην τάξη μου εδώ και 2 μήνες. Η προσαρμοστική δυσκολία βοηθάει τον κάθε μαθητή στο δικό του ρυθμό. Ακόμα και οι πιο αδιάφοροι μαθητές ζητάνε να παίξουν!",
    },
    {
      name: "Ελένη Δ.",
      role: "Μητέρα & παιδίατρος",
      emoji: "👩‍⚕️",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      stars: 5,
      verified: true,
      text: "Ως παιδίατρος, συστήνω screen time μόνο αν είναι εκπαιδευτικό. Αυτή η πλατφόρμα τικάρει όλα τα κουτάκια: ασφαλής, χωρίς διαφημίσεις, και τα παιδιά μαθαίνουν πραγματικά. Τα πιστοποιητικά είναι εξαιρετικό κίνητρο.",
    },
  ],
  en: [
    {
      name: "Maria K.",
      role: "Mother of 2",
      emoji: "👩‍👧‍👦",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      stars: 5,
      verified: true,
      text: "My 6-year-old now recognizes all letters on his own — in just 3 weeks! My 4-year-old asks for 'the games' every evening. The parent dashboard lets me see exactly what they're learning.",
    },
    {
      name: "George P.",
      role: "2nd Grade Teacher",
      emoji: "👨‍🏫",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      stars: 5,
      verified: true,
      text: "I've been using the platform in my classroom for 2 months. The adaptive difficulty helps each student learn at their own pace. Even my most disengaged students are asking to play!",
    },
    {
      name: "Elena D.",
      role: "Mother & Pediatrician",
      emoji: "👩‍⚕️",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      stars: 5,
      verified: true,
      text: "As a pediatrician, I only recommend screen time that's truly educational. This platform checks every box: safe, ad-free, and kids actually learn. The certificates are a brilliant motivator.",
    },
  ],
};

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      className="relative bg-white dark:bg-slate-800 rounded-3xl p-7 border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Quote mark */}
      <div className="absolute -top-3 left-6 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
        "
      </div>

      <Stars count={t.stars} />
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 mb-6 text-sm">{t.text}</p>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-xl shadow-md`}>
          {t.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{t.name}</span>
            {t.verified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ lang }) {
  const isEl = lang === "el";
  const testimonials = TESTIMONIALS[isEl ? "el" : "en"];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            {isEl ? "Αξιολογήσεις" : "Testimonials"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">
            {isEl ? "Τι λένε οι γονείς" : "What parents say"}
          </h2>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="w-full shrink-0 px-2">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIdx ? "bg-purple-600 w-6" : "bg-slate-300 dark:bg-slate-600"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
