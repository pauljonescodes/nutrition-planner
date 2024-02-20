export function calculateBasalMetabolicRateKcal(params: {
  sexIsMale?: boolean;
  weightKilograms?: number;
  heightCentimeters?: number;
  ageYears?: number;
}): number | undefined {
  const { sexIsMale, weightKilograms, heightCentimeters, ageYears } = params;

  if (sexIsMale === undefined ||
    weightKilograms === undefined ||
    heightCentimeters === undefined ||
    ageYears === undefined) {
    return undefined;
  }

  return sexIsMale
    ? 10 * weightKilograms + 6.25 * heightCentimeters - 5 * ageYears + 5
    : 10 * weightKilograms + 6.25 * heightCentimeters - 5 * ageYears - 161;
}
