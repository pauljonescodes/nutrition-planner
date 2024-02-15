import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,

  Input,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import FileSaver from "file-saver";
import { Fragment, useEffect, useState } from "react";
import { useRxCollection, useRxDB } from "rxdb-hooks";
import { useFilePicker } from "use-file-picker";
import { isValidUrl } from "../../utilities/isValidUrl";
import useLocalStorage from "../../utilities/useLocalStorage";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { FIREBASE_PROJECT_ID_LOCAL_STORAGE_KEY, FIREBASE_API_KEY_LOCAL_STORAGE_KEY, FIREBASE_APP_ID_LOCAL_STORAGE_KEY } from "../../constants";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'


type SettingsDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function SettingsDrawer(props: SettingsDrawerProps) {
  const [importLoadingState, setImportLoadingState] = useState(false);
  const [showDeleteDialogState, setShowDeleteDialogState] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  const [firebaseProjectIdLocalStorage, setFirebaseProjectIdLocalStorage] = useLocalStorage<
    string | null
  >(FIREBASE_PROJECT_ID_LOCAL_STORAGE_KEY, null);
  const [firebaseProjectIdStringState, setFirebaseProjectIdStringState] = useState<
    string | null
  >(firebaseProjectIdLocalStorage);

  const [firebaseApiKeyLocalStorage, setFirebaseApiKeyLocalStorage] = useLocalStorage<
    string | null
  >(FIREBASE_API_KEY_LOCAL_STORAGE_KEY, null);
  const [firebaseApiKeyStringState, setFirebaseApiKeyStringState] = useState<
    string | null
  >(firebaseApiKeyLocalStorage);

  const [firebaseAppIdLocalStorage, setFirebaseAppIdLocalStorage] = useLocalStorage<
    string | null
  >(FIREBASE_APP_ID_LOCAL_STORAGE_KEY, null);
  const [firebaseAppIdStringState, setFirebaseAppIdStringState] = useState<
    string | null
  >(firebaseAppIdLocalStorage);

  const database = useRxDB();
  const collection = useRxCollection("item");
  const toast = useToast();

  const subtleTextColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  const {
    filesContent,
    loading: filesLoading,
    openFilePicker,
  } = useFilePicker({
    accept: ".json",
    multiple: false,
  });

  async function importFile() {
    if (filesContent.length > 0) {
      setImportLoadingState(true);
      await collection?.find().remove();
      await database.importJSON(JSON.parse(filesContent[0].content));
      setImportLoadingState(false);
      toast({
        title: "Import successful.",
        status: "success",
      });
    }
  }

  useEffect(() => {
    importFile();
  }, [filesContent]);

  const loading = filesLoading || importLoadingState;

  return (
    <Fragment>
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
          <DrawerHeader>Settings</DrawerHeader>

          <DrawerBody>
            <VStack>
              <Button onClick={toggleColorMode} width={"full"}>
                Toggle {colorMode === "light" ? "Dark" : "Light"} UI
              </Button>
              <Button
                width={"full"}
                disabled={loading}
                leftIcon={<DownloadIcon />}
                onClick={async () => {
                  const json = await database.exportJSON();
                  const blob = new Blob([JSON.stringify(json)], {
                    type: "text/plain;charset=utf-8",
                  });

                  FileSaver.saveAs(
                    blob,
                    `nutrition_export_${new Date().toJSON()}.json`
                  );
                }}
              >
                Export JSON data
              </Button>

              <Button
                width={"full"}
                disabled={loading}
                onClick={() => {
                  openFilePicker();
                }}
                leftIcon={<DownloadIcon transform={"scaleY(-1)"} />}
              >
                Import JSON data
              </Button>
           
              <Card>
  <CardBody>
                <FormControl>
                
                <VStack>
                <FormLabel>Firebase Project ID</FormLabel>
                  <Input
                    value={firebaseProjectIdStringState ?? undefined}
                    onChange={(e) => {
                      setFirebaseProjectIdStringState(e.target.value);
                    }}
                  />
                  <FormLabel>Firebase API Key</FormLabel>
                  <Input
                    value={firebaseApiKeyStringState ?? undefined}
                    onChange={(e) => {
                      setFirebaseApiKeyStringState(e.target.value);
                    }}
                  />
                  <FormLabel>Firebase App ID</FormLabel>
                  <Input
                    value={firebaseAppIdStringState ?? undefined}
                    onChange={(e) => {
                      setFirebaseAppIdStringState(e.target.value);
                    }}
                  />
                  <Button
                    w="30%"
                    onClick={async () => {
                      if (
                        firebaseProjectIdStringState !== null
                      ) {
                        setFirebaseProjectIdLocalStorage(firebaseProjectIdStringState);
                      } else {
                        setFirebaseProjectIdLocalStorage(null);
                      }

                      if (
                        firebaseApiKeyStringState !== null
                      ) {
                        setFirebaseApiKeyLocalStorage(firebaseApiKeyStringState);
                      } else {
                        setFirebaseApiKeyLocalStorage(null);
                      }
                      
                      if (
                        firebaseAppIdStringState !== null
                      ) {
                        setFirebaseAppIdLocalStorage(firebaseAppIdStringState);
                      } else {
                        setFirebaseAppIdLocalStorage(null);
                      }
                    }}
                  >
                    Apply
                  </Button>
                </VStack>

                <FormHelperText>
                  To sync your information with Firebase, create a new project in the Firebase console and enter the project ID, API key, and app ID here.
                </FormHelperText>
              </FormControl>
              </CardBody>
              </Card>

              
              <Button
                width={"full"}
                colorScheme="red"
                disabled={loading}
                leftIcon={<DeleteIcon />}
                onClick={() => {
                  setShowDeleteDialogState(true);
                }}
              >
                Reset database
              </Button>
              <Text color={subtleTextColor} fontSize="sm">
                This permentantly deletes <Text as="em">everything</Text>
              </Text>
              <Text color={subtleTextColor} fontSize="xs">
                {process.env.version}
              </Text>
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
              title: "Reset successful.",
              status: "success",
            });
          }
        }}
      />
    </Fragment>
  );
}
