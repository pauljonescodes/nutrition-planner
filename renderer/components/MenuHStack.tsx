import { AddIcon, CopyIcon, LockIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, HStack, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AppContext } from "../context/AppContext";

export function MenuHStack() {
  const router = useRouter();

  return (
    <AppContext.Consumer>
      {(appStateValue) => (
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
              variant="outline"
              isActive={router.pathname === "/data"}
              onClick={() => {
                router.push("/data");
              }}
            >
              Data
            </Button>
            <IconButton
              variant="outline"
              icon={<CopyIcon />}
              aria-label="Save"
              onClick={async () => {}}
            />
            <IconButton
              variant="outline"
              icon={<LockIcon />}
              aria-label="Save"
              onClick={async () => {}}
            />
          </ButtonGroup>
        </HStack>
      )}
    </AppContext.Consumer>
  );
}
