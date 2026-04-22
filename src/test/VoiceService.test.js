import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VoiceService } from '../services/VoiceService';

describe('VoiceService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
    };
  });

  describe('isEnabled', () => {
    it('defaults to true', () => {
      expect(VoiceService.isEnabled()).toBe(true);
    });

    it('reads from localStorage', () => {
      localStorage.setItem('geo:voicePrefs', JSON.stringify({ enabled: false, rate: 0.9 }));
      expect(VoiceService.isEnabled()).toBe(false);
    });
  });

  describe('toggle', () => {
    it('toggles from enabled to disabled', () => {
      const result = VoiceService.toggle();
      expect(result).toBe(false);
      expect(VoiceService.isEnabled()).toBe(false);
    });

    it('toggles from disabled back to enabled', () => {
      VoiceService.toggle();
      const result = VoiceService.toggle();
      expect(result).toBe(true);
    });

    it('calls stop() when disabling', () => {
      VoiceService.toggle();
      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    });
  });

  describe('speak', () => {
    it('cancels previous speech before starting', () => {
      VoiceService.speak('Hello', 'en');
      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
      expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    });

    it('does not speak when disabled', () => {
      localStorage.setItem('geo:voicePrefs', JSON.stringify({ enabled: false, rate: 0.9 }));
      VoiceService.speak('Hello', 'en');
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });

    it('creates utterance with correct language for Greek', () => {
      VoiceService.speak('Γεια', 'el');
      const utterance = window.speechSynthesis.speak.mock.calls[0][0];
      expect(utterance.lang).toBe('el-GR');
    });

    it('creates utterance with correct language for English', () => {
      VoiceService.speak('Hello', 'en');
      const utterance = window.speechSynthesis.speak.mock.calls[0][0];
      expect(utterance.lang).toBe('en-US');
    });
  });

  describe('speakInstruction', () => {
    it('speaks the instruction for the given game ID', () => {
      const instructions = {
        chess: { el: 'Σκάκι', en: 'Chess game' },
      };
      VoiceService.speakInstruction('chess', 'en', instructions);
      expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    });

    it('does nothing when no instructions provided', () => {
      VoiceService.speakInstruction('chess', 'en', null);
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });

    it('does nothing when gameId not in instructions', () => {
      VoiceService.speakInstruction('unknown', 'en', { chess: { en: 'Play chess' } });
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('calls speechSynthesis.cancel', () => {
      VoiceService.stop();
      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    });
  });

  describe('rate', () => {
    it('defaults to 0.9', () => {
      expect(VoiceService.getRate()).toBe(0.9);
    });

    it('setRate changes the rate', () => {
      VoiceService.setRate(1.5);
      expect(VoiceService.getRate()).toBe(1.5);
    });

    it('clamps rate to min 0.5', () => {
      VoiceService.setRate(0.1);
      expect(VoiceService.getRate()).toBe(0.5);
    });

    it('clamps rate to max 2', () => {
      VoiceService.setRate(5);
      expect(VoiceService.getRate()).toBe(2);
    });
  });
});
