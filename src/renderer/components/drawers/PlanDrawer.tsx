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
import { PlanFormik } from '../formik/PlanFormik';

type PlanDrawerProps = {
  item: ItemInterface | null;
  onResult(item: ItemInterface | null): void;
};

export function PlanDrawer(props: PlanDrawerProps) {
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
        <DrawerHeader>{t('plan')}</DrawerHeader>

        <DrawerBody>
          <PlanFormik item={item} onSubmit={onResult} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
