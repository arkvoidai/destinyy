import React, { createContext, useContext, useState, useEffect } from 'react';
import { BriefDialog } from '../components/BriefDialog';

interface BriefContextType {
  isOpen: boolean;
  openBrief: () => void;
  closeBrief: () => void;
}

const BriefContext = createContext<BriefContextType>({
  isOpen: false,
  openBrief: () => {},
  closeBrief: () => {},
});

export const BriefProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Open on load if #brief is present in URL hash; listen to hashchange
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkHash = () => {
      if (window.location.hash === '#brief') {
        setIsOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const openBrief = () => {
    setIsOpen(true);
  };

  const closeBrief = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined' && window.location.hash === '#brief') {
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <BriefContext.Provider value={{ isOpen, openBrief, closeBrief }}>
      {children}
      <BriefDialog open={isOpen} onClose={closeBrief} />
    </BriefContext.Provider>
  );
};

export function useBrief() {
  return useContext(BriefContext);
}
