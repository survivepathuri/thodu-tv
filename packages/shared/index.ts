// Accessibility core (pure), settings and screens
export * from './src/core';
export {SettingsProvider, useSettings} from './src/settings/SettingsProvider';
export type {SettingsContextValue} from './src/settings/SettingsProvider';
export {useUI} from './src/settings/useUI';
export {SetupScreen} from './src/screens/SetupScreen';
export {HomeScreen} from './src/screens/HomeScreen';
export type {HomeTileId} from './src/screens/HomeScreen';
export {InfoScreen} from './src/screens/InfoScreen';

export {
  scaleFontSize,
  scaleWidth,
  scaleHeight,
} from './src/utils/scaling';
