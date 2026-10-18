# Thodu TV: Device evidence and Fire TV readiness
*A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.*

What was run on which device, what was only checked in code or in the APK, and what has **not** been done. Written for a sceptical reader: where proof is missing, this page says so.

**Tags used everywhere in the docs:** `[unit test]` a Jest test in this repo · `[code only]` read in the source, never run · `[cloud Fire TV, date, build]` Amazon Live Device Interaction · `[real Android TV, Sony, user-reported]` the developer's home TV (an Android TV, **not** a Fire TV) · `[emulator]` Android TV emulator (Android 14, x86) · `[APK static]` read from the built APK with `aapt2` or by searching its files, nothing run · `[script]` output of a script in `tools/` · `[not tested]`.

## 1. Devices

| Device | When | Build | What was verified | Evidence | Gaps |
|---|---|---|---|---|---|
| **Amazon cloud device** via Amazon Developer Console > Appstore Quality Central > Live Device Interaction. Device names the developer saw in the console: "FOS 14 3P TV" and "Smart TV - Amazon Fire TV". The exact model and OS were not captured; "FOS 14" is only presumed to mean Fire OS 14 and is **not** stated as fact here. | 2026-10-14 (session recorded; user-reported) | **Unknown, older than `196f20a`.** The saved stills show the Family screen with a "Family phone (simulated)" card, which later builds changed. | `[cloud Fire TV, 2026-10-14, older build]` The app was started and its screens (Settings, Family, Home) were shown in three screen recordings (about 2:00, 2:00 and 1:43, 1920x1080). | Three files in the developer's Downloads folder (`recording.mp4`, `recording (1).mp4`, `recording (2).mp4`) and three stills (outside this repo). **The recordings show only the app full-screen: no console, no device name, no device frame.** They do not prove a Fire TV by themselves, and they show an older build. | No on-screen device proof. The current build (`196f20a`: 5 tiles, Medicines, shared alert sender) has not been run on any Fire OS device. |
| **Sony TV (Android TV)** (home TV; **not a Fire TV**). Make: Sony; model: to be filled by the user; Android version: to be filled by the user (an earlier note gave a version; unconfirmed, so none is stated). | Reported by the developer on or before 2026-10-18; no dated evidence file exists yet | An earlier 4-tile build (`a03802c` or earlier) for the first checks; the later update was also installed (exact build not recorded). | `[real Android TV, Sony, user-reported]` onboarding, language switch, high-contrast theme, remote navigation, Settings, installing the update, and the Medicines tile opens. | The developer's own report; no file in this repo. A family member will use the TV on 2026-10-19 and the developer will film. Until a dated file exists, **"tested with users" is not claimed**. | Delivery of a Medicines or Help notification to a phone is `[not tested]`. VoiceView/TalkBack and Hindi/Telugu speech are not verified here. |
| **Android TV emulator**, Android 14 TV image (`system-images;android-34;android-tv;x86`), 1920x1080 | Screenshots 2026-10-12; later runs for cold start and the label audit | Earlier builds (see `docs/CLAIMS.md`) | `[emulator]` The 8 README screenshots, adb key journeys (D-pad, ENTER, BACK), offline simulation, cold-start numbers, label audit. | `docs/screenshots/`, `tools/cold-start.mjs`, `tools/a11y-audit.mjs`, `FRICTION_LOG.md` | The label audit ran before the Medicines tile came back and was not re-run. |
| **To be recorded: fresh Amazon cloud Live Device Interaction session** with the judge APK `thodu-tv-ff5e452-judge.apk` | **USER-ONLY, not done** | `ff5e452` (judge, no topic) | Device name: _____ · Model: _(copy from the console Details tab, which lists name, model, family and OS version)_ · OS / Fire OS version: _(copy from the Details tab)_ · Date: _____ · What was run: _____ · Recording file name: _____ | Record the **whole browser window** with a separate screen recorder (the built-in recording captures only the device screen) so the console, the device name and the app are all visible. **Download or save the whole-window recording, screenshots and logs before closing the session; unsaved artifacts are lost.** | The fields above are intentionally empty. Do not fill them from memory. |

