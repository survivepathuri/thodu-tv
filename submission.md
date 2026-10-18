# Thodu TV: Submission checklist (Fire TV track)
*A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.*

Deadline: **Fri 2026-10-23, 12:00 pm Pacific** (internal target 2026-10-22 about 6 PM IST). No edits are allowed after the deadline. Rules source and quotes: the developer's `RULES_CHECKLIST.md` (outside the repo, fetched 2026-10-18 from the official Devpost pages). Status words: **done**, **doc** (written, in the repo), **USER-ONLY**.

## A. Done or written (in this repository)

| Item | Status | Where |
|---|---|---|
| Working Fire OS / Android TV app (APK) | done (judge build `196f20a`) | `docs/JUDGES.md`; build steps in `README.md` |
| Text description | doc (draft) | `docs/DEVPOST_DESCRIPTION.md` |
| Code repository with source, assets and setup/run instructions | done | `README.md`, `docs/JUDGES.md`, `docs/INSTALL_ON_TV.md` |
| Open-source license file | done (MIT; Amazon sample MIT-0 text kept) | `LICENSE`, `THIRD_PARTY_NOTICES.md`, `NOTICE` |
| Pre-existing work explained | doc | `docs/PRE_EXISTING.md` |
| Product Feedback per tool (five elements) | doc; would-build-again answers need the developer's own words | `docs/PRODUCT_FEEDBACK.md` |
| Friction log (optional, up to 10% bonus) | doc (35 entries: 33 from notes kept at the time, 2 user-reported) | `FRICTION_LOG.md`, `docs/DEVPOST_FRICTION_PASTE.md` |
| Feature requests (optional) | doc | `docs/DEVPOST_DESCRIPTION.md` |
| Claims with evidence | doc | `docs/CLAIMS.md` |
| Device evidence and Fire TV readiness | doc (cloud row to be filled) | `docs/DEVICE_EVIDENCE.md` |
| Accessibility self-audit (measured) | done | `docs/ACCESSIBILITY.md`, `tools/a11y-measure.mjs` |
| Privacy and safety | doc | `docs/PRIVACY_AND_SAFETY.md`, `SECURITY.md` |
| User testing page | doc: **NOT YET DONE** template | `docs/USER_TESTING.md` |
| Secret scan (tracked files and history) | done, 0 hits | `docs/CLAIMS.md` #20; `secrets.test.ts` |
| Judge APK without a topic | done, outside the repo | `thodu-196f20a-judge.apk` (SHA-256 in `docs/JUDGES.md`) |

## B. USER-ONLY items (nobody else can do these)

| # | Item | Exact need |
|---|---|---|
| 1 | **Fresh cloud Fire TV recording** | In Amazon Developer Console > Appstore Quality Central > Live Device Interaction, install `thodu-196f20a-judge.apk` on a real Fire TV and record the **whole browser window** (console, device name and the app all visible). Then read the model and OS from the console **Details** tab and write them into `docs/DEVICE_EVIDENCE.md` (last table row) and the Devpost description. Do not guess "Fire OS 14". |
| 2 | **Home-TV footage** (Sony TV, Android TV) | Film on 2026-10-19 with the family member. Label it "Android TV", never "Fire TV". Keep a dated file name. Do not show the real notification topic on screen. |
| 3 | **User testing facts** | After 2026-10-19 fill `docs/USER_TESTING.md` (date, anonymous participant, tasks, observations, problems, changes). Until then no text says "tested with users". |
| 4 | **Demo video** | Under 3 minutes; see section D. |
| 5 | **YouTube (or Vimeo) upload** | Public visibility, English; paste the link on the Devpost form. |
| 6 | **Devpost form** | Paste the fields from `DEVPOST_PASTE_KIT.md` (in `Desktop\thodu-audit`, outside the repo); choose track Fire TV; no mini challenge unless a separate public contribution exists; answer the Product Feedback would-build-again question in your own words. |
| 7 | **Repo access action** | Either make the repo public and check the license shows in the About box, **or** keep it private and add `chris-trag`, `knmeiss`, `giolaq`, `anishamalde`, `mosesroth`, `emersonsklar` as collaborators **at submission time** (invitations expire after 7 days). Recommendation: `REPO_ACCESS_RECOMMENDATION.md` (also in `Desktop\thodu-audit`). Nothing has been pushed or changed by the assistant. |
| 8 | **Judge APK hosting** | Choose where judges download `thodu-196f20a-judge.apk` (must stay available until the judging period ends on 2026-11-20). Never publish the private topic-bearing build. |
| 9 | **Eligibility and ownership confirmations** | Age of majority, no financial or preferential support from Amazon/Devpost, you are the Representative. |
| 10 | **Real phone delivery proof (optional)** | Subscribe a phone to a throwaway topic, press Help on the TV (not the cloud device), note the time. Only then may any text say the message reached a phone. |
| 11 | **Freeze** | No repository or form changes after the deadline. |

## C. Pre-submission checks (the day before)

- [ ] `cd packages/shared && npx jest -c jest.core.config.js` shows all tests passing.
- [ ] `git status` clean; the commit you submit is the one the judge APK was built from (or say so).
- [ ] No topic anywhere: `git grep` for a `thodu-xxxx-xxxx-xxxx` shaped string returns only the placeholders and test fixtures.
- [ ] README, JUDGES, DEVPOST_DESCRIPTION still say the same numbers (212 tests, 15 suites).
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
- "212 unit tests passing; contrast measured by script" (re-check the numbers before filming)

### Wording that must not appear
Fire TV certified, Appstore approved, tested with users (without evidence), emergency service, medical device, "reminder" as a feature, voice recognition or voice control, usage-adaptive or learning Home, "works on all Fire TVs", any claim about the current build running on a Fire TV before item B1 is done.
