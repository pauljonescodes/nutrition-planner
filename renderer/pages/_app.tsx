import { Box, ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Fragment } from "react";
import { NavHeader } from "../components/nav-header";

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
          <NavHeader />
          <Box height={"calc(100vh - 64px)"}>
            <Component {...pageProps} />
          </Box>
        </VStack>
      </ChakraProvider>
    </Fragment>
  );
}
