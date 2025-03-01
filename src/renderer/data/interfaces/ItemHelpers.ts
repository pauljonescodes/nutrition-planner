import { ItemInterface } from './ItemInterface';

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
};

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

export function prettyPrintItem(item: ItemInterface) {
  return `${item.count} x ${item.name}`;
}

export function prettyPrintItems(items: ItemInterface[]) {
  return items.map(prettyPrintItem).join('\n');
}

function findItemById(
  id: string,
  root: ItemInterface,
  depth = 0,
): ItemInterface | null {
  if (!root || depth > 31) return null;
  if (root.id === id) return root;
  if (!root.subitems?.length) return null;

  // eslint-disable-next-line no-restricted-syntax
  for (const sub of root.subitems) {
    if (sub.item) {
      const found = findItemById(id, sub.item, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

function gatherUsageUnits(
  item: ItemInterface,
  parentMultiplier = 1, // how many times the parent is repeated
  depth = 0,
): Record<string, number> {
  if (!item || depth > 31) return {};

  if (item.subitems?.length) {
    const usageMap: Record<string, number> = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const sub of item.subitems) {
      // eslint-disable-next-line no-continue
      if (!sub.item) continue;
      const effectiveCount = parentMultiplier * (sub.count ?? 1);

      const subUsage = gatherUsageUnits(sub.item, effectiveCount, depth + 1);

      // eslint-disable-next-line no-restricted-syntax
      for (const [id, usedUnits] of Object.entries(subUsage)) {
        usageMap[id] = (usageMap[id] ?? 0) + usedUnits;
      }
    }
    return usageMap;
  }

  if (!item.id) return {};

  const leafId = item.id;
  const usageMap: Record<string, number> = {};
  usageMap[leafId] = (usageMap[leafId] ?? 0) + parentMultiplier;
  return usageMap;
}

export function buildList(rootItem: ItemInterface): ItemInterface[] {
  const usageMap = gatherUsageUnits(rootItem);
  const results: ItemInterface[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [id, usedUnits] of Object.entries(usageMap)) {
    const originalItem = findItemById(id, rootItem);
    if (!originalItem) {
      // eslint-disable-next-line no-continue
      continue;
    }

    results.push({
      ...originalItem,
      count: Math.ceil(usedUnits / (originalItem.count ?? 1)),
    });
  }

  return results;
}

export function getBaseItems(
  item: ItemInterface,
  depth: number = 0,
  parentCount: number = 1,
): string[] {
  if (depth > 31 || !item) {
    return [];
  }

  if (item.subitems && item.subitems.length > 0) {
    let baseItems: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const subitem of item.subitems) {
      if (subitem.item) {
        const effectiveCount = subitem.count
          ? subitem.count * parentCount
          : parentCount;
        baseItems = baseItems.concat(
          getBaseItems(subitem.item, depth + 1, effectiveCount),
        );
      }
    }
    return baseItems;
  }
  if (item.name) {
    return [`${item.name} (${parentCount} x ${item.massGrams ?? 0}g)`]; // Include the parent count in the output
  }

  return [];
}

export function itemServingNutrition(
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
        const anItem = itemMultiplyNutrition(
          itemServingNutrition(value.item!, theDepth + 1),
          value.count!,
        );
        return anItem;
      }
      return itemZeroNutrition;
    });

    return itemDivideNutrition(itemSumNutrition(toSum), item.count ?? 1);
  }

  return item;
}

export function logServingNutrition(
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
        const anItem = itemDivideNutrition(
          itemServingNutrition(value.item!, theDepth + 1),
          value.count!,
        );
        return anItem;
      }
      return itemZeroNutrition;
    });

    return itemDivideNutrition(itemSumNutrition(toSum), item.count ?? 1);
  }

  return item;
}

export function itemServingPriceCents(
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
              itemServingPriceCents(value.item, theDepth + 1) *
              (value.count ?? 1)
            );
          }
          return 0;
        })
        .reduce((previous, current) => previous + current, 0) /
      (item.count ?? 1)
    );
  }

  const priceCents = (item.priceCents ?? 0) / (item.count ?? 1);

  return priceCents;
}
