# Thodu TV: Accessibility self-audit (measured)
*A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.*

**This is a self-audit by the developer. It is not a certification and not a conformance claim for WCAG, Section 508, Amazon's or any other standard.** The numbers below come from the real theme colours and source files by script (`node tools/a11y-measure.mjs`) and by a Jest test (`packages/shared/src/core/__tests__/a11yCoverage.test.ts`), so a judge can re-run them. Tags are explained in [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md): `[script]`, `[unit test]`, `[code only]`, `[emulator]`, `[real Android TV, Sony, user-reported]`, `[not tested]`.

## Key numbers

| Measure | Result | Tag |
|---|---|---|
| Contrast pairs computed (both themes, every tile, card, border, focus ring, caption bar and alert banner) | **73 pairs, 0 below their target** (4.5:1 for text, 3:1 for icons and non-text) | `[script]` |
| Lowest text contrast | **7.79:1** (Sunrise, Watch tile label on its blue tile; target 4.5:1) | `[script]` |
| Lowest non-text contrast | **3.61:1** (Sunrise button border on the page background; target 3:1) | `[script]` |
| Focus ring contrast | Sunrise: 5.57:1 to 6.73:1 against the tile colours, 10.54:1 against the page. High contrast: 19.03:1 to 21:1. | `[script]` |
| Focus ring thickness | 4 px by default, 10 px for "Easier to see" (design px on a 1920x1080 grid, drawn as an overlay so the layout never shifts) | `[code only]` `core/adapt.ts`, `components/Focusable.tsx` |
| Smallest text size used | **22 design px** (the scan-hint pill); all sizes used: 22, 26, 28, 30, 32, 34, 36, 38, 40, 44, 46, 48, 52, 54, 56, 60, 64, 72, 76, 80. Multiplied by the font scale (1.0 default, 1.6 for "Easier to see"). | `[script]` |
| Focusable elements with a non-empty accessibility label | **25 of 25 usages (100%)**; plus 1 hidden scan sink that is deliberately hidden from screen readers | `[script]` + `[unit test]` |
| Content that disappears on a timer | **None.** Every result screen (sent, failed, demo) stays until the person presses a button. | `[code only]` (only two timers exist, see "Timers") |
| Blockers found | **None**, so no code was changed for accessibility in this audit | |

"Design px" are sizes on a 1920x1080 design grid, scaled by screen width. On a 1080p panel one design px is one physical pixel. They are **not** Android `sp`: the app turns off the OS font scaling and applies its own capped scale (see "Text size").

## What is implemented, per need

| Need | Implemented | Proof | Not done |
|---|---|---|---|
| Low vision ("Easier to see") | Text 1.6x, high-contrast black/white/yellow theme, focus ring 10 px, larger buttons (1.25x), an icon plus a label on every tile; the setup screen restyles live | `adapt.test.ts` `[unit test]`; `[script]` contrast; screenshots 01 and 03 `[emulator]`; high-contrast theme seen on `[real Android TV, Sony, user-reported]` | Not tried by a low-vision person or from across a room |
| Hard of hearing ("Easier to hear") | Captions always on in the Watch demo, a flashing "ALERT SENT" banner after help is sent | `adapt.test.ts`, `captions.test.ts` `[unit test]`; screenshot 06 `[emulator]` | The captions are scripted sample lines, not tied to real audio or video; there is no real video player |
| Remote difficulty ("Easier remote") | Single-button scanning: one item highlighted at a time, Select chooses, Back still works; larger buttons | `scanner.test.ts` (16 tests) `[unit test]`; an adb run with only ENTER and BACK reached the help flow `[emulator]` | No scan-back or hold-to-select; not tried by a one-switch user; not re-run on every later build |
| Reading difficulty ("Easier to read") | Read-aloud of the focused item (Android text-to-speech), simple wording for key strings in 3 languages, a text glyph next to every action button | `speech.test.ts`, `simpleText.test.ts`, `buttonIcons.test.ts` `[unit test]`; English speech heard `[emulator]` | Hindi and Telugu voices and simple wording are not native-reviewed; read-aloud speaks item labels, not screen titles |

## Contrast (generated)

Method: WCAG 2.x relative luminance and contrast ratio, `packages/shared/src/core/contrast.ts`, applied to the colours in `core/palette.ts` plus the three colour pairs written directly in screens. Targets: 4.5:1 for text, 3:1 for large icon glyphs and non-text parts (button borders, focus ring). These are calculated values, not readings from a screen; colour-blindness was not simulated.

Regenerate with `node tools/a11y-measure.mjs`.

