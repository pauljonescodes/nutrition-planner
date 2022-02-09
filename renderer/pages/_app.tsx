import { Box, ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Fragment } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <ChakraProvider
        theme={extendTheme({
          styles: {
            global: {
              "html, body": {
                overflow: "hidden",
              },
            },
          },
          fonts: {
            heading: "system-ui",
            body: "system-ui",
          },
          useSystemColorMode: true,
          initialColorMode: "system",
        })}
      >
        <VStack align={"stretch"} spacing="0">
          <Box height={"100vh"}>
            <Component {...pageProps} />
          </Box>
        </VStack>
      </ChakraProvider>
    </Fragment>
  );
}
