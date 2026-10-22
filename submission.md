# Thodu TV: Submission checklist (Fire TV track)
*Built for one person, made for many.*

Deadline: **Fri 2026-10-23, 12:00 pm Pacific**. No edits are allowed after the deadline. Rules source: the official Devpost rules and overview pages (https://amazonappdev2026.devpost.com/). Status words: **done** (in this repository or released), **open** (a person has to do it).

## A. Done (in this repository)

| Item | Status | Where |
|---|---|---|
| Working Android TV / Fire OS app (APK) | done: judge build `d52f5fe`, topic-free, GitHub Release asset `thodu-tv-d52f5fe-judge.apk` | `docs/JUDGES.md`; build steps in `README.md` |
| Text description | done | `docs/DEVPOST_DESCRIPTION.md` |
| Code repository with source, assets and setup/run instructions | done | `README.md`, `docs/JUDGES.md`, `docs/INSTALL_ON_TV.md` |
| Open-source license file | done (MIT; Amazon sample MIT-0 text kept) | `LICENSE`, `THIRD_PARTY_NOTICES.md`, `NOTICE` |
| Pre-existing work explained (nothing predates 2026-08-31; starting material disclosed) | done | `docs/PRE_EXISTING.md` |
| Sources for every statistic | done | `docs/SOURCES.md` |
| Product Feedback per tool (five elements) | done, 13 entries | `docs/PRODUCT_FEEDBACK.md` |
| Friction log (optional, up to 10% bonus) | done: curated list in `docs/FRICTION_LOG.md`, detailed notes in `FRICTION_LOG.md` (40 entries), paste text in `docs/DEVPOST_FRICTION_PASTE.md` | |
| Feature requests (optional) | done | `docs/FEATURE_REQUESTS.md` |
| Claims with evidence | done | `docs/CLAIMS.md` |
| Device evidence and Fire TV readiness | done | `docs/DEVICE_EVIDENCE.md` |
| Accessibility self-audit (measured) | done | `docs/ACCESSIBILITY.md`, `tools/a11y-measure.mjs` |
| Privacy and safety | done | `docs/PRIVACY_AND_SAFETY.md`, `SECURITY.md` |
| User testing page | done: one consented family session, n = 1, user-reported | `docs/USER_TESTING.md` |
| Secret scan (tracked files and history) | done, 0 hits | `SECURITY.md` "Secrets and personal data scan" |
| Repository About text | done | `docs/REPO_ABOUT.md` |

## B. Open items (a person has to do these)

| # | Item | Exact need |
|---|---|---|
| 1 | **Publish the demo video** | Done: the video link (https://youtu.be/T1x5jX0IRV4) has been added to the README, docs/JUDGES.md and docs/DEVPOST_DESCRIPTION.md. Paste the same link in the Devpost form. |
| 2 | **Make the repository public** | Check that the MIT license shows in the About box while logged out. |
| 3 | **Create the GitHub Release** | Upload the judge APK renamed to `thodu-tv-d52f5fe-judge.apk`; put the SHA-256 from `docs/JUDGES.md` in the release notes. It must stay available until the judging period ends on 2026-11-20. Never upload a build that contains a private notification topic. |
| 4 | **Devpost form** | Paste the fields from `docs/DEVPOST_DESCRIPTION.md`; choose track Fire TV; enter the Open Source mini challenge with the four fields in the "Open Source mini challenge" section (no AWS Builder); answer the Product Feedback would-build-again question in your own words where it is blank. |
| 5 | **Eligibility and ownership confirmations** | Age of majority, no financial or preferential support from Amazon/Devpost, you are the Representative. |
| 5a | **Keep it public** | The repository, the Release and the demo video stay public and unchanged until the end of judging (2026-11-20), apart from the demo-video link, which has been added. |
| 6 | **Freeze** | No repository or form changes after 2026-10-23 12:00 pm Pacific. |

Not yet recorded anywhere in the repository (say so on the form instead of guessing): the Sony TV model and Android version, the exact build used in the 2026-10-20 session, the date and device name of the cloud Fire TV footage used in the video, native-speaker review of the Hindi and Telugu safety strings.

## C. Pre-submission checks

- [ ] `cd packages/shared && npx jest -c jest.core.config.js` shows 16 suites, 223 tests, all passing.
- [ ] `git status` clean; the judge APK was built from `d52f5fe` and later commits change documentation only (the `git diff d52f5fe..HEAD --stat` in `docs/JUDGES.md`).
- [ ] No topic anywhere: `git grep` for a `thodu-xxxx-xxxx-xxxx` shaped string returns only the placeholders and test fixtures.
- [ ] README, JUDGES, SECURITY and DEVPOST_DESCRIPTION say the same numbers (223 tests, 16 suites, 68,382,021 bytes, same SHA-256).
- [ ] Links in the Devpost text open for a logged-out visitor (video, Release).

## D. Video must-haves (from the verified rules)

Rules: "should be less than three (3) minutes", "should include footage that shows the Project functioning on the device for which it was built", "must be uploaded to and made publicly visible on YouTube or Vimeo", "must not include third party trademarks, or copyrighted music or other material" without permission; Fire TV: "must show the project running on an actual Fire TV device or the Fire TV/Vega simulator"; all materials in English.

### Allowed text-card wording
- "Fire TV: Amazon Live Device Interaction" (no Fire OS version unless read from the console Details tab)
- "Android TV (home TV, not a Fire TV)"
- "Demo mode: nobody is contacted until you send a test message"
- "Family notified appears only after the service accepts the message"
- "Watch is a demo panel with sample captions, no real video"
- "Medicines: one-press check-in, no reminders yet"
- "Not an emergency service"
- "One consented family session, n = 1" (not "tested with users" as a study)
- "223 unit tests passing; contrast measured by script"

### Wording that must not appear
Fire TV certified, Appstore approved, tested with users (as a study or as proof of benefit), emergency service, medical device, "reminder" as a feature, voice recognition or voice control, usage-adaptive or learning Home, "works on all Fire TVs", a Fire OS version number, the family member's name or any diagnosis.
