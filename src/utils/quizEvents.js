// src/utils/quizEvents.js

export function dispatchQuizProgress({ title, score, total, index }) {
  window.dispatchEvent(
    new CustomEvent("quizProgress", { detail: { title, score, total, index } })
  );
}

export function dispatchQuizComplete({ title, score, total }) {
  window.dispatchEvent(
    new CustomEvent("quizComplete", { detail: { title, score, total } })
  );
}
