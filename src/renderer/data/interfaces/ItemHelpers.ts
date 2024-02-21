import { ItemInterface } from './ItemInterface';
import { SubitemInterface } from './SubitemInterface';

export function flattenSubitems(data: SubitemInterface[]): SubitemInterface[] {
  return data.reduce(function (
    result: SubitemInterface[],
    next: SubitemInterface,
  ) {
    result.push(next);
    if (next.item?.subitems) {
      result = result.concat(flattenSubitems(next.item.subitems));
      next.item.subitems = [];
    }
    return result;
  }, []);
}

export function populatedItemServingNutrition(
  item: ItemInterface,
  depth?: number,
): ItemInterface {
  const theDepth = depth ?? 0;

  if (theDepth === 32) {
    return itemZeroNutrition;
  }

  if (item.subitems && item.subitems.length > 0) {
    const toSum = item.subitems.map((value) => {
      if (value.item) {
        const item = itemMultiplyNutrition(
          populatedItemServingNutrition(value.item!, theDepth + 1),
          value.count!,
        );
        return item;
      } else {
        return itemZeroNutrition;
      }
    });

    return itemDivideNutrition(itemSumNutrition(toSum), item.count ?? 1);
  }

  return item;
}

export function populatedLogServingNutrition(
  item: ItemInterface,
  depth?: number,
): ItemInterface {
  const theDepth = depth ?? 0;

  if (theDepth === 32) {
    return itemZeroNutrition;
  }

  if (item.subitems && item.subitems.length > 0) {
    const toSum = item.subitems.map((value) => {
      if (value.item) {
        const item = itemDivideNutrition(
          populatedItemServingNutrition(value.item!, theDepth + 1),
          value.count!,
        );
        return item;
      } else {
        return itemZeroNutrition;
      }
    });

    return itemDivideNutrition(itemSumNutrition(toSum), item.count ?? 1);
  }

  return item;
}

export function populatedItemServingPriceCents(
  item: ItemInterface,
  depth?: number,
): number {
  const theDepth = depth ?? 0;

  if (theDepth === 32) {
    return 0;
  }

  if (item.subitems && item.subitems.length > 0) {
    return (
      item.subitems
        .map((value) => {
          if (value.item) {
            return (
              populatedItemServingPriceCents(value.item, theDepth + 1) *
              (value.count ?? 1)
            );
          } else {
            return 0;
          }
        })
        .reduce((previous, current) => previous + current, 0) /
      (item.count ?? 1)
    );
  }

  const priceCents = (item.priceCents ?? 0) / (item.count ?? 1);

  return priceCents;
}

export const itemZeroNutrition: ItemInterface = {
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
}

export function itemAddNutrition(
  lhs: ItemInterface,
  rhs: ItemInterface,
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

export function itemEquals(rhs: ItemInterface, lhs: ItemInterface): boolean {
  return (
    rhs.massGrams === lhs.massGrams &&
    rhs.energyKilocalories === lhs.energyKilocalories &&
    rhs.fatGrams === lhs.fatGrams &&
    rhs.saturatedFatGrams === lhs.saturatedFatGrams &&
    rhs.transFatGrams === lhs.transFatGrams &&
    rhs.cholesterolMilligrams === lhs.cholesterolMilligrams &&
    rhs.sodiumMilligrams === lhs.sodiumMilligrams &&
    rhs.carbohydrateGrams === lhs.carbohydrateGrams &&
    rhs.fiberGrams === lhs.fiberGrams &&
    rhs.sugarGrams === lhs.sugarGrams &&
    rhs.proteinGrams === lhs.proteinGrams
  );
}

export function itemSumNutrition(info: Array<ItemInterface>): ItemInterface {
  return info.reduce(
    (previousValue, currentValue) =>
      itemAddNutrition(previousValue, currentValue),
    itemZeroNutrition,
  );
}

export function itemDivideNutrition(
  lhs: ItemInterface,
  rhs: number,
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
  rhs: number,
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
