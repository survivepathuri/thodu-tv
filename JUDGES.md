# For reviewers: a 2-minute path

Thodu — the TV that adapts to you. Accessibility-first Android TV / Fire TV app. Prototype, tested on an emulator only. **Thodu is not an emergency service. In an emergency call your local emergency number.**

## 2-minute path

1. **Read** the first screen of [README.md](README.md): problem, what it does, and the "How your needs change the app" table.
2. **Look** at the 8 screenshots in the README (`docs/screenshots/`), or watch the demo video (link to be added at submission).
3. **Skim** the "Real vs simulated" and "Claims and evidence" tables in the README. Each claim points to a test file, a tool or a screenshot.
4. **Optional, 1 minute:** run the unit tests (below).
5. **Optional:** build and run on an Android TV emulator ("Setup and run on Windows" in the README; the first build takes a long time on a low-memory PC).

## Where the evidence lives

| What | Where |
|---|---|
| Needs to settings logic | `packages/shared/src/core/adapt.ts` and `core/__tests__/adapt.test.ts` |
| Scanning (single-button) | `core/scanner.ts`, `scan/ScanScope.tsx`, `core/__tests__/scanner.test.ts` |
| Themes and contrast tests | `core/theme.ts`, `core/contrast.ts`, `core/__tests__/theme.test.ts` |
| Family notification (ntfy) | `core/notify.ts`, `core/__tests__/notify.test.ts`, `screens/HelpFlow.tsx`, `screens/FamilySettings.tsx` |
| Persistence | `core/persist.ts`, `core/__tests__/persist.test.ts` |
| Screen-reader and font-scale rules | `core/a11y.ts`, `core/speech.ts` and their tests |
| Self-audits | [ACCESSIBILITY.md](ACCESSIBILITY.md), [SECURITY.md](SECURITY.md) |
| Self-check tools | `tools/a11y-audit.mjs`, `tools/cold-start.mjs`, `tools/security-check.mjs` |
| Developer friction log (30 entries, tagged [Dev]) | [docs/FRICTION_LOG.md](docs/FRICTION_LOG.md) |
| Open source | MIT licence in [LICENSE](LICENSE); credits for the Amazon starter in [NOTICE](NOTICE) |

## Mapping to the four criteria (pointers only)

- **Technology implementation:** a React Native / Expo TV app (Expo SDK 55, react-native-tvos 0.83) in a Yarn workspaces monorepo; the logic is pure TypeScript with 170 passing unit tests; a real HTTPS notification path to ntfy.sh with retry, timeout and honest failure states; versioned persistence with safe fallbacks; no backend. See `core/` and the tests.
- **Design:** the app is configured from the person's needs, not from menus; the setup screen restyles live; large focus ring, large text, high-contrast theme, single-button scanning, three languages; contrast pairs are tested. See the screenshots and ACCESSIBILITY.md.
- **Potential impact:** the target viewers are older people and people with low vision, hearing loss, limited hand control or reading difficulty, plus a family member who can be told when help is wanted. We have **no user study and no measured impact**; the claims we can make are about what the app does, not about outcomes.
- **Quality of the idea:** TV setup based on needs ("Easier to see", "Easier to hear", "Easier remote", "Easier to read") that changes the whole interface at once, with a family-notification path that says plainly when it failed. The README states what is built and what is only a roadmap line.

## Reproduce the tests

```bash
cd packages/shared
npx jest -c jest.core.config.js
```

Expected: 12 suites, 186 tests, all passing (the latest run before this document was written). Needs Node.js and the repository's installed dependencies (`yarn workspaces focus @thodu/expotv` at the repo root). No device, no network.

## Real vs simulated (short)

- **Real:** the ntfy.sh HTTPS notification (success only on HTTP 2xx; no phone was subscribed during development, so delivery to a phone is unverified); persistence; scanning; read-aloud with the Android text-to-speech engine; the label audit and cold-start numbers (both on the emulator).
- **Simulated or demo:** the "Family phone" card, the Watch screen with its captions (no real video), the help flow before a test message succeeds (labelled DEMO), offline conditions (simulated on the emulator).
- **Placeholder:** Medicines.

## Honest limits

- Emulator only. Not tested on a physical Fire TV, with a real screen reader, with a real family phone, or with real users.
- Hindi and Telugu text needs native-speaker review; their speech voices were not verified.
- No numbers about impact; the cold-start (1136 / 1351 / 1965 ms min / median / max) is an emulator measurement.
- Release builds use a debug signing key; 108 dependency advisories are listed in SECURITY.md (mostly build tooling by our triage; not upgraded, reachability not assessed).
- "Easier to read" now uses simple wording (key strings only) and button glyphs; this is checked by unit tests and on the emulator, not with real users. Hindi and Telugu simple wording awaits native-speaker review.
- Roadmap only, not built: a voice trigger through Alexa+ for people who cannot use a remote.
