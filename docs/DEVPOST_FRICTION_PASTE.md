# Thodu TV: Devpost friction log paste

Paste-ready text for the optional Friction Log field (the rules ask for: "specific task attempted, steps taken, expected vs. actual result, severity rating, workaround used, and actionable suggestion"). Every entry below is copied from [../FRICTION_LOG.md](../FRICTION_LOG.md), which was written from the developer's working log on 2026-10-11 and 2026-10-12 and not reconstructed later (F-034 and F-035 are the exception: the developer reported them on 2026-10-18 about the 2026-10-14 cloud session, tagged [user-reported]). Severity and time lost are the developer's own rating, not Amazon's. Where a detail was not recorded the entry says "not recorded". The exact Devpost form layout and character limits were not available when this file was made: split by block if a box is too small.

Environment: Windows 11 Pro, solo developer, React Native + Expo (react-native-tvos 0.83.6-0), Android TV emulator (Android 14 TV image, x86). No notes were kept during the 2026-10-14 Amazon cloud-device session; the only entries about it (F-034, F-035) are user-reported from memory, with the recordings as the only file evidence.

## Part 1. Amazon sample and Fire TV / Android TV stack (11 entries)

**F-006: expo-template-tv pins an old stack that cannot build on JDK 25**
- Tool: Expo + react-native-tvos (expo-template-tv), Gradle 8.3, Android Studio bundled JBR (JDK 25)
- Task attempted: Build and run the project from the `expo-template-tv` template.
- Steps taken: Created the project from `--template expo-template-tv`. The template pins react-native-tvos 0.72.4 / Expo 50 alpha, so it uses Gradle 8.3. Built with the Android Studio JBR (JDK 25) and Gradle failed. Switched to the current with-tv example (Expo 57, RN 0.86, Gradle 9.3.1).
- Expected: The template builds with the JDK shipped with Android Studio.
- Actual: `BUG! exception in phase 'semantic analysis' in source unit '_BuildScript_' Unsupported class file major version 69`
- Severity (our rating) and time lost: Blocker (forced a different approach)   (time lost: ~25 min)
- Workaround: Switched to the current with-tv example.
- Suggestion: Mark `expo-template-tv` as outdated in its README/npm description and add a compatibility table (template version -> Gradle version -> supported JDK versions) so the JDK 25 / Gradle 8.3 mismatch is visible before building.

**F-014: Expo 57 / RN 0.86 with-tv example installs but crashes at start**
- Tool: Expo 57 + react-native-tvos 0.86 (with-tv example)
- Task attempted: Run the release APK of the with-tv example on the TV emulator.
- Steps taken: Installed the release APK on the emulator. Launched with `monkey -c LEANBACK_LAUNCHER` and with `am start -n <app-id>/.MainActivity`. Both started the process, which then died; the TV launcher kept focus. Read `adb logcat -d -b crash`.
- Expected: The app comes to the foreground.
- Actual: `JavascriptException: Invariant Violation: View config getter callback for component 'RCTText' must be a function (received 'undefined')` (FATAL EXCEPTION: mqt_v_native). Cause not investigated; possibly an Expo / react-native-tvos version mismatch in the example.
- Severity (our rating) and time lost: Minor   (time lost: ~6 min)
- Workaround: None at the time; later we used the Amazon sample instead (F-017).
- Suggestion: Test the with-tv example against current react-native-tvos before publishing, or pin the Expo/RN-tvos versions that are known to work together in its package.json and README.

**F-015: Amazon sample needs a workspace-focused Yarn install**
- Tool: Amazon RN multi-TV sample (react-native-multi-tv-helloworld), Yarn 4 monorepo
- Task attempted: Install the dependencies of the sample for the Android TV build only.
- Steps taken: Noted the lockfile includes `@amazon-devices/*` packages for the Vega app, and a full install needs Amazon's package-manager config for Vega (README: "Configure Yarn for Vega"). Ran `yarn workspaces focus @multitv/expotv` through `npx @yarnpkg/cli-dist@4.5.0` (no global install, scripts off, caches on D:).
- Expected: A dependency install that works for the Android TV package.
- Actual: No error; the focused install worked from the lockfile in 2m 45s.
- Severity (our rating) and time lost: Minor   (time lost: ~5 min, working out the install route)
- Workaround: `yarn workspaces focus @multitv/expotv`.
- Suggestion: Add a README section "Android TV only (no Vega)" with the `yarn workspaces focus @multitv/expotv` command.

