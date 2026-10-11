Thodu — the TV that adapts to you.
Thodu (తోడు) means 'a companion by your side' in Telugu.

## What it is

An accessibility-first Fire TV / Android TV app for elderly and disabled viewers.
Work in progress: today it is the Amazon multi-TV sample running as a Thodu-branded
Android TV app (home screen with four focusable tiles, D-pad navigation).

Layout: a Yarn 4 workspaces monorepo.

- `packages/expotv` - the Expo TV app (Expo SDK 55, react-native-tvos 0.83)
- `packages/shared` - shared screens, components and data

## Build & run

These are the steps that worked for us on the Android TV emulator (Windows).

Prerequisites: Node.js, Yarn 4.5.0, JDK 17 (Temurin 17; JDK 25 breaks the Android Gradle plugin prefab step),
Android SDK with an Android TV system image.

```bash
# 1. install dependencies (from the repo root)
yarn workspaces focus @thodu/expotv

# 2. generate the native Android project (sets EXPO_TV=1)
yarn expotv:prebuild

# 3. build a release APK (JS bundle embedded, no Metro needed)
#    run with JAVA_HOME pointing at JDK 17
cd packages/expotv/android
./gradlew assembleRelease

# 4. install and launch on a running emulator or device
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell monkey -p com.thodu.tv -c android.intent.category.LEANBACK_LAUNCHER 1
```

Tips that mattered:

- Keep the repo path short (about 15 characters or fewer on Windows). Native builds fail with
  "Filename longer than 260 characters" otherwise.
- For an x86 emulator image, add `reactNativeArchitectures=x86` to the generated
  `packages/expotv/android/gradle.properties` to build only that ABI. On a low-memory PC also use
  `org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m`, `org.gradle.workers.max=2` and
  `org.gradle.parallel=false`. The `android/` folder is generated, so these edits are not committed.
- The first release build took about 19 minutes on our machine.

## License

MIT. See `LICENSE`. Third-party credits are in `NOTICE`.
