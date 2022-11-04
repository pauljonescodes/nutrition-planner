import {
  Box,
  ChakraProvider,
  extendTheme,
  VStack,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider as RxDbProvider } from "rxdb-hooks";
import "../../styles/react-big-calendar.scss";
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

  const breakpoints = {
    xs: "20em", // 320
    sm: "30em", // 480
    md: "48em", // 768
    lg: "62em", // 992
    xl: "80em", // 1280
    "2xl": "96em", // 1536
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
