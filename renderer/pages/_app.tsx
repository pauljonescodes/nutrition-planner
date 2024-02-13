import {
  Box,
  ChakraProvider,
  VStack,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { addRxPlugin } from "rxdb";
import { Provider as RxDbProvider } from "rxdb-hooks";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import "../../styles/react-big-calendar.scss";
import "../../styles/react-datetime.scss";
import { MenuHStack } from "../components/MenuHStack";
import { RxDBDatabaseType, initRxDBDatabase } from "../data/database";
import useLocalStorage from "../utilities/useLocalStorage";
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';

export default function App(props: AppProps) {
  const [database, setDatabase] = useState<RxDBDatabaseType | undefined>(
    undefined
  );

  // const [replicationState, setReplicationState] =
  //   useState<any | null>(null);

  // const [databaseUrlLocalStorage] = useLocalStorage<string | null>(
  //   "nutrition-planner-database-url",
  //   null
  // );

  // useEffect(() => {
  //   if (databaseUrlLocalStorage !== null && database?.collections.item != undefined) {
  //     console.log(databaseUrlLocalStorage);
  //     const replicated = replicateCouchDB(
  //       {
  //         replicationIdentifier: 'np-couchdb-replication',
  //         collection: database?.collections.item,
  //         url: databaseUrlLocalStorage,
  //         live: true,
  //         fetch: (input, init) =>
  //         {
  //           console.log(input);
  //         }
  //       }
  //     );
  //     replicated.reSync();
  //     console.log(replicated.isStopped());
  //     setReplicationState(replicated);
  //   } else if (replicationState !== null) {
  //     replicationState.cancel();
  //   }
  // }, [databaseUrlLocalStorage, database]);

  useEffect(() => {
    addRxPlugin(RxDBQueryBuilderPlugin);
    addRxPlugin(RxDBJsonDumpPlugin);
    addRxPlugin(RxDBDevModePlugin);
    addRxPlugin(RxDBLeaderElectionPlugin);
    initRxDBDatabase("nutrition-planner-db", getRxStorageDexie()).then(
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
    <RxDbProvider db={database}>
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
