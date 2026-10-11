import type {Need} from './needs';

export interface Settings {
  fontScale: number;
  highContrast: boolean;
  focusRingWidth: number;
  captionsAlwaysOn: boolean;
  visualAlerts: boolean;
  scanningMode: boolean;
  scanIntervalMs: number;
  readAloud: boolean;
  simpleLanguage: boolean;
  iconsWithLabels: boolean;
  largeTargets: boolean;
}

export const DEFAULT_SETTINGS: Readonly<Settings> = Object.freeze({
  fontScale: 1.0,
  highContrast: false,
  focusRingWidth: 4,
  captionsAlwaysOn: false,
  visualAlerts: false,
  scanningMode: false,
  scanIntervalMs: 1800,
  readAloud: false,
  simpleLanguage: false,
  iconsWithLabels: false,
  largeTargets: false,
});

/**
 * Derives settings from the chosen needs. Needs combine by taking the max of
 * numeric values and the OR of booleans; order and duplicates do not matter.
 * Always returns a fresh object; the input array is never modified.
 */
export function deriveSettings(needs: readonly Need[]): Settings {
  const has = (n: Need) => needs.includes(n);
  const s: Settings = {...DEFAULT_SETTINGS};

  if (has('lowVision')) {
    s.fontScale = Math.max(s.fontScale, 1.6);
    s.highContrast = true;
    s.focusRingWidth = Math.max(s.focusRingWidth, 10);
    s.largeTargets = true;
  }
  if (has('hardOfHearing')) {
    s.captionsAlwaysOn = true;
    s.visualAlerts = true;
  }
  if (has('remoteDifficulty')) {
    s.scanningMode = true;
    s.scanIntervalMs = 1800;
    s.largeTargets = true;
  }
  if (has('readingDifficulty')) {
    s.readAloud = true;
    s.simpleLanguage = true;
    s.iconsWithLabels = true;
  }
  return s;
}
