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
import { ItemInterface, upsertLogInterface } from "../data/interfaces";
import { ItemTypeEnum } from "../data/item-type-enum";
import { RxDBItemDocument } from "../data/rxdb";
import { GroupDrawer } from "./drawers/GroupDrawer";
import { ItemDrawer } from "./drawers/ItemDrawer";
import { LogDrawer } from "./drawers/LogDrawer";
import { PlanDrawer } from "./drawers/PlanDrawer";
import { SettingsDrawer } from "./drawers/SettingsDrawer";

export function MenuHStack() {
  const router = useRouter();
  const [itemDrawerItem, setItemDrawerItem] = useState<ItemInterface | null>(
    null
  );
  const [groupDrawerItem, setGroupDrawerItem] = useState<ItemInterface | null>(
    null
  );
  const [planDrawerItem, setPlanDrawerItem] = useState<ItemInterface | null>(
    null
  );
  const [logDrawerItem, setLogDrawerItem] = useState<ItemInterface | null>(
    null
  );
  const [settingsDrawerIsOpen, setSettingsDrawerIsOpen] =
    useState<boolean>(false);

  const collection = useRxCollection<RxDBItemDocument>("item");
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
            item.date = new Date().toISOString();
            collection?.upsert(item);
          }
        }}
      />
      <GroupDrawer
        item={groupDrawerItem}
        onResult={(item) => {
          setGroupDrawerItem(null);
          if (item) {
            item.date = new Date().toISOString();
            item.subitems = item.subitems?.map((value) => {
              return { itemId: value.itemId, count: value.count };
            });
            collection?.upsert(item);
          }
        }}
      />
      <PlanDrawer
        item={planDrawerItem}
        onResult={(item) => {
          setPlanDrawerItem(null);
          if (item) {
            item.date = new Date().toISOString();
            item.subitems = item.subitems?.map((value) => {
              return { itemId: value.itemId, count: value.count };
            });

            collection?.upsert(item);
          }
        }}
      />
      <LogDrawer
        item={logDrawerItem}
        onResult={async (item: ItemInterface | null) => {
          setLogDrawerItem(null);
          if (item) {
            await upsertLogInterface(item, collection ?? undefined);
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
