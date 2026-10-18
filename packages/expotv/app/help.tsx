import { Scoped } from '@/components/Scoped';
import {
  HelpConfirmScreen,
  HelpFailedScreen,
  HelpSendingScreen,
  HelpSentScreen,
  isValidTopic,
  sendFamilyAlert,
  useSettings,
} from '@thodu/shared';
import type { FetchLike } from '@thodu/shared';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

type Phase = 'confirm' | 'sending' | 'sent' | 'failed';

export default function Help() {
  const router = useRouter();
  const { logHelp, family } = useSettings();
  const [phase, setPhase] = useState<Phase>('confirm');
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Real only after a successful test message; otherwise it is a demo and says so.
  const topic = family.familyTopic;
  const real =
    family.notifyMode === 'real' && family.testSucceeded && isValidTopic(topic);

  const start = async () => {
    if (!real || !topic) {
      logHelp({ kind: 'helpRequest', result: 'demo' });
      setPhase('sent');
      return;
    }
    setPhase('sending');
    const r = await sendFamilyAlert(fetch as unknown as FetchLike, topic, 'help', Date.now());
    // Logged even if the person already left this screen; success only on 2xx.
    logHelp({ kind: 'helpRequest', result: r.ok ? 'sent' : 'failed' });
    if (mounted.current) {
      setPhase(r.ok ? 'sent' : 'failed');
    }
  };

  return (
    <Scoped>
      {phase === 'confirm' && (
        <HelpConfirmScreen
          real={real}
          onConfirm={start}
          onCancel={() => router.back()}
        />
      )}
      {phase === 'sending' && <HelpSendingScreen />}
      {phase === 'sent' && (
        <HelpSentScreen demo={!real} onDone={() => router.back()} />
      )}
      {phase === 'failed' && (
        <HelpFailedScreen onRetry={start} onDone={() => router.back()} />
      )}
    </Scoped>
  );
}
