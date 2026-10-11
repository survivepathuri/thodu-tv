import type {Settings} from './adapt';
import {HIGH_CONTRAST_PALETTE, NORMAL_PALETTE, Palette} from './palette';

export interface Theme {
  colors: Palette;
  /** Multiply a base font size by the user's font scale. */
  font: (base: number) => number;
  /** Multiply a base target (tile, button) size by the target scale. */
  target: (base: number) => number;
  focusRingWidth: number;
  highContrast: boolean;
}

export const LARGE_TARGET_SCALE = 1.25;

export function buildTheme(settings: Settings): Theme {
  const targetScale = settings.largeTargets ? LARGE_TARGET_SCALE : 1;
  return {
    colors: settings.highContrast ? HIGH_CONTRAST_PALETTE : NORMAL_PALETTE,
    font: base => Math.round(base * settings.fontScale),
    target: base => Math.round(base * targetScale),
    focusRingWidth: settings.focusRingWidth,
    highContrast: settings.highContrast,
  };
}
