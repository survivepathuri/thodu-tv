/** Looping demo captions: which line shows at a given time. Pure. */
export function captionIndexAt(
  lineCount: number,
  elapsedMs: number,
  lineMs: number,
): number {
  if (lineCount <= 0 || lineMs <= 0 || elapsedMs < 0) {
    return 0;
  }
  return Math.floor(elapsedMs / lineMs) % lineCount;
}

export const CAPTION_KEYS = [
  'caption.1',
  'caption.2',
  'caption.3',
  'caption.4',
] as const;

export const CAPTION_LINE_MS = 3000;
