import * as Yup from "yup";

export const dexieIngredientSchema =
  "&id, name, priceCents, servingCount, servingMassGrams, servingEnergyKilocalorie, servingFatGrams, servingCarbohydrateGrams, servingProteinGrams";

export const yupIngredientSchema = Yup.object({
  id: Yup.string().required().default(""),
  name: Yup.string().label("Ingredient name").default("").required(),
  priceCents: Yup.number()
    .label("Price in cents")
    .required()
    .default(0)
    .positive(),
  servingCount: Yup.number()
    .label("Number of servings")
    .required()
    .default(1)
    .positive(),
  servingMassGrams: Yup.number()
    .label("Serving size (g or mL)")
    .required()
    .default(0)
    .positive(),
  servingEnergyKilocalorie: Yup.number()
    .label("Serving energy (kcal)")
    .required()
    .default(0)
    .positive(),
  servingFatGrams: Yup.number()
    .label("Serving fat (g)")
    .required()
    .default(0)
    .positive(),
  servingCarbohydrateGrams: Yup.number()
    .label("Serving carbohydrates (g)")
    .required()
    .default(0)
    .positive(),
  servingProteinGrams: Yup.number()
    .label("Serving protein (g)")
    .default(0)
    .positive()
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
