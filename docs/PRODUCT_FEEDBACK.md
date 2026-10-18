# Thodu — Product Feedback (Build, Ship, Shape)

Project: Thodu (తోడు), a Fire TV track app for elderly and disabled users.
Environment: Windows 11 Pro (build 22621), solo developer, React Native + Expo (react-native-tvos), Android TV emulator (Android 14 TV image, x86). Dates: 2026-10-11 to 2026-10-12.
Sources: docs/FRICTION_LOG.md (F-001..F-033) and the structured copy of it. Time lost values are the estimates written in the log at the time. Severity ratings are ours, not Amazon's.

**Important limit:** we have NOT yet run Thodu on a real Fire TV device. Everything below comes from the Android TV emulator.

**Amazon tools we did NOT use:** Vega SDK, Appstore / Developer Console, Fire TV hardware or Fire OS, Alexa tooling, Kiro, and live Bedrock/SNS calls. This report covers only the sample + emulator workflow so far. Real Fire TV results via Appstore Quality Central Live Device Interaction will be added in block A4 after Oct 17.

Each block is self-contained so it can be pasted into one text box. The exact Devpost form layout was not read when this was written.

---

# Part A — Amazon-related tools

## A1. Amazon react-native-multi-tv-helloworld sample

**What we used it for.** The base of the Thodu app: an Expo 55.0.24 / react-native-tvos 0.83.6-0 / React 19.2.0 / Gradle 9.0.0 Yarn 4 monorepo, built for Android TV only [F-015, F-017].

**What worked well.** With JDK 17 it built (x86 only, 19m 1s, 37 MB APK), launched, took D-pad keys, moved focus and showed a fetched joke [F-017]. The crash from the other starter did not happen here [F-014, F-017]. `yarn workspaces focus @multitv/expotv` installed from the lockfile in 2m 45s [F-015].

**What needs work.**
- No README note on the Windows 260-character path limit. The first build failed after about 13 min (`ninja: error: ... Filename longer than 260 characters`); LongPathsEnabled=1 did not help, a very short clone path did. About 35 min lost [F-016].
- No "Android TV only (no Vega)" section; the lockfile has `@amazon-devices/*` packages (~5 min) [F-015].
- The Expo bundle task showed UP-TO-DATE after we edited packages/shared and shipped stale JavaScript. We now force `--rerun`. About 25 min lost [F-024].
- packages/shared jest fails with `Cannot find module 'react-native/jest-preset'`; the sample's scaling test never ran [F-022].
- No `typescript` in packages/expotv and no note on Yarn 4 on PATH [F-023, F-031].

**Our own mistake, not Amazon's.** We deleted `TabLayout.web.tsx` assuming it was web-only; the bundle failed with `Unable to resolve module ./TabLayout.web`. About 15 min lost. A one-line comment in `TabLayout.tsx` would have prevented it [F-020].

**Onboarding (zero to hello world).** Total not recorded. Pieces: ~5 min finding the install route [F-015]; a failed ~13 min build [F-016]; a 19m 1s build [F-017].

**Build with it again?** Yes — it is the version that ran on the emulator, which the other starter did not [F-014, F-017]. We would want the README fixes above first.

## A2. React Native for TV (react-native-tvos) as the Fire TV app stack

**react-native-tvos is a community fork of React Native for TV, NOT an Amazon-maintained tool.** We include it because Amazon's sample builds on it.

**What we used it for.** The app runtime (0.83.6-0 inside the sample) for remote-driven UI: focus, TV key events (`useTVEventHandler`), Pressable focus styling [F-017, F-025, F-026].

**What worked well.** Focus moved with the D-pad in the unmodified sample [F-017]. Once a focused view existed, 6 of 6 test key presses reached `useTVEventHandler` [F-025].

**What needs work.**
- `useTVEventHandler` / `onHWKeyEvent` gets no events when no view inside the React root has focus. With every item `focusable={false}`, the log showed zero events after the first screen change and most OK presses were lost (0 of 6 delivered). No error was shown. We read ReactAndroidHWInputDeviceHelper and ReactRootView.dispatchKeyEvent to find the cause and keep one invisible focusable "sink" view. About 35 min lost. This is not documented as far as our log shows [F-025].
- A focus ring drawn as a Pressable border changes layout: at ring width 10 each card grew by 20 px and the setup list no longer fit. We redrew it as an absolutely positioned overlay. About 15 min lost (part of that was a helper-script problem of our own) [F-026].
- Starter versions: the Expo 57 / react-native-tvos 0.86 `with-tv` example installed but crashed at start with `Invariant Violation: View config getter callback for component 'RCTText' must be a function`. We did NOT investigate the cause. It may be our own setup or a version mismatch, so this is not evidence of a fault in react-native-tvos or of anything Amazon provides [F-014].

