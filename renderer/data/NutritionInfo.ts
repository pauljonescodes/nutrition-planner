export interface NutritionInfo {
  massGrams: number;
  energyKilocalorie: number;
  fatGrams: number;
  carbohydrateGrams: number;
  proteinGrams: number;
}

export function nutritionInfoDescription(value: NutritionInfo): string {
  return `${value.massGrams}g / ${value.energyKilocalorie}kcal / ${value.fatGrams}g fat / ${value.carbohydrateGrams}g carb / ${value.proteinGrams}g protein`;
}

export function nutritionInfo(): NutritionInfo {
  return {
    massGrams: 0,
    energyKilocalorie: 0,
    fatGrams: 0,
    carbohydrateGrams: 0,
    proteinGrams: 0,
  };
}

export function addNutritionInfo(
  lhs: NutritionInfo,
  rhs: NutritionInfo
): NutritionInfo {
  return {
    massGrams: (lhs.massGrams ?? 0) + (rhs.massGrams ?? 0),
    energyKilocalorie:
      (lhs.energyKilocalorie ?? 0) + (rhs.energyKilocalorie ?? 0),
    fatGrams: (lhs.fatGrams ?? 0) + (rhs.fatGrams ?? 0),
    carbohydrateGrams:
      (lhs.carbohydrateGrams ?? 0) + (rhs.carbohydrateGrams ?? 0),
    proteinGrams: (lhs.proteinGrams ?? 0) + (rhs.proteinGrams ?? 0),
  };
}

export function sumNutritionInfo(info: Array<NutritionInfo>): NutritionInfo {
  return info.reduce(
    (previousValue, currentValue) =>
      addNutritionInfo(previousValue, currentValue),
    nutritionInfo()
  );
}

export function divideNutritionInfo(
  lhs: NutritionInfo,
  rhs: number
): NutritionInfo {
  return {
    massGrams: Math.round((lhs.massGrams ?? 0) / rhs),
    energyKilocalorie: Math.round((lhs.energyKilocalorie ?? 0) / rhs),
    fatGrams: Math.round((lhs.fatGrams ?? 0) / rhs),
    carbohydrateGrams: Math.round((lhs.carbohydrateGrams ?? 0) / rhs),
    proteinGrams: Math.round((lhs.proteinGrams ?? 0) / rhs),
  };
}

export function multiplyNutritionInfo(
  lhs: NutritionInfo,
  rhs: number
): NutritionInfo {
  return {
    massGrams: Math.round((lhs.massGrams ?? 0) * rhs),
    energyKilocalorie: Math.round((lhs.energyKilocalorie ?? 0) * rhs),
    fatGrams: Math.round((lhs.fatGrams ?? 0) * rhs),
    carbohydrateGrams: Math.round((lhs.carbohydrateGrams ?? 0) * rhs),
    proteinGrams: Math.round((lhs.proteinGrams ?? 0) * rhs),
  };
}
