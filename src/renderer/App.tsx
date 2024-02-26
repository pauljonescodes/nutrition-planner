import { Box, ChakraProvider, ColorModeScript, VStack } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import { Provider as RxDbProvider } from 'rxdb-hooks';
import '../../styles/react-big-calendar.scss';
import '../../styles/react-datetime.scss';
import '../../styles/style.scss';
import { Configuration } from './Configuration';
import { Router } from './Router';
import { theme } from './Theme';
import { MenuHStack } from './components/MenuHStack';
import { useRxNPDatabase } from './data/rxnp/useRxNPDatabase';
import LogPage from './pages';
import GroupsPage from './pages/groups';
import ItemsPage from './pages/items';
import PlansPage from './pages/plans';
import PrivacyPage from './pages/privacy';
import SupportPage from './pages/support';
import TermsPage from './pages/terms';
import { PathEnum } from './paths';

export default function App() {
  const { database } = useRxNPDatabase();

  return (
    <Router>
      <RxDbProvider db={database}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <Configuration />
          <VStack spacing={0} align="stretch" minH="100vh">
            <MenuHStack />
            <Box
              minH="100vh"
              pt="calc(64px + env(safe-area-inset-top))"
              pl="env(safe-area-inset-left)"
              pr="env(safe-area-inset-right)"
            >
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
    </Router>
  );
}
