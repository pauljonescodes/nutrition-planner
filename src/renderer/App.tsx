import { drawerAnatomy as parts } from '@chakra-ui/anatomy';
import {
  Box,
  ChakraProvider,
  ColorModeScript,
  VStack,
  extendTheme,
  type ThemeConfig,
} from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { useOrientation } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { addRxPlugin } from 'rxdb';
import { Provider as RxDbProvider } from 'rxdb-hooks';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import {
  RxCouchDBReplicationState,
  replicateCouchDB,
} from 'rxdb/plugins/replication-couchdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { useLocalStorage } from 'usehooks-ts';
import { MenuHStack } from './components/MenuHStack';
import { LocalStorageKeysEnum } from './constants';
import { initRxNPDatabase } from './data/rxnp/RxNPDatabaseHelpers';
import { RxNPDatabaseType } from './data/rxnp/RxNPDatabaseType';
import { RxNPItemDocument } from './data/rxnp/RxNPItemSchema';
import LogPage from './pages';
import GroupsPage from './pages/groups';
import ItemsPage from './pages/items';
import PlansPage from './pages/plans';
import { PathEnum } from './paths';
// import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import '../../styles/react-big-calendar.scss';
import '../../styles/react-datetime.scss';
import '../../styles/style.scss';
import PrivacyPage from './pages/privacy';
import SupportPage from './pages/support';
import TermsPage from './pages/terms';

export default function App() {
  const { i18n } = useTranslation();
  const { angle: orientationAngle } = useOrientation();
  const [database, setDatabase] = useState<RxNPDatabaseType | undefined>(
    undefined,
  );
  const [couchDbUrlLocalStorage] = useLocalStorage<string | undefined>(
    LocalStorageKeysEnum.couchdbUrl,
    undefined,
  );
  const [languageLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.language,
    'en',
  );
  const [replicationState, setReplicationState] =
    useState<RxCouchDBReplicationState<RxNPItemDocument> | null>(null);

  useEffect(() => {
    i18n.changeLanguage(languageLocalStorage);
  }, [languageLocalStorage, i18n]);

  useEffect(() => {
    if (couchDbUrlLocalStorage != null && database != null) {
      try {
        setReplicationState(
          replicateCouchDB({
            replicationIdentifier: 'nutrition-planner-couchdb-replication',
            collection: database.collections.item,
            url: couchDbUrlLocalStorage,
            pull: {},
            push: {},
          }),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    } else if (replicationState !== null) {
      replicationState.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couchDbUrlLocalStorage, database]);

  useEffect(() => {
    if (!database) {
      // addRxPlugin(RxDBDevModePlugin);
      addRxPlugin(RxDBQueryBuilderPlugin);
      addRxPlugin(RxDBJsonDumpPlugin);
      addRxPlugin(RxDBLeaderElectionPlugin);
      // eslint-disable-next-line promise/catch-or-return
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

  const font = `-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Oxygen-Sans, Ubuntu, Cantarell,
  "Helvetica Neue", sans-serif`;

  const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

  const baseStyle = definePartsStyle({
    dialog: {
      mt: 'env(safe-area-inset-top)',
      mb: 'env(safe-area-inset-bottom)',
      ms: 'env(safe-area-inset-left)',
      me: 'env(safe-area-inset-right)',
    },
  });

  const drawerTheme = defineMultiStyleConfig({
    baseStyle,
  });

  const theme = extendTheme({
    components: {
      Drawer: drawerTheme,
    },
    breakpoints,
    config,
    fonts: {
      heading: font,
      body: font,
    },
  });

  return (
    <BrowserRouter>
      <RxDbProvider db={database}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <VStack spacing={0} align="stretch" minH="100vh">
            <MenuHStack />
            <Box className={`main-box-angle-${orientationAngle}`}>
              <Routes>
                <Route path={PathEnum.log} element={<LogPage />} />
                <Route path={PathEnum.plans} element={<PlansPage />} />
                <Route path={PathEnum.items} element={<ItemsPage />} />
                <Route path={PathEnum.groups} element={<GroupsPage />} />
                <Route path={PathEnum.terms} element={<TermsPage />} />
                <Route path={PathEnum.privacy} element={<PrivacyPage />} />
                <Route path={PathEnum.support} element={<SupportPage />} />
              </Routes>
            </Box>
          </VStack>
        </ChakraProvider>
      </RxDbProvider>
    </BrowserRouter>
  );
}
