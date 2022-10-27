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
import { Fragment, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { IngredientForm } from "../forms/IngredientForm";
import { RecipeForm } from "../forms/RecipeForm";

export function Feedback() {
  const appContext = useContext(AppContext);

  return (
    <Fragment>
      <Drawer
        isOpen={appContext.ingredientFormDrawerIsOpen ?? false}
        placement="left"
        onClose={() => {
          appContext.setAppState!({});
        }}
        finalFocusRef={undefined}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {appContext.updateItem ? "Update" : "Create"} ingredient
          </DrawerHeader>

          <DrawerBody>
            <IngredientForm
              item={appContext.updateItem}
              onSubmit={async (item) => {
                console.log(appContext.database);
                appContext.setAppState!({});
                console.log(item.id);

                const result = await appContext.database?.items.upsert({
                  ...item,
                });
                console.log(`asdasd ${result}`);
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={appContext.recipeFormDrawerIsOpen ?? false}
        placement="left"
        size="lg"
        onClose={() => {
          appContext.setAppState!({});
        }}
        finalFocusRef={undefined}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {appContext.updateItem ? "Update" : "Create"} recipe
          </DrawerHeader>

          <DrawerBody>
            <RecipeForm
              item={appContext.updateItem}
              onSubmit={(item) => {
                appContext.setAppState!({});
                // const saved = await Database.shared().saveItem(item);
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={appContext.deleteItem !== undefined}
        onClose={() => {}}
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
                <Button onClick={() => appContext.setAppState!({})}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    const id = appContext.deleteItem?.id;
                    console.log(id);
                    if (id !== undefined) {
                      console.log(appContext.database);
                      const result =
                        await appContext.database?.items.bulkRemove([id]);
                      console.log(result);
                    }

                    appContext.setAppState!({});
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
  );
}
