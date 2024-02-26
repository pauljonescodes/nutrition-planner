import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Button,
  Link as ChakraLink,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import FileSaver from 'file-saver';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useRxCollection, useRxDB } from 'rxdb-hooks';
import { useFilePicker } from 'use-file-picker';
import { useLocalStorage } from 'usehooks-ts';
import currencies from '../../i18n/currencies';
import { languageNames, languages } from '../../i18n/languages';
import { PathEnum } from '../../paths';
import { isValidUrl } from '../../utilities/isValidUrl';
import {
  LocalStorageKeysEnum,
  useCurrencyLocalStorage,
  useLanguageLocalStorage,
} from '../../utilities/useLocalStorageKey';
import { DeleteAlertDialog } from '../DeleteAlertDialog';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function SettingsDrawer(props: SettingsDrawerProps) {
  const { isOpen, onClose } = props;
  const { t } = useTranslation();
  const [importLoadingState, setImportLoadingState] = useState(false);
  const [showDeleteDialogState, setShowDeleteDialogState] = useState(false);

  const [couchDbUrlLocalStorage, setCouchDbUrlLocalStorage] = useLocalStorage<
    string | undefined
  >(LocalStorageKeysEnum.couchdbUrl, undefined);
  const [couchDbStringState, setCouchDbStringState] = useState<
    string | undefined
  >(couchDbUrlLocalStorage);

  const [languageLocalStorage, setLanguageLocalStorage] =
    useLanguageLocalStorage();

  const [currencyLocalStorage, setCurrencyLocalStorage] =
    useCurrencyLocalStorage();

  const database = useRxDB();
  const collection = useRxCollection('item');
  const toast = useToast();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesContent]);

  const loading = filesLoading || importLoadingState;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        size="md"
        onClose={onClose}
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
                value={languageLocalStorage}
                onChange={(event) => {
                  setLanguageLocalStorage(event.target.value);
                }}
              >
                {languages.map((value) => (
                  <option value={value} key={value}>
                    {languageNames[value]}
                  </option>
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
                  <option value={value} key={value}>
                    {t(value)}
                  </option>
                ))}
              </Select>
              <FormControl pb={1}>
                <FormLabel>{t('couchDbUrl')}</FormLabel>
                <HStack>
                  <Input
                    value={couchDbStringState ?? undefined}
                    onChange={(e) => {
                      setCouchDbStringState(e.target.value);
                    }}
                  />
                  <Button
                    w="30%"
                    onClick={async () => {
                      if (
                        couchDbStringState !== null &&
                        collection !== null &&
                        isValidUrl(couchDbStringState ?? undefined)
                      ) {
                        setCouchDbUrlLocalStorage(couchDbStringState);
                      } else {
                        setCouchDbUrlLocalStorage(undefined);
                      }
                    }}
                  >
                    {t('submit')}
                  </Button>
                </HStack>
              </FormControl>

              <Button
                width="full"
                disabled={loading}
                leftIcon={<DownloadIcon />}
                onClick={async () => {
                  const jsonString = JSON.stringify(
                    await database.exportJSON(),
                  );
                  const filename = `nutrition_export_${new Date().toJSON()}.json`;

                  if (Capacitor.isNativePlatform()) {
                    const result = await Filesystem.writeFile({
                      path: filename,
                      data: jsonString,
                      directory: Directory.Data,
                      encoding: Encoding.UTF8,
                    });
                    if (result.uri) {
                      toast({
                        title: t('success'),
                        status: 'success',
                      });
                    } else {
                      toast({
                        title: t('error'),
                        status: 'error',
                      });
                    }
                  } else {
                    FileSaver.saveAs(
                      new Blob([jsonString], {
                        type: 'text/plain;charset=utf-8',
                      }),
                      filename,
                    );
                  }
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
              <HStack width="full" justify="space-between">
                <ChakraLink
                  as={RouterLink}
                  to={PathEnum.terms}
                  onClick={onClose}
                >
                  {t('terms')}
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to={PathEnum.privacy}
                  onClick={onClose}
                >
                  {t('privacy')}
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to={PathEnum.support}
                  onClick={onClose}
                >
                  {t('support')}
                </ChakraLink>
              </HStack>
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
