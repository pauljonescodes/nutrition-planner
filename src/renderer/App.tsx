import {
  Box,
  ChakraProvider,
  ColorModeScript,
  VStack,
  extendTheme,
  type ThemeConfig,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { addRxPlugin } from 'rxdb';
import { Provider as RxDbProvider } from 'rxdb-hooks';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { useLocalStorage } from 'usehooks-ts';
import { MenuHStack } from './components/MenuHStack';
import { LocalStorageKeysEnum } from './constants';
import { initRxNPDatabase } from './data/rxnp/RxNPDatabaseHelpers';
import { RxNPDatabaseType } from './data/rxnp/RxNPDatabaseType';
import LogPage from './pages';
import GroupsPage from './pages/groups';
import ItemsPage from './pages/items';
import PlansPage from './pages/plans';
import { PathEnum } from './paths';

import '../../styles/react-big-calendar.scss';
import '../../styles/react-datetime.scss';
import '../../styles/style.scss';

export default function App() {
  const { i18n } = useTranslation();
  const [database, setDatabase] = useState<RxNPDatabaseType | undefined>(
    undefined,
  );
  const [languageLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.language,
    'en',
  );

  useEffect(() => {
    i18n.changeLanguage(languageLocalStorage);
  }, [languageLocalStorage, i18n]);

  useEffect(() => {
    if (!database) {
      addRxPlugin(RxDBQueryBuilderPlugin);
      addRxPlugin(RxDBJsonDumpPlugin);
      addRxPlugin(RxDBLeaderElectionPlugin);
      initRxNPDatabase('nutrition-planner-db', getRxStorageDexie()).then(
        setDatabase,
      );
    }
  }, [database]);

  const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: 'system',
  };

  const breakpoints = {
    xs: '20em', // 320
    sm: '30em', // 480
    md: '48em', // 768
    lg: '62em', // 992
    xl: '80em', // 1280
    '2xl': '96em', // 1536
  };

  const theme = extendTheme({
    breakpoints,
    config,
    fonts: {
      body: `-apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Oxygen-Sans, Ubuntu, Cantarell,
          "Helvetica Neue", sans-serif`,
    },
  });

  return (
    <Router>
      <RxDbProvider db={database}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <VStack spacing={0} align="stretch" minH="100vh">
            <MenuHStack />
            <Box pt="64px" minH="100vh">
              <Routes>
                <Route path={PathEnum.log} element={<LogPage />} />
                <Route path={PathEnum.plans} element={<PlansPage />} />
                <Route path={PathEnum.items} element={<ItemsPage />} />
                <Route path={PathEnum.groups} element={<GroupsPage />} />
              </Routes>
            </Box>
          </VStack>
        </ChakraProvider>
      </RxDbProvider>
    </Router>
  );
}
