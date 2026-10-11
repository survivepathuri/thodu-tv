import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Pressable, useTVEventHandler} from 'react-native';
import {
  createScanner,
  highlighted,
  setItems,
  setScanInterval,
  tick,
  ScannerState,
} from '../core';
import {useSettings} from '../settings/SettingsProvider';

interface Entry {
  id: string;
  label: string;
  onPress: () => void;
}

export interface ScanContextValue {
  /** True when single-button scanning is driving this screen. */
  scanning: boolean;
  /** Id of the item currently highlighted by the scanner. */
  highlightId: string | null;
  register: (entry: Entry) => () => void;
}

const ScanContext = createContext<ScanContextValue>({
  scanning: false,
  highlightId: null,
  register: () => () => {},
});

export const useScan = () => useContext(ScanContext);

/** Ignore a select that arrives right after the screen became active. */
const ACTIVATION_GUARD_MS = 500;

/**
 * Wrap one screen. When settings.scanningMode is on, the scope highlights its
 * registered Focusables one by one and OK activates the highlighted one.
 * `active` must be false for screens that are mounted but not on top.
 */
export const ScanScope = ({
  active = true,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) => {
  const {settings} = useSettings();
  const scanning = settings.scanningMode && active;
  const entries = useRef<Entry[]>([]);
  const [scanner, setScanner] = useState<ScannerState>(() =>
    createScanner([], settings.scanIntervalMs),
  );
  const activatedAt = useRef(Date.now());

  useEffect(() => {
    if (active) {
      activatedAt.current = Date.now();
    }
  }, [active, settings.scanningMode]);

  const sync = useCallback(() => {
    setScanner(s => setItems(s, entries.current.map(e => e.id)));
  }, []);

  const register = useCallback(
    (entry: Entry) => {
      entries.current = [...entries.current, entry];
      sync();
      return () => {
        entries.current = entries.current.filter(e => e.id !== entry.id);
        sync();
      };
    },
    [sync],
  );

  useEffect(() => {
    setScanner(s => setScanInterval(s, settings.scanIntervalMs));
  }, [settings.scanIntervalMs]);

  useEffect(() => {
    if (!scanning) {
      return;
    }
    const timer = setInterval(
      () => setScanner(s => tick(s)),
      settings.scanIntervalMs,
    );
    return () => clearInterval(timer);
  }, [scanning, settings.scanIntervalMs]);

  const scannerRef = useRef(scanner);
  scannerRef.current = scanner;

  const onTV = useCallback(
    (evt: {eventType?: string; eventKeyAction?: number | string}) => {
      if (!scanning || evt.eventType !== 'select') {
        return;
      }
      // Act once per press: on key up.
      if (String(evt.eventKeyAction) !== '1') {
        return;
      }
      if (Date.now() - activatedAt.current < ACTIVATION_GUARD_MS) {
        return;
      }
      const id = highlighted(scannerRef.current);
      const entry = entries.current.find(e => e.id === id);
      if (entry) {
        entry.onPress();
      }
    },
    [scanning],
  );
  useTVEventHandler(onTV);

  const hid = scanning ? highlighted(scanner) : null;
  useEffect(() => {
    if (hid !== null) {
      const e = entries.current.find(x => x.id === hid);
      // Debug builds only: release builds log nothing.
      if (__DEV__) {
        console.log('[scan] highlight', e ? e.label : hid);
      }
    }
  }, [hid]);

  const value = useMemo<ScanContextValue>(
    () => ({
      scanning,
      highlightId: scanning ? highlighted(scanner) : null,
      register,
    }),
    [scanning, scanner, register],
  );

  return (
    <ScanContext.Provider value={value}>
      {children}
      {scanning && (
        // Android only delivers key events along the focus path. While every
        // item is non-focusable (scanning), this invisible view keeps focus so
        // the OK key still reaches the app. It is hidden from screen readers.
        <Pressable
          focusable
          hasTVPreferredFocus
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          onPress={() => {}}
          testID="scan-focus-sink"
          style={{position: 'absolute', width: 1, height: 1, opacity: 0}}
        />
      )}
    </ScanContext.Provider>
  );
};