**Session limits (official, see [PRODUCT_FEEDBACK.md](PRODUCT_FEEDBACK.md) Live Device Interaction):** a session lasts up to 60 minutes; a device left idle for more than 15 minutes can disconnect. The developer remembers a shorter limit; the documentation does not confirm it `[user-reported, unconfirmed: to be checked against the console timer in the next session]`.

Amazon documents Fire OS 14 as "based on API level 34" (developer.amazon.com, "Developing for Amazon Fire TV Devices Running Fire OS 14"). That says nothing about what the cloud device named "FOS 14 3P TV" runs; read it from the console Details tab.

## 2. Fire TV readiness: static checks against Amazon's requirements

Amazon pages read on 2026-10-18: "Test Criteria for Amazon Appstore Apps" (`developer.amazon.com/docs/app-testing/test-criteria.html`), "Add TV Support to an Existing React Native Project (Fire TV)" and "Developing for Amazon Fire TV Devices Running Fire OS 14" (both under `developer.amazon.com/docs/fire-tv/`). **Thodu TV has not been submitted to the Amazon Appstore and is not Appstore-certified or approved.** This table is a self-check, not a certification.

APK checked, read-only: `thodu-tv-ff5e452-judge.apk` (68,381,837 bytes, 65.2 MiB). The rows below were first checked on the earlier judge build `thodu-196f20a-judge.apk`; for `ff5e452` only package, versionName, label, banner, minSdk/targetSdk, signer and the topic search were re-checked `[APK static]`.

| Requirement (source wording, short) | Result | Tag / evidence |
|---|---|---|
| Declare a leanback launcher activity so the app shows on the TV home | `LEANBACK_LAUNCHER` intent filter present; `leanback-launchable-activity: com.thodu.tv.MainActivity` | `[APK static]` `aapt2 dump badging`; source: `packages/expotv/app.json` (`@react-native-tvos/config-tv`) |
| Touchscreen and faketouch "not required" | `android.hardware.touchscreen` and `android.hardware.faketouch` both `required=false` | `[APK static]` |
| Leanback feature flag | `android.software.leanback` `required=false` (so the same APK also installs on phones; fine for Fire TV) | `[APK static]` |
| TV banner | `android:banner` set; a 1280x720 PNG is supplied (`assets/branding/banner-1280x720.png`) | `[APK static]` `banner='res/O5.png'` |
| No Google Play Services / Firebase | No `com/google/android/gms` or `com/google/firebase` strings in the three dex files; no such dependency in the `package.json` files | `[APK static]` search of `classes*.dex`; `[code only]` dependency list |
| Min / target SDK | minSdk 24, targetSdk 36, compileSdk 36. Fire OS 14 is documented as API 34, so a higher target is allowed. Older Fire OS levels were not tested, and no list of supported Fire TV models is stated: the only claim is the manifest's minSdk 24 (Android 7.0). We did not open an Amazon page mapping Fire OS versions to API levels. The APK is signed with the v2 scheme only (v1, v3, v3.1 absent, per the independent audit), which is fine for API 24 and above. | `[APK static]` |
| App size: "2 GB or less (recommended)"; 4 GB hard limit when installed | The APK is 65.2 MiB. Installed size on a device was not measured. | `[APK static]`; installed size `[not tested]` |
| ABIs | arm64-v8a, armeabi-v7a, x86 in one universal APK | `[APK static]` |
| Permissions: none of Amazon's "should not use" list (SET_WALLPAPER, CALL_PHONE, READ_PHONE_STATE, SMS, ACCESS_FINE_LOCATION, RECORD_AUDIO, CAMERA, ...) | Only `INTERNET` (the one ntfy.sh request); `ACCESS_NETWORK_STATE` (added by a library; the app's own code never calls it); `com.thodu.tv.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` (an app-private signature permission added by AndroidX). Storage, overlay and vibrate permissions are removed on purpose. | `[APK static]`; `packages/expotv/app.json`; `SECURITY.md` |
| 4.3 D-pad "must move the focus and highlight" and 4.1 Select "must initiate a logical action" | Every interactive element is one `Focusable` (a `Pressable` with `onPress`), so the D-pad moves focus and Select presses it. The scan sink is the only other focusable view and is hidden from screen readers. | `[unit test]` `a11yCoverage.test.ts`; `[code only]` focus behaviour; `[real Android TV, Sony, user-reported]` D-pad navigation (older build); Fire TV `[not tested]` on the current build |
| 2.11 UI highlighting (focus must be visible) | The focus ring is a 4 px (default) or 10 px (low-vision) overlay in a colour that passes 3:1 against its background. | `[script]` `node tools/a11y-measure.mjs`; screenshots `[emulator]` |
| 2.12 No touch-screen references; no touch-only paths | No `onLongPress`, gestures, swipe or touch-only controls in the source. | `[code only]` search of `packages/shared/src` and `packages/expotv/app` |
| 2.13 Navigability: users must not get trapped or be "forced to exit the app using the Home button" | Back pops the screen stack; every screen except Home has an on-screen Back, Done or Cancel button. Back on Home exits to the launcher. | `[code only]`; `[emulator]` Back journeys |
| 4.4 Home button returns to the launcher; the app should preserve state | The OS handles Home. Settings are saved on every change, so state survives. | `[unit test]` `persist.test.ts`; Home key on Fire TV `[not tested]` |
| 4.5 Back button "should not cause the app to force close or enter into an infinite loop" | Back pops one screen at a time; on the root screen it leaves the app. No loop seen. | `[emulator]`; Fire TV `[not tested]` |
| 4.6 and 4.7 Media buttons and other keys: "Single button presses must not exit the user to the Home screen" | No custom handling of media keys. One-button scanning uses only the Select key (and Back). | `[code only]` |
| 2.10 Text readable from about 10 feet | The smallest text in the source is 22 design px (the scan-hint pill); most text is 26 to 80 on a 1920x1080 grid. Not judged from a sofa. | `[script]` `tools/a11y-measure.mjs`; distance `[not tested]` |
| 2.9 Overscan: apps "should occupy 90% of the screen" (80% passes) | Screen padding is 100 px left and right and 60 px top and bottom of a 1920x1080 grid: a content area of about 89.6% x 88.9%. | `[code only]` `packages/shared/src/components/Screen.tsx` |
| 2.22 Exit within 2 seconds of Home | Not measured. | `[not tested]` |
| Appstore submission / certification | Not done. | Not claimed |

