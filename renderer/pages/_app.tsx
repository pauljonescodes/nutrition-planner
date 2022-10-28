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
import { MenuHStack } from "../components/MenuHStack";
import { createDatabase, DatabaseType } from "../data/Database";

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
  });

  return (
    <RxDbProvider db={database}>
      <ChakraProvider theme={theme}>
        <VStack spacing={0} align="stretch">
          <MenuHStack />
          <Box>
            <props.Component {...props.pageProps} />
          </Box>
        </VStack>
      </ChakraProvider>
    </RxDbProvider>
  );
}
