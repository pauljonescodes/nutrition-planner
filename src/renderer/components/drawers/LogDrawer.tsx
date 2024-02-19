import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { LogFormik } from "../formik/LogFormik";

type LogDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
  onDelete?(item: ItemInterface | null): void;
};

export function LogDrawer(props: LogDrawerProps) {
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
        <DrawerHeader>Log</DrawerHeader>

        <DrawerBody>
          <LogFormik
            item={props.item}
            onSubmit={props.onResult}
            onDelete={props.onDelete}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
