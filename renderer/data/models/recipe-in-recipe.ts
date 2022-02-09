import * as Yup from "yup";
import { Database } from "../database";
import { multiplyNutritionInfo, NutritionInfo } from "../nutrition-info";
import { Recipe } from "./recipe";

export const dexieRecipeInRecipeSchema =
  "&id, destinationRecipeId, servingCount, sourceRecipeId";

export const yupRecipeInRecipeSchema = Yup.object({
  id: Yup.string().required(),
  sourceRecipeId: Yup.string()
    .label("Ingredient")
    .meta({
      helperText: "An ingredient in this recipe.",
      key: "sourceRecipeId",
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
  destinationRecipeId: Yup.string().required(),
})
  .label("Sub-recipes")
  .meta({
    helperText: "An ingredient in this recipe.",
    key: "ingredientsInRecipe",
  });

export interface RecipeInRecipeInterface
  extends Yup.InferType<typeof yupRecipeInRecipeSchema> {}

export class RecipeInRecipe implements RecipeInRecipeInterface {
  destinationRecipe?: Recipe;
  sourceRecipe?: Recipe;

  constructor(
    public id: string,
    public sourceRecipeId: string,
    public servingCount: number,
    public destinationRecipeId: string
  ) {}

  static async loadSourceRecipe(value: RecipeInRecipe) {
    value.sourceRecipe = await Database.shared().getRecipe(
      value.sourceRecipeId
    );
    return value;
  }

  static nutritionInfo(value: RecipeInRecipe): NutritionInfo {
    return multiplyNutritionInfo(
      Recipe.nutritionInfo(value.sourceRecipe),
      value.servingCount
    );
  }
}
