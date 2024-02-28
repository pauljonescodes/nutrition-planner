import { useEffect, useState } from 'react';
import { addRxPlugin } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import {
  RxCouchDBReplicationState,
  replicateCouchDB,
  getFetchWithCouchDBAuthorization,
} from 'rxdb/plugins/replication-couchdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { useLocalStorage } from 'usehooks-ts';
import { LocalStorageKeysEnum } from '../../utilities/useLocalStorageKey';
import { initRxNPDatabase } from './RxNPDatabaseHelpers';
import { RxNPDatabaseType } from './RxNPDatabaseType';
import { RxNPItemDocument } from './RxNPItemSchema';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

export const useRxNPDatabase = () => {
  const [database, setDatabase] = useState<RxNPDatabaseType | undefined>(
    undefined,
  );
  const [couchDbUrlLocalStorage] = useLocalStorage<string | undefined>(
    LocalStorageKeysEnum.couchdbUrl,
    undefined,
  );
  const [replicationState, setReplicationState] =
    useState<RxCouchDBReplicationState<RxNPItemDocument> | null>(null);

  useEffect(() => {
    async function replicate() {
      if (couchDbUrlLocalStorage != null && database != null) {
        try {
          setReplicationState(
            replicateCouchDB({
              replicationIdentifier: 'nutrition-planner-couchdb-replication',
              collection: database.collections.item,
              url: couchDbUrlLocalStorage,
              live: true,
              push: {},
              pull: {},
              waitForLeadership: false,
              retryTime: 1000,
            }),
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      } else if (replicationState !== null) {
        replicationState.cancel();
      }
    }
    replicate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couchDbUrlLocalStorage, database]);

  useEffect(() => {
    if (!database) {
      addRxPlugin(RxDBDevModePlugin);
      addRxPlugin(RxDBQueryBuilderPlugin);
      addRxPlugin(RxDBJsonDumpPlugin);
      addRxPlugin(RxDBLeaderElectionPlugin);
      // eslint-disable-next-line promise/catch-or-return
      initRxNPDatabase('nutrition-planner-db', getRxStorageDexie()).then(
        setDatabase,
      );
    }
  }, [database]);

  useEffect(() => {
    // replicationState?.received$.subscribe((doc) => console.dir(doc));

    // // emits each document that was send to the remote
    // replicationState?.sent$.subscribe((doc) => console.dir(doc));

    // emits all errors that happen when running the push- & pull-handlers.
    replicationState?.error$.subscribe((error) => console.dir(error));

    // // emits true when the replication was canceled, false when not.
    // replicationState?.canceled$.subscribe((bool) =>
    //   console.dir(bool ? 'cancelled' : 'not cancelled'),
    // );

    // // emits true when a replication cycle is running, false when not.
    // replicationState?.active$.subscribe((active) => {
    //   console.dir(active ? 'active' : 'not active');
    // });

    // replicationState?.remoteEvents$.subscribe((event) => {
    //   console.log(event)
    // });

    if (replicationState) {
      replicationState.awaitInitialReplication();
    }
  }, [replicationState]);

  return { database, replicationState };
};