| Theme | Pair | Ratio | Needed | Pass |
|---|---|---|---|---|
| Sunrise (default) | text on background (#1B1F3B on #FFF4DE) | 14.74:1 | 4.5:1 | yes |
| Sunrise (default) | textMuted on background (#454A6B on #FFF4DE) | 7.87:1 | 4.5:1 | yes |
| Sunrise (default) | text on surface (#1B1F3B on #FFFBF2) | 15.57:1 | 4.5:1 | yes |
| Sunrise (default) | textMuted on surface (#454A6B on #FFFBF2) | 8.32:1 | 4.5:1 | yes |
| Sunrise (default) | text on surfaceFocused (#1B1F3B on #FFFFFF) | 16.08:1 | 4.5:1 | yes |
| Sunrise (default) | textMuted on surfaceFocused (#454A6B on #FFFFFF) | 8.59:1 | 4.5:1 | yes |
| Sunrise (default) | onAccent on accent (primary button) (#1B1F3B on #FFB703) | 9.21:1 | 4.5:1 | yes |
| Sunrise (default) | button border on surface (non-text) (#8A7F6A on #FFFBF2) | 3.82:1 | 3:1 | yes |
| Sunrise (default) | button border on background (non-text) (#8A7F6A on #FFF4DE) | 3.61:1 | 3:1 | yes |
| Sunrise (default) | tile watch: label on tile (#1B1F3B on #7DB8FF) | 7.79:1 | 4.5:1 | yes |
| Sunrise (default) | tile watch: icon glyph on tile (large) (#1B1F3B on #7DB8FF) | 7.79:1 | 3:1 | yes |
| Sunrise (default) | tile watch: focus ring on tile edge (non-text) (#2A2A8F on #7DB8FF) | 5.57:1 | 3:1 | yes |
| Sunrise (default) | tile family: label on tile (#1B1F3B on #FF9EC4) | 8.38:1 | 4.5:1 | yes |
| Sunrise (default) | tile family: icon glyph on tile (large) (#1B1F3B on #FF9EC4) | 8.38:1 | 3:1 | yes |
| Sunrise (default) | tile family: focus ring on tile edge (non-text) (#2A2A8F on #FF9EC4) | 5.99:1 | 3:1 | yes |
| Sunrise (default) | tile medicines: label on tile (#1B1F3B on #7FD99A) | 9.42:1 | 4.5:1 | yes |
| Sunrise (default) | tile medicines: icon glyph on tile (large) (#1B1F3B on #7FD99A) | 9.42:1 | 3:1 | yes |
| Sunrise (default) | tile medicines: focus ring on tile edge (non-text) (#2A2A8F on #7FD99A) | 6.73:1 | 3:1 | yes |
| Sunrise (default) | tile help: label on tile (#1B1F3B on #FFA95C) | 8.49:1 | 4.5:1 | yes |
| Sunrise (default) | tile help: icon glyph on tile (large) (#1B1F3B on #FFA95C) | 8.49:1 | 3:1 | yes |
| Sunrise (default) | tile help: focus ring on tile edge (non-text) (#2A2A8F on #FFA95C) | 6.07:1 | 3:1 | yes |
| Sunrise (default) | tile settings: label on tile (#1B1F3B on #C3A6FF) | 7.83:1 | 4.5:1 | yes |
| Sunrise (default) | tile settings: icon glyph on tile (large) (#1B1F3B on #C3A6FF) | 7.83:1 | 3:1 | yes |
| Sunrise (default) | tile settings: focus ring on tile edge (non-text) (#2A2A8F on #C3A6FF) | 5.6:1 | 3:1 | yes |
| Sunrise (default) | card lowVision: text (#1B1F3B on #E1EEFF) | 13.69:1 | 4.5:1 | yes |
| Sunrise (default) | card lowVision: text selected (#1B1F3B on #7DB8FF) | 7.79:1 | 4.5:1 | yes |
| Sunrise (default) | card hardOfHearing: text (#1B1F3B on #FFE3EE) | 13.38:1 | 4.5:1 | yes |
| Sunrise (default) | card hardOfHearing: text selected (#1B1F3B on #FF9EC4) | 8.38:1 | 4.5:1 | yes |
| Sunrise (default) | card remoteDifficulty: text (#1B1F3B on #E0F6E7) | 14.17:1 | 4.5:1 | yes |
| Sunrise (default) | card remoteDifficulty: text selected (#1B1F3B on #7FD99A) | 9.42:1 | 4.5:1 | yes |
| Sunrise (default) | card readingDifficulty: text (#1B1F3B on #FFEBD6) | 13.87:1 | 4.5:1 | yes |
| Sunrise (default) | card readingDifficulty: text selected (#1B1F3B on #FFA95C) | 8.49:1 | 4.5:1 | yes |
| Sunrise (default) | focus ring on background (non-text) (#2A2A8F on #FFF4DE) | 10.54:1 | 3:1 | yes |
| Sunrise (default) | focus ring on surface (non-text) (#2A2A8F on #FFFBF2) | 11.13:1 | 3:1 | yes |
| Sunrise (default) | scan hint (background on text) (#FFF4DE on #1B1F3B) | 14.74:1 | 4.5:1 | yes |
| High contrast | text on background (#FFFFFF on #000000) | 21:1 | 4.5:1 | yes |
| High contrast | textMuted on background (#EDEDED on #000000) | 17.94:1 | 4.5:1 | yes |
| High contrast | text on surface (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | textMuted on surface (#EDEDED on #101010) | 16.25:1 | 4.5:1 | yes |
| High contrast | text on surfaceFocused (#FFFFFF on #262626) | 15.13:1 | 4.5:1 | yes |
| High contrast | textMuted on surfaceFocused (#EDEDED on #262626) | 12.93:1 | 4.5:1 | yes |
| High contrast | onAccent on accent (primary button) (#000000 on #FFE600) | 16.57:1 | 4.5:1 | yes |
| High contrast | button border on surface (non-text) (#FFFFFF on #101010) | 19.03:1 | 3:1 | yes |
| High contrast | button border on background (non-text) (#FFFFFF on #000000) | 21:1 | 3:1 | yes |
| High contrast | tile watch: label on tile (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | tile watch: icon glyph on tile (large) (#FFE600 on #101010) | 15.01:1 | 3:1 | yes |
| High contrast | tile watch: focus ring on tile edge (non-text) (#FFFFFF on #101010) | 19.03:1 | 3:1 | yes |
| High contrast | tile family: label on tile (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | tile family: icon glyph on tile (large) (#FFE600 on #101010) | 15.01:1 | 3:1 | yes |
| High contrast | tile family: focus ring on tile edge (non-text) (#FFFFFF on #101010) | 19.03:1 | 3:1 | yes |
| High contrast | tile medicines: label on tile (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | tile medicines: icon glyph on tile (large) (#FFE600 on #101010) | 15.01:1 | 3:1 | yes |
| High contrast | tile medicines: focus ring on tile edge (non-text) (#FFFFFF on #101010) | 19.03:1 | 3:1 | yes |
| High contrast | tile help: label on tile (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | tile help: icon glyph on tile (large) (#FFE600 on #101010) | 15.01:1 | 3:1 | yes |
| High contrast | tile help: focus ring on tile edge (non-text) (#FFFFFF on #101010) | 19.03:1 | 3:1 | yes |
| High contrast | tile settings: label on tile (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | tile settings: icon glyph on tile (large) (#FFE600 on #101010) | 15.01:1 | 3:1 | yes |
| High contrast | tile settings: focus ring on tile edge (non-text) (#FFFFFF on #101010) | 19.03:1 | 3:1 | yes |
| High contrast | card lowVision: text (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | card lowVision: text selected (#000000 on #FFE600) | 16.57:1 | 4.5:1 | yes |
| High contrast | card hardOfHearing: text (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | card hardOfHearing: text selected (#000000 on #FFE600) | 16.57:1 | 4.5:1 | yes |
| High contrast | card remoteDifficulty: text (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | card remoteDifficulty: text selected (#000000 on #FFE600) | 16.57:1 | 4.5:1 | yes |
| High contrast | card readingDifficulty: text (#FFFFFF on #101010) | 19.03:1 | 4.5:1 | yes |
| High contrast | card readingDifficulty: text selected (#000000 on #FFE600) | 16.57:1 | 4.5:1 | yes |
| High contrast | focus ring on background (non-text) (#FFFFFF on #000000) | 21:1 | 3:1 | yes |
| High contrast | focus ring on surface (non-text) (#FFFFFF on #101010) | 19.03:1 | 3:1 | yes |
| High contrast | scan hint (background on text) (#000000 on #FFFFFF) | 21:1 | 4.5:1 | yes |
| Both | caption bar text (#FFFFFF on #000000) | 21:1 | 4.5:1 | yes |
| Both | alert banner phase A (#000000 on #FFE600) | 16.57:1 | 4.5:1 | yes |
| Both | alert banner phase B (#FFE600 on #000000) | 16.57:1 | 4.5:1 | yes |

Lowest ratio: 3.61:1 (Sunrise (default), button border on background (non-text)). Failures: 0 of 73.
Lowest text ratio: 7.79:1 (Sunrise (default), tile watch: label on tile).

## Text size

- Smallest size 22 design px, used for the scan-hint pill ("Press OK to choose") and two small setup labels. Body copy is 26 to 40; titles 54 to 80.
- Own font scale 1.0 (default) to 1.6 (low vision). The Android system font scale is honoured up to 1.3, and our scale times the system scale is capped at 2.0 (`core/a11y.ts`) `[unit test]`. When the scale is above 1.3 the Home tiles wrap to 3 + 2 rows (`core/homeLayout.ts`) `[unit test]`.
- Not measured: legibility from a sofa. Amazon's test criteria ask that text be readable "from approximately 10 feet"; that was **not** tested.

## Focus and remote paths

- One component (`Focusable`) draws the focus ring and also the scanner highlight, so D-pad focus and scanning look identical (scale 1.05 plus the ring). Colour is never the only cue: every tile and card also has a glyph and a text label.
- **D-pad path:** all screens are reachable with Up, Down, Left, Right, Select and Back. `[real Android TV, Sony, user-reported]` onboarding, language switch, high-contrast and Settings (older build, developer's report); `[emulator]` adb key journeys; Fire TV `[not tested]` on the current build.
- **One-button path:** with "Easier remote", every item is non-focusable and the scanner highlights each item in turn (speed options below). Select presses the highlighted item; a hidden 1x1 sink view keeps focus so Android keeps delivering the Select key `[code only]` `scan/ScanScope.tsx`.
- No touch-only path, long press or gesture exists `[code only]`.

## Accessibility labels

- Every interactive element is a `Focusable` (or `ActionButton`, which wraps it), and `Focusable` requires a `label` prop (TypeScript) that becomes `accessibilityLabel`, with a role (`button`, `checkbox`, `radio`) and checked state `[code only]`.
- The Jest test `a11yCoverage.test.ts` parses the screen sources and fails if any usage has no label, if any other component uses `Pressable`/`Touchable`, or if the hidden scan sink loses its "hidden from screen readers" flags `[unit test]`. The script prints the same count (25 of 25).
- Limits: this proves a label exists, not that it sounds right. Static text (titles, status lines, "Family notified") is not focusable. Amazon's VoiceView guidance says to "Implement Described By for static content" so that it is read when an item gains focus; Thodu TV does not do that yet, so VoiceView users may not hear some status text unless it appears in a focused button label or is announced `[not tested]`.
- With a screen reader on, the app announces the focused label through `AccessibilityInfo.announceForAccessibility` instead of its own speech, and only *suggests* needs without applying them `[unit test]` `a11y.test.ts`, `speech.test.ts`.

## Timers, flashing and captions

Only two intervals exist in the screens (`grep setInterval packages/shared/src`) plus the scanner's own timer:

- **Alert banner** (Help sent, "Easier to hear" only): alternates black-on-yellow and yellow-on-black every 700 ms, about 0.7 cycles per second (1.4 changes per second), below 3 flashes per second `[code only]` `screens/HelpFlow.tsx`. No photosensitivity review was done. The banner stays until the person leaves the screen.
- **Caption demo** (Watch): a sample caption line changes every 3000 ms in a loop `[code only]` `core/captions.ts`. It is demo content with no pause control; this would need one in a real player.
- **Scanner:** moves the highlight every 2600 ms (slow), 1800 ms (normal, default) or 1200 ms (fast). The speed is a setting in Settings (three chips). The scanner highlights; it never hides or removes content.
- Nothing disappears on its own: result screens have no auto-dismiss.

## Captions and alerts as implemented

- Captions: a looping caption bar with white 44 design px text on black (21:1) in the Watch demo; there is no real video and no speech recognition.
- Visual alert: the banner above plus the text "ALERT SENT"; the family also gets an ntfy notification only if real mode is on (see [PRIVACY_AND_SAFETY.md](PRIVACY_AND_SAFETY.md)).
- Honest failure text in English, Hindi and Telugu when a message could not be sent `[unit test]` `strings.test.ts`, `notify.test.ts`.

## Not verified (read this before relying on anything above)

- **No VoiceView or TalkBack session** on any device. Detection and routing are unit-tested only.
- No test with older adults, low-vision, hard-of-hearing or one-switch users. [USER_TESTING.md](USER_TESTING.md) is a template marked NOT YET DONE.
- No test on a Fire TV with the current build; no check from a normal viewing distance; Amazon's 2-second Home-exit test not run.
- Hindi and Telugu strings, simple wording and speech voices are not reviewed by native speakers (the developer wrote them).
- No photosensitivity review of the alert banner.
- Contrast is calculated from colour values, not measured on a panel; the label audit on the emulator (`tools/a11y-audit.mjs`, 9 screens, 35 nodes, 0 unnamed) was run on an earlier build and not re-run after the Medicines tile came back `[emulator]`.

## Next steps
1. Run VoiceView on a Fire TV and TalkBack on Android TV; add Described By to static status text.
2. Native-speaker review of Hindi and Telugu; check the speech voices.
3. Sessions with real users, using [USER_SESSIONS.md](USER_SESSIONS.md) and [USER_TESTING.md](USER_TESTING.md).
4. Re-run `tools/a11y-audit.mjs` on the current build.
