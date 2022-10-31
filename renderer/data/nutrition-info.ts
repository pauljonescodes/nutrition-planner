export enum CalcTypeEnum {
  perServing = "Serving price",
  total = "Total price",
}

export interface NutritionInfo {
  massGrams: number;
  energyKilocalorie: number;
  fatGrams: number;
  saturatedFatGrams: number;
  transFatGrams: number;
  cholesterolMilligrams: number;
  sodiumMilligrams: number;
  carbohydrateGrams: number;
  fiberGrams: number;
  sugarGrams: number;
  proteinGrams: number;
}

export function nutritionInfoDescription(value: NutritionInfo): string {
  return `${value.massGrams}g / ${value.energyKilocalorie}kcal / ${value.fatGrams}g fat / ${value.carbohydrateGrams}g carb / ${value.proteinGrams}g protein`;
}

export function baseNutritionInfo(): NutritionInfo {
  return {
    massGrams: 0,
    energyKilocalorie: 0,
    fatGrams: 0,
    saturatedFatGrams: 0,
    transFatGrams: 0,
    cholesterolMilligrams: 0,
    sodiumMilligrams: 0,
    carbohydrateGrams: 0,
    fiberGrams: 0,
    sugarGrams: 0,
    proteinGrams: 0,
  };
}

export function addNutritionInfo(
  lhs: NutritionInfo,
  rhs: NutritionInfo
): NutritionInfo {
  return {
    massGrams: lhs.massGrams + rhs.massGrams,
    energyKilocalorie: lhs.energyKilocalorie + rhs.energyKilocalorie,
    fatGrams: lhs.fatGrams + rhs.fatGrams,
    saturatedFatGrams: lhs.saturatedFatGrams + rhs.saturatedFatGrams,
    transFatGrams: lhs.transFatGrams + rhs.transFatGrams,
    cholesterolMilligrams:
      lhs.cholesterolMilligrams + rhs.cholesterolMilligrams,
    sodiumMilligrams: lhs.sodiumMilligrams + rhs.sodiumMilligrams,
    carbohydrateGrams: lhs.carbohydrateGrams + rhs.carbohydrateGrams,
    fiberGrams: lhs.fiberGrams + rhs.fiberGrams,
    sugarGrams: lhs.sugarGrams + rhs.sugarGrams,
    proteinGrams: lhs.proteinGrams + rhs.proteinGrams,
  };
}

export function sumNutritionInfo(info: Array<NutritionInfo>): NutritionInfo {
  return info.reduce(
    (previousValue, currentValue) =>
      addNutritionInfo(previousValue, currentValue),
    baseNutritionInfo()
  );
}

export function divideNutritionInfo(
  lhs: NutritionInfo,
  rhs: number
): NutritionInfo {
  return {
    massGrams: Math.round(lhs.massGrams / rhs),
    energyKilocalorie: Math.round(lhs.energyKilocalorie / rhs),
    fatGrams: Math.round(lhs.fatGrams / rhs),
    saturatedFatGrams: Math.round(lhs.saturatedFatGrams / rhs),
    transFatGrams: Math.round(lhs.transFatGrams / rhs),
    cholesterolMilligrams: Math.round(lhs.cholesterolMilligrams / rhs),
    sodiumMilligrams: Math.round(lhs.sodiumMilligrams / rhs),
    carbohydrateGrams: Math.round(lhs.carbohydrateGrams / rhs),
    fiberGrams: Math.round(lhs.fiberGrams / rhs),
    sugarGrams: Math.round(lhs.sugarGrams / rhs),
    proteinGrams: Math.round(lhs.proteinGrams / rhs),
  };
}

