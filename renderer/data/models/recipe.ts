import * as Yup from "yup";
import { Database } from "../database";

export const dexieRecipeSchema = "&id, name, servingCount";

export const yupRecipeSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string().required().label("Recipe name"),
  servingCount: Yup.number().required().label("Servings in recipe"),
});

export interface RecipeInterface
  extends Yup.InferType<typeof yupRecipeSchema> {}

export class Recipe implements RecipeInterface {
  constructor(
    public id: string,
    public name: string,
    public servingCount: number
  ) {}

  async getIngredientsInRecipe() {
    return await Database.shared()
      .ingredientInRecipes.where({ recipeId: this.id })
      .toArray();
  }
}
