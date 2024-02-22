export function parseNutritionDictionary(text: string) {
  const regExps = [
    /(?:\()(?<massGrams>\d*\.?\d*)(?:g\))/gi,
    /(?:servings.*)(?<count>\d*\.?\d*)/gi,
    /(?<count>\d*\.?\d*)(?:.*servings)/gi,
    /(?:Calories\s*)(?<energyKilocalories>\d*\.?\d*)/gi,
    /(?:Total Fat\s*)(?<fatGrams>\d*\.?\d*)(?:g)/gi,
    /(?:Saturated Fat\s*)(?<saturatedFatGrams>\d*\.?\d*)(?:g)/gi,
    /(?:Trans Fat\s*)(?<transFatGrams>\d*\.?\d*)(?:g)/gi,
    /(?:Cholesterol\s*)(?<cholesterolMilligrams>\d*\.?\d*)(?:mg)/gi,
    /(?:Sodium\s*)(?<sodiumMilligrams>\d*\.?\d*)(?:mg)/gi,
    /(?:Total Carbohydrate\s*)(?<carbohydrateGrams>\d*\.?\d*)(?:g)/gi,
    /(?:Dietary Fiber\s*)(?<fiberGrams>\d*\.?\d*)(?:g)/gi,
    /(?:Sugars\s*)(?<sugarGrams>\d*\.?\d*)(?:g)/gi,
    /(?:Protein\s*)(?<proteinGrams>\d*\.?\d*)(?:g)/gi,
  ];

  const numberedGroups: { [key: string]: number } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const regExp of regExps) {
    const regExpMatchArray = regExp.exec(text);
    const matchedGroup = regExpMatchArray?.groups ?? {};
    Object.keys(matchedGroup).forEach((key) => {
      numberedGroups[key] = +matchedGroup[key];
    });
  }
  return numberedGroups;
}
