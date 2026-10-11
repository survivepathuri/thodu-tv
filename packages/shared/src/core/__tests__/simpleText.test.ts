import {DICTIONARIES, LANGS} from '../strings';
import {en} from '../strings/en';
import {
  SIMPLE_LENGTH_EXCEPTIONS,
  SIMPLE_STRINGS,
  translateSimple,
} from '../simpleText';

const simpleKeys = (lang: 'en' | 'hi' | 'te') => Object.keys(SIMPLE_STRINGS[lang]).sort();

describe('simple text', () => {
  it('has the same keys in en, hi and te', () => {
    expect(simpleKeys('hi')).toEqual(simpleKeys('en'));
    expect(simpleKeys('te')).toEqual(simpleKeys('en'));
  });

  it('only simplifies keys that exist in the normal strings', () => {
    for (const k of simpleKeys('en')) {
      expect(Object.keys(en)).toContain(k);
    }
  });

  it('covers the Setup, Home, Help, Family and Settings screens', () => {
    const keys = simpleKeys('en');
    for (const prefix of ['setup.', 'home.', 'help.', 'fam', 'settings.']) {
      expect(keys.some(k => k.startsWith(prefix))).toBe(true);
    }
  });

  it.each(LANGS)('%s simple strings are non-empty and keep placeholders', lang => {
    const normal = DICTIONARIES[lang] as Record<string, string>;
    const simple = SIMPLE_STRINGS[lang] as Record<string, string>;
    for (const k of Object.keys(simple)) {
      expect(simple[k].trim()).not.toBe('');
      const placeholders = normal[k].match(/\{\w+\}/g) ?? [];
      for (const p of placeholders) {
        expect(simple[k]).toContain(p);
      }
    }
  });

  it.each(LANGS)('%s simple strings are never longer than the normal ones', lang => {
    const normal = DICTIONARIES[lang] as Record<string, string>;
    const simple = SIMPLE_STRINGS[lang] as Record<string, string>;
    for (const k of Object.keys(simple)) {
      if (SIMPLE_LENGTH_EXCEPTIONS.includes(k as never)) continue;
      expect([k, [...simple[k]].length <= [...normal[k]].length]).toEqual([k, true]);
    }
  });

  it('the exception list only names real simple keys', () => {
    for (const k of SIMPLE_LENGTH_EXCEPTIONS) {
      expect(simpleKeys('en')).toContain(k);
    }
  });

  it('returns the simple variant only when simpleLanguage is true', () => {
    expect(translateSimple('en', 'home.title', true)).toBe(SIMPLE_STRINGS.en['home.title']);
    expect(translateSimple('en', 'home.title', false)).toBe(en['home.title']);
    expect(SIMPLE_STRINGS.en['home.title']).not.toBe(en['home.title']);
  });

  it('falls back to the normal string when a key has no simple variant', () => {
    expect(translateSimple('hi', 'tile.help', true)).toBe(DICTIONARIES.hi['tile.help']);
    expect(translateSimple('te', 'common.back', true)).toBe(DICTIONARIES.te['common.back']);
  });

  it('keeps emergency wording in the simple help text', () => {
    expect(SIMPLE_STRINGS.en['help.emergency']).toMatch(/emergenc/i);
  });
});
