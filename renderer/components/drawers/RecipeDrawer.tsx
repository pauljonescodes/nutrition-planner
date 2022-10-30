import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemInferredType } from "../../data/yup/item";
import { RecipeForm } from "../forms/RecipeForm";

type RecipeDrawerProps = {
  item: Partial<ItemInferredType> | null;
  onResult(item: Partial<ItemInferredType> | null): void;
};

export function RecipeDrawer(props: RecipeDrawerProps) {
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
        <DrawerHeader>Recipe</DrawerHeader>

        <DrawerBody>
          <RecipeForm
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