**F-016: Native build fails on the 260-character path limit**
- Tool: Amazon RN multi-TV sample, Windows path limits (ninja / CMake)
- Task attempted: Build the sample's release APK from the first clone location.
- Steps taken: Cloned the sample under `<sample-clone>` and ran the release build. The build failed after about 13 min in native code (ninja). Confirmed Windows LongPathsEnabled=1 did not help. Moved the clone to a much shorter path (`<workdir>\tv`), recreated the @multitv/shared junction, re-ran prebuild and reapplied gradle.properties.
- Expected: The build passes (the sample README does not mention a path limit).
- Actual: `ninja: error: Stat(safeareacontext_autolinked_build/CMakeFiles/react_codegen_safeareacontext.dir/D_/<path>/packages/expotv/node_modules/react-native-safe-area-context/common/cpp/.../RNCSafeAreaViewShadowNode.cpp.o): Filename longer than 260 characters`
- Severity (our rating) and time lost: Major   (time lost: ~35 min, 13 min failed build plus diagnosis and redo)
- Workaround: Moved the clone to a short path. Rule of thumb: keep the repo root under about 15 characters on Windows. A junction or subst would not help because Node resolves them back to the long path.
- Suggestion: Add a Windows note to the sample README (clone to a short path such as `C:\s` or similar, under about 15 characters, because the build directory embeds the full source path twice), and have the build fail early with a clear path-length message.

**F-017: Amazon sample builds and runs; the Expo 57 crash does not recur**
- Tool: Amazon RN multi-TV sample (Expo 55.0.24, react-native-tvos 0.83.6-0, React 19.2.0, Gradle 9.0.0)
- Task attempted: Build the sample with JDK 17 and run it on the TV emulator.
- Steps taken: Built with JDK 17 (x86 only): build 19m 1s, 37 MB APK. Installed and launched via LEANBACK_LAUNCHER. Sent D-pad keys RIGHT, DOWN, CENTER.
- Expected: The app runs.
- Actual: No error; the app ran without the RCTText crash seen in F-014, focus moved and a fetched joke showed. We did not verify whether any Amazon guide points to the with-tv example, so F-014 stays [Dev].
- Severity (our rating) and time lost: Minor   (time lost: 0 min)
- Workaround: n/a
- Suggestion: Record the known-good version set (Expo 55.0.24, react-native-tvos 0.83.6-0, Gradle 9.0.0, JDK 17) in the sample README so Windows developers can see what the sample was verified with.

**F-019: Summary of the two projects tried (corrected)**
- Tool: Expo + react-native-tvos (with-tv example) and Amazon RN multi-TV sample
- Task attempted: Get one React Native TV project running on the Android TV emulator.
- Steps taken: Built the Expo 57 / react-native-tvos 0.86 hello-tv: it built but crashed at startup (F-014). Built the Amazon multi-tv-helloworld Expo 55 sample (react-native-tvos 0.83.6-0): the first build failed on the 260-character path limit (F-016). Moved the clone to a short path; the sample ran and responded to D-pad keys (F-017).
- Expected: A project builds and runs on the emulator.
- Actual: `JavascriptException: Invariant Violation: View config getter callback for component 'RCTText' must be a function (received 'undefined')` (Expo 57 hello-tv); `ninja: error: Stat(...RNCSafeAreaViewShadowNode.cpp.o): Filename longer than 260 characters` (sample, first attempt). No Amazon guide was shown to tell us to do a step that failed.
- Severity (our rating) and time lost: Major   (time lost: see F-014 (~6) and F-016 (~35))
- Workaround: Use the Amazon sample from a short path.
- Suggestion: See F-016 (Windows short-path note in the sample README) and F-014 (pin working versions for the with-tv example).

**F-020: A "web" layout file was deleted by mistake; the sample uses it on TV (corrected)**
- Tool: Amazon RN multi-TV sample (packages/expotv layouts)
- Task attempted: Remove other-platform files from the sample.
- Steps taken: Deleted `packages/expotv/layouts/TabLayout.web.tsx`, assuming it was web-only. The native build took 6m22s and the release JS bundle then failed. Found that `TabLayout.tsx` imports it explicitly and uses it as the TV layout (`Platform.isTV` returns the "web" tab layout). Restored the file from the import commit and amended the unpushed commit; the rebuild passed (6m38s).
- Expected: Files with a `.web` suffix are not used on TV.
- Actual: `Unable to resolve module ./TabLayout.web from <repo>\packages\expotv\layouts\TabLayout.tsx` (Task :app:createBundleReleaseJsAndAssets FAILED). The cause was our own wrong assumption, not an Amazon error.
- Severity (our rating) and time lost: Minor   (time lost: ~15 min)
- Workaround: Keep TabLayout.web.tsx; do not judge a platform file by its suffix. The Expo TV sample uses the .web layout for TV.
- Suggestion: In the sample, add a comment in `TabLayout.tsx` (or the README) that `TabLayout.web.tsx` is the TV layout, or rename it to a TV-specific name.

