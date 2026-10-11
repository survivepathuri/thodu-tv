import { Scoped } from '@/components/Scoped';
import { ResetConfirmScreen, useSettings } from '@thodu/shared';
import { useRouter } from 'expo-router';

export default function Reset() {
  const router = useRouter();
  const { resetAll } = useSettings();
  return (
    <Scoped>
      <ResetConfirmScreen
        onConfirm={async () => {
          await resetAll();
          // replace: nothing to go back to once everything is erased.
          router.replace('/setup');
        }}
        onCancel={() => router.back()}
      />
    </Scoped>
  );
}
