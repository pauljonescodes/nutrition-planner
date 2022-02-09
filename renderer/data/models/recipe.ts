import * as Yup from "yup";
import { Database } from "../database";
import {
  addNutritionInfo,
  divideNutritionInfo,
  NutritionInfo,
} from "../nutrition-info";
import { IngredientInRecipe } from "./ingredient-in-recipe";

export const dexieRecipeSchema = "&id, name, servingCount";

export const yupRecipeSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string()
    .required()
    .default("")
    .meta({
      helperText: "Display name of recipe.",
      key: "name",
    })
    .label("Name"),
  servingCount: Yup.number()
    .required()
    .default(0)
    .meta({
      helperText: "Number of servings in recipe.",
      key: "servingCount",
    })
    .label("Servings"),
});

export interface RecipeInterface
  extends Yup.InferType<typeof yupRecipeSchema> {}

export class Recipe implements RecipeInterface {
  ingredientsInRecipe?: Array<IngredientInRecipe>;

  constructor(
    public id: string,
    public name: string,
    public servingCount: number
  ) {}

  static async load(id: string): Promise<Recipe | undefined> {
    const gotRecipe = await Database.shared().getRecipe(id);

    if (!gotRecipe) {
      return undefined;
    }

    const recipe = new Recipe(
      gotRecipe.id,
      gotRecipe.name,
      gotRecipe.servingCount
    );

    const interfaces =
      (await Database.shared().ingredientsInRecipeArray(gotRecipe.id)) ?? [];
    recipe.ingredientsInRecipe = interfaces.map((value) => {
      return new IngredientInRecipe(
        value.id,
        value.ingredientId,
        value.servingCount,
        value.recipeId
      );
    });

    return recipe;
  }

  static async save(recipe: Recipe) {
    await Database.shared().putRecipe({
      id: recipe.id,
      name: recipe.name,
      servingCount: recipe.servingCount,
    });
    const savedIngredientsInRecipe =
      (await Database.shared().ingredientsInRecipeArray(recipe.id)) ?? [];

    const deletions = savedIngredientsInRecipe.filter((value1) => {
      return (
        recipe.ingredientsInRecipe?.find((value2) => {
          return value2.id === value1.ingredientId;
        }) === undefined
      );
    });

    const additions =
      recipe.ingredientsInRecipe?.filter((value1) => {
        return (
          savedIngredientsInRecipe.find((value2) => {
            return value1.id === value2.ingredientId;
          }) === undefined
        );
      }) ?? [];

    for (const deletion of deletions) {
      await Database.shared().deleteIngredientInRecipe(deletion.id);
    }

    for (const addition of additions) {
      await Database.shared().putIngredientInRecipe(addition);
    }

    return recipe;
  }

  static nutritionInfo(recipe?: Recipe, perServing: boolean = false) {
    const ingredientsInRecipe = recipe?.ingredientsInRecipe ?? [];
    const nutritionInfo = ingredientsInRecipe.reduce(
      (previousValue, currentValue) => {
        return addNutritionInfo(
          previousValue,
          IngredientInRecipe.nutritionInfo(currentValue)
        );
      },
      {
        priceCents: 0,
        massGrams: 0,
        energyKilocalorie: 0,
        fatGrams: 0,
        carbohydrateGrams: 0,
        proteinGrams: 0,
      } as NutritionInfo
    );

    return divideNutritionInfo(
      nutritionInfo,
      perServing ? recipe?.servingCount ?? 1 : 1
    );
  }
}
