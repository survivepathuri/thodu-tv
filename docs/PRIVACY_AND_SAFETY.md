# Thodu TV: Privacy and safety
*Easy TV. One button. Family one press away.*

> **Thodu TV is not an emergency service and not a medical device.** It does not call emergency numbers, does not monitor health, does not give medical advice and does not schedule or remind medicines. In an emergency call your local emergency number.

Tags are explained in [DEVICE_EVIDENCE.md](DEVICE_EVIDENCE.md). The full security self-audit is [../SECURITY.md](../SECURITY.md).

## What stays on the device

Saved in Android app-private storage as one JSON entry (`thodu.state`) `[unit test]` `persist.test.ts`:

- the needs the person chose, language, scanning speed;
- whether setup was finished;
- the family notification **topic name** (see below), the Real/Demo switch and whether a test message succeeded.

Not saved: names, addresses, phone numbers, health data, voice, camera images. The "recent help requests" list on the Family screen is kept **in memory only** and disappears when the app closes `[code only]`. `allowBackup` is off, so the data is not copied into Android backups `[APK static]` (`SECURITY.md`). It is not encrypted by the app. "Reset Thodu TV" in Settings erases it `[code only]`.

There are no accounts, no analytics, no advertising, no crash reporting and no Thodu TV server `[code only]`; `INTERNET` is the only network permission the app asks for itself, and its one use is the notification request below `[APK static]`.

## What leaves the device, and where it goes

Only when the person presses a family button in **real mode**, Thodu TV makes one HTTPS `POST` to **`https://ntfy.sh/<topic>`**, a free public notification service run by a third party `[unit test]` `notify.test.ts` (network faked) and `[code only]` `core/notify.ts`.

| Part of the request | Value |
|---|---|
| Body (examples) | "Help was requested from the TV at HH:MM", "A hello from the TV at HH:MM", "Medicine was confirmed on the TV at HH:MM", "This is a test message from the TV at HH:MM" |
| Headers | `Title: Thodu TV`, `Priority: high`, `Tags` (an emoji tag such as `warning`, `wave`, `pill`) |
| Not included | name, address, health condition, medicine name, dose, settings, device id |

The clock time is the TV's local time. ntfy.sh also sees what any web server sees (the sender's IP address and when the request was made). What ntfy's own pages say about retention and logging is summarised below ("ntfy.sh: what the official pages say"); that is the pages' wording, not a legal review.

### Who can read the messages

**Anyone who knows the topic name can read every message sent to it and can also post to it.** There is no login. The topic is the only protection:

- The TV makes a random topic `thodu-` + 12 characters from a 32-letter alphabet (60 random bits) from a cryptographic source `[unit test]` `notify.test.ts`; it is shown only on the TV's Settings > Family notifications screen. That is unguessable in practice but it is a shared secret, not access control.
- Share it only with the family member who needs it. "Make a new name" creates a new one; the family phone must subscribe again.
- **Judges and testers: use the topic your own TV generates. Never reuse a topic from a document, a screenshot or a video.** The judge APK contains no topic at all `[APK static]` (searched), and the developer's private test build is never published.

## ntfy.sh: what the official pages say

Read on **2026-10-19** (GET only; nothing was posted to ntfy.sh for this). This restates the pages and adds nothing beyond them. The pages can change; check them again if it matters.

