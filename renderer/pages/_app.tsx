import {
  Box,
  ChakraProvider,
  VStack,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { addRxPlugin, } from "rxdb";
import { Provider as RxDbProvider, useRxCollection } from "rxdb-hooks";
import { RxFirestoreReplicationState, replicateFirestore } from "rxdb/plugins/replication-firestore";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import "../../styles/react-big-calendar.scss";
import "../../styles/react-datetime.scss";
import { MenuHStack } from "../components/MenuHStack";
import { RxDBDatabaseType, initRxDBDatabase } from "../data/database";
import { useLocalStorage } from "usehooks-ts";
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore, collection, Firestore } from 'firebase/firestore';
import { FIREBASE_API_KEY_LOCAL_STORAGE_KEY, FIREBASE_APP_ID_LOCAL_STORAGE_KEY, FIREBASE_PROJECT_ID_LOCAL_STORAGE_KEY, FIREBASE_COLLECTION_NAME, FIREBASE_REPLICATION_IDENTIFIER } from "../constants";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

export default function App(props: AppProps) {
  const [database, setDatabase] = useState<RxDBDatabaseType | undefined>(
    undefined
  );

  const [firebaseAppState, setFirebaseAppState] =
    useState<FirebaseApp | null>(null);
  const [firestoreState, setFirestoreState] =
    useState<Firestore | null>(null);
  const [replicationState, setReplicationState] = useState<RxFirestoreReplicationState<any> | null>(null);

  const [firebaseProjectId] = useLocalStorage<string | null>(
    FIREBASE_PROJECT_ID_LOCAL_STORAGE_KEY,
    null
  );
  const [firebaseApiKey] = useLocalStorage<string | null>(
    FIREBASE_API_KEY_LOCAL_STORAGE_KEY,
    null
  );
  const [firebaseAppId] = useLocalStorage<string | null>(
    FIREBASE_APP_ID_LOCAL_STORAGE_KEY,
    null
  );

  useEffect(() => {
    async function initializeFirebase() {
      if (firebaseProjectId !== null && firebaseAppId !== null && firebaseApiKey !== null && database != undefined && !replicationState) {
        const firebaseApp = initializeApp({
          apiKey: firebaseApiKey,
          authDomain: `${firebaseProjectId}.firebaseapp.com`,
          projectId: firebaseProjectId,
          storageBucket: `${firebaseProjectId}.appspot.com`,
          messagingSenderId: "399115775795",
          appId: firebaseAppId
        });
        setFirebaseAppState(firebaseApp);
        const firestore = getFirestore(firebaseApp);
        setFirestoreState(firestore);
        const firebaseCollection = collection(firestore, FIREBASE_COLLECTION_NAME);

        const replicationState = replicateFirestore(
          {
            collection: database.item,
            firestore: {
              projectId: firebaseProjectId,
              database: firestore,
              collection: firebaseCollection
            },
            pull: {},
            push: {
              filter: (doc) => {
                return true;
              }
            },
            live: true,
            replicationIdentifier: FIREBASE_REPLICATION_IDENTIFIER,
            serverTimestampField: "serverTimestamp",
          });
        setReplicationState(replicationState);
        replicationState.awaitInitialReplication();
        replicationState.awaitInSync();
        replicationState.reSync();
      }
    }

    initializeFirebase();
  }, [firebaseProjectId, firebaseAppId, firebaseApiKey, database, replicationState]);

  useEffect(() => {
    if (!database) {
      addRxPlugin(RxDBQueryBuilderPlugin);
      addRxPlugin(RxDBJsonDumpPlugin);
      //addRxPlugin(RxDBDevModePlugin);
      addRxPlugin(RxDBLeaderElectionPlugin);
      initRxDBDatabase("nutrition-planner-db", getRxStorageDexie()).then(
        setDatabase
      );
    }

  }, [database]);

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
