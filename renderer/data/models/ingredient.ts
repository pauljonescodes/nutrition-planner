import * as Yup from "yup";

export const dexieIngredientSchema =
  "&id, name, priceCents, servingCount, servingMassGrams, servingEnergyKilocalorie, servingFatGrams, servingCarbohydrateGrams, servingProteinGrams";

export const yupIngredientSchema = Yup.object({
  id: Yup.string().label("ID").required(),
  name: Yup.string()
    .label("Name")
    .default("")
    .meta({
      helperText: "Display name of ingredient.",
      key: "name",
    })
    .required(),
  priceCents: Yup.number()
    .label("Price")
    .meta({
      helperText:
        "Cost of the ingredient in the lowest denomination of your currency (i.e. cents)",
      key: "priceCents",
    })
    .required()
    .default(0),
  servingCount: Yup.number()
    .label("Servings")
    .meta({
      helperText: "Total number of servings for the price.",
      key: "servingCount",
    })
    .required()
    .default(1),
  servingMassGrams: Yup.number()
    .label("Size")
    .meta({
      helperText:
        "Mass or volume of a single serving, usually grams or milliliters.",
      key: "servingMassGrams",
    })
    .required()
    .default(0),
  servingEnergyKilocalorie: Yup.number()
    .label("Energy")
    .meta({
      helperText: "Kilocalories of a single serving.",
      key: "servingEnergyKilocalorie",
    })
    .required()
    .default(0),
  servingFatGrams: Yup.number()
    .label("Fat")
    .meta({
      helperText: "Fat grams in single serving.",
      key: "servingFatGrams",
    })
    .required()
    .default(0),
  servingCarbohydrateGrams: Yup.number()
    .label("Carb")
    .meta({
      helperText: "Carboyhydrate grams in single serving.",
      key: "servingCarbohydrateGrams",
    })
    .required()
    .default(0),
  servingProteinGrams: Yup.number()
    .label("Protein")
    .meta({
      helperText: "Protein grams in single serving.",
      key: "servingProteinGrams",
    })
    .default(0)
    .required(),
});

export interface IngredientInterface
  extends Yup.InferType<typeof yupIngredientSchema> {}

export class Ingredient implements IngredientInterface {
  constructor(
    public id: string,
    public name: string,
    public priceCents: number,
    public servingCount: number,
    public servingMassGrams: number,
    public servingEnergyKilocalorie: number,
    public servingFatGrams: number,
    public servingCarbohydrateGrams: number,
    public servingProteinGrams: number
  ) {}
}
