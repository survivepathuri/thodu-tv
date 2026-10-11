import {DICTIONARIES, LANGS, translate} from '../strings';
import {en} from '../strings/en';

describe('strings', () => {
  const keys = Object.keys(en);

  it.each(LANGS)('%s has every key and none is empty', lang => {
    const dict = DICTIONARIES[lang] as Record<string, string>;
    expect(Object.keys(dict).sort()).toEqual([...keys].sort());
    for (const k of keys) {
      expect(dict[k].trim()).not.toBe('');
    }
  });

  it('every Telugu string contains Telugu script', () => {
    const telugu = /[ఀ-౿]/;
    const dict = DICTIONARIES.te as Record<string, string>;
    for (const k of keys) {
      expect(telugu.test(dict[k])).toBe(true);
    }
  });

  it('every Hindi string contains Devanagari script', () => {
    const devanagari = /[ऀ-ॿ]/;
    const dict = DICTIONARIES.hi as Record<string, string>;
    for (const k of keys) {
      expect(devanagari.test(dict[k])).toBe(true);
    }
  });

  it('keeps placeholders like {time} in every language', () => {
    for (const lang of LANGS) {
      expect(translate(lang, 'family.phone.body')).toContain('{time}');
    }
  });

  it('language toggle order is EN / Hindi / Telugu', () => {
    expect(LANGS.map(l => translate(l, 'lang.name'))).toEqual(['EN', 'हिन्दी', 'తెలుగు']);
  });

  it('translate returns the language string', () => {
    expect(translate('hi', 'tile.help')).toBe('मदद');
    expect(translate('en', 'tile.help')).toBe('Help');
    expect(translate('te', 'tile.help')).toBe('సహాయం');
  });
});