- **What it is.** From the Terms: "ntfy (pronounced "notify") is a simple HTTP-based pub-sub notification service. It allows you to send push notifications to your phone or desktop via scripts from any computer, using a REST API." The hosted service is "operated by ntfy LLC"; the server and apps are open source and can be self-hosted. (https://ntfy.sh/docs/terms/, "Last updated: January 26, 2026".)
- **No login on the free public server.** Terms: "You may use the Service without creating an account or subscribing to a paid plan. Free usage is subject to rate limits and other restrictions as described in our documentation." Privacy policy: "You can use ntfy without creating an account. Anonymous usage is fully supported." (https://docs.ntfy.sh/privacy/)
- **Topics are not authenticated.** Terms: "Topic names on ntfy.sh are public. If you use the Service without access controls, your topic name functions as a password. You are responsible for choosing topic names that cannot be easily guessed. We are not responsible for any unauthorized access to messages published to easily guessable topic names." Publishing docs: "Since there is no sign-up, the topic is essentially a password, so pick something that's not easily guessable." and "Obviously all topics on ntfy.sh are public". (https://docs.ntfy.sh/publish/) So anyone who knows a topic name can read and publish to it, as stated above.
- **Message caching and retention.** Privacy policy: "Messages you publish are temporarily cached on our servers (default: 12 hours) to support message polling and to overcome client network disruptions. Messages are deleted after the cache duration expires." Its retention table lists "Messages: 12 hours (configurable by server operators)". The FAQ gives the same default: "Messages are cached for the duration configured in server.yml (12h by default)". (https://docs.ntfy.sh/privacy/, https://docs.ntfy.sh/faq/.) We did not check what the hosted server is actually configured to; "default" is the pages' word.
- **Logs.** Privacy policy: "IP addresses - Used for rate limiting to prevent abuse. May be temporarily logged for debugging purposes, though this is typically turned off." and "The server does not log message content by default". FAQ: "the logs do contain topic names and IP addresses, but I don't use them for anything other than troubleshooting and rate limiting."
- **Availability.** Terms: "The Service is provided on a "best effort" basis. We do not guarantee any specific uptime or availability." and for guaranteed uptime "we recommend self-hosting your own ntfy server". This is another reason the family message can never be the only way to get help.
- **Acceptable use.** Terms: users agree not to "Send spam, unsolicited messages, or messages to recipients who have not consented to receive them". Thodu TV sends only to a topic the family member chose to subscribe to; judges and testers should do the same.

**Recommendation (ours, based on the above):** every judge and user should set their own random topic (Settings > Family notifications > "Make a new name" generates one) and never reuse a topic from a document, screenshot or video. For anything that matters, self-hosting an ntfy server or using ntfy's access controls would be the next step; neither is built into Thodu TV.

## Duplicate messages are possible

The sender retries once after a timeout. If the first POST was slow but did reach ntfy.sh, the family phone can receive the same message twice (`core/notify.ts`, unit-tested as intended behaviour in `notify.test.ts`). A duplicate is preferred to a lost help request. This is not an error state the person sees.

## Honest behaviour

- "Family notified" / "Your family was told" is shown **only after ntfy.sh answered with an HTTP 2xx** `[unit test]` `notify.test.ts`, `familyAlert.test.ts`. A 2xx means the public service accepted the message; it does **not** prove that a family member saw it.
- Before a test message has succeeded, the buttons are clearly labelled demo and nothing leaves the TV: "Demo: nobody was told" `[unit test]`.
- If sending fails the app says so in English, Hindi and Telugu ("We could not reach your family. Please call them.") `[unit test]` `strings.test.ts`.
- A held or bouncing remote key cannot spam: a repeat of the same button within 3 seconds after a success is ignored `[unit test]`.
- Delivery from a real TV to a real phone has **not** been verified `[not tested]`. A POST sent from the developer's PC to a private topic returned HTTP 200 and was read back by polling on 2026-10-18; that proves the service path, not the TV app.

## Safety limits

- Medicines: a single "Yes, I took it" confirmation that notifies the family. It does not know what the medicine is, cannot tell whether it was taken, and gives no reminder.
- Help: a notification to a phone that may be off, silent or unsubscribed. It must never be the only way a person can get help.
- Hindi and Telugu wording is not reviewed by native speakers; a wrong word in a safety message is possible.
- No user study has been run (see [USER_TESTING.md](USER_TESTING.md)).

## Also in the repository
Android permissions, signing (debug key, demo only), dependency audit (108 advisories, mostly build tooling, reachability not assessed) and the secret scan are in [../SECURITY.md](../SECURITY.md).
