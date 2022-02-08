import { exportDB, importInto } from "dexie-export-import";
import { Box, Button, TextArea } from "grommet";
import { useEffect, useRef, useState } from "react";
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
    <Box fill>
      <Box
        direction="row"
        justify="center"
        align="center"
        gap="small"
        margin="small"
      >
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
        />
      </Box>
      <Box fill>
        <TextArea
          placeholder="type here"
          value={blobText}
          onChange={(event) => {
            setBlobText(event.target.value);
          }}
          spellCheck={false}
          fill
        />
      </Box>
    </Box>
  );
};

export default DataPage;
