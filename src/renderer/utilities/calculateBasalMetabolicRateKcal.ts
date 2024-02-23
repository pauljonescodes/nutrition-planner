export function calculateBasalMetabolicRateKcal(params: {
  sexIsMale?: boolean;
  weightKilograms?: number;
  heightCentimeters?: number;
  ageYears?: number;
}): number | undefined {
  const { sexIsMale, weightKilograms, heightCentimeters, ageYears } = params;

  if (
    sexIsMale === undefined ||
    weightKilograms === undefined ||
    heightCentimeters === undefined ||
    ageYears === undefined
  ) {
    return undefined;
  }

  return sexIsMale
    ? 9.99 * weightKilograms + (625 * heightCentimeters / 100) - 4.92 * ageYears + 5
    : 9.99 * weightKilograms + (625 * heightCentimeters / 100) - 4.92 * ageYears - 161;
}
