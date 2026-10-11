import {DICTIONARIES, Lang, StringKey} from './strings';

/**
 * "Simple language" variants of the key user-facing strings on Setup, Home,
 * Help, Family and Settings: shorter words, shorter sentences, same meaning.
 * Used instead of the normal string only when settings.simpleLanguage is on.
 * A key with no entry here falls back to the normal string.
 *
 * Hindi and Telugu were written by the developer and need native-speaker review.
 */
type Simple = Partial<Record<StringKey, string>>;

const en: Simple = {
  'setup.title': 'How can we help you?',
  'setup.subtitle': 'Pick what helps. Change it later.',
  'setup.preview.sample': 'Your TV text will look like this.',
  'need.lowVision.desc': 'Big words, strong colors',
  'need.hardOfHearing.desc': 'Words on screen, alerts',
  'need.remoteDifficulty.desc': 'Big buttons, auto scan',
  'need.readingDifficulty.desc': 'Easy words, pictures, voice',
  'home.title': 'What do you want to do?',
  'placeholder.body': 'Not ready yet.',
  'help.body': 'Only a demo. No one was told.',
  'help.confirm.title': 'Need help?',
  'help.confirm.body': 'This is only a demo. No one is called.',
  'help.confirm.body.real': 'We will message your family.',
  'help.sent.title': 'Family told (demo)',
  'help.sent.body': 'They will check on you.',
  'help.sent.real.title': 'Family told',
  'help.sending': 'Telling family...',
  'help.failed.title': 'Family not reached.',
  'help.emergency': 'Thodu is not for emergencies. Call your emergency number.',
  'family.recent': 'Help asked before',
  'family.none': 'No help asked yet.',
  'fam.instructions': 'On the family phone: get the free ntfy app. Add this name.',
  'fam.privacy': 'Share this name only with family. Anyone with it can read messages.',
  'fam.test': 'Send a test',
  'fam.new.body': 'The family phone needs the new name. Thodu stays in demo until a test works.',
  'fam.status.testing': 'Sending the test...',
  'fam.status.ok': 'Sent. Look at the family phone.',
  'fam.status.offline': 'Not sent. No internet.',
  'fam.status.timeout': 'Not sent. Internet too slow.',
  'fam.status.server': 'Not sent. The service said no.',
  'fam.status.needTest': 'Send a test first. It must work.',
  'fam.status.demo': 'Demo: no one is told when you ask for help.',
  'settings.subtitle': 'Change what helps.',
  'settings.family': 'Family alerts',
  'scan.speed': 'Scan speed',
  'reset.body': 'This erases your choices. You start over.',
  'reset.no': 'No, keep them',
  'a11y.suggest.body': 'A screen reader is on. Try Easier to see and Easier to read.',
};

const hi: Simple = {
  'setup.title': 'हम कैसे मदद करें?',
  'setup.subtitle': 'जो चाहिए चुनें। बाद में बदलें।',
  'setup.preview.sample': 'टीवी पर अक्षर ऐसे दिखेंगे।',
  'need.lowVision.desc': 'बड़े अक्षर, गहरे रंग',
  'need.hardOfHearing.desc': 'लिखे शब्द, स्क्रीन पर सूचना',
  'need.remoteDifficulty.desc': 'बड़े बटन, खुद स्कैन',
  'need.readingDifficulty.desc': 'आसान शब्द, चित्र, आवाज़',
  'home.title': 'क्या करना है?',
  'placeholder.body': 'अभी तैयार नहीं है।',
  'help.body': 'सिर्फ़ डेमो है। किसी को नहीं बताया।',
  'help.confirm.title': 'मदद चाहिए?',
  'help.confirm.body': 'यह सिर्फ़ डेमो है। किसी को नहीं बताया जाएगा।',
  'help.confirm.body.real': 'हम परिवार को संदेश भेजेंगे।',
  'help.sent.title': 'परिवार को बताया (डेमो)',
  'help.sent.body': 'वे जल्द हाल पूछेंगे।',
  'help.sent.real.title': 'परिवार को बताया',
  'help.sending': 'परिवार को बता रहे हैं...',
  'help.failed.title': 'परिवार तक नहीं पहुँचे।',
  'help.emergency': 'Thodu आपातकाल के लिए नहीं है। अपना आपातकालीन नंबर मिलाएँ।',
  'family.recent': 'पिछली माँगें',
  'family.none': 'अभी कोई माँग नहीं।',
  'fam.instructions': 'परिवार के फ़ोन पर मुफ़्त ntfy ऐप लें। यह नाम जोड़ें।',
  'fam.privacy': 'यह नाम सिर्फ़ परिवार को दें। नाम जानने वाला संदेश पढ़ सकता है।',
  'fam.test': 'जाँच भेजें',
  'fam.new.body': 'परिवार के फ़ोन पर नया नाम जोड़ें। जाँच सफल होने तक Thodu डेमो में रहेगा।',
  'fam.status.testing': 'जाँच भेज रहे हैं...',
  'fam.status.ok': 'भेज दिया। परिवार का फ़ोन देखें।',
  'fam.status.offline': 'नहीं भेजा। इंटरनेट नहीं है।',
  'fam.status.timeout': 'नहीं भेजा। इंटरनेट धीमा है।',
  'fam.status.server': 'नहीं भेजा। सेवा ने मना किया।',
  'fam.status.needTest': 'पहले जाँच भेजें। वह सफल हो तभी असली मोड चलेगा।',
  'fam.status.demo': 'डेमो: मदद माँगने पर किसी को नहीं बताया जाता।',
  'settings.subtitle': 'जो काम आए, बदलें।',
  'settings.family': 'परिवार को संदेश',
  'scan.speed': 'स्कैन की गति',
  'reset.body': 'आपके चुनाव मिट जाएँगे। सब फिर शुरू होगा।',
  'reset.no': 'नहीं, रहने दें',
  'a11y.suggest.body': 'स्क्रीन रीडर चालू है। "साफ़ दिखना" और "आसान पढ़ना" चुनें।',
};

