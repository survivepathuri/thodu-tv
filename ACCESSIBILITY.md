# Accessibility self-audit

**This is a self-audit written by the developer. It is not a certification and not a conformance claim for any standard.** Everything was checked on an Android TV **emulator** (Android 14, 1920x1080) or by unit tests. Nothing was tested on a real Fire TV, with a real screen reader, or with real users.

Status words: **Verified** = we have a test or a recorded run that shows it works as described; **Partially verified** = part of it is shown, part is not; **Not tested** = implemented or planned but not run.

## What is implemented, per need

| Need | Implemented | Proof | Not done |
|---|---|---|---|
| Low vision ("Easier to see") | Text 1.6x, high-contrast black/yellow theme, focus ring width 10, larger buttons, icon plus label on every tile; whole screen restyles live during setup | `adapt.test.ts`, `theme.test.ts`; screenshots 01, 03; emulator runs at 1.0x, 1.6x and system font scale 1.3x | No test with a real low-vision user or on a real TV across a room |
| Hard of hearing ("Easier to hear") | Captions-always-on setting, caption bar on the Watch demo panel, flashing "ALERT SENT" banner after help is sent | `adapt.test.ts`, `captions.test.ts`; screenshot 06 and an emulator run of the banner | Captions are a scripted demo, not tied to any real video or audio; no real video player |
| Remote difficulty ("Easier remote") | Single-button scanning: one item highlighted every 1.8 s, OK selects, Back still works; larger buttons; scanning order is registration order | `scanner.test.ts` (16 tests); an adb run using only ENTER and BACK reached the help flow; screenshot 04 | No scan-back or hold-to-select; no test with a real one-switch user; scanning not re-run on every later build |
| Reading difficulty ("Easier to read") | Read-aloud of the focused item (Android text-to-speech), three languages; tiles and cards always show an icon plus a label | `speech.test.ts` (route decision), `strings.test.ts`; English speech observed on the emulator | Read-aloud speaks item labels, not screen titles; Hindi and Telugu speech not verified; the `simpleLanguage` and `iconsWithLabels` settings are saved but no screen changes because of them yet (wording and icons are the same for everyone) |

## Checklist

| Area | Status | Evidence | Notes |
|---|---|---|---|
| 10-foot readability | Partially verified | Screenshots at 1920x1080; text scale 1.0x to 1.6x | Judged on screenshots, not from a sofa on a real TV |
| Focus visibility | Verified (emulator) | Screenshots 01, 02, 04; focus ring is an overlay so it never changes layout; ring/border contrast 3:1 tested in `theme.test.ts` | Ring width 4 default, 10 for low vision |
| Remote-only journeys | Verified (emulator) | adb key logs: D-pad and ENTER/BACK only; setup, home, settings, help, Telugu, placeholder screen | Developer key logs are not committed; screens lag keys by up to about 1 s on the emulator |
| Back and Home behaviour | Partially verified | Back pops the stack and restores focus on the tile that opened the screen (emulator run); **Back on Home exits to the launcher** | That is the platform convention for a root screen; not changed |
| Text scaling | Verified (emulator) | `a11y.test.ts`; system font scale 1.3 run, layouts still fit | We honour the system font scale only up to x1.3, and our own scale times the system scale is capped at x2.0, so text cannot grow past what the layouts can hold (`core/a11y.ts`) |
| Contrast | Verified by calculation | `theme.test.ts` checks every text/background pair: AA minimum in the Sunrise theme, AAA for labels in high contrast | Calculated ratios, not measured on a screen; colour-blindness not simulated |
| Captions demo | Partially verified | Screenshot 06; `captions.test.ts` | Demo panel only, no real media |
| Visual alerts | Partially verified | Emulator run showing the flashing banner (black phase captured) | Flash rate about 1 Hz; no photosensitivity review |
| Screen reader | Not tested on a device | `AccessibilityInfo` detection and the speech-route decision are implemented and unit-tested (`a11y.test.ts`, `speech.test.ts`) | Behaviour with VoiceView/TalkBack running has not been tested on a real device |
| Scanning mode | Partially verified | `scanner.test.ts`; ENTER-only adb journey on an earlier build | Not re-proven on the final build because release builds no longer log scan events |
| Languages (EN, HI, TE) | Partially verified | `strings.test.ts` checks the same keys in all three, script checks and no empty strings | **Native-speaker review is pending** for Hindi and Telugu |
| Automated label audit | Verified (emulator) | `tools/a11y-audit.mjs`: 9 screens, 35 interactive nodes, 0 without text or content description (scroll containers counted separately) | Checks that names exist, not that they sound right |

## Notes on what the checks mean

- Contrast numbers come from the WCAG relative-luminance formula implemented in `core/contrast.ts` and are asserted in tests. We call AA and AAA thresholds a design target and a test, not a certification.
- The label audit uses `uiautomator` and flags a clickable or focusable node with neither text nor content description. It is not a listening test.
- The focus "sink" in scanning mode is an invisible view that exists so Android keeps delivering remote keys; it is hidden from accessibility services.

## Next steps

1. Test with VoiceView (Fire TV) and TalkBack (Android TV) on a real device and fix what is found.
2. Have native speakers review the Hindi and Telugu strings and check the Hindi and Telugu speech voices.
3. Run sessions with real users (older adults, people with low vision, hearing loss or limited hand control) and change the app from what they say.
4. Test on a physical Fire TV and from a normal viewing distance.
5. Re-run the scanning journey on the final build and add a record of it.
