import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Select,
  VStack,
  useColorMode,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import FileSaver from 'file-saver';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRxCollection, useRxDB } from 'rxdb-hooks';
import { useFilePicker } from 'use-file-picker';
import { useLocalStorage } from 'usehooks-ts';
import { LocalStorageKeysEnum } from '../../constants';
import languages from '../../i18n/languages';
import currencies from '../../i18n/currencies';
import { DeleteAlertDialog } from '../DeleteAlertDialog';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function SettingsDrawer(props: SettingsDrawerProps) {
  const { t, i18n } = useTranslation();
  const [importLoadingState, setImportLoadingState] = useState(false);
  const [showDeleteDialogState, setShowDeleteDialogState] = useState(false);
  const { toggleColorMode } = useColorMode();

  const [languageLocaleStorage, setLanguageLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.language,
    'en',
  );

  const [currencyLocalStorage, setCurrencyLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.currency,
    'USD',
  );

  const database = useRxDB();
  const collection = useRxCollection('item');
  const toast = useToast();

  const subtleTextColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  const {
    filesContent,
    loading: filesLoading,
    openFilePicker,
  } = useFilePicker({
    accept: '.json',
    multiple: false,
  });

  async function importFile() {
    if (filesContent.length > 0) {
      setImportLoadingState(true);
      await collection?.find().remove();
      await database.importJSON(JSON.parse(filesContent[0].content));
      setImportLoadingState(false);
      toast({
        title: t('success'),
        status: 'success',
      });
    }
  }

  useEffect(() => {
    importFile();
  }, [filesContent]);

  const loading = filesLoading || importLoadingState;

  return (
    <>
      <Drawer
        isOpen={props.isOpen}
        placement="right"
        size="md"
        onClose={props.onClose}
        finalFocusRef={undefined}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t('settings')}</DrawerHeader>
          <DrawerBody>
            <VStack alignItems="start">
              <FormLabel>{t('language')}</FormLabel>
              <Select
                value={languageLocaleStorage}
                onChange={(event) => {
                  setLanguageLocalStorage(event.target.value);
                }}
              >
                {languages.map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </Select>
              <FormLabel>{t('currency')}</FormLabel>
              <Select
                value={currencyLocalStorage}
                onChange={(event) => {
                  setCurrencyLocalStorage(event.target.value);
                }}
              >
                {currencies.map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </Select>
              <Button onClick={toggleColorMode} width="full">
                {t('toggleColorMode')}
              </Button>

              <Button
                width="full"
                disabled={loading}
                leftIcon={<DownloadIcon />}
                onClick={async () => {
                  const json = await database.exportJSON();
                  const blob = new Blob([JSON.stringify(json)], {
                    type: 'text/plain;charset=utf-8',
                  });

                  FileSaver.saveAs(
                    blob,
                    `nutrition_export_${new Date().toJSON()}.json`,
                  );
                }}
              >
                {t('exportJson')}
              </Button>

              <Button
                width="full"
                disabled={loading}
                onClick={() => {
                  openFilePicker();
                }}
                leftIcon={<DownloadIcon transform="scaleY(-1)" />}
              >
                {t('importJson')}
              </Button>
              <Button
                width="full"
                colorScheme="red"
                disabled={loading}
                leftIcon={<DeleteIcon />}
                onClick={() => {
                  setShowDeleteDialogState(true);
                }}
              >
                {t('reset')}
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <DeleteAlertDialog
        isOpen={showDeleteDialogState}
        onResult={async (result) => {
          setShowDeleteDialogState(false);
          if (result) {
            await collection?.find().remove();
            toast({
              title: t('success'),
              status: 'success',
            });
          }
        }}
      />
    </>
  );
}
