# Thodu TV: Claims and evidence
*Easy TV. One button. Family one press away.*

Every claim the README, the judge guide, the Devpost text and the video make, with its evidence tag and the command or path that shows it. If a claim is not in this table it is not made. Tags are explained in [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md): `[unit test]` · `[code only]` · `[cloud Fire TV, date, build]` · `[real Android TV, Sony, user-reported]` · `[emulator]` · `[APK static]` · `[script]` · `[not tested]`.

Commands run from the repository root. Jest: `cd packages/shared && npx jest -c jest.core.config.js`. Latest run (2026-10-23, HEAD): **16 suites, 223 tests, all passing**: theme 65, notify 27, familyAlert 19, persist 18, scanner 16, simpleText 13, adapt 12, helpResult 11, a11y 9, strings 8, helpEvents 7, a11yCoverage 5, captions 4, speech 4, buttonIcons 3, secrets 2. The shared package type-checks with `../expotv/node_modules/.bin/tsc --noEmit -p .` (run inside `packages/shared`; 0 errors) `[script]`. The app package needs a path-mapped temporary tsconfig because of the `nohoist` install layout (command and explanation: [JUDGES.md](JUDGES.md) "Run from source"); with it, `packages/expotv/app` and `packages/shared/src` are clean `[script]` and 9 errors remain in unused Expo starter-template files, left unfixed. Plain `tsc` in `packages/expotv` reports 27 errors (the nohoist resolution problem plus the 9 above). `expo lint` does not run: it exits with "Cannot find module" because ESLint is not installed or declared, so no lint result is claimed.

## What the app does

| # | Claim | Tag | Command / path |
|---|---|---|---|
| 1 | Setup turns four needs (see, hear, remote, read) into settings; needs combine by max / OR | `[unit test]` | `core/__tests__/adapt.test.ts` (12) |
| 2 | "Easier to see": text 1.6x, high-contrast theme, ring 10, larger buttons | `[unit test]` | `adapt.test.ts`, `core/adapt.ts` |
| 3 | The setup screen restyles live while choosing | `[code only]`; seen on `[emulator]` | `screens/SetupScreen.tsx`; screenshots `docs/screenshots/01`, `03` |
| 4 | Single-button scanning: one item highlighted at a time, Select chooses; speeds 2600 / 1800 / 1200 ms | `[unit test]` for the state machine; `[emulator]` ENTER-only run on an earlier build | `core/scanner.ts`, `scanner.test.ts` (16); `screens/SetupScreen.tsx` (`SCAN_SPEEDS`) |
| 5 | Home has five tiles: Watch, Family, Medicines, Help, Settings | `[unit test]` tile list, Medicines label in all languages and layout; `[code only]` screen | `core/palette.ts` (`TILE_IDS`), `core/homeLayout.ts`, `familyAlert.test.ts`, `screens/HomeScreen.tsx`. Home with all five tiles on a device: shown in the demo video and used in the 2026-10-20 session `[real Android TV, Sony, user-reported]`; no recording in this repo |
| 6 | Watch opens a labelled demo panel with looping sample captions; no real video | `[code only]`, `[unit test]` captions | `screens/WatchDemo.tsx`, `captions.test.ts` (4) |
| 7 | Read-aloud of the focused item with Android text-to-speech; routes to the screen reader's announce when one is on | `[unit test]` the route decision; `[emulator]` English speech heard | `core/speech.ts`, `speech.test.ts`, `a11y.test.ts`; Hindi/Telugu voices `[not tested]` |
| 8 | Simple wording for key strings and a glyph next to action buttons ("Easier to read") | `[unit test]` | `simpleText.test.ts` (13), `buttonIcons.test.ts` (3) |
| 9 | English, Hindi, Telugu have the same string keys | `[unit test]` | `strings.test.ts` (8). Native-speaker review: `[not tested]` |
| 10 | Settings survive restart; corrupt data falls back to safe defaults; versioned storage | `[unit test]`; relaunch seen on `[emulator]` | `persist.test.ts` (18) |
| 11 | System font scale honoured up to 1.3, total capped at 2.0; Home wraps to 3+2 tiles above 1.3 | `[unit test]` | `a11y.test.ts`; `familyAlert.test.ts` (`columnsFor`) |
| 12 | Onboarding, language switch, high-contrast theme, D-pad navigation and Settings work on the developer's TV | `[real Android TV, Sony, user-reported]` (a 4-tile build earlier; the 2026-10-20 family session is in row 22; developer's report, no recording in this repo) | [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md) |

