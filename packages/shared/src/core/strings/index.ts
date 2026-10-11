import {en, StringKey} from './en';
import {hi} from './hi';
import {te} from './te';

export type {StringKey};

/**
 * To add a language: create strings/<code>.ts typed as
 * Record<StringKey, string>, add its code to Lang and LANGS, and one entry to
 * DICTIONARIES. The tests fail until every key is translated.
 */
export type Lang = 'en' | 'hi' | 'te';

// Display order of the language toggle: EN / हिन्दी / తెలుగు.
export const LANGS: readonly Lang[] = ['en', 'hi', 'te'];

export const DICTIONARIES: Record<Lang, Record<StringKey, string>> = {en, hi, te};

export function translate(lang: Lang, key: StringKey): string {
  return DICTIONARIES[lang][key] ?? en[key];
}
