import { useState, type ReactNode } from 'react';
import { SystemContext } from './useSystem';

export function AppProviders({ children }: { children: ReactNode }) {
  const [system, setSystem] = useState<string>('dashboard');

  return (
    <SystemContext.Provider value={{ system, setSystem }}>
      {children}
    </SystemContext.Provider>
  );
}