## Notifications (Family, Medicines, Help)

| # | Claim | Tag | Command / path |
|---|---|---|---|
| 13 | One sender (`sendFamilyAlert`) serves Help, Family hello and Medicines; the Settings test uses the same HTTP path | `[code only]` | `core/notify.ts`, `settings/useFamilyAlert.ts`, `expotv/app/help.tsx` |
| 14 | The message is generic: title "Thodu TV", a short sentence with the clock time, priority high, an emoji tag; no names, addresses or health data | `[unit test]` | `notify.test.ts` (27), `buildPayload` in `core/notify.ts` |
| 15 | "Family notified" is shown only after an HTTP 2xx from ntfy.sh | `[unit test]` (fake network) | `notify.test.ts`, `familyAlert.test.ts` (19) |
| 16 | Failures (offline, timeout, refused) show honest text in English, Hindi, Telugu | `[unit test]` | `strings.test.ts`, `familyAlert.test.ts` |
| 17 | One retry after a network error, timeout, 5xx or 429; no retry after other 4xx | `[unit test]` | `notify.test.ts` |
| 18 | A repeat press of the same button within 3 s of a success is ignored; a failure can be retried at once | `[unit test]` | `familyAlert.test.ts` |
| 19 | With no topic configured, or before a test message succeeded, the app is in demo mode: "Demo: nobody was told" and nothing is sent | `[code only]` for the demo branch and text; `[unit test]` for the topic-config rules and the string keys | `settings/useFamilyAlert.ts`, `expotv/app/help.tsx`, `familyAlert.test.ts` (`applyConfiguredTopic`), `strings.test.ts` |
| 20 | The judge APK contains no notification topic | `[APK static]` (searched; a topic-bearing build used as a control does contain one) | `thodu-tv-d52f5fe-judge.apk`; the tracked repo is checked by `secrets.test.ts` (2) |
| 21 | The app sends one POST per alert to ntfy.sh (`notify.ts`). End-to-end TV-to-phone delivery: see row 22 | `[unit test]` for the sender (fake network) | `notify.test.ts`, `familyAlert.test.ts` |
| 22 | Several real Help alerts sent from the TV reached the family phone through the ntfy app, in a consented session on a Sony Android TV on 2026-10-20 (a build of the same code with a private topic) | `[real Android TV, Sony, user-reported]` | [USER_TESTING.md](USER_TESTING.md). No recording in this repo. Not tested: delivery from a Fire TV, delivery with the judge build (it has no topic) |
| 23 | Medicines is a one-press check-in ("Yes, I took it") that notifies the family; there are no timed reminders and no schedule | `[unit test]` for the send; `[code only]` for the screen | `screens/MedicinesScreen.tsx`, `familyAlert.test.ts`. Medicines on a TV: the tile opened on the Sony TV (user-reported); a real Medicines alert on a phone is not recorded |
| 24 | Anyone who knows the topic can read the messages | Fact about ntfy.sh | [PRIVACY_AND_SAFETY.md](PRIVACY_AND_SAFETY.md) |

## Accessibility (measured)

