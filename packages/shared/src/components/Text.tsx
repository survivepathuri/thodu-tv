import React from 'react';
import {Text as RNText, TextProps} from 'react-native';

/**
 * Text that ignores the OS font scale. Android 14+ scales large text only
 * partly, so relying on it made big TV text barely grow. Instead the system
 * font scale is read once, capped and multiplied in (see effectiveFontScale
 * and useUI), so every size follows the same rule.
 */
export const Text = (props: TextProps) => (
  <RNText allowFontScaling={false} {...props} />
);
