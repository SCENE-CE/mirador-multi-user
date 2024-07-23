// MiradorContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import IState from "../features/mirador/interface/IState.ts";

interface MiradorStateContextType {
  miradorState: IState | undefined;
  setMiradorState: (state: IState | undefined) => void;
}

const MiradorStateContext = createContext<MiradorStateContextType | undefined>(undefined);

export const useMiradorState = () => {
  const context = useContext(MiradorStateContext);
  if (!context) {
    throw new Error('useMiradorState must be used within a MiradorStateProvider');
  }
  return context;
};

export const MiradorStateProvider = ({ children }: { children: ReactNode }) => {
  const [miradorState, setMiradorState] = useState<IState | undefined>(undefined);

  return (
    <MiradorStateContext.Provider value={{ miradorState, setMiradorState }}>
      {children}
    </MiradorStateContext.Provider>
  );
};
