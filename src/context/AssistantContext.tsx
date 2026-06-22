import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AssistantContextType {
  isOpen: boolean;
  pendingQuestion: string | null;
  openAssistant: () => void;
  openAssistantWithQuestion: (question: string) => void;
  clearPendingQuestion: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
}

const AssistantContext = createContext<AssistantContextType | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const openAssistant = useCallback(() => setIsOpen(true), []);
  const openAssistantWithQuestion = useCallback((question: string) => {
    setPendingQuestion(question);
    setIsOpen(true);
  }, []);
  const clearPendingQuestion = useCallback(() => setPendingQuestion(null), []);
  const closeAssistant = useCallback(() => setIsOpen(false), []);
  const toggleAssistant = useCallback(() => setIsOpen((o) => !o), []);

  return (
    <AssistantContext.Provider value={{
      isOpen,
      pendingQuestion,
      openAssistant,
      openAssistantWithQuestion,
      clearPendingQuestion,
      closeAssistant,
      toggleAssistant,
    }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider');
  return ctx;
}