import React from 'react';
import {View} from 'react-native';
import {Text} from '../components/Text';
import {Focusable} from '../components/Focusable';
import {Screen} from '../components/Screen';
import {ButtonContent} from '../components/ButtonContent';
import {useUI} from '../settings/useUI';

export interface InfoScreenProps {
  title: string;
  body: string;
  /** Draw the message as a high-visibility alert panel (Help). */
  alert?: boolean;
  onBack: () => void;
}

/** Placeholder / demo message with a Back button that holds initial focus. */
export const InfoScreen = ({title, body, alert, onBack}: InfoScreenProps) => {
  const {t, colors, fs, sz, px} = useUI();

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          gap: px(32),
        }}>
        <View
          style={{
            padding: px(48),
            borderRadius: 24,
            backgroundColor: alert ? colors.accent : colors.surface,
          }}>
          <Text
            accessibilityRole="header"
            style={{
              color: alert ? colors.onAccent : colors.text,
              fontSize: fs(72),
              lineHeight: fs(86),
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
          <Text
            style={{
              color: alert ? colors.onAccent : colors.textMuted,
              fontSize: fs(38),
              lineHeight: fs(50),
              marginTop: px(16),
            }}>
            {body}
          </Text>
        </View>
        <View style={{alignSelf: 'flex-start'}}>
          <Focusable
            role="button"
            label={t('common.back')}
            preferred
            onPress={onBack}
            testID="back-button">
            {() => (
              <View
                style={{
                  minWidth: sz(300),
                  minHeight: sz(110),
                  paddingHorizontal: px(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  backgroundColor: colors.surface,
                  borderWidth: 3,
                  borderColor: colors.border,
                }}>
                <ButtonContent
                  label={t('common.back')}
                  icon="back"
                  color={colors.text}
                  size={42}
                />
              </View>
            )}
          </Focusable>
        </View>
      </View>
    </Screen>
  );
};
