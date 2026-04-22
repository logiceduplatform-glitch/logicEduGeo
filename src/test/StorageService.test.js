import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/StorageService';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.setScope(null);
  });

  describe('set / get', () => {
    it('stores and retrieves a value', () => {
      StorageService.set('test-key', { foo: 'bar' });
      expect(StorageService.get('test-key')).toEqual({ foo: 'bar' });
    });

    it('auto-prefixes keys with geo:', () => {
      StorageService.set('mykey', 42);
      expect(localStorage.getItem('geo:mykey')).toBe('42');
    });

    it('does not double-prefix keys starting with geo:', () => {
      StorageService.set('geo:mykey', 'value');
      expect(localStorage.getItem('geo:mykey')).toBe('"value"');
    });

    it('returns null for non-existent key', () => {
      expect(StorageService.get('nonexistent')).toBeNull();
    });

    it('returns null for corrupted JSON', () => {
      localStorage.setItem('geo:bad', 'not-json{');
      expect(StorageService.get('bad')).toBeNull();
    });

    it('handles primitive values', () => {
      StorageService.set('num', 123);
      expect(StorageService.get('num')).toBe(123);

      StorageService.set('str', 'hello');
      expect(StorageService.get('str')).toBe('hello');

      StorageService.set('bool', true);
      expect(StorageService.get('bool')).toBe(true);
    });

    it('handles arrays', () => {
      StorageService.set('arr', [1, 2, 3]);
      expect(StorageService.get('arr')).toEqual([1, 2, 3]);
    });

    it('handles nested objects', () => {
      const nested = { a: { b: { c: 'deep' } } };
      StorageService.set('nested', nested);
      expect(StorageService.get('nested')).toEqual(nested);
    });
  });

  describe('remove', () => {
    it('removes a stored key', () => {
      StorageService.set('to-remove', 'value');
      StorageService.remove('to-remove');
      expect(StorageService.get('to-remove')).toBeNull();
    });

    it('does not throw for non-existent key', () => {
      expect(() => StorageService.remove('nope')).not.toThrow();
    });
  });

  describe('getAll', () => {
    it('returns all entries matching a prefix', () => {
      StorageService.set('progress:game:chess', { score: 10 });
      StorageService.set('progress:game:math', { score: 20 });
      StorageService.set('settings:theme', 'dark');

      const results = StorageService.getAll('progress:game:');
      expect(Object.keys(results)).toHaveLength(2);
      expect(results['progress:game:chess']).toEqual({ score: 10 });
      expect(results['progress:game:math']).toEqual({ score: 20 });
    });

    it('returns empty object when no matches', () => {
      expect(StorageService.getAll('nonexistent:')).toEqual({});
    });

    it('skips corrupted entries', () => {
      StorageService.set('data:good', { value: 1 });
      localStorage.setItem('geo:data:bad', 'broken{json');

      const results = StorageService.getAll('data:');
      expect(results['data:good']).toEqual({ value: 1 });
      expect(results['data:bad']).toBeUndefined();
    });
  });

  describe('scope (per-child isolation)', () => {
    it('setScope prefixes keys with profile id', () => {
      StorageService.setScope('child_123');
      StorageService.set('progress:favorites', ['chess']);
      expect(localStorage.getItem('geo:profile:child_123:progress:favorites')).toBe('["chess"]');
      expect(StorageService.get('progress:favorites')).toEqual(['chess']);
    });

    it('different scopes have independent data', () => {
      StorageService.setScope('child_A');
      StorageService.set('progress:favorites', ['game1']);

      StorageService.setScope('child_B');
      StorageService.set('progress:favorites', ['game2']);

      StorageService.setScope('child_A');
      expect(StorageService.get('progress:favorites')).toEqual(['game1']);

      StorageService.setScope('child_B');
      expect(StorageService.get('progress:favorites')).toEqual(['game2']);
    });

    it('clearing scope returns to global keys', () => {
      StorageService.set('progress:favorites', ['global']);

      StorageService.setScope('child_X');
      StorageService.set('progress:favorites', ['child']);

      StorageService.setScope(null);
      expect(StorageService.get('progress:favorites')).toEqual(['global']);
    });

    it('getAll respects scope', () => {
      StorageService.set('progress:game:a', { score: 1 });

      StorageService.setScope('child_1');
      StorageService.set('progress:game:b', { score: 2 });

      const scoped = StorageService.getAll('progress:game:');
      expect(Object.keys(scoped)).toHaveLength(1);
      expect(scoped['progress:game:b']).toEqual({ score: 2 });
    });

    it('getGlobal ignores scope', () => {
      StorageService.setGlobal('subscription', { tier: 'premium' });
      StorageService.setScope('child_1');
      expect(StorageService.getGlobal('subscription')).toEqual({ tier: 'premium' });
    });

    it('setGlobal writes to unscoped key', () => {
      StorageService.setScope('child_1');
      StorageService.setGlobal('theme', 'dark');
      expect(localStorage.getItem('geo:theme')).toBe('"dark"');
    });

    it('getScope returns current scope prefix', () => {
      expect(StorageService.getScope()).toBe('');
      StorageService.setScope('child_5');
      expect(StorageService.getScope()).toBe('profile:child_5:');
    });
  });

  describe('setAdapter', () => {
    it('allows swapping the storage backend', () => {
      const mockAdapter = {
        get: () => 'mock-value',
        set: () => {},
        remove: () => {},
        getAll: () => ({}),
      };

      StorageService.setAdapter(mockAdapter);
      expect(StorageService.get('anything')).toBe('mock-value');

      // Reset to default
      StorageService.setAdapter({
        get(key) {
          try {
            const raw = localStorage.getItem('geo:' + key);
            return raw ? JSON.parse(raw) : null;
          } catch { return null; }
        },
        set(key, value) { localStorage.setItem('geo:' + key, JSON.stringify(value)); },
        remove(key) { localStorage.removeItem('geo:' + key); },
        getAll() { return {}; },
      });
    });
  });
});
