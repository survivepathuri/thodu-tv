import {
  SYSTEM_FONT_CAP,
  TOTAL_FONT_CAP,
  effectiveFontScale,
  missingSuggestions,
  suggestedNeeds,
} from '../a11y';

describe('effectiveFontScale', () => {
  it('leaves our scale alone at system 1.0', () => {
    expect(effectiveFontScale(1, 1)).toBe(1);
    expect(effectiveFontScale(1.6, 1)).toBe(1.6);
  });
  it('multiplies by the system scale', () => {
    expect(effectiveFontScale(1, 1.15)).toBe(1.15);
  });
  it('caps the system multiplier', () => {
    expect(effectiveFontScale(1, 2)).toBe(SYSTEM_FONT_CAP);
  });
  it('caps the product', () => {
    expect(effectiveFontScale(1.6, 1.3)).toBe(TOTAL_FONT_CAP);
  });
  it('never shrinks below our scale, and never lowers an already larger one', () => {
    expect(effectiveFontScale(1, 0.85)).toBe(1);
    expect(effectiveFontScale(2.4, 1.3)).toBe(2.4);
  });
  it('survives nonsense', () => {
    expect(effectiveFontScale(NaN, NaN)).toBe(1);
    expect(effectiveFontScale(1, Infinity)).toBe(1);
    expect(effectiveFontScale(-3, 1)).toBe(1);
  });
});

describe('screen reader suggestions', () => {
  it('suggests nothing when no screen reader is on', () => {
    expect(suggestedNeeds(false)).toEqual([]);
    expect(missingSuggestions(false, [])).toEqual([]);
  });
  it('suggests easier to see and easier to read', () => {
    expect(suggestedNeeds(true)).toEqual(['lowVision', 'readingDifficulty']);
  });
  it('leaves out what is already chosen and never mutates the input', () => {
    const chosen = ['lowVision' as const];
    expect(missingSuggestions(true, chosen)).toEqual(['readingDifficulty']);
    expect(chosen).toEqual(['lowVision']);
    expect(missingSuggestions(true, ['lowVision', 'readingDifficulty'])).toEqual([]);
  });
});
