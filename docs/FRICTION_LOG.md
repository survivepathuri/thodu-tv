# Thodu TV: Friction log (curated, Amazon-related first)
*A TV built for elderly and disabled people that calls the family for help*

This is the short, judge-readable version of the friction log. Every entry below summarises an entry of the detailed log, [`FRICTION_LOG.md`](../FRICTION_LOG.md) at the repository root (40 entries, F-001 to F-040, with exact steps, expected vs actual text and our severity rating). Nothing here is new; no entry is invented. FL-12 to FL-16 are numbered after the first eleven so that existing references to FL-01 to FL-11 stay valid; they sit in Part A next to the other Live Device Interaction entries. Entries marked **[user-reported]** rest on the developer's statement only, with no file as evidence (FL-12 to FL-16 are the developer's first-hand report of the 2026-10-22/23 recording session). Times are the developer's rough notes kept at the time ("not recorded" where they were not).

Part A is about Amazon products and Amazon's sample. Part B is about other tools met on the way to a Fire TV build.

## For the Amazon team

First-hand friction with Amazon's own tool, **Appstore Quality Central > Live Device Interaction** (an Amazon Fire TV cloud device; no Fire OS version is claimed). The FL-12 to FL-16 rows come from recording the demo video on 2026-10-22/23. Time cost is written "unmeasured" where the developer did not time it; no minutes are invented. Details: FL-01, FL-02 and FL-12 to FL-16 below; exact steps in the root [FRICTION_LOG.md](../FRICTION_LOG.md) (F-034 to F-040).

| Issue | What happened | Impact on the builder | Workaround we used | Suggested fix for Amazon |
|---|---|---|---|---|
| Recording shows no device identity (FL-01, F-034) | The built-in recording shows only the app full-screen: no console, no device name or model. | Cannot prove a Fire TV by itself. Time: not recorded. | Recorded the whole browser window with a separate screen recorder. | Window-level recording, or burn the device name and model into the capture. |
| Recorder: native alerts, 2-minute cap, save delay (FL-12, F-036) | Native browser alerts at Start and End (a browser-automation extension cannot click them); each recording capped at 2 minutes; the file takes about 45 to 60 s to be saved after stopping. | Unmeasured. A manual click at every start and stop; about 45 to 60 s wait per recording; long takes must be split. | Clicked OK by hand; split long takes into parts. | No native alerts (in-page confirmation); a longer cap. |
| Recording stops when you leave the Screen panel (FL-13, F-037) | Switching to the Remote panel stops the recording, so remote buttons cannot be used while recording. The first two attempts produced one-frame files until this was understood. | Unmeasured. Two failed one-frame recordings (kept as failed attempts); R1 split into three parts. | Split long takes into parts once the behaviour was understood. | Keep recording across panels so the remote can be used during a take. |
| Keyboard input and lag (FL-14, F-038) | Arrow keys and Enter work only after clicking the grey area around the TV picture; Escape and Backspace did not work (Back needed the on-screen Back button, Enter on it); about 1 to 2 s of picture lag. | Unmeasured. The lag affects every step of a take. | Click the grey area first; use the on-screen Back button. | A key-send API; Escape or Backspace as Back; lower latency. |
| Session handling (FL-15, FL-16, F-039, F-040) | The session is server-side: a browser-automation tool could control only the tab in its own tab group, and a new tab needed the "Control" tab to reattach. A short home-internet drop disconnected the cloud device. | Unmeasured. A reattach step; a reconnect. | Used the "Control" tab; reconnected the device. | Document reattaching a tab; let a session resume after a short network drop. |
| Choosing a device (FL-02, F-035) | The device list offered "FOS 14 3P TV" and "Smart TV - Amazon Fire TV"; it was unclear how to choose. | Time: not recorded. | Worked it out by trial. | Show the Fire OS version and model in the list. |

Amazon's *sample* (react-native-multi-tv-helloworld) friction is not repeated here: see FL-03 to FL-06 below.

