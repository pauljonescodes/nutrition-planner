import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInferredType } from "../../data/yup/item";
import { LogFormik } from "../formik/LogFormik";

type LogDrawerProps = {
  item: Partial<ItemInferredType> | null;
  onResult(item: Partial<ItemInferredType> | null): void;
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
          <LogFormik item={props.item} onSubmit={props.onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
