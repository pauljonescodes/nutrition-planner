import { ItemInferredType } from "./model/Item";
import { ItemInItemInferredType } from "./model/ItemInItem";
import { ItemType } from "./model/ItemType";
import { nutritionInfo, NutritionInfo } from "./NutritionInfo";

export interface ItemQueryParameters {
  name?: string;
  type: ItemType;
  limit: number;
  page: number;
  sortBy?: keyof ItemInferredType;
  reverse?: boolean;
}

export class Database {
  private static database: Database;

  public static shared(): Database {
    if (!Database.database) {
      Database.database = new Database();
    }

    return Database.database;
  }

  /* Items CRUD */

  async putItem(item: ItemInferredType) {
    // return await this.itemTable?.put({
    //   id: item.id,
    //   type: item.type,
    //   name: item.name,
    //   priceCents: item.priceCents,
    //   count: item.count,
    //   massGrams: item.massGrams,
    //   energyKilocalorie: item.energyKilocalorie,
    //   fatGrams: item.fatGrams,
    //   carbohydrateGrams: item.carbohydrateGrams,
    //   proteinGrams: item.proteinGrams,
    // });
  }

  async saveItem(item: ItemInferredType) {
    // await this.putItem(item);
    // const savedItemsInItem = (await this.itemsInItemArray(item)) ?? [];
    // const deletions = savedItemsInItem.filter((value1) => {
    //   return (
    //     item.itemInItems?.find((value2) => {
    //       return value2.id === value1.sourceItemId;
    //     }) === undefined
    //   );
    // });
    // const additions =
    //   item.itemInItems?.filter((value1) => {
    //     return (
    //       savedItemsInItem.find((value2) => {
    //         return value1.id === value2.sourceItemId;
    //       }) === undefined
    //     );
    //   }) ?? [];
    // for (const deletion of deletions) {
    //   await this.deleteItemInItem(deletion);
    // }
    // for (const addition of additions) {
    //   await this.putItemInItem(addition);
    // }
    // return item;
  }

  async countOfItems(parameters: ItemQueryParameters) {
    // var collection = this.itemTable?.where({ type: parameters.type });
    // if (parameters.name) {
    //   collection = collection?.filter((obj) => {
    //     return new RegExp(
    //       ".*" + parameters.name?.toLowerCase().split("").join(".*") + ".*"
    //     ).test(obj.name.toLowerCase());
    //   });
    // }
    // return (await collection?.count()) ?? 0;
  }

  async arrayOfItems(parameters: ItemQueryParameters) {
    // var collection = this.itemTable
    //   ?.where({ type: parameters.type })
    //   .offset(parameters.page * parameters.limit)
    //   .limit(parameters.limit);
    // if (parameters.name) {
    //   collection = collection?.filter((obj) => {
    //     return new RegExp(
    //       ".*" + parameters.name?.toLowerCase().split("").join(".*") + ".*"
    //     ).test(obj.name.toLowerCase());
    //   });
    // }
    // const interfaces: Array<ItemInferredType> = [];
    // if (parameters.sortBy) {
    //   if (parameters.reverse) {
    //     collection = collection?.reverse();
    //   }
    //   const items = (await collection?.sortBy(parameters.sortBy)) ?? [];
    //   interfaces.push(...items);
    // } else {
    //   interfaces.push(...((await collection?.toArray()) ?? []));
    // }
    // return await Promise.all(
    //   interfaces.map((value) => {
    //     return this.loadItem(value);
    //   })
    // );
  }

  async filteredItems(query: string) {
    // return this.itemTable
    //   ?.filter((obj) => {
    //     return new RegExp(
    //       ".*" + query.toLowerCase().split("").join(".*") + ".*"
    //     ).test(obj.name.toLowerCase());
    //   })
    //   .toArray();
  }

