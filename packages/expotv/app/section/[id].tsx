import { Scoped } from '@/components/Scoped';
import { FamilyScreen, WatchDemoScreen } from '@thodu/shared';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

export default function Section() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  if (id === 'family') {
    return (
      <Scoped>
        <FamilyScreen onBack={() => router.back()} />
      </Scoped>
    );
  }

  // Watch is always the labelled demo (no real video), whatever needs were chosen.
  if (id === 'watch') {
    return (
      <Scoped>
        <WatchDemoScreen onBack={() => router.back()} />
      </Scoped>
    );
  }

  // Not a known section: go Home rather than show an empty screen.
  return <Redirect href="/home" />;
}
