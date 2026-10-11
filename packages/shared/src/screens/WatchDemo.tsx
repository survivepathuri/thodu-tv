import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text} from '../components/Text';
import {CAPTION_KEYS, CAPTION_LINE_MS, captionIndexAt} from '../core';
import {ActionButton} from '../components/ActionButton';
import {Screen} from '../components/Screen';
import {useUI} from '../settings/useUI';

/**
 * Watch placeholder with captions always on: a plain demo panel (no video,
 * no network) and a looping caption bar of sample lines.
 */
export const WatchDemoScreen = ({onBack}: {onBack: () => void}) => {
  const {t, colors, fs, px} = useUI();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 500), 500);
    return () => clearInterval(timer);
  }, []);

  const line = CAPTION_KEYS[captionIndexAt(CAPTION_KEYS.length, elapsed, CAPTION_LINE_MS)];

  return (
    <Screen>
      <View style={{flex: 1, gap: px(20)}}>
        <Text
          accessibilityRole="header"
          style={{color: colors.text, fontSize: fs(54), fontWeight: 'bold'}}>
          {t('tile.watch')}
        </Text>
        {/* Plain demo panel standing in for the video */}
        <View
          testID="demo-video-panel"
          style={{
            flex: 1,
            borderRadius: 24,
            backgroundColor: colors.tile.watch.bg,
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: px(20),
          }}>
          <Text
            style={{
              color: colors.tile.watch.fg,
              fontSize: fs(30),
              fontWeight: 'bold',
            }}>
            {t('watch.demo.panel')}
          </Text>
          {/* Caption bar: always black on white-ish for maximum legibility */}
          <View
            testID="caption-bar"
            style={{
              position: 'absolute',
              left: px(40),
              right: px(40),
              bottom: px(30),
              paddingVertical: px(14),
              paddingHorizontal: px(24),
              borderRadius: 12,
              backgroundColor: '#000000',
              alignItems: 'center',
            }}>
            <Text
              accessibilityLiveRegion="polite"
              style={{color: '#FFFFFF', fontSize: fs(44), lineHeight: fs(56)}}>
              {t(line)}
            </Text>
          </View>
        </View>
        <View style={{alignSelf: 'flex-start'}}>
          <ActionButton
            preferred
            label={t('common.back')}
            onPress={onBack}
            testID="back-button"
          />
        </View>
      </View>
    </Screen>
  );
};
