import { Scoped } from '@/components/Scoped';
import { SetupScreen, useSettings } from '@thodu/shared';
import { useRouter } from 'expo-router';

export default function Setup() {
  const router = useRouter();
  const { completeSetup } = useSettings();
  return (
    <Scoped>
      <SetupScreen
        mode="setup"
        onDone={() => {
          completeSetup();
          // replace: Back from Home must not return to first-run setup.
          router.replace('/home');
        }}
      />
    </Scoped>
  );
}
