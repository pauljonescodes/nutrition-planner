import * as Yup from "yup";
import { Database } from "../database";
import { multiplyNutritionInfo, NutritionInfo } from "../nutrition-info";
import { Ingredient } from "./ingredient";
import { Recipe } from "./recipe";

export const dexieIngredientInRecipeSchema =
  "&id, recipeId, servingCount, ingredientId";

export const yupIngredientInRecipeSchema = Yup.object({
  id: Yup.string().required(),
  ingredientId: Yup.string()
    .label("Ingredient")
    .meta({
      helperText: "An ingredient in this recipe.",
      key: "ingredientId",
    })
    .required(),
  servingCount: Yup.number()
    .label("Servings")
    .meta({
      helperText: "The number of servings of the ingredient in this recipe.",
      key: "servingCount",
    })
    .required()
    .default(0),
  recipeId: Yup.string().required(),
}).label("Ingredients");

export interface IngredientInRecipeInterface
  extends Yup.InferType<typeof yupIngredientInRecipeSchema> {}

export class IngredientInRecipe implements IngredientInRecipeInterface {
  ingredient?: Ingredient;
  recipe?: Recipe;

  constructor(
    public id: string,
    public ingredientId: string,
    public servingCount: number,
    public recipeId: string
  ) {}

  static async loadIngredient(ingredientInRecipe: IngredientInRecipe) {
    ingredientInRecipe.ingredient = await Database.shared().getIngredient(
      ingredientInRecipe.ingredientId
    );
    return ingredientInRecipe;
  }

  static nutritionInfo(ingredientInRecipe: IngredientInRecipe): NutritionInfo {
    return multiplyNutritionInfo(
      Ingredient.nutritionInfo(ingredientInRecipe.ingredient),
      ingredientInRecipe.servingCount
    );
  }
}
