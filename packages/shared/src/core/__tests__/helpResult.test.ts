import {readFileSync} from 'fs';
import {join} from 'path';
import {helpSentCopy} from '../helpResult';
import {LANGS, translate} from '../strings';
import {SIMPLE_STRINGS} from '../simpleText';

// Words that claim something was sent or someone was told, in all 3 languages.
const CLAIMS_SENT = [
  /alert sent/i,
  /\bsent\b/i,
  /\btold\b/i,
  /notified/i,
  /check on you/i,
  /on the way/i,
  /चेतावनी भेजी/,
  /बता दिया/,
  /परिवार को बताया/,
  /हाल पूछेंगे/,
  /పంపాము/,
  /చెప్పాము/,
  /తెలుసుకుంటారు/,
];

// Demo texts that legitimately NEGATE sending ("nobody was told").
const NEGATED = /nobody|no one|not |नहीं|ఎవరికీ|పంపలేదు/i;

describe('Help result copy', () => {
  it('real mode keeps the success wording', () => {
    const c = helpSentCopy(false);
    expect(translate('en', c.banner)).toBe('ALERT SENT');
    expect(translate('en', c.title)).toBe('Your family was told');
    expect(translate('en', c.body)).toBe('They will check on you soon.');
  });

  it.each(LANGS)('demo mode in %s never says sent / told / will check on you', lang => {
    const c = helpSentCopy(true);
    for (const key of [c.banner, c.title, c.body]) {
      const text = translate(lang, key);
      const positive = CLAIMS_SENT.filter(r => r.test(text));
      // A match is allowed only when the sentence is a negation.
      if (positive.length > 0) {
        expect(text).toMatch(NEGATED);
      }
      expect(text).not.toMatch(/alert sent|check on you|चेतावनी भेजी|హెచ్చరిక పంపాము/i);
    }
  });

  it('demo mode says plainly that nobody was told (en)', () => {
    const c = helpSentCopy(true);
    expect(translate('en', c.banner)).toBe('Demo only');
    expect(translate('en', c.title)).toMatch(/no one has been contacted/i);
    expect(translate('en', c.body)).toMatch(/nobody was told/i);
  });

  it('demo mode in simple language also says nobody was told', () => {
    const c = helpSentCopy(true);
    expect(SIMPLE_STRINGS.en[c.title]).toMatch(/no one was told/i);
    expect(SIMPLE_STRINGS.en[c.title]).not.toMatch(/family told/i);
  });

  it('demo copy never reuses a key that is reserved for real success', () => {
    const real = Object.values(helpSentCopy(false));
    for (const key of Object.values(helpSentCopy(true))) {
      expect(real).not.toContain(key);
    }
  });

  it.each(LANGS)('failure wording in %s is not success wording', lang => {
    for (const key of ['help.failed.title', 'help.failed.body'] as const) {
      expect(translate(lang, key)).not.toMatch(/alert sent|check on you|चेतावनी भेजी|హెచ్చరిక పంపాము/i);
    }
    expect(translate('en', 'help.failed.title')).toBe('We could not reach your family.');
  });

  it('HelpSentScreen takes all its text from helpSentCopy', () => {
    const src = readFileSync(join(__dirname, '..', '..', 'screens', 'HelpFlow.tsx'), 'utf8');
    const sent = src.slice(src.indexOf('export const HelpSentScreen'), src.indexOf('export const FamilyScreen'));
    expect(sent).toContain('helpSentCopy(demo)');
    expect(sent).not.toMatch(/t\('help\.sent\./);
  });
});
