import { Capacitor } from '@capacitor/core';
import { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { useIsElectron } from './utilities/useIsElectron';

export function Router(props: { children: ReactNode }) {
  const { children } = props;
  const isCapacitor = Capacitor.isNativePlatform();
  const isElectron = useIsElectron();
  const isWeb = !isCapacitor && !isElectron;

  return isWeb ? (
    <BrowserRouter>{children}</BrowserRouter>
  ) : (
    <MemoryRouter>{children}</MemoryRouter>
  );
}