### Signing and build notes
- The release APKs are signed with the generated **debug keystore** (fine for a demo, not for a store). All three APKs share one signer.
- `versionName` is derived from `app.json` (`1.0.0`) plus the git short SHA at prebuild by `packages/expotv/plugins/withGitVersionName.js`; set `THODU_BUILD_LABEL=judge` for a `-judge` suffix. `versionCode` stays 1. The plugin was checked on a temporary copy of `build.gradle` (it produced `1.0.0+<sha>-judge`); it ran in the full builds: the judge APK reports `versionName` `1.0.0+ff5e452-judge` (aapt2) and an independent prebuild on a clean clone produced `1.0.0+9b6688e` (audit, 2026-10-18) `[APK static]`.

## 3. What this page does not claim
Fire TV certified or Appstore approved; tested on a Fire TV with the current build; tested with users; VoiceView or TalkBack verified; emergency or medical use.


## 4. Builds

| Build | File | Size (bytes) | SHA-256 | Status |
|---|---|---|---|---|
| `ff5e452` judge (no topic), versionName `1.0.0+ff5e452-judge` | `thodu-tv-ff5e452-judge.apk` | 68,381,837 | `d3370233b838e415cc3725e07de9440390e480184161765c431f4f513f59153b` | `[APK static]`: label "Thodu TV", banner present, minSdk 24, targetSdk 36, signer cert SHA-256 `fac61745...`, 0 topic matches. **[not tested]** on any device (no emulator run, no TV run, no cloud run). |
| `ff5e452` private (topic-bearing; never published), versionName `1.0.0+ff5e452` | `thodu-tv-ff5e452-ntfy.apk` | 68,381,857 | `f8c8bb93d5d21fb82f8a915bccfeab043fdf8bafdbba6904a93e2c8b5ebeb224` | `[APK static]`, same signer. **[not tested]** on the Sony TV until the user installs it. |

The launcher app name (`app_name`) is "Thodu TV" for every language: the build has no separate Telugu label resource, so the Telugu name appears in artwork and documents only. Emulator check of `ff5e452`: skipped (the only AVD is a phone image, not Android TV).
