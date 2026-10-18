import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsProvider, SpeechProvider, useSettings } from '@thodu/shared';
import { speak } from '@/components/speech';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// No animation: a transition must never leave focus in limbo on a TV.
function ThemedStack() {
  const { theme, ready } = useSettings();
  useEffect(() => {
    // Keep the splash up until the saved settings are read, so the first
    // frame is already in the right theme and language.
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);
  if (!ready) {
    return null;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      if (error) {
        if (__DEV__) {
          console.warn(`Error in loading fonts: ${error}`);
        }
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SettingsProvider storage={AsyncStorage} configuredTopic={process.env.EXPO_PUBLIC_THODU_TOPIC}>
      <SpeechProvider speak={speak}>
        <ThemedStack />
      </SpeechProvider>
    </SettingsProvider>
  );
}
