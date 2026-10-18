import {
  FetchLike,
  buildPayload,
  generateTopic,
  isValidTopic,
  sendHelp,
} from '../notify';

const TOPIC = 'thodu-abcd-efgh-ijkl';
const NOW = new Date(2026, 9, 12, 18, 42).getTime();
const noSleep = () => Promise.resolve();

type Mock = jest.Mock & FetchLike;

/** A fake fetch that answers with the given statuses in turn (last one repeats). */
const respond = (...statuses: number[]): Mock => {
  const queue = [...statuses];
  const fn = jest.fn(async () => ({
    status: queue.length > 1 ? (queue.shift() as number) : queue[0],
  }));
  return fn as unknown as Mock;
};

const callInit = (f: Mock, i = 0) =>
  (f.mock.calls[i] as unknown as [string, any])[1];

describe('generateTopic / isValidTopic', () => {
  it('formats 12 base32 chars as thodu-xxxx-xxxx-xxxx', () => {
    const topic = generateTopic(n => new Uint8Array(n).fill(0));
    expect(topic).toBe('thodu-aaaa-aaaa-aaaa');
    expect(isValidTopic(topic)).toBe(true);
  });

  it('maps bytes through a 32-symbol alphabet using the low 5 bits', () => {
    const bytes = Uint8Array.from([0, 1, 25, 26, 31, 32, 255, 7, 8, 9, 10, 11]);
    // 0->a 1->b 25->z 26->2 31->7 32&31=0->a 255&31=31->7 7->h 8->i 9->j 10->k 11->l
    expect(generateTopic(() => bytes)).toBe('thodu-abz2-7a7h-ijkl');
  });

  it('different random input gives different, valid topics', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const t = generateTopic(n =>
        Uint8Array.from({length: n}, () => Math.floor(Math.random() * 256)),
      );
      expect(isValidTopic(t)).toBe(true);
      seen.add(t);
    }
    expect(seen.size).toBe(50);
  });

  it('throws if the random source is too short', () => {
    expect(() => generateTopic(() => new Uint8Array(3))).toThrow();
  });

  it.each([
    '',
    'thodu',
    'thodu-abcd-efgh',
    'THODU-ABCD-EFGH-IJKL',
    'thodu-abc1-efgh-ijkl',
    'thodu-abcd-efgh-ijkl-x',
    'mom',
    'ntfy-abcd-efgh-ijkl',
    ' thodu-abcd-efgh-ijkl',
  ])('rejects %p', v => {
    expect(isValidTopic(v)).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isValidTopic(undefined)).toBe(false);
    expect(isValidTopic(42)).toBe(false);
  });
});

describe('buildPayload', () => {
  it('is generic: title, message with the time, high priority, tags', () => {
    expect(buildPayload('help', NOW)).toEqual({
      title: 'Thodu TV',
      message: 'Help was requested from the TV at 18:42',
      priority: 'high',
      tags: ['warning'],
    });
  });

  it('has only the four known fields and nothing personal', () => {
    for (const kind of ['help', 'test'] as const) {
      const p = buildPayload(kind, NOW);
      expect(Object.keys(p).sort()).toEqual(['message', 'priority', 'tags', 'title']);
      const text = JSON.stringify(p).toLowerCase();
      for (const forbidden of [
        'name',
        'address',
        'phone',
        'email',
        'medic',
        'diagnos',
        'need',
        'location',
        'password',
        'token',
      ]) {
        expect(text).not.toContain(forbidden);
      }
    }
  });

  it('the test message says it is a test', () => {
    expect(buildPayload('test', NOW).message).toMatch(/test message/);
  });
});

describe('sendHelp', () => {
  it('succeeds on 200 with one attempt and sends the right request', async () => {
    const f = respond(200);
    await expect(sendHelp(f, TOPIC, NOW, {sleep: noSleep})).resolves.toEqual({
      ok: true,
      attempts: 1,
    });
    expect(f).toHaveBeenCalledTimes(1);
    expect((f.mock.calls[0] as unknown as [string])[0]).toBe(`https://ntfy.sh/${TOPIC}`);
    const init = callInit(f);
    expect(init.method).toBe('POST');
    expect(init.body).toBe('Help was requested from the TV at 18:42');
    expect(init.headers).toEqual({Title: 'Thodu TV', Priority: 'high', Tags: 'warning'});
  });

  it('accepts any 2xx', async () => {
    const r = await sendHelp(respond(204), TOPIC, NOW, {sleep: noSleep});
    expect(r.ok).toBe(true);
  });

  it('500 twice: retries once, then reports server', async () => {
    const f = respond(500, 500);
    const r = await sendHelp(f, TOPIC, NOW, {sleep: noSleep});
    expect(r).toEqual({ok: false, reason: 'server', attempts: 2});
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('500 then 200: the retry succeeds', async () => {
    const f = respond(500, 200);
    await expect(sendHelp(f, TOPIC, NOW, {sleep: noSleep})).resolves.toEqual({
      ok: true,
      attempts: 2,
    });
  });

  it('3xx and 4xx are not success and are not retried', async () => {
    for (const status of [301, 400, 404]) {
      const f = respond(status);
      const r = await sendHelp(f, TOPIC, NOW, {sleep: noSleep});
      expect(r).toEqual({ok: false, reason: 'server', attempts: 1});
      expect(f).toHaveBeenCalledTimes(1);
    }
  });

  it('network error: offline after exactly one retry, never throws', async () => {
    const f = jest.fn(async () => {
      throw new TypeError('Network request failed');
    }) as unknown as Mock;
    const sleep = jest.fn(noSleep);
    const r = await sendHelp(f, TOPIC, NOW, {sleep});
    expect(r).toEqual({ok: false, reason: 'offline', attempts: 2});
    expect(f).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('a synchronous throw from fetch is also offline', async () => {
    const f = jest.fn(() => {
      throw new Error('boom');
    }) as unknown as FetchLike;
    const r = await sendHelp(f, TOPIC, NOW, {sleep: noSleep});
    expect(r.ok).toBe(false);
  });

  it('times out when fetch never answers (two attempts)', async () => {
    jest.useFakeTimers();
    try {
      const f = jest.fn(() => new Promise(() => {})) as unknown as Mock;
      const pending = sendHelp(f, TOPIC, NOW, {timeoutMs: 8000, retryDelayMs: 100});
      await jest.advanceTimersByTimeAsync(8000);
      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(8000);
      await expect(pending).resolves.toEqual({ok: false, reason: 'timeout', attempts: 2});
      expect(f).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });

  it('rejects an invalid topic without touching the network', async () => {
    const f = respond(200);
    const r = await sendHelp(f, 'mom', NOW, {sleep: noSleep});
    expect(r).toEqual({ok: false, reason: 'invalid', attempts: 0});
    expect(f).not.toHaveBeenCalled();
  });

  it('sends the test kind with its own message', async () => {
    const f = respond(200);
    await sendHelp(f, TOPIC, NOW, {kind: 'test', sleep: noSleep});
    expect(callInit(f).body).toMatch(/test message/);
  });
});
