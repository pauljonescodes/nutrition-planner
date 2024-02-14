
import { addRxPlugin } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import {
  getRxStorageMemory
} from 'rxdb/plugins/storage-memory';
import { initRxDBDatabase } from "./database";
import { dataid } from "./dataid";
import {
  populatedItemServingNutrition as populatedItemNutrition,
  populatedItemServingPriceCents as populatedItemPriceCents,
} from "./interfaces";
import { ItemTypeEnum } from "./item-type-enum";

addRxPlugin(RxDBDevModePlugin);

test("database to init", async () => {
  const database = await initRxDBDatabase(
    "nutrition-planner-testdb",
    getRxStorageMemory()
  );
  expect(database).toBeTruthy();

  const itemCollection = database?.collections.item;

  const item01Id = dataid();
  await database?.collections.item.upsert({
    id: item01Id,
    date: new Date().toISOString(),
    type: ItemTypeEnum.item,
    name: "Test item 01",
    priceCents: 100, // 10
    count: 10,
    massGrams: 10,
    energyKilocalories: 10,
    fatGrams: 10,
    saturatedFatGrams: 10,
    transFatGrams: 10,
    cholesterolMilligrams: 10,
    sodiumMilligrams: 10,
    carbohydrateGrams: 10,
    fiberGrams: 10,
    sugarGrams: 10,
    proteinGrams: 10,
    subitems: [],
  });

  const item02Id = dataid();
  await database?.collections.item.upsert({
    id: item02Id,
    date: new Date().toISOString(),
    type: ItemTypeEnum.item,
    name: "Test item 02",
    priceCents: 200, // 20
    count: 10,
    massGrams: 20,
    energyKilocalories: 20,
    fatGrams: 20,
    saturatedFatGrams: 20,
    transFatGrams: 20,
    cholesterolMilligrams: 20,
    sodiumMilligrams: 20,
    carbohydrateGrams: 20,
    fiberGrams: 20,
    sugarGrams: 20,
    proteinGrams: 20,
    subitems: [],
  });

  const group01IdVal40 = dataid();
  await database?.collections.item.upsert({
    id: group01IdVal40,
    date: new Date().toISOString(),
    type: ItemTypeEnum.group,
    name: "Test group 01",
    count: 2, // 0.40
    subitems: [
      { itemId: item01Id, count: 2 }, // 0.20
      { itemId: item02Id, count: 3 }, // 0.60
    ],
  });

  const group02IdVal20 = dataid();
  await database?.collections.item.upsert({
    id: group02IdVal20,
    date: new Date().toISOString(),
    type: ItemTypeEnum.group,
    name: "Test group 02",
    count: 7, // 0.20 2
    subitems: [
      { itemId: item01Id, count: 4 }, // 0.40 4
      { itemId: item02Id, count: 5 }, // 1.00 10
    ],
  });

  const plan01Id = dataid();
  await database?.collections.item.upsert({
    id: plan01Id,
    date: new Date().toISOString(),
    type: ItemTypeEnum.plan,
    name: "Test place 01",
    count: 2, // 70
    subitems: [
      { itemId: group01IdVal40, count: 2 }, // 0.80 80
      { itemId: group02IdVal20, count: 3 }, // 0.60 60
    ],
  });

  const foundItems01 = (await itemCollection!.findOne(plan01Id).exec())!;
  const populatedItem = await foundItems01.recursivelyPopulateSubitems();
  const servingNutrtion = populatedItemNutrition(populatedItem);
  const servingPriceCents = populatedItemPriceCents(populatedItem);

  expect(servingNutrtion.massGrams).toBe(70);
  expect(servingPriceCents).toBe(70);

  const destroyed = await database?.destroy();
  expect(destroyed).toBe(true);
});
