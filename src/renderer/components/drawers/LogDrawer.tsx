import { memo } from 'react';
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
import { LogFormik as BaseLogFormik } from '../formik/LogFormik';

const LogFormik = memo(BaseLogFormik, (prevProps, nextProps) => {
  const itemsAreEqual = prevProps.item?.id === nextProps.item?.id;
  const onSubmitAreEqual = prevProps.onSubmit === nextProps.onSubmit;
  const onDeleteAreEqual = prevProps.onDelete === nextProps.onDelete;
  return itemsAreEqual && onSubmitAreEqual && onDeleteAreEqual;
});

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
