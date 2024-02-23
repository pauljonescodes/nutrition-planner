import { calculateTotalDailyEnergyExpenditureKcal } from './calculateTotalDailyEnergyExpenditureKcal';

export function calculateEnergyTargetKcal(params: {
  weightKilograms?: number;
  sexIsMale?: boolean;
  ageYears?: number;
  heightCentimeters?: number;
  goalWeightKilograms?: number;
  goalDays?: number;
  physicalActivityLevelNumber?: number;
}): number | undefined {
  const {
    weightKilograms,
    sexIsMale,
    ageYears,
    heightCentimeters,
    goalWeightKilograms,
    goalDays,
    physicalActivityLevelNumber
  } = params;

  if (
    weightKilograms === null ||
    weightKilograms === undefined ||
    sexIsMale === null ||
    sexIsMale === undefined ||
    ageYears === null ||
    ageYears === undefined ||
    heightCentimeters === null ||
    heightCentimeters === undefined ||
    goalWeightKilograms === null ||
    goalWeightKilograms === undefined ||
    goalDays === null ||
    goalDays === undefined ||
    physicalActivityLevelNumber === null ||
    physicalActivityLevelNumber === undefined
  ) {
    return undefined;
  }

  const totalDailyEnergyExpenditureKcal =
    calculateTotalDailyEnergyExpenditureKcal({
      sexIsMale,
      weightKilograms,
      heightCentimeters,
      ageYears,
      physicalActivityLevelNumber,
    }) ?? 0;
  const weightDifferenceKg = weightKilograms - goalWeightKilograms;
  const dailyCalorieDeficitSurplus = (weightDifferenceKg * 7700) / goalDays;
  return totalDailyEnergyExpenditureKcal - dailyCalorieDeficitSurplus;
}
