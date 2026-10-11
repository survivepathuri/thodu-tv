import type {Need} from './needs';

/** The OS font scale is honoured up to this multiplier. */
export const SYSTEM_FONT_CAP = 1.3;
/** Our own scale times the OS scale never goes beyond this. */
export const TOTAL_FONT_CAP = 2.0;

/**
 * Combines our font scale (from the chosen needs) with the system font scale
 * (Android Settings > Display > Font size). The system scale only ever makes
 * text larger, is capped, and so is the product, so layouts stay usable.
 */
export function effectiveFontScale(ours: number, system: number): number {
  const sys = Number.isFinite(system) ? Math.min(Math.max(system, 1), SYSTEM_FONT_CAP) : 1;
  const base = Number.isFinite(ours) && ours > 0 ? ours : 1;
  return Math.round(Math.min(base * sys, Math.max(TOTAL_FONT_CAP, base)) * 100) / 100;
}

/**
 * Needs worth suggesting when a screen reader is on. Only a suggestion: the
 * caller must ask the person before applying anything.
 */
export function suggestedNeeds(screenReaderOn: boolean): Need[] {
  return screenReaderOn ? ['lowVision', 'readingDifficulty'] : [];
}

/** Suggested needs the person has not chosen yet. */
export function missingSuggestions(
  screenReaderOn: boolean,
  chosen: readonly Need[],
): Need[] {
  return suggestedNeeds(screenReaderOn).filter(n => !chosen.includes(n));
}
