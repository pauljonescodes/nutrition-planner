import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInferredType } from "../../data/yup/item";
import { GroupFormik } from "../formik/GroupFormik";

type GroupDrawerProps = {
  item: Partial<ItemInferredType> | null;
  onResult(item: Partial<ItemInferredType> | null): void;
};

export function GroupDrawer(props: GroupDrawerProps) {
  return (
    <Drawer
      isOpen={props.item !== null}
      placement="left"
      size="md"
      onClose={() => {
        props.onResult(null);
      }}
      finalFocusRef={undefined}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Group</DrawerHeader>

        <DrawerBody>
          <GroupFormik
            item={props.item}
            onSubmit={(item) => {
              props.onResult(item);
            }}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
