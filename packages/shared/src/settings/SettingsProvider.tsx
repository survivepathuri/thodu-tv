import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addHelpEvent,
  buildTheme,
  defaultPersisted,
  deriveSettings,
  deserialize,
  serialize,
  translate,
  Lang,
  HelpEvent,
  Need,
  NotifyMode,
  PersistedState,
  Settings,
  StorageLike,
  StringKey,
  Theme,
  STORAGE_KEY,
} from '../core';

export interface FamilyState {
  familyTopic: string | null;
  notifyMode: NotifyMode;
  testSucceeded: boolean;
}

export interface SettingsContextValue {
  /** False until the saved state has been read (first paint waits for it). */
  ready: boolean;
  needs: Need[];
  settings: Settings;
  theme: Theme;
  lang: Lang;
  setupDone: boolean;
  family: FamilyState;
  /** Help requests, newest first (in memory). */
  helpEvents: HelpEvent[];
  logHelp: (event: Omit<HelpEvent, 'id' | 'at'>) => void;
  toggleNeed: (need: Need) => void;
  setLang: (lang: Lang) => void;
  setScanInterval: (ms: number) => void;
  setFamily: (patch: Partial<FamilyState>) => void;
  completeSetup: () => void;
  /** Clears saved data and returns every setting to its default. */
  resetAll: () => Promise<void>;
  t: (key: StringKey) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({
  storage,
  children,
}: {
  storage: StorageLike;
  children: React.ReactNode;
}) => {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<PersistedState>(defaultPersisted);
  const [helpEvents, setHelpEvents] = useState<HelpEvent[]>([]);
  const helpSeq = useRef(0);

  // Load once. A failing store behaves like an empty one.
  useEffect(() => {
    let alive = true;
    storage
      .getItem(STORAGE_KEY)
      .catch(() => null)
      .then(text => {
        if (alive) {
          setSaved(deserialize(text));
          setReady(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [storage]);

  // Save after every change, but never before the first load finished.
  useEffect(() => {
    if (ready) {
      storage.setItem(STORAGE_KEY, serialize(saved)).catch(() => {});
    }
  }, [ready, saved, storage]);

  const patch = useCallback(
    (p: Partial<PersistedState>) => setSaved(s => ({...s, ...p})),
    [],
  );

  const toggleNeed = useCallback((need: Need) => {
    setSaved(s => ({
      ...s,
      needs: s.needs.includes(need)
        ? s.needs.filter(n => n !== need)
        : [...s.needs, need],
    }));
  }, []);
  const setLang = useCallback((lang: Lang) => patch({lang}), [patch]);
  const setScanInterval = useCallback(
    (scanIntervalMs: number) => patch({scanIntervalMs}),
    [patch],
  );
  const setFamily = useCallback(
    (p: Partial<FamilyState>) => patch(p),
    [patch],
  );
  const completeSetup = useCallback(() => patch({setupDone: true}), [patch]);

  const logHelp = useCallback((event: Omit<HelpEvent, 'id' | 'at'>) => {
    helpSeq.current += 1;
    const full: HelpEvent = {
      ...event,
      id: `help-${helpSeq.current}`,
      at: Date.now(),
    };
    setHelpEvents(prev => addHelpEvent(prev, full));
  }, []);

  const resetAll = useCallback(async () => {
    try {
      await storage.removeItem(STORAGE_KEY);
    } catch {
      // The in-memory reset below still happens; the next save overwrites.
    }
    setHelpEvents([]);
    setSaved(defaultPersisted());
  }, [storage]);

  const settings = useMemo(
    () => ({
      ...deriveSettings(saved.needs),
      scanIntervalMs: saved.scanIntervalMs,
    }),
    [saved.needs, saved.scanIntervalMs],
  );
  const theme = useMemo(() => buildTheme(settings), [settings]);
  const lang = saved.lang;
  const t = useCallback((key: StringKey) => translate(lang, key), [lang]);
  const family = useMemo<FamilyState>(
    () => ({
      familyTopic: saved.familyTopic,
      notifyMode: saved.notifyMode,
      testSucceeded: saved.testSucceeded,
    }),
    [saved.familyTopic, saved.notifyMode, saved.testSucceeded],
  );

  const value = useMemo(
    () => ({
      ready,
      needs: saved.needs,
      settings,
      theme,
      lang,
      setupDone: saved.setupDone,
      family,
      helpEvents,
      logHelp,
      toggleNeed,
      setLang,
      setScanInterval,
      setFamily,
      completeSetup,
      resetAll,
      t,
    }),
    [
      ready,
      saved.needs,
      saved.setupDone,
      settings,
      theme,
      lang,
      family,
      helpEvents,
      logHelp,
      toggleNeed,
      setLang,
      setScanInterval,
      setFamily,
      completeSetup,
      resetAll,
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
