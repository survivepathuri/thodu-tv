import * as Speech from 'expo-speech';
import type { Lang } from '@thodu/shared';

const LOCALE: Record<Lang, string> = { en: 'en-US', hi: 'hi-IN', te: 'te-IN' };

let warned = false;

/**
 * Speak with the device's Android TextToSpeech engine. Never throws: if the
 * engine or the language voice is missing, the app stays silent and logs once
 * (local logcat only).
 */
export function speak(text: string, lang: Lang): void {
  try {
    Speech.stop();
    Speech.speak(text, {
      language: LOCALE[lang],
      onError: (e) => {
        if (!warned) {
          warned = true;
          if (__DEV__) {
            console.log('[speech] engine error', String(e));
          }
        }
      },
    });
  } catch (e) {
    if (!warned) {
      warned = true;
      if (__DEV__) {
        console.log('[speech] unavailable', String(e));
      }
    }
  }
}
