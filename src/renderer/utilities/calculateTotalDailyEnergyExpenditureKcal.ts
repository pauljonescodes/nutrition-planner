import { calculateBasalMetabolicRateKcal } from './calculateBasalMetabolicRateKcal';

export function calculateTotalDailyEnergyExpenditureKcal(params: {
  sexIsMale?: boolean;
  weightKilograms?: number;
  heightCentimeters?: number;
  ageYears?: number;
  physicalActivityLevelNumber?: number;
}): number | undefined {
  const {
    sexIsMale,
    weightKilograms,
    heightCentimeters,
    ageYears,
    physicalActivityLevelNumber,
  } = params;

  if (
    sexIsMale === undefined ||
    weightKilograms === undefined ||
    heightCentimeters === undefined ||
    ageYears === undefined ||
    physicalActivityLevelNumber === undefined
  ) {
    return undefined;
  }

  const bmr = calculateBasalMetabolicRateKcal({
    sexIsMale,
    weightKilograms,
    heightCentimeters,
    ageYears,
  });
  if (bmr === undefined) {
    return undefined;
  }

  return bmr * physicalActivityLevelNumber;
}
