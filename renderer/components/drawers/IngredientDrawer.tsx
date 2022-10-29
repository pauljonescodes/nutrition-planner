import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemType } from "../../data/yup/item";
import { IngredientForm } from "../forms/IngredientForm";

type IngredientDrawerProps = {
  item: ItemType | null;
  onResult(item: ItemType | null): void;
};

export function IngredientDrawer(props: IngredientDrawerProps) {
  return (
    <Drawer
      isOpen={props.item !== null}
      placement="left"
      onClose={() => props.onResult(null)}
      finalFocusRef={undefined}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Ingredient</DrawerHeader>

        <DrawerBody>
          <IngredientForm item={props.item} onSubmit={props.onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
