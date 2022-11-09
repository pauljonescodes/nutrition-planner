import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInterface } from "../../data/interfaces";
import { ItemFormik } from "../formik/ItemFormik";

type ItemDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
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
