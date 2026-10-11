export {Header} from './src/components/Header/Header';
export {HomeScreen} from './src/screens/HomeScreen';
export {ApiDemo} from './src/components/ApiDemo';

export {
  scaleFontSize,
  scaleWidth,
  scaleHeight,
} from './src/utils/scaling';

// HTTP Client (fetch-based)
export {createHttpClient} from './src/services/httpClient';
export type {HttpClientConfig, HttpResponse} from './src/services/httpClient';



// Accessibility core (pure) and settings
export * from './src/core';
export {SettingsProvider, useSettings} from './src/settings/SettingsProvider';
export type {SettingsContextValue} from './src/settings/SettingsProvider';
