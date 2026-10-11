import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text} from '../components/Text';
import {formatClock, recentHelpEvents} from '../core';
import {ActionButton} from '../components/ActionButton';
import {Screen} from '../components/Screen';
import {useSettings} from '../settings/SettingsProvider';
import {useUI} from '../settings/useUI';

/** "DEMO" tag shown wherever something is simulated. */
const DemoTag = ({text}: {text: string}) => {
  const {colors, fs, px} = useUI();
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: px(20),
        paddingVertical: px(6),
        borderRadius: 12,
        borderWidth: 3,
        borderColor: colors.text,
      }}>
      <Text
        testID="demo-label"
        style={{color: colors.text, fontSize: fs(26), fontWeight: 'bold'}}>
        {text}
      </Text>
    </View>
  );
};

/** Plain, always-visible reminder that Thodu cannot call emergency services. */
export const EmergencyNote = () => {
  const {t, colors, fs} = useUI();
  return (
    <Text
      testID="emergency-note"
      style={{color: colors.textMuted, fontSize: fs(28), lineHeight: fs(38)}}>
      {t('help.emergency')}
    </Text>
  );
};

/** One question, two big buttons. `real` = a real message will be sent. */
export const HelpConfirmScreen = ({
  real,
  onConfirm,
  onCancel,
}: {
  real: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const {t, colors, fs, px} = useUI();
  return (
    <Screen>
      <View style={{flex: 1, justifyContent: 'center', gap: px(32)}}>
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text,
            fontSize: fs(80),
            lineHeight: fs(94),
            fontWeight: 'bold',
          }}>
          {t('help.confirm.title')}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fs(40),
            lineHeight: fs(52),
          }}>
          {t(real ? 'help.confirm.body.real' : 'help.confirm.body')}
        </Text>
        <View style={{flexDirection: 'row', gap: px(40)}}>
          <ActionButton
            primary
            preferred
            label={t('help.confirm.yes')}
            onPress={onConfirm}
            icon="tell"
            testID="help-confirm-yes"
          />
          <ActionButton
            label={t('help.confirm.no')}
            onPress={onCancel}
            icon="cancel"
            testID="help-confirm-no"
          />
        </View>
        <EmergencyNote />
      </View>
    </Screen>
  );
};

/** Shown while the message is on its way (up to ~17 s with the retry). */
export const HelpSendingScreen = () => {
  const {t, colors, fs, px} = useUI();
  return (
    <Screen>
      <View style={{flex: 1, justifyContent: 'center', gap: px(28)}}>
        <Text
          testID="help-sending"
          accessibilityLiveRegion="polite"
          style={{
            color: colors.text,
            fontSize: fs(76),
            lineHeight: fs(90),
            fontWeight: 'bold',
          }}>
          {t('help.sending')}
        </Text>
        <EmergencyNote />
      </View>
    </Screen>
  );
};

/** Failure state: loud, plain, and it never looks like success. */
export const HelpFailedScreen = ({
  onRetry,
  onDone,
}: {
  onRetry: () => void;
  onDone: () => void;
}) => {
  const {t, colors, fs, px} = useUI();
  return (
    <Screen>
      <View style={{flex: 1, justifyContent: 'center', gap: px(32)}}>
        <Text
          testID="help-failed-title"
          accessibilityRole="header"
          accessibilityLiveRegion="assertive"
          style={{
            color: colors.text,
            fontSize: fs(80),
            lineHeight: fs(94),
            fontWeight: 'bold',
          }}>
          {t('help.failed.title')}
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: fs(64),
            lineHeight: fs(76),
            fontWeight: 'bold',
          }}>
          {t('help.failed.body')}
        </Text>
        <View style={{flexDirection: 'row', gap: px(40)}}>
          <ActionButton
            primary
            preferred
            label={t('help.failed.retry')}
            onPress={onRetry}
            icon="retry"
            testID="help-failed-retry"
          />
          <ActionButton
            label={t('settings.done')}
            onPress={onDone}
            icon="ok"
            testID="help-failed-done"
          />
        </View>
        <EmergencyNote />
      </View>
    </Screen>
  );
};

/**
 * Success state. With visualAlerts, a flashing high-contrast banner (about
 * 1 Hz). `demo` = nothing was sent; the screen says so.
 */
export const HelpSentScreen = ({
  demo,
  onDone,
}: {
  demo: boolean;
  onDone: () => void;
}) => {
  const {t, colors, fs, px, settings} = useUI();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!settings.visualAlerts) {
      return;
    }
    const timer = setInterval(() => setFlash(f => !f), 700);
    return () => clearInterval(timer);
  }, [settings.visualAlerts]);

  // Banner is always black/yellow regardless of theme: both pairs are AAA.
  const bannerBg = flash ? '#000000' : '#FFE600';
  const bannerFg = flash ? '#FFE600' : '#000000';

  return (
    <Screen>
      <View style={{flex: 1, justifyContent: 'center', gap: px(28)}}>
        {settings.visualAlerts && (
          <View
            testID="visual-alert-banner"
            style={{
              paddingVertical: px(24),
              borderRadius: 20,
              borderWidth: 6,
              borderColor: '#000000',
              backgroundColor: bannerBg,
              alignItems: 'center',
            }}>
            <Text
              accessibilityLiveRegion="assertive"
              style={{color: bannerFg, fontSize: fs(64), fontWeight: 'bold'}}>
              {t('help.sent.alert')}
            </Text>
          </View>
        )}
        {demo && <DemoTag text={t('demo.label')} />}
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text,
            fontSize: fs(76),
            lineHeight: fs(90),
            fontWeight: 'bold',
          }}>
          {t(demo ? 'help.sent.title' : 'help.sent.real.title')}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fs(40),
            lineHeight: fs(52),
          }}>
          {t('help.sent.body')}
        </Text>
        <View style={{alignSelf: 'flex-start'}}>
          <ActionButton
            primary
            preferred
            label={t('settings.done')}
            onPress={onDone}
            icon="ok"
            testID="help-sent-done"
          />
        </View>
        <EmergencyNote />
      </View>
    </Screen>
  );
};

