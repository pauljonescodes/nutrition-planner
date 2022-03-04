import {
  Box,
  ChakraProvider,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Feedback } from "../components/Feedback";
import { MenuHStack } from "../components/MenuHStack";
import { AppContext } from "../context/AppContext";
import { AppState } from "../context/AppState";
import { createDatabase } from "../data/DatabaseTypes";

export default function App(props: AppProps) {
  const [appState, setAppState] = useState<AppState>({
    ingredientFormDrawerIsOpen: false,
    setAppState: (value) => {
      console.log(`setting app state ${value.database} ${appState.database}`);
      setAppState({
        ...value,
        setAppState: appState.setAppState,
        database: appState.database,
      });
    },
  });

  const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: "system",
  };

  const theme = extendTheme({
    config,
  });

  useEffect(() => {
    const setDatabaseAppState = async () => {
      console.log("creating database");
      const database = await createDatabase();
      console.log("created database");
      setAppState({ ...appState, database });
    };
    setDatabaseAppState();
    return () => {
      console.log("destroying");
      appState.database?.destroy();
    };
  }, []);

  console.log(`rendering ${appState.database}`);

  return (
    <AppContext.Provider value={appState}>
      <ChakraProvider theme={theme}>
        <MenuHStack />
        <Box pt="64px">
          <props.Component {...props.pageProps} />
        </Box>

        <Feedback />
      </ChakraProvider>
    </AppContext.Provider>
  );
}
