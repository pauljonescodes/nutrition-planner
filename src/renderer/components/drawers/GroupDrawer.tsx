import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { GroupFormik } from '../formik/GroupFormik';

type GroupDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
};

export function GroupDrawer(props: GroupDrawerProps) {
  const { item, onResult } = props;
  const { t } = useTranslation();
  return (
    <Drawer
      isOpen={item !== null}
      placement="left"
      size="md"
      onClose={() => {
        onResult(null);
      }}
      finalFocusRef={undefined}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t('group')}</DrawerHeader>

        <DrawerBody>
          <GroupFormik
            item={item}
            onSubmit={(anItem) => {
              onResult(anItem);
            }}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
