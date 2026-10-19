# Thodu TV: Tech stack
*Easy TV. One button. Family one press away.*

Versions are the installed ones; licenses are from each package's metadata (the full direct-dependency list is in [../THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)). "Inherited" means the item was already in the Amazon react-native-multi-tv-helloworld sample at our import commit 35bb725 (proof: `git log -S` on the manifests). "Chosen" means we added it. "Generated" means a tool produced it.

## Runtime and app

| Tool | Version | Used for | Origin |
|---|---|---|---|
| react-native-tvos (installed as `react-native`) | 0.83.6-0 | TV remote focus and key events; a full fork of React Native that adds Apple TV and Android TV support (MIT) | Inherited |
| React, react-dom | 19.2.0 | UI | Inherited |
| Expo | 55.0.24 | prebuild, autolinking | Inherited |
| expo-router | 55.0.14 | file routes, `thodu://` deep links | Inherited |
| expo-font, expo-splash-screen | 55.0.7, 55.0.21 | load the font, hold the splash screen | Inherited |
| expo-speech | 55.0.18 | read-aloud (Android text-to-speech) | Chosen |
| expo-crypto | 55.0.19 | secure random bytes for the notification topic | Chosen |
| @react-native-async-storage/async-storage | 2.2.0 | save settings on the TV | Chosen |
| react-native-reanimated | 4.2.1 | one warning-configuration call (animated sample components unused) | Inherited |
| ntfy.sh | public service | one HTTPS POST per family alert (`notify.ts`); the only network domain in the source | Chosen |
| Android text-to-speech engine, AccessibilityInfo | device | read-aloud, system accessibility settings | Chosen |

## Build, test and tooling

| Tool | Version | Used for | Origin |
|---|---|---|---|
| Gradle (wrapper), Android Gradle Plugin | 9.0.0 | APK build; also signs the release build with the generated debug keystore | Generated |
| JDK (Temurin) | 17 | builds | Chosen |
| Android SDK platform 36, NDK, CMake, adb | 36, 27.1.12297006, 3.22.1 | native build, install | Chosen |
| @react-native-tvos/config-tv | 0.1.5 | TV manifest entries and banner | Inherited |
| expo-build-properties | 55.0.14 | cleartext traffic off, ABIs | Chosen |
| `plugins/withLowMemoryGradle.js`, `plugins/withGitVersionName.js` | ours | low-memory Gradle settings, versionName with git sha | Chosen |
| Metro, Hermes, New Architecture | Expo 55 defaults | bundler, JS engine | Generated (prebuild defaults) |
| Jest, babel-jest, @testing-library/react-native | 29.7.0, 29.7.0, 12.9.0 | 223 tests in 16 files (`jest.core.config.js`) | Inherited |
| Yarn via Corepack, Node.js | 4.5.0, 24 | monorepo install | Inherited (Yarn), Chosen (Node) |
| Android TV emulator | system image android-34;android-tv;x86 | development testing | Chosen |
| Claude Code | n/a | AI coding tool (see [PRE_EXISTING.md](PRE_EXISTING.md)) | Chosen |

Signing: the APK is signed with the template's generated debug keystore, not a production key; it is a demo build.

## Inherited from the Amazon sample and not used by the current app

lottie-react-native, @expo/vector-icons (used only by unused sample components), expo-system-ui, expo-status-bar, react-native-web, expo-constants, ts-jest, `assets/tv_icons`, `assets/images`. They were not removed or changed. The font `assets/fonts/SpaceMono-Regular.ttf` also came with the sample and is used (`app/_layout.tsx`).

About 790 other npm packages are installed transitively and were not individually reviewed. Thodu TV uses no AWS service.
