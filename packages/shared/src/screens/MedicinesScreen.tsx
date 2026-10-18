import React from 'react';
import {View} from 'react-native';
import {Text} from '../components/Text';
import {ActionButton} from '../components/ActionButton';
import {Screen} from '../components/Screen';
import {useUI} from '../settings/useUI';
import {useFamilyAlert} from '../settings/useFamilyAlert';
import {EmergencyNote} from './HelpFlow';

/** One question, one big OK. Yes tells the family (real only after a good test). */
export const MedicinesScreen = ({onBack}: {onBack: () => void}) => {
  const {t, colors, fs, px} = useUI();
  const {phase, send} = useFamilyAlert('medicine');
  const status =
    phase === 'sending'
      ? t('alert.sending')
      : phase === 'sent'
        ? t('alert.sent')
        : phase === 'demo'
          ? t('alert.demo')
          : phase === 'failed'
            ? t('alert.failed')
            : '';

  return (
    <Screen>
      <View style={{flex: 1, justifyContent: 'center', gap: px(32)}}>
        <Text
          accessibilityRole="header"
          style={{color: colors.text, fontSize: fs(72), lineHeight: fs(86), fontWeight: 'bold'}}>
          {t('tile.medicines')}
        </Text>
        <Text style={{color: colors.textMuted, fontSize: fs(52), lineHeight: fs(64)}}>
          {t('med.question')}
        </Text>
        <View style={{flexDirection: 'row', gap: px(40)}}>
          <ActionButton
            primary
            preferred
            label={t('med.yes')}
            onPress={send}
            icon="ok"
            testID="med-yes"
          />
          <ActionButton label={t('med.no')} onPress={onBack} icon="back" testID="med-no" />
        </View>
        {status !== '' && (
          <Text
            testID="med-status"
            accessibilityLiveRegion="polite"
            style={{color: colors.text, fontSize: fs(44), lineHeight: fs(56), fontWeight: 'bold'}}>
            {status}
          </Text>
        )}
        <EmergencyNote />
      </View>
    </Screen>
  );
};
