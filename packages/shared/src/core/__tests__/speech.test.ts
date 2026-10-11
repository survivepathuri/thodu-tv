import {chooseSpeechRoute} from '../speech';

describe('chooseSpeechRoute', () => {
  it.each([
    [true, true, 'announce'],
    [true, false, 'none'],
    [false, true, 'tts'],
    [false, false, 'none'],
  ] as const)('screenReader=%s readAloud=%s -> %s', (screenReaderOn, readAloud, route) => {
    expect(chooseSpeechRoute({screenReaderOn, readAloud})).toBe(route);
  });
});
