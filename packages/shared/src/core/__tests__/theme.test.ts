import {contrastRatio} from '../contrast';
import {
  HIGH_CONTRAST_PALETTE,
  Palette,
  SUNRISE_PALETTE,
  TILE_IDS,
} from '../palette';
import {ALL_NEEDS} from '../needs';
import {buildTheme, LARGE_TARGET_SCALE} from '../theme';
import {deriveSettings} from '../adapt';

const AA = 4.5;
const AAA = 7;

interface Pair {
  name: string;
  fg: string;
  bg: string;
  min: number;
}

/** Every text-on-background pair the UI can draw with this palette. */
function textPairs(p: Palette, strict: number): Pair[] {
  const out: Pair[] = [];
  for (const s of ['background', 'surface', 'surfaceFocused'] as const) {
    out.push({name: `text on ${s}`, fg: p.text, bg: p[s], min: AA});
    out.push({name: `textMuted on ${s}`, fg: p.textMuted, bg: p[s], min: AA});
  }
  out.push({name: 'onAccent on accent', fg: p.onAccent, bg: p.accent, min: AA});
  for (const id of TILE_IDS) {
    out.push({name: `tile ${id} label`, fg: p.tile[id].fg, bg: p.tile[id].bg, min: strict});
    out.push({name: `tile ${id} glyph`, fg: p.tile[id].glyph, bg: p.tile[id].bg, min: AA});
  }
  for (const n of ALL_NEEDS) {
    const c = p.card[n];
    out.push({name: `card ${n} text`, fg: c.fg, bg: c.bg, min: strict});
    out.push({name: `card ${n} selected text`, fg: c.fgSelected, bg: c.bgSelected, min: strict});
  }
  return out;
}

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

describe.each([
  ['Sunrise (default)', SUNRISE_PALETTE, AAA],
  ['High contrast', HIGH_CONTRAST_PALETTE, AAA],
] as const)('%s palette contrast', (_label, palette, strict) => {
  const pairs = textPairs(palette, strict);

  it.each(pairs.map(p => [p.name, p] as const))('%s meets its minimum', (_n, p) => {
    expect(contrastRatio(p.fg, p.bg)).toBeGreaterThanOrEqual(p.min);
  });

  it('never goes below AA for any pair', () => {
    for (const p of pairs) {
      expect(contrastRatio(p.fg, p.bg)).toBeGreaterThanOrEqual(AA);
    }
  });

  it('focus ring is clearly visible against the background and every tile (3:1)', () => {
    expect(contrastRatio(palette.focusRing, palette.background)).toBeGreaterThanOrEqual(3);
    for (const id of TILE_IDS) {
      expect(contrastRatio(palette.focusRing, palette.tile[id].bg)).toBeGreaterThanOrEqual(3);
    }
  });

  it('border is visible against the background (3:1)', () => {
    expect(contrastRatio(palette.border, palette.background)).toBeGreaterThanOrEqual(3);
  });
});

describe('Sunrise palette character', () => {
  it('is warm and not black or pure white', () => {
    expect(SUNRISE_PALETTE.background).not.toBe('#000000');
    expect(SUNRISE_PALETTE.background).not.toBe('#FFFFFF');
  });
  it('gives every tile its own colour', () => {
    const colors = TILE_IDS.map(id => SUNRISE_PALETTE.tile[id].bg);
    expect(new Set(colors).size).toBe(TILE_IDS.length);
  });
});

describe('buildTheme', () => {
  it('uses Sunrise and 1.0 scale by default', () => {
    const t = buildTheme(deriveSettings([]));
    expect(t.colors).toBe(SUNRISE_PALETTE);
    expect(t.name).toBe('sunrise');
    expect(t.font(40)).toBe(40);
    expect(t.target(100)).toBe(100);
    expect(t.focusRingWidth).toBe(4);
    expect(t.highContrast).toBe(false);
  });
  it('lowVision: high contrast, 1.6x fonts, thick ring, large targets', () => {
    const t = buildTheme(deriveSettings(['lowVision']));
    expect(t.colors).toBe(HIGH_CONTRAST_PALETTE);
    expect(t.name).toBe('highContrast');
    expect(t.font(40)).toBe(64);
    expect(t.focusRingWidth).toBe(10);
    expect(t.target(100)).toBe(Math.round(100 * LARGE_TARGET_SCALE));
  });
  it('high contrast only comes from lowVision', () => {
    for (const n of ['hardOfHearing', 'remoteDifficulty', 'readingDifficulty'] as const) {
      expect(buildTheme(deriveSettings([n])).colors).toBe(SUNRISE_PALETTE);
    }
  });
  it('remoteDifficulty alone enlarges targets but not fonts or palette', () => {
    const t = buildTheme(deriveSettings(['remoteDifficulty']));
    expect(t.target(100)).toBe(125);
    expect(t.font(40)).toBe(40);
    expect(t.colors).toBe(SUNRISE_PALETTE);
  });
});
