import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInferredType } from "../../data/yup/item";

import { ItemFormik } from "../formik/ItemFormik";

type ItemDrawerProps = {
  item: Partial<ItemInferredType> | null;
  onResult(item: Partial<ItemInferredType> | null): void;
};

export function ItemDrawer(props: ItemDrawerProps) {
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
          <ItemFormik item={props.item} onSubmit={props.onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