**If you only read one thing:**
1. Recorder: no native alerts, a longer cap, keep recording while the Remote panel is used (FL-12, FL-13), and the device name and model in the recording (FL-01).
2. Input: keys that work without a first click, Escape or Backspace as Back, a key-send API and lower latency (FL-14).
3. Sessions: resume after a short network drop and document reattaching a tab (FL-15, FL-16).

## Part A: Amazon

### FL-01: Live Device Interaction recording cannot prove which device it came from  [user-reported] (F-034)
- **What happened:** On 2026-10-14 the developer used the built-in recording of a Live Device Interaction session on a cloud Fire TV (three files, about 2:00, 2:00 and 1:43, 1920x1080). The files show only the app full-screen: no Amazon console, no device name or model.
- **Impact:** The Fire TV track needs a video that shows the project running on an actual Fire TV device. These files cannot show that by themselves. Severity (developer's rating): low-medium. Time lost: not recorded.
- **Workaround:** Record the whole browser window with a separate screen recorder, so the console, the device name and the app are all visible.
- **Suggestion:** Offer a window-level recording, or burn the device name and model into the capture.

### FL-02: Hard to choose between the cloud devices "FOS 14 3P TV" and "Smart TV - Amazon Fire TV"  [user-reported] (F-035)
- **What happened:** The device list offered "FOS 14 3P TV" and "Smart TV - Amazon Fire TV". The developer did not understand at first how to choose between them and worked it out after some time (how long was not recorded).
- **Impact:** Time lost (not recorded) and uncertainty about which Fire OS the app ran on; this repository therefore states no Fire OS version. Severity (developer's rating): low.
- **Workaround:** Worked it out by trial (details not recorded).
- **Suggestion:** Show the Fire OS version and the model clearly in the device list.

### FL-12: The Screen-tab recorder shows native browser alerts, is capped at 2 minutes and takes 45 to 60 seconds to save  [user-reported] (F-036)
- **What happened:** Native alerts at Start and End (a browser-automation extension cannot click them); each recording capped at 2 minutes; about 45 to 60 seconds before the file is saved after stopping.
- **Impact:** Unmeasured. A manual click at every start and stop; about 45 to 60 s wait to save each recording; long takes had to be split. Severity: not recorded.
- **Workaround:** Clicked OK on the alerts by hand; split long takes into parts.
- **Suggestion:** Use an in-page confirmation (or none) instead of native browser alerts, and allow a longer recording cap.

### FL-13: Leaving the Screen panel stops the recording, so the remote buttons cannot be used while recording  [user-reported] (F-037)
- **What happened:** Leaving the Screen panel (for example switching to the Remote panel) stops the recording, so remote buttons cannot be used while recording. The first two attempts produced one-frame files.
- **Impact:** Unmeasured. Two failed recordings (one-frame files); a long take split into three parts. Severity: not recorded.
- **Workaround:** Once understood, split long takes into parts (R1 into three parts); the two one-frame files are kept as failed attempts.
- **Suggestion:** Keep recording across panels, so the remote buttons can be used during a take.

### FL-14: Keyboard keys work only after clicking the grey area, Escape and Backspace do nothing, and the picture lags 1 to 2 seconds  [user-reported] (F-038)
- **What happened:** Arrow keys and Enter work only after clicking the grey area around the TV picture; Escape and Backspace did not work; Back needed the on-screen Back button (Enter on it); about 1 to 2 seconds of picture lag between a key press and the screen.
- **Impact:** Unmeasured. The 1 to 2 s lag affects every step of a take. Severity: not recorded.
- **Workaround:** Click the grey area first; use the on-screen Back button with Enter.
- **Suggestion:** Offer a key-send API, make Escape or Backspace act as Back, and reduce the latency.

### FL-15: The device session is server-side, and a browser-automation tool could control only the tab in its own tab group  [user-reported] (F-039)
- **What happened:** The device session is server-side; a browser-automation tool could control only the tab belonging to its own tab group; a new tab needed the "Control" tab to reattach.
- **Impact:** Unmeasured. A reattach step whenever a new tab was needed. Severity: not recorded.
- **Workaround:** Used the "Control" tab to reattach.
- **Suggestion:** Document how to reattach a new tab to a running session.

### FL-16: A short home-internet drop disconnected the cloud device  [user-reported] (F-040)
- **What happened:** A short home-internet drop disconnected the cloud device; it had to be reconnected.
- **Impact:** Unmeasured. Severity: not recorded.
- **Workaround:** Reconnected the device.
- **Suggestion:** Let a session resume after a short network drop.

### FL-03: Amazon multi-TV sample: native build fails on Windows' 260-character path limit (F-016)
- **What happened:** The sample's release build, started from a clone in a normal-length folder, failed after about 13 minutes in ninja/CMake with `Filename longer than 260 characters`. The sample's README does not mention a path limit. Windows `LongPathsEnabled=1` did not help.
- **Impact:** About 35 minutes (13 minutes of failed build plus diagnosis and redo). Severity (our rating): major.
- **Workaround:** Move the clone to a path of about 15 characters or fewer. A junction or `subst` does not help, because Node resolves them back to the long path.
- **Suggestion:** Add a Windows note to the sample README (clone to a very short path) and have the build fail early with a clear path-length message.

### FL-04: Amazon multi-TV sample: the Android-TV-only install is not spelled out (F-015)
- **What happened:** The lockfile includes `@amazon-devices/*` packages for the Vega app, and a full install needs Amazon's package-manager configuration for Vega. The developer wanted only the Android TV package.
- **Impact:** About 5 minutes working out the route. Severity: minor.
- **Workaround:** `yarn workspaces focus <the Android TV package>` (the focused install worked in 2 min 45 s).
- **Suggestion:** Add an "Android TV only (no Vega)" section to the README with the `yarn workspaces focus` command.

### FL-05: Amazon multi-TV sample: `TabLayout.web.tsx` is the TV layout (F-020)
- **What happened:** The developer deleted `layouts/TabLayout.web.tsx`, assuming a `.web` file was web-only. `TabLayout.tsx` imports it explicitly and uses it on TV, so the release JS bundle failed after a 6 min 22 s native build. The cause was the developer's own wrong assumption, not an Amazon error.
- **Impact:** About 15 minutes. Severity: minor.
- **Workaround:** Keep the file; do not judge a platform file by its suffix.
- **Suggestion:** Add a comment in `TabLayout.tsx` or the README that `TabLayout.web.tsx` is the TV layout, or rename it.

### FL-06: Amazon multi-TV sample: the shared package's Jest config cannot resolve `react-native` (F-022, F-023)
- **What happened:** The sample's test script in `packages/shared` failed with `Cannot find module 'react-native/jest-preset'`, because `react-native` is installed only in `packages/expotv` (the root `package.json` lists `react`, `react-native` and friends as `nohoist`). The same layout is why a plain type-check of `packages/expotv` reports errors that are not code errors: measured on 2026-10-23, plain `tsc --noEmit -p .` in `packages/expotv` gives 27 errors; with a temporary path-mapped tsconfig it gives 9, all in unused starter-template files. `packages/shared` type-checks with 0 errors. `yarn` was also not on the PATH, and `tsc` is not installed in `packages/expotv`.
- **Impact:** About 4 minutes (Jest) plus about 3 minutes (Yarn and `tsc`); the type errors in `packages/expotv` are still there and are described honestly in the README. Severity: minor.
- **Workaround:** A separate `jest.core.config.js` for the pure-logic code in `src/core` (no React Native preset); call `node_modules` binaries directly; use Corepack for Yarn.
- **Suggestion:** Let the shared package's Jest config resolve `react-native/jest-preset` (a devDependency or an explicit preset path), add `typescript` to `packages/expotv`, and explain `corepack enable` in the README.

### FL-07: react-native-tvos: `useTVEventHandler` gets no key events when no view has focus (F-025)
- **What happened:** In single-button scanning mode every item was `focusable={false}`, and most OK presses were lost (0 of 6 test presses delivered). With no focused view Android does not deliver key events down the focus path to the React root, so `onHWKeyEvent` never fires. No error is shown. Keeping one invisible focusable view on the screen fixed it (6 of 6).
- **Impact:** About 35 minutes. Severity (our rating): major. react-native-tvos is the React Native fork for Apple TV and Android TV that Amazon's sample builds on; it is published by the react-native-tvos GitHub organization.
- **Workaround:** Always keep a focused view inside the React root while using TV key events without focusable children.
- **Suggestion:** State in the `useTVEventHandler` documentation that events arrive only while some view in the React root has focus, and show the invisible-sink pattern.

## Part B: other tools on the way to a Fire TV build

### FL-08: Expo release build ships stale JavaScript after editing the shared package (F-024)
- **What happened:** After editing screens in `packages/shared`, `gradlew assembleRelease` finished in 15 s with the bundle task `UP-TO-DATE`; the emulator showed the old layout.
- **Impact:** About 25 minutes. Severity: major.
- **Workaround:** Re-run with `:app:createBundleReleaseJsAndAssets --rerun` after every JS edit (the README says so).
- **Suggestion:** Declare the workspace JS sources as inputs of the Expo bundle task, or document `--rerun`.

### FL-09: The Expo TV templates and examples did not give a working start (F-005, F-006, F-014)
- **What happened:** `create-expo-app ... --example with-tv` failed twice and left a partial folder, with an error path that itself crashed (`TypeError [ERR_INVALID_ARG_TYPE]`). `expo-template-tv` pins an old stack (react-native-tvos 0.72.4, Gradle 8.3) and failed on the bundled JDK 25. The newer with-tv example (Expo 57, react-native-tvos 0.86) installed but crashed at start (`View config getter callback for component 'RCTText' must be a function`).
- **Impact:** About 10 + 25 + 6 minutes; two of these were blockers that forced a different approach (starting from Amazon's sample, Expo 55 with react-native-tvos 0.83.6-0, which built and ran). The logs do not say whether any Amazon guide points to the with-tv example, so this is not presented as an Amazon documentation fault.
- **Workaround:** Start from Amazon's multi-TV sample.
- **Suggestion:** Mark `expo-template-tv` as outdated, fix create-expo-app's failure handling, and publish known-good Expo / react-native-tvos version sets.

### FL-10: Android Studio's bundled JDK 25 fails the Android Gradle plugin's prefab step (F-010, F-012)
- **What happened:** `assembleRelease` failed at `configureCMakeRelWithDebInfo` because a JDK warning on stderr was treated as an error (`A restricted method in java.lang.System has been called`).
- **Impact:** About 20 minutes of attempts plus about 8 minutes to a working setup. Severity: blocker (forced a different approach).
- **Workaround:** JDK 17 (Temurin) as `JAVA_HOME`.
- **Suggestion:** Do not treat any stderr output of the prefab process as an error; publish a supported-JDK note (17 or 21).

### FL-11: One dropped connection ended a 27-minute multi-ABI native build (F-033)
- **What happened:** The three-ABI release build failed after 27 min 30 s because one dependency, first needed during the native configure step, could not be downloaded (`Network is unreachable`). Re-running reused finished tasks and passed in 13 min 50 s. (A first full build takes about 30 to 40 minutes on the developer's laptop.)
- **Impact:** About 28 minutes. Severity: major.
- **Workaround:** Re-run after confirming the network.
- **Suggestion:** Document warming the dependency cache (for example `./gradlew dependencies`) before the first long build on an unreliable network.

## Not in this log (nothing written down, so nothing stated)
Friction with the cloud device's recorder alerts, its recording length limit, the remote panel and picture lag, and any other Live Device Interaction behaviour beyond FL-01 and FL-02, is not documented in this repository and is therefore not claimed. Amazon's own pages describe sessions of up to 60 minutes and say an idle device can disconnect after 15 minutes ([`PRODUCT_FEEDBACK.md`](PRODUCT_FEEDBACK.md) entry 2). The developer remembers a shorter limit; that is unconfirmed.
