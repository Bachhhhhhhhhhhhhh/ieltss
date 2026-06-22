import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface LookupContextType {
  paletteOpen: boolean;
  openPalette: (query?: string) => void;
  closePalette: () => void;
  pendingQuery: string;
}

const LookupContext = createContext<LookupContextType | null>(null);

export function LookupProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pendingQuery, setPendingQuery] = useState('');

  const openPalette = useCallback((query = '') => {
    setPendingQuery(query);
    setPaletteOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
    setPendingQuery('');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === 'Escape' && paletteOpen) {
        e.preventDefault();
        closePalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, closePalette]);

  return (
    <LookupContext.Provider value={{ paletteOpen, openPalette, closePalette, pendingQuery }}>
      {children}
    </LookupContext.Provider>
  );
}

export function useLookup() {
  const ctx = useContext(LookupContext);
  if (!ctx) throw new Error('useLookup must be used within LookupProvider');
  return ctx;
}