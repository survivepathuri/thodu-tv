import { InfoScreen, useSettings } from '@thodu/shared';
import type { StringKey } from '@thodu/shared';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Section() {
  const router = useRouter();
  const { t } = useSettings();
  const { id } = useLocalSearchParams<{ id: string }>();
  // Placeholder: the section name (Watch, Family, Medicines) is the title.
  const name = t(`tile.${id}` as StringKey);
  return (
    <InfoScreen
      title={name}
      body={`${t('placeholder.title')}. ${t('placeholder.body')}`}
      onBack={() => router.back()}
    />
  );
}
