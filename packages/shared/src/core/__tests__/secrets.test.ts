import {execFileSync} from 'child_process';
import {existsSync, readFileSync} from 'fs';
import {join} from 'path';

const root = join(__dirname, '..', '..', '..', '..', '..');
const envFile = join(root, 'packages', 'expotv', '.env.local');

describe('ntfy topic stays out of tracked files', () => {
  const tracked = execFileSync('git', ['ls-files'], {cwd: root, encoding: 'utf8'})
    .split('\n')
    .filter(f => f && !/\.(png|ttf|jar|keystore)$/.test(f));

  it('the local env file is git-ignored', () => {
    const out = execFileSync('git', ['check-ignore', 'packages/expotv/.env.local'], {cwd: root, encoding: 'utf8'});
    expect(out.trim()).toBe('packages/expotv/.env.local');
  });

  it('no tracked file contains the real topic', () => {
    if (!existsSync(envFile)) {
      return;
    }
    const m = /EXPO_PUBLIC_THODU_TOPIC=(\S+)/.exec(readFileSync(envFile, 'utf8'));
    expect(m).not.toBeNull();
    const topic = m![1];
    for (const f of tracked) {
      expect(readFileSync(join(root, f), 'utf8').includes(topic)).toBe(false);
    }
  });
});
