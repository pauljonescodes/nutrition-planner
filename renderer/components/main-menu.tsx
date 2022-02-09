import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

export function MainMenu() {
  const router = useRouter();
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem
          onClick={() => {
            router.push("/");
          }}
        >
          Plans
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/recipes");
          }}
        >
          Recipes
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/ingredients");
          }}
        >
          Ingredients
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/data");
          }}
        >
          Data
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
