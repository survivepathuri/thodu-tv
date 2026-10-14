import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from '../components/Text';
import {StringKey, TileId} from '../core';
import {Focusable} from '../components/Focusable';
import {Screen} from '../components/Screen';
import {useUI} from '../settings/useUI';

/** Tiles per row: 4 across normally, 2+2 when text is enlarged (no orphan tile). */
export function columnsFor(fontScale: number): number {
  return fontScale > 1.3 ? 2 : 4;
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export type HomeTileId = TileId;

interface TileDef {
  id: HomeTileId;
  labelKey: StringKey;
  glyph: string;
}

// Plain text glyphs; the label always sits next to them.
const TILES: readonly TileDef[] = [
  {id: 'watch', labelKey: 'tile.watch', glyph: '▶'},
  {id: 'family', labelKey: 'tile.family', glyph: '●●'},
  {id: 'help', labelKey: 'tile.help', glyph: '?'},
  {id: 'settings', labelKey: 'tile.settings', glyph: '≡'},
];

export const HomeScreen = ({onOpen}: {onOpen: (id: HomeTileId) => void}) => {
  const {t, colors, theme, fs, sz, px, settings} = useUI();
  const cols = columnsFor(settings.fontScale);
  const rows = chunk(TILES, cols);

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
          flexGrow: 1,
          justifyContent: 'center',
          gap: px(32),
          padding: px(24),
        }}>
        {rows.map((row, r) => (
          <View key={r} style={{flexDirection: 'row', gap: px(32)}}>
            {row.map(tile => {
              const label = t(tile.labelKey);
              return (
                <View key={tile.id} style={{flex: 1}}>
                  <Focusable
                    role="button"
                    label={label}
                    preferred={tile.id === 'watch'}
                    onPress={() => onOpen(tile.id)}
                    testID={`tile-${tile.id}`}>
                    {focused => {
                      const sw = colors.tile[tile.id];
                      return (
                      <View
                        style={{
                          height: cols === 4 ? sz(420) : px(300),
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: px(8),
                          backgroundColor:
                            focused && theme.highContrast
                              ? colors.surfaceFocused
                              : sw.bg,
                        }}>
                        <Text
                          accessible={false}
                          style={{
                            color: sw.glyph,
                            fontSize: fs(72),
                            lineHeight: fs(84),
                            fontWeight: 'bold',
                          }}>
                          {tile.glyph}
                        </Text>
                        <Text
                          style={{
                            color: sw.fg,
                            fontSize: fs(48),
                            lineHeight: fs(58),
                            fontWeight: 'bold',
                          }}>
                          {label}
                        </Text>
                      </View>
                      );
                    }}
                  </Focusable>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};
