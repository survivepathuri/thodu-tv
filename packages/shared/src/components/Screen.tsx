import React from 'react';
import {View} from 'react-native';
import {useUI} from '../settings/useUI';

/** Full-screen themed background with a safe TV margin. */
export const Screen = ({children}: {children: React.ReactNode}) => {
  const {colors, px} = useUI();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: px(100),
        paddingVertical: px(60),
      }}>
      {children}
    </View>
  );
};
