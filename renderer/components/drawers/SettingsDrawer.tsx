import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
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

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose(): void;
};

export function SettingsDrawer(props: SettingsDrawerProps) {
  const [importLoadingState, setImportLoadingState] = useState(false);
  const [showDeleteDialogState, setShowDeleteDialogState] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const [databaseUrlLocalStorage, setDatabaseUrlLocalStorage] = useLocalStorage<
    string | null
  >("nutrition-planner-database-url", null);
  const [databaseUrlStringState, setDatabaseUrlStringState] = useState<
    string | null
  >(databaseUrlLocalStorage);

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
              <FormControl>
                <FormLabel>Database URL</FormLabel>
                <HStack>
                  <Input
                    value={databaseUrlStringState ?? undefined}
                    onChange={(e) => {
                      setDatabaseUrlStringState(e.target.value);
                    }}
                  />
                  <Button
                    w="30%"
                    onClick={async () => {
                      if (
                        databaseUrlStringState !== null &&
                        collection !== null &&
                        isValidUrl(databaseUrlStringState ?? undefined)
                      ) {
                        setDatabaseUrlLocalStorage(databaseUrlStringState);
                        // collection.syncCouchDB({
                        //   remote: databaseUrlStringState,
                        // });
                      } else {
                        setDatabaseUrlLocalStorage(null);
                      }
                    }}
                  >
                    Apply
                  </Button>
                </HStack>

                <FormHelperText>
                  To sync your data, paste a URL pointing to a CouchDB database
                  above.
                </FormHelperText>
              </FormControl>

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
