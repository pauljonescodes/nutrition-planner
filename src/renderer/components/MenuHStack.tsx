import { AddIcon, InfoIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRxCollection } from 'rxdb-hooks';
import { ItemInterface } from '../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../data/interfaces/ItemTypeEnum';
import { upsertLogInterface } from '../data/rxnp/RxNPDatabaseHelpers';
import { RxNPItemDocument } from '../data/rxnp/RxNPItemSchema';
import { PathEnum } from '../paths';
import { dataid } from '../utilities/dataid';
import { GroupDrawer } from './drawers/GroupDrawer';
import { InfoDrawer } from './drawers/InfoDrawer';
import { ItemDrawer } from './drawers/ItemDrawer';
import { LogDrawer } from './drawers/LogDrawer';
import { PlanDrawer } from './drawers/PlanDrawer';
import { SettingsDrawer } from './drawers/SettingsDrawer';

export function MenuHStack() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [itemDrawerItem, setItemDrawerItem] = useState<ItemInterface | null>(
    null,
  );
  const [groupDrawerItem, setGroupDrawerItem] = useState<ItemInterface | null>(
    null,
  );
  const [planDrawerItem, setPlanDrawerItem] = useState<ItemInterface | null>(
    null,
  );
  const [logDrawerItem, setLogDrawerItem] = useState<ItemInterface | null>(
    null,
  );
  const [settingsDrawerIsOpen, setSettingsDrawerIsOpen] =
    useState<boolean>(false);
  const [infoDrawerIsOpen, setInfoDrawerIsOpen] = useState<boolean>(false);

  const collection = useRxCollection<RxNPItemDocument>('item');
  const hStackBackgroundColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <>
      <HStack
        p={3}
        pt="calc(12px + env(safe-area-inset-top))"
        pl="calc(12px + env(safe-area-inset-left))"
        pr="calc(12px + env(safe-area-inset-right))"
        bg={hStackBackgroundColor}
        width="100vw"
        overflowX="scroll"
        position="fixed"
        zIndex={999}
        className="hide-scrollbar"
      >
        <ButtonGroup isAttached>
          <Button
            isActive={location.pathname === PathEnum.log}
            onClick={() => {
              navigate(PathEnum.log);
            }}
          >
            {t('log')}
          </Button>
          <IconButton
            onClick={() => {
              setLogDrawerItem({
                type: ItemTypeEnum.log,
              });
            }}
            icon={<AddIcon />}
            aria-label={t('add')}
          />
        </ButtonGroup>
        <ButtonGroup isAttached>
          <Button
            isActive={location.pathname === PathEnum.items}
            onClick={() => {
              navigate(PathEnum.items);
            }}
          >
            {t('items')}
          </Button>
          <IconButton
            onClick={() => {
              setItemDrawerItem({
                id: dataid(),
                type: ItemTypeEnum.item,
              });
            }}
            icon={<AddIcon />}
            aria-label={t('add')}
          />
        </ButtonGroup>
        <ButtonGroup isAttached>
          <Button
            isActive={location.pathname === PathEnum.groups}
            onClick={() => {
              navigate(PathEnum.groups);
            }}
          >
            {t('groups')}
          </Button>
          <IconButton
            onClick={() => {
              setGroupDrawerItem({
                id: dataid(),
                type: ItemTypeEnum.group,
              });
            }}
            icon={<AddIcon />}
            aria-label={t('add')}
          />
        </ButtonGroup>
        <ButtonGroup isAttached>
          <Button
            isActive={location.pathname === PathEnum.plans}
            onClick={() => {
              navigate(PathEnum.plans);
            }}
          >
            {t('plans')}
          </Button>
          <IconButton
            onClick={() => {
              setPlanDrawerItem({
                id: dataid(),
                type: ItemTypeEnum.plan,
              });
            }}
            icon={<AddIcon />}
            aria-label={t('add')}
          />
        </ButtonGroup>
        <Spacer />
        <IconButton
          onClick={() => {
            setInfoDrawerIsOpen(true);
          }}
          icon={<InfoIcon />}
          aria-label={t('info')}
        />
        <IconButton
          onClick={() => {
            setSettingsDrawerIsOpen(true);
          }}
          icon={<SettingsIcon />}
          aria-label={t('settings')}
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
      <InfoDrawer
        isOpen={infoDrawerIsOpen}
        onClose={() => setInfoDrawerIsOpen(false)}
      />
    </>
  );
}
