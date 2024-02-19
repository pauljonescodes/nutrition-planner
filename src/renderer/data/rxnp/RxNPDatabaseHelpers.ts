import { createRxDatabase, RxStorage, RxCollection } from "rxdb";
import {
  RxNPItemDocument,
  rxnpItemDocumentMethods,
  rxnpItemSchema,
} from "./RxNPItemSchema";
import { RxNPDatabaseCollections } from "./RxNPDatabaseCollections";
import { RxNPDatabaseType } from "./RxNPDatabaseType";
import { ItemInterface } from "../interfaces/ItemInterface";
import { dataid } from "../../utilities/dataid";
import { ItemTypeEnum } from "../interfaces/ItemTypeEnum";

export async function initRxNPDatabase(
  name: string,
  storage: RxStorage<any, any>
): Promise<RxNPDatabaseType | undefined> {
  var database: RxNPDatabaseType | undefined;

  try {
    database = await createRxDatabase<RxNPDatabaseCollections>({
      name: name,
      storage: storage,
    });
  } catch (error) {
    console.log(error);
  }

  await database?.addCollections({
    item: {
      schema: rxnpItemSchema,
      methods: rxnpItemDocumentMethods,
    },
  });

  return database;
}

export async function upsertLogInterface(
  item: ItemInterface,
  collection?: RxCollection<RxNPItemDocument>
) {
  if (item.subitems && item.subitems.length > 0) {
    const originalIds = item.subitems.map((value) => value.itemId!) ?? [];
    const findByOriginalIdsMap = await collection?.findByIds(originalIds).exec();
    for (const [originalSubitemId, originalSubitem] of Array.from(
      findByOriginalIdsMap ?? []
    )) {
      const newSubitem = await originalSubitem.recursivelyUpsertNewSubitems();
      item.subitems.forEach(function (value, index) {
        if (value.itemId == originalSubitemId) {
          item.subitems![index].itemId = newSubitem.id;
          item.subitems![index].item = undefined;
        }
      });
    }
  }

  const log: any = {
    id: dataid(),
    date: item.date ?? new Date().toISOString(),
    type: ItemTypeEnum.log,
    subitems: item.subitems,
  } as any;

  await collection?.upsert(log);
}

export async function recursivelyPopulateSubitems(
  item: ItemInterface,
  collection?: RxCollection<RxNPItemDocument>
): Promise<ItemInterface> {
  const mutableThis = item;

  if (mutableThis.subitems && mutableThis.subitems.length > 0) {
    const ids = mutableThis.subitems.map((value) => value.itemId!) ?? [];
    const findByIdsMap = await collection?.findByIds(ids).exec();
    for (const [subitemId, subitem] of Array.from(findByIdsMap ?? [])) {
      const populatedSubitem = await subitem.recursivelyPopulateSubitems();
      mutableThis.subitems.forEach(function (value, index) {
        if (value.itemId == subitemId) {
          mutableThis.subitems![index].item = populatedSubitem;
        }
      });
    }
  }

  return mutableThis;
}
