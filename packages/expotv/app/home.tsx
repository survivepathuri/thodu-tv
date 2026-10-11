import { Scoped } from '@/components/Scoped';
import { HomeScreen, HomeTileId } from '@thodu/shared';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  const open = (id: HomeTileId) => {
    if (id === 'help') router.push('/help');
    else if (id === 'settings') router.push('/settings');
    else router.push({ pathname: '/section/[id]', params: { id } });
  };
  return <Scoped><HomeScreen onOpen={open} /></Scoped>;
}
