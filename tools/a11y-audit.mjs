// Accessibility audit via `uiautomator dump`: lists focusable/clickable nodes and
// flags any with BOTH empty content-desc and empty text. Screens are reached with
// `am start -a VIEW -d thodu://...` deep links (adb), because key paths depend on
// focus timing; one more screen is reached by a D-pad key event (ENTER on Home).
import {PKG, adb, sleep, writeReport} from './lib.mjs';

const SCREENS = [
  {name: 'Setup (first run)', uri: 'thodu://setup'},
  {name: 'Home', uri: 'thodu://home'},
  {name: 'Settings (needs)', uri: 'thodu://settings'},
  {name: 'Family notifications', uri: 'thodu://family-settings'},
  {name: 'Reset confirm', uri: 'thodu://reset'},
  {name: 'Help confirm', uri: 'thodu://help'},
  {name: 'Family log', uri: 'thodu://section/family'},
  {name: 'Watch (demo)', uri: 'thodu://section/watch'},
];

function attrs(tag) {
  const o = {};
  for (const m of tag.matchAll(/([\w-]+)="([^"]*)"/g)) {
    o[m[1]] = m[2];
  }
  return o;
}
const decode = s =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#10;/g, ' ')
    .replace(/&amp;/g, '&');

function dump() {
  adb('shell', 'rm', '-f', '/sdcard/ui.xml');
  adb('shell', 'uiautomator', 'dump', '/sdcard/ui.xml');
  return adb('exec-out', 'cat', '/sdcard/ui.xml').out;
}

function analyse(name, uri, xml) {
  const inApp = [...xml.matchAll(/<node [^>]*>/g)]
    .map(m => attrs(m[0]))
    .filter(n => n.package === PKG);
  // A scrollable container (ScrollView) is reported focusable by uiautomator but is
  // not a control the person operates, so it is counted separately.
  const scrollers = inApp.filter(n => n.scrollable === 'true').length;
  const interactive = inApp.filter(
    n => n.scrollable !== 'true' && (n.clickable === 'true' || n.focusable === 'true'),
  );
  const label = n => decode(n['content-desc'] || '').trim() || decode(n.text || '').trim();
  return {
    name,
    uri,
    total: inApp.length,
    interactive: interactive.length,
    scrollers,
    unlabeled: interactive.filter(n => !label(n)),
    labels: interactive.map(label).filter(Boolean),
  };
}

const results = [];
for (const s of SCREENS) {
  adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', s.uri, PKG);
  await sleep(4000);
  const r = analyse(s.name, s.uri, dump());
  results.push(r);
  console.log(`${r.name}: ${r.interactive} interactive, ${r.unlabeled.length} flagged`);
}

// Reached by a key event: Home, then ENTER on the focused tile.
adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', 'thodu://home', PKG);
await sleep(3500);
adb('shell', 'input', 'keyevent', 'KEYCODE_ENTER');
await sleep(3500);
{
  const r = analyse('After ENTER on the first Home tile (key event)', 'keys', dump());
  results.push(r);
  console.log(`${r.name}: ${r.interactive} interactive, ${r.unlabeled.length} flagged`);
}

const totalI = results.reduce((a, r) => a + r.interactive, 0);
const totalU = results.reduce((a, r) => a + r.unlabeled.length, 0);
const md = `# Accessibility audit (self-run, uiautomator)

Method: for each screen, \`adb shell uiautomator dump\`; every node of ${PKG} with clickable or focusable = true is listed; a node is **flagged** when both content-desc and text are empty. Screens are opened with \`am start -a VIEW -d thodu://...\` (adb); the last row is reached by an ENTER key event. This checks that controls *have* names. It does not prove the names are good, and it is not a TalkBack/VoiceView listening test.

**Totals: ${totalI} interactive nodes, ${totalU} flagged.**

Scrollable containers (ScrollView) are not counted as controls; their number is shown in the last column.

| Screen | App nodes | Interactive | Flagged | Scroll containers (excluded) |
|---|---|---|---|---|
${results.map(r => `| ${r.name} | ${r.total} | ${r.interactive} | ${r.unlabeled.length} | ${r.scrollers} |`).join('\n')}

${results
  .map(
    r =>
      `## ${r.name}\n- Labels: ${r.labels.length ? r.labels.map(l => '`' + l + '`').join(', ') : '(none)'}\n${
        r.unlabeled.length
          ? r.unlabeled
              .map(n => `- FLAGGED: class=${n.class} id=${n['resource-id'] || '-'} bounds=${n.bounds}`)
              .join('\n')
          : '- No flagged nodes.'
      }`,
  )
  .join('\n\n')}
`;
console.log('wrote', writeReport('s4-a11y-audit.md', md));
adb('shell', 'input', 'keyevent', 'KEYCODE_HOME');
