import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { ItemDocument } from "../../data/rxdb/item";
import { RecipeForm } from "../forms/RecipeForm";

type RecipeDrawerProps = {
  recipe: ItemDocument;
  onClose(): void;
};

export function RecipeDrawer(props: RecipeDrawerProps) {
  return (
    <Drawer
      isOpen={false}
      placement="left"
      size="lg"
      onClose={() => {
        // appContext.setAppState!({});
      }}
      finalFocusRef={undefined}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Recipe</DrawerHeader>

        <DrawerBody>
          <RecipeForm
            item={props.recipe}
            onSubmit={(item) => {
              // const saved = await Database.shared().saveItem(item);
            }}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