**F-022: The sample's jest config in packages/shared cannot start**
- Tool: Amazon sample (jest in packages/shared, @testing-library/react-native preset)
- Task attempted: Run `yarn test` in packages/shared.
- Steps taken: Ran the sample's test script; the preset failed to resolve `react-native/jest-preset`. Found react-native is nohoisted into packages/expotv, so it does not resolve from packages/shared. Added a separate `jest.core.config.js` (babel-jest, node environment, src/core only), pointed `test` at it and kept the old config as `test:rn`.
- Expected: The sample's tests run.
- Actual: `Cannot find module 'react-native/jest-preset'` (the sample's own scaling test never ran).
- Severity (our rating) and time lost: Minor   (time lost: ~4 min)
- Workaround: Pure logic lives in src/core and is tested without the RN preset.
- Suggestion: Fix the sample so the shared package's jest config can resolve `react-native/jest-preset` (declare react-native as a devDependency there, or set the preset path explicitly), or remove the unusable test script.

**F-023: yarn and tsc are not directly runnable in the sample setup**
- Tool: Yarn / TypeScript setup in the Amazon sample
- Task attempted: Run the sample's tests and a type check.
- Steps taken: Typed `yarn test`; yarn was not on PATH (our runner calls `npx @yarnpkg/cli-dist`). Ran the same script through jest (`npx jest -c jest.core.config.js` in packages/shared). Tried `tsc` in packages/expotv; it is not installed there. Checked shared with the TypeScript binary from expotv.
- Expected: `yarn test` and `tsc` run.
- Actual: `yarn: command not found`; `This is not the tsc command you are looking for`
- Severity (our rating) and time lost: Minor   (time lost: ~3 min)
- Workaround: Call node_modules binaries directly.
- Suggestion: In the sample README, explain how to get Yarn 4 on PATH (for example `corepack enable`) and add `typescript` as a devDependency to packages/expotv so `tsc` works there.

**F-025: Scanning mode lost most OK presses**
- Tool: react-native-tvos (useTVEventHandler, onHWKeyEvent, key delivery on Android)
- Task attempted: Single-button scanning navigation driven by TV remote key events.
- Steps taken: Set every item to `focusable={false}` in scanning mode; most OK presses were lost. Logged every TV event; the debug log showed zero events after the first screen change. Read ReactAndroidHWInputDeviceHelper and ReactRootView.dispatchKeyEvent in node_modules. Kept one invisible focusable "sink" view on the active screen while scanning.
- Expected: `useTVEventHandler` receives every remote key press.
- Actual: With no focused view Android does not deliver key events down the focus path to ReactRootView, so react-native-tvos never emits `onHWKeyEvent` (it had worked only while a stale view still held focus). No error; 6 of 6 test key presses delivered after the fix, 0 of 6 before.
- Severity (our rating) and time lost: Major   (time lost: ~35 min)
- Workaround: Always keep a focused view inside the React root when using TV key events without focusable children.
- Suggestion: In the react-native-tvos documentation for `useTVEventHandler`, state that events are only delivered while some view inside the React root has focus, and show the "invisible focusable sink" pattern for apps that handle keys globally.

**F-026: Focus ring border changed layout; helper spawn failed**
- Tool: react-native-tvos focus styling (Pressable); Node spawnSync on Windows
- Task attempted: Draw a thick focus ring for low-vision mode and add the expo-speech dependency.
- Steps taken: Drew the focus ring as a border on the Pressable; at ring width 10 each card grew by 20 px and the setup list no longer fit with its Continue button. Redrew the ring as an absolutely positioned overlay outside the box. Ran the yarn add (expo-speech) from our helper script via `spawnSync('cmd.exe', ...)`, which failed under Git Bash with a custom env; ran it directly from PowerShell.
- Expected: A thick focus ring without layout changes; the helper script runs yarn add.
- Actual: Layout grew with the border; `spawnSync cmd.exe ENOENT`.
- Severity (our rating) and time lost: Minor   (time lost: ~15 min)
- Workaround: Overlay ring; run yarn from PowerShell.
- Suggestion: In the TV focus guidance, recommend drawing focus indicators as overlays (or with transforms) rather than borders so large accessibility focus rings do not change layout.

## Part 2. Other build tooling met on the way (22 entries)

**F-001: sdkmanager cannot find the system image when called from PowerShell**
- Tool: Android SDK cmdline-tools (sdkmanager), Windows
- Task attempted: Install the Android TV system image with sdkmanager.
- Steps taken: Passed the package name (`system-images;android-34;android-tv;x86`) to sdkmanager from PowerShell. sdkmanager reported the package as not found (cmd splits on ";"). Moved the call into a Node script that quotes the package name (windowsVerbatimArguments).
- Expected: sdkmanager installs the named package.
- Actual: `Package system-images not found.` / `Package android-34 not found.` / `Package android-tv not found.` / `Package x86 not found.`
- Severity (our rating) and time lost: Minor   (time lost: ~2 min)
- Workaround: Quote the package name inside a Node script (windowsVerbatimArguments).
- Suggestion: When sdkmanager receives a package name that was split on ";", print a hint such as "package ids contain ';' - quote the whole id on Windows", and add a Windows/PowerShell quoting example to the sdkmanager documentation.

**F-002: Command-line Tools and Android Studio missing from the expected folders**
- Tool: Android SDK cmdline-tools / Android Studio install
- Task attempted: Set up the SDK on the D: drive and continue with the emulator.
- Steps taken: Looked for cmdline-tools in `<sdk>`; the `cmdline-tools` folder did not exist. Looked for Android Studio at the planned D: location; it was installed under Program Files on C: instead. Stopped and waited for the human, who installed cmdline-tools via SDK Manager.
- Expected: not recorded.
- Actual: no error text; `<sdk>\cmdline-tools` did not exist, so setup stopped.
- Severity (our rating) and time lost: not recorded   (time lost: not recorded; "not measured, waited for human")
- Workaround: The human installed cmdline-tools via SDK Manager.
- Suggestion: In the Android Studio / SDK setup guide, state that command-line tools are a separate SDK Manager package that is not part of the base SDK folder, and that Android Studio may ignore a custom install location.

**F-003: No x86_64 Android TV system image for API 31-34**
- Tool: Android SDK system images (Android TV)
- Task attempted: Choose a system image for the Android TV emulator.
- Steps taken: Listed packages with `sdkmanager --list`. Found TV images for android-31, 33 and 34 only as x86 and arm64. Used `system-images;android-34;android-tv;x86`.
- Expected: not recorded.
- Actual: no x86_64 TV image exists for API 31-34, only x86 and arm64.
- Severity (our rating) and time lost: Minor   (time lost: 0 min)
- Workaround: Used the x86 TV image (API 34).
- Suggestion: Add a short table to the Android TV / Fire TV emulator documentation listing which ABIs exist per API level for TV images, so developers on x86_64 PCs know to pick x86.

**F-004: First emulator boot is slow and logs an OpenGL fallback**
- Tool: Android Studio emulator
- Task attempted: Boot the Android TV AVD for the first time.
- Steps taken: Launched the AVD with `-gpu auto`. Waited about 180 s until `sys.boot_completed=1`. Read the emulator log.
- Expected: not recorded.
- Actual: Boot succeeded after about 180 s; log shows `Critical: Failed to load opengl32sw (The specified module could not be found.)` / `Warning: Software OpenGL failed. Falling back to system OpenGL.`
- Severity (our rating) and time lost: Minor   (time lost: ~3 min, boot wait only)
- Workaround: None needed.
- Suggestion: Downgrade the "Critical:" log level for the opengl32sw load failure when the fallback succeeds, or add a note that it is harmless, so first-time users do not read it as a boot failure.

**F-005: create-expo-app with the with-tv example fails twice**
- Tool: Expo create-expo-app (with-tv example)
- Task attempted: Create a TV project with `npx create-expo-app@latest hello-tv --example with-tv --no-install`.
- Steps taken: Ran the command above; it failed and left a partial folder. Ran it again; it failed again. Tried `--template expo-template-tv` (see F-006). Later fetched the with-tv example files directly from GitHub with a small script.
- Expected: A project folder with the example files is created.
- Actual: `Can't read JSON file: <workdir>\hello-tv\package.json ... ENOENT`, followed by `TypeError [ERR_INVALID_ARG_TYPE]: The "code" argument must be of type number. Received type string ('ENOENT')`
- Severity (our rating) and time lost: Blocker (forced a different approach)   (time lost: ~10 min)
- Workaround: Fetched the example files straight from GitHub.
- Suggestion: Make create-expo-app handle a failed example download without leaving a partial folder, and fix the error path so it passes a numeric exit code (the TypeError hides the real failure).

**F-007: expo run:android rejects the adb serial and logs nothing when detached**
- Tool: Expo CLI (expo run:android)
- Task attempted: Run the app on the running emulator with `expo run:android --device emulator-5554`.
- Steps taken: Ran `expo run:android --device emulator-5554`; it rejected the serial. Spawned it detached; the log file stayed empty. Watched the empty log with a 30 min monitor. Re-ran with the AVD name and an attached log file.
- Expected: The device is accepted by its adb serial.
- Actual: `CommandError: Could not find device with name: emulator-5554`; the detached spawn produced an empty log.
- Severity (our rating) and time lost: Major   (time lost: ~35 min, including a 30 min monitor watching an empty log)
- Workaround: Use the AVD name (`--device <avd-name>`) and spawn with an attached log file.
- Suggestion: Accept adb serials for `--device`, or have the error message list the accepted device names (AVD names) it did find.

**F-008: Background Gradle build stopped for low memory**
- Tool: Gradle build started via expo run:android
- Task attempted: Build the Expo 57 / RN 0.86 project in the background.
- Steps taken: Started the build through `expo run:android` in the background. The task was reported killed for low memory; the log ends mid-build. Did not restart it at that point.
- Expected: not recorded.
- Actual: No error from Gradle; the task was reported as killed for low memory. (F-011 later found a leftover Gradle daemon from the first failed build was still running.)
- Severity (our rating) and time lost: not recorded   (time lost: "not yet measured"; not recorded)
- Workaround: None at the time; see F-011 (stopped the leftover daemon).
- Suggestion: Document the memory needs of an Expo/RN TV Gradle build (recommended free RAM, and a note that failed builds leave a Gradle daemon running) and recommend `gradlew --stop` before a retry.

**F-009: Gradle fails once on DNS for Maven Central**
- Tool: Gradle / Maven Central
- Task attempted: Build the Expo 57 / RN 0.86 project (assembleRelease).
- Steps taken: Ran the Gradle build; it failed while downloading from Maven Central. Re-checked DNS. Retried once; the build worked.
- Expected: Dependencies download.
- Actual: `Could not GET 'https://repo.maven.apache.org/maven2/net/java/dev/jna/...' > No such host is known (repo.maven.apache.org)`
- Severity (our rating) and time lost: Minor   (time lost: ~5 min)
- Workaround: Re-check DNS, then retry once.
- Suggestion: Not an Amazon issue; the sample's troubleshooting section could mention that transient network errors in a first Gradle build are fixed by a plain retry.

**F-010: AGP prefab step fails on JDK 25 because a JDK warning is treated as an error**
- Tool: Gradle / Android Gradle Plugin (prefab step), Android Studio bundled JBR (JDK 25)
- Task attempted: Run assembleRelease (x86 only) with the Android Studio JBR.
- Steps taken: Ran assembleRelease; it failed at `:app:configureCMakeRelWithDebInfo[x86]`. Added `--enable-native-access` to `org.gradle.jvmargs`; no effect. Added `JDK_JAVA_OPTIONS`; it made it worse because the "Picked up JDK_JAVA_OPTIONS" note is also written to stderr. Concluded a JDK 17 or 21 was needed as JAVA_HOME (continued in F-012).
- Expected: The native build step passes.
- Actual: `Caused by: java.lang.IllegalStateException: WARNING: A restricted method in java.lang.System has been called at ...GeneratePrefabPackagesKt.reportErrors(GeneratePrefabPackages.kt:304)`; second form `NOTE: Picked up JDK_JAVA_OPTIONS: --enable-native-access=ALL-UNNAMED`
- Severity (our rating) and time lost: Blocker (forced a different approach)   (time lost: ~20 min)
- Workaround: A JDK 17 as JAVA_HOME (see F-012). No other fix was found.
- Suggestion: In AGP, do not treat any stderr output of the prefab child process as an error (only a non-zero exit code); and publish a supported-JDK note for Expo/React Native Android builds (17 or 21) so Android Studio's bundled JBR 25 is not assumed to work.

**F-011: RAM was not the problem; leftover daemon and SDK auto-install**
- Tool: Gradle / Android SDK auto-install
- Task attempted: Re-check why the earlier build was reported as low on memory (F-008).
- Steps taken: Measured free RAM: 6.4 GB before, 7-9 GB during the build. Observed Gradle auto-installing Build-Tools 35, Platform 36, CMake 3.22.1 and NDK 27.1 into the SDK folder (licenses already accepted). Stopped the leftover Gradle daemon from the first failed build and ran with a trimmed gradle.properties.
- Expected: not recorded.
- Actual: No error. The earlier "low memory" kill happened while a leftover Gradle daemon from the first failed build was still running.
- Severity (our rating) and time lost: Minor   (time lost: 0 min)
- Workaround: Stopped the leftover daemon and used a trimmed gradle.properties.
- Suggestion: Document that the first build downloads several SDK components (Build-Tools, Platform, CMake, NDK) so the disk space and time are expected.

**F-012: JDK 17 fixes the prefab failure**
- Tool: JDK 17 (Eclipse Temurin) with Gradle
- Task attempted: Resolve F-010 by installing a JDK 17 and building again.
- Steps taken: Downloaded the Temurin 17.0.20.1 portable zip and verified its SHA-256 against the Adoptium API. Extracted it to `<jdk17>`. Pointed JAVA_HOME and `org.gradle.java.home` to it for this project only. Ran assembleRelease again.
- Expected: The build passes with JDK 17.
- Actual: BUILD SUCCESSFUL in 10m 3s (x86 only, release APK 27.5 MB).
- Severity (our rating) and time lost: Minor   (time lost: ~8 min for download/extract/config; the build itself took 10 min)
- Workaround: JAVA_HOME and `org.gradle.java.home` point to `<jdk17>` for this project only.
- Suggestion: State a required JDK version (17) in the sample/template README for Android builds, with the `org.gradle.java.home` setting as the per-project way to select it.

**F-013: org.gradle.java.home with single backslashes fails at startup**
- Tool: Gradle (gradle.properties)
- Task attempted: Set `org.gradle.java.home` to the JDK 17 folder on Windows.
- Steps taken: Wrote the path with single backslashes in gradle.properties (an edit was refused earlier because the file had not been read first). Gradle failed immediately; Java properties parsed the path as `<jdk17>` without its backslashes. Rewrote the path with escaped backslashes.
- Expected: Gradle starts with the JDK 17.
- Actual: Gradle failed at startup on the invalid java home (exact text not recorded; the log was overwritten).
- Severity (our rating) and time lost: Minor   (time lost: ~3 min)
- Workaround: Write the path with escaped backslashes (or forward slashes).
- Suggestion: Have Gradle print the parsed value of `org.gradle.java.home` in its startup error, and add a Windows note (escape backslashes) next to the property in the Gradle documentation.

**F-018: gradlew --stop without JAVA_HOME leaves daemons that block a folder move**
- Tool: Gradle wrapper (gradlew --stop)
- Task attempted: Stop Gradle daemons before moving the project folder.
- Steps taken: Ran `gradlew --stop` from a shell without JAVA_HOME; it failed. Tried to move the folder; the daemons held files and the move was denied. Ran `--stop` through the runner script that sets JAVA_HOME.
- Expected: The daemons stop and the folder can be moved.
- Actual: `ERROR: JAVA_HOME is not set` / `Access to the path ... is denied.`
- Severity (our rating) and time lost: Minor   (time lost: ~3 min)
- Workaround: Always run gradlew via the runner script environment.
- Suggestion: Have the gradle wrapper's `--stop` fall back to stopping daemons found in the Gradle user home when JAVA_HOME is not set, or print which daemons are still running.

**F-021: expo prebuild --clean overwrites gradle.properties; yarn writes CRLF**
- Tool: Expo prebuild + Yarn
- Task attempted: Regenerate the Android project and keep the low-memory build settings.
- Steps taken: Ran `expo prebuild --clean`, which regenerated `packages/expotv/android`, including gradle.properties. Re-applied by hand the low-memory settings (x86 only, 2 workers, no parallel, JDK 17 path). Ran `yarn install --mode=update-lockfile`, which wrote yarn.lock with CRLF line endings, and converted it to LF.
- Expected: Build settings survive a prebuild; the lockfile keeps LF.
- Actual: `warning: in the working copy of 'yarn.lock', CRLF will be replaced by LF the next time Git touches it`
- Severity (our rating) and time lost: Minor   (time lost: ~5 min)
- Workaround: Re-apply the settings after prebuild (documented in our README); convert yarn.lock to LF.
- Suggestion: Let Expo prebuild keep user-set gradle.properties values through a config plugin or documented override file, and have Yarn on Windows write LF lockfiles (or document `.gitattributes` for yarn.lock).

**F-024: Release build succeeds in 15 s but ships stale JavaScript**
- Tool: Gradle bundle task (`:app:createBundleReleaseJsAndAssets`) in the Expo release build
- Task attempted: Rebuild the release APK after editing screens in packages/shared.
- Steps taken: Edited screens in packages/shared and ran `gradlew assembleRelease`. Build finished with BUILD SUCCESSFUL in 15 s; the emulator showed the old layout. Saw the bundle task marked UP-TO-DATE (Gradle does not track the workspace package outside android/ as an input). Re-ran with `:app:createBundleReleaseJsAndAssets --rerun assembleRelease`. Separately, our runner script crashed once on a task name containing ":" in a log file name, so a further ~15 min wait produced no build.
- Expected: The bundle is rebuilt after JS changes.
- Actual: `> Task :app:createBundleReleaseJsAndAssets UP-TO-DATE` (no error; stale output).
- Severity (our rating) and time lost: Major   (time lost: ~25 min)
- Workaround: Always force `--rerun` on the bundle task after editing JS in packages/shared.
- Suggestion: Declare the monorepo workspace JS sources (such as packages/shared) as inputs of the Expo bundle Gradle task so it is not UP-TO-DATE after edits, or document the `--rerun` workaround.

**F-027: Shell tool cut off multi-line heredocs**
- Tool: AI coding-agent shell tool on Windows (Git Bash)
- Task attempted: Write multi-line source and test files through the shell tool.
- Steps taken: Sent several multi-line heredocs containing quotes and backticks; some were cut off or rejected, and one test file was silently truncated to 54 lines. A stray `python3 -` call hung for two minutes (Windows Store python stub). A failed `cd` let a cleanup `rm -f *.mjs` run in an unrelated repository; nothing matched and nothing was lost (checked with git status). Switched to the Write/Edit tools for files and absolute paths for cleanup.
- Expected: The heredocs are written in full.
- Actual: `unexpected EOF while looking for matching '`; command timed out after 120 s
- Severity (our rating) and time lost: Minor   (time lost: ~8 min, approximate)
- Workaround: Write tool for any file with quotes; absolute paths in cleanup commands.
- Suggestion: For agent tooling vendors: reject or warn when a heredoc ends early (instead of silently truncating a file), and avoid running `rm` after a failed `cd` in the same command.

**F-028: Offline simulation methods did not work on the Ethernet-only TV emulator**
- Tool: Android TV emulator (Ethernet-only TV image), adb
- Task attempted: Simulate no internet to see the app's failure screen.
- Steps taken: Tried `svc wifi disable` / `svc data disable`; no effect (`svc data` says "Can't find service: phone"). Set Private DNS to an invalid host; no effect (netd had the name cached, the send still succeeded). Set the global proxy via the legacy `http_proxy` key; no effect (wrong key). Used the proper `global_http_proxy_host/port` keys; worked, but clearing them needed `settings put global http_proxy :0` and until then the app stayed offline. Used the emulator console `adb emu network delay 20000`, which showed the real failure screen; restored the network afterwards and checked it.
- Expected: Disabling wifi/data makes the device offline.
- Actual: The honest-failure screen did not appear because the send kept succeeding.
- Severity (our rating) and time lost: Major   (time lost: ~20 min, 03:08 to 03:28 by the key log)
- Workaround: `adb emu network delay 20000` for failure, `network delay none` to restore; clear any proxy with `http_proxy :0`.
- Suggestion: In the Android TV / Fire TV emulator documentation, add a "test offline" section stating that TV images are Ethernet-only and that `adb emu network delay` (or the emulator network controls) is the supported way to simulate a lost connection.

**F-029: System font scale 1.3 barely changed the Home screen**
- Tool: Android 14 font scaling with React Native Text
- Task attempted: Verify that the UI follows the system font size (scale 1.3).
- Steps taken: Set the system font scale to 1.3 and relaunched; the Home title did not grow and tile labels grew about 12% (found by the large-font screenshot). Identified Android 14+ non-linear scaling, and that our first version also divided the OS scale out, cancelling the rest. Ignored the OS scale in our own Text wrapper (`allowFontScaling=false`) and applied our capped system-scale multiplier ourselves. Ran build #2 (1m 11s) and re-checked.
- Expected: Text grows by about 1.3x.
- Actual: No error (visual); the title did not grow and labels grew about 12%.
- Severity (our rating) and time lost: Minor   (time lost: ~8 min plus build #2 of 1m 11s)
- Workaround: Shared Text wrapper in packages/shared/src/components/Text.tsx
- Suggestion: In the React Native accessibility/font-scaling documentation, add a note that Android 14+ scales large text non-linearly, so `fontScale` is not a linear multiplier for text sizes.

**F-030: Deep link to a route already on the stack keeps the old screen state**
- Tool: Android deep links (`am start -d`) with expo-router
- Task attempted: Open the Help route with `am start -d thodu://help` to capture failure screenshots.
- Steps taken: Ran `am start -d thodu://help` while that route was already on the stack. The old screen state remained, so several early "failure" screenshots showed the old success screen. Force-stopped and relaunched before each deep link; read each screenshot instead of trusting file sizes.
- Expected: The deep link opens a fresh route.
- Actual: No error; the existing route kept its old state (misleading evidence).
- Severity (our rating) and time lost: Minor   (time lost: ~5 min)
- Workaround: Force-stop and relaunch before each deep link.
- Suggestion: In expo-router deep-link testing docs, note that opening a route already on the stack keeps its state and recommend a force-stop before testing.

**F-031: `packageManager` names Yarn 4 but `yarn` is not on the PATH**
- Tool: Yarn 4 (Berry) with Node.js 24 and Corepack
- Task attempted: Follow the README on a fresh clone: `yarn workspaces focus @thodu/expotv`.
- Steps taken: Ran `yarn --version` on a machine with Node 24: "command not found". Found Corepack present (`corepack --version`) and ran the same command as `corepack yarn ...`, which fetched Yarn 4.5.0 from the `packageManager` field.
- Expected: The repository's declared package manager runs without extra setup.
- Actual: Command not found; the error gave no hint that Corepack exists.
- Severity (our rating) and time lost: Minor   (time lost: ~3 min)
- Workaround: Prefix every Yarn command with `corepack yarn`; README updated.
- Suggestion: In the Expo/Yarn setup docs, state that Corepack must be enabled (or commands prefixed with `corepack`) when a project pins Yarn 4 through `packageManager`.

**F-032: Android Gradle build finds out about the missing SDK only after minutes of work**
- Tool: Gradle 9.0.0, Android Gradle plugin, Expo prebuild
- Task attempted: First release build on a fresh clone with only JAVA_HOME set.
- Steps taken: Ran `./gradlew assembleRelease` (the Gradle distribution was downloaded first). After 4 min 49 s, with 28 tasks executed, it failed: "SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable". Set ANDROID_HOME to the SDK folder and ran it again.
- Expected: The SDK location is checked at the start, or `expo prebuild` warns about it.
- Actual: The error appeared only during project configuration, after the Gradle download and 28 tasks.
- Severity (our rating) and time lost: Minor   (time lost: ~5 min)
- Workaround: Set ANDROID_HOME before building; README now says so.
- Suggestion: In the React Native / Expo Android setup docs, list ANDROID_HOME next to JAVA_HOME as a required environment variable for command-line builds, and have `expo prebuild` warn when it is missing.

**F-033: One dropped connection failed a 27-minute multi-ABI native build**
- Tool: Gradle 9.0.0 with CMake and prefab (react-native-gesture-handler)
- Task attempted: Release build for arm64-v8a, armeabi-v7a and x86 on a low-memory PC.
- Steps taken: The build failed after 27 min 30 s at `:react-native-gesture-handler:configureCMakeRelWithDebInfo[arm64-v8a]`: it could not download core-ktx-1.16.0.aar ("Network is unreachable"). Checked that the same host was reachable again, then re-ran the same command; Gradle reused finished tasks and the build succeeded in 13 min 50 s.
- Expected: Dependencies are resolved before the long native compilation, or the download is retried.
- Actual: A dependency first needed during the native configure step was fetched late, and one transient failure ended the build.
- Severity (our rating) and time lost: Major   (time lost: ~28 min)
- Workaround: Re-ran the build after confirming the network.
- Suggestion: In the React Native Android build docs, suggest warming the dependency cache (for example `./gradlew dependencies`) before the first long build on an unreliable network, and note that re-running resumes from cached tasks.

## Part 3. Amazon cloud devices, user-reported (2 entries, within the 35 total)

**F-034: The Live Device Interaction recording shows only the device screen, so it cannot prove a Fire TV** [user-reported]
- Tool: Appstore Quality Central > Live Device Interaction, built-in screen recording (cloud Fire TV device)
- Task attempted: Record a cloud Fire TV session as proof for the hackathon video.
- Steps taken: Started a Live Device Interaction session on 2026-10-14 and used the built-in recording (three recordings, about 2:00, 2:00 and 1:43, 1920x1080). Checked the saved files afterwards [user-reported].
- Expected: The recording shows enough to identify the device (Amazon console UI or the device name/model).
- Actual: The built-in recording captures only the device screen, with no Amazon UI and no device name, so it cannot by itself prove a Fire TV [user-reported]. The three files show only the app full-screen.
- Severity (our rating) and time lost: Low-medium (user's rating; time lost not recorded)
- Workaround: Record the whole browser window with a separate screen recorder.
- Suggestion: Offer a window-level recording, or burn the device name/model into the capture.
- Evidence: The three 2026-10-14 recordings in the developer's Downloads folder (`recording.mp4`, `recording (1).mp4`, `recording (2).mp4`; outside this repo). The statement about the cause is [user-reported].

**F-035: Unclear at first how to choose between the cloud devices "FOS 14 3P TV" and "Smart TV - Amazon Fire TV"** [user-reported]
- Tool: Appstore Quality Central > Live Device Interaction, device list (cloud Fire TV devices)
- Task attempted: Choose a cloud device for a Live Device Interaction session.
- Steps taken: Opened the device list and saw "FOS 14 3P TV" and "Smart TV - Amazon Fire TV". Worked out the difference after some time [user-reported]; how long was not recorded.
- Expected: The list makes the model and Fire OS version of each device clear.
- Actual: The user did not understand at first how to choose between the two, and understood after some time [user-reported].
- Severity (our rating) and time lost: Low (user's rating; time lost not recorded)
- Workaround: Worked it out by trial (details not recorded).
- Suggestion: Show the Fire OS version and model clearly in the device list.
- Evidence: User statement only; no file.

## Top 5 suggestions for Amazon (summary of the above)

1. **Windows build guidance in the sample README (F-016, F-015, F-021).** Say that the repo root must be very short on Windows (about 15 characters; LongPathsEnabled does not help), that the Android-TV-only install is `yarn workspaces focus @multitv/expotv`, and that `expo prebuild --clean` overwrites gradle.properties. This one path-limit failure cost about 35 minutes with no warning in the README.
2. **JDK / Gradle compatibility table for TV templates and samples (F-006, F-010, F-012, F-013).** List template or sample version, Gradle version and supported JDK (17/21), note that Android Studio's bundled JBR 25 fails in the AGP prefab step, and show the Windows-safe `org.gradle.java.home` form.
3. **Mark or pin known-good Expo / react-native-tvos versions (F-005, F-006, F-014, F-017).** Deprecate `expo-template-tv`, fix create-expo-app's failure handling for the with-tv example, and record the version set the Amazon sample was verified with (Expo 55.0.24, react-native-tvos 0.83.6-0, Gradle 9.0.0).
4. **Document remote-key delivery on Android TV (F-025).** `useTVEventHandler` only receives events while a view inside the React root has focus; show the invisible focusable "sink" pattern for global key handling (also helps large focus rings, F-026).
5. **Fix undocumented traps in the sample (F-020, F-022, F-023, F-024).** Explain that `TabLayout.web.tsx` is the TV layout, fix the shared package's jest preset resolution, add `typescript` and Yarn setup instructions, and make the Expo bundle Gradle task rebuild when workspace packages change.
