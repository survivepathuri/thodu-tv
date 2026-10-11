import { useSettings } from '@thodu/shared';
import { Redirect } from 'expo-router';

// First run goes to setup; afterwards straight to home.
export default function Index() {
  const { setupDone } = useSettings();
  return <Redirect href={setupDone ? '/home' : '/setup'} />;
}
