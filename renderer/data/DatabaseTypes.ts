import {
  createRxDatabase,
  RxCollection,
  RxDatabase,
  RxDocument,
  RxJsonSchema,
} from "rxdb";

import { addRxPlugin } from "rxdb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

import { ItemInferredType } from "./model/Item";

type ItemDocumentMethods = {
  scream: (v: string) => string;
};

export type ItemDocument = RxDocument<ItemInferredType, ItemDocumentMethods>;

export type ItemCollection = RxCollection<
  ItemInferredType,
  ItemDocumentMethods
>;

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
      storage: getRxStoragePouch("idb", {
        /**
         * other pouchdb specific options
         * @link https://pouchdb.com/api.html#create_database
         */
      }),
    });
  } catch (error) {
    console.log(error);
  }

  const itemDocumentSchema: RxJsonSchema<ItemDocument> = {
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      type: {
        type: "string",
      },
      name: {
        type: "string",
      },
      count: {
        type: "number",
      },
      priceCents: {
        type: "number",
      },
      massGrams: {
        type: "number",
      },
      energyKilocalorie: {
        type: "number",
      },
      fatGrams: {
        type: "number",
      },
      carbohydrateGrams: {
        type: "number",
      },
      proteinGrams: {
        type: "number",
      },
    } as any,
    required: [],
  };

  const itemDocumentMethods: ItemDocumentMethods = {
    scream: function (this: ItemDocument) {
      return this.id + " screams: ";
    },
  };

  await database?.addCollections({
    items: {
      schema: itemDocumentSchema,
      methods: itemDocumentMethods,
    },
  });

  return database;
}
