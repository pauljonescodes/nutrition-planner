import { createRxDatabase, RxStorage, RxCollection } from 'rxdb';
import {
  RxNPItemDocument,
  rxnpItemDocumentMethods,
  rxnpItemSchema,
} from './RxNPItemSchema';
import { RxNPDatabaseCollections } from './RxNPDatabaseCollections';
import { RxNPDatabaseType } from './RxNPDatabaseType';
import { ItemInterface } from '../interfaces/ItemInterface';
import { dataid } from '../../utilities/dataid';
import { ItemTypeEnum } from '../interfaces/ItemTypeEnum';

export async function initRxNPDatabase(
  name: string,
  storage: RxStorage<any, any>,
): Promise<RxNPDatabaseType | undefined> {
  let database: RxNPDatabaseType | undefined;

  try {
    database = await createRxDatabase<RxNPDatabaseCollections>({
      name,
      storage,
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
  collection?: RxCollection<RxNPItemDocument>,
) {
  let newItem: ItemInterface | null = null;

  if (item.name !== 'log') {
    newItem = {
      id: dataid(),
      date: item.date ? new Date(item.date) : new Date(),
      type: ItemTypeEnum.copy,
      name: item.name,
      priceCents: item.priceCents,
      massGrams: item.massGrams,
      energyKilocalories: item.energyKilocalories,
      fatGrams: item.fatGrams,
      saturatedFatGrams: item.saturatedFatGrams,
      transFatGrams: item.transFatGrams,
      cholesterolMilligrams: item.cholesterolMilligrams,
      sodiumMilligrams: item.sodiumMilligrams,
      carbohydrateGrams: item.carbohydrateGrams,
      fiberGrams: item.fiberGrams,
      sugarGrams: item.sugarGrams,
      proteinGrams: item.proteinGrams,
      count: item.count,
    };
    await collection?.upsert(newItem!);
  }

  if (item.subitems && item.subitems.length > 0) {
    const originalIds = item.subitems.map((value) => value.itemId!) ?? [];
    const findByOriginalIdsMap = await collection
      ?.findByIds(originalIds)
      .exec();
    // eslint-disable-next-line no-restricted-syntax
    for (const [originalSubitemId, originalSubitem] of Array.from(
      findByOriginalIdsMap ?? [],
    )) {
      // eslint-disable-next-line no-await-in-loop
      const newSubitem = await originalSubitem.recursivelyUpsertNewSubitems();
      item.subitems.forEach((value, index) => {
        if (value.itemId === originalSubitemId) {
          item.subitems![index].itemId = newSubitem.id;
          item.subitems![index].item = undefined;
        }
      });
    }
  }

  if (item.subitems?.length === 1 && item.subitems![0].itemId == null) {
    item.subitems![0].itemId = newItem?.id;
  }

  const log: any = {
    id: dataid(),
    date: item.date ?? new Date().toISOString(),
    type: ItemTypeEnum.log,
    subitems: item.subitems,
    name: 'log',
    priceCents: 0,
    massGrams: 0,
    energyKilocalories: 0,
    fatGrams: 0,
    saturatedFatGrams: 0,
    transFatGrams: 0,
    cholesterolMilligrams: 0,
    sodiumMilligrams: 0,
    carbohydrateGrams: 0,
    fiberGrams: 0,
    sugarGrams: 0,
    proteinGrams: 0,
    count: 1,
  } as any;

  await collection?.upsert(log);
}

export async function recursivelyPopulateSubitems(
  item: ItemInterface,
  collection?: RxCollection<RxNPItemDocument>,
): Promise<ItemInterface> {
  const mutableThis = item;

  if (mutableThis.subitems && mutableThis.subitems.length > 0) {
    const ids = mutableThis.subitems.map((value) => value.itemId!) ?? [];
    const findByIdsMap = await collection?.findByIds(ids).exec();
    // eslint-disable-next-line no-restricted-syntax
    for (const [subitemId, subitem] of Array.from(findByIdsMap ?? [])) {
      // eslint-disable-next-line no-await-in-loop
      const populatedSubitem = await subitem.recursivelyPopulateSubitems();
      mutableThis.subitems.forEach((value, index) => {
        if (value.itemId === subitemId) {
          mutableThis.subitems![index].item = populatedSubitem;
        }
      });
    }
  }

  return mutableThis;
}
