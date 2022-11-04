import {
  Box,
  ChakraProvider,
  extendTheme,
  VStack,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Provider as RxDbProvider } from "rxdb-hooks";
import { MenuHStack } from "../components/MenuHStack";
import { createDatabase, DatabaseType } from "../data/rxdb/database";

export default function App(props: AppProps) {
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
    fonts: {
      body: `-apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen-Sans, Ubuntu, Cantarell,
      "Helvetica Neue", sans-serif`,
    },
  });

  return (
    <RxDbProvider db={database} idAttribute="id">
      <ChakraProvider theme={theme}>
        <VStack spacing={0} align="stretch" minH="100vh">
          <MenuHStack />
          <Box pt="64px" minH="100vh">
            <props.Component {...props.pageProps} />
          </Box>
        </VStack>
      </ChakraProvider>
    </RxDbProvider>
  );
}
