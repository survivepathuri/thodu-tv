import { Scoped } from '@/components/Scoped';
import { FamilyScreen, InfoScreen, WatchDemoScreen, useSettings } from '@thodu/shared';
import type { StringKey } from '@thodu/shared';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Section() {
  const router = useRouter();
  const { t, settings } = useSettings();
  const { id } = useLocalSearchParams<{ id: string }>();

  if (id === 'family') {
    return (
      <Scoped>
        <FamilyScreen onBack={() => router.back()} />
      </Scoped>
    );
  }

  if (id === 'watch' && settings.captionsAlwaysOn) {
    return (
      <Scoped>
        <WatchDemoScreen onBack={() => router.back()} />
      </Scoped>
    );
  }

  // Placeholder: the section name (Watch, Medicines) is the title.
  const name = t(`tile.${id}` as StringKey);
  return (
    <Scoped>
      <InfoScreen
        title={name}
        body={`${t('placeholder.title')}. ${t('placeholder.body')}`}
        onBack={() => router.back()}
      />
    </Scoped>
  );
}
