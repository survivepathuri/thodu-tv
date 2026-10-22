# Thodu TV: Security and privacy self-audit
*Easy TV. One button. Family one press away.*

**This is a self-audit written by the developer. It is not a certification, a penetration test or a third-party review.** It states what we checked, what we found and what we did not check. Thodu TV is a hackathon prototype.

> **Thodu TV is not an emergency service. In an emergency call your local emergency number.**

## What data the app handles

- **Stored on the device only:** chosen needs, language, scanning speed, the family notification topic name, the Real/Demo switch, and whether setup was finished. They are saved as one JSON entry (`thodu.state`) in Android app-private storage (AsyncStorage). It is not encrypted by the app, but it is private to the app and `allowBackup` is off, so it is not copied into Android backups.
- **No accounts, no analytics, no advertising, no crash reporting, no Thodu TV server.** The only network request the app makes is the optional family notification to ntfy.sh.
- **The help log** (the Family screen) is kept in memory only and is gone when the app closes.

## Family notification and ntfy.sh

- ntfy.sh is a **public** service run by a third party. Anyone who knows a topic name can read the messages sent to it and can also post to it. We did not review what ntfy.sh logs or keeps.
- The TV makes a random topic name (`thodu-` plus 12 random characters, 60 random bits, from `expo-crypto`). It is unguessable in practice but it is a shared secret, not real access control. It is shown only on the TV settings screen.
- The message is generic: title "Thodu TV", text "Help was requested from the TV at HH:MM", high priority. It contains no names, addresses or health data (`buildPayload` in `packages/shared/src/core/notify.ts`, covered by `notify.test.ts`).
- The request goes over HTTPS only. Success is shown only after an HTTP 2xx answer; otherwise the app says it could not reach the family.
- Delivery to a real phone: on 2026-10-20, in a consented family session on a Sony Android TV, several real Help alerts sent from the TV reached the family phone through the ntfy app (user-reported; no recording is stored in this repository). Delivery from the Amazon cloud Fire TV was not tested, because the judge build contains no topic. ntfy.sh's availability and its logging are not verified.

## Android permissions and build settings (release APK manifest)

| Item | State |
|---|---|
| `android.permission.INTERNET` | requested (needed for ntfy) |
| `android.permission.ACCESS_NETWORK_STATE` | added by a library; reads connection state only |
| `com.thodu.tv.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` | app-private signature permission added by AndroidX; other apps cannot hold it |
| Storage, overlay and vibrate permissions | removed on purpose (`blockedPermissions` in `app.json` and `tools:node="remove"` lines) |
| Cleartext (HTTP) traffic | disabled (`usesCleartextTraffic=false`) |
| `allowBackup` | `false` |
| `debuggable` | not set (defaults to false) in the release build |
| App logs in release | the `[scan]` debug logs are behind `__DEV__`; the release build logs nothing from the app |

The first S4 build still carried storage permissions (re-added by library manifests) and `allowBackup=true`; both were found by `tools/security-check.mjs` and removed.

## Signing

The APK is signed with the template's generated **debug keystore**, not a production key; it is a demo build. That is acceptable for a demo on an emulator or a developer device only, and it must not go to a store. The **judge APK** (`thodu-tv-d52f5fe-judge.apk`) is a public demo build signed with that debug key and contains no notification topic; it is published to the public as a GitHub Release asset for the hackathon judges and anyone else who wants to try it, which is acceptable only because it is a demo with no secrets in it. Builds that contain a real notification topic are never published. A real release needs its own signing key.

## Secrets and personal data scan (counts only, matched text never printed)

Scan re-run for the public release with plain `git grep` / `git log --all -p | grep` (172 tracked files at HEAD, 59 commits, every branch and the remote-tracking ref). Counts only; matched text is never printed:

