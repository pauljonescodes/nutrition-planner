import {
  Box,
  ChakraProvider,
  extendTheme,
  VStack,
  type ThemeConfig,
} from "@chakra-ui/react";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { addRxPlugin, RxCouchDBReplicationState } from "rxdb";
import { Provider as RxDbProvider } from "rxdb-hooks";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import "../../styles/react-big-calendar.scss";
import "../../styles/react-datetime.scss";
import { MenuHStack } from "../components/MenuHStack";
import { initRxDBDatabase, RxDBDatabaseType } from "../data/database";
import useLocalStorage from "../utilities/useLocalStorage";

export default function App(props: AppProps) {
  const [database, setDatabase] = useState<RxDBDatabaseType | undefined>(
    undefined
  );

  const [replicationState, setReplicationState] =
    useState<RxCouchDBReplicationState | null>(null);

  const [databaseUrlLocalStorage] = useLocalStorage<string | null>(
    "nutrition-planner-database-url",
    null
  );

  useEffect(() => {
    if (databaseUrlLocalStorage !== null) {
      setReplicationState(
        database?.collections.item.syncCouchDB({
          remote: databaseUrlLocalStorage,
        }) ?? null
      );
    } else if (replicationState !== null) {
      replicationState.cancel();
    }
  }, [databaseUrlLocalStorage, database]);

  useEffect(() => {
    addPouchPlugin(require("pouchdb-adapter-idb"));
    addRxPlugin(RxDBQueryBuilderPlugin);
    addRxPlugin(RxDBJsonDumpPlugin);
    addRxPlugin(RxDBDevModePlugin);
    addRxPlugin(RxDBReplicationCouchDBPlugin);
    addRxPlugin(RxDBLeaderElectionPlugin);
    addPouchPlugin(require("pouchdb-adapter-http"));
    initRxDBDatabase("nutrition-planner-db", getRxStoragePouch("idb", {})).then(
      setDatabase
    );
  }, []);

  const config: ThemeConfig = {
    useSystemColorMode: true,
    initialColorMode: "system",
  };

  const breakpoints = {
    xs: "20em", // 320
    sm: "30em", // 480
    md: "48em", // 768
    lg: "62em", // 992
    xl: "80em", // 1280
    "2xl": "96em", // 1536
  };

  const theme = extendTheme({
    breakpoints,
    config,
    fonts: {
      body: `-apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen-Sans, Ubuntu, Cantarell,
      "Helvetica Neue", sans-serif`,
    },
  });

  return (
    <RxDbProvider db={database} idAttribute="id">
      <ChakraProvider theme={theme}>
        <VStack spacing={0} align="stretch" minH="100vh">
          <MenuHStack />
          <Box pt="64px" minH="100vh">
            <props.Component {...props.pageProps} />
          </Box>
        </VStack>
      </ChakraProvider>
    </RxDbProvider>
  );
}
