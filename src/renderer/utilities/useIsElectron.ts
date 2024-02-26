import { useMemo } from 'react';

export const useIsElectron = () => {
  const isElectron = useMemo(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      (window.process as any)?.type === 'renderer'
    ) {
      return true;
    }
    if (
      typeof process !== 'undefined' &&
      typeof process.versions === 'object' &&
      !!process.versions.electron
    ) {
      return true;
    }
    if (
      typeof navigator === 'object' &&
      typeof navigator.userAgent === 'string' &&
      navigator.userAgent.includes('Electron')
    ) {
      return true;
    }
    return false;
  }, []);

  return isElectron;
};
