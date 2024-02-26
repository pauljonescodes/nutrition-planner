import { useMemo } from 'react';

export const useIsCapacitor = () => {
  const isCapacitor = useMemo(() => {
    return (
      typeof window !== 'undefined' && (window as any).Capacitor !== undefined
    );
  }, []);

  return isCapacitor;
};
