import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  ChakraProvider,
  extendTheme,
  HStack,
  IconButton,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: "system",
  };

  const theme = extendTheme({
    config,
  });

  const router = useRouter();

  return (
    <Fragment>
      <ChakraProvider theme={theme}>
        <HStack p={3}>
          <ButtonGroup isAttached>
            <Button
              variant="outline"
              isActive={router.pathname === "/"}
              onClick={() => {
                router.push("/");
              }}
            >
              Ingredients
            </Button>
            <IconButton
              variant="outline"
              // onClick={() => setFormDrawerIsOpen(true)}
              icon={<AddIcon />}
              aria-label="Add"
            />
          </ButtonGroup>

          <ButtonGroup isAttached>
            <Button
              variant="outline"
              isActive={router.pathname === "/recipes"}
              onClick={() => {
                router.push("/recipes");
              }}
            >
              Recipes
            </Button>
            <IconButton
              variant="outline"
              // onClick={() => setFormDrawerIsOpen(true)}
              icon={<AddIcon />}
              aria-label="Add"
            />
          </ButtonGroup>
          <Button
            variant="outline"
            isActive={router.pathname === "/data"}
            onClick={() => {
              router.push("/data");
            }}
          >
            Data
          </Button>
        </HStack>
        <Component {...pageProps} />
      </ChakraProvider>
    </Fragment>
  );
}
