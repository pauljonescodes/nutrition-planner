import { useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDarkMode } from 'usehooks-ts';

export function Configuration() {
  const { isDarkMode } = useDarkMode();
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setColorMode]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}
