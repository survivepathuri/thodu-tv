# Thodu TV: For judges, in 5 minutes
*A TV built for elderly and disabled people that calls the family for help*

*Built for one person, made for many.*

**Thodu TV (తోడు టీవీ; Thodu means "companion" in Telugu)** is a React Native for TV app for older viewers and people with disabilities. It starts from what would make TV easier ("Easier to see / hear / read / remote"), changes the whole interface at once, and lets the viewer tell a family member they need help through the free ntfy app. Demo video (about 2:20): [VIDEO_URL]

> Thodu TV is **not** an emergency service and **not** a medical device. In an emergency call your local emergency number.

Evidence tags (`[unit test]`, `[code only]`, `[cloud Fire TV, ...]`, `[real Android TV, Sony, user-reported]`, `[emulator]`, `[APK static]`, `[script]`) are explained in [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md). Every claim and its proof is in [CLAIMS.md](CLAIMS.md).

## The judge APK: exact facts

| Item | Value |
|---|---|
| File (GitHub Release asset) | `thodu-tv-d52f5fe-judge.apk` |
| Size | 68,382,021 bytes |
| SHA-256 | `6e1ef0ac79f3eda694f65e63b9234baf01b53c845cb6c41ecff55f3daea4331f` |
| `versionName` | `1.0.0+d52f5fe-judge` (`versionCode` 1) |
| Source commit | `d52f5fe` |
| Package / launcher | `com.thodu.tv` / `com.thodu.tv.MainActivity` (leanback launcher) |
| SDK levels | minSdk 24, targetSdk 36 |
| Notification topic | **None.** The build cannot message anyone until you create your own topic. |
| Signing | Debug keystore (fine for a demo only) |

All of the above except the source commit were checked again on 2026-10-23 on the file itself with `sha256sum`, `aapt2 dump badging` and a search of the APK for topic-shaped strings (none found) `[APK static]`.

**Verify the SHA-256 before installing:**

```bash
sha256sum thodu-tv-d52f5fe-judge.apk          # Git Bash / Linux
shasum -a 256 thodu-tv-d52f5fe-judge.apk      # macOS
```
```powershell
Get-FileHash .\thodu-tv-d52f5fe-judge.apk -Algorithm SHA256   # Windows PowerShell
```

**Is the code in the repository the code in the APK?** The APK was built from `d52f5fe`. Every later commit changes documentation only. Check it yourself:

```bash
git diff --name-only d52f5fe..HEAD | grep -v '\.md$'   # expect no output: only .md files changed
git diff --stat d52f5fe..HEAD                          # the list of documentation files
```

Run on 2026-10-23: no file other than `*.md` differs between `d52f5fe` and `HEAD`. A source build is not byte-identical to the judge APK, see "Run from source".

## Fastest checks (no install, 2 minutes)

1. Read the top of [README.md](../README.md) (criteria table, architecture, real / simulated / not-yet table, honest limits).
2. Watch the demo video: [VIDEO_URL].
3. Re-run the tests: `corepack yarn workspaces focus @thodu/expotv`, then `cd packages/shared && npx jest -c jest.core.config.js`. Expected: **16 suites, 223 tests, all passing** `[unit test]`.
4. Re-run the accessibility measurement: `node tools/a11y-measure.mjs` (Node 22.18+ or 24). Expected: 73 colour pairs, 0 below target, lowest text contrast 7.79:1, smallest text 22 design px, 25 of 25 focusable elements labelled `[script]`.

## Install the judge APK

**Fire TV or Android TV with adb (about 3 minutes):**

```bash
# Fire TV: Settings > My Fire TV > Developer Options: turn on "ADB Debugging" and
#   "Apps from Unknown Sources". If Developer Options is hidden, Amazon says to press the
#   D-pad 7 times on Settings > My Fire TV > About > (your device name). Menu names vary by model.
# IP address: Settings > My Fire TV > About > Network.
adb connect <tv-ip>:5555              # accept the prompt on the TV
adb install -r thodu-tv-d52f5fe-judge.apk   # expect "Success"
adb shell monkey -p com.thodu.tv -c android.intent.category.LEANBACK_LAUNCHER 1
```

