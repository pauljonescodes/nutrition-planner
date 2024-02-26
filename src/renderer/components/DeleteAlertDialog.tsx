import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { LegacyRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type IngredientDrawerProps = {
  isOpen: boolean;
  onResult(result: boolean): void;
};

export function DeleteAlertDialog(props: IngredientDrawerProps) {
  const { isOpen, onResult } = props;
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  return (
    <AlertDialog
      isOpen={isOpen}
      isCentered
      onClose={() => onResult(false)}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{t('delete')}</AlertDialogHeader>

          <AlertDialogBody>{t('areYouSure')}</AlertDialogBody>

          <AlertDialogFooter>
            <ButtonGroup>
              <Button
                onClick={() => {
                  onResult(false);
                }}
                ref={cancelRef as LegacyRef<HTMLButtonElement>}
              >
                {t('cancel')}
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  onResult(true);
                }}
              >
                {t('delete')}
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
