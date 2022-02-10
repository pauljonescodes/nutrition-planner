import Dexie, { Table } from "dexie";
import { dexieItemSchema, Item, ItemInterface } from "./model/item";
import {
  dexieItemInItemSchema,
  ItemInItem,
  ItemInItemInterface,
} from "./model/item-in-item";
import {
  addNutritionInfo,
  divideNutritionInfo,
  multiplyNutritionInfo,
  sumNutritionInfo,
} from "./nutrition-info";

export interface ItemQueryParameters {
  limit: number;
  offset: number;
  sortBy?: keyof Item;
  reverse?: boolean;
}

export class Database extends Dexie {
  private static database: Database;

  public static shared(): Database {
    if (!Database.database) {
      Database.database = new Database();
    }

    return Database.database;
  }

  constructor(
    private itemTable?: Table<ItemInterface, string>,
    private itemInItemTable?: Table<ItemInItemInterface, string>
  ) {
    super("MealPlannerDatabase");

    this.version(15).stores({
      itemTable: dexieItemSchema,
      itemInItemTable: dexieItemInItemSchema,
    });

    this.itemTable?.mapToClass(Item);
    this.itemInItemTable?.mapToClass(ItemInItem);
  }

  /* Items CRUD */

  async putItem(item: ItemInterface) {
    return await this.itemTable?.put({
      id: item.id,
      name: item.name,
      priceCents: item.priceCents,
      count: item.count,
      massGrams: item.massGrams,
      energyKilocalorie: item.energyKilocalorie,
      fatGrams: item.fatGrams,
      carbohydrateGrams: item.carbohydrateGrams,
      proteinGrams: item.proteinGrams,
    });
  }

  async saveItem(item: Item) {
    await this.putItem(item);

    const savedItemsInItem = (await this.itemsInItemArray(item)) ?? [];

    const deletions = savedItemsInItem.filter((value1) => {
      return (
        item.itemInItems?.find((value2) => {
          return value2.id === value1.sourceItemId;
        }) === undefined
      );
    });

    const additions =
      item.itemInItems?.filter((value1) => {
        return (
          savedItemsInItem.find((value2) => {
            return value1.id === value2.sourceItemId;
          }) === undefined
        );
      }) ?? [];

    for (const deletion of deletions) {
      await this.deleteItemInItem(deletion);
    }

    for (const addition of additions) {
      await this.putItemInItem(addition);
    }

    return item;
  }

  async getItem(itemId: string) {
    return await this.itemTable?.get(itemId);
  }

  async getItems(keys: string[]) {
    return (await this.itemTable?.bulkGet(keys))?.filter((value) => {
      return value !== undefined;
    }) as Array<ItemInterface>;
  }

  async countOfItems() {
    return (await this.itemTable?.count()) ?? 0;
  }

  async arrayOfItems(parameters: ItemQueryParameters): Promise<Item[]> {
    var collection = this.itemTable
      ?.offset(parameters.offset)
      .limit(parameters.limit);

    const interfaces: Array<ItemInterface> = [];
    if (parameters.sortBy) {
      if (parameters.reverse) {
        collection = collection?.reverse();
      }
      interfaces.push(...((await collection?.sortBy(parameters.sortBy)) ?? []));
    } else {
      interfaces.push(...((await collection?.toArray()) ?? []));
    }

    return await Promise.all(
      interfaces.map((value) => {
        return this.loadItem(value);
      })
    );
  }

  async filteredItems(query: string) {
    return this.itemTable
      ?.filter((obj) => {
        return new RegExp(".*" + query.split("").join(".*") + ".*").test(
          obj.name
        );
      })
      .toArray();
  }

  async deleteItem(itemId: string) {
    await this.itemTable?.delete(itemId);
    await this.itemInItemTable?.where("sourceItemId").equals(itemId).delete();
  }

  itemNutrition(item: Item, perServing: boolean) {
    return addNutritionInfo(
      {
        priceCents: Math.round(item.priceCents / (perServing ? item.count : 1)),
        massGrams: Math.round(item.massGrams / (perServing ? item.count : 1)),
        energyKilocalorie: Math.round(
          item.energyKilocalorie / (perServing ? item.count : 1)
        ),
        fatGrams: Math.round(item.fatGrams / (perServing ? item.count : 1)),
        carbohydrateGrams: Math.round(
          item.carbohydrateGrams / (perServing ? item.count : 1)
        ),
        proteinGrams: Math.round(
          item.proteinGrams / (perServing ? item.count : 1)
        ),
      },
      sumNutritionInfo(
        (item.itemInItems ?? []).map((value) =>
          this.itemInItemNutrition(value, perServing ? item.count : 1)
        )
      )
    );
  }

  async loadItem(itemInterface: ItemInterface): Promise<Item> {
    const item = new Item(itemInterface);
    const itemsInItem = (await this.itemsInItemArray(itemInterface)) ?? [];
    item.itemInItems = await Promise.all(
      itemsInItem?.map((value) => this.loadItemInItem(value))
    );
    return item;
  }

  /* Item in recipe CRUD */

  async putItemInItem(itemInItem: ItemInItemInterface) {
    return await this.itemInItemTable?.put({
      id: itemInItem.id,
      sourceItemId: itemInItem.sourceItemId,
      count: itemInItem.count,
      destinationItemId: itemInItem.destinationItemId,
    });
  }

  async itemsInItemArray(item: ItemInterface) {
    return await this.itemInItemTable
      ?.where({ destinationItemId: item.id })
      .toArray();
  }

  async deleteItemInItem(itemInItem: ItemInItemInterface) {
    await Database.shared().itemInItemTable?.delete(itemInItem.id);
  }

  itemInItemNutrition(itemInItem: ItemInItem, itemServings: number) {
    const sourceItemNutritionPerServing = this.itemNutrition(
      itemInItem.sourceItem!,
      true
    );
    const multipliedByCount = multiplyNutritionInfo(
      sourceItemNutritionPerServing,
      itemInItem.count
    );
    const dividesByServings = divideNutritionInfo(
      multipliedByCount,
      itemServings ?? 1
    );
    return dividesByServings;
  }

  nutritionPerServing(item: Item) {
    return {
      priceCents: item.priceCents / item.count,
      massGrams: item.massGrams / item.count,
      energyKilocalorie: item.energyKilocalorie / item.count,
      fatGrams: item.fatGrams / item.count,
      carbohydrateGrams: item.carbohydrateGrams / item.count,
      proteinGrams: item.proteinGrams / item.count,
    };
  }

  async loadItemInItem(
    itemInItemInterface: ItemInItemInterface
  ): Promise<ItemInItem> {
    const itemInItem = new ItemInItem(itemInItemInterface);
    itemInItem.sourceItem = await this.loadItem(
      (await this.getItem(itemInItem.sourceItemId))!
    );
    return itemInItem;
  }
}
