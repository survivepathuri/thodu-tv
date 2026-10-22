# Thodu TV: Product Feedback (Build, Ship, Shape)
*Built for one person, made for many.*

Project: Thodu TV (తోడు టీవీ), a Fire TV track app for elderly and disabled users. Format: the five elements the rules ask for, per tool: (1) what we used it for, (2) what worked well, (3) what needs work, (4) onboarding (zero to hello world), (5) would we build with it again, yes or no, and why. 13 entries: 1 to 3 are Amazon-provided, 4 to 12 are the other main tools, 13 is tools outside the repository.

**Evidence rule.** Every statement comes from `FRICTION_LOG.md` (F-001..F-033, written 2026-10-11 and 2026-10-12; F-034 and F-035, reported by the developer on 2026-10-18, and F-036 to F-040, reported on 2026-10-23 as first-hand facts from the 2026-10-22/23 recording session, all tagged [user-reported]), from the files of the 2026-10-14 Amazon cloud-device session, from the Amazon documentation pages read on 2026-10-18, or from package metadata in the repository. Where nothing was recorded the text says "not recorded". Time-lost values are the estimates written in the log at the time. Severity ratings are ours, not Amazon's. **The "Build with it again?" answers are the developer's own words**, given on 2026-10-19 in Telugu or Tenglish and translated to English with only grammar fixed; the original wording was not kept in the repository. Entries 11 and 13 are not answered yet and say so.

**Environment.** Windows 11 Pro (build 22621), solo developer, React Native + Expo (react-native-tvos), Android TV emulator (Android 14 TV image, x86) for development; one Amazon cloud Fire TV session on 2026-10-14; the developer's own Sony TV (Android TV, not a Fire TV) for home checks.

**Amazon tools used:** (1) the Amazon react-native-multi-tv-helloworld sample; (2) Appstore Quality Central Live Device Interaction; (3) Amazon Fire TV developer documentation. **Thodu TV uses no AWS service.** **Not used:** Vega SDK, Amazon Appstore submission, Alexa+ tooling, Amazon Devices Builder Tools (MCP server and Agent Skills), Kiro, any AWS service (no Bedrock or SNS calls), VoiceView on a device. We therefore do not enter the AWS Builder mini challenge.

**Everything else.** Beyond the entries below, about 790 other npm packages are pulled in transitively and were not individually reviewed. The full list of direct dependencies is in `docs/TECH_STACK.md`.

Each block is self-contained so it can be pasted into one text box.

---

# Part A: Amazon-provided tools

## 1. Amazon react-native-multi-tv-helloworld sample

**What we used it for.** The base of the Thodu TV app: an Expo 55.0.24 / react-native-tvos 0.83.6-0 / React 19.2.0 / Gradle 9.0.0 Yarn 4 monorepo, built for Android TV only [F-015, F-017]. Some dependencies and assets came with the sample and are not used by the current app: lottie-react-native, @expo/vector-icons, expo-system-ui, expo-status-bar, react-native-web, expo-constants, ts-jest, `assets/tv_icons`, `assets/images` and the SpaceMono font. They are inherited from the Amazon sample (present in our import commit 35bb725); we did not remove or change any dependency.

**What worked well.** With JDK 17 it built (x86 only, 19m 1s, 37 MB APK), launched, took D-pad keys, moved focus and showed a fetched joke [F-017]. The crash from the other starter did not happen here [F-014, F-017]. `yarn workspaces focus @multitv/expotv` installed from the lockfile in 2m 45s [F-015].

**What needs work.**
- No README note on the Windows 260-character path limit. The first build failed after about 13 min (`ninja: error: ... Filename longer than 260 characters`); LongPathsEnabled=1 did not help, a very short clone path did. About 35 min lost [F-016].
- No "Android TV only (no Vega)" section; the lockfile has `@amazon-devices/*` packages (~5 min) [F-015].
- The Expo bundle task showed UP-TO-DATE after we edited packages/shared and shipped stale JavaScript. We now force `--rerun`. About 25 min lost [F-024].
- packages/shared jest fails with `Cannot find module 'react-native/jest-preset'`; the sample's scaling test never ran [F-022].
- No `typescript` in packages/expotv and no note on Yarn 4 on PATH [F-023, F-031].

