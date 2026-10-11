/**
 * Single-switch scanner: highlights items one at a time; one key selects the
 * highlighted one. Pure and immutable; the UI owns the timer and calls tick().
 */
export interface ScannerState {
  readonly items: readonly string[];
  readonly index: number;
  readonly running: boolean;
  readonly intervalMs: number;
}

export function createScanner(
  items: readonly string[],
  intervalMs: number,
): ScannerState {
  return {items: [...items], index: 0, running: true, intervalMs};
}

/** The id currently highlighted, or null when there is nothing to scan. */
export function highlighted(s: ScannerState): string | null {
  return s.items.length === 0 ? null : s.items[s.index] ?? null;
}

/** Advance the highlight, wrapping around. Ignored when paused or empty. */
export function tick(s: ScannerState): ScannerState {
  if (!s.running || s.items.length === 0) {
    return s;
  }
  return {...s, index: (s.index + 1) % s.items.length};
}

/** What a select key press chooses: the highlighted id (or null). */
export function select(s: ScannerState): string | null {
  return highlighted(s);
}

export function pause(s: ScannerState): ScannerState {
  return s.running ? {...s, running: false} : s;
}

export function resume(s: ScannerState): ScannerState {
  return s.running ? s : {...s, running: true};
}

/** Back to the first item (keeps running state). */
export function reset(s: ScannerState): ScannerState {
  return {...s, index: 0};
}

/**
 * Replace the item list. If the highlighted id is still present it stays
 * highlighted; otherwise the highlight moves to the nearest valid position.
 */
export function setItems(
  s: ScannerState,
  items: readonly string[],
): ScannerState {
  const current = highlighted(s);
  const kept = current === null ? -1 : items.indexOf(current);
  const index =
    kept >= 0 ? kept : Math.max(0, Math.min(s.index, items.length - 1));
  return {...s, items: [...items], index};
}

export function setScanInterval(s: ScannerState, intervalMs: number): ScannerState {
  return {...s, intervalMs};
}

/** How many ticks a timer with this interval fires in `elapsedMs`. */
export function ticksIn(elapsedMs: number, intervalMs: number): number {
  return intervalMs > 0 ? Math.floor(elapsedMs / intervalMs) : 0;
}
