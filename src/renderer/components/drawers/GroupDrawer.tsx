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
import { useTranslation } from "react-i18next";

type GroupDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
};

export function GroupDrawer(props: GroupDrawerProps) {
  const { t } = useTranslation();
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
        <DrawerHeader>{t("group")}</DrawerHeader>

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
