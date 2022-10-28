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
import { Fragment, LegacyRef, useContext, useRef } from "react";
import { useRxCollection } from "rxdb-hooks";
import { AppContext } from "../context/AppContext";
import { ItemDocument } from "../data/Database";
import { IngredientForm } from "../forms/IngredientForm";
import { RecipeForm } from "../forms/RecipeForm";

export function Feedback() {
  const appContext = useContext(AppContext);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const items = useRxCollection<ItemDocument>("items");

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
                appContext.setAppState!({});
                console.log(item);
                items?.upsert(item);
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
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Item</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup>
                <Button
                  onClick={() => appContext.setAppState!({})}
                  ref={cancelRef as LegacyRef<HTMLButtonElement>}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    const id = appContext.deleteItem?.id;
                    await items?.findOne({ selector: { id: id } }).remove();
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
