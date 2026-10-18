import type {Need} from './needs';

export type TileId = 'watch' | 'family' | 'medicines' | 'help' | 'settings';

export const TILE_IDS: readonly TileId[] = [
  'watch',
  'family',
  'medicines',
  'help',
  'settings',
];

/** A coloured surface: its fill, the text drawn on it and its icon glyph. */
export interface Swatch {
  bg: string;
  fg: string;
  glyph: string;
}

export interface CardSwatch {
  bg: string;
  bgSelected: string;
  fg: string;
  fgSelected: string;
}

export interface Palette {
  background: string;
  surface: string;
  surfaceFocused: string;
  text: string;
  textMuted: string;
  /** Primary buttons and language chips. */
  accent: string;
  /** Text drawn on top of `accent`. */
  onAccent: string;
  border: string;
  /** Thick ring drawn around the focused / highlighted item. */
  focusRing: string;
  /** One distinct colour per Home tile. */
  tile: Record<TileId, Swatch>;
  /** One soft colour per setup card. */
  card: Record<Need, CardSwatch>;
}

const INK = '#1B1F3B';

/**
 * Default "Sunrise" look: warm cream (not pure white), deep ink text, one
 * colour per tile, thick dark-indigo focus ring. Colour is never the only
 * cue: every tile and card also has an icon glyph and a text label.
 */
export const SUNRISE_PALETTE: Readonly<Palette> = Object.freeze({
  background: '#FFF4DE',
  surface: '#FFFBF2',
  surfaceFocused: '#FFFFFF',
  text: INK,
  textMuted: '#454A6B',
  accent: '#FFB703',
  onAccent: INK,
  border: '#8A7F6A',
  focusRing: '#2A2A8F',
  tile: {
    watch: {bg: '#7DB8FF', fg: INK, glyph: INK},
    family: {bg: '#FF9EC4', fg: INK, glyph: INK},
    medicines: {bg: '#7FD99A', fg: INK, glyph: INK},
    help: {bg: '#FFA95C', fg: INK, glyph: INK},
    settings: {bg: '#C3A6FF', fg: INK, glyph: INK},
  },
  card: {
    lowVision: {bg: '#E1EEFF', bgSelected: '#7DB8FF', fg: INK, fgSelected: INK},
    hardOfHearing: {bg: '#FFE3EE', bgSelected: '#FF9EC4', fg: INK, fgSelected: INK},
    remoteDifficulty: {bg: '#E0F6E7', bgSelected: '#7FD99A', fg: INK, fgSelected: INK},
    readingDifficulty: {bg: '#FFEBD6', bgSelected: '#FFA95C', fg: INK, fgSelected: INK},
  },
});

/** Near-black, white text, one strong yellow accent. Text pairs are AAA (7:1). */
export const HIGH_CONTRAST_PALETTE: Readonly<Palette> = Object.freeze({
  background: '#000000',
  surface: '#101010',
  surfaceFocused: '#262626',
  text: '#FFFFFF',
  textMuted: '#EDEDED',
  accent: '#FFE600',
  onAccent: '#000000',
  border: '#FFFFFF',
  focusRing: '#FFFFFF',
  tile: {
    watch: {bg: '#101010', fg: '#FFFFFF', glyph: '#FFE600'},
    family: {bg: '#101010', fg: '#FFFFFF', glyph: '#FFE600'},
    medicines: {bg: '#101010', fg: '#FFFFFF', glyph: '#FFE600'},
    help: {bg: '#101010', fg: '#FFFFFF', glyph: '#FFE600'},
    settings: {bg: '#101010', fg: '#FFFFFF', glyph: '#FFE600'},
  },
  card: {
    lowVision: {bg: '#101010', bgSelected: '#FFE600', fg: '#FFFFFF', fgSelected: '#000000'},
    hardOfHearing: {bg: '#101010', bgSelected: '#FFE600', fg: '#FFFFFF', fgSelected: '#000000'},
    remoteDifficulty: {bg: '#101010', bgSelected: '#FFE600', fg: '#FFFFFF', fgSelected: '#000000'},
    readingDifficulty: {bg: '#101010', bgSelected: '#FFE600', fg: '#FFFFFF', fgSelected: '#000000'},
  },
});
