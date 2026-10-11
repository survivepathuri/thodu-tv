import {en, StringKey} from './en';
import {te} from './te';

export type {StringKey};

/**
 * To add a language (e.g. Hindi): create strings/hi.ts typed as
 * Record<StringKey, string>, add its code to Lang and LANGS, and one entry to
 * DICTIONARIES. The tests fail until every key is translated.
 */
export type Lang = 'en' | 'te';

export const LANGS: readonly Lang[] = ['en', 'te'];

export const DICTIONARIES: Record<Lang, Record<StringKey, string>> = {en, te};

export function translate(lang: Lang, key: StringKey): string {
  return DICTIONARIES[lang][key] ?? en[key];
}
