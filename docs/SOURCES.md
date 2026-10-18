# Sources for facts used in this repository

*A TV app that older adults and people with disabilities can use with one button, and that tells their family when they need help.*

Every statistic or factual claim about people, disability, ageing or other products in the README, the Devpost description and the docs comes from one of the pages below. Each page was opened on **2026-10-19** (access date) for this repository. The facts are **context for why the problem matters**. They are not results of Thodu TV, which has had no user session (see [USER_TESTING.md](USER_TESTING.md)).

If a figure is not in this file, it is not in the docs. Things we looked for and could **not** verify from an official page are listed at the end.

## S1. WHO: Disability (global)

- URL: https://www.who.int/news-room/fact-sheets/detail/disability-and-health
- Page date: 7 March 2023. Accessed 2026-10-19. Data year: as stated by WHO on that page (the quoted sentence gives no single year).
- Quoted: "An estimated 1.3 billion people experience significant disability. This represents 16% of the world's population, or 1 in 6 of us."
- Also quoted: "This number is growing because of an increase in noncommunicable diseases and people living longer."
- Used for: the size of the group of people with disabilities (global).

## S2. WHO: Ageing and health (global)

- URL: https://www.who.int/news-room/fact-sheets/detail/ageing-and-health
- Page date: 1 October 2025. Accessed 2026-10-19. Data years: 2020 and 2030 (projection).
- Quoted: "By 2030, 1 in 6 people in the world will be aged 60 years or over." and "At this time the share of the population aged 60 years and over will increase from 1 billion in 2020 to 1.4 billion."
- Quoted: "Common conditions in older age include hearing loss, cataracts and refractive errors".
- Used for: more people aged 60+; hearing and vision problems are common in older age.

## S3. Government of India (PIB): Elderly in India

- URL: https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/oct/doc20251028678601.pdf (Press Information Bureau backgrounder "Elderly in India: Population, Challenges, and Government Initiatives", 28 October 2025)
- Accessed 2026-10-19. Data years: 2011 and 2036 (projection by the Technical Group on Population Projections, July 2020, as cited by PIB).
- Quoted: "India is undergoing a rapid demographic transition, with the elderly population (60 years and above) projected to more than double from 100 million in 2011 to 230 million by 2036."
- Quoted: "Southern states, Himachal Pradesh, and Punjab have above-average elderly populations".
- Quoted (challenges listed by PIB): "Digital divide: Technology adoption barriers, lack of training and accessible devices."
- Used for: the older population in India is growing; southern states (where Telugu is spoken) have above-average elderly shares; accessible devices are a named gap.

## S4. MoSPI: Disabled Persons in India (Census 2011)

- URL: https://www.mospi.gov.in/sites/default/files/publication_reports/Disabled_persons_in_India_2016.pdf
- Publication year: 2016, using Census 2011 data. Accessed 2026-10-19. Data year: 2011.
- Quoted: "As per Census 2011, in India, out of the 121 Cr population, about 2.68 Cr persons are `disabled' which is 2.21% of the total population."
- Cross-check, Ministry of Social Justice answer via PIB: https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=116318 : "As per Census 2011, there are about 2.68 crore persons with disabilities".
- Used for: the size of the disabled population in India. The Census 2011 share (2.21%) and the WHO global share (16%) differ because definitions and methods differ; they are not comparable and we do not compare them.

## S5. Amazon: Fire OS accessibility (VoiceView)

- URL: https://developer.amazon.com/docs/fire-tv/assistive-technologies-fire-os.html (Fire OS Developer Docs > Amazon Fire TV > Accessibility)
- Accessed 2026-10-19.
- Quoted: "While Fire OS's VoiceView and Android's TalkBack are both accessibility services that interact with the Android accessibility framework, VoiceView is a completely distinct screen reader from TalkBack".
- Used for: Fire OS already ships its own screen reader. Thodu TV does not replace it and has not been tested with it (see [ACCESSIBILITY.md](ACCESSIBILITY.md)). We make no other statement about Fire TV's built-in features because we did not open a page that lists them.

## S6. ntfy.sh: terms, privacy policy, FAQ, publishing docs (not statistics)

- URLs: https://ntfy.sh/docs/terms/ (Terms of Service, "Last updated: January 26, 2026"), https://docs.ntfy.sh/privacy/, https://docs.ntfy.sh/faq/, https://docs.ntfy.sh/publish/. Accessed 2026-10-19 (GET only).
- Quotes and use: [PRIVACY_AND_SAFETY.md](PRIVACY_AND_SAFETY.md), section "ntfy.sh: what the official pages say" (12-hour message cache default, topics are public and act as a password, best-effort availability).

## Not verified (so not stated anywhere)

- The number of TV households in India or in Telugu/Hindi-speaking states from an official source. Only news reports of a ministry figure were found; the ministry document was not opened.
- Any statistic that says the TV is a shared household screen, or that standard TV remotes are hard to use for older people. No official page was opened for this; the README does not claim it as a statistic.
- State-level disability or elderly figures for Andhra Pradesh, Telangana or Hindi-speaking states.
- The number of people who would use Thodu TV, or any effect of the app. There is none to report.
