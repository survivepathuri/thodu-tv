import {deriveSettings, DEFAULT_SETTINGS} from '../adapt';
import type {Need} from '../needs';

describe('deriveSettings', () => {
  it('returns defaults for an empty list', () => {
    expect(deriveSettings([])).toEqual({
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
  });

  it('lowVision alone', () => {
    expect(deriveSettings(['lowVision'])).toEqual({
      ...DEFAULT_SETTINGS,
      fontScale: 1.6,
      highContrast: true,
      focusRingWidth: 10,
      largeTargets: true,
    });
  });

  it('hardOfHearing alone', () => {
    expect(deriveSettings(['hardOfHearing'])).toEqual({
      ...DEFAULT_SETTINGS,
      captionsAlwaysOn: true,
      visualAlerts: true,
    });
  });

  it('remoteDifficulty alone', () => {
    expect(deriveSettings(['remoteDifficulty'])).toEqual({
      ...DEFAULT_SETTINGS,
      scanningMode: true,
      scanIntervalMs: 1800,
      largeTargets: true,
    });
  });

  it('readingDifficulty alone', () => {
    expect(deriveSettings(['readingDifficulty'])).toEqual({
      ...DEFAULT_SETTINGS,
      readAloud: true,
      simpleLanguage: true,
      iconsWithLabels: true,
    });
  });

  it('lowVision + remoteDifficulty keeps the larger scale and ring, targets on', () => {
    const s = deriveSettings(['lowVision', 'remoteDifficulty']);
    expect(s.fontScale).toBe(1.6);
    expect(s.focusRingWidth).toBe(10);
    expect(s.highContrast).toBe(true);
    expect(s.scanningMode).toBe(true);
    expect(s.largeTargets).toBe(true);
  });

  it('all four needs merge as max / OR', () => {
    const s = deriveSettings([
      'lowVision',
      'hardOfHearing',
      'remoteDifficulty',
      'readingDifficulty',
    ]);
    expect(s).toEqual({
      fontScale: 1.6,
      highContrast: true,
      focusRingWidth: 10,
      captionsAlwaysOn: true,
      visualAlerts: true,
      scanningMode: true,
      scanIntervalMs: 1800,
      readAloud: true,
      simpleLanguage: true,
      iconsWithLabels: true,
      largeTargets: true,
    });
  });

  it('is independent of order', () => {
    const a = deriveSettings(['readingDifficulty', 'lowVision']);
    const b = deriveSettings(['lowVision', 'readingDifficulty']);
    expect(a).toEqual(b);
  });

  it('ignores duplicates', () => {
    const needs: Need[] = ['lowVision', 'lowVision', 'hardOfHearing', 'hardOfHearing'];
    expect(deriveSettings(needs)).toEqual(
      deriveSettings(['lowVision', 'hardOfHearing']),
    );
  });

  it('does not mutate the input array', () => {
    const needs: Need[] = ['lowVision', 'remoteDifficulty'];
    const copy = [...needs];
    deriveSettings(needs);
    expect(needs).toEqual(copy);
  });

  it('returns a fresh object each call and never changes DEFAULT_SETTINGS', () => {
    const a = deriveSettings([]);
    a.fontScale = 9;
    a.highContrast = true;
    expect(deriveSettings([]).fontScale).toBe(1.0);
    expect(DEFAULT_SETTINGS.fontScale).toBe(1.0);
    expect(DEFAULT_SETTINGS.highContrast).toBe(false);
    expect(deriveSettings([])).not.toBe(deriveSettings([]));
  });

  it('keeps the default scan interval when remoteDifficulty is absent', () => {
    expect(deriveSettings(['lowVision']).scanningMode).toBe(false);
    expect(deriveSettings(['lowVision']).scanIntervalMs).toBe(1800);
  });
});
