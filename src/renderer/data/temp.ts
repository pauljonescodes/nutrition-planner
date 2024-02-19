function calculateBasalMetabolicRate(params: {
  sexIsMale: boolean;
  weightKilograms: number;
  heightCentimeters: number;
  ageYears: number;
}) {
  const { sexIsMale, weightKilograms, heightCentimeters, ageYears } = params;
  return sexIsMale
    ? 10 * weightKilograms + 6.25 * heightCentimeters - 5 * ageYears + 5
    : 10 * weightKilograms + 6.25 * heightCentimeters - 5 * ageYears - 161;
}

function calculateDailyCalories(params: {
  weightKilograms: number;
  sexIsMale: boolean;
  ageYears: number;
  heightCentimeters: number;
  goalWeightKg: number;
  goalDays: number;
}): number {
  const {
    weightKilograms,
    sexIsMale,
    ageYears,
    heightCentimeters,
    goalWeightKg,
    goalDays,
  } = params;
  const basalMetabolicRate = calculateBasalMetabolicRate({
    sexIsMale,
    weightKilograms,
    heightCentimeters,
    ageYears,
  });
  const weightDifferenceKg = weightKilograms - goalWeightKg;
  const dailyCalorieDeficitSurplus = (weightDifferenceKg * 7700) / goalDays;
  return basalMetabolicRate - dailyCalorieDeficitSurplus;
}
