import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {LANGS, Lang, Need, StringKey} from '../core';
import {Focusable} from '../components/Focusable';
import {Screen} from '../components/Screen';
import {useSettings} from '../settings/SettingsProvider';
import {useUI} from '../settings/useUI';

// The need that makes everything else hard to operate comes first and holds
// the initial focus: one OK press on a fresh install turns scanning on.
const SETUP_ORDER: readonly Need[] = [
  'remoteDifficulty',
  'lowVision',
  'hardOfHearing',
  'readingDifficulty',
];

// Plain text glyphs (no emoji, no image assets).
const NEED_GLYPH: Record<Need, string> = {
  lowVision: 'Aa',
  hardOfHearing: 'CC',
  remoteDifficulty: 'OK',
  readingDifficulty: 'Abc',
};

const LANG_ACCESSIBLE_NAME: Record<Lang, string> = {
  en: 'English',
  te: 'తెలుగు',
};

export interface SetupScreenProps {
  /** 'setup' is first run; 'settings' reuses the same screen later. */
  mode: 'setup' | 'settings';
  onDone: () => void;
}

export const SetupScreen = ({mode, onDone}: SetupScreenProps) => {
  const {needs, toggleNeed, lang, setLang} = useSettings();
  const {t, colors, fs, sz, px, theme} = useUI();
  const isSetup = mode === 'setup';

  return (
    <Screen>
      <View style={{flex: 1, flexDirection: 'row', gap: px(60)}}>
        {/* Left: title, live preview, language. Never scrolls away. */}
        <View style={{width: '35%'}}>
          <Text
            accessibilityRole="header"
            style={{
              color: colors.text,
              fontSize: fs(46),
              fontWeight: 'bold',
              lineHeight: fs(56),
            }}>
            {t(isSetup ? 'setup.title' : 'settings.title')}
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: fs(26),
              lineHeight: fs(34),
              marginTop: px(8),
            }}>
            {t(isSetup ? 'setup.subtitle' : 'settings.subtitle')}
          </Text>

          <View
            style={{
              marginTop: px(20),
              padding: px(16),
              backgroundColor: colors.surface,
              borderWidth: 2,
              borderColor: colors.border,
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fs(22),
                lineHeight: fs(30),
              }}>
              {t('setup.preview.label')} - {t(theme.name === 'sunrise' ? 'setup.preview.sunrise' : 'setup.preview.highContrast')}
            </Text>
            <Text
              testID="preview-sample"
              style={{
                color: colors.text,
                fontSize: fs(32),
                lineHeight: fs(42),
                marginTop: px(8),
              }}>
              {t('setup.preview.sample')}
            </Text>
          </View>

          <Text
            style={{
              color: colors.textMuted,
              fontSize: fs(22),
              marginTop: px(20),
              marginBottom: px(6),
            }}>
            {t('setup.language')}
          </Text>
          <View style={{flexDirection: 'row', gap: px(20)}}>
            {LANGS.map(code => {
              const active = lang === code;
              return (
                <Focusable
                  key={code}
                  role="radio"
                  checked={active}
                  label={LANG_ACCESSIBLE_NAME[code]}
                  onPress={() => setLang(code)}
                  testID={`lang-${code}`}>
                  {() => (
                    <View
                      style={{
                        minWidth: sz(150),
                        minHeight: sz(72),
                        paddingHorizontal: px(24),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        backgroundColor: active ? colors.accent : colors.surface,
                      }}>
                      <Text
                        style={{
                          color: active ? colors.onAccent : colors.text,
                          fontSize: fs(32),
                          fontWeight: 'bold',
                        }}>
                        {code === 'en' ? 'EN' : 'తెలుగు'}
                      </Text>
                    </View>
                  )}
                </Focusable>
              );
            })}
          </View>
        </View>

        {/* Right: needs scroll; the big button is a sticky footer. */}
        <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{gap: px(18), padding: px(20)}}>
          {SETUP_ORDER.map((need, i) => {
            const selected = needs.includes(need);
            const title = t(`need.${need}.title` as StringKey);
            const desc = t(`need.${need}.desc` as StringKey);
            return (
              <Focusable
                key={need}
                role="checkbox"
                checked={selected}
                preferred={i === 0}
                label={`${title}. ${desc}`}
                onPress={() => toggleNeed(need)}
                testID={`need-${need}`}>
                {() => {
                  const cs = colors.card[need];
                  const fg = selected ? cs.fgSelected : cs.fg;
                  return (
                  <View
                    style={{
                      minHeight: sz(120),
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: px(24),
                      padding: px(20),
                      borderRadius: 20,
                      backgroundColor: selected ? cs.bgSelected : cs.bg,
                    }}>
                    <View
                      style={{
                        width: sz(100),
                        height: sz(100),
                        borderRadius: sz(50),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 3,
                        borderColor: fg,
                      }}>
                      <Text
                        accessible={false}
                        style={{
                          color: fg,
                          fontSize: fs(32),
                          fontWeight: 'bold',
                        }}>
                        {NEED_GLYPH[need]}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: fg,
                          fontSize: fs(38),
                          lineHeight: fs(46),
                          fontWeight: 'bold',
                        }}>
                        {title}
                      </Text>
                      <Text
                        style={{
                          color: fg,
                          fontSize: fs(26),
                          lineHeight: fs(34),
                        }}>
                        {desc}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: sz(48),
                        height: sz(48),
                        borderRadius: 8,
                        borderWidth: 3,
                        borderColor: fg,
                        backgroundColor: selected ? fg : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {selected && (
                        <Text
                          accessible={false}
                          style={{
                            color: cs.bgSelected,
                            fontSize: fs(30),
                            fontWeight: 'bold',
                          }}>
                          {'✓'}
                        </Text>
                      )}
                    </View>
                  </View>
                  );
                }}
              </Focusable>
            );
          })}
        </ScrollView>

        <View style={{paddingTop: px(16)}}>
          <Focusable
            role="button"
            label={t(isSetup ? 'setup.continue' : 'settings.done')}
            onPress={onDone}
            testID="setup-continue">
            {() => (
              <View
                style={{
                  minHeight: sz(110),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  backgroundColor: colors.accent,
                }}>
                <Text
                  style={{
                    color: colors.onAccent,
                    fontSize: fs(44),
                    fontWeight: 'bold',
                  }}>
                  {t(isSetup ? 'setup.continue' : 'settings.done')}
                </Text>
              </View>
            )}
          </Focusable>
        </View>
        </View>
      </View>
    </Screen>
  );
};
