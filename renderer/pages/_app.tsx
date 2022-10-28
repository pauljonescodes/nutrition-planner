import {
  Box,
  ChakraProvider,
  extendTheme,
  VStack,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider } from "rxdb-hooks";
import { Feedback } from "../components/Feedback";
import { MenuHStack } from "../components/MenuHStack";
import { AppContext } from "../context/AppContext";
import { AppState } from "../context/AppState";
import { createDatabase, DatabaseType } from "../data/Database";

export default function App(props: AppProps) {
  const [appState, setAppState] = useState<AppState>({
    ingredientFormDrawerIsOpen: false,
    setAppState: (value) => {
      setAppState({
        ...value,
        setAppState: appState.setAppState,
      });
    },
  });

  const [database, setDatabase] = useState<DatabaseType | undefined>(undefined);

  useEffect(() => {
    createDatabase().then(setDatabase);
  }, []);

  const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: "system",
  };

  const theme = extendTheme({
    config,
  });

  return (
    <Provider db={database}>
      <AppContext.Provider value={appState}>
        <ChakraProvider theme={theme}>
          <VStack spacing={0} align="stretch">
            <MenuHStack />
            <Box>
              <props.Component {...props.pageProps} />
            </Box>
          </VStack>

          <Feedback />
        </ChakraProvider>
      </AppContext.Provider>
    </Provider>
  );
}
