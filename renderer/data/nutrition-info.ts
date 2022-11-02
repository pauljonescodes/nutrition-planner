export enum CalculationTypeEnum {
  perServing = "Serving price",
  total = "Total price",
}

export function toggleCalculationType(
  value: CalculationTypeEnum
): CalculationTypeEnum {
  switch (value) {
    case CalculationTypeEnum.perServing:
      return CalculationTypeEnum.total;
    case CalculationTypeEnum.total:
      return CalculationTypeEnum.perServing;
  }
}

export interface NutritionInfo {
  massGrams: number;
  energyKilocalories: number;
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
  return `${value.massGrams}g / ${value.energyKilocalories}kcal / ${value.fatGrams}g fat / ${value.carbohydrateGrams}g carb / ${value.proteinGrams}g protein`;
}

export function baseNutritionInfo(): NutritionInfo {
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

export function addNutritionInfo(
  lhs: NutritionInfo,
  rhs: NutritionInfo
): NutritionInfo {
  return {
    massGrams: lhs.massGrams + rhs.massGrams,
    energyKilocalories: lhs.energyKilocalories + rhs.energyKilocalories,
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
    energyKilocalories: Math.round(lhs.energyKilocalories / rhs),
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
  lhs?: NutritionInfo,
  rhs?: number
): NutritionInfo {
  return {
    massGrams: Math.round((lhs?.massGrams ?? 0) * (rhs ?? 0)),
    energyKilocalories: Math.round((lhs?.energyKilocalories ?? 0) * (rhs ?? 0)),
    fatGrams: Math.round((lhs?.fatGrams ?? 0) * (rhs ?? 0)),
    saturatedFatGrams: Math.round((lhs?.saturatedFatGrams ?? 0) * (rhs ?? 0)),
    transFatGrams: Math.round((lhs?.transFatGrams ?? 0) * (rhs ?? 0)),
    cholesterolMilligrams: Math.round(
      (lhs?.cholesterolMilligrams ?? 0) * (rhs ?? 0)
    ),
    sodiumMilligrams: Math.round((lhs?.sodiumMilligrams ?? 0) * (rhs ?? 0)),
    carbohydrateGrams: Math.round((lhs?.carbohydrateGrams ?? 0) * (rhs ?? 0)),
    fiberGrams: Math.round((lhs?.fiberGrams ?? 0) * (rhs ?? 0)),
    sugarGrams: Math.round((lhs?.sugarGrams ?? 0) * (rhs ?? 0)),
    proteinGrams: Math.round((lhs?.proteinGrams ?? 0) * (rhs ?? 0)),
  };
}
