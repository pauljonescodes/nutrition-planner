import * as Yup from "yup";
import { Database } from "../database";
import { divideNutritionInfo, NutritionInfo } from "../nutrition-info";
import { Recipe } from "./recipe";

export const dexieRecipeInRecipeSchema =
  "&id, destinationRecipeId, servingCount, sourceRecipeId";

export const yupRecipeInRecipeSchema = Yup.object({
  id: Yup.string().required(),
  sourceRecipeId: Yup.string()
    .label("Recipe")
    .meta({
      helperText: "An ingredient in this recipe.",
      key: "sourceRecipeId",
    })
    .required(),
  servingCount: Yup.number()
    .label("Servings")
    .meta({
      helperText: "The number of servings of the recipe in this recipe.",
      key: "servingCount",
    })
    .required()
    .default(0),
  destinationRecipeId: Yup.string().required(),
})
  .label("Sub-recipes")
  .meta({
    helperText: "An ingredient in this recipe.",
    key: "recipesInRecipe",
  });

export interface RecipeInRecipeInterface
  extends Yup.InferType<typeof yupRecipeInRecipeSchema> {}

export class RecipeInRecipe implements RecipeInRecipeInterface {
  destinationRecipe?: Recipe; // the recipe the other recipe is in
  sourceRecipe?: Recipe; // the recipe that's in the other recipe

  constructor(
    public id: string,
    public sourceRecipeId: string,
    public servingCount: number,
    public destinationRecipeId: string
  ) {}

  static async loadSourceRecipe(value: RecipeInRecipe) {
    const sourceRecipe = (await Database.shared().getRecipe(
      value.sourceRecipeId
    ))!;
    value.sourceRecipe = await Recipe.load(sourceRecipe);
    return value;
  }

  static nutritionInfo(value: RecipeInRecipe): NutritionInfo {
    return divideNutritionInfo(
      Recipe.nutritionInfo(value.sourceRecipe, true),
      value.servingCount
    );
  }
}
