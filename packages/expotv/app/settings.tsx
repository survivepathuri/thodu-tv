import { Scoped } from '@/components/Scoped';
import { SetupScreen } from '@thodu/shared';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  return <Scoped><SetupScreen mode="settings" onDone={() => router.back()} /></Scoped>;
}
