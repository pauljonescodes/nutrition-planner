import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

/*
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
*/

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "system",
};

export const theme = extendTheme({
  config,
});