**Our own mistake, not Amazon's.** We deleted `TabLayout.web.tsx` assuming it was web-only; the bundle failed with `Unable to resolve module ./TabLayout.web`. About 15 min lost. A one-line comment in `TabLayout.tsx` would have prevented it [F-020].

**Onboarding (zero to hello world).** Total not recorded. Pieces: ~5 min finding the install route [F-015]; a failed ~13 min build [F-016]; a 19m 1s build [F-017].

**Build with it again?** Yes. The developer's words: "It was easy for us, so I would use it again." (The fixes in "What needs work" would still help.)

## 2. Appstore Quality Central, Live Device Interaction (real Amazon Fire TV devices in the cloud)

**What we used it for.** Running the Thodu TV APK on Amazon Fire TV devices in the cloud (Amazon Developer Console > Appstore Quality Central > Live Device Interaction) to see the app on Amazon hardware. One session on 2026-10-14 (user-reported) produced three screen recordings (about 2:00, 2:00 and 1:43, 1920x1080). The device names the developer saw in the console were "FOS 14 3P TV" and "Smart TV - Amazon Fire TV"; the exact model and OS were not captured (we do not assume "FOS 14" means Fire OS 14). The build was older than the current one.

**What worked well.**
- The recordings show the app starting and its Settings, Family and Home screens running on the cloud device. No timings or reliability observations were recorded.
- Installing the 68 MB universal APK on the cloud device worked step by step with no problems, and the app opened [user-reported].

**What needs work.**
- The built-in recording captures only the device screen, with no Amazon UI and no device name, so it cannot by itself prove a Fire TV for the hackathon video [user-reported; F-034]. Evidence: the three 2026-10-14 recordings. Workaround: record the whole browser window with a separate screen recorder. Suggested fix: offer a window-level recording, or burn the device name/model into the capture. Severity: low-medium (our rating).
- The user did not understand at first how to choose between the cloud devices "FOS 14 3P TV" and "Smart TV - Amazon Fire TV", and understood after some time [user-reported; F-035]. Evidence: user statement only. Suggested fix: show the Fire OS version and model clearly in the device list. Severity: low (our rating).
- Recording session of 2026-10-22/23 (first-hand, user-reported; F-036 to F-040; no Fire OS version is claimed; time lost was not timed, so it is "unmeasured"). The Screen-tab recorder shows native browser alerts at Start and End, which a browser-automation extension cannot click (the developer clicked OK by hand); each recording is capped at 2 minutes and the file takes about 45 to 60 seconds to be saved after stopping; leaving the Screen panel (for example to the Remote panel) stops the recording, so the remote buttons cannot be used while recording; the first two attempts produced one-frame files; keyboard arrows and Enter work only after clicking the grey area around the TV picture, Escape and Backspace did not work, and there is about 1 to 2 seconds of picture lag; the session is server-side, so a browser-automation tool could control only the tab in its own tab group; a short home-internet drop disconnected the device. **The developer's suggestions:** a recorder without native alerts; a longer recording cap; recording that continues across panels; a key-send API; lower latency. Workarounds: clicking OK by hand, splitting long takes into parts, clicking the grey area before using keys, reconnecting the device.

