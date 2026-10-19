# Thodu TV: Submission checklist (Fire TV track)
*A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.*

Easy TV. One button. Family one press away.

Deadline: **Fri 2026-10-23, 12:00 pm Pacific** (internal target 2026-10-22 about 6 PM IST). No edits are allowed after the deadline. Rules source: the official Devpost rules and overview pages (https://amazonappdev2026.devpost.com/), re-read on 2026-10-18. Status words: **done**, **doc** (written, in the repo), **USER-ONLY**.

## A. Done or written (in this repository)

| Item | Status | Where |
|---|---|---|
| Working Fire OS / Android TV app (APK) | done (judge build `0f5dc84`) | `docs/JUDGES.md`; build steps in `README.md` |
| Text description | doc (draft) | `docs/DEVPOST_DESCRIPTION.md` |
| Code repository with source, assets and setup/run instructions | done | `README.md`, `docs/JUDGES.md`, `docs/INSTALL_ON_TV.md` |
| Open-source license file | done (MIT; Amazon sample MIT-0 text kept) | `LICENSE`, `THIRD_PARTY_NOTICES.md`, `NOTICE` |
| Pre-existing work explained (nothing predates 2026-08-31; starting material disclosed) | doc | `docs/PRE_EXISTING.md` |
| Sources for every statistic | doc | `docs/SOURCES.md` |
| Product Feedback per tool (five elements) | doc; would-build-again answers need the developer's own words | `docs/PRODUCT_FEEDBACK.md` |
| Friction log (optional, up to 10% bonus) | doc (35 entries: 33 from notes kept at the time, 2 user-reported) | `FRICTION_LOG.md`, `docs/DEVPOST_FRICTION_PASTE.md` |
| Feature requests (optional) | doc | `docs/FEATURE_REQUESTS.md` |
| Claims with evidence | doc | `docs/CLAIMS.md` |
| Device evidence and Fire TV readiness | doc (cloud row to be filled) | `docs/DEVICE_EVIDENCE.md` |
| Accessibility self-audit (measured) | done | `docs/ACCESSIBILITY.md`, `tools/a11y-measure.mjs` |
| Privacy and safety | doc | `docs/PRIVACY_AND_SAFETY.md`, `SECURITY.md` |
| User testing page | doc: **NOT YET DONE** template | `docs/USER_TESTING.md` |
| Secret scan (tracked files and history) | done, 0 hits | `docs/CLAIMS.md` #20; `secrets.test.ts` |
| Judge APK without a topic | done, outside the repo | `thodu-tv-0f5dc84-judge.apk` (SHA-256 in `docs/JUDGES.md`) |

## B. USER-ONLY items (nobody else can do these)

| # | Item | Exact need |
|---|---|---|
| 1 | **Ask the family member for consent to be filmed before the session** | Before the 2026-10-19 session ask the adult family member, aloud, using the consent statement in `docs/USER_SESSIONS.md`: trying the app (yes/no), filming screen and hands (yes/no), filming the face (separate yes/no). Voluntary; they can stop and ask for deletion at any time. No consent, no filming. |
| 2 | **Fresh cloud Fire TV recording (final judge build)** | In Amazon Developer Console > Appstore Quality Central > Live Device Interaction, install the **final** judge APK (built after the demo-mode fix; Part 4B) on a real Fire TV and record the **whole browser window** (console, device name and the app all visible). Read the model and OS from the console **Details** tab and write them into `docs/DEVICE_EVIDENCE.md` and the Devpost description. Do not guess "Fire OS 14". Also the first launch of the judge APK on any device (it has never been run). |
| 3 | **Home-TV footage** (Sony TV, Android TV) | Film on 2026-10-19 **only after item 1**: screen and hands, a face only if they agree, no names. Label it "Android TV", never "Fire TV". Keep a dated file name. Do not show the real notification topic on screen. |
| 4 | **User testing facts** | After 2026-10-19 fill `docs/USER_TESTING.md` (date, anonymous participant, tasks, observations, problems, changes). Until then no text says "tested with users". |
| 5 | **Sony model and Android version** | Fill both in `docs/DEVICE_EVIDENCE.md` from Settings > About. |
| 6 | **Install the private build on the Sony TV** | Install the topic-bearing `-ntfy` APK over the existing app (`adb install -r`) and confirm the launcher label and banner say Thodu TV. Never publish that APK. |
| 7 | **Phone delivery proof (optional)** | Subscribe a phone to a throwaway topic, press Help on the TV (not the cloud device), note the time. Only then may any text say the message reached a phone. |
| 8 | **Demo video** | Under 3 minutes; see section D. |
| 9 | **YouTube (or Vimeo) upload** | Public visibility, English; paste the link on the Devpost form. |
| 10 | **Repo access action** | Plan: make the repo public around 2026-10-22 and check the license shows in the About box while logged out. Fallback: keep it private and, **at submission time only** (invitations expire after 7 days), add collaborators `testing@devpost.com` plus `knmeiss`, `giolaq`, `anishamalde`, `mosesroth`, `emersonsklar`; the rules page also lists `chris-trag` (it has no profile link there, so check the spelling). Nothing has been pushed or changed by the assistant. |
| 11 | **Judge APK hosting** | GitHub Release when the repo is public (hash in the notes). Must stay available until the judging period ends on 2026-11-20. Never publish the private topic-bearing build. |
| 12 | **Devpost form** | Paste the fields from the developer's private paste kit; choose track Fire TV; no mini challenge (Open Source mini is deferred; if ever claimed, the form needs contribution URL, repo URL, GitHub username and a short description); answer the Product Feedback would-build-again question in your own words. |
| 13 | **Native-speaker check** | Ask a Hindi and a Telugu speaker to read the six safety strings; keep the "not native-reviewed" label until then. |
| 14 | **Eligibility and ownership confirmations** | Age of majority, no financial or preferential support from Amazon/Devpost, you are the Representative. |
| 15 | **Freeze** | No repository or form changes after 2026-10-23 12:00 pm Pacific. |

## B2. Open items for the Product Feedback (moved here from `docs/PRODUCT_FEEDBACK.md`)

- **Fresh Live Device Interaction session** with the current judge APK, recording the whole browser window, then fill the model and OS from the console Details tab (see `docs/DEVICE_EVIDENCE.md`). Until then A4 stays as written above.
- **Entry 2 (Live Device Interaction) facts nobody recorded:** how the 2026-10-14 recordings were made (console feature or screen capture), whether the APK upload to the cloud device had any problem, onboarding steps and time.
- **Would-build-again answers:** given in the developer's own words for entries 1 to 10 and 12 (2026-10-19). **Entry 11 (ntfy.sh)** waits for the Sony TV and phone test; **entry 13 (outside tools)** stays open until after the video.
- **Onboarding totals:** no end-to-end "zero to hello world" time is recorded for any tool.
- **Not recorded in the logs:** F-002 (expected, time lost, severity); F-003 and F-004 (expected); F-008 (steps, time lost, severity); F-011 (expected); F-013 (exact Gradle error text); F-014 (cause of the RCTText crash, not investigated); F-027 (time is approximate only).
- **F-014:** the logs do not say whether any Amazon guide points to the `with-tv` example, so do not present F-014 as an Amazon documentation fault.
- **Vega SDK:** confirm the "not available on Windows" statement and say whether you ever tried it.
- **Devpost form:** exact layout (one box vs. per tool), character limits and required fields were not read; check before pasting.
- **ntfy delivery claim:** the earlier "HTTP 200 test on 2026-10-18" claim was removed (no evidence file in the repository). Fill the placeholder in `docs/PRODUCT_FEEDBACK.md` entry 11, `docs/CLAIMS.md` row 21, `docs/PRIVACY_AND_SAFETY.md` and `docs/JUDGES.md` after the Sony TV and phone test.

## C. Pre-submission checks (the day before)

- [ ] `cd packages/shared && npx jest -c jest.core.config.js` shows all tests passing.
- [ ] `git status` clean; the commit you submit is the one the judge APK was built from (or say so).
- [ ] No topic anywhere: `git grep` for a `thodu-xxxx-xxxx-xxxx` shaped string returns only the placeholders and test fixtures.
- [ ] README, JUDGES, DEVPOST_DESCRIPTION still say the same numbers (223 tests, 16 suites).
- [ ] Links in the Devpost text open for a logged-out visitor (video, APK).

## D. Video must-haves (from the verified rules)

Rules: "should be less than three (3) minutes", "should include footage that shows the Project functioning on the device for which it was built", "must be uploaded to and made publicly visible on YouTube or Vimeo", "must not include third party trademarks, or copyrighted music or other material" without permission; Fire TV: "must show the project running on an actual Fire TV device or the Fire TV/Vega simulator"; all materials in English.

1. Under 3:00; put the best material in the first minute (judges need not watch past 3:00).
2. Public YouTube or Vimeo, English narration or English captions.
3. **Fire TV proof:** a cloud Live Device Interaction clip with the console, device name and app on screen (item B1).
4. Show the project working: needs-based setup and live restyle; high-contrast; one-button scanning with the single OK key; Home tiles; Watch as a **labelled demo**; Help in demo mode; if proven, a real message arriving on a phone; an honest failure message.
5. Explain, on a card or in narration, that it started from Amazon's sample after Aug 31 and what was added.
6. Music: none, or music you own or that is licensed for this use. No third-party logos, trademarks or footage added by you.
7. Do not show the real notification topic (Settings > Family notifications displays it). Use a throwaway topic and press "Make a new name" after filming.
8. Sony TV footage is labelled "Android TV (not a Fire TV)".

### Allowed text-card wording
- "Fire TV: Amazon Live Device Interaction, [model and OS from the console], [date]" (only after item B1).
- "Android TV (home TV, not a Fire TV)"
- "Demo mode: nobody is contacted until you send a test message"
- "Family notified appears only after the service accepts the message"
- "Watch is a demo panel with sample captions, no real video"
- "Medicines: one-press check-in, no reminders yet"
- "Not an emergency service"
- "Not yet tested with users" (or the facts from `docs/USER_TESTING.md` once filled)
- "223 unit tests passing; contrast measured by script" (re-check the numbers before filming)

### Wording that must not appear
Fire TV certified, Appstore approved, tested with users (without evidence), emergency service, medical device, "reminder" as a feature, voice recognition or voice control, usage-adaptive or learning Home, "works on all Fire TVs", any claim about the current build running on a Fire TV before item B1 is done.
