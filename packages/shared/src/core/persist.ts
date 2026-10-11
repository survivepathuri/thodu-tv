import {ALL_NEEDS, Need} from './needs';
import {LANGS, Lang} from './strings';

/** Bump when the stored shape changes, and add a step to `migrate`. */
export const STORAGE_VERSION = 2;
export const STORAGE_KEY = 'thodu.state';

export type NotifyMode = 'real' | 'demo';

export const MIN_SCAN_INTERVAL_MS = 600;
export const MAX_SCAN_INTERVAL_MS = 6000;

export interface PersistedState {
  needs: Need[];
  lang: Lang;
  scanIntervalMs: number;
  /** ntfy topic, or null until one is generated. */
  familyTopic: string | null;
  notifyMode: NotifyMode;
  /** True once a test message to the topic got an HTTP 2xx. */
  testSucceeded: boolean;
  setupDone: boolean;
}

export function defaultPersisted(): PersistedState {
  return {
    needs: [],
    lang: 'en',
    scanIntervalMs: 1800,
    familyTopic: null,
    notifyMode: 'demo',
    testSucceeded: false,
    setupDone: false,
  };
}

const TOPIC_RE = /^thodu-[a-z2-7]{4}-[a-z2-7]{4}-[a-z2-7]{4}$/;

/** Stored shape: the state plus a version. Unknown fields are never kept. */
export function serialize(state: PersistedState): string {
  return JSON.stringify({v: STORAGE_VERSION, ...state});
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/**
 * Version 1 stored needs, lang, scanIntervalMs and setupDone only; the family
 * fields are new in version 2 and fall back to their defaults.
 */
function migrate(raw: Record<string, unknown>, from: number): Record<string, unknown> {
  let out = raw;
  if (from < 2) {
    out = {...out, familyTopic: null, notifyMode: 'demo', testSucceeded: false};
  }
  return out;
}

/**
 * Reads whatever is in storage. Never throws: empty, corrupt, wrong-typed or
 * from-the-future data yields safe defaults, field by field.
 */
export function deserialize(text: string | null | undefined): PersistedState {
  const base = defaultPersisted();
  if (typeof text !== 'string' || text.trim() === '') {
    return base;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return base;
  }
  if (!isRecord(parsed)) {
    return base;
  }
  const version = typeof parsed.v === 'number' ? parsed.v : 1;
  if (!Number.isFinite(version) || version < 1 || version > STORAGE_VERSION) {
    // Written by a newer app: do not guess at its meaning.
    return base;
  }
  const r = migrate(parsed, version);

  const needs = Array.isArray(r.needs)
    ? ALL_NEEDS.filter(n => (r.needs as unknown[]).includes(n))
    : base.needs;
  const lang = LANGS.includes(r.lang as Lang) ? (r.lang as Lang) : base.lang;
  const si = r.scanIntervalMs;
  const scanIntervalMs =
    typeof si === 'number' &&
    Number.isFinite(si) &&
    si >= MIN_SCAN_INTERVAL_MS &&
    si <= MAX_SCAN_INTERVAL_MS
      ? Math.round(si)
      : base.scanIntervalMs;
  const familyTopic =
    typeof r.familyTopic === 'string' && TOPIC_RE.test(r.familyTopic)
      ? r.familyTopic
      : null;
  const testSucceeded = r.testSucceeded === true && familyTopic !== null;
  // Real mode is only valid after a successful test on the stored topic.
  const notifyMode: NotifyMode =
    r.notifyMode === 'real' && testSucceeded ? 'real' : 'demo';

  return {
    needs,
    lang,
    scanIntervalMs,
    familyTopic,
    notifyMode,
    testSucceeded,
    setupDone: r.setupDone === true,
  };
}

/** The subset of AsyncStorage the app uses; injected so core stays pure. */
export interface StorageLike {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
