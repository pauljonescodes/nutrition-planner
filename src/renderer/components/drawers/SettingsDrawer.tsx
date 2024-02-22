import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Button,
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
  Link,
  Select,
  VStack,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import FileSaver from 'file-saver';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRxCollection, useRxDB } from 'rxdb-hooks';
import { useFilePicker } from 'use-file-picker';
import { useLocalStorage } from 'usehooks-ts';
import { LocalStorageKeysEnum } from '../../constants';
import currencies from '../../i18n/currencies';
import { languageNames, languages } from '../../i18n/languages';
import { isValidUrl } from '../../utilities/isValidUrl';
import { DeleteAlertDialog } from '../DeleteAlertDialog';
import { PathEnum } from '../../paths';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function SettingsDrawer(props: SettingsDrawerProps) {
  const { isOpen, onClose } = props;
  const { t } = useTranslation();
  const [importLoadingState, setImportLoadingState] = useState(false);
  const [showDeleteDialogState, setShowDeleteDialogState] = useState(false);
  const { toggleColorMode } = useColorMode();

  const [couchDbUrlLocalStorage, setCouchDbUrlLocalStorage] = useLocalStorage<
    string | undefined
  >(LocalStorageKeysEnum.couchdbUrl, undefined);
  const [couchDbStringState, setCouchDbStringState] = useState<string | null>(
    couchDbUrlLocalStorage,
  );

  const [languageLocalStorage, setLanguageLocalStorage] = useLocalStorage(
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
                        setCouchDbUrlLocalStorage(null);
                      }
                    }}
                  >
                    {t('submit')}
                  </Button>
                </HStack>
              </FormControl>
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
              <Link href={PathEnum.terms}>Terms</Link>
              <Link href={PathEnum.privacy}>Privacy</Link>
              <Link href={PathEnum.support}>Support</Link>
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
