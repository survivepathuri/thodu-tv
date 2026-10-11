/** Log of help requests (in memory). */
export type HelpKind = 'helpRequest';
/** 'demo' = simulated, 'sent' = the server answered 2xx, 'failed' = it did not. */
export type HelpResult = 'demo' | 'sent' | 'failed';

export interface HelpEvent {
  id: string;
  /** Epoch milliseconds. */
  at: number;
  kind: HelpKind;
  result: HelpResult;
}

export const MAX_HELP_EVENTS = 20;

/** Returns a new log, newest first, truncated to `limit`. */
export function addHelpEvent(
  log: readonly HelpEvent[],
  event: HelpEvent,
  limit: number = MAX_HELP_EVENTS,
): HelpEvent[] {
  return [event, ...log].slice(0, Math.max(0, limit));
}

/** The `n` most recent events, newest first. */
export function recentHelpEvents(
  log: readonly HelpEvent[],
  n: number,
): HelpEvent[] {
  return [...log].sort((a, b) => b.at - a.at).slice(0, Math.max(0, n));
}

/** 24-hour local clock time, e.g. "14:05". */
export function formatClock(at: number): string {
  const d = new Date(at);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}
