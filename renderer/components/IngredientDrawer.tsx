import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemDocument } from "../data/Database";
import { IngredientForm } from "../forms/IngredientForm";

type IngredientDrawerProps = {
  ingredient: ItemDocument;
  onClose(): void;
};

export function IngredientDrawer(props: IngredientDrawerProps) {
  return (
    <Drawer
      isOpen={props.ingredient ? true : false}
      placement="left"
      onClose={props.onClose}
      finalFocusRef={undefined}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Ingredient</DrawerHeader>

        <DrawerBody>
          <IngredientForm
            item={props.ingredient}
            onSubmit={async (item?: ItemDocument) => {}}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
