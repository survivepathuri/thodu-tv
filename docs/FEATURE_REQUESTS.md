# Thodu TV: Feature requests for Amazon's tools (optional Devpost field)
*Built for one person, made for many.*

Each request comes from one entry of [FRICTION_LOG.md](../FRICTION_LOG.md) and nothing else. Priorities are the developer's own ratings: Critical / Important / Nice-to-have. F-034 and F-035 are tagged `[user-reported]` in the log (the developer's statements from memory of the 2026-10-14 session; no notes were kept at the time).

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
