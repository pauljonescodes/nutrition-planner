import {
  ChakraProvider,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { Feedback } from "../components/Feedback";
import { MenuHStack } from "../components/MenuHStack";
import { AppContext } from "../context/AppContext";
import { AppState } from "../context/AppState";

export default function App(props: AppProps) {
  const [appState, setAppState] = useState<AppState>({
    ingredientFormDrawerIsOpen: false,
    setAppState: (value) => {
      setAppState({ ...value, setAppState: appState.setAppState });
    },
  });

  const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: "system",
  };

  const theme = extendTheme({
    config,
  });

  return (
    <AppContext.Provider value={appState}>
      <ChakraProvider theme={theme}>
        <MenuHStack />
        <props.Component {...props.pageProps} />
        <Feedback />
      </ChakraProvider>
    </AppContext.Provider>
  );
}
