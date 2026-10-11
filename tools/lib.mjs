// Shared helpers for the self-check tools. Paths can be overridden with env vars.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const SDK = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
if (!SDK) {
  throw new Error('Set ANDROID_HOME to the Android SDK folder');
}
export const ADB = process.env.ADB || path.join(SDK, 'platform-tools', 'adb.exe');
export const SERIAL = process.env.ANDROID_SERIAL || 'emulator-5554';
export const PKG = 'com.thodu.tv';
export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Reports go to OUT_DIR, or to <repo>/reports (git-ignored) when it is not set.
export const OUT_DIR = process.env.OUT_DIR || path.join(REPO, 'reports');
export const APK = path.join(
  REPO,
  'packages',
  'expotv',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk',
);

export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {encoding: 'utf8', maxBuffer: 1 << 28, ...opts});
  return {status: r.status, out: r.stdout || '', err: r.stderr || '', error: r.error};
}

export const adb = (...args) => run(ADB, ['-s', SERIAL, ...args]);
export const sleep = ms => new Promise(r => setTimeout(r, ms));

export function findAapt2() {
  const root = path.join(SDK, 'build-tools');
  for (const v of fs.readdirSync(root).sort().reverse()) {
    const p = path.join(root, v, 'aapt2.exe');
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

export function writeReport(name, text) {
  fs.mkdirSync(OUT_DIR, {recursive: true});
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, text.replace(/\r\n/g, '\n'));
  return file;
}
