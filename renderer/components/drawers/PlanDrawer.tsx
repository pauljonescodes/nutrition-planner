import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInferredType } from "../../data/yup/item";
import { PlanFormik } from "../formik/PlanFormik";

type PlanDrawerProps = {
  item: Partial<ItemInferredType> | null;
  onResult(item: Partial<ItemInferredType> | null): void;
};

export function PlanDrawer(props: PlanDrawerProps) {
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
        <DrawerHeader>Plan</DrawerHeader>

        <DrawerBody>
          <PlanFormik item={props.item} onSubmit={props.onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
