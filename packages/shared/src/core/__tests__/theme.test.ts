import {contrastRatio} from '../contrast';
import {HIGH_CONTRAST_PALETTE, NORMAL_PALETTE, Palette} from '../palette';
import {buildTheme, LARGE_TARGET_SCALE} from '../theme';
import {deriveSettings} from '../adapt';

const surfaces: (keyof Palette)[] = ['background', 'surface', 'surfaceFocused'];

describe('contrastRatio', () => {
  it('black on white is 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });
  it('is symmetric and 1:1 for equal colors', () => {
    expect(contrastRatio('#123456', '#123456')).toBeCloseTo(1, 5);
    expect(contrastRatio('#123456', '#FEDCBA')).toBeCloseTo(
      contrastRatio('#FEDCBA', '#123456'),
      10,
    );
  });
  it('rejects non-hex input', () => {
    expect(() => contrastRatio('red', '#000000')).toThrow();
  });
});

describe('palettes', () => {
  const P = NORMAL_PALETTE;
  const H = HIGH_CONTRAST_PALETTE;

  it.each(surfaces)('normal: text and muted text on %s are AA (4.5)', s => {
    expect(contrastRatio(P.text, P[s])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(P.textMuted, P[s])).toBeGreaterThanOrEqual(4.5);
  });
  it('normal: onAccent on accent is AA', () => {
    expect(contrastRatio(P.onAccent, P.accent)).toBeGreaterThanOrEqual(4.5);
  });
  it('normal: accent and border are visible against the background (3:1)', () => {
    expect(contrastRatio(P.accent, P.background)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(P.border, P.background)).toBeGreaterThanOrEqual(3);
  });
  it.each(surfaces)('high contrast: text and muted text on %s are AAA (7)', s => {
    expect(contrastRatio(H.text, H[s])).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(H.textMuted, H[s])).toBeGreaterThanOrEqual(7);
  });
  it('high contrast: onAccent on accent is AAA, accent and border pop on background', () => {
    expect(contrastRatio(H.onAccent, H.accent)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(H.accent, H.background)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(H.border, H.background)).toBeGreaterThanOrEqual(7);
  });
});

describe('buildTheme', () => {
  it('uses the normal palette and 1.0 scale by default', () => {
    const t = buildTheme(deriveSettings([]));
    expect(t.colors).toBe(NORMAL_PALETTE);
    expect(t.font(40)).toBe(40);
    expect(t.target(100)).toBe(100);
    expect(t.focusRingWidth).toBe(4);
    expect(t.highContrast).toBe(false);
  });
  it('lowVision: high contrast, 1.6x fonts, thick ring, large targets', () => {
    const t = buildTheme(deriveSettings(['lowVision']));
    expect(t.colors).toBe(HIGH_CONTRAST_PALETTE);
    expect(t.font(40)).toBe(64);
    expect(t.focusRingWidth).toBe(10);
    expect(t.target(100)).toBe(Math.round(100 * LARGE_TARGET_SCALE));
  });
  it('remoteDifficulty alone enlarges targets but not fonts or palette', () => {
    const t = buildTheme(deriveSettings(['remoteDifficulty']));
    expect(t.target(100)).toBe(125);
    expect(t.font(40)).toBe(40);
    expect(t.colors).toBe(NORMAL_PALETTE);
  });
});
