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
import { LogFormik } from '../formik/LogFormik';

type LogDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
  onDelete?(item: ItemInterface | null): void;
};

export function LogDrawer(props: LogDrawerProps) {
  const { item, onResult, onDelete } = props;
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
        <DrawerHeader>{t('log')}</DrawerHeader>

        <DrawerBody>
          <LogFormik item={item} onSubmit={onResult} onDelete={onDelete} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
