# Install Thodu on an Android TV or Fire TV (over the network)

This guide installs the Thodu APK on a TV from a computer on the same home network, using `adb`. Thodu is not on any app store. The APK is a demo build signed with a debug key, so it is for trying the app, not for general distribution.

Menu names differ between TV makers and OS versions. The steps below describe the usual path; **we have not tested these steps on every TV**, so your menus may use different words. If a step does not match your TV, search the TV's settings for "developer options" or "ADB debugging".

## Safety note

Network debugging lets any computer on the same network install software on the TV. Only turn it on at home, on a network you trust (not a hotel, café or shared flat network), and **turn it off again when you have finished**.

## What you need

- The APK file (build it with the README, or get the universal APK from whoever built it). The universal APK holds native libraries for arm64-v8a, armeabi-v7a and x86, so one file is meant to suit most Android TV and Fire TV devices. It has been built with all three; it has not yet been run on an ARM device.
- A computer with `adb` (part of Android "platform-tools", free from Google).
- The TV and the computer on the same Wi-Fi or wired network.

## Steps

1. **Turn on developer options on the TV.** Usually: Settings, then About (or Device), then press OK on "Build number" seven times until it says you are a developer. On Fire TV the entry is under About, then the Fire TV Stick name.
2. **Turn on ADB / network debugging.** Usually: Settings, then Developer options, then "USB debugging" or "ADB debugging", and "Network debugging" or "ADB over network" if there is one. On Fire TV the entries are "ADB debugging" and "Apps from Unknown Sources".
3. **Find the TV's IP address.** Usually: Settings, then Network (or Network & Internet), then your connection. Write down the address, for example `192.168.1.50`.
4. **Connect from the computer:**

   ```bash
   adb connect <ip>:5555
   ```

   The TV may show an "Allow debugging from this computer?" box. Choose Allow (tick "Always allow" only if you trust this computer). `adb devices` should list the TV as `device`.
5. **Install the APK:**

   ```bash
   adb install -r thodu-universal-release.apk
   ```

   `-r` replaces an older Thodu and keeps its saved choices. It should print `Success`.
6. **Open Thodu.** Press Home on the TV remote and look for "Thodu" in the Apps row (Fire TV: "Your Apps & Channels"). You can also start it from the computer:

   ```bash
   adb shell monkey -p com.thodu.tv -c android.intent.category.LEANBACK_LAUNCHER 1
   ```

7. **When finished, turn network debugging off** on the TV (the reverse of step 2) and run `adb disconnect`.

## Uninstall

```bash
adb connect <ip>:5555
adb uninstall com.thodu.tv
```

This removes the app and everything it saved on the TV. You can also use the TV's Settings, then Apps, then Thodu, then Uninstall.

## If something goes wrong

- `adb connect` says "unable to connect" or times out: check that the TV and the computer are on the same network and that network debugging is on. Some TVs only listen on port 5555 after you switch the setting off and on again.
- `INSTALL_FAILED_NO_MATCHING_ABIS`: the APK does not hold libraries for this TV's processor. Use the universal APK.
- `INSTALL_FAILED_UPDATE_INCOMPATIBLE`: an older Thodu was signed with a different key. Run `adb uninstall com.thodu.tv` first (this erases its saved choices).
- Thodu does not appear in the Apps row: reboot the TV or open it with the `monkey` command above.
