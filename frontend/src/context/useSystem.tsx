import { createContext } from 'react';

type SystemContextData = {
  system: string;
  setSystem: React.Dispatch<React.SetStateAction<string>>;
};

export const SystemContext =
  createContext<SystemContextData>(null as unknown as SystemContextData);