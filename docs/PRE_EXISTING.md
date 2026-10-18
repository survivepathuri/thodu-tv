# What existed before, what was built when

The rules ask that a project which "existed prior to the Hackathon Submission Period" be "significantly updated after the start" and that the entrant explain how. The Submission Period began **Monday, August 31, 2026, 10:15 am Pacific**. This page lists every earlier piece of work so a judge can check it. All dates come from `git log` and are shown in the commit's own timezone (IST, +0530) as recorded.

## Short answer

**Thodu was started after the Submission Period began, in a clean repository, on 2026-10-12.** Nothing in it was written before August 31. Two kinds of earlier material exist and both are disclosed: (1) Amazon's open-source sample that the repository was started from, and (2) an earlier, separate, unsubmitted project of the same developer ("AURA+"), from which **no code was ported**.

## 1. Thodu repository (this repo)

| Item | Value |
|---|---|
| Repository | `survivepathuri/thodu-tv` (GitHub, currently private), branch `main` |
| First commit | `35bb725`, **2026-10-12 00:45 +0530**: "import Amazon react-native-multi-tv-helloworld at commit 4b9ebf86d697e06c4547084e98b51a7318976a75 (MIT-0)" |
| Second commit | `495d126`, 2026-10-12 00:47: rename to Thodu, remove Vega and non-Android-TV targets, add license and notice |
| Commits | 35 as of the evening of 2026-10-18 before this documentation pass: 29 on 2026-10-12, 1 on 2026-10-14, 5 on 2026-10-18 (`git log --format=%ad --date=short`) |
| Package id | `com.thodu.tv` |
| Application code | Everything under `packages/shared/src` (all screens, the needs-to-settings logic, themes, scanner, persistence, notification sender, strings in 3 languages, tests), `tools/`, `assets/branding/` (original artwork), `docs/` was written in this repository after the first two commits. |

### What was built when (from commit subjects)

- **2026-10-12 (about 01:30 to 05:50 IST):** needs-to-settings core and tests, themes and contrast tests, setup/home/help screens, single-button scanning, read-aloud and demo captions, persistence, screen-reader-aware adaptation, the ntfy notification path with honest failure states, Hindi and Telugu strings, self-check tools (accessibility audit, cold start, security check), simple language and labelled icons, app icon and banner, universal ARM+x86 release config, first versions of the README, judge guide, accessibility and security audits, friction log.
- **2026-10-14 (`a03802c`):** hid unfinished tiles; the Watch tile always opens the labelled demo.
- **2026-10-18 (`cc12cfb`):** Medicines tile and confirm screen (one-press "Yes, I took it" with a family notification), one shared `sendFamilyAlert` used by Help, Family and Medicines with a 3-second debounce, optional build-time topic from a git-ignored file. Then documentation, the measured accessibility script and test, and the git-derived `versionName` plugin.

## 2. Amazon starter sample (attributed, MIT-0)

The repository was started from Amazon's **react-native-multi-tv-helloworld** (`github.com/AmazonAppDev/react-native-multi-tv-helloworld`), imported at upstream commit `4b9ebf86d697e06c4547084e98b51a7318976a75` (upstream commit date 2026-09-21, also after August 31). Its license is MIT No Attribution (MIT-0), copyright Amazon.com, Inc. (text kept in `LICENSE-AMAZON-SAMPLE`; credits in `NOTICE`). It provided the Yarn 4 monorepo layout, the Expo / react-native-tvos 0.83 project shell and a hello-world TV screen. The sample itself contains code derived from the React Native Community template (MIT; `LICENSE-THIRD-PARTY`). `react-native-tvos` is a community fork of React Native for TV, not an Amazon product.

Some sample files remain in `packages/expotv` (`components/`, `layouts/`, `hooks/`, `constants/`) but the app does not use them. Everything the person sees in Thodu is Thodu code.

## 3. Earlier project "AURA+" (separate, unsubmitted, nothing ported)

| Item | Value |
|---|---|
| Location | A separate local repository on the developer's PC (`AURA-PLUS-MCP`), never submitted to this hackathon |
| Commits | 23, all between **2026-09-26 06:18 +0530 and 2026-09-27 03:05 +0530** (16 on Sep 26, 7 on Sep 27); first subject: "AURA+: Alexa+ MCP care companion, Fire TV dashboard, Bedrock assistant" |
| Relation to Thodu | A different design (Alexa+ MCP care companion with a Supabase/Python backend and a Bedrock assistant). Thodu was renamed from the working name "AURA+" but started from a clean repository. |
| Code ported | **None: 0 lines.** Two old files were considered and deliberately not ported because they are tied to the old backend (a medicine schedule helper of 94 lines and a dose-row component of 139 lines). The Thodu Medicines screen was written new (about 55 lines) with no schedule. |
| Evidence | Both repositories' `git log`; the developer's audit note `PORTED.md` (outside this repo) |

Those September dates are themselves after August 31, so even the earlier project falls inside the Submission Period; it is disclosed anyway.

## 4. How Thodu was "significantly updated" (for the Devpost field)

The Thodu repository did not exist before 2026-10-12, so there is no pre-hackathon baseline to update. The only pre-existing parts are the Amazon sample (hello-world scaffold) and ideas from the unsubmitted AURA+ project. The demo video and the Devpost description show the features added after the sample import: needs-based setup, live restyling, themes with measured contrast, single-button scanning, read-aloud, captions demo, three languages, persistence, Family/Medicines/Help notifications through ntfy.sh, and the measured accessibility audit.

## 5. Tools used while building

Claude Code (an AI coding assistant) was used to write and review code and documents in this repository; Commits made with it carry a `Co-Authored-By` trailer (17 of the first 35). The developer ran, checked and is responsible for the result. No Amazon AI tool (such as the Amazon Devices Builder Tools MCP server) is recorded as used in the commits or notes.
