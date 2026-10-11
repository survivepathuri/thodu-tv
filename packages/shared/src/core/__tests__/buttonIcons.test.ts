import {BUTTON_GLYPH, ButtonIcon} from '../buttonIcons';

describe('button icons', () => {
  const icons = Object.keys(BUTTON_GLYPH) as ButtonIcon[];

  it('has a short non-empty glyph for every icon', () => {
    for (const i of icons) {
      expect(BUTTON_GLYPH[i].trim()).not.toBe('');
      expect([...BUTTON_GLYPH[i]].length).toBeLessThanOrEqual(2);
    }
  });

  it('uses a different glyph for each icon', () => {
    expect(new Set(icons.map(i => BUTTON_GLYPH[i])).size).toBe(icons.length);
  });

  it('covers the buttons named in the reading need', () => {
    for (const i of ['back', 'continue', 'retry', 'tell', 'cancel', 'send'] as const) {
      expect(icons).toContain(i);
    }
  });
});
