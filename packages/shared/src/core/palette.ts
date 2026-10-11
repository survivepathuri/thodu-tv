export interface Palette {
  background: string;
  surface: string;
  surfaceFocused: string;
  text: string;
  textMuted: string;
  /** Focus ring and selected-state fill. */
  accent: string;
  /** Text drawn on top of `accent`. */
  onAccent: string;
  border: string;
}

/** Dark, calm palette. Every text pair is at least WCAG AA (4.5:1). */
export const NORMAL_PALETTE: Readonly<Palette> = Object.freeze({
  background: '#0E2230',
  surface: '#1B3A50',
  surfaceFocused: '#24506C',
  text: '#FFFFFF',
  textMuted: '#C9D8E3',
  accent: '#FFC857',
  onAccent: '#10202B',
  border: '#7B97AC',
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
});