**Onboarding.** Not recorded separately from the sample (see A1).

**Build with it again?** Yes, for a TV app on this stack, with the key-event rule in A2 known. The log does not record a comparison with any other stack, so we cannot say more.

## A3. Fire TV / Android TV target, tested on the Android TV emulator

**What we used it for.** All testing so far ran on an Android TV emulator (Android 14 TV image, `system-images;android-34;android-tv;x86`) [F-003, F-017]. **We have not yet run on a real Fire TV, and not on Fire OS.** Nothing here is evidence about Fire OS behavior.

**What worked well.** The emulator booted (about 180 s first boot) and ran the release APK, D-pad keys and deep links [F-004, F-017, F-030].

**What needs work.**
- No x86_64 Android TV system image exists for API 31–34, only x86 and arm64. A short table in the docs would have saved the search (0 min lost) [F-003].
- The first boot logs `Critical: Failed to load opengl32sw` then falls back to system OpenGL and succeeds. Reads like a failure, is harmless [F-004].
- The TV image is Ethernet-only. `svc wifi/data disable`, an invalid Private DNS host and the legacy `http_proxy` key did not take the device offline, so our failure screen never appeared. What worked: `adb emu network delay 20000` (restore with `network delay none`; clear a proxy with `settings put global http_proxy :0`). About 20 min lost. There is no "test offline" section in the docs we used [F-028].
- `expo run:android --device emulator-5554` was rejected (`Could not find device with name`); the AVD name is needed. About 35 min lost, including a 30 min wait on an empty log from a detached spawn [F-007].

**Onboarding.** Not recorded as a single figure. Our rating of the emulator setup problems is Minor except F-007 (Major) and F-028 (Major).

**Build with it again?** Yes for development, but we need real-device results before we can say how the app behaves on Fire TV (see Part D).

## A4. Appstore Quality Central Live Device Interaction — TO FILL AFTER OCT 17 (not used yet)

**What we used it for.**

**What worked well.**

**What needs work.**

**Onboarding (zero to hello world).**

**Build with it again, and why?**

---

## Not used

- **Vega SDK:** not used. It is not available on Windows (user-stated). The only mention in our log is that the sample's lockfile contains `@amazon-devices/*` packages for the Vega app and that a full install needs Amazon's Yarn config for Vega; we avoided it with `yarn workspaces focus @multitv/expotv` [F-015]. We did not try the Vega SDK itself.
- **Fire OS as a separate target, real Fire TV hardware:** not used; no log entry (see A3).

---

# Part B — Other tooling

## B1. Expo tooling (create-expo-app, expo-template-tv, expo run:android, prebuild, expo-router)

**Used for:** creating, prebuilding and running the TV project and routing. **Worked:** the focused sample and deep-link routing worked once set up [F-017, F-030]. **Needs work:** `npx create-expo-app@latest hello-tv --example with-tv --no-install` failed twice, left a partial folder, and the error path crashed with `TypeError [ERR_INVALID_ARG_TYPE]: The "code" argument must be of type number` hiding the real failure (~10 min, Blocker for that approach) [F-005]. `expo-template-tv` pins react-native-tvos 0.72.4 / Expo 50 alpha / Gradle 8.3 and failed on JDK 25 with `Unsupported class file major version 69` (~25 min) [F-006]. `expo prebuild --clean` overwrote our gradle.properties (~5 min) [F-021]. Deep-linking to a route already on the stack kept the old state (~5 min) [F-030]. **Onboarding:** not recorded. **Again?** Yes, with pinned versions.

## B2. Android SDK / emulator tooling

**Used for:** SDK, system image, AVD. **Worked:** the install ended with a booting emulator [F-004]. **Needs work:** `sdkmanager` split the package id on ";" in PowerShell (`Package system-images not found.`) (~2 min) [F-001]. Command-line tools were not in the SDK folder and Android Studio installed to C: not D: (time not recorded) [F-002]. Emulator items are in A3. **Onboarding:** not recorded. **Again?** Yes.

## B3. Gradle + Android Gradle Plugin + JDK 17

