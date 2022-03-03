import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AppContext } from "../context/AppContext";

export function MenuHStack() {
  const router = useRouter();

  const color = useColorModeValue("white", "gray.800");

  return (
    <AppContext.Consumer>
      {(appStateValue) => (
        <HStack p={3} position="fixed" top="0" bg={color} width="100%">
          <ButtonGroup isAttached>
            <Button
              isActive={router.pathname === "/"}
              onClick={() => {
                router.push("/");
              }}
            >
              Ingredients
            </Button>
            <IconButton
              onClick={() => {
                appStateValue.setAppState!({
                  ingredientFormDrawerIsOpen: true,
                });
              }}
              icon={<AddIcon />}
              aria-label="Add"
            />
          </ButtonGroup>
          <ButtonGroup isAttached>
            <Button
              isActive={router.pathname === "/recipes"}
              onClick={() => {
                router.push("/recipes");
              }}
            >
              Recipes
            </Button>
            <IconButton
              onClick={() => {
                appStateValue.setAppState!({
                  recipeFormDrawerIsOpen: true,
                });
              }}
              icon={<AddIcon />}
              aria-label="Add"
            />
          </ButtonGroup>
          <ButtonGroup isAttached>
            <Button
              isActive={router.pathname === "/plans"}
              onClick={() => {
                router.push("/plans");
              }}
            >
              Plans
            </Button>
            <IconButton
              onClick={() => {
                appStateValue.setAppState!({
                  recipeFormDrawerIsOpen: true,
                });
              }}
              icon={<AddIcon />}
              aria-label="Add"
            />
          </ButtonGroup>
        </HStack>
      )}
    </AppContext.Consumer>
  );
}
