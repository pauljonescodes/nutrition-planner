import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxCouchDBReplicationState,
  RxDatabase,
} from "rxdb";
import { RxDatabaseBaseExtended } from "rxdb-hooks/dist/plugins";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";

import {
  ItemCollection,
  ItemDocument,
  itemDocumentMethods,
  itemDocumentSchema,
} from "./item";

export type DatabaseCollections = {
  item: ItemCollection;
};

export type DatabaseType = RxDatabase<DatabaseCollections>;

export async function createDatabase(): Promise<DatabaseType | undefined> {
  var database: DatabaseType | undefined;

  addPouchPlugin(require("pouchdb-adapter-idb"));
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBJsonDumpPlugin);
  addRxPlugin(RxDBDevModePlugin);
  addRxPlugin(RxDBReplicationCouchDBPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);
  addPouchPlugin(require("pouchdb-adapter-http"));

  try {
    database = await createRxDatabase<DatabaseCollections>({
      name: "nutrition-rxdatabase",
      storage: getRxStoragePouch("idb", {}),
    });
  } catch (error) {
    console.log(error);
  }

  await database?.addCollections({
    item: {
      schema: itemDocumentSchema,
      methods: itemDocumentMethods,
    },
  });

  return database;
}

export function syncCollection(
  remote: string,
  collection: RxCollection
): RxCouchDBReplicationState {
  return collection.syncCouchDB({
    remote,
    waitForLeadership: true,
    direction: {
      pull: true,
      push: true,
    },
    options: {
      live: true,
      retry: true,
    },
  });
}

export async function addCollections(
  database?: RxDatabaseBaseExtended
): Promise<{ item: RxCollection<ItemDocument> } | undefined> {
  return await database?.addCollections({
    item: {
      schema: itemDocumentSchema,
      methods: itemDocumentMethods,
    },
  });
}

export async function removeCollections(
  collection?: RxCollection | null
): Promise<any> {
  return await collection?.remove();
}
