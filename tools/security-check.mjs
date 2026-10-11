// Security SELF-audit. Not a certification and not a penetration test.
// Prints COUNTS only: matched text is never written anywhere.
import fs from 'node:fs';
import path from 'node:path';
import {APK, REPO, findAapt2, run, writeReport} from './lib.mjs';

const PATTERNS = {
  'AWS access key': /AKIA[0-9A-Z]{16}/g,
  'private key block': /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  'GitHub token': /gh[pousr]_[A-Za-z0-9]{36,}/g,
  'bearer token': /Bearer\s+[A-Za-z0-9._-]{20,}/g,
  'generic secret assignment': /(secret|passw(or)?d|api[_-]?key|access[_-]?token)["']?\s*[:=]\s*["'][^"'\s]{8,}["']/gi,
  'absolute local path': /[A-Za-z]:\\+(Users|Program Files)\\|\/Users\/[a-z]|\/home\/[a-z]/g,
  'email-like': /[\w.+-]+@[\w-]+\.[\w.-]+/g,
  'phone-like': /\+?\d[\d\s().-]{8,}\d/g,
};

const count = (text, re) => (text.match(re) || []).length;
const BINARY = /\.(png|jpg|jpeg|gif|webp|ico|ttf|otf|woff2?|jar|keystore|zip|mp3|mp4|wav)$/i;

function scan(texts) {
  const out = {};
  for (const k of Object.keys(PATTERNS)) {
    out[k] = 0;
  }
  for (const t of texts) {
    for (const [k, re] of Object.entries(PATTERNS)) {
      out[k] += count(t, re);
    }
  }
  return out;
}

// (a) tree = tracked files at HEAD; history = every patch ever committed.
const files = run('git', ['ls-files'], {cwd: REPO}).out.split('\n').filter(f => f && !BINARY.test(f));
const treeTexts = files.map(f => {
  try {
    return fs.readFileSync(path.join(REPO, f), 'utf8');
  } catch {
    return '';
  }
});
const tree = scan(treeTexts);
const history = scan([run('git', ['log', '--all', '-p', '--no-color'], {cwd: REPO}).out]);
const commits = run('git', ['rev-list', '--all', '--count'], {cwd: REPO}).out.trim();

// (b) yarn npm audit (Yarn 4 through npx; registry access only).
function audit(extra = []) {
  const npx = path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npx-cli.js');
  if (!fs.existsSync(npx)) {
    return {unavailable: 'npx-cli.js not found next to node'};
  }
  const r = run(process.execPath, [npx, '--yes', '@yarnpkg/cli-dist@4.5.0', 'npm', 'audit', '--all', '--recursive', '--json', ...extra], {
    cwd: REPO,
    timeout: 240000,
  });
  const advisories = new Map();
  for (const line of r.out.split('\n')) {
    try {
      const j = JSON.parse(line);
      const c = j.children || j;
      if (c && c.Severity) {
        advisories.set(String(c.ID ?? c.URL ?? line.length), c.Severity.toLowerCase());
      }
    } catch {
      // not a JSON line
    }
  }
  if (advisories.size === 0 && r.status !== 0) {
    const msg = (r.err || r.out).split('\n').find(l => l.trim()) || 'unknown error';
    return {unavailable: `exit ${r.status}: ${msg.slice(0, 200)}`};
  }
  const sev = {};
  for (const s of advisories.values()) {
    sev[s] = (sev[s] || 0) + 1;
  }
  return {sev, total: advisories.size};
}
const a = audit();
const aProd = audit(['--environment', 'production']);

// (c)(d)(e) from the release APK's real binary manifest.
let manifest = {error: 'release APK not found'};
if (fs.existsSync(APK)) {
  const aapt2 = findAapt2();
  const r = aapt2 ? run(aapt2, ['dump', 'xmltree', '--file', 'AndroidManifest.xml', APK]) : null;
  if (r && r.status === 0) {
    const lines = r.out.split('\n');
    const perms = [];
    for (let i = 0; i < lines.length; i++) {
      if (/E: uses-permission/.test(lines[i])) {
        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
          const m = /android:name\(0x[0-9a-f]+\)="([^"]+)"/.exec(lines[j]);
          if (m) {
            perms.push(m[1]);
            break;
          }
        }
      }
    }
    const flag = name => {
      const m = new RegExp(`android:${name}\\(0x[0-9a-f]+\\)=(?:\\(type [^)]*\\))?(\\w+)`).exec(r.out);
      return m ? m[1] : null;
    };
    manifest = {perms, cleartext: flag('usesCleartextTraffic'), debuggable: flag('debuggable'), backup: flag('allowBackup')};
  } else {
    manifest = {error: 'aapt2 failed: ' + (r ? r.err.slice(0, 200) : 'aapt2 not found')};
  }
}

const sevTable = (title, r) =>
  r.unavailable
    ? `**${title}:** unavailable: ${r.unavailable}`
    : `**${title}:** ${r.total} unique advisories

| Severity | Count |
|---|---|
${['critical', 'high', 'moderate', 'low', 'info']
        .map(s => `| ${s} | ${r.sev[s] || 0} |`)
        .join('\n')}`;

const row = (k, v) => `| ${k} | ${v} |`;
const md = `# Security self-check

**This is a self-audit written by the developer. It is not a certification, a penetration test or a third-party review.** It reports counts and facts about this build only.

Repo: ${files.length} tracked text files at HEAD, ${commits} commits in history. Matched text is never printed.

## (a) Secret / personal-data pattern scan (counts)

| Pattern | Tree (HEAD) | History (all patches) |
|---|---|---|
${Object.keys(PATTERNS).map(k => row(k, `${tree[k]} | ${history[k]}`)).join('\n')}

Email-like and phone-like matches are expected to be noise (lockfile hashes, image names such as @2x, upstream contact addresses in the imported sample). A non-zero count in the first six rows needs a human look.

## (b) Dependency audit (\`yarn npm audit --all --recursive\`)

${sevTable('All dependencies (includes build and test tooling)', a)}

${sevTable('Production dependencies only (--environment production)', aProd)}

${
  a.total !== undefined && a.total === aProd.total
    ? 'The production-only run returned the same count as the full run, so this filter did not separate build tooling from runtime code here (React Native and Expo list many build tools as normal dependencies).\n\n'
    : ''
}An audit lists known advisories for resolved package versions. It does not say whether the vulnerable code is reachable from this app.

## (c) Permissions in the release APK manifest

${
  manifest.error
    ? `Unavailable: ${manifest.error}`
    : manifest.perms.length
      ? manifest.perms.map(p => `- ${p}`).join('\n')
      : '- (none)'
}

## (d) Cleartext traffic

${manifest.error ? 'Unavailable.' : `usesCleartextTraffic = ${manifest.cleartext ?? 'not set (platform default)'}`}

## (e) Debuggable

${manifest.error ? 'Unavailable.' : `android:debuggable = ${manifest.debuggable ?? 'absent (defaults to false)'}`}
${manifest.error ? '' : `\nallowBackup = ${manifest.backup ?? 'not set'}`}

## Not covered

Signing: release builds still use the generated debug keystore. No dynamic testing of the network path, no review of third-party native code, no check of what ntfy.sh does with messages.
`;
console.log('wrote', writeReport('s4-security-check.md', md));
