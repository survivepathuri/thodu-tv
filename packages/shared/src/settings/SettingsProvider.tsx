import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addHelpEvent,
  buildTheme,
  deriveSettings,
  translate,
  Lang,
  HelpEvent,
  Need,
  Settings,
  StringKey,
  Theme,
} from '../core';

// In-memory only: the sample has no AsyncStorage, so nothing is persisted yet.

export interface SettingsContextValue {
  needs: Need[];
  settings: Settings;
  theme: Theme;
  lang: Lang;
  setupDone: boolean;
  /** Simulated help requests, newest first (in memory, demo only). */
  helpEvents: HelpEvent[];
  sendHelp: () => void;
  toggleNeed: (need: Need) => void;
  setLang: (lang: Lang) => void;
  completeSetup: () => void;
  t: (key: StringKey) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({children}: {children: React.ReactNode}) => {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [lang, setLang] = useState<Lang>('en');
  const [setupDone, setSetupDone] = useState(false);
  const [helpEvents, setHelpEvents] = useState<HelpEvent[]>([]);
  const helpSeq = useRef(0);

  const toggleNeed = useCallback((need: Need) => {
    setNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need],
    );
  }, []);
  const completeSetup = useCallback(() => setSetupDone(true), []);
  const sendHelp = useCallback(() => {
    helpSeq.current += 1;
    const event: HelpEvent = {
      id: `help-${helpSeq.current}`,
      at: Date.now(),
      kind: 'helpRequest',
    };
    setHelpEvents(prev => addHelpEvent(prev, event));
  }, []);

  const settings = useMemo(() => deriveSettings(needs), [needs]);
  const theme = useMemo(() => buildTheme(settings), [settings]);
  const t = useCallback((key: StringKey) => translate(lang, key), [lang]);

  const value = useMemo(
    () => ({
      needs,
      settings,
      theme,
      lang,
      setupDone,
      helpEvents,
      sendHelp,
      toggleNeed,
      setLang,
      completeSetup,
      t,
    }),
    [
      needs,
      settings,
      theme,
      lang,
      setupDone,
      helpEvents,
      sendHelp,
      toggleNeed,
      completeSetup,
      t,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside <SettingsProvider>');
  }
  return ctx;
}
