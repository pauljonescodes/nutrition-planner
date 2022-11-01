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
import { ItemDrawer } from "./drawers/ItemDrawer";
import { PlanDrawer } from "./drawers/PlanDrawer";
import { RecipeDrawer } from "./drawers/RecipeDrawer";

export function MenuHStack() {
  const router = useRouter();
  const [itemDrawerItem, setItemDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);
  const [recipeDrawerItem, setRecipeDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);
  const [planDrawerItem, setPlanDrawerItem] =
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
        id="MenuHStack"
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
              setItemDrawerItem({
                ...yupItemSchema.getDefault(),
                id: dataid(),
                type: ItemTypeEnum.item,
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
        <ButtonGroup isAttached>
          <Button
            isActive={router.pathname === "/plans"}
            onClick={() => {
              router.push("/plans");
            }}
          >
            Plans
          </Button>
          <IconButton
            onClick={() => {
              setPlanDrawerItem({
                ...yupItemSchema.getDefault(),
                id: dataid(),
                type: ItemTypeEnum.plan,
              });
            }}
            icon={<AddIcon />}
            aria-label="Add"
          />
        </ButtonGroup>
        <IconButton
          onClick={() => router.push("/settings")}
          isActive={router.pathname === "/settings"}
          icon={<SettingsIcon />}
          aria-label="Settings"
        />
      </HStack>
      <ItemDrawer
        item={itemDrawerItem}
        onResult={(item) => {
          setItemDrawerItem(null);
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
      <PlanDrawer
        item={planDrawerItem}
        onResult={(item) => {
          setPlanDrawerItem(null);
          if (item) {
            item.createdAt = new Date();
            collection?.upsert(item);
          }
        }}
      />
    </Fragment>
  );
}
