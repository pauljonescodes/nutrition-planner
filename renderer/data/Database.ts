import Dexie, { Table } from "dexie";
import { dexieItemSchema, Item, ItemInterface } from "./model/Item";
import {
  dexieItemInItemSchema,
  ItemInItem,
  ItemInItemInterface,
} from "./model/ItemInItem";
import { ItemType } from "./model/ItemType";
import {
  addNutritionInfo,
  divideNutritionInfo,
  multiplyNutritionInfo,
  nutritionInfo,
  NutritionInfo,
  sumNutritionInfo,
} from "./NutritionInfo";

export interface ItemQueryParameters {
  type: ItemType;
  limit: number;
  offset: number;
  sortBy?: keyof Item;
  reverse?: boolean;
}

export interface SerialTable {
  table: string;
  rows: any[];
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

    this.version(16).stores({
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
      type: item.type,
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

  async countOfItems(type: ItemType) {
    return (await this.itemTable?.where({ type: type }).count()) ?? 0;
  }

  async arrayOfItems(parameters: ItemQueryParameters): Promise<Item[]> {
    var collection = this.itemTable
      ?.where({ type: parameters.type })
      ?.offset(parameters.offset)
      .limit(parameters.limit);

    const interfaces: Array<ItemInterface> = [];
    if (parameters.sortBy) {
      if (parameters.reverse) {
        collection = collection?.reverse();
      }
      const items = (await collection?.sortBy(parameters.sortBy)) ?? [];
      interfaces.push(...items);
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
    await this.itemInItemTable
      ?.where("destinationItemId")
      .equals(itemId)
      .delete();
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

  private async itemsInItemArray(item: ItemInterface) {
    return await this.itemInItemTable
      ?.where({ destinationItemId: item.id })
      .toArray();
  }

  async deleteItemInItem(itemInItem: ItemInItemInterface) {
    await Database.shared().itemInItemTable?.delete(itemInItem.id);
  }

  private async loadItemInItem(
    itemInItemInterface: ItemInItemInterface
  ): Promise<ItemInItem> {
    const itemInItem = new ItemInItem(itemInItemInterface);
    itemInItem.sourceItem = await this.loadItem(
      (await this.itemTable?.get(itemInItem.sourceItemId))!
    );
    return itemInItem;
  }

  /* Nutrition */

  itemNutrition(item: Item, perServing: boolean = false): NutritionInfo {
    if (item.count === undefined) {
      return nutritionInfo();
    }

    const base = multiplyNutritionInfo(item, perServing ? 1 : item.count);
    const sub = divideNutritionInfo(
      sumNutritionInfo(
        (item.itemInItems ?? []).map((value) =>
          this.totalItemInItemNutrition(value)
        )
      ),
      perServing ? item.count : 1
    );
    return addNutritionInfo(base, sub);
  }

  totalItemInItemNutrition(itemInItem: ItemInItem): NutritionInfo {
    const sourceItemNutritionPerServing = this.itemNutrition(
      itemInItem.sourceItem!,
      true
    );

    return multiplyNutritionInfo(
      sourceItemNutritionPerServing,
      itemInItem.count
    );
  }

  /* Price */

  formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  formattedItemPrice(item: Item, perServing: boolean = false): string {
    return this.formatter.format(this.itemPrice(item, perServing) / 100);
  }

  itemPrice(item: Item, perServing: boolean = false): number {
    if (item.count === undefined) {
      return 0;
    }

    return (
      (Number(item.priceCents) +
        Number(
          (item.itemInItems ?? []).reduce(
            (previousValue, currentValue) =>
              previousValue + this.totalItemInItemPrice(currentValue),
            0
          )
        )) /
      (perServing ? Number(item.count) : 1)
    );
  }

  formattedTotalItemInItemPrice(itemInItem: ItemInItem): string {
    return this.formatter.format(this.totalItemInItemPrice(itemInItem) / 100);
  }

  totalItemInItemPrice(itemInItem: ItemInItem): number {
    const sourceItemNutritionPerServing = Number(
      this.itemPrice(itemInItem.sourceItem!, true)
    );

    return sourceItemNutritionPerServing * Number(itemInItem.count);
  }

  /* Import/export */

  async export(): Promise<SerialTable[]> {
    return await this.transaction("r", this.tables, async () => {
      return await Promise.all(
        this.tables.map((table) =>
          table.toArray().then((rows) => ({ table: table.name, rows: rows }))
        )
      );
    });
  }

  async import(data: SerialTable[]) {
    return await this.transaction("rw", this.tables, async () => {
      return await Promise.all(
        data.map((t: SerialTable) =>
          this.table(t.table)
            .clear()
            .then(() => this.table(t.table).bulkAdd(t.rows))
        )
      );
    });
  }
}
