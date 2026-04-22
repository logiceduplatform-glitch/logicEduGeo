import '@testing-library/jest-dom';

window.speechSynthesis = {
  speak: () => {},
  cancel: () => {},
  getVoices: () => [],
  addEventListener: () => {},
  removeEventListener: () => {},
};

window.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.rate = 1;
    this.pitch = 1;
    this.voice = null;
  }
};

window.Audio = class {
  play() { return Promise.resolve(); }
  pause() {}
  set preload(_) {}
};

window.matchMedia = window.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
};
