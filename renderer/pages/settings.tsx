import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import * as FileSaver from "file-saver";
import { Fragment, useEffect, useState } from "react";
import { useRxCollection, useRxDB } from "rxdb-hooks";
import { useFilePicker } from "use-file-picker";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { rxdbItemDocumentMethods, rxdbItemSchema } from "../data/rxdb";

const SettingsPage = () => {
  const database = useRxDB();
  const itemCollection = useRxCollection("item");
  const [openFileSelector, { filesContent, loading: filesLoading }] =
    useFilePicker({
      accept: ".json",
      multiple: false,
    });
  const [importLoading, setImportLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const toast = useToast();
  const textColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  async function removeCollections() {
    await itemCollection?.remove();
    await database?.addCollections({
      item: {
        schema: rxdbItemSchema,
        methods: rxdbItemDocumentMethods,
      },
    });
  }

  async function importFile() {
    if (filesContent.length > 0) {
      setImportLoading(true);
      await removeCollections();
      await database.importJSON(JSON.parse(filesContent[0].content));
      setImportLoading(false);
      toast({
        title: "Import successful.",
        status: "success",
      });
    }
  }

  useEffect(() => {
    importFile();
  }, [filesContent]);

  const loading = filesLoading || importLoading;

  return (
    <Fragment>
      <Container p={4}>
        <VStack>
          <Button
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
            Export
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              openFileSelector();
            }}
            leftIcon={<DownloadIcon transform={"scaleY(-1)"} />}
          >
            Import
          </Button>
          <Button
            colorScheme="red"
            disabled={loading}
            leftIcon={<DeleteIcon />}
            onClick={() => {
              setShowDeleteDialog(true);
            }}
          >
            Reset
          </Button>
          <Text color={textColor} fontSize="xs">
            {process.env.version}
          </Text>
        </VStack>
      </Container>
      <DeleteAlertDialog
        isOpen={showDeleteDialog}
        onResult={async (result) => {
          setShowDeleteDialog(false);
          if (result) {
            await removeCollections();
            toast({
              title: "Reset successful.",
              status: "success",
            });
          }
        }}
      />
    </Fragment>
  );
};

export default SettingsPage;
