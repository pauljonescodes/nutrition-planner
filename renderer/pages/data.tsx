import { Box, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Database } from "../data/Database";

const DataPage = () => {
  const [json, setJSON] = useState<string>("");

  async function refreshState() {
    setJSON(JSON.stringify(await Database.shared().export(), null, 4));
  }

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <Box>
      <Textarea
        height={`calc(100vh - 64px)`}
        value={json}
        onChange={(event) => {
          setJSON(event.target.value);
        }}
        spellCheck={false}
      />
    </Box>
  );
};

export default DataPage;

/*
<IconButton
        icon={<LockIcon />}
        aria-label="Save"
        onClick={async () => {
          await Database.shared().delete();
          await Database.shared().open();
          Database.shared().import(JSON.parse(json) as SerialTable[]);
        }}
      />
*/
