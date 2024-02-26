import { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { useIsCapacitor } from './utilities/useIsCapacitor';
import { useIsElectron } from './utilities/useIsElectron';

export function Router(props: { children: ReactNode }) {
  const { children } = props;
  const isCapacitor = useIsCapacitor();
  const isElectron = useIsElectron();
  const isWeb = !isCapacitor && !isElectron;

  return isWeb ? (
    <BrowserRouter>{children}</BrowserRouter>
  ) : (
    <MemoryRouter>{children}</MemoryRouter>
  );
}
