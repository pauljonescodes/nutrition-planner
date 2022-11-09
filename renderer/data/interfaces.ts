import { RxCollection } from "rxdb";
import { dataid } from "./dataid";
import { ItemTypeEnum } from "./item-type-enum";
import { RxDBItemDocument } from "./rxdb";

export interface ItemInterface {
  id?: string;
  date?: Date;
  type?: ItemTypeEnum;
  name?: string;
  priceCents?: number;
  massGrams?: number;
  energyKilocalories?: number;
  fatGrams?: number;
  saturatedFatGrams?: number;
  transFatGrams?: number;
  cholesterolMilligrams?: number;
  sodiumMilligrams?: number;
  carbohydrateGrams?: number;
  fiberGrams?: number;
  sugarGrams?: number;
  proteinGrams?: number;
  count?: number;
  subitems?: SubitemInterface[];
}

export interface SubitemInterface {
  itemId?: string;
  item?: ItemInterface;
  count?: number;
}

export function flattenSubitems(data: SubitemInterface[]): SubitemInterface[] {
  return data.reduce(function (
    result: SubitemInterface[],
    next: SubitemInterface
  ) {
    result.push(next);
    if (next.item?.subitems) {
      result = result.concat(flattenSubitems(next.item.subitems));
      next.item.subitems = [];
    }
    return result;
  },
  []);
}

export async function upsertLogInterface(
  item: ItemInterface,
  collection?: RxCollection<RxDBItemDocument>
): Promise<RxDBItemDocument | undefined> {
  if (item.subitems && item.subitems.length > 0) {
    const originalIds = item.subitems.map((value) => value.itemId!) ?? [];
    const findByOriginalIdsMap = await collection?.findByIds(originalIds);
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

  console.log(item);

  return collection?.upsert({
    id: dataid(),
    date: item.date?.toISOString() as any,
    type: ItemTypeEnum.log,
    subitems: item.subitems,
  });
}

export async function recursivelyPopulateSubitems(
  item: ItemInterface,
  collection?: RxCollection<RxDBItemDocument>
): Promise<ItemInterface> {
  const mutableThis = item;

  if (mutableThis.subitems && mutableThis.subitems.length > 0) {
    const ids = mutableThis.subitems.map((value) => value.itemId!) ?? [];
    const findByIdsMap = await collection?.findByIds(ids);
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

export function populatedItemServingNutrition(
  item: ItemInterface
): ItemInterface {
  if (item.subitems && item.subitems.length > 0) {
    return itemDivideNutrition(
      itemSumNutrition(
        item.subitems.map((value) => {
          return itemMultiplyNutrition(
            populatedItemServingNutrition(value.item!),
            value.count!
          );
        })
      ),
      item.count ?? 1
    );
  }

  return item;
}

export function populatedItemServingPriceCents(item: ItemInterface): number {
  if (item.subitems && item.subitems.length > 0) {
    return (
      item.subitems
        .map((value) => {
          return (
            (populatedItemServingPriceCents(value.item!) ?? 0) *
            (value.count ?? 0)
          );
        })
        .reduce((previous, current) => previous + current, 0) /
      (item.count ?? 1)
    );
  }

  return (item.priceCents ?? 0) / (item.count ?? 1);
}

export function itemZeroNutrition(): ItemInterface {
  return {
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
  };
}

export function itemAddNutrition(
  lhs: ItemInterface,
  rhs: ItemInterface
): ItemInterface {
  return {
    massGrams: (lhs.massGrams ?? 0) + (rhs.massGrams ?? 0),
    energyKilocalories:
      (lhs.energyKilocalories ?? 0) + (rhs.energyKilocalories ?? 0),
    fatGrams: (lhs.fatGrams ?? 0) + (rhs.fatGrams ?? 0),
    saturatedFatGrams:
      (lhs.saturatedFatGrams ?? 0) + (rhs.saturatedFatGrams ?? 0),
    transFatGrams: (lhs.transFatGrams ?? 0) + (rhs.transFatGrams ?? 0),
    cholesterolMilligrams:
      (lhs.cholesterolMilligrams ?? 0) + (rhs.cholesterolMilligrams ?? 0),
    sodiumMilligrams: (lhs.sodiumMilligrams ?? 0) + (rhs.sodiumMilligrams ?? 0),
    carbohydrateGrams:
      (lhs.carbohydrateGrams ?? 0) + (rhs.carbohydrateGrams ?? 0),
    fiberGrams: (lhs.fiberGrams ?? 0) + (rhs.fiberGrams ?? 0),
    sugarGrams: (lhs.sugarGrams ?? 0) + (rhs.sugarGrams ?? 0),
    proteinGrams: (lhs.proteinGrams ?? 0) + (rhs.proteinGrams ?? 0),
  };
}

export function itemSumNutrition(info: Array<ItemInterface>): ItemInterface {
  return info.reduce(
    (previousValue, currentValue) =>
      itemAddNutrition(previousValue, currentValue),
    itemZeroNutrition()
  );
}

export function itemDivideNutrition(
  lhs: ItemInterface,
  rhs: number
): ItemInterface {
  return {
    massGrams: Math.round((lhs.massGrams ?? 0) / rhs),
    energyKilocalories: Math.round((lhs.energyKilocalories ?? 0) / rhs),
    fatGrams: Math.round((lhs.fatGrams ?? 0) / rhs),
    saturatedFatGrams: Math.round((lhs.saturatedFatGrams ?? 0) / rhs),
    transFatGrams: Math.round((lhs.transFatGrams ?? 0) / rhs),
    cholesterolMilligrams: Math.round((lhs.cholesterolMilligrams ?? 0) / rhs),
    sodiumMilligrams: Math.round((lhs.sodiumMilligrams ?? 0) / rhs),
    carbohydrateGrams: Math.round((lhs.carbohydrateGrams ?? 0) / rhs),
    fiberGrams: Math.round((lhs.fiberGrams ?? 0) / rhs),
    sugarGrams: Math.round((lhs.sugarGrams ?? 0) / rhs),
    proteinGrams: Math.round((lhs.proteinGrams ?? 0) / rhs),
  };
}

export function itemMultiplyNutrition(
  lhs: ItemInterface,
  rhs: number
): ItemInterface {
  return {
    massGrams: Math.round((lhs?.massGrams ?? 0) * rhs),
    energyKilocalories: Math.round((lhs?.energyKilocalories ?? 0) * rhs),
    fatGrams: Math.round((lhs?.fatGrams ?? 0) * rhs),
    saturatedFatGrams: Math.round((lhs?.saturatedFatGrams ?? 0) * rhs),
    transFatGrams: Math.round((lhs?.transFatGrams ?? 0) * rhs),
    cholesterolMilligrams: Math.round((lhs?.cholesterolMilligrams ?? 0) * rhs),
    sodiumMilligrams: Math.round((lhs?.sodiumMilligrams ?? 0) * rhs),
    carbohydrateGrams: Math.round((lhs?.carbohydrateGrams ?? 0) * rhs),
    fiberGrams: Math.round((lhs?.fiberGrams ?? 0) * rhs),
    sugarGrams: Math.round((lhs?.sugarGrams ?? 0) * rhs),
    proteinGrams: Math.round((lhs?.proteinGrams ?? 0) * rhs),
  };
}