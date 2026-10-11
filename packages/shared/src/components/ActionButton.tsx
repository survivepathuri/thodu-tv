import React from 'react';
import {View} from 'react-native';
import {useUI} from '../settings/useUI';
import {Focusable} from './Focusable';
import {ButtonContent} from './ButtonContent';
import type {ButtonIcon} from '../core/buttonIcons';

/** Big labelled button. `primary` uses the accent fill, `secondary` the surface. */
export const ActionButton = ({
  label,
  onPress,
  primary,
  preferred,
  icon,
  testID,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  preferred?: boolean;
  icon?: ButtonIcon;
  testID?: string;
}) => {
  const {colors, sz, px} = useUI();
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
          <ButtonContent
            label={label}
            icon={icon}
            color={primary ? colors.onAccent : colors.text}
            size={48}
          />
        </View>
      )}
    </Focusable>
  );
};
