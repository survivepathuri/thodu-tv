import {readdirSync, readFileSync} from 'fs';
import {join, sep} from 'path';

// Static check on the real screen sources: every interactive element goes
// through Focusable/ActionButton and carries a non-empty label, and nothing
// else in the app can take focus except the hidden scan sink.
const SRC = join(__dirname, '..', '..');

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    if (e.name === '__tests__') {
      return [];
    }
    const p = join(dir, e.name);
    return e.isDirectory() ? tsxFiles(p) : p.endsWith('.tsx') ? [p] : [];
  });
}

const files = tsxFiles(SRC).filter(f => !/components[\\/](Focusable|ActionButton)\.tsx$/.test(f));
const usages = files.flatMap(f => {
  const text = readFileSync(f, 'utf8');
  return [...text.matchAll(/<(Focusable|ActionButton)\b([\s\S]*?)(?:\/>|>\s*\n?\s*\{)/g)].map(m => ({
    file: f.slice(SRC.length),
    attrs: m[2],
  }));
});

describe('label coverage of focusable elements', () => {
  it('finds the focusable usages (guards against a broken scan)', () => {
    expect(usages.length).toBeGreaterThanOrEqual(25);
  });

  it('gives every Focusable / ActionButton a non-empty label prop', () => {
    const missing = usages.filter(u => !/\blabel=(\{[^}]+\}|"[^"]+")/.test(u.attrs));
    expect(missing.map(u => u.file)).toEqual([]);
  });

  it('uses Pressable only inside Focusable and the hidden scan sink', () => {
    const offenders = files
      .filter(f => /<Pressable\b|Touchable(Opacity|Highlight|WithoutFeedback)/.test(readFileSync(f, 'utf8')))
      .map(f => f.slice(SRC.length).split(sep).join('/'));
    expect(offenders).toEqual(['/scan/ScanScope.tsx']);
  });

  it('keeps the scan sink hidden from screen readers', () => {
    const text = readFileSync(join(SRC, 'scan', 'ScanScope.tsx'), 'utf8');
    expect(text).toMatch(/accessible=\{false\}/);
    expect(text).toMatch(/importantForAccessibility="no-hide-descendants"/);
  });

  it('sets the accessibility label and role on the one real Pressable', () => {
    const text = readFileSync(join(SRC, 'components', 'Focusable.tsx'), 'utf8');
    expect(text).toMatch(/accessibilityLabel=\{label\}/);
    expect(text).toMatch(/accessibilityRole=\{role\}/);
  });
});