export function multiplyNutritionInfo(
  lhs: NutritionInfo,
  rhs: number
): NutritionInfo {
  return {
    massGrams: Math.round(lhs.massGrams * rhs),
    energyKilocalorie: Math.round(lhs.energyKilocalorie * rhs),
    fatGrams: Math.round(lhs.fatGrams * rhs),
    saturatedFatGrams: Math.round(lhs.saturatedFatGrams * rhs),
    transFatGrams: Math.round(lhs.transFatGrams * rhs),
    cholesterolMilligrams: Math.round(lhs.cholesterolMilligrams * rhs),
    sodiumMilligrams: Math.round(lhs.sodiumMilligrams * rhs),
    carbohydrateGrams: Math.round(lhs.carbohydrateGrams * rhs),
    fiberGrams: Math.round(lhs.fiberGrams * rhs),
    sugarGrams: Math.round(lhs.sugarGrams * rhs),
    proteinGrams: Math.round(lhs.proteinGrams * rhs),
  };
}

// export class Database {

//   /* Items CRUD */

//   async putItem(item: ItemInferredType) {
//     // return await this.itemTable?.put({
//     //   id: item.id,
//     //   type: item.type,
//     //   name: item.name,
//     //   priceCents: item.priceCents,
//     //   count: item.count,
//     //   massGrams: item.massGrams,
//     //   energyKilocalorie: item.energyKilocalorie,
//     //   fatGrams: item.fatGrams,
//     //   carbohydrateGrams: item.carbohydrateGrams,
//     //   proteinGrams: item.proteinGrams,
//     // });
//   }

//   async saveItem(item: ItemInferredType) {
//     // await this.putItem(item);
//     // const savedItemsInItem = (await this.itemsInItemArray(item)) ?? [];
//     // const deletions = savedItemsInItem.filter((value1) => {
//     //   return (
//     //     item.itemInItems?.find((value2) => {
//     //       return value2.id === value1.sourceItemId;
//     //     }) === undefined
//     //   );
//     // });
//     // const additions =
//     //   item.itemInItems?.filter((value1) => {
//     //     return (
//     //       savedItemsInItem.find((value2) => {
//     //         return value1.id === value2.sourceItemId;
//     //       }) === undefined
//     //     );
//     //   }) ?? [];
//     // for (const deletion of deletions) {
//     //   await this.deleteItemInItem(deletion);
//     // }
//     // for (const addition of additions) {
//     //   await this.putItemInItem(addition);
//     // }
//     // return item;
//   }

//   async countOfItems(parameters: ItemQueryParameters) {
//     // var collection = this.itemTable?.where({ type: parameters.type });
//     // if (parameters.name) {
//     //   collection = collection?.filter((obj) => {
//     //     return new RegExp(
//     //       ".*" + parameters.name?.toLowerCase().split("").join(".*") + ".*"
//     //     ).test(obj.name.toLowerCase());
//     //   });
//     // }
//     // return (await collection?.count()) ?? 0;
//   }

//   async arrayOfItems(parameters: ItemQueryParameters) {
//     // var collection = this.itemTable
//     //   ?.where({ type: parameters.type })
//     //   .offset(parameters.page * parameters.limit)
//     //   .limit(parameters.limit);
//     // if (parameters.name) {
//     //   collection = collection?.filter((obj) => {
//     //     return new RegExp(
//     //       ".*" + parameters.name?.toLowerCase().split("").join(".*") + ".*"
//     //     ).test(obj.name.toLowerCase());
//     //   });
//     // }
//     // const interfaces: Array<ItemInferredType> = [];
//     // if (parameters.sortBy) {
//     //   if (parameters.reverse) {
//     //     collection = collection?.reverse();
//     //   }
//     //   const items = (await collection?.sortBy(parameters.sortBy)) ?? [];
//     //   interfaces.push(...items);
//     // } else {
//     //   interfaces.push(...((await collection?.toArray()) ?? []));
//     // }
//     // return await Promise.all(
//     //   interfaces.map((value) => {
//     //     return this.loadItem(value);
//     //   })
//     // );
//   }

//   async filteredItems(query: string) {
//     // return this.itemTable
//     //   ?.filter((obj) => {
//     //     return new RegExp(
//     //       ".*" + query.toLowerCase().split("").join(".*") + ".*"
//     //     ).test(obj.name.toLowerCase());
//     //   })
//     //   .toArray();
//   }

