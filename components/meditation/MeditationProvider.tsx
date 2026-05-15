'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MeditationOverlay } from './MeditationOverlay';

const FIFTEEN_MIN = 15 * 60 * 1000;
const LS_FIRST_DONE = 'med_first_done';
const LS_PAGE_OPEN = 'med_page_open';

interface MeditationCtx {
  requestWrite: (onProceed: () => void) => void;
}

const MeditationContext = createContext<MeditationCtx>({ requestWrite: (cb) => cb() });

export function useMeditation() {
  return useContext(MeditationContext);
}

interface Props {
  children: React.ReactNode;
  firstComment: boolean;
  every15min: boolean;
}

export function MeditationProvider({ children, firstComment, every15min }: Props) {
  const [showing, setShowing] = useState(false);
  const pendingCb = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (every15min) {
      localStorage.setItem(LS_PAGE_OPEN, Date.now().toString());
    }
  }, [every15min]);

  const requestWrite = useCallback((onProceed: () => void) => {
    // Module 1: first write per session
    if (firstComment && !sessionStorage.getItem(LS_FIRST_DONE)) {
      pendingCb.current = onProceed;
      setShowing(true);
      return;
    }

    // Module 2: every 15 minutes
    if (every15min) {
      const openTime = parseInt(localStorage.getItem(LS_PAGE_OPEN) ?? '0', 10);
      if (Date.now() - openTime >= FIFTEEN_MIN) {
        pendingCb.current = onProceed;
        setShowing(true);
        localStorage.setItem(LS_PAGE_OPEN, Date.now().toString());
        return;
      }
    }

    onProceed();
  }, [firstComment, every15min]);

  function handleDone() {
    setShowing(false);
    if (firstComment) sessionStorage.setItem(LS_FIRST_DONE, 'true');
    pendingCb.current?.();
    pendingCb.current = null;
  }

  return (
    <MeditationContext.Provider value={{ requestWrite }}>
      {children}
      {showing && <MeditationOverlay onDone={handleDone} />}
    </MeditationContext.Provider>
  );
}
