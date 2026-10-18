// Measured accessibility numbers from the real source: WCAG contrast of every
// theme pair, focus ring contrast, text sizes used, label coverage of every
// focusable element, timers. Prints Markdown. No device needed.
//   node tools/a11y-measure.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(REPO, 'packages', 'shared', 'src');
process.removeAllListeners('warning');
const {SUNRISE_PALETTE, HIGH_CONTRAST_PALETTE, TILE_IDS} = await import(
  pathToFileURL(path.join(SRC, 'core', 'palette.ts')).href
);
const {contrastRatio} = await import(pathToFileURL(path.join(SRC, 'core', 'contrast.ts')).href);

const r2 = n => Math.round(n * 100) / 100;
const rows = [];
function pair(theme, what, fg, bg, need) {
  const ratio = r2(contrastRatio(fg, bg));
  rows.push({theme, what, fg, bg, ratio, need, pass: ratio >= need});
}

for (const [name, p] of [
  ['Sunrise (default)', SUNRISE_PALETTE],
  ['High contrast', HIGH_CONTRAST_PALETTE],
]) {
  for (const surf of ['background', 'surface', 'surfaceFocused']) {
    pair(name, `text on ${surf}`, p.text, p[surf], 4.5);
    pair(name, `textMuted on ${surf}`, p.textMuted, p[surf], 4.5);
  }
  pair(name, 'onAccent on accent (primary button)', p.onAccent, p.accent, 4.5);
  pair(name, 'button border on surface (non-text)', p.border, p.surface, 3);
  pair(name, 'button border on background (non-text)', p.border, p.background, 3);
  for (const t of TILE_IDS) {
    pair(name, `tile ${t}: label on tile`, p.tile[t].fg, p.tile[t].bg, 4.5);
    pair(name, `tile ${t}: icon glyph on tile (large)`, p.tile[t].glyph, p.tile[t].bg, 3);
    pair(name, `tile ${t}: focus ring on tile edge (non-text)`, p.focusRing, p.tile[t].bg, 3);
  }
  for (const [k, c] of Object.entries(p.card)) {
    pair(name, `card ${k}: text`, c.fg, c.bg, 4.5);
    pair(name, `card ${k}: text selected`, c.fgSelected, c.bgSelected, 4.5);
  }
  pair(name, 'focus ring on background (non-text)', p.focusRing, p.background, 3);
  pair(name, 'focus ring on surface (non-text)', p.focusRing, p.surface, 3);
  pair(name, 'scan hint (background on text)', p.background, p.text, 4.5);
}
// Colours written directly in screens.
pair('Both', 'caption bar text (#FFFFFF on #000000)', '#FFFFFF', '#000000', 4.5);
pair('Both', 'alert banner phase A (#000000 on #FFE600)', '#000000', '#FFE600', 4.5);
pair('Both', 'alert banner phase B (#FFE600 on #000000)', '#FFE600', '#000000', 4.5);

// Source scan.
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    if (e.name === '__tests__') continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (/\.tsx$/.test(e.name)) out.push(f);
  }
  return out;
}
const files = walk(SRC);
const sizes = new Map();
let focusables = 0;
let labelled = 0;
const unlabelled = [];
const perFile = {};
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const rel = path.relative(REPO, f).replace(/\\/g, '/');
  for (const m of text.matchAll(/fontSize:\s*fs\((\d+)\)/g)) {
    const n = Number(m[1]);
    sizes.set(n, (sizes.get(n) || 0) + 1);
  }
  if (/components\/(Focusable|ActionButton)\.tsx$/.test(rel)) continue;
  for (const m of text.matchAll(/<(Focusable|ActionButton)\b([\s\S]*?)(?:\/>|>\s*\n?\s*\{)/g)) {
    focusables++;
    const attrs = m[2];
    const ok = /\blabel=(\{[^}]+\}|"[^"]+")/.test(attrs) || /\blabel,/.test(attrs);
    if (ok) labelled++;
    else unlabelled.push(rel);
    perFile[rel] = (perFile[rel] || 0) + 1;
  }
}
const sizeList = [...sizes.keys()].sort((a, b) => a - b);
const res = {
  contrastRows: rows,
  lowest: rows.reduce((a, b) => (b.ratio < a.ratio ? b : a)),
  lowestText: rows.filter(r => r.need === 4.5).reduce((a, b) => (b.ratio < a.ratio ? b : a)),
  failures: rows.filter(r => !r.pass),
  fontSizesDesignPx: sizeList,
  smallestFont: sizeList[0],
  focusables,
  labelled,
  coveragePct: focusables ? r2((labelled / focusables) * 100) : 100,
  unlabelled,
  perFile,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(res, null, 1));
} else {
  console.log('## Contrast (WCAG 2.x relative luminance, computed from packages/shared/src/core/palette.ts)\n');
  console.log('| Theme | Pair | Ratio | Needed | Pass |\n|---|---|---|---|---|');
  for (const r of rows) {
    console.log(`| ${r.theme} | ${r.what} (${r.fg} on ${r.bg}) | ${r.ratio}:1 | ${r.need}:1 | ${r.pass ? 'yes' : '**NO**'} |`);
  }
  console.log(`\nLowest ratio: ${res.lowest.ratio}:1 (${res.lowest.theme}, ${res.lowest.what}). Failures: ${res.failures.length} of ${rows.length}.`);
  console.log(`Lowest text ratio: ${res.lowestText.ratio}:1 (${res.lowestText.theme}, ${res.lowestText.what}).`);
  console.log(`\nFont sizes used (design px on the 1920x1080 grid, multiplied by the font scale): ${sizeList.join(', ')}. Smallest: ${res.smallestFont}.`);
  console.log(`\nFocusable elements found in source (Focusable/ActionButton usages): ${focusables}; with a non-empty label prop: ${labelled} (${res.coveragePct}%).`);
  if (unlabelled.length) console.log('Without label: ' + unlabelled.join(', '));
}
