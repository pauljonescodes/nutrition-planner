import { AddIcon } from "@chakra-ui/icons";
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
import { ItemDocument } from "../data/rxdb/item";
import { ItemType, yupItemSchema } from "../data/yup/item";
import { IngredientDrawer } from "./drawers/IngredientDrawer";

export function MenuHStack() {
  const router = useRouter();
  const [drawerItem, setDrawerItem] = useState<ItemType | null>(null);

  const collection = useRxCollection<ItemDocument>("items");
  const color = useColorModeValue("white", "gray.800");

  return (
    <Fragment>
      <HStack p={3} bg={color} width={"100vw"} overflowX="scroll">
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
              setDrawerItem({
                ...yupItemSchema.getDefault(),
                id: dataid(),
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
          <IconButton onClick={() => {}} icon={<AddIcon />} aria-label="Add" />
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
        </ButtonGroup>
      </HStack>
      <IngredientDrawer
        item={drawerItem}
        onResult={(item) => {
          setDrawerItem(null);
          if (item) {
            collection?.upsert(item);
          }
        }}
      />
    </Fragment>
  );
}
