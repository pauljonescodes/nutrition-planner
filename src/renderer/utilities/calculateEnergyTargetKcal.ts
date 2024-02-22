import { calculateBasalMetabolicRateKcal } from './calculateBasalMetabolicRateKcal';

export function calculateEnergyTargetKcal(params: {
  weightKilograms?: number;
  sexIsMale?: boolean;
  ageYears?: number;
  heightCentimeters?: number;
  goalWeightKilograms?: number;
  goalDays?: number;
}): number | undefined {
  const {
    weightKilograms,
    sexIsMale,
    ageYears,
    heightCentimeters,
    goalWeightKilograms,
    goalDays,
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
    goalDays === undefined
  ) {
    return undefined;
  }

  const basalMetabolicRate =
    calculateBasalMetabolicRateKcal({
      sexIsMale,
      weightKilograms,
      heightCentimeters,
      ageYears,
    }) ?? 0;
  const weightDifferenceKg = weightKilograms - goalWeightKilograms;
  const dailyCalorieDeficitSurplus = (weightDifferenceKg * 7700) / goalDays;
  return basalMetabolicRate - dailyCalorieDeficitSurplus;
}
