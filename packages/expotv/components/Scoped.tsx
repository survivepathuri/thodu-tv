import { ScanScope } from '@thodu/shared';
import { useIsFocused } from 'expo-router';
import type { ReactNode } from 'react';

// Stack keeps earlier screens mounted; only the visible one may scan.
export function Scoped({ children }: { children: ReactNode }) {
  const focused = useIsFocused();
  return <ScanScope active={focused}>{children}</ScanScope>;
}
