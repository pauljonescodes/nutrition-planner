import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

import {
  ItemCollection,
  itemDocumentMethods,
  itemDocumentSchema,
} from "./item";
import {
  SubitemCollection,
  subitemDocumentMethods,
  subitemDocumentSchema,
} from "./subitem";

export type DatabaseCollections = {
  item: ItemCollection;
  subitem: SubitemCollection;
};

export type DatabaseType = RxDatabase<DatabaseCollections>;

const databaseName = "nutrition-rxdatabase";

export async function createDatabase(): Promise<DatabaseType | undefined> {
  var database: DatabaseType | undefined;

  addPouchPlugin(require("pouchdb-adapter-idb"));
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBJsonDumpPlugin);
  addRxPlugin(RxDBDevModePlugin);

  try {
    database = await createRxDatabase<DatabaseCollections>({
      name: databaseName,
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
    subitem: {
      schema: subitemDocumentSchema,
      methods: subitemDocumentMethods,
    },
  });

  return database;
}