| Pattern | HEAD | History |
|---|---|---|
| AWS key, GitHub token, Google API key, Slack token, `sk-` key | 0 (the only `AKIA` hit is the scanner's own regex in `tools/security-check.mjs`) | same, plus the commit that added that scanner |
| Absolute local path with a user name, or a Windows drive path to the developer's folders | 0 | 0 |
| Email-like strings (excluding `yarn.lock`) | 0 | 4 distinct addresses: the author's GitHub no-reply address and the AI-assistant co-author address in commit metadata, an upstream code-of-conduct contact in the imported Amazon sample, and the public Devpost testing address in one earlier version of `submission.md` (a public hackathon contact, not a person's address) |
| Private notification topic | 0 | 0 |
| ntfy topic-shaped strings (`thodu-` plus groups of 4) | 14 occurrences of 5 distinct placeholders and test fixtures (`thodu-xxxx-xxxx-xxxx`, `thodu-aaaa-aaaa-aaaa`, `thodu-abcd-efgh-ijkl`, `thodu-abcd-efgh-ijkl-mnop`, `thodu-abz2-7a7h-ijkl`) | the same 5 |

Tracked files contain no APK, no keystore and no `.env` file other than `.env.example`. The test `secrets.test.ts` checks that `.env.local` is git-ignored and, only on a machine that has such a file, that the topic written in it appears in no tracked file (on a fresh clone it checks nothing about topics). Commit author identity metadata uses a GitHub no-reply address. `node tools/security-check.mjs` (needs `ANDROID_HOME` and an emulator) is the older scanner.

## Dependency audit

Command: `yarn npm audit --all --recursive` (Yarn 4.5.0), run on the committed lockfile. We did **not** upgrade any dependency in this step.

| Run | Advisories | critical | high | moderate | low |
|---|---|---|---|---|---|
| All dependencies | 108 | 5 | 69 | 32 | 2 |
| `--environment production` | 108 | 5 | 69 | 32 | 2 |

The production filter returned the same 108 because React Native and Expo list many build tools as normal dependencies, so it cannot tell us what ships in the app.

**Our triage (by the package that pulls each advisory in; not verified by inspecting the built JavaScript bundle):**

- **103 of 108** are in Node-side tooling that runs on the developer's PC, not on the TV: the Expo CLI and prebuild tools, Metro, Babel, `node-gyp`, `ts-jest` and similar. Examples: `@xmldom/xmldom` (13, via `@expo/plist`), `brace-expansion` (13), `handlebars` (11, via `ts-jest`, test tooling), `tar` (9, via `node-gyp`), `js-yaml` (8), `minimatch` (6). The 5 critical advisories are `handlebars` (3, test tooling), `tar` (1, via `node-gyp`) and `shell-quote` (1, via `react-devtools-core`).
- **5 of 108** are in packages that an Expo / React Navigation app normally bundles at runtime: `nanoid` (3 high, via React Navigation, which comes with `expo-router`; the advisories concern non-secure or custom generators called with negative or zero size), `decode-uri-component` (1 moderate, via `query-string`) and `@ungap/structured-clone` (1 moderate, via `expo`).
- **Reachable from our code?** Our own code does not call these packages directly. Whether the library code that uses them can be triggered by this app was **not assessed**. We did not read the advisories' attack paths beyond their titles.

Making these numbers meaningful would need a build-time bundle analysis and a dependency upgrade pass; both are future work.

## Known limitations

- Self-audit only. No third-party review, no penetration test, no dynamic testing of the network path, no review of third-party native code.
- Debug-keystore signing (above); dependencies not upgraded (above).
- Local storage is not encrypted at rest by the app. A device with root access could read it, including the topic name.
- Anyone who learns the topic name can read or post. The "Make a new name" button in Family settings creates a new topic (after a confirm screen); the family must subscribe again.
- Hardware: the app ran on an Amazon Fire TV cloud device (Live Device Interaction) and on one home Sony Android TV; no other device was tested, and no hardware security testing was done.

## How to report an issue

Please open an issue in this repository's GitHub issue tracker. Do not post secrets or real topic names in a public issue; describe the problem and say you can share details privately if needed.
