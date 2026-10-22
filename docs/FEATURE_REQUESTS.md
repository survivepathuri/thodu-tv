# Thodu TV: Feature requests for Amazon's tools (optional Devpost field)
*Built for one person, made for many.*

Each request comes from one entry of [FRICTION_LOG.md](../FRICTION_LOG.md) and nothing else. Priorities are the developer's own ratings: Critical / Important / Nice-to-have. F-034 and F-035 are tagged `[user-reported]` in the log (the developer's statements from memory of the 2026-10-14 session; no notes were kept at the time); F-036 to F-040 are the developer's first-hand report of the 2026-10-22/23 recording session, also `[user-reported]`. There are 8 requests below.

## 1. Window-level or labeled recording in Live Device Interaction

- **What:** let the built-in recording capture the whole console window (console UI plus device name), or burn the device name and model into the capture. (Not confirmed whether such an option already exists.)
- **Why it matters:** the Fire TV track requires a video that shows the project running on an actual Fire TV device. The built-in recording shows only the app full-screen, with no device name or Amazon UI (three 2026-10-14 recordings, about 2:00, 2:00 and 1:43, 1920x1080), so it cannot by itself prove a Fire TV. We had to plan a separate screen recording of the browser window.
- **Priority:** Important.
- **Evidence:** F-034 `[user-reported]`.

## 2. Show model and Fire OS version in the Live Device Interaction device list

- **What:** show the Fire OS version and the device model clearly in the device list.
- **Why it matters:** the developer did not understand at first how to choose between "FOS 14 3P TV" and "Smart TV - Amazon Fire TV" and worked it out after some time (not recorded how long). A first-time developer picking a device to test needs to know what each entry is, and "FOS 14" is not obviously "Fire OS 14".
- **Priority:** Nice-to-have.
- **Evidence:** F-035 `[user-reported]`.

## 3. Windows long-path guidance (or an early check) for the Amazon multi-TV sample

- **What:** say in the sample README that on Windows the repository root must be very short (about 15 characters; `LongPathsEnabled` did not help), and ideally fail early with a clear message instead of after the native build has run for a long time.
- **Why it matters:** the native Android build failed on the 260-character path limit in ninja/CMake with no warning in the README, after roughly 13 minutes of build, and cost about 35 minutes. Windows is a common developer machine for Android TV work.
- **Priority:** Important.
- **Evidence:** F-016 (Major, about 35 min), with F-015 and F-021 in the same area.

## 4. Recorder without native browser alerts

- **What:** replace the native alerts shown at recording Start and End with an in-page confirmation (or none).
- **Why it matters:** a browser-automation extension cannot click native alerts, so every start and stop needed a manual click.
- **Priority:** Important.
- **Evidence:** F-036 `[user-reported]`.

## 5. Longer recording cap in Live Device Interaction

- **What:** raise the 2-minute cap per recording (or let a recording continue past it).
- **Why it matters:** each recording stops at 2 minutes and the file then takes about 45 to 60 seconds to be saved, so a normal demo take had to be split into parts (R1 into three).
- **Priority:** Nice-to-have.
- **Evidence:** F-036 `[user-reported]`.

## 6. Keep recording across panels

- **What:** do not stop the recording when the user leaves the Screen panel, so the Remote panel's buttons can be used during a take.
- **Why it matters:** leaving the Screen panel stops the recording, so remote buttons cannot be used while recording; the first two attempts produced one-frame files.
- **Priority:** Important.
- **Evidence:** F-037 `[user-reported]`.

## 7. A key-send API (and Escape / Backspace as Back)

- **What:** offer a way to send keys to the cloud device without first clicking the grey area, and let Escape or Backspace act as Back.
- **Why it matters:** arrow keys and Enter worked only after clicking the grey area around the TV picture, and Escape and Backspace did not work; Back needed the on-screen Back button.
- **Priority:** Nice-to-have.
- **Evidence:** F-038 `[user-reported]`.

## 8. Lower picture latency

- **What:** reduce the delay between a key press and the screen.
- **Why it matters:** the developer saw about 1 to 2 seconds of picture lag, which affects every step of a recorded take.
- **Priority:** Nice-to-have.
- **Evidence:** F-038 `[user-reported]`.
