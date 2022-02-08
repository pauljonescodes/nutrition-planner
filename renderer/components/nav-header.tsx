import {
  Box,
  Flex,
  HStack,
  Link,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

export const NavHeader = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Fragment>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack as={"nav"} spacing={4}>
            <NextLink href={"/"}>
              <Link>Plans</Link>
            </NextLink>
            <NextLink href={"/recipes"}>
              <Link>Recipes</Link>
            </NextLink>
            <NextLink href={"/ingredients"}>
              <Link>Ingredients</Link>
            </NextLink>
            <NextLink href={"/data"}>
              <Link>Data</Link>
            </NextLink>
          </HStack>
        </Flex>
      </Box>
    </Fragment>
  );
};