const te: Simple = {
  'setup.title': 'మేము ఎలా సహాయం చేయాలి?',
  'setup.subtitle': 'మీకు కావలసినవి ఎంచుకోండి. తర్వాత మార్చవచ్చు.',
  'setup.preview.sample': 'టీవీలో అక్షరాలు ఇలా ఉంటాయి.',
  'need.lowVision.desc': 'పెద్ద అక్షరాలు, గాఢ రంగులు',
  'need.hardOfHearing.desc': 'అక్షరాలు, తెరపై హెచ్చరికలు',
  'need.remoteDifficulty.desc': 'పెద్ద బటన్లు, ఆటో స్కాన్',
  'need.readingDifficulty.desc': 'సులభ పదాలు, బొమ్మలు, వినిపించడం',
  'home.title': 'ఏమి చేద్దాం?',
  'placeholder.body': 'ఇంకా సిద్ధంగా లేదు.',
  'help.body': 'ఇది డెమో. ఎవరికీ చెప్పలేదు.',
  'help.confirm.title': 'సహాయం కావాలా?',
  'help.confirm.body': 'ఇది డెమో మాత్రమే. ఎవరికీ చెప్పరు.',
  'help.confirm.body.real': 'మేము మీ కుటుంబానికి సందేశం పంపుతాము.',
  'help.sent.title': 'కుటుంబానికి చెప్పాము (డెమో)',
  'help.sent.body': 'వారు మీ క్షేమం తెలుసుకుంటారు.',
  'help.sent.real.title': 'కుటుంబానికి చెప్పాము',
  'help.sending': 'కుటుంబానికి చెబుతున్నాము...',
  'help.failed.title': 'కుటుంబాన్ని చేరలేకపోయాము.',
  'help.emergency': 'తోడు అత్యవసర సేవ కాదు. అత్యవసరంలో మీ అత్యవసర నంబర్‌కు ఫోన్ చేయండి.',
  'family.recent': 'ఇటీవలి అభ్యర్థనలు',
  'family.none': 'ఇంకా అభ్యర్థనలు లేవు.',
  'fam.instructions': 'కుటుంబ ఫోన్‌లో ఉచిత ntfy యాప్ పెట్టండి. ఈ పేరు చేర్చండి.',
  'fam.privacy': 'ఈ పేరు కుటుంబానికే చెప్పండి. తెలిసినవారు సందేశాలు చదవగలరు.',
  'fam.test': 'పరీక్ష పంపండి',
  'fam.new.body': 'కుటుంబ ఫోన్ కొత్త పేరు చేర్చాలి. పరీక్ష విజయవంతమయ్యే వరకు తోడు డెమోలో ఉంటుంది.',
  'fam.status.testing': 'పరీక్ష పంపుతున్నాము...',
  'fam.status.ok': 'పంపాము. కుటుంబ ఫోన్ చూడండి.',
  'fam.status.offline': 'పంపలేదు. ఇంటర్నెట్ లేదు.',
  'fam.status.timeout': 'పంపలేదు. ఇంటర్నెట్ నెమ్మదిగా ఉంది.',
  'fam.status.server': 'పంపలేదు. సేవ అంగీకరించలేదు.',
  'fam.status.needTest': 'ముందు పరీక్ష పంపండి. అది విజయవంతమైతే నిజమైన రీతి వాడవచ్చు.',
  'fam.status.demo': 'డెమో: సహాయం కోరితే ఎవరికీ చెప్పరు.',
  'settings.subtitle': 'మీకు కావలసినవి మార్చండి.',
  'settings.family': 'కుటుంబ సందేశాలు',
  'scan.speed': 'స్కాన్ వేగం',
  'reset.body': 'మీ ఎంపికలు తొలగిపోతాయి. మళ్లీ మొదలవుతుంది.',
  'reset.no': 'వద్దు, ఉంచండి',
  'a11y.suggest.body': 'స్క్రీన్ రీడర్ ఆన్‌లో ఉంది. “స్పష్టంగా చూడటం”, “సులభంగా చదవడం” ఎంచుకోండి.',
};

export const SIMPLE_STRINGS: Record<Lang, Simple> = {en, hi, te};

/** Simple keys allowed to be longer than the normal string. None at present. */
export const SIMPLE_LENGTH_EXCEPTIONS: readonly StringKey[] = [];

/** The simple variant when `simple` is true and one exists, else the normal string. */
export function translateSimple(lang: Lang, key: StringKey, simple: boolean): string {
  if (simple) {
    const s = SIMPLE_STRINGS[lang][key];
    if (s) return s;
  }
  return DICTIONARIES[lang][key];
}
