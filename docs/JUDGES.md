# Thodu TV: For judges, in 3 minutes
*A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.*

**Thodu TV (తోడు టీవీ; Thodu means "companion" in Telugu)** is an Android TV / Fire TV app for older viewers and people with disabilities. It starts from what would make TV easier ("Easier to see / hear / read / remote") and changes the whole interface at once. Three buttons (Family, Medicines, Help) can tell a family member through a public notification service.

> Thodu TV is **not** an emergency service and **not** a medical device. In an emergency call your local emergency number.

Evidence tags (`[unit test]`, `[code only]`, `[cloud Fire TV, ...]`, `[real Android TV, Sony, user-reported]`, `[emulator]`, `[not tested]`) are explained in [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md). Every claim and its proof is in [CLAIMS.md](CLAIMS.md).

## The fastest path (no install): 2 minutes

1. Read the top of [README.md](../README.md) (problem, status table).
2. Look at the screenshots in the README (Android TV emulator, 2026-10-12) and watch the demo video (link on the Devpost page).
3. Re-run the tests: `corepack yarn workspaces focus @thodu/expotv` then `cd packages/shared && npx jest -c jest.core.config.js`. Expected: **15 suites, 212 tests, all passing** `[unit test]`.
4. Re-run the accessibility measurement: `node tools/a11y-measure.mjs` (Node 22.18+ or 24; prints contrast ratios, text sizes, label coverage).

## Install the judge APK on a Fire TV (about 5 minutes)

The judge build is **topic-free**: it contains no notification topic, so it can never message anyone until you create your own (see "Try the notifications"). File: `thodu-196f20a-judge.apk`, 68,356,621 bytes, SHA-256 `947b2bc9e6165146bc4f6b2c28b0cb8223f4d008aed02455ac9f841f257f540c`. Download link: on the Devpost submission page (not in this repository). The APK is signed with a debug key, which is fine for a demo. It was built from commit `196f20a`; later commits only change documentation, tests, tools, the versionName plugin and one English string in the simple-wording mode ("Easy words, icons, read aloud"), so the app text in that one mode differs slightly from the source.

```bash
# 1. Fire TV: Settings > My Fire TV (or Device) > Developer Options: turn on "ADB Debugging" and
#    "Apps from Unknown Sources". If Developer Options is hidden, Amazon says to press the D-pad
#    7 times on Settings > My Fire TV > About > (your device name).
#    Source: Amazon, "Connect to Fire TV through ADB". Menu names vary by Fire OS version.
# 2. Find the IP address: Settings > My Fire TV > About > Network.
adb connect <fire-tv-ip>:5555        # accept the prompt on the TV
adb install -r thodu-196f20a-judge.apk   # expect "Success"
adb shell monkey -p com.thodu.tv -c android.intent.category.LEANBACK_LAUNCHER 1
```

Thodu TV also appears in the Apps row. Uninstall with `adb uninstall com.thodu.tv`. More detail and troubleshooting: [INSTALL_ON_TV.md](INSTALL_ON_TV.md). Turn ADB debugging off when you are done.

**No Fire TV at hand?** Amazon Developer Console > Appstore Quality Central > Live Device Interaction lets you upload the APK to a real Amazon Fire TV in the cloud. The developer used this on 2026-10-14 with an older build `[cloud Fire TV, 2026-10-14, older build]`; the current build has not yet been run there (see DEVICE_EVIDENCE.md).

## Install in an emulator

Create an Android TV AVD (Android Studio > Device Manager > Television, for example API 34), start it, then:

```bash
adb install -r thodu-196f20a-judge.apk
adb shell monkey -p com.thodu.tv -c android.intent.category.LEANBACK_LAUNCHER 1
```

Use the keyboard arrow keys, Enter (Select) and Esc/Backspace (Back) in the emulator window. The universal APK includes an x86 build `[APK static]`; earlier builds ran on an x86 TV emulator `[emulator]`.

## Run from source

