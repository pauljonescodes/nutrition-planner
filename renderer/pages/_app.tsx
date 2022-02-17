import {
  Box,
  ChakraProvider,
  extendTheme,
  VStack,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Fragment } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: "system",
  };

  const theme = extendTheme({
    config,
  });

  return (
    <Fragment>
      <ChakraProvider theme={theme}>
        <VStack align={"stretch"} spacing="0">
          <Box height={"100vh"}>
            <Component {...pageProps} />
          </Box>
        </VStack>
      </ChakraProvider>
    </Fragment>
  );
}
