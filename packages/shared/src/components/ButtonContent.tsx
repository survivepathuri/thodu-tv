import React from 'react';
import {View} from 'react-native';
import {Text} from './Text';
import {useUI} from '../settings/useUI';
import {BUTTON_GLYPH, ButtonIcon} from '../core/buttonIcons';

/**
 * Text of an action button. With settings.iconsWithLabels on and an icon given,
 * a glyph sits left of the label; the label is always shown. The glyph is hidden
 * from screen readers because the button already carries the label.
 */
export const ButtonContent = ({
  label,
  icon,
  color,
  size,
}: {
  label: string;
  icon?: ButtonIcon;
  color: string;
  size: number;
}) => {
  const {fs, px, settings} = useUI();
  const showIcon = settings.iconsWithLabels && icon !== undefined;
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      {showIcon && (
        <Text
          accessible={false}
          importantForAccessibility="no"
          style={{
            color,
            fontSize: fs(size),
            fontWeight: 'bold',
            marginRight: px(20),
          }}>
          {BUTTON_GLYPH[icon]}
        </Text>
      )}
      <Text style={{color, fontSize: fs(size), fontWeight: 'bold'}}>{label}</Text>
    </View>
  );
};
