import type {StringKey} from './strings';

/**
 * Copy keys for the Help result screen. In demo mode nothing was sent, so the
 * screen must never use "sent"/"told"/"will check on you" wording; those keys
 * are only reachable when a real message got an HTTP 2xx.
 */
export interface HelpSentCopy {
  banner: StringKey;
  title: StringKey;
  body: StringKey;
}

export const helpSentCopy = (demo: boolean): HelpSentCopy =>
  demo
    ? {banner: 'fam.mode.demo', title: 'help.body', body: 'alert.demo'}
    : {banner: 'help.sent.alert', title: 'help.sent.real.title', body: 'help.sent.body'};
