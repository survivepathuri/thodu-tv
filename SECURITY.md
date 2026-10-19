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
- Not verified: delivery to a real phone (no phone was subscribed during development), and ntfy.sh's availability.

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

The APK is signed with the template's generated **debug keystore**, not a production key; it is a demo build. That is acceptable for a demo on an emulator or a developer device only, and it must not go to a store. The **judge APK** is a public demo build (it contains no notification topic). The **private ntfy APK** (it contains a notification topic) must not be shared. A real release needs its own signing key.

## Secrets and personal data scan (counts only, matched text never printed)

Scan of the repository taken just before this file was last updated (113 tracked files at HEAD, 24 commits of history; the email-like and topic-shaped counts move by a few as documents are added, so re-run the tool for exact current values):

| Pattern | HEAD | History |
|---|---|---|
| AWS key, private key block, GitHub token, bearer token, generic secret assignment | 0 | 0 |
| Absolute local path | 0 | 0 |
| Email-like strings | 8 | 52 |
| ntfy topic-shaped strings | 10 | 13 |

The email-like matches are package specifiers such as `yarn@4.5.0`, lockfile entries and upstream contact addresses in the unchanged imported Amazon sample; we found no personal address in the tree. The topic-shaped matches are test fixtures and a documentation example (`thodu-abcd-efgh-ijkl` and similar), not real topics. Commit author identity metadata uses a GitHub no-reply address. Re-run it yourself with `node tools/security-check.mjs` (needs `ANDROID_HOME`).

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
- The app has not been tested on real hardware.

## How to report an issue

Please open an issue in this repository's GitHub issue tracker. Do not post secrets or real topic names in a public issue; describe the problem and say you can share details privately if needed.
