import * as Yup from "yup";

export const dexieIngredientSchema =
  "&id, name, priceCents, servingCount, servingMassGrams, servingEnergyKilocalorie, servingFatGrams, servingCarbohydrateGrams, servingProteinGrams";

export const yupIngredientSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string().label("Name").default("").required(),
  priceCents: Yup.number()
    .label("Price")
    .meta({ description: "This is a test" })
    .required()
    .default(0),
  servingCount: Yup.number().label("Servings").required().default(1),
  servingMassGrams: Yup.number().label("Size").required().default(0),
  servingEnergyKilocalorie: Yup.number().label("Energy").required().default(0),
  servingFatGrams: Yup.number().label("Fat").required().default(0),
  servingCarbohydrateGrams: Yup.number().label("Carb").required().default(0),
  servingProteinGrams: Yup.number().label("Protein").default(0).required(),
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
