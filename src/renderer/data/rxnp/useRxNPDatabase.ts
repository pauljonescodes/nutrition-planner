import { useEffect, useState } from 'react';
import { addRxPlugin } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import {
  RxCouchDBReplicationState,
  replicateCouchDB,
} from 'rxdb/plugins/replication-couchdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { useLocalStorage } from 'usehooks-ts';
import { LocalStorageKeysEnum } from '../../constants';
import { initRxNPDatabase } from './RxNPDatabaseHelpers';
import { RxNPDatabaseType } from './RxNPDatabaseType';
import { RxNPItemDocument } from './RxNPItemSchema';

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
    if (couchDbUrlLocalStorage != null && database != null) {
      try {
        setReplicationState(
          replicateCouchDB({
            replicationIdentifier: 'nutrition-planner-couchdb-replication',
            collection: database.collections.item,
            url: couchDbUrlLocalStorage,
            pull: {},
            push: {},
          }),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    } else if (replicationState !== null) {
      replicationState.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couchDbUrlLocalStorage, database]);

  useEffect(() => {
    if (!database) {
      // addRxPlugin(RxDBDevModePlugin);
      addRxPlugin(RxDBQueryBuilderPlugin);
      addRxPlugin(RxDBJsonDumpPlugin);
      addRxPlugin(RxDBLeaderElectionPlugin);
      // eslint-disable-next-line promise/catch-or-return
      initRxNPDatabase('nutrition-planner-db', getRxStorageDexie()).then(
        setDatabase,
      );
    }
  }, [database]);

  return { database, replicationState };
};
