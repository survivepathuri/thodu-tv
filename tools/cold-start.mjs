// Cold-start timing: force-stop, then `am start -W` N times; reports min/median/max.
// Numbers are for THIS device or emulator only; do not extrapolate to other hardware.
import {PKG, adb, sleep, writeReport} from './lib.mjs';

const RUNS = Number(process.env.RUNS || 7);
const prop = k => adb('shell', 'getprop', k).out.trim();

const totals = [];
for (let i = 0; i < RUNS; i++) {
  adb('shell', 'am', 'force-stop', PKG);
  await sleep(2500);
  const r = adb('shell', 'am', 'start', '-W', '-n', `${PKG}/.MainActivity`);
  const total = /TotalTime:\s*(\d+)/.exec(r.out);
  if (!total) {
    console.error(`run ${i + 1}: no TotalTime in output:\n${r.out}${r.err}`);
    continue;
  }
  totals.push(Number(total[1]));
  console.log(`run ${i + 1}: TotalTime ${total[1]} ms`);
  await sleep(2500);
}

const sorted = [...totals].sort((a, b) => a - b);
const median = sorted.length
  ? sorted.length % 2
    ? sorted[(sorted.length - 1) / 2]
    : Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
  : null;
const isEmu =
  prop('ro.kernel.qemu') === '1' ||
  /sdk|emulator|generic/i.test(prop('ro.product.model') + prop('ro.product.device'));

const md = `# Cold-start timing (self-measured)

- Device: ${prop('ro.product.manufacturer')} ${prop('ro.product.model')} (${isEmu ? 'EMULATOR' : 'physical device'}), Android ${prop('ro.build.version.release')} (API ${prop('ro.build.version.sdk')}), ABI ${prop('ro.product.cpu.abi')}
- App: ${PKG}, release build, after \`am force-stop\`, launched with \`am start -W -n ${PKG}/.MainActivity\`
- Runs: ${totals.length} of ${RUNS} requested

| Run | TotalTime (ms) |
|---|---|
${totals.map((t, i) => `| ${i + 1} | ${t} |`).join('\n')}

- min: ${sorted[0] ?? 'n/a'} ms
- median: ${median ?? 'n/a'} ms
- max: ${sorted[sorted.length - 1] ?? 'n/a'} ms

TotalTime is the time until the first activity frame is drawn, as reported by the Activity Manager. It is a property of this device/emulator only. It says nothing about a Fire TV Stick or any other hardware, and it was not extrapolated.
`;
console.log('wrote', writeReport('s4-cold-start.md', md));
