import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { GroupFormik } from "../formik/GroupFormik";

type GroupDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
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