| # | Claim | Tag | Command / path |
|---|---|---|---|
| 25 | 73 colour pairs in both themes, 0 below target; lowest text contrast 7.79:1; lowest non-text 3.61:1 | `[script]` | `node tools/a11y-measure.mjs`; `theme.test.ts` (65) |
| 26 | Focus ring contrast 5.57:1 or more (Sunrise tiles), 19.03:1 or more (high contrast); ring 4 px (10 px for low vision) | `[script]`, `[code only]` | `tools/a11y-measure.mjs`, `components/Focusable.tsx` |
| 27 | Smallest text 22 design px (1920x1080 grid) | `[script]` | `tools/a11y-measure.mjs` |
| 28 | Every focusable element has an accessibility label (25 of 25 usages) | `[unit test]`, `[script]` | `a11yCoverage.test.ts` (5) |
| 29 | The emulator label audit found 35 interactive nodes with names and 0 without | `[emulator]` on an earlier build; not re-run | `tools/a11y-audit.mjs` |
| 30 | Nothing disappears on a timer; the alert banner changes every 700 ms; captions rotate every 3000 ms | `[code only]` | [ACCESSIBILITY.md](ACCESSIBILITY.md) |
| 31 | VoiceView / TalkBack behaviour | `[not tested]` | Detection and routing only: `a11y.test.ts` |
| 31a | **Known limitation:** static status text (for example "Family notified") has no VoiceView "Described By" association, so a screen reader may not read it unless it is in a focused button label or is announced | `[not tested]` with a screen reader; not implemented in code (`[code only]`) | [ACCESSIBILITY.md](ACCESSIBILITY.md) "Accessibility labels" and "Not verified" |

## Platform and build

| # | Claim | Tag | Command / path |
|---|---|---|---|
| 32 | The APK declares a leanback launcher, touchscreen not required, a banner, minSdk 24, targetSdk 36 | `[APK static]` | [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md) `aapt2 dump badging` |
| 33 | Permissions: INTERNET, ACCESS_NETWORK_STATE (library), an AndroidX signature permission; no Google Play Services or Firebase classes | `[APK static]` | `SECURITY.md`, DEVICE_EVIDENCE.md |
| 34 | The universal APK has arm64-v8a, armeabi-v7a and x86 libraries and is 68,382,021 bytes (judge build, SHA-256 in [JUDGES.md](JUDGES.md)) | `[APK static]` | `aapt2 dump badging`, file size |
| 35 | Cold start median 1351 ms (min 1136, max 1965; 7 runs) | `[emulator]` (x86, Android 14, an earlier build) | `tools/cold-start.mjs`. Not a Fire TV number. |
| 36 | The app ran on an Amazon cloud Fire TV device (Live Device Interaction): started on 2026-10-14 with an older build (three recordings that show no device frame), and again in the footage used in the demo video | `[cloud Fire TV, 2026-10-14, older build]` for the first; the developer's report for the later footage | [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md). No Fire OS version is claimed |
| 37 | Fire OS version of the cloud device | Not captured | Do not claim ("FOS 14" in the device list is only presumed to mean Fire OS 14) |
| 38 | The judge build has the launcher label "Thodu TV" and a banner reading "Thodu TV / Easy TV. One button. Family one press away." | `[APK static]` (`aapt2 dump badging`; banner image viewed) | `thodu-tv-d52f5fe-judge.apk` |
| 40 | Built from Amazon's multi-TV starter (MIT-0), new repository started 2026-10-12 | git history | [PRE_EXISTING.md](PRE_EXISTING.md), `NOTICE` |
| 41 | `versionName` is generated from the git SHA at prebuild | `[code only]` (checked on a copy of `build.gradle`) | `packages/expotv/plugins/withGitVersionName.js` |

## Claims that are NOT made

| Not claimed | Why |
|---|---|
| Fire TV certified, Appstore approved or submitted | Not done |
| Tested with users as a study, or any measured benefit | One consented family session, n = 1, user-reported, no recording ([USER_TESTING.md](USER_TESTING.md)) |
| Emergency service, medical device, health monitoring | It is a notification to a phone through a public service |
| Medicine reminders or schedules | Not built (roadmap) |
| Voice recognition or voice control | Not built; "read-aloud" is text-to-speech only |
| Usage-adaptive or learning Home screen | Not built |
| Real video playback or streaming | Watch is a labelled demo panel |
| Delivery to a phone from a Fire TV, or from the judge build | Not tested (only the Sony Android TV session, row 22) |
| Native-speaker-reviewed Hindi/Telugu; VoiceView/TalkBack verified | `[not tested]` |
| The Sony TV is a Fire TV | It is an Android TV; always labelled so |

