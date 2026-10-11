import {CAPTION_KEYS, captionIndexAt} from '../captions';
import {DICTIONARIES, LANGS} from '../strings';

describe('captionIndexAt', () => {
  it('starts at the first line and advances every lineMs', () => {
    expect(captionIndexAt(4, 0, 3000)).toBe(0);
    expect(captionIndexAt(4, 2999, 3000)).toBe(0);
    expect(captionIndexAt(4, 3000, 3000)).toBe(1);
    expect(captionIndexAt(4, 9000, 3000)).toBe(3);
  });
  it('loops back to the first line', () => {
    expect(captionIndexAt(4, 12000, 3000)).toBe(0);
    expect(captionIndexAt(4, 15500, 3000)).toBe(1);
  });
  it('is safe for empty lists, bad intervals and negative time', () => {
    expect(captionIndexAt(0, 5000, 3000)).toBe(0);
    expect(captionIndexAt(4, 5000, 0)).toBe(0);
    expect(captionIndexAt(4, -10, 3000)).toBe(0);
  });
  it('every caption line exists in every language', () => {
    for (const lang of LANGS) {
      for (const key of CAPTION_KEYS) {
        expect(DICTIONARIES[lang][key].trim()).not.toBe('');
      }
    }
  });
});
