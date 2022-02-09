import { AddIcon } from "@chakra-ui/icons";
import { Box, Center, Heading, HStack, IconButton } from "@chakra-ui/react";
import { exportDB } from "dexie-export-import";
import { useEffect, useRef, useState } from "react";
import { MainMenu } from "../components/main-menu";
import { Database } from "../data/database";

const DataPage = () => {
  const [blobText, setBlobText] = useState<string>("");
  const [showImportedModal, setShowApplyModal] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const copyTooltipTarget = useRef(null);

  async function refreshState() {
    const blob = await exportDB(Database.shared());
    const blobText = await blob.text();
    setBlobText(JSON.stringify(JSON.parse(blobText), null, 4));
  }

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <Box>
      <HStack p="4">
        <Box>
          <MainMenu />
        </Box>
        <Box flex="1">
          <Center>
            <Heading size="md">Data</Heading>
          </Center>
        </Box>
        <Box>
          <IconButton onClick={() => {}} icon={<AddIcon />} aria-label="Add" />
        </Box>
      </HStack>
    </Box>
  );
  {
    /*<Fragment>
       <Button
          fill="horizontal"
          label="Copy"
          onClick={() => {
            navigator.clipboard.writeText(blobText);
            setShowCopiedTooltip(true);
            setTimeout(function () {
              setShowCopiedTooltip(false);
            }, 1000);
          }}
        />
        <Button
          fill="horizontal"
          label="Apply"
          onClick={async () => {
            await Database.shared().delete();
            await Database.shared().open();
            importInto(Database.shared(), new Blob([blobText]));
          }}
        /> */
  }

  {
    /* <TextArea
          placeholder="type here"
          value={blobText}
          onChange={(event) => {
            setBlobText(event.target.value);
          }}
          spellCheck={false}
          fill
        /> 
    </Fragment>*/
  }
};

export default DataPage;
