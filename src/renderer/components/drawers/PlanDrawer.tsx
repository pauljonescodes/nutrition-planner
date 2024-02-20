import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { PlanFormik } from "../formik/PlanFormik";
import { useTranslation } from "react-i18next";

type PlanDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
};

export function PlanDrawer(props: PlanDrawerProps) {
  const { t } = useTranslation();
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
        <DrawerHeader>{t("plan")}</DrawerHeader>

        <DrawerBody>
          <PlanFormik item={props.item} onSubmit={props.onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
