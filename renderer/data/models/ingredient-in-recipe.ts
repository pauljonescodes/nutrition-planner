import * as Yup from "yup";

export const dexieIngredientInRecipeSchema =
  "&id, recipeId, servingCount, ingredientId";

export const yupIngredientInRecipeSchema = Yup.object({
  id: Yup.string(),
  ingredientId: Yup.string(),
  servingCount: Yup.number(),
  recipeId: Yup.string(),
}).label("Ingredients");

export interface IngredientInRecipeInterface
  extends Yup.InferType<typeof yupIngredientInRecipeSchema> {}

export class IngredientInRecipe implements IngredientInRecipeInterface {
  constructor(
    public id: string,
    public ingredientId: string,
    public servingCount: number,
    public recipeId: string
  ) {}
}
