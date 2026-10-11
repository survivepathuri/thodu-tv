import React from 'react';
import {Text, View} from 'react-native';
import {useUI} from '../settings/useUI';
import {Focusable} from './Focusable';

/** Big labelled button. `primary` uses the accent fill, `secondary` the surface. */
export const ActionButton = ({
  label,
  onPress,
  primary,
  preferred,
  testID,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  preferred?: boolean;
  testID?: string;
}) => {
  const {colors, fs, sz, px} = useUI();
  return (
    <Focusable
      role="button"
      label={label}
      onPress={onPress}
      preferred={preferred}
      testID={testID}>
      {() => (
        <View
          style={{
            minWidth: sz(420),
            minHeight: sz(130),
            paddingHorizontal: px(48),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 24,
            backgroundColor: primary ? colors.accent : colors.surface,
            borderWidth: primary ? 0 : 3,
            borderColor: colors.border,
          }}>
          <Text
            style={{
              color: primary ? colors.onAccent : colors.text,
              fontSize: fs(48),
              fontWeight: 'bold',
            }}>
            {label}
          </Text>
        </View>
      )}
    </Focusable>
  );
};
