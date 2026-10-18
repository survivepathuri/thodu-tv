import {useCallback, useEffect, useRef, useState} from 'react';
import {FetchLike, NotifyKind, isValidTopic, sendFamilyAlert} from '../core';
import {useSettings} from './SettingsProvider';

export type AlertPhase = 'idle' | 'sending' | 'sent' | 'demo' | 'failed';

/**
 * Sends one kind of family alert. 'sent' only after an HTTP 2xx; 'demo' when
 * real mode is not set up (nothing leaves the TV); 'failed' otherwise.
 */
export function useFamilyAlert(kind: NotifyKind) {
  const {family} = useSettings();
  const [phase, setPhase] = useState<AlertPhase>('idle');
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const topic = family.familyTopic;
  const real =
    family.notifyMode === 'real' && family.testSucceeded && isValidTopic(topic);

  const send = useCallback(async () => {
    if (!real) {
      setPhase('demo');
      return 'demo' as const;
    }
    setPhase('sending');
    const r = await sendFamilyAlert(fetch as unknown as FetchLike, topic, kind, Date.now());
    const next = r.ok ? 'sent' : 'failed';
    if (mounted.current) {
      setPhase(next);
    }
    return next;
  }, [real, topic, kind]);

  return {phase, real, send};
}
