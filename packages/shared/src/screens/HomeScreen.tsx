import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {StringKey} from '../core';
import {Focusable} from '../components/Focusable';
import {Screen} from '../components/Screen';
import {useUI} from '../settings/useUI';

export type HomeTileId = 'watch' | 'family' | 'medicines' | 'help' | 'settings';

interface TileDef {
  id: HomeTileId;
  labelKey: StringKey;
  glyph: string;
}

// Plain text glyphs; the label always sits next to them.
const TILES: readonly TileDef[] = [
  {id: 'watch', labelKey: 'tile.watch', glyph: '▶'},
  {id: 'family', labelKey: 'tile.family', glyph: '●●'},
  {id: 'medicines', labelKey: 'tile.medicines', glyph: '+'},
  {id: 'help', labelKey: 'tile.help', glyph: '?'},
  {id: 'settings', labelKey: 'tile.settings', glyph: '≡'},
];

export const HomeScreen = ({onOpen}: {onOpen: (id: HomeTileId) => void}) => {
  const {t, colors, fs, sz, px} = useUI();

  return (
    <Screen>
      <Text
        accessibilityRole="header"
        style={{
          color: colors.text,
          fontSize: fs(64),
          lineHeight: fs(76),
          fontWeight: 'bold',
          marginBottom: px(32),
        }}>
        {t('home.title')}
      </Text>
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: px(32),
          paddingBottom: px(20),
        }}>
        {TILES.map((tile, i) => {
          const label = t(tile.labelKey);
          return (
            <Focusable
              key={tile.id}
              role="button"
              label={label}
              preferred={i === 0}
              onPress={() => onOpen(tile.id)}
              testID={`tile-${tile.id}`}>
              {focused => (
                <View
                  style={{
                    width: sz(400),
                    height: sz(230),
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: px(8),
                    backgroundColor: focused
                      ? colors.surfaceFocused
                      : colors.surface,
                  }}>
                  <Text
                    accessible={false}
                    style={{
                      color: colors.accent,
                      fontSize: fs(72),
                      lineHeight: fs(84),
                      fontWeight: 'bold',
                    }}>
                    {tile.glyph}
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: fs(52),
                      lineHeight: fs(62),
                      fontWeight: 'bold',
                    }}>
                    {label}
                  </Text>
                </View>
              )}
            </Focusable>
          );
        })}
      </ScrollView>
    </Screen>
  );
};
