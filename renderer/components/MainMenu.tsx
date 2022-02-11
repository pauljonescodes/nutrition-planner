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

interface MainMenuProp {
  onClick?: () => void;
}

export function MainMenu(props: MainMenuProp) {
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
            if (props.onClick) {
              props.onClick();
            }
            router.push("/");
          }}
        >
          Ingredients
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (props.onClick) {
              props.onClick();
            }
            router.push("/recipes");
          }}
        >
          Recipes
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
