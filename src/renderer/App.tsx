import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import GroupsPage from './pages/groups';
import ItemsPage from './pages/items';
import PlansPage from './pages/plans';
import LogPage from './pages';
import { Provider as RxDbProvider } from 'rxdb-hooks';
import { useState, useEffect } from 'react';
import { addRxPlugin } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { MenuHStack } from './components/MenuHStack';
import { RxDBDatabaseType, initRxDBDatabase } from './data/database';
import {
  Box,
  ChakraProvider,
  VStack,
  extendTheme,
  type ThemeConfig,
  ColorModeScript,
} from '@chakra-ui/react';
import '../../styles/style.scss';
import '../../styles/react-big-calendar.scss';
import '../../styles/react-datetime.scss';

export default function App() {
  const [database, setDatabase] = useState<RxDBDatabaseType | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!database) {
      addRxPlugin(RxDBQueryBuilderPlugin);
      addRxPlugin(RxDBJsonDumpPlugin);
      //addRxPlugin(RxDBDevModePlugin);
      addRxPlugin(RxDBLeaderElectionPlugin);
      initRxDBDatabase('nutrition-planner-db', getRxStorageDexie()).then(
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
                <Route path="/" element={<LogPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/groups" element={<GroupsPage />} />
              </Routes>
            </Box>
          </VStack>
        </ChakraProvider>
      </RxDbProvider>
    </Router>
  );
}
