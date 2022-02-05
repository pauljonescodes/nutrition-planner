import * as Yup from "yup";

export const dexieIngredientSchema =
  "&id, name, priceCents, servingCount, servingMassGrams, servingEnergyKilocalorie, servingFatGrams, servingCarbohydrateGrams, servingProteinGrams";

export const yupIngredientSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string().label("Ingredient name").required(),
  priceCents: Yup.number().label("Price in cents").required(),
  servingCount: Yup.number().label("Number of servings").required(),
  servingMassGrams: Yup.number().label("Serving size (g or mL)").required(),
  servingEnergyKilocalorie: Yup.number()
    .label("Serving energy (kcal)")
    .required(),
  servingFatGrams: Yup.number().label("Serving fat (g)").required(),
  servingCarbohydrateGrams: Yup.number()
    .label("Serving carbohydrates (g)")
    .required(),
  servingProteinGrams: Yup.number().label("Serving protein (g)").required(),
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
