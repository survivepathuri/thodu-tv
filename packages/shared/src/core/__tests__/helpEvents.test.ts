import {
  addHelpEvent,
  formatClock,
  HelpEvent,
  MAX_HELP_EVENTS,
  recentHelpEvents,
} from '../helpEvents';

const ev = (n: number, at: number = n * 1000): HelpEvent => ({
  id: `h${n}`,
  at,
  kind: 'helpRequest',
  result: 'demo',
});

describe('help event log', () => {
  it('adds newest first', () => {
    let log: HelpEvent[] = [];
    log = addHelpEvent(log, ev(1));
    log = addHelpEvent(log, ev(2));
    expect(log.map(e => e.id)).toEqual(['h2', 'h1']);
  });

  it('does not mutate the previous log', () => {
    const before: HelpEvent[] = [ev(1)];
    const after = addHelpEvent(before, ev(2));
    expect(before).toHaveLength(1);
    expect(after).not.toBe(before);
  });

  it('keeps at most the default limit, dropping the oldest', () => {
    let log: HelpEvent[] = [];
    for (let i = 1; i <= MAX_HELP_EVENTS + 5; i++) {
      log = addHelpEvent(log, ev(i));
    }
    expect(log).toHaveLength(MAX_HELP_EVENTS);
    expect(log[0].id).toBe(`h${MAX_HELP_EVENTS + 5}`);
    expect(log.some(e => e.id === 'h1')).toBe(false);
  });

  it('honours a custom limit, including 0', () => {
    const log = addHelpEvent([ev(1), ev(2)], ev(3), 2);
    expect(log.map(e => e.id)).toEqual(['h3', 'h1']);
    expect(addHelpEvent([ev(1)], ev(2), 0)).toEqual([]);
  });

  it('recentHelpEvents lists the newest n by time, even if inserted out of order', () => {
    const log = [ev(1, 3000), ev(2, 1000), ev(3, 2000)];
    expect(recentHelpEvents(log, 2).map(e => e.id)).toEqual(['h1', 'h3']);
    expect(recentHelpEvents(log, 10)).toHaveLength(3);
    expect(recentHelpEvents(log, 0)).toEqual([]);
    expect(recentHelpEvents([], 5)).toEqual([]);
  });

  it('recentHelpEvents does not reorder the stored log', () => {
    const log = [ev(1, 1000), ev(2, 2000)];
    recentHelpEvents(log, 2);
    expect(log.map(e => e.id)).toEqual(['h1', 'h2']);
  });
});

describe('formatClock', () => {
  it('formats local time as HH:MM with zero padding', () => {
    expect(formatClock(new Date(2026, 9, 12, 14, 5).getTime())).toBe('14:05');
    expect(formatClock(new Date(2026, 9, 12, 7, 9).getTime())).toBe('07:09');
    expect(formatClock(new Date(2026, 9, 12, 0, 0).getTime())).toBe('00:00');
  });
});
