# Thodu TV (తోడు టీవీ)

A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.

Thodu means "companion" in Telugu.

Easy TV. One button. Family one press away.

Not a medical device or emergency service.

Thodu TV is a Fire TV track entry for the Amazon "Build, Ship, Shape" hackathon. It starts from what would make TV easier for an older or disabled viewer, and lets them tell a family member with one button. It is a working prototype, not a finished product.

> **Thodu TV is not an emergency service and not a medical device. In an emergency call your local emergency number.**

**Judges: start with [docs/JUDGES.md](docs/JUDGES.md)** (3 minutes, install steps, how to try the notifications with your own topic). Every claim below carries an evidence tag; the full table is [docs/CLAIMS.md](docs/CLAIMS.md).

Tags: `[unit test]` · `[code only]` · `[cloud Fire TV, date, build]` · `[real Android TV, Sony, user-reported]` (the developer's home TV, an Android TV, not a Fire TV) · `[emulator]` · `[APK static]` · `[script]` · `[not tested]`. Details in [docs/DEVICE_EVIDENCE.md](docs/DEVICE_EVIDENCE.md).

## What, for whom, why

Many older viewers and people with low vision, hearing loss, limited hand control or reading difficulty find a TV remote, small text and dense menus hard to use. Thodu TV opens with one question, "What would make TV easier for you?", and four large choices:

| Choice | What changes | Tag |
|---|---|---|
| **Easier to see** | text 1.6x, black/white/yellow high-contrast theme, focus ring 10 px (default 4), larger buttons | `[unit test]` `adapt.test.ts`, `theme.test.ts` |
| **Easier to hear** | captions always on in the Watch demo, flashing "ALERT SENT" banner | `[unit test]` `adapt.test.ts`, `captions.test.ts` |
| **Easier remote** | one-button auto-scanning (one item highlighted at a time; OK chooses; 2.6 s / 1.8 s / 1.2 s), larger buttons | `[unit test]` `scanner.test.ts` |
| **Easier to read** | read-aloud (text-to-speech), simple wording for key strings, a glyph beside every action button | `[unit test]` `simpleText.test.ts`, `speech.test.ts` |

Choices combine and the screen restyles live while the person chooses. The interface is in **English, Hindi and Telugu** (Hindi and Telugu are not native-reviewed). Settings are saved on the device.

Home has five tiles `[unit test]` (layout) / `[code only]` (screen):

- **Watch**: a labelled **demo panel** with sample captions. No real video.
- **Family**: recent help requests and a "Send a hello" button.
- **Medicines**: a one-press "Did you take your medicine?" check-in, "Yes, I took it". **No timed reminders or schedule.**
- **Help**: "Do you need help?" then a family notification. **Not an emergency call.**
- **Settings**: needs, language, scanning speed, Family notifications, Reset.

Family, Medicines and Help send one short, generic message ("Help was requested from the TV at HH:MM") through the public service **[ntfy.sh](https://ntfy.sh)** to a phone running the ntfy app. There is no Thodu TV server. **Anyone who knows the topic name can read the messages**, so every user and judge should use the random topic their own TV generates (Settings > Family notifications). "Family notified" appears only after ntfy.sh answers with an HTTP 2xx `[unit test]`. Until a test message has succeeded the buttons say "Demo: nobody was told" and nothing leaves the TV `[code only]`. Details: [docs/PRIVACY_AND_SAFETY.md](docs/PRIVACY_AND_SAFETY.md).

## 60-second path

1. Get `thodu-tv-ff5e452-judge.apk` (topic-free demo build; link on the Devpost page; SHA-256 in [docs/JUDGES.md](docs/JUDGES.md)).
2. `adb connect <tv-ip>:5555` then `adb install -r thodu-tv-ff5e452-judge.apk` (Fire TV: enable ADB debugging first).
3. `adb shell monkey -p com.thodu.tv -c android.intent.category.LEANBACK_LAUNCHER 1`
4. Choose "Easier remote", Continue, open **Help** > Tell my family: you see the labelled demo result. To see a real message, follow "Try the notifications" in docs/JUDGES.md.

No device? Run the tests (below) and read [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md): its numbers come from scripts you can re-run.

## Status: what is real, what is not

| Part | Status | Tag / evidence |
|---|---|---|
| Needs to settings, themes, scanner, persistence, strings, notification sender | Implemented, tested by 212 unit tests | `[unit test]` |
| Contrast, text sizes, label coverage | Measured: 73 colour pairs 0 below target, lowest text 7.79:1, smallest text 22 design px, 25 of 25 focusable elements labelled | `[script]` `node tools/a11y-measure.mjs`, `[unit test]` |
| APK is a valid Fire TV / Android TV app (leanback launcher, touchscreen not required, banner, minSdk 24, no Google Play Services) | Checked in the built APK | `[APK static]` |
| Runs on a real Amazon Fire TV | Started once on an Amazon cloud device on 2026-10-14 with an **older build**; the recordings do not show the device frame, so they do not prove a Fire TV by themselves. **The current build has not been run there yet.** | `[cloud Fire TV, 2026-10-14, older build]` |
| Onboarding, language switch, high contrast, D-pad, Settings | Verified on the developer's TV (Sony TV, Android TV, **not** a Fire TV), with a 4-tile build | `[real Android TV, Sony, user-reported]` |
| Medicines tile and real Family / Medicines / Help notifications on a TV | Logic unit-tested with a fake network; **not run on a TV** | `[unit test]`, `[not tested]` |
| A real HTTP POST reaching ntfy.sh | Done from a PC on 2026-10-18 (HTTP 200, read back by polling) | PC run, not the TV app |
| Delivery to a phone from the TV | Not verified | `[not tested]` |
| Watch screen and captions | Demo panel, scripted captions, no real video | `[code only]` |
| VoiceView / TalkBack | Detection and routing unit-tested; **no session with a screen reader** | `[unit test]`, `[not tested]` |
| Hindi and Telugu text and speech | Written by the developer; not native-reviewed | `[not tested]` |
| Tested with users | **No.** A session is planned for 2026-10-19; see [docs/USER_TESTING.md](docs/USER_TESTING.md) | NOT YET DONE |
| Fire TV certified / Appstore approved | **No.** Not submitted. | Not claimed |
| Cold start | Median 1351 ms on an x86 TV emulator; not a Fire TV number | `[emulator]` |

## Screenshots

All from the Android TV **emulator** (Android 14 TV image, 1920x1080), captured 2026-10-12 on earlier builds (Home then had four tiles; the Family screen shows the old simulated phone card). They are not from a Fire TV.

| | |
|---|---|
| ![Setup](docs/screenshots/01-setup-needs.png) Needs-based setup (emulator, 2026-10-12) | ![Home](docs/screenshots/02-home-sunrise.png) Home, default Sunrise theme (emulator, 2026-10-12) |
| ![High contrast](docs/screenshots/03-home-high-contrast.png) High-contrast, large text (emulator, 2026-10-12) | ![Scanning](docs/screenshots/04-scanning-highlight.png) Scanning highlight and hint (emulator, 2026-10-12) |
| ![Hindi](docs/screenshots/05-home-hindi.png) Home in Hindi (emulator, 2026-10-12) | ![Captions](docs/screenshots/06-watch-captions-demo.png) Watch demo panel with caption bar (emulator, 2026-10-12) |
| ![Help sent](docs/screenshots/07-help-sent.png) Help sent, real mode, ntfy answered 2xx (emulator, 2026-10-12) | ![Help failed](docs/screenshots/08-help-failed-honest.png) Help failed, offline simulated (emulator, 2026-10-12) |

## Tests

**212 unit tests in 15 suites, all passing** (re-run 2026-10-18; Jest, pure logic in `packages/shared/src/core`, no device needed):

```bash
corepack yarn workspaces focus @thodu/expotv   # once, at the repo root
cd packages/shared
npx jest -c jest.core.config.js                # or, from the repo root: corepack yarn test
```

Suites: theme 65, notify 27, familyAlert 19, persist 18, scanner 16, simpleText 13, adapt 12, a11y 9, strings 8, helpEvents 7, a11yCoverage 5, captions 4, speech 4, buttonIcons 3, secrets 2. The screens have no automated UI tests. Type-check: `../expotv/node_modules/.bin/tsc --noEmit -p .` inside `packages/shared` (0 errors); the app package needs a path-mapped temporary tsconfig, see [docs/JUDGES.md](docs/JUDGES.md) "Run from source".

Tools: `node tools/a11y-measure.mjs` (contrast, text sizes, label coverage; no device), `tools/a11y-audit.mjs`, `tools/cold-start.mjs`, `tools/security-check.mjs` (these three need `ANDROID_HOME` and an emulator).

## Setup and run from source

Followed from a fresh clone on Windows. Prerequisites:

- Windows 11, Node.js 24 (includes Corepack). Yarn 4.5.0 is pinned; there is no global `yarn`, so run `corepack yarn ...`.
- **JDK 17** (Eclipse Temurin 17). Android Studio's bundled JDK 25 failed in the Android Gradle plugin prefab step.
- Android SDK platform 36, NDK 27.1.12297006 and CMake 3.22.1 (the versions our SDK had; a machine without them was not tested). For an emulator we used an Android TV image (API 34, x86).
- Expo SDK 55, react-native-tvos 0.83.6-0, Gradle 9.0.0 (downloaded by the build).
- **A short repo path** (about 15 characters or fewer, for example `D:\t`). Longer paths made the native build fail with "Filename longer than 260 characters".
- An internet connection for the whole build.

```bash
# 1. dependencies (repo root)
corepack yarn workspaces focus @thodu/expotv

# 2. generate the git-ignored native Android project (sets EXPO_TV=1); applies the three ABIs,
#    low-memory Gradle settings and a versionName of "1.0.0+<git sha>".
#    Optional: THODU_BUILD_LABEL=judge adds "-judge" to versionName.
corepack yarn expotv:prebuild

# 3. release build (the JS bundle is embedded; no Metro needed). Point JAVA_HOME at JDK 17 and
#    ANDROID_HOME at the Android SDK first, for example in Git Bash:
export JAVA_HOME='<folder of JDK 17>'
export ANDROID_HOME='<folder of the Android SDK>'
cd packages/expotv/android
./gradlew assembleRelease
#    Result: app/build/outputs/apk/release/app-release.apk (universal, about 68 MB)

# 4. install and launch on a running emulator or TV
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell monkey -p com.thodu.tv -c android.intent.category.LEANBACK_LAUNCHER 1
```

**Notification topic.** A source build has **no topic** and starts in demo mode. To bake in your own, copy `packages/expotv/.env.example` to `packages/expotv/.env.local` (git-ignored) and set `EXPO_PUBLIC_THODU_TOPIC` (format and warning inside the file). Otherwise create one on the TV in Settings > Family notifications.

**Build notes.** The first full three-ABI build took about 41 minutes on a low-memory PC (27.5 minutes until a network error ended it, then 13.8 minutes on a re-run that reused finished tasks). After editing JS in `packages/shared`, run the Gradle task `:app:createBundleReleaseJsAndAssets --rerun` or Gradle may ship stale JavaScript. For an x86-only emulator build add `-PreactNativeArchitectures=x86`. The release build is signed with the debug keystore, fine for a demo only. The three ARM libraries were verified present in the APK; the universal APK has run only on an x86 emulator, the developer's Sony TV running Android TV (a build before the latest), and the cloud device above. Putting the APK on a TV: [docs/INSTALL_ON_TV.md](docs/INSTALL_ON_TV.md). Our list of tool problems: [FRICTION_LOG.md](FRICTION_LOG.md).

## Architecture

- Yarn 4 workspaces monorepo: `packages/expotv` (Expo TV app shell, routes in `app/`) and `packages/shared` (all app code).
- `packages/shared/src/core`: pure TypeScript with no React Native imports, so Jest tests it: needs to settings (`adapt.ts`), themes and contrast (`palette.ts`, `theme.ts`, `contrast.ts`), scanner state machine (`scanner.ts`), persistence (`persist.ts`), ntfy client and the shared alert sender (`notify.ts`), screen-reader and font-scale rules (`a11y.ts`, `speech.ts`), strings in `en`, `hi`, `te`.
- `settings/` (provider, AsyncStorage injected), `scan/ScanScope.tsx` (scans every focusable item; one invisible focus sink keeps Android delivering remote keys), `components/` (the one `Focusable` button with ring and labels), `screens/`.
- Notification path: Help / Family / Medicines -> `sendFamilyAlert` (HTTPS POST to ntfy.sh, 8 s timeout, one retry, 3 s debounce) -> result shown honestly. No backend, no analytics, no accounts.
- Navigation: expo-router stack, no animation; Back pops the stack and on Home leaves the app.

## Limitations

- The current build has not run on a Fire TV; the cloud run of 2026-10-14 was an older build without device proof in the recordings.
- No user sessions yet; no VoiceView / TalkBack session; Hindi and Telugu not native-reviewed.
- ntfy.sh is public; anyone who knows the topic can read or post. Delivery to a phone from the TV is not verified.
- The help log is in memory only. Watch is a demo. Back on Home exits to the launcher.
- Release builds use the debug keystore. The dependency audit lists 108 advisories (see [SECURITY.md](SECURITY.md)); nothing was upgraded.
- Sample code from the Amazon starter remains in `packages/expotv` (`components/`, `layouts/`, `hooks/`, `constants/`) but is unused.
- Scanning was proven by an adb run on an earlier build and not re-run on every later build.

## Roadmap (not built)

Timed medicine reminders and a schedule; a voice trigger through Alexa+ for people who cannot use a remote.

## Credits and license

Started from Amazon's [react-native-multi-tv-helloworld](https://github.com/AmazonAppDev/react-native-multi-tv-helloworld) sample (MIT-0, Amazon.com, Inc.); see [NOTICE](NOTICE), [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [docs/PRE_EXISTING.md](docs/PRE_EXISTING.md). `react-native-tvos` is a community fork, not an Amazon product. The icon, launcher banner and splash mark are original artwork (`assets/branding/`, rendered by `tools/make-branding.mjs`); no third-party logos or images are used.

Thodu TV's own code is **MIT**, see [LICENSE](LICENSE).

Docs: [docs/JUDGES.md](docs/JUDGES.md) · [docs/CLAIMS.md](docs/CLAIMS.md) · [docs/DEVICE_EVIDENCE.md](docs/DEVICE_EVIDENCE.md) · [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) · [docs/PRIVACY_AND_SAFETY.md](docs/PRIVACY_AND_SAFETY.md) · [SECURITY.md](SECURITY.md) · [docs/PRE_EXISTING.md](docs/PRE_EXISTING.md) · [docs/USER_TESTING.md](docs/USER_TESTING.md) · [FRICTION_LOG.md](FRICTION_LOG.md) · [docs/PRODUCT_FEEDBACK.md](docs/PRODUCT_FEEDBACK.md) · [submission.md](submission.md)

**Thodu TV is not an emergency service. In an emergency call your local emergency number.**