  async deleteItem(itemId: string) {
    // const item = await this.itemTable?.get(itemId);
    // if (item !== undefined) {
    //   await this.itemTable?.delete(itemId);
    //   if (item.type === "ingredient") {
    //     await this.itemInItemTable
    //       ?.where("sourceItemId")
    //       .equals(itemId)
    //       .delete();
    //   } else {
    //     await this.itemInItemTable
    //       ?.where("destinationItemId")
    //       .equals(itemId)
    //       .delete();
    //   }
    // }
  }

  async loadItem(itemInterface: ItemInferredType) {
    // const item = new Item(itemInterface);
    // const itemsInItem = (await this.itemsInItemArray(itemInterface)) ?? [];
    // item.itemInItems = await Promise.all(
    //   itemsInItem?.map((value) => this.loadItemInItem(value))
    // );
    // return item;
  }

  /* Item in recipe CRUD */

  async putItemInItem(itemInItem: ItemInItemInferredType) {
    // return await this.itemInItemTable?.put({
    //   id: itemInItem.id,
    //   sourceItemId: itemInItem.sourceItemId,
    //   count: itemInItem.count,
    //   destinationItemId: itemInItem.destinationItemId,
    // });
  }

  private async itemsInItemArray(item: ItemInferredType) {
    // return await this.itemInItemTable
    //   ?.where({ destinationItemId: item.id })
    //   .toArray();
  }

  async deleteItemInItem(itemInItem: ItemInItemInferredType) {
    // await Database.shared().itemInItemTable?.delete(itemInItem.id);
  }

  private async loadItemInItem(itemInItemInferredType: ItemInItemInferredType) {
    // const itemInItem = new ItemInItem(itemInItemInferredType);
    // const sourceItem = await this.itemTable?.get(itemInItem.sourceItemId);
    // if (sourceItem !== undefined) {
    //   itemInItem.sourceItem = await this.loadItem(sourceItemInferredType);
    // }
    // return itemInItem;
  }

  /* Nutrition */

  itemNutrition(
    item: ItemInferredType,
    perServing: boolean = false
  ): NutritionInfo {
    // if (item.count === undefined) {
    return nutritionInfo();
    // }

    // const base = multiplyNutritionInfo(item, perServing ? 1 : item.count);
    // const sub = divideNutritionInfo(
    //   sumNutritionInfo(
    //     (item.itemInItems ?? []).map((value) =>
    //       this.totalItemInItemNutrition(value)
    //     )
    //   ),
    //   perServing ? item.count : 1
    // );
    // return addNutritionInfo(base, sub);
  }

  totalItemInItemNutrition(itemInItem: ItemInItemInferredType): NutritionInfo {
    return nutritionInfo();
    // const sourceItemNutritionPerServing = itemInItem.sourceItem
    //   ? this.itemNutrition(itemInItem.sourceItem, true)
    //   : nutritionInfo();

    // return multiplyNutritionInfo(
    //   sourceItemNutritionPerServing,
    //   itemInItem.count
    // );
  }

  /* Price */

  formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  formattedItemPrice(
    item: ItemInferredType,
    perServing: boolean = false
  ): string {
    return this.formatter.format(this.itemPrice(item, perServing) / 100);
  }

  itemPrice(item: ItemInferredType, perServing: boolean = false): number {
    return 0;
    // if (item.count === undefined) {
    //   return 0;
    // }

    // return (
    //   (Number(item.priceCents) +
    //     Number(
    //       (item.itemInItems ?? []).reduce(
    //         (previousValue, currentValue) =>
    //           previousValue + this.totalItemInItemPrice(currentValue),
    //         0
    //       )
    //     )) /
    //   (perServing ? Number(item.count) : 1)
    // );
  }

  formattedTotalItemInItemPrice(itemInItem: ItemInItemInferredType) {
    return this.formatter.format(this.totalItemInItemPrice(itemInItem) / 100);
  }

  totalItemInItemPrice(itemInItem: ItemInItemInferredType) {
    return 0;
    // const sourceItemNutritionPerServing = itemInItem.sourceItem
    //   ? Number(this.itemPrice(itemInItem.sourceItem, true))
    //   : 0;

    // return sourceItemNutritionPerServing * Number(itemInItem.count);
  }
}
