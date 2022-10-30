import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInferredType } from "../../data/yup/item";

import { IngredientForm } from "../forms/IngredientForm";

type IngredientDrawerProps = {
  item: Partial<ItemInferredType> | null;
  onResult(item: Partial<ItemInferredType> | null): void;
};

export function IngredientDrawer(props: IngredientDrawerProps) {
  return (
    <Drawer
      isOpen={props.item !== null}
      placement="left"
      onClose={() => props.onResult(null)}
      finalFocusRef={undefined}
      size="md"
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
