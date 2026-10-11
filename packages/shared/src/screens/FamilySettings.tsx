import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {FetchLike, SendFailure, StringKey, isValidTopic, sendHelp} from '../core';
import {ActionButton} from '../components/ActionButton';
import {Focusable} from '../components/Focusable';
import {Screen} from '../components/Screen';
import {useSettings} from '../settings/SettingsProvider';
import {useUI} from '../settings/useUI';
import {EmergencyNote} from './HelpFlow';

type Status =
  | {kind: 'none'}
  | {kind: 'testing'}
  | {kind: 'ok'}
  | {kind: 'failed'; reason: SendFailure}
  | {kind: 'needTest'};

const FAIL_KEY: Record<SendFailure, StringKey> = {
  offline: 'fam.status.offline',
  timeout: 'fam.status.timeout',
  server: 'fam.status.server',
  invalid: 'fam.status.server',
};

/**
 * Settings > Family notifications: the private "name" (an ntfy topic) the
 * family phone subscribes to, a test button, and the Real / Demo switch.
 * Real mode is only offered after a test message got an HTTP 2xx.
 */
export const FamilySettingsScreen = ({
  onBack,
  newTopic,
  fetchImpl,
}: {
  onBack: () => void;
  /** Makes a fresh topic from a secure random source. */
  newTopic: () => string;
  fetchImpl: FetchLike;
}) => {
  const {t, colors, fs, px} = useUI();
  const {family, setFamily} = useSettings();
  const [confirmNew, setConfirmNew] = useState(false);
  const [status, setStatus] = useState<Status>({kind: 'none'});
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const topic = family.familyTopic;
  useEffect(() => {
    if (!isValidTopic(topic)) {
      setFamily({
        familyTopic: newTopic(),
        notifyMode: 'demo',
        testSucceeded: false,
      });
    }
  }, [topic, newTopic, setFamily]);

  const test = async () => {
    if (!isValidTopic(topic) || status.kind === 'testing') {
      return;
    }
    setStatus({kind: 'testing'});
    const r = await sendHelp(fetchImpl, topic, Date.now(), {kind: 'test'});
    if (r.ok) {
      // Only a 2xx from the server unlocks Real mode.
      setFamily({testSucceeded: true, notifyMode: 'real'});
    }
    if (mounted.current) {
      setStatus(r.ok ? {kind: 'ok'} : {kind: 'failed', reason: r.reason});
    }
  };

  const makeNew = () => {
    // The family phone is subscribed to the old name: back to demo until a
    // test message reaches the new one.
    setFamily({familyTopic: newTopic(), notifyMode: 'demo', testSucceeded: false});
    setStatus({kind: 'none'});
    setConfirmNew(false);
  };

  const setMode = (mode: 'real' | 'demo') => {
    if (mode === 'real' && !family.testSucceeded) {
      setStatus({kind: 'needTest'});
      return;
    }
    setFamily({notifyMode: mode});
    setStatus({kind: 'none'});
  };

  if (confirmNew) {
    return (
      <Screen>
        <View style={{flex: 1, justifyContent: 'center', gap: px(32)}}>
          <Text
            accessibilityRole="header"
            style={{
              color: colors.text,
              fontSize: fs(76),
              lineHeight: fs(90),
              fontWeight: 'bold',
            }}>
            {t('fam.new.title')}
          </Text>
          <Text
            style={{color: colors.textMuted, fontSize: fs(38), lineHeight: fs(50)}}>
            {t('fam.new.body')}
          </Text>
          <View style={{flexDirection: 'row', gap: px(40)}}>
            <ActionButton
              primary
              preferred
              label={t('fam.new.no')}
              onPress={() => setConfirmNew(false)}
              testID="fam-new-no"
            />
            <ActionButton label={t('fam.new.yes')} onPress={makeNew} testID="fam-new-yes" />
          </View>
        </View>
      </Screen>
    );
  }

  const statusText =
    status.kind === 'testing'
      ? t('fam.status.testing')
      : status.kind === 'ok'
        ? t('fam.status.ok')
        : status.kind === 'failed'
          ? t(FAIL_KEY[status.reason])
          : status.kind === 'needTest'
            ? t('fam.status.needTest')
            : family.notifyMode === 'demo'
              ? t('fam.status.demo')
              : '';
  const failed = status.kind === 'failed' || status.kind === 'needTest';

  const chip = (mode: 'real' | 'demo', label: string) => {
    const active = family.notifyMode === mode;
    return (
      <Focusable
        role="radio"
        checked={active}
        label={label}
        onPress={() => setMode(mode)}
        testID={`fam-mode-${mode}`}>
        {() => (
          <View
            style={{
              minHeight: px(84),
              paddingHorizontal: px(32),
              justifyContent: 'center',
              borderRadius: 20,
              borderWidth: active ? 0 : 3,
              borderColor: colors.border,
              backgroundColor: active ? colors.accent : colors.surface,
            }}>
            <Text
              style={{
                color: active ? colors.onAccent : colors.text,
                fontSize: fs(34),
                fontWeight: 'bold',
              }}>
              {label}
            </Text>
          </View>
        )}
      </Focusable>
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{gap: px(20), paddingBottom: px(60)}}>
        <Text
          accessibilityRole="header"
          style={{color: colors.text, fontSize: fs(56), fontWeight: 'bold'}}>
          {t('settings.family')}
        </Text>

        <Text style={{color: colors.textMuted, fontSize: fs(28)}}>
          {t('fam.topic.label')}
        </Text>
        <Text
          testID="family-topic"
          selectable
          style={{
            color: colors.text,
            fontSize: fs(80),
            fontWeight: 'bold',
            letterSpacing: 2,
          }}>
          {topic ?? ''}
        </Text>
        <Text style={{color: colors.text, fontSize: fs(34), lineHeight: fs(46)}}>
          {t('fam.instructions')}
        </Text>
        <Text style={{color: colors.textMuted, fontSize: fs(28), lineHeight: fs(38)}}>
          {t('fam.privacy')}
        </Text>

        <View style={{flexDirection: 'row', gap: px(40), flexWrap: 'wrap'}}>
          <ActionButton
            primary
            preferred
            label={t('fam.test')}
            onPress={test}
            testID="fam-test"
          />
          <ActionButton
            label={t('fam.new')}
            onPress={() => setConfirmNew(true)}
            testID="fam-new"
          />
        </View>

        {statusText !== '' && (
          <Text
            testID="fam-status"
            accessibilityLiveRegion="polite"
            style={{
              color: failed ? colors.text : colors.textMuted,
              fontSize: fs(34),
              lineHeight: fs(46),
              fontWeight: failed ? 'bold' : 'normal',
            }}>
            {statusText}
          </Text>
        )}

        <Text style={{color: colors.textMuted, fontSize: fs(28)}}>{t('fam.mode')}</Text>
        <View style={{flexDirection: 'row', gap: px(24), flexWrap: 'wrap'}}>
          {chip('real', t('fam.mode.real'))}
          {chip('demo', t('fam.mode.demo'))}
        </View>

        <EmergencyNote />

        <View style={{alignSelf: 'flex-start'}}>
          <ActionButton label={t('common.back')} onPress={onBack} testID="back-button" />
        </View>
      </ScrollView>
    </Screen>
  );
};