**Official session facts (from Amazon's pages, not a friction entry).** Sources: [Appstore Quality Central FAQ](https://www.developer.amazon.com/docs/app-testing/appstore-quality-central-faq.html) and the [Live Device Interaction (physical devices)](https://www.developer.amazon.com/docs/app-testing/live-device-interaction-physical.html) page, read 2026-10-18.
- A session gives "up to 60 minutes" on a device; the device disconnects when it expires (FAQ).
- A device left idle for more than 15 minutes can disconnect (Live Device Interaction page: "Leave the device idle for more than 15 minutes" is under "Don't"; idle "can cause device disconnections").
- Screenshots, videos and logs must be downloaded before closing the session; unsaved artifacts are lost (FAQ and Live Device Interaction page).
- The weekly submission limit (eight automated test submissions per week) does not apply to Live Device Interaction (FAQ).
- The developer remembers a shorter session limit; the documentation does not confirm it. [user-reported, unconfirmed: to be checked against the console timer in the next session]

**Onboarding (zero to hello world).** Not recorded (no steps or time were written down), apart from the APK install noted above [user-reported]. A fresh session with the current judge build is still to be done and will be added here, with the model and OS copied from the console Details tab (it lists name, model, family and OS version). Download the whole-window recording before closing the session.

**Build with it again?** Yes. The developer's words: "I would use it again, including to test my own other apps on a cloud TV. But the recording does not show the device identity, and the device list felt confusing."

## 3. Amazon Fire TV developer documentation (Fire OS pages)

**What we used it for.** On 2026-10-18, as a requirements checklist for the readiness self-check in `docs/DEVICE_EVIDENCE.md`: "Test Criteria for Amazon Appstore Apps", "Add TV Support to an Existing React Native Project (Fire TV)", "Developing for Amazon Fire TV Devices Running Fire OS 14" and "Connect to Fire TV through ADB".

**What worked well.** The test criteria are explicit and testable per item (for example 4.3 D-pad, 4.4 Home, 4.5 Back, 2.11 UI highlighting, the permission list), so each could be checked against the APK. The ADB page gave the Developer Options path, the 7-click hint and the Network screen for the IP address, which we reused in `docs/JUDGES.md`.

**What needs work.** Nothing recorded as a problem. One fact worth knowing, not a fault: the Test Criteria page covers Fire tablets and Fire TV on one page, so a TV-only developer has to pick out groups 1, 2 and 4.

**Onboarding.** Not applicable (documentation read as a checklist, not a project start).

**Build with it again?** Yes. The developer's words: "I read them myself and brainstormed with Claude Code to use them. I would use them again."

---

## Not used

- **Vega SDK:** not used. It is not available on Windows (user-stated). The only mention in our log is that the sample's lockfile contains `@amazon-devices/*` packages for the Vega app and that a full install needs Amazon's Yarn config for Vega; we avoided it with `yarn workspaces focus @multitv/expotv` [F-015]. We did not try the Vega SDK itself.
- **Real Fire TV hardware:** not used. Only the cloud devices in entry 2. **Amazon Appstore submission:** not done. **Amazon Devices Builder Tools (MCP server, Agent Skills):** no record of use. **AWS services:** none.

---

# Part B: Other main tools

## 4. React Native for TV (react-native-tvos), including Android 14 font scaling

**What it is.** react-native-tvos 0.83.6-0 is a full fork of React Native that adds Apple TV and Android TV support, published from the react-native-tvos GitHub organization (MIT license); Amazon's sample builds on it. (Source: its package.json and README in the installed package.)

**What we used it for.** The app runtime (0.83.6-0 inside the sample) for remote-driven UI: focus, TV key events (`useTVEventHandler`), Pressable focus styling [F-017, F-025, F-026], and Text, whose size we make follow the system font size [F-029].

**What worked well.** Focus moved with the D-pad in the unmodified sample [F-017]. Once a focused view existed, 6 of 6 test key presses reached `useTVEventHandler` [F-025]. A shared Text wrapper with our own capped multiplier fixed font scaling [F-029].

**What needs work.**
- `useTVEventHandler` / `onHWKeyEvent` gets no events when no view inside the React root has focus. With every item `focusable={false}`, the log showed zero events after the first screen change and most OK presses were lost (0 of 6 delivered). No error was shown. We read ReactAndroidHWInputDeviceHelper and ReactRootView.dispatchKeyEvent to find the cause and keep one invisible focusable "sink" view. About 35 min lost. This is not documented as far as our log shows [F-025].
- A focus ring drawn as a Pressable border changes layout: at ring width 10 each card grew by 20 px and the setup list no longer fit. We redrew it as an absolutely positioned overlay. About 15 min lost (part of that was a helper-script problem of our own) [F-026].
- Font scaling: with the stock behavior the Home title did not grow and labels grew about 12%; Android 14+ scales large text non-linearly, and our first version also cancelled the OS scale (partly our own mistake). About 8 min plus a 1m 11s rebuild [F-029].
- Starter versions: the Expo 57 / react-native-tvos 0.86 `with-tv` example installed but crashed at start with `Invariant Violation: View config getter callback for component 'RCTText' must be a function`. We did NOT investigate the cause. It may be our own setup or a version mismatch, so this is not evidence of a fault in react-native-tvos or of anything Amazon provides [F-014].

**Onboarding.** Not recorded separately from the sample (see entry 1).

**Build with it again?** Yes. The developer's words: "At first I did not understand how to use the remote buttons; it became clear once I started working with them. I would use it again."

## 5. Expo build tooling: prebuild, config plugins, expo-router, Metro, Hermes

**What we used it for.** Creating, prebuilding and running the TV project, and routing. `expo prebuild` generates the Android project. Config plugins: `@react-native-tvos/config-tv` 0.1.5 (TV manifest entries and banner), `expo-build-properties` (cleartext off, ABIs), `expo-router`, `expo-font`, `expo-web-browser`, and two of our own (`plugins/withLowMemoryGradle.js`, `plugins/withGitVersionName.js`). Metro with TV file extensions; Hermes and the New Architecture come from the prebuild defaults (nobody chose them).

**What worked well.** The focused sample and deep-link routing worked once set up [F-017, F-030]. config-tv and our two plugins produced the manifest we expected (leanback, LEANBACK_LAUNCHER, banner; checked in the generated AndroidManifest.xml). Metro, Hermes and the New Architecture: no friction recorded.

**What needs work.** `npx create-expo-app@latest hello-tv --example with-tv --no-install` failed twice, left a partial folder, and the error path crashed with `TypeError [ERR_INVALID_ARG_TYPE]: The "code" argument must be of type number` hiding the real failure (~10 min, Blocker for that approach) [F-005]. `expo-template-tv` pins react-native-tvos 0.72.4 / Expo 50 alpha / Gradle 8.3 and failed on JDK 25 with `Unsupported class file major version 69` (~25 min) [F-006]. `expo prebuild --clean` overwrote our gradle.properties (~5 min) [F-021]. Deep-linking to a route already on the stack kept the old state (~5 min) [F-030].

**Onboarding.** Not recorded.

**Build with it again?** Yes. The developer's words: "Some problems came up, but we solved them with plugins. I would use it again when needed."

## 6. Expo runtime modules: expo-speech, expo-crypto, expo-font, expo-splash-screen, AsyncStorage, reanimated

**What we used it for.** Read-aloud of screen text (expo-speech, Android text-to-speech); secure random numbers for the notification topic (expo-crypto); loading the font and holding the splash screen until it is ready (expo-font, expo-splash-screen); saving settings on the device (@react-native-async-storage/async-storage); and one warning-configuration call from react-native-reanimated (the animated sample components are unused).

**What worked well.** The speech request logic and the persistence format are unit-tested (`speech.test.ts`, `persist.test.ts`). The developer reports the modules worked correctly [user-reported].

**What needs work.** Read-aloud and saved settings have not been verified on a Fire TV with the current build, and Hindi/Telugu text-to-speech on a TV was not checked. No friction entry was recorded for any of these modules.

**Onboarding.** Not recorded.

**Build with it again?** Yes. The developer's words: "They worked correctly. I would use them again when my projects need them."

## 7. Gradle, JDK 17, Android SDK/NDK and signing

**What we used it for.** All APK builds: Gradle 9.0.0 wrapper with the Android Gradle Plugin, Temurin JDK 17, Android SDK platform 36, NDK 27.1.12297006, CMake, `sdkmanager`, adb. Signing: the APK is signed with the template's generated debug keystore, not a production key; it is a demo build. The generated `build.gradle` points the release build at that keystore.

**What worked well.** With Temurin JDK 17, assembleRelease succeeded (10m 3s for the first x86 build) [F-012]. The SDK install ended with a booting emulator [F-004].

**What needs work.**
- `sdkmanager` split the package id on ";" in PowerShell (`Package system-images not found.`) (~2 min) [F-001]. Command-line tools were not in the SDK folder and Android Studio installed to C: not D: (time not recorded) [F-002].
- Android Studio's bundled JBR (JDK 25) fails in the AGP prefab step: `IllegalStateException: WARNING: A restricted method in java.lang.System has been called` (~20 min, Blocker for that approach) [F-010]. `org.gradle.java.home` with single backslashes fails at startup on Windows [F-013].
- The missing SDK was reported only after 4 min 49 s and 28 tasks [F-032]. One dropped connection failed a 27m 30s multi-ABI build; the re-run took 13m 50s (~28 min) [F-033].
- A leftover daemon followed the first failed build [F-011] and blocked a folder move [F-018]. One DNS failure on Maven Central was a plain retry and not an Amazon issue [F-009].

**Onboarding.** Not recorded.

**Build with it again?** Yes. The developer's words: "Setup and build took a long time for me, but in the end I got the APK. I would use them again." (Signing is part of this entry.)

## 8. Android TV emulator (Android 14 TV image)

**What we used it for.** All development testing ran on an Android TV emulator (Android 14 TV image, `system-images;android-34;android-tv;x86`) [F-003, F-017]. The emulator is not Fire OS; nothing in this entry is evidence about Fire OS behavior. The one Fire TV session is in entry 2.

**What worked well.** The emulator booted (about 180 s first boot) and ran the release APK, D-pad keys and deep links [F-004, F-017, F-030]. It let the developer test without a physical TV [user-reported].

**What needs work.**
- No x86_64 Android TV system image exists for API 31 to 34, only x86 and arm64. A short table in the docs would have saved the search (0 min lost) [F-003].
- The first boot logs `Critical: Failed to load opengl32sw` then falls back to system OpenGL and succeeds. Reads like a failure, is harmless [F-004].
- The TV image is Ethernet-only. `svc wifi/data disable`, an invalid Private DNS host and the legacy `http_proxy` key did not take the device offline, so our failure screen never appeared. What worked: `adb emu network delay 20000` (restore with `network delay none`; clear a proxy with `settings put global http_proxy :0`). About 20 min lost. There is no "test offline" section in the docs we used [F-028].
- `expo run:android --device emulator-5554` was rejected (`Could not find device with name`); the AVD name is needed. About 35 min lost, including a 30 min wait on an empty log from a detached spawn [F-007].

**Onboarding.** Not recorded as a single figure. Our rating of the emulator setup problems is Minor except F-007 (Major) and F-028 (Major).

**Build with it again?** Yes. The developer's words: "The offline test was a problem, but it helped me test without a physical TV. I would use it again if needed."

## 9. Yarn 4, Corepack and Node.js

**What we used it for.** The monorepo install: Yarn 4.5.0 through Corepack, `nodeLinker: node-modules`, Node.js 24.

**What worked well.** The focused install from the lockfile (2m 45s) [F-015]. A final clean install took about 80 seconds [user-reported].

**What needs work.** `yarn` was not on PATH although `packageManager` pins Yarn 4; the error did not mention Corepack, and `corepack yarn` fixed it (~3 min) [F-031]. Yarn wrote yarn.lock with CRLF on Windows [F-021].

**Onboarding.** Not recorded.

**Build with it again?** Yes. The developer's words: "Global yarn was not installed so I had to use Corepack, and a CRLF lockfile problem on Windows cost some time, but a final clean install took only about 80 seconds. I would use it again."

## 10. Jest (unit tests)

**What we used it for.** 223 tests in 16 files for the core logic (`packages/shared`, `jest.core.config.js`, babel-jest). The sample's React Native preset configuration (`jest.config.js`, script `test:rn`) is not part of `yarn test`. The developer ran the tests by having Claude Code run them [user-reported]. ts-jest came with the sample and is installed but not used.

**What worked well.** The core tests run and pass without a device.

**What needs work.** The sample's jest preset failed with `Cannot find module 'react-native/jest-preset'`, so the sample's scaling test never ran [F-022].

**Onboarding.** Not recorded.

**Build with it again?** Yes. The developer's words: "I used it by having Claude Code run the tests. I would use it again."

## 11. ntfy.sh (public notification service, the one runtime API)

**What we used it for.** The family message from Help, Family and Medicines: the app sends one HTTPS POST per alert of a short generic text to `https://ntfy.sh/<topic>` (`notify.ts`).

**What worked well.** The sender's success, failure, timeout and retry paths are unit-tested with a fake network. End-to-end delivery worked once: on 2026-10-20 several real Help alerts sent from the developer's home Sony Android TV reached the family phone through the ntfy app [user-reported; `docs/USER_TESTING.md`]. No recording is kept in the repository.

**What needs work (from ntfy's own pages, read 2026-10-19; see `docs/PRIVACY_AND_SAFETY.md`).** Topics are public and act as a password, messages are cached for 12 hours by default, and availability is best effort.

**Onboarding.** Not recorded.

**Build with it again?** No answer from the developer is recorded for this entry, so none is stated.

## 12. Claude Code (AI coding tool)

**What we used it for.** Writing and reviewing code and documentation, running tests and builds (`docs/PRE_EXISTING.md` lists how many commits carry a co-author trailer).

**What worked well.** The developer found it useful [user-reported].

**What needs work.** It sometimes drifts into hallucination, so it needs very strict, clear prompts [user-reported]. Its shell tool cut off heredocs on Windows [F-027]; this is not counted against any other tool above.

**Onboarding.** Not recorded.

**Build with it again?** Yes. The developer's words: "It was useful, but it sometimes drifts into hallucination, so it needs very strict, clear prompts. I will keep using it that way."

---

# Part C: Tools outside the repository

## 13. Outside tools

**Used (confirmed by the developer, 2026-10-19):** the device's built-in screen recorder; the Downloader app; Google Drive; a short link for sideloading; Android Studio.

**Not yet decided:** the screen recorder, video editor and narration tools for the demo video, and whether the ntfy phone app was used. **This entry stays open until after the video and the ntfy test.** No friction or opinion is recorded for these tools yet, so no verdict is written.

---

# Part D: Top 5 suggestions for Amazon

1. **Windows build guidance in the sample README [F-016, F-015, F-021].** State that the repo root must be very short on Windows (about 15 characters; LongPathsEnabled does not help; a junction or subst does not help because Node resolves it to the long path). Add an "Android TV only (no Vega)" section with `yarn workspaces focus @multitv/expotv`. Warn that `expo prebuild --clean` overwrites gradle.properties. The path-limit failure alone cost about 35 min with no README warning.
2. **JDK / Gradle compatibility table for TV templates and samples [F-006, F-010, F-012, F-013].** List sample or template version, Gradle version and supported JDK (17), say that Android Studio's bundled JBR 25 fails in the AGP prefab step, and show the Windows-safe `org.gradle.java.home` form (escaped backslashes or forward slashes).
3. **Mark or pin known-good Expo / react-native-tvos versions [F-005, F-006, F-014, F-017].** Mark `expo-template-tv` as outdated, fix the failure handling in `create-expo-app` for the `with-tv` example, and record the version set the sample was verified with: Expo 55.0.24, react-native-tvos 0.83.6-0, Gradle 9.0.0, JDK 17.
4. **Document remote-key delivery on Android TV [F-025].** Say that `useTVEventHandler` only receives events while a view inside the React root has focus, and show the invisible focusable "sink" view for apps that handle keys globally. Also recommend drawing focus indicators as overlays rather than borders [F-026].
5. **Fix the undocumented traps in the sample [F-020, F-022, F-023, F-024].** Comment that `TabLayout.web.tsx` is the TV layout; fix the shared package's jest preset resolution; add `typescript` and Yarn 4 setup (`corepack`) instructions; make the Expo bundle Gradle task rebuild when workspace packages change.

---
