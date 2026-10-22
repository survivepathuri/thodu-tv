# Thodu TV: Device evidence and Fire TV readiness
*Easy TV. One button. Family one press away.*

What was run on which device, what was only checked in code or in the APK, and what has **not** been done. Written for a sceptical reader: where proof is missing, this page says so.

**Tags used everywhere in the docs:** `[unit test]` a Jest test in this repo · `[code only]` read in the source, never run · `[cloud Fire TV, date, build]` Amazon Live Device Interaction · `[real Android TV, Sony, user-reported]` the developer's home TV (an Android TV, **not** a Fire TV) · `[emulator]` Android TV emulator (Android 14, x86) · `[APK static]` read from the built APK with `aapt2` or by searching its files, nothing run · `[script]` output of a script in `tools/` · `[not tested]`.

## 1. Devices

| Device | When | Build | What was verified | Evidence | Gaps |
|---|---|---|---|---|---|
| **Amazon cloud Fire TV device** via Amazon Developer Console > Appstore Quality Central > Live Device Interaction. Device names the developer saw in the console: "FOS 14 3P TV" and "Smart TV - Amazon Fire TV". The exact model and OS version were not captured in this repository; "FOS 14" is only presumed to mean Fire OS 14 and is **not** stated as fact here. | Session 1: 2026-10-14 (three recordings, user-reported). Later session(s): shown in the demo video; date and device name not recorded here | Session 1: **unknown build, older than `196f20a`** (the stills show the Family screen with a "Family phone (simulated)" card, which later builds changed). Later session(s): the build is not recorded in this repository. | `[cloud Fire TV, 2026-10-14, older build]` The app was started and its screens (Settings, Family, Home) were shown in three screen recordings (about 2:00, 2:00 and 1:43, 1920x1080). The developer reports that the app also ran on an Amazon Fire TV cloud device in the footage used in the demo video. | The 2026-10-14 recordings are three files in the developer's Downloads folder, outside this repo, and three stills. **They show only the app full-screen: no console, no device name, no device frame**, so they do not prove a Fire TV by themselves. Build, date, model and OS of the later session are not recorded in this repository; read them from the demo video, not from this page. | No Fire OS version is stated anywhere in this repository. Spoken output on the cloud device is not verified. |
| **Sony TV (Android TV)** (home TV; **not a Fire TV**). Make: Sony; model and Android version were not recorded. | 2026-10-20: consented family session (see [USER_TESTING.md](USER_TESTING.md)); earlier checks reported by the developer on or before 2026-10-18 | 2026-10-20: a build of the same code with the developer's private notification topic (the judge build is that code with the topic removed); exact `versionName` not recorded. Earlier checks: a 4-tile build. | `[real Android TV, Sony, user-reported]` Several real Help alerts were sent from the TV and reached the family phone through the ntfy app on 2026-10-20. Earlier checks: onboarding, language switch, high-contrast theme, remote navigation, Settings, installing the update, and the Medicines tile opening. | The developer's own report; no recording, log or notification screenshot is stored in this repo. The participant is not named and no health information is stated. | Model, Android version and the exact build are blank on purpose (not recorded). VoiceView/TalkBack and Hindi/Telugu speech are not verified. |
| **Android TV emulator**, Android 14 TV image (`system-images;android-34;android-tv;x86`), 1920x1080 | Screenshots 2026-10-12; later runs for cold start and the label audit | Earlier builds (see `docs/CLAIMS.md`) | `[emulator]` The 8 README screenshots, adb key journeys (D-pad, ENTER, BACK), offline simulation, cold-start numbers, label audit. | `docs/screenshots/`, `tools/cold-start.mjs`, `tools/a11y-audit.mjs`, `FRICTION_LOG.md` | The label audit ran before the Medicines tile came back and was not re-run. |

**Session limits (official, see [PRODUCT_FEEDBACK.md](PRODUCT_FEEDBACK.md) Live Device Interaction):** a session lasts up to 60 minutes; a device left idle for more than 15 minutes can disconnect. The developer remembers a shorter limit; the documentation does not confirm it `[user-reported, unconfirmed: to be checked against the console timer in the next session]`.

Amazon documents Fire OS 14 as "based on API level 34" (developer.amazon.com, "Developing for Amazon Fire TV Devices Running Fire OS 14"). That says nothing about what the cloud device named "FOS 14 3P TV" runs; read it from the console Details tab.

## 2. Fire TV readiness: static checks against Amazon's requirements

Amazon pages read on 2026-10-18: "Test Criteria for Amazon Appstore Apps" (`developer.amazon.com/docs/app-testing/test-criteria.html`), "Add TV Support to an Existing React Native Project (Fire TV)" and "Developing for Amazon Fire TV Devices Running Fire OS 14" (both under `developer.amazon.com/docs/fire-tv/`). **Thodu TV has not been submitted to the Amazon Appstore and is not Appstore-certified or approved.** This table is a self-check, not a certification.

APK checked, read-only: `thodu-tv-d52f5fe-judge.apk` (68,382,021 bytes, 65.2 MiB; named `thodu-d52f5fe-topicfree.apk` on the developer's disk, renamed for the GitHub Release). Package, versionName `1.0.0+d52f5fe-judge`, minSdk 24 / targetSdk 36, the leanback launcher `com.thodu.tv.MainActivity` and the absence of a private notification topic are the facts the developer supplied for this build; the detailed rows below were checked with `aapt2` and a search of the APK on earlier judge builds of the same code; commits after those builds change documentation only (see the `git diff` stat in [JUDGES.md](JUDGES.md)) `[APK static]`.

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
- The APK is signed with the template's generated **debug keystore**, not a production key; it is a demo build (fine for a demo, not for a store). The APKs listed here share one signer, which only means they came from the same build setup.
- `versionName` is derived from `app.json` (`1.0.0`) plus the git short SHA at prebuild by `packages/expotv/plugins/withGitVersionName.js`; set `THODU_BUILD_LABEL=judge` for a `-judge` suffix. `versionCode` stays 1. The plugin was checked on a temporary copy of `build.gradle` (it produced `1.0.0+<sha>-judge`); it ran in the full builds: the judge APK reports `versionName` `1.0.0+d52f5fe-judge` `[APK static]`.

## 3. What this page does not claim
Fire TV certified or Appstore approved; tested on a Fire TV with the current build; tested with users; VoiceView or TalkBack verified; emergency or medical use.


## 4. Judge build

| Build | Release file | Size (bytes) | SHA-256 | Status |
|---|---|---|---|---|
| `d52f5fe` judge (no private notification topic), versionName `1.0.0+d52f5fe-judge` | `thodu-tv-d52f5fe-judge.apk` | 68,382,021 | `6e1ef0ac79f3eda694f65e63b9234baf01b53c845cb6c41ecff55f3daea4331f` | The only APK offered to judges. Signed with the debug keystore. minSdk 24, targetSdk 36, launcher `com.thodu.tv.MainActivity` (leanback). It is the same code as the build used on the Sony TV on 2026-10-20, with the private topic removed. |

The launcher app name (`app_name`) is "Thodu TV" for every language: the build has no separate Telugu label resource, so the Telugu name appears in artwork and documents only. Builds that contain a private notification topic exist on the developer's disk and are never published or described here.
