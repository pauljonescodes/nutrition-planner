import { drawerAnatomy } from '@chakra-ui/anatomy';
import { extendTheme } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

export const font = `-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Oxygen-Sans, Ubuntu, Cantarell,
  "Helvetica Neue", sans-serif`;

export const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(drawerAnatomy.keys);

export const theme = extendTheme({
  components: {
    Drawer: defineMultiStyleConfig({
      baseStyle: definePartsStyle({
        dialog: {
          mt: 'env(safe-area-inset-top)',
          mb: 'env(safe-area-inset-bottom)',
          ms: 'env(safe-area-inset-left)',
          me: 'env(safe-area-inset-right)',
        },
      }),
    }),
  },
  breakpoints: {
    xs: '20em', // 320
    sm: '30em', // 480
    md: '48em', // 768
    lg: '62em', // 992
    xl: '80em', // 1280
    '2xl': '96em', // 1536
  },
  config: {
    useSystemColorMode: true,
    initialColorMode: 'system',
  },
  fonts: {
    heading: font,
    body: font,
  },
});
