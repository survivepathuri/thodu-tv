# Thodu TV: Devpost description (draft, English)
*A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.*

Written for the Devpost fields in form order. Every claim is backed in [CLAIMS.md](CLAIMS.md) and uses its evidence tags. Nothing here says Thodu TV is Fire TV certified, Appstore approved, tested with users, an emergency or medical service, voice-controlled, or that it has medicine reminders or a usage-adaptive Home. Replace the bracketed placeholders only with true facts.

## Project name
Thodu TV (తోడు టీవీ)

## Tagline (60 characters or fewer)
Easy TV. One button. Family one press away. (43 characters)

## Primary track
Fire TV. Mini challenges: none claimed (see "Mini challenges" below).

## Inspiration
Many older viewers and people with low vision, hearing loss, limited hand control or reading difficulty find a TV remote, small text and dense menus hard to use, and the usual answer is a settings menu they cannot easily find. We wanted a TV that starts from the person's need instead of from the menu, and that lets them tell a family member something with one button. Thodu means "companion" in Telugu.

## What it does
Thodu TV is an accessibility-first Fire TV / Android TV app. The first screen asks "What would make TV easier for you?" with four large choices and the whole screen restyles live as the person chooses:

- **Easier to see:** text 1.6x, a black/white/yellow high-contrast theme, a thick focus ring, larger buttons.
- **Easier to hear:** captions always on in the Watch demo and a flashing banner after Help (it reads "ALERT SENT" only when a real message got an HTTP 2xx; in demo mode it reads "Demo only" and says nobody was told).
- **Easier remote:** **one-button auto-scanning**: one item is highlighted at a time and a single OK press chooses it (three speeds).
- **Easier to read:** read-aloud with Android text-to-speech, simple wording and a glyph beside every action button.

The interface is in English, Hindi and Telugu. Home has five tiles: **Watch** (a labelled demo panel with sample captions; no real video), **Family**, **Medicines** (a one-press "Did you take your medicine? Yes, I took it" check-in; no timed reminders), **Help**, and **Settings**. Family, Medicines and Help send one short, generic message through the public ntfy.sh service to a family member's phone. The app says "Family notified" only after the service answered with an HTTP 2xx, shows an honest failure message in all three languages otherwise, and runs in a clearly labelled demo mode until a test message has succeeded. **Thodu TV is not an emergency service and not a medical device.**

## How we built it
A React Native app on Amazon's react-native-multi-tv-helloworld sample (Expo SDK 55, react-native-tvos 0.83) in a Yarn workspaces monorepo. All app logic is pure TypeScript with no React Native imports, so it is covered by **212 Jest tests in 15 suites** `[unit test]`: needs to settings, themes and contrast, the scanner state machine, versioned persistence, the ntfy client with timeout, retry and a 3-second debounce, and string parity across languages. A script (`tools/a11y-measure.mjs`) measures the real theme colours: 73 colour pairs, none below target, lowest text contrast 7.79:1, smallest text 22 design px, 25 of 25 focusable elements labelled `[script]`. The built APK declares a leanback launcher, touchscreen not required, a banner, minSdk 24 and no Google Play Services `[APK static]`. There is no backend: the only network call is the optional notification.

## Where it was run (honestly)
- Amazon Appstore Quality Central, Live Device Interaction, 2026-10-14: the app was started on an Amazon cloud Fire TV with an **older build** `[cloud Fire TV, 2026-10-14, older build]`. [Fresh session with the current judge build: add model, OS and date from the console Details tab once recorded.]
- The developer's Sony TV running **Android TV (not a Fire TV)**: onboarding, language switch, high contrast, D-pad navigation and Settings `[real Android TV, Sony, user-reported]`.
- Android TV emulator for development `[emulator]`.
- Not yet: the current build on a Fire TV; real VoiceView/TalkBack; sessions with users; delivery from the TV to a phone.

## Challenges we ran into
From our friction log (35 entries: 33 from notes kept at the time, 2 user-reported): a Windows 260-character path limit that broke the native build of the Amazon sample (about 35 minutes), a stale-JavaScript trap in the Gradle bundle task (about 25 minutes), and the fact that `useTVEventHandler` receives no key events when no view has focus, which cost most OK presses in scanning mode until we added one invisible focusable "sink" view (about 35 minutes). Each has a workaround and a suggestion in `FRICTION_LOG.md`.

## Accomplishments we are proud of
- One-button scanning that works with a single OK key, with unit-tested state machine.
- Measured, re-runnable accessibility numbers instead of adjectives.
- Notification behaviour that never lies: success text only after HTTP 2xx, demo mode clearly labelled, failure text in three languages.
- A judge build that contains no notification topic.

## What we learned
Remote-first design means every state needs a visible focus and a way out; "honest status" text is as important as the feature; and a public notification topic is a shared secret, not access control.

## What's next
Run the current build on a Fire TV and with VoiceView; sessions with real users; native-speaker review of Hindi and Telugu; timed medicine reminders and a schedule; an Alexa+ voice trigger for people who cannot use a remote (none of these is built).

## Built With
React Native (react-native-tvos 0.83.6-0), React 19.2, Expo SDK 55, expo-router, TypeScript, Hermes, AsyncStorage, expo-speech, expo-crypto, expo-build-properties, react-native-reanimated, react-native-screens, Jest, Yarn 4 (workspaces), Gradle, Android / Fire OS, ntfy.sh (public notification service), Amazon react-native-multi-tv-helloworld sample (MIT-0).

## Try it out
- Code: [GitHub repository URL; see submission.md for the access action]
- Judge APK (topic-free demo build): [download link to thodu-tv-ff5e452-judge.apk, SHA-256 d3370233b838e415cc3725e07de9440390e480184161765c431f4f513f59153b]
- Judge guide: `docs/JUDGES.md` in the repository
- Demo video: [YouTube link]

## Pre-existing project explanation
The repository was started on 2026-10-12 (after the Submission Period began on 2026-08-31) from Amazon's react-native-multi-tv-helloworld sample (MIT-0, upstream commit dated 2026-09-21). All screens, logic, themes, scanner, notification sender, strings, tests, tools and artwork were written in the repository after that import. An earlier, separate, unsubmitted project of the same developer ("AURA+", 23 commits on 2026-09-26 and 2026-09-27) is disclosed; no code from it was ported. Details and commit dates: `docs/PRE_EXISTING.md`.

## Mini challenges
- **AWS Builder:** not entered. Thodu TV uses no AWS service.
- **Open Source:** not claimed on this repository alone: the rule asks for a "new, additional" open-source project or a contribution to a public repository alongside the primary submission. [Add only if a separate public contribution is made.]

## Product Feedback
Paste from `docs/PRODUCT_FEEDBACK.md` (five elements per tool: A1 Amazon multi-TV sample, A2 react-native-tvos, A3 Fire TV / Android TV emulator workflow, A4 Appstore Quality Central Live Device Interaction, A5 Fire TV documentation). Would-build-again answers are the developer's own words.

## Friction log (optional, up to a 10% bonus)
Paste from `docs/DEVPOST_FRICTION_PASTE.md` (35 entries, each with task, steps, expected vs actual, severity, workaround, suggestion).

## Feature requests (optional)
- Nice-to-have: a Live Device Interaction recording or export that includes the device name and OS. (Not confirmed whether it already exists.)
- Important: a Windows note in the Amazon sample README about the 260-character path limit, and an "Android TV only (no Vega)" install section (F-015, F-016).
