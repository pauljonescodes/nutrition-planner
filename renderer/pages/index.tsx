import { AddIcon } from "@chakra-ui/icons";
import { Box, Center, Heading, HStack, IconButton } from "@chakra-ui/react";
import React from "react";
import { MainMenu } from "../components/main-menu";

export default function IndexPage() {
  return (
    <Box>
      <HStack p="4">
        <Box>
          <MainMenu />
        </Box>
        <Box flex="1">
          <Center>
            <Heading size="md">Plans</Heading>
          </Center>
        </Box>
        <Box>
          <IconButton onClick={() => {}} icon={<AddIcon />} aria-label="Add" />
        </Box>
      </HStack>
    </Box>
  );
}
