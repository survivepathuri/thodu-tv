import { randomBytes } from '@/components/randomBytes';
import { Scoped } from '@/components/Scoped';
import { FamilySettingsScreen, generateTopic } from '@thodu/shared';
import type { FetchLike } from '@thodu/shared';
import { useRouter } from 'expo-router';

const newTopic = () => generateTopic(randomBytes);

export default function FamilySettings() {
  const router = useRouter();
  return (
    <Scoped>
      <FamilySettingsScreen
        onBack={() => router.back()}
        newTopic={newTopic}
        fetchImpl={fetch as unknown as FetchLike}
      />
    </Scoped>
  );
}
