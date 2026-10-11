import React, {useCallback, useEffect, useId, useRef, useState} from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {useScan} from '../scan/ScanScope';
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
  const [padFocused, setFocused] = useState(false);
  const id = useId();
  const {scanning, highlightId, register} = useScan();
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  // Join this screen's scan order (registration order = reading order).
  useEffect(
    () => register({id, label, onPress: () => onPressRef.current()}),
    [register, id, label],
  );

  // D-pad focus and scanner highlight look identical (same ring, same scale).
  const focused = padFocused || highlightId === id;
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  return (
    <Pressable
      accessible
      accessibilityLabel={label}
      accessibilityRole={role}
      accessibilityState={checked === undefined ? undefined : {checked}}
      focusable={!scanning}
      hasTVPreferredFocus={preferred && !scanning}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      testID={testID}
      style={[style, focused && {transform: [{scale: 1.05}]}]}>
      {children(focused)}
      {/* Ring is an overlay outside the box, so it never changes layout. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -theme.focusRingWidth,
          left: -theme.focusRingWidth,
          right: -theme.focusRingWidth,
          bottom: -theme.focusRingWidth,
          borderWidth: theme.focusRingWidth,
          borderRadius: 20 + theme.focusRingWidth,
          borderColor: focused ? theme.colors.focusRing : 'transparent',
        }}
      />
    </Pressable>
  );
};
