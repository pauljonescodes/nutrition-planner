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
import { ItemFormik } from '../formik/ItemFormik';

type ItemDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
};

export function ItemDrawer(props: ItemDrawerProps) {
  const { item, onResult } = props;
  const { t } = useTranslation();
  return (
    <Drawer
      isOpen={item !== null}
      placement="left"
      onClose={() => onResult(null)}
      finalFocusRef={undefined}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t('item')}</DrawerHeader>

        <DrawerBody>
          <ItemFormik item={item} onSubmit={onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