/** Family tile: recent help events plus a simulated caregiver phone. */
export const FamilyScreen = ({onBack}: {onBack: () => void}) => {
  const {t, colors, fs, px} = useUI();
  const {helpEvents} = useSettings();
  const recent = recentHelpEvents(helpEvents, 5);
  // The simulated phone only ever shows simulated (demo) requests.
  const latest = recent.find(e => e.result === 'demo');
  const eventKey = {
    sent: 'family.event',
    failed: 'family.event.failed',
    demo: 'family.event.demo',
  } as const;

  return (
    <Screen>
      <View style={{flex: 1, flexDirection: 'row', gap: px(60)}}>
        <View style={{flex: 1, gap: px(16)}}>
          <Text
            accessibilityRole="header"
            style={{color: colors.text, fontSize: fs(60), fontWeight: 'bold'}}>
            {t('tile.family')}
          </Text>
          <Text
            style={{color: colors.textMuted, fontSize: fs(30), fontWeight: 'bold'}}>
            {t('family.recent')}
          </Text>
          {recent.length === 0 && (
            <Text style={{color: colors.text, fontSize: fs(34)}}>
              {t('family.none')}
            </Text>
          )}
          {recent.map(e => (
            <View
              key={e.id}
              testID="help-event-row"
              style={{
                flexDirection: 'row',
                gap: px(24),
                padding: px(18),
                borderRadius: 16,
                backgroundColor: colors.tile.family.bg,
              }}>
              <Text
                style={{
                  color: colors.tile.family.fg,
                  fontSize: fs(36),
                  fontWeight: 'bold',
                }}>
                {formatClock(e.at)}
              </Text>
              <Text style={{color: colors.tile.family.fg, fontSize: fs(34)}}>
                {t(eventKey[e.result])}
              </Text>
            </View>
          ))}
          <View style={{marginTop: px(12), alignSelf: 'flex-start'}}>
            <ActionButton
              preferred
              label={t('common.back')}
              onPress={onBack}
              icon="back"
              testID="back-button"
            />
          </View>
        </View>

        {/* Simulated caregiver phone */}
        <View style={{width: '36%', gap: px(12)}}>
          <DemoTag text={t('family.simulated')} />
          <Text
            style={{color: colors.textMuted, fontSize: fs(26), fontWeight: 'bold'}}>
            {t('family.phone.label')}
          </Text>
          <View
            testID="family-phone"
            style={{
              flex: 1,
              borderRadius: 40,
              borderWidth: 6,
              borderColor: colors.text,
              backgroundColor: colors.surface,
              padding: px(24),
              justifyContent: 'flex-start',
            }}>
            {latest ? (
              <View
                style={{
                  padding: px(18),
                  borderRadius: 20,
                  backgroundColor: colors.accent,
                }}>
                <Text
                  style={{
                    color: colors.onAccent,
                    fontSize: fs(28),
                    fontWeight: 'bold',
                  }}>
                  {t('family.phone.title')}
                </Text>
                <Text
                  style={{color: colors.onAccent, fontSize: fs(26), marginTop: px(6)}}>
                  {t('family.phone.body').replace('{time}', formatClock(latest.at))}
                </Text>
              </View>
            ) : (
              <Text style={{color: colors.textMuted, fontSize: fs(28)}}>
                {t('family.phone.empty')}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
};

/** "Reset Thodu?" confirmation. Cancel holds the initial focus. */
export const ResetConfirmScreen = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const {t, colors, fs, px} = useUI();
  return (
    <Screen>
      <View style={{flex: 1, justifyContent: 'center', gap: px(32)}}>
        <Text
          accessibilityRole="header"
          style={{
            color: colors.text,
            fontSize: fs(80),
            lineHeight: fs(94),
            fontWeight: 'bold',
          }}>
          {t('reset.title')}
        </Text>
        <Text
          style={{color: colors.textMuted, fontSize: fs(40), lineHeight: fs(52)}}>
          {t('reset.body')}
        </Text>
        <View style={{flexDirection: 'row', gap: px(40)}}>
          <ActionButton
            primary
            preferred
            label={t('reset.no')}
            onPress={onCancel}
            icon="cancel"
            testID="reset-no"
          />
          <ActionButton
            label={t('reset.yes')}
            onPress={onConfirm}
            icon="ok"
            testID="reset-yes"
          />
        </View>
      </View>
    </Screen>
  );
};
