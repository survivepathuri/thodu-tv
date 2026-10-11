/** How a focused label should reach the person's ears. */
export type SpeechRoute = 'announce' | 'tts' | 'none';

/**
 * - Screen reader on (VoiceView/TalkBack): use the platform announcement, and
 *   only when the person also wants read-aloud; the screen reader already
 *   reads focused labels itself, so announcing without that opt-in would
 *   double every word.
 * - Screen reader off, read-aloud on: our own text-to-speech.
 * - Otherwise: silent.
 */
export function chooseSpeechRoute(opts: {
  screenReaderOn: boolean;
  readAloud: boolean;
}): SpeechRoute {
  if (!opts.readAloud) {
    return 'none';
  }
  return opts.screenReaderOn ? 'announce' : 'tts';
}
