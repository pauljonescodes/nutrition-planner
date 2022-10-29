import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import {
  ItemCollection,
  itemDocumentMethods,
  itemDocumentSchema,
} from "./item";

export type DatabaseCollections = {
  items: ItemCollection;
};

export type DatabaseType = RxDatabase<DatabaseCollections>;

export async function createDatabase(): Promise<DatabaseType | undefined> {
  var database: DatabaseType | undefined;

  addPouchPlugin(require("pouchdb-adapter-idb"));
  addRxPlugin(RxDBQueryBuilderPlugin);

  try {
    database = await createRxDatabase<DatabaseCollections>({
      name: "rxdatabase",
      storage: getRxStoragePouch("idb", {}),
    });
  } catch (error) {
    console.log(error);
  }

  await database?.addCollections({
    items: {
      schema: itemDocumentSchema,
      methods: itemDocumentMethods,
    },
  });

  return database;
}
