/** Tiles per row: all of them in one row normally, 3+2 when text is enlarged. */
export function columnsFor(fontScale: number, tileCount = 5): number {
  return fontScale > 1.3 ? Math.ceil(tileCount / 2) : tileCount;
}

/** Splits tiles into rows of `size`; each row is reached with left/right, rows with up/down. */
export function homeRows<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}
