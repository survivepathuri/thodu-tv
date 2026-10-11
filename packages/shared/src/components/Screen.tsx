import React from 'react';
import {Text, View} from 'react-native';
import {useScan} from '../scan/ScanScope';
import {useUI} from '../settings/useUI';

/** Full-screen themed background with a safe TV margin. */
export const Screen = ({children}: {children: React.ReactNode}) => {
  const {colors, px, fs, t} = useUI();
  const {scanning} = useScan();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: px(100),
        paddingVertical: px(60),
      }}>
      {children}
      {scanning && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: px(6),
            alignSelf: 'center',
            paddingHorizontal: px(28),
            paddingVertical: px(2),
            borderRadius: 40,
            backgroundColor: colors.text,
          }}>
          <Text
            testID="scan-hint"
            style={{color: colors.background, fontSize: fs(22), fontWeight: 'bold'}}>
            {t('scan.hint')}
          </Text>
        </View>
      )}
    </View>
  );
};
