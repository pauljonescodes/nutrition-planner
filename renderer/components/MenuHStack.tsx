import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useRxCollection } from "rxdb-hooks";

import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";
import { IngredientDrawer } from "./drawers/IngredientDrawer";
import { RecipeDrawer } from "./drawers/RecipeDrawer";

export function MenuHStack() {
  const router = useRouter();
  const [ingredientDrawerItem, setIngredientDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);
  const [recipeDrawerItem, setRecipeDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);

  const collection = useRxCollection<ItemDocument>("item");
  const color = useColorModeValue("gray.50", "gray.800");

  return (
    <Fragment>
      <HStack
        p={3}
        bg={color}
        width={"100vw"}
        overflowX="scroll"
        position="fixed"
        zIndex={999}
      >
        <ButtonGroup isAttached>
          <Button
            isActive={router.pathname === "/"}
            onClick={() => {
              router.push("/");
            }}
          >
            Items
          </Button>
          <IconButton
            onClick={() => {
              setIngredientDrawerItem({
                ...yupItemSchema.getDefault(),
                id: dataid(),
                type: ItemTypeEnum.ingredient,
              });
            }}
            icon={<AddIcon />}
            aria-label="Add"
          />
        </ButtonGroup>
        <ButtonGroup isAttached>
          <Button
            isActive={router.pathname === "/recipes"}
            onClick={() => {
              router.push("/recipes");
            }}
          >
            Recipes
          </Button>
          <IconButton
            onClick={() => {
              setRecipeDrawerItem({
                ...yupItemSchema.getDefault(),
                id: dataid(),
                type: ItemTypeEnum.recipe,
              });
            }}
            icon={<AddIcon />}
            aria-label="Add"
          />
        </ButtonGroup>
        {
          /* <ButtonGroup isAttached>
          <Button
            isActive={router.pathname === "/plans"}
            onClick={() => {
              router.push("/plans");
            }}
          >
            Plans
          </Button>
          <IconButton onClick={() => {}} icon={<AddIcon />} aria-label="Add" />
        </ButtonGroup>
        <ButtonGroup isAttached>
          <Button
            isActive={router.pathname === "/log"}
            onClick={() => {
              router.push("/log");
            }}
          >
            Log
          </Button>
          <IconButton onClick={() => {}} icon={<AddIcon />} aria-label="Add" />
        </ButtonGroup>*/
          <IconButton
            onClick={() => router.push("/settings")}
            isActive={router.pathname === "/settings"}
            icon={<SettingsIcon />}
            aria-label="Settings"
          />
        }
      </HStack>
      <IngredientDrawer
        item={ingredientDrawerItem}
        onResult={(item) => {
          setIngredientDrawerItem(null);
          if (item) {
            item.createdAt = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <RecipeDrawer
        item={recipeDrawerItem}
        onResult={(item) => {
          setRecipeDrawerItem(null);
          if (item) {
            item.createdAt = new Date();
            collection?.upsert(item);
          }
        }}
      />
    </Fragment>
  );
}
