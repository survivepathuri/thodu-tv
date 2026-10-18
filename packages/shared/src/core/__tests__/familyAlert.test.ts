import {
  FetchLike,
  buildPayload,
  resetAlertDebounce,
  sendFamilyAlert,
} from '../notify';
import {applyConfiguredTopic, defaultPersisted} from '../persist';
import {columnsFor, homeRows} from '../homeLayout';
import {TILE_IDS} from '../palette';
import {DICTIONARIES, LANGS} from '../strings';

const TOPIC = 'thodu-abcd-efgh-ijkl-mnop';
const NOW = new Date(2026, 9, 18, 9, 5).getTime();
const noSleep = () => Promise.resolve();
type Mock = jest.Mock & FetchLike;
const respond = (...statuses: number[]): Mock => {
  const q = [...statuses];
  return jest.fn(async () => ({status: q.length > 1 ? (q.shift() as number) : q[0]})) as unknown as Mock;
};

beforeEach(() => {
  resetAlertDebounce();
  jest.restoreAllMocks();
});

describe('sendFamilyAlert', () => {
  it.each(['help', 'family', 'medicine'] as const)('%s: 2xx -> ok, one POST to the topic', async kind => {
    const f = respond(200);
    const r = await sendFamilyAlert(f, TOPIC, kind, NOW, {sleep: noSleep});
    expect(r.ok).toBe(true);
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0] as unknown as [string, any];
    expect(url).toBe(`https://ntfy.sh/${TOPIC}`);
    expect(init.method).toBe('POST');
    for (const v of Object.values(init.headers as Record<string, string>)) {
      expect(/^[\x20-\x7E]*$/.test(v)).toBe(true);
    }
  });

  it('messages differ per kind', () => {
    const m = (['help', 'family', 'medicine', 'test'] as const).map(k => buildPayload(k, NOW).message);
    expect(new Set(m).size).toBe(4);
  });

  it.each([500, 404])('status %i -> failure, never ok', async status => {
    const f = respond(status);
    const r = await sendFamilyAlert(f, TOPIC, 'medicine', NOW, {sleep: noSleep});
    expect(r.ok).toBe(false);
  });

  it('timeout -> failure', async () => {
    const f = jest.fn(() => new Promise(() => {})) as unknown as Mock;
    const r = await sendFamilyAlert(f, TOPIC, 'family', NOW, {timeoutMs: 10, retryDelayMs: 0, sleep: noSleep});
    expect(r).toEqual({ok: false, reason: 'timeout', attempts: 2});
  });

  it.each([null, undefined, '', 'nope'])('missing/invalid topic %p -> failure, no request', async topic => {
    const f = respond(200);
    const r = await sendFamilyAlert(f, topic as any, 'help', NOW, {sleep: noSleep});
    expect(r.ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it('debounces repeat presses of the same kind within 3 s', async () => {
    const f = respond(200);
    const a = sendFamilyAlert(f, TOPIC, 'help', NOW, {sleep: noSleep});
    const b = sendFamilyAlert(f, TOPIC, 'help', NOW, {sleep: noSleep});
    await Promise.all([a, b]);
    expect(f).toHaveBeenCalledTimes(1);
    await sendFamilyAlert(f, TOPIC, 'medicine', NOW, {sleep: noSleep});
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('sends again after 3 s, and at once after a failure', async () => {
    const f = respond(200);
    const t0 = Date.now();
    const spy = jest.spyOn(Date, 'now').mockReturnValue(t0);
    await sendFamilyAlert(f, TOPIC, 'help', NOW, {sleep: noSleep});
    spy.mockReturnValue(t0 + 3001);
    await sendFamilyAlert(f, TOPIC, 'help', NOW, {sleep: noSleep});
    expect(f).toHaveBeenCalledTimes(2);

    resetAlertDebounce();
    const bad = respond(500, 500, 200);
    spy.mockReturnValue(t0);
    const r1 = await sendFamilyAlert(bad, TOPIC, 'family', NOW, {sleep: noSleep});
    expect(r1.ok).toBe(false);
    const r2 = await sendFamilyAlert(bad, TOPIC, 'family', NOW, {sleep: noSleep});
    expect(r2.ok).toBe(true);
  });
});

describe('applyConfiguredTopic', () => {
  it('replaces a different stored topic and drops back to demo', () => {
    const s = {...defaultPersisted(), familyTopic: 'thodu-aaaa-aaaa-aaaa', notifyMode: 'real' as const, testSucceeded: true};
    const out = applyConfiguredTopic(s, TOPIC);
    expect(out).toMatchObject({familyTopic: TOPIC, notifyMode: 'demo', testSucceeded: false});
  });
  it('keeps real mode when the topic is unchanged; ignores bad or missing config', () => {
    const s = {...defaultPersisted(), familyTopic: TOPIC, notifyMode: 'real' as const, testSucceeded: true};
    expect(applyConfiguredTopic(s, TOPIC)).toBe(s);
    expect(applyConfiguredTopic(s, undefined)).toBe(s);
    expect(applyConfiguredTopic(s, 'not a topic')).toBe(s);
  });
});

describe('Home layout with Medicines', () => {
  it('has a Medicines tile with a label in every language', () => {
    expect(TILE_IDS).toContain('medicines');
    for (const l of LANGS) {
      expect((DICTIONARIES[l] as Record<string, string>)['tile.medicines'].length).toBeGreaterThan(0);
    }
  });
  it.each([1, 1.3, 1.6])('font scale %p: every tile is in a row, no orphan', scale => {
    const rows = homeRows(TILE_IDS, columnsFor(scale, TILE_IDS.length));
    expect(rows.flat()).toEqual([...TILE_IDS]);
    expect(rows.length).toBeLessThanOrEqual(2);
    if (rows.length === 2) {
      expect(rows[1].length).toBeGreaterThanOrEqual(2);
    }
  });
});
