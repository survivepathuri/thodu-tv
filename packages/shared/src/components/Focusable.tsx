import React, {useCallback, useState} from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {useSettings} from '../settings/SettingsProvider';

export interface FocusableProps {
  /** Spoken label. Required: every focusable element must be announced. */
  label: string;
  role: 'button' | 'checkbox' | 'radio';
  onPress: () => void;
  checked?: boolean;
  /** Take focus when the screen appears (so focus is never lost). */
  preferred?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children: (focused: boolean) => React.ReactNode;
}

/**
 * A D-pad focusable control with an always-visible focus ring whose width
 * comes from the user's settings. The ring is a constant-width border (clear
 * when not focused) so focusing never shifts the layout.
 */
export const Focusable = ({
  label,
  role,
  onPress,
  checked,
  preferred,
  testID,
  style,
  children,
}: FocusableProps) => {
  const {theme} = useSettings();
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  return (
    <Pressable
      accessible
      accessibilityLabel={label}
      accessibilityRole={role}
      accessibilityState={checked === undefined ? undefined : {checked}}
      hasTVPreferredFocus={preferred}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      testID={testID}
      style={[
        {
          borderWidth: theme.focusRingWidth,
          borderColor: focused ? theme.colors.text : 'transparent',
          borderRadius: 28,
        },
        style,
      ]}>
      <View>{children(focused)}</View>
    </Pressable>
  );
};