//   async deleteItem(itemId: string) {
//     // const item = await this.itemTable?.get(itemId);
//     // if (item !== undefined) {
//     //   await this.itemTable?.delete(itemId);
//     //   if (item.type === "ingredient") {
//     //     await this.itemInItemTable
//     //       ?.where("sourceItemId")
//     //       .equals(itemId)
//     //       .delete();
//     //   } else {
//     //     await this.itemInItemTable
//     //       ?.where("destinationItemId")
//     //       .equals(itemId)
//     //       .delete();
//     //   }
//     // }
//   }

//   async loadItem(itemInterface: ItemInferredType) {
//     // const item = new Item(itemInterface);
//     // const itemsInItem = (await this.itemsInItemArray(itemInterface)) ?? [];
//     // item.itemInItems = await Promise.all(
//     //   itemsInItem?.map((value) => this.loadItemInItem(value))
//     // );
//     // return item;
//   }

//   /* Item in recipe CRUD */

//   async putItemInItem(itemInItem: ItemInItemInferredType) {
//     // return await this.itemInItemTable?.put({
//     //   id: itemInItem.id,
//     //   sourceItemId: itemInItem.sourceItemId,
//     //   count: itemInItem.count,
//     //   destinationItemId: itemInItem.destinationItemId,
//     // });
//   }

//   private async itemsInItemArray(item: ItemInferredType) {
//     // return await this.itemInItemTable
//     //   ?.where({ destinationItemId: item.id })
//     //   .toArray();
//   }

//   async deleteItemInItem(itemInItem: ItemInItemInferredType) {
//     // await Database.shared().itemInItemTable?.delete(itemInItem.id);
//   }

//   private async loadItemInItem(itemInItemInferredType: ItemInItemInferredType) {
//     // const itemInItem = new ItemInItem(itemInItemInferredType);
//     // const sourceItem = await this.itemTable?.get(itemInItem.sourceItemId);
//     // if (sourceItem !== undefined) {
//     //   itemInItem.sourceItem = await this.loadItem(sourceItemInferredType);
//     // }
//     // return itemInItem;
//   }

//   /* Nutrition */

// function totalItemInItemNutrition(
//   itemInItem: ItemInItemInferredType
// ): NutritionInfo {
//   const sourceItemNutritionPerServing = itemInItem.sourceItem
//     ? itemNutrition(itemInItem.sourceItem, true)
//     : nutritionInfo();

//   return multiplyNutritionInfo(sourceItemNutritionPerServing, itemInItem.count);
// }

//   /* Price */

//   formattedItemPrice(
//     item: ItemInferredType,
//     perServing: boolean = false
//   ): string {
//     return this.formatter.format(this.itemPrice(item, perServing) / 100);
//   }

//   itemPrice(item: ItemInferredType, perServing: boolean = false): number {
//     return 0;
//     // if (item.count === undefined) {
//     //   return 0;
//     // }

//     // return (
//     //   (Number(item.priceCents) +
//     //     Number(
//     //       (item.itemInItems ?? []).reduce(
//     //         (previousValue, currentValue) =>
//     //           previousValue + this.totalItemInItemPrice(currentValue),
//     //         0
//     //       )
//     //     )) /
//     //   (perServing ? Number(item.count) : 1)
//     // );
//   }

//   formattedTotalItemInItemPrice(itemInItem: ItemInItemInferredType) {
//     return this.formatter.format(this.totalItemInItemPrice(itemInItem) / 100);
//   }

//   totalItemInItemPrice(itemInItem: ItemInItemInferredType) {
//     return 0;
//     // const sourceItemNutritionPerServing = itemInItem.sourceItem
//     //   ? Number(this.itemPrice(itemInItem.sourceItem, true))
//     //   : 0;

//     // return sourceItemNutritionPerServing * Number(itemInItem.count);
//   }
// }
