import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useRxCollection } from "rxdb-hooks";

import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";
import { SubitemInferredType } from "../data/yup/subitem";
import { GroupDrawer } from "./drawers/GroupDrawer";
import { ItemDrawer } from "./drawers/ItemDrawer";
import { LogDrawer } from "./drawers/LogDrawer";
import { PlanDrawer } from "./drawers/PlanDrawer";
import { SettingsDrawer } from "./drawers/SettingsDrawer";

export function MenuHStack() {
  const router = useRouter();
  const [itemDrawerItem, setItemDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);
  const [groupDrawerItem, setGroupDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);
  const [planDrawerItem, setPlanDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);
  const [logDrawerItem, setLogDrawerItem] =
    useState<Partial<ItemInferredType> | null>(null);
  const [settingsDrawerIsOpen, setSettingsDrawerIsOpen] =
    useState<boolean>(false);

  const collection = useRxCollection<ItemDocument>("item");
  const hStackBackgroundColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Fragment>
      <HStack
        p={3}
        pr={3}
        bg={hStackBackgroundColor}
        width={"100vw"}
        overflowX="scroll"
        position="fixed"
        zIndex={999}
        className="hide-scrollbar"
      >
        <ButtonGroup isAttached>
          <Button
            isActive={router.pathname === "/"}
            onClick={() => {
              router.push("/");
            }}
          >
            Log
          </Button>
          <IconButton
            onClick={() => {
              setLogDrawerItem({
                ...yupItemSchema.getDefault(),
                id: dataid(),
                type: ItemTypeEnum.log,
              });
            }}
            icon={<AddIcon />}
            aria-label="Add"
          />
        </ButtonGroup>
        <ButtonGroup isAttached>
          <Button
            isActive={router.pathname === "/items"}
            onClick={() => {
              router.push("/items");
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
            isActive={router.pathname === "/groups"}
            onClick={() => {
              router.push("/groups");
            }}
          >
            Groups
          </Button>
          <IconButton
            onClick={() => {
              setGroupDrawerItem({
                ...yupItemSchema.getDefault(),
                id: dataid(),
                type: ItemTypeEnum.group,
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
        <Spacer />
        <IconButton
          onClick={() => {
            setSettingsDrawerIsOpen(true);
          }}
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
            item.date = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <GroupDrawer
        item={groupDrawerItem}
        onResult={(item) => {
          setGroupDrawerItem(null);
          if (item) {
            item.date = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <PlanDrawer
        item={planDrawerItem}
        onResult={(item) => {
          setPlanDrawerItem(null);
          if (item) {
            item.date = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <LogDrawer
        item={logDrawerItem}
        onResult={async (item) => {
          setLogDrawerItem(null);
          if (item) {
            const originalSubitems = item.subitems ?? [];
            const upsertedLogCopies: Array<SubitemInferredType> = [];
            for (const originalSubitem of originalSubitems) {
              const originalItem = await collection
                ?.findOne(originalSubitem.itemId!)
                .exec();
              const upsertedLogCopy = await originalItem?.upsertedLogCopy();
              console.log(upsertedLogCopy);
              if (upsertedLogCopy) {
                upsertedLogCopies.push({
                  itemId: upsertedLogCopy.id,
                  count: originalSubitem.count,
                });
              }
            }
            item.subitems = upsertedLogCopies;
            console.log(item);
            collection?.upsert(item);
          }
        }}
      />
      <SettingsDrawer
        isOpen={settingsDrawerIsOpen}
        onClose={() => setSettingsDrawerIsOpen(false)}
      />
    </Fragment>
  );
}
