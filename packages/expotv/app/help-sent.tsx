import { Scoped } from '@/components/Scoped';
import { HelpSentScreen } from '@thodu/shared';
import { useRouter } from 'expo-router';

export default function HelpSent() {
  const router = useRouter();
  return (
    <Scoped>
      <HelpSentScreen onDone={() => router.back()} />
    </Scoped>
  );
}
