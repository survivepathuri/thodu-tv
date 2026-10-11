import {
  STORAGE_VERSION,
  defaultPersisted,
  deserialize,
  serialize,
  PersistedState,
} from '../persist';

const topic = 'thodu-abcd-efgh-ijkl';

const full: PersistedState = {
  needs: ['lowVision', 'remoteDifficulty'],
  lang: 'te',
  scanIntervalMs: 2500,
  familyTopic: topic,
  notifyMode: 'real',
  testSucceeded: true,
  setupDone: true,
};

describe('persist', () => {
  it('round-trips a full state', () => {
    expect(deserialize(serialize(full))).toEqual(full);
  });

  it.each([null, undefined, '', '   '])('empty storage (%p) gives defaults', v => {
    expect(deserialize(v)).toEqual(defaultPersisted());
  });

  it.each(['{not json', 'null', '42', '[]', '"text"'])(
    'corrupt storage (%p) gives defaults',
    v => {
      expect(deserialize(v)).toEqual(defaultPersisted());
    },
  );

  it('migrates version 1 (no family fields) and keeps what it knew', () => {
    const v1 = JSON.stringify({
      v: 1,
      needs: ['hardOfHearing'],
      lang: 'te',
      scanIntervalMs: 1800,
      setupDone: true,
    });
    expect(deserialize(v1)).toEqual({
      needs: ['hardOfHearing'],
      lang: 'te',
      scanIntervalMs: 1800,
      familyTopic: null,
      notifyMode: 'demo',
      testSucceeded: false,
      setupDone: true,
    });
  });

  it('treats a missing version as version 1', () => {
    const r = deserialize(JSON.stringify({needs: ['lowVision'], setupDone: true}));
    expect(r.needs).toEqual(['lowVision']);
    expect(r.notifyMode).toBe('demo');
  });

  it('ignores a future version rather than guessing', () => {
    const r = deserialize(JSON.stringify({...full, v: STORAGE_VERSION + 1}));
    expect(r).toEqual(defaultPersisted());
  });

  it('drops unknown fields and unknown needs', () => {
    const r = deserialize(
      JSON.stringify({
        v: STORAGE_VERSION,
        ...full,
        needs: ['lowVision', 'nonsense', 7],
        secret: 'x',
      }),
    );
    expect(r.needs).toEqual(['lowVision']);
    expect('secret' in r).toBe(false);
  });

  it('falls back field by field on wrong types', () => {
    const r = deserialize(
      JSON.stringify({
        v: STORAGE_VERSION,
        needs: 'lowVision',
        lang: 'xx',
        scanIntervalMs: 'fast',
        familyTopic: 5,
        notifyMode: 'real',
        testSucceeded: 'yes',
        setupDone: 1,
      }),
    );
    expect(r).toEqual(defaultPersisted());
  });

  it('rejects an out-of-range scan interval', () => {
    for (const bad of [0, -5, 100, 99999, NaN]) {
      const r = deserialize(JSON.stringify({v: STORAGE_VERSION, ...full, scanIntervalMs: bad}));
      expect(r.scanIntervalMs).toBe(1800);
    }
  });

  it('rejects a malformed topic and never stays in real mode without a test', () => {
    const bad = deserialize(JSON.stringify({v: STORAGE_VERSION, ...full, familyTopic: 'mom'}));
    expect(bad.familyTopic).toBeNull();
    expect(bad.notifyMode).toBe('demo');
    expect(bad.testSucceeded).toBe(false);
    const untested = deserialize(
      JSON.stringify({v: STORAGE_VERSION, ...full, testSucceeded: false}),
    );
    expect(untested.notifyMode).toBe('demo');
  });

  it('serialize writes the version and exactly the known fields', () => {
    const obj = JSON.parse(serialize(full));
    expect(obj.v).toBe(STORAGE_VERSION);
    expect(Object.keys(obj).sort()).toEqual(['v', ...Object.keys(full)].sort());
  });
});
