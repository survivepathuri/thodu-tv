import {
  createScanner,
  highlighted,
  pause,
  reset,
  resume,
  select,
  setScanInterval,
  setItems,
  tick,
  ticksIn,
  ScannerState,
} from '../scanner';
import {deriveSettings} from '../adapt';

const run = (s: ScannerState, elapsedMs: number): ScannerState => {
  let out = s;
  for (let i = 0; i < ticksIn(elapsedMs, s.intervalMs); i++) {
    out = tick(out);
  }
  return out;
};

describe('scanner', () => {
  const items = ['a', 'b', 'c'];

  it('starts on the first item, running', () => {
    const s = createScanner(items, 1800);
    expect(highlighted(s)).toBe('a');
    expect(s.running).toBe(true);
  });

  it('advances in order with fake time', () => {
    let s = createScanner(items, 1800);
    s = run(s, 1799);
    expect(highlighted(s)).toBe('a');
    s = run(s, 1800);
    expect(highlighted(s)).toBe('b');
    s = run(s, 3600);
    expect(highlighted(s)).toBe('a'); // b -> c -> a
  });

  it('wraps around after the last item', () => {
    let s = createScanner(items, 1000);
    s = tick(tick(s));
    expect(highlighted(s)).toBe('c');
    expect(highlighted(tick(s))).toBe('a');
  });

  it('ignores tick while paused and continues after resume', () => {
    let s = pause(createScanner(items, 1000));
    expect(tick(s)).toBe(s);
    expect(highlighted(run(s, 10000))).toBe('a');
    s = resume(s);
    expect(highlighted(tick(s))).toBe('b');
  });

  it('pause and resume are idempotent', () => {
    const s = createScanner(items, 1000);
    expect(resume(s)).toBe(s);
    const p = pause(s);
    expect(pause(p)).toBe(p);
  });

  it('select returns the highlighted id and does not change state', () => {
    const s = tick(createScanner(items, 1000));
    expect(select(s)).toBe('b');
    expect(highlighted(s)).toBe('b');
  });

  it('select still works while paused', () => {
    const s = pause(tick(createScanner(items, 1000)));
    expect(select(s)).toBe('b');
  });

  it('empty list: nothing highlighted, tick ignored, select null', () => {
    const s = createScanner([], 1000);
    expect(highlighted(s)).toBeNull();
    expect(tick(s)).toBe(s);
    expect(select(s)).toBeNull();
  });

  it('reset returns to the first item', () => {
    const s = reset(tick(tick(createScanner(items, 1000))));
    expect(highlighted(s)).toBe('a');
  });

  it('setItems keeps the highlighted id when it still exists', () => {
    const s = tick(createScanner(items, 1000)); // b
    const n = setItems(s, ['x', 'b', 'y']);
    expect(highlighted(n)).toBe('b');
    expect(n.index).toBe(1);
  });

  it('setItems moves to a valid position when the highlighted id is gone', () => {
    const s = tick(tick(createScanner(items, 1000))); // c, index 2
    const n = setItems(s, ['x', 'y']);
    expect(highlighted(n)).toBe('y');
  });

  it('setItems to empty then back works', () => {
    const s = setItems(tick(createScanner(items, 1000)), []);
    expect(highlighted(s)).toBeNull();
    const back = setItems(s, ['p', 'q']);
    expect(highlighted(back)).toBe('p');
    expect(highlighted(tick(back))).toBe('q');
  });

  it('items changing mid-scan never leaves an out-of-range index', () => {
    let s = createScanner(['a', 'b', 'c', 'd'], 1000);
    s = run(s, 3000); // d
    s = setItems(s, ['a']);
    expect(highlighted(s)).toBe('a');
    expect(highlighted(tick(s))).toBe('a');
  });

  it('does not mutate the previous state or the input array', () => {
    const input = ['a', 'b'];
    const s = createScanner(input, 1000);
    tick(s);
    setItems(s, ['z']);
    input.push('c');
    expect(s.items).toEqual(['a', 'b']);
    expect(s.index).toBe(0);
  });

  it('uses the interval from settings (remoteDifficulty default 1800 ms)', () => {
    const interval = deriveSettings(['remoteDifficulty']).scanIntervalMs;
    expect(interval).toBe(1800);
    let s = createScanner(items, interval);
    s = run(s, 3599);
    expect(highlighted(s)).toBe('b');
    s = setScanInterval(s, 500);
    expect(s.intervalMs).toBe(500);
    expect(ticksIn(1500, 500)).toBe(3);
  });

  it('ticksIn is 0 for a non-positive interval', () => {
    expect(ticksIn(5000, 0)).toBe(0);
  });
});
