import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInterface } from "../../data/interfaces/ItemInterface";
import { ItemFormik } from "../formik/ItemFormik";
import { useTranslation } from "react-i18next";

type ItemDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
};

export function ItemDrawer(props: ItemDrawerProps) {
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
        <DrawerHeader>{t("item")}</DrawerHeader>

        <DrawerBody>
          <ItemFormik item={props.item} onSubmit={props.onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
