import { Scoped } from '@/components/Scoped';
import { HelpConfirmScreen, useSettings } from '@thodu/shared';
import { useRouter } from 'expo-router';

export default function Help() {
  const router = useRouter();
  const { logHelp } = useSettings();
  return (
    <Scoped>
      <HelpConfirmScreen
        onConfirm={() => {
          logHelp({ kind: 'helpRequest', result: 'demo' });
          // replace: Back from the success screen returns to Home.
          router.replace('/help-sent');
        }}
        onCancel={() => router.back()}
      />
    </Scoped>
  );
}