**Used for:** all APK builds. **Worked:** with Temurin JDK 17, assembleRelease succeeded (10m 3s for the first x86 build) [F-012]. **Needs work:** Android Studio's bundled JBR (JDK 25) fails in the AGP prefab step: `IllegalStateException: WARNING: A restricted method in java.lang.System has been called` (~20 min, Blocker for that approach) [F-010]. `org.gradle.java.home` with single backslashes fails at startup on Windows [F-013]. The missing SDK was reported only after 4 min 49 s and 28 tasks [F-032]. One dropped connection failed a 27m 30s multi-ABI build; the re-run took 13m 50s (~28 min) [F-033]. A leftover daemon followed the first failed build [F-011] and blocked a folder move [F-018]. One DNS failure on Maven Central was a plain retry and not an Amazon issue [F-009]. **Onboarding:** not recorded. **Again?** Yes, with JDK 17 pinned.

## B4. Yarn 4

**Used for:** the monorepo install. **Worked:** the focused install from the lockfile (2m 45s) [F-015]. **Needs work:** `yarn` was not on PATH although `packageManager` pins Yarn 4; the error did not mention Corepack, and `corepack yarn` fixed it (~3 min) [F-031]. Yarn wrote yarn.lock with CRLF on Windows [F-021]. **Onboarding:** not recorded. **Again?** Yes.

## B5. Android 14 font scaling (React Native Text)

**Used for:** making text follow the system font size (scale 1.3). **Worked:** a shared Text wrapper that applies our own capped multiplier fixed it. **Needs work:** with the stock behavior the Home title did not grow and labels grew about 12%; Android 14+ scales large text non-linearly, and our first version also cancelled the OS scale (partly our own mistake). About 8 min plus a 1m 11s rebuild [F-029]. **Onboarding:** n/a. **Again?** Yes.

*Not an Amazon or platform issue:* the AI coding-agent shell tool cut off heredocs on Windows [F-027]; this is not counted against any tool above.

---

# Part C — Top 5 suggestions for Amazon

1. **Windows build guidance in the sample README [F-016, F-015, F-021].** State that the repo root must be very short on Windows (about 15 characters; LongPathsEnabled does not help; a junction or subst does not help because Node resolves it to the long path). Add an "Android TV only (no Vega)" section with `yarn workspaces focus @multitv/expotv`. Warn that `expo prebuild --clean` overwrites gradle.properties. The path-limit failure alone cost about 35 min with no README warning.
2. **JDK / Gradle compatibility table for TV templates and samples [F-006, F-010, F-012, F-013].** List sample or template version, Gradle version and supported JDK (17), say that Android Studio's bundled JBR 25 fails in the AGP prefab step, and show the Windows-safe `org.gradle.java.home` form (escaped backslashes or forward slashes).
3. **Mark or pin known-good Expo / react-native-tvos versions [F-005, F-006, F-014, F-017].** Mark `expo-template-tv` as outdated, fix the failure handling in `create-expo-app` for the `with-tv` example, and record the version set the sample was verified with: Expo 55.0.24, react-native-tvos 0.83.6-0, Gradle 9.0.0, JDK 17.
4. **Document remote-key delivery on Android TV [F-025].** Say that `useTVEventHandler` only receives events while a view inside the React root has focus, and show the invisible focusable "sink" view for apps that handle keys globally. Also recommend drawing focus indicators as overlays rather than borders [F-026].
5. **Fix the undocumented traps in the sample [F-020, F-022, F-023, F-024].** Comment that `TabLayout.web.tsx` is the TV layout; fix the shared package's jest preset resolution; add `typescript` and Yarn 4 setup (`corepack`) instructions; make the Expo bundle Gradle task rebuild when workspace packages change.

---

# Part D — Gaps the human must fill

- **Real Fire TV:** no run on a real Fire TV or Fire OS is in the logs. Needs real-device results (performance, remote keys, focus, fonts) before claiming anything about Fire TV.
- **Appstore Quality Central Live Device Interaction (A4):** all five headings are empty until it is used after Oct 17.
- **Onboarding totals:** no end-to-end "zero to hello world" time is recorded for any tool. Fill in wall-clock time if known.
- **Not recorded in the logs:** F-002 (expected, time lost, severity); F-003 and F-004 (expected); F-008 (steps, time lost, severity); F-011 (expected); F-013 (exact Gradle error text); F-014 (cause of the RCTText crash, not investigated); F-027 (time is approximate only).
- **F-014:** the logs do not say whether any Amazon guide points to the `with-tv` example, so do not present F-014 as an Amazon documentation fault.
- **Vega SDK:** confirm the "not available on Windows" statement and say whether you ever tried it.
- **Fire OS / other Amazon tools:** if you used any other Amazon tool, API or SDK that the log does not name (for example Amazon Appstore tooling), add a block.
- **Would-build-again judgment: the human must confirm in their own words.**
- **Would-build-again reasons:** the "again, and why" lines are limited to what the logs show; add your own judgment.
- **Devpost form:** exact layout (one box vs. per tool), character limits, required fields: not read. Check before pasting.
