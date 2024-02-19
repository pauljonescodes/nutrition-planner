import { createRxDatabase, RxDatabase, RxStorage } from "rxdb";

import {
  RxDBItemCollection,
  rxdbItemDocumentMethods,
  rxdbItemSchema,
} from "./rxdb";

export type RxDBDatabaseCollections = {
  item: RxDBItemCollection;
};

export type RxDBDatabaseType = RxDatabase<RxDBDatabaseCollections>;

export async function initRxDBDatabase(
  name: string,
  storage: RxStorage<any, any>
): Promise<RxDBDatabaseType | undefined> {
  var database: RxDBDatabaseType | undefined;

  try {
    database = await createRxDatabase<RxDBDatabaseCollections>({
      name: name,
      storage: storage,
    });
  } catch (error) {
    console.log(error);
  }

  await database?.addCollections({
    item: {
      schema: rxdbItemSchema,
      methods: rxdbItemDocumentMethods,
    },
  });

  return database;
}