Thodu TV also appears in the Apps row. Uninstall with `adb uninstall com.thodu.tv`. Turn ADB debugging off when you are done. More detail and troubleshooting: [INSTALL_ON_TV.md](INSTALL_ON_TV.md).

**Fire TV with the Downloader app:** open the APK link from the Release page in Downloader, install, open Thodu TV from Apps.

**No TV at hand:** Amazon Developer Console > Appstore Quality Central > Live Device Interaction lets you upload the APK to a real Amazon Fire TV in the cloud. Sessions last up to 60 minutes and the device can disconnect when idle for more than 15 (Amazon's pages); download recordings and logs before you close the session.

**Android TV emulator:** create an Android TV AVD (Android Studio > Device Manager > Television, for example API 34), start it, then run the `adb install` and `adb shell monkey` lines above. Use the keyboard arrow keys, Enter (Select) and Esc/Backspace (Back). The universal APK includes an x86 build `[APK static]`.

## What to test in 5 minutes

First launch shows the setup screen "What would make TV easier for you?".

| Step | What to do | Expected result | Evidence |
|---|---|---|---|
| 1 | Choose **Easier to see**, then Continue | The screen restyles live: text 1.6x, black/white/yellow high-contrast theme, 10 px focus ring | `[unit test]` `adapt.test.ts`, `theme.test.ts` |
| 2 | Go back to Settings and also choose **Easier to hear**, **Easier to read** | The needs combine. Read-aloud speaks the focused item (needs TV sound; spoken output was not verified on the cloud device) | `[unit test]` `adapt.test.ts`, `speech.test.ts` |
| 3 | Settings > choose **Easier remote** | **One-button scanning**: one item is highlighted at a time (Slow 2600 ms / Normal 1800 ms / Fast 1200 ms); OK chooses it. You can drive the whole app with only the Select key | `[unit test]` `scanner.test.ts` (16 tests) |
| 4 | Change language: EN, हिन्दी, తెలుగు | All labels change language (Hindi and Telugu are not native-reviewed) | `[unit test]` `strings.test.ts` |
| 5 | Home: five tiles **Watch, Family, Medicines, Help, Settings** | One colour per tile, each with a glyph and a label | `[unit test]` `homeLayout`, `[cloud Fire TV]` |
| 6 | **Watch** | A labelled **demo panel** ("Demo panel - no real video") with looping sample captions. No real video player | `[code only]` `WatchDemo.tsx` |
| 7 | **Help**, confirm "Tell my family" | **Demo mode** (this build has no topic): title "This is only a demo. No one has been contacted.", labelled "DEMO - simulated notification"; with **Easier to hear** on, a flashing banner reads "Demo only". "ALERT SENT" / "Your family was told" appear only after a real message got an HTTP 2xx. Nobody is contacted | `[unit test]` `familyAlert.test.ts`, `helpResult.test.ts`, `notify.test.ts` |
| 8 | **Family** > "Send a hello"; **Medicines** > "Yes, I took it" | Both say "Demo: nobody was told. Send a test message in Settings first." Medicines has no schedule and no reminder | `[unit test]` `familyAlert.test.ts` |

## Try the notifications with YOUR OWN topic (optional, 2 minutes)

Thodu TV sends through the public service **ntfy.sh**; there is no Thodu TV server. **Anyone who knows a topic name can read the messages sent to it and post to it**, so use the random name your own TV generates and do not reuse a name from anywhere else.

1. On the TV: Settings > **Family notifications**. Thodu TV generates a random family name (`thodu-xxxx-xxxx-xxxx`) and shows it on screen.
2. On a phone, install the free ntfy app and subscribe to that name. (A command-line way to read a topic is `curl -s "https://ntfy.sh/<your-name>/json?poll=1"`.)
3. On the TV press **Send a test message**. Expected: "Test message sent. Look at the family phone." Thodu TV says this **only after ntfy.sh answered with an HTTP 2xx**; real mode then unlocks.
4. Press Help > Tell my family, Family > Send a hello, or Medicines > Yes, I took it. Expected on the TV: "Family notified" (Help: "Your family was told"); on the subscribed phone a short generic message such as "Help was requested from the TV at HH:MM". No names, addresses or health data are sent.
5. Failure text (no internet, slow connection, ntfy refused) is shown honestly in English, Hindi and Telugu. Repeat presses of the same button within 3 seconds after a success are ignored.

Evidence: sender logic, one retry, the 3-second debounce and "success only on 2xx" are `[unit test]` with a fake network (`notify.test.ts`, `familyAlert.test.ts`). Delivery from a TV to a phone was seen on 2026-10-20 on the developer's home Sony Android TV with a build of the same code and a private topic, in a consented family session (several real Help alerts reached the family phone through ntfy) `[real Android TV, Sony, user-reported]`. It was **not** tested with the judge build or on a Fire TV.

## Run from source

**Use Git Bash for every command, and clone to a very short path (about 15 characters, e.g. `C:\t`).** A long path such as one inside a user's Documents folder fails the native build after about 13 minutes (F-016, [FL-03](FRICTION_LOG.md)). Full steps (JDK 17, Android SDK, short repo path) are in the [README](../README.md#run-from-source). In short:

```bash
corepack yarn workspaces focus @thodu/expotv
corepack yarn expotv:prebuild                # generates the git-ignored android/ folder
cd packages/expotv/android && ./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

A first release build takes about 30 to 40 minutes on the developer's Windows laptop (first build, no warm Gradle cache), so most reviewers should use the APK. The `versionName` of a source build is `1.0.0+<your HEAD sha>`, so it will not match `1.0.0+d52f5fe-judge`. The judge APK was built with `EXPO_PUBLIC_THODU_TOPIC` set to an empty string; a plain source build leaves it unset; behaviour is the same (demo mode).

**Source build vs shipped APK** `[measured, 2026-10-19, on an earlier judge build]`: a clean clone built from the README gives an APK whose package, versionCode, label, SDK levels, permissions, TV banner entry and signer match. The versionName differs because it includes the git sha. The native libraries, the baseline profile and 40 bytes of the Hermes JS bundle differ in bytes; we have not traced why. We do not claim the two APKs are byte-identical.

**Type-check** (no device needed):

```bash
# 1. Shared package (all app logic and screens): 0 errors
cd packages/shared && ../expotv/node_modules/.bin/tsc --noEmit -p .
# 2. App package: plain tsc reports 27 errors, mostly from module resolution (see below).
cd ../expotv && ./node_modules/.bin/tsc --noEmit -p .
# 3. App package with a temporary path-mapped tsconfig: 9 errors, all in unused Expo starter-template files
printf '{"extends":"./tsconfig.json","compilerOptions":{"baseUrl":".","paths":{"@/*":["./*"],"react-native":["./node_modules/react-native"],"react":["./node_modules/@types/react"],"react/*":["./node_modules/@types/react/*"]}}}' > tsconfig.check.json
./node_modules/.bin/tsc --noEmit -p tsconfig.check.json
rm tsconfig.check.json
```

Numbers measured on 2026-10-23. Why plain `tsc` in `packages/expotv` fails: the root `package.json` marks `react`, `react-native` and friends `nohoist`, so they are installed only in `packages/expotv/node_modules`. The shared sources under `packages/shared/src` are imported by the app but resolve bare imports from their own folder, which has no `react-native` and its own `@types/react`. That is the install layout, not a code problem; the path mapping points both at the app's copy. With it, `packages/shared/src` and `packages/expotv/app` type-check clean and the 9 remaining errors are in starter-template files that no screen imports (`components/EventHandlingDemo.tsx`, `components/ParallaxScrollView.tsx`, `hooks/useThemeColor.ts`, `layouts/TabLayout.tsx`, `layouts/TabLayout.web.tsx`). We left them alone. `expo lint` does not run (ESLint is not installed), so no lint result is claimed.

Optional: to bake **your own** topic into a source build, copy `packages/expotv/.env.example` to `packages/expotv/.env.local` and set `EXPO_PUBLIC_THODU_TOPIC` to `thodu-` followed by 3 or 4 groups of 4 random characters from `a-z` and `2-7`. Leave it empty for a topic-free build.

## Troubleshooting

| Problem | What to do |
|---|---|
| `adb connect` times out | TV and PC on the same network; ADB debugging on; some devices need the setting switched off and on |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | A Thodu TV with a different signer is installed: `adb uninstall com.thodu.tv` (erases its saved choices) |
| `INSTALL_FAILED_NO_MATCHING_ABIS` | Use the universal APK (arm64-v8a, armeabi-v7a, x86) |
| App starts in the middle of setup | Settings > Reset Thodu TV, then start again |
| "Send a test message" says it could not send | Check internet on the TV; ntfy.sh must be reachable over HTTPS |
| Hindi/Telugu text looks odd | Strings were written by the developer and are not native-reviewed |
| Source build fails with "Filename longer than 260 characters" | Use a very short repo path such as `D:\t` |
| `yarn` not found | Use `corepack yarn ...` (Node 22+ includes Corepack) |

## What each tile does (and does not do)

- **Watch:** demo panel with sample captions. No real video, no streaming, no voice or speech recognition.
- **Family:** recent help requests (in memory only) and a simulated phone card labelled "Simulated"; "Send a hello" notifies the family phone in real mode.
- **Medicines:** a one-press "Yes, I took it" check-in that notifies the family in real mode. **No timed reminders and no medicine schedule exist.**
- **Help:** confirmation, then a family notification (demo or real). **Not an emergency call.**
- **Settings:** needs, language, scanning speed, Family notifications, Reset.

## Where the evidence lives

| What | Where |
|---|---|
| Claim to evidence table | [CLAIMS.md](CLAIMS.md) |
| Devices, Fire TV readiness | [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md) |
| Accessibility numbers | [ACCESSIBILITY.md](ACCESSIBILITY.md), `tools/a11y-measure.mjs` |
| Privacy and safety | [PRIVACY_AND_SAFETY.md](PRIVACY_AND_SAFETY.md), [../SECURITY.md](../SECURITY.md) |
| What existed before and what the sample provided | [PRE_EXISTING.md](PRE_EXISTING.md) |
| The one family session | [USER_TESTING.md](USER_TESTING.md) |
| Friction log and Amazon product feedback | [FRICTION_LOG.md](FRICTION_LOG.md), [../FRICTION_LOG.md](../FRICTION_LOG.md), [PRODUCT_FEEDBACK.md](PRODUCT_FEEDBACK.md) |
| Submission checklist | [../submission.md](../submission.md) |

## Honest limits

The judge build runs in demo mode (no topic). Fire TV evidence is Amazon cloud-device footage; the only physical-TV run was one home Sony Android TV, which is not a Fire TV. One consented family session (n = 1), no study. The notification topic works like a password and is not authentication; ntfy.sh is public. Spoken output was not verified in the cloud recording; VoiceView/TalkBack were not run; Hindi/Telugu not native-reviewed. `packages/expotv` shows type errors (27 plain, 9 with path mapping). No timed reminders, no real video, no voice recognition. Not Appstore certified or submitted.

The repository, the Release and the demo video stay public and unchanged until the end of judging (2026-11-20), apart from adding the demo-video link once the video is uploaded.
