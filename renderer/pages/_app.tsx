import { Box, ChakraProvider, VStack } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Fragment } from "react";
import { theme } from "./theme";

export default function App({ Component, pageProps }: AppProps) {
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
