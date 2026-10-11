import { InfoScreen, useSettings } from '@thodu/shared';
import { useRouter } from 'expo-router';

export default function Help() {
  const router = useRouter();
  const { t } = useSettings();
  return (
    <InfoScreen
      alert
      title={t('help.title')}
      body={t('help.body')}
      onBack={() => router.back()}
    />
  );
}
