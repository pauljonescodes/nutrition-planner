import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import React, { Fragment } from "react";
import { AppContext } from "../context/AppContext";
import { Database } from "../data/Database";
import { IngredientForm } from "../forms/IngredientForm";
import { RecipeForm } from "../forms/RecipeForm";

export function Feedback() {
  return (
    <AppContext.Consumer>
      {(appStateValue) => (
        <Fragment>
          <Drawer
            isOpen={appStateValue.ingredientFormDrawerIsOpen ?? false}
            placement="left"
            onClose={() => {
              appStateValue.setAppState!({});
            }}
            finalFocusRef={undefined}
            size="lg"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                {appStateValue.updateItem ? "Update" : "Create"} ingredient
              </DrawerHeader>

              <DrawerBody>
                <IngredientForm
                  item={appStateValue.updateItem}
                  onSubmit={async (item) => {
                    appStateValue.setAppState!({});
                    const saved = await Database.shared().saveItem(item);
                    return saved.id;
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <Drawer
            isOpen={appStateValue.recipeFormDrawerIsOpen ?? false}
            placement="left"
            size="lg"
            onClose={() => {
              appStateValue.setAppState!({});
            }}
            finalFocusRef={undefined}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                {appStateValue.updateItem ? "Update" : "Create"} recipe
              </DrawerHeader>

              <DrawerBody>
                <RecipeForm
                  item={appStateValue.updateItem}
                  onSubmit={async (item) => {
                    appStateValue.setAppState!({});
                    const saved = await Database.shared().saveItem(item);

                    return saved.id;
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <AlertDialog
            isOpen={appStateValue.deleteItem !== undefined}
            onClose={() => appStateValue.setAppState!({})}
            leastDestructiveRef={undefined}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>Delete Item</AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <ButtonGroup>
                    <Button onClick={() => appStateValue.setAppState!({})}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={async () => {
                        await Database.shared().deleteItem(
                          appStateValue.deleteItem?.id!
                        );
                        appStateValue.setAppState!({});
                      }}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Fragment>
      )}
    </AppContext.Consumer>
  );
}
