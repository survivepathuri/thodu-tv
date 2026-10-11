import {formatClock} from './helpEvents';

export const NTFY_BASE = 'https://ntfy.sh';
export const SEND_TIMEOUT_MS = 8000;
export const RETRY_DELAY_MS = 600;

export type NotifyKind = 'help' | 'test';

export interface NotifyPayload {
  title: string;
  message: string;
  priority: 'high';
  tags: string[];
}

export type SendFailure = 'offline' | 'timeout' | 'server' | 'invalid';

export type SendResult =
  | {ok: true; attempts: number}
  | {ok: false; reason: SendFailure; attempts: number};

/** The slice of the fetch API we use, so tests can inject a fake. */
export type FetchLike = (
  url: string,
  init: {
    method: 'POST';
    headers: Record<string, string>;
    body: string;
    signal?: AbortSignal;
  },
) => Promise<{status: number}>;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567';
const TOPIC_RE = /^thodu-[a-z2-7]{4}-[a-z2-7]{4}-[a-z2-7]{4}$/;

/**
 * "thodu-abcd-efgh-ijkl": 12 base32 characters = 60 random bits. The topic is
 * the only secret protecting the messages, so `randomBytes` must be a
 * cryptographically secure source. Each byte is masked to 5 bits (32 symbols),
 * which keeps every character equally likely.
 */
export function generateTopic(randomBytes: (n: number) => Uint8Array): string {
  const bytes = randomBytes(12);
  if (!bytes || bytes.length < 12) {
    throw new Error('Not enough random bytes for a topic');
  }
  let chars = '';
  for (let i = 0; i < 12; i++) {
    chars += ALPHABET[bytes[i] & 31];
  }
  return `thodu-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export function isValidTopic(topic: unknown): topic is string {
  return typeof topic === 'string' && TOPIC_RE.test(topic);
}

/**
 * The message that leaves the TV. Deliberately generic: no names, addresses,
 * health data or settings; only that help was asked for and the clock time.
 */
export function buildPayload(kind: NotifyKind, now: number): NotifyPayload {
  const time = formatClock(now);
  return kind === 'test'
    ? {
        title: 'Thodu',
        message: `This is a test message from the TV at ${time}`,
        priority: 'high',
        tags: ['white_check_mark'],
      }
    : {
        title: 'Thodu',
        message: `Help was requested from the TV at ${time}`,
        priority: 'high',
        tags: ['warning'],
      };
}

interface SendOptions {
  kind?: NotifyKind;
  timeoutMs?: number;
  retryDelayMs?: number;
  /** Injected so tests do not wait in real time. */
  sleep?: (ms: number) => Promise<void>;
}

const realSleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

type Attempt = {ok: true} | {ok: false; reason: SendFailure; retry: boolean};

async function attemptOnce(
  fetchImpl: FetchLike,
  topic: string,
  payload: NotifyPayload,
  timeoutMs: number,
): Promise<Attempt> {
  const controller =
    typeof AbortController === 'function' ? new AbortController() : undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<'timeout'>(resolve => {
    timer = setTimeout(() => {
      controller?.abort();
      resolve('timeout');
    }, timeoutMs);
  });
  try {
    const request = fetchImpl(`${NTFY_BASE}/${topic}`, {
      method: 'POST',
      headers: {
        Title: payload.title,
        Priority: payload.priority,
        Tags: payload.tags.join(','),
      },
      body: payload.message,
      signal: controller?.signal,
    }).then(
      res => res,
      () => 'offline' as const,
    );
    const outcome = await Promise.race([request, timeout]);
    if (outcome === 'timeout') {
      return {ok: false, reason: 'timeout', retry: true};
    }
    if (outcome === 'offline') {
      return {ok: false, reason: 'offline', retry: true};
    }
    const status = outcome.status;
    if (status >= 200 && status < 300) {
      return {ok: true};
    }
    // 4xx means our request is wrong, so repeating it is pointless (429 aside).
    return {ok: false, reason: 'server', retry: status >= 500 || status === 429};
  } catch {
    return {ok: false, reason: 'offline', retry: true};
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

/**
 * Posts one notification to ntfy.sh over HTTPS. Success means the server
 * answered with a 2xx status and nothing less. Never throws. One automatic
 * retry (after a short pause) for network errors, timeouts and 5xx/429.
 */
export async function sendHelp(
  fetchImpl: FetchLike,
  topic: string,
  now: number,
  options: SendOptions = {},
): Promise<SendResult> {
  if (!isValidTopic(topic)) {
    return {ok: false, reason: 'invalid', attempts: 0};
  }
  const {
    kind = 'help',
    timeoutMs = SEND_TIMEOUT_MS,
    retryDelayMs = RETRY_DELAY_MS,
    sleep = realSleep,
  } = options;
  try {
    const payload = buildPayload(kind, now);
    let last = await attemptOnce(fetchImpl, topic, payload, timeoutMs);
    let attempts = 1;
    if (!last.ok && last.retry) {
      await sleep(retryDelayMs);
      last = await attemptOnce(fetchImpl, topic, payload, timeoutMs);
      attempts = 2;
    }
    return last.ok
      ? {ok: true, attempts}
      : {ok: false, reason: last.reason, attempts};
  } catch {
    return {ok: false, reason: 'offline', attempts: 1};
  }
}