Full Windows steps (JDK 17, Android SDK, short repo path) are in the [README](../README.md#setup-and-run-from-source). In short:

```bash
corepack yarn workspaces focus @thodu/expotv
corepack yarn expotv:prebuild                # generates the git-ignored android/ folder
cd packages/expotv/android && ./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

Optional: to bake **your own** notification topic into a source build, copy `packages/expotv/.env.example` to `packages/expotv/.env.local` and set `EXPO_PUBLIC_THODU_TOPIC` to `thodu-` followed by 3 or 4 groups of 4 random characters from `a-z` and `2-7` (for example `thodu-` then `xxxx-xxxx-xxxx` with your own letters). Leave it empty for a topic-free build. The first full build took about 41 minutes on the developer's low-memory PC (see README), so the APK is the easier route.

## What you will see (demo path, 3 minutes)

First launch shows the setup screen "What would make TV easier for you?".

| Step | What to do | Expected result | Evidence |
|---|---|---|---|
| 1 | Choose **Easier to see**, then Continue | The screen restyles live: text 1.6x, black/white/yellow high-contrast theme, 10 px focus ring | `[unit test]` `adapt.test.ts`, `theme.test.ts`; theme switch seen on `[real Android TV, Sony, user-reported]` (older build) |
| 2 | Change language: EN, हिन्दी, తెలుగు | Labels change language | `[unit test]` `strings.test.ts` (same keys); switch seen on `[real Android TV, Sony, user-reported]`. Hindi/Telugu not native-reviewed |
| 3 | Home: five tiles **Watch, Family, Medicines, Help, Settings** | One tile per colour, each with a glyph and a label | `[unit test]` `homeLayout`; `[emulator]` screenshots 02, 03 (earlier builds had four tiles) |
| 4 | **Watch** | A labelled **demo panel** ("Demo panel - no real video") with looping sample captions. There is no real video player | `[code only]` `WatchDemo.tsx`; `[unit test]` `captions.test.ts` |
| 5 | Settings > choose **Easier remote** | **One-button scanning**: one item is highlighted at a time (Slow 2600 ms / Normal 1800 ms / Fast 1200 ms); Select (OK) chooses | `[unit test]` `scanner.test.ts` (16 tests); `[emulator]` ENTER-only adb run on an earlier build |
| 6 | **Help**, then "Tell my family" | **Demo mode** (no topic yet): "Your family was told (demo)", labelled "DEMO - simulated notification". Nobody is contacted | `[unit test]` `familyAlert.test.ts`, `notify.test.ts`; device run of this build `[not tested]` |
| 7 | **Family** > "Send a hello" | "Demo: nobody was told. Send a test message in Settings first." | `[unit test]` `familyAlert.test.ts` |
| 8 | **Medicines** > "Yes, I took it" | Same demo text. "Not yet" simply goes back; there is no schedule and no reminder | `[unit test]` `familyAlert.test.ts` |

## Try the notifications with YOUR OWN topic (optional, 2 minutes)

Thodu TV sends notifications through the public service **ntfy.sh**. There is no Thodu TV server. **Anyone who knows a topic name can read the messages sent to it and can post to it**, so use the random name your own TV generates and do not reuse a name from anywhere else.

1. On the TV: Settings > **Family notifications**. Thodu TV generates a random family name (`thodu-xxxx-xxxx-xxxx`) and shows it on screen.
2. On a phone or computer, subscribe to that name: install the free ntfy app and subscribe, or follow ntfy's own instructions for its website. (We did not test ntfy's web app. A command-line check that we did run, from a PC, is `curl -s "https://ntfy.sh/<your-name>/json?poll=1"`.)
3. On the TV press **Send a test message**. Expected: "Test message sent. Look at the family phone." Thodu TV says this **only after ntfy.sh answered with an HTTP 2xx status**; real mode then unlocks.
4. Press Help > Tell my family, Family > Send a hello, or Medicines > Yes, I took it. Expected on the TV: "Family notified" (Help: "Your family was told"); on the subscribed device a short generic message such as "Help was requested from the TV at HH:MM", "A hello from the TV at HH:MM" or "Medicine was confirmed on the TV at HH:MM". No names, addresses or health data are sent.
5. Failure text (no internet, slow connection, ntfy refused) is shown honestly in English, Hindi and Telugu: for Help "We could not reach your family. Please call them."; for the others "Could not send. Try again." Repeat presses of the same button within 3 seconds after a success are ignored (a held remote key does not spam).

Evidence: the sender logic, retry, 3-second debounce and "success only on 2xx" are `[unit test]` with a fake network (`notify.test.ts`, `familyAlert.test.ts`). A real POST from the developer's PC reached ntfy.sh with HTTP 200 and was read back by polling (2026-10-18). **Delivery from the TV app to a phone has not been verified on a real TV or phone** `[not tested]`.

## Troubleshooting

| Problem | What to do |
|---|---|
| `adb connect` times out | TV and PC on the same network; ADB debugging on; some devices need the setting switched off and on |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | An older Thodu TV with a different signer is installed: `adb uninstall com.thodu.tv` (erases its saved choices) |
| `INSTALL_FAILED_NO_MATCHING_ABIS` | Use the universal APK (arm64-v8a, armeabi-v7a, x86) |
| App starts in the middle of setup | Settings > Reset Thodu TV, then start again |
| "Send a test message" says it could not send | Check internet on the TV; ntfy.sh must be reachable over HTTPS |
| Hindi/Telugu text looks odd | Strings were written by the developer and are not native-reviewed |
| Source build fails with "Filename longer than 260 characters" | Use a very short repo path such as `D:\t` |
| `yarn` not found | Use `corepack yarn ...` (Node 22+ includes Corepack) |

## What each tile does (and does not do)

- **Watch:** demo panel with sample captions. No real video, no streaming, no voice or speech recognition.
- **Family:** recent help requests (in memory only) and a simulated phone card labelled "Simulated"; "Send a hello" notifies the family phone in real mode.
- **Medicines:** a one-press "Yes, I took it" check-in that notifies the family in real mode. **No timed reminders and no medicine schedule exist** (roadmap only).
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
| User testing (not yet done) | [USER_TESTING.md](USER_TESTING.md) |
| Friction log and Amazon product feedback | [../FRICTION_LOG.md](../FRICTION_LOG.md), [PRODUCT_FEEDBACK.md](PRODUCT_FEEDBACK.md) |
| Submission checklist | [../submission.md](../submission.md) |

## Honest limits

No Fire TV run of the current build yet; no tested user sessions; no real VoiceView/TalkBack run; Hindi/Telugu not native-reviewed; no timed reminders; no voice recognition; not Appstore certified; ntfy.sh is public, so anyone who knows the topic can read the messages.
