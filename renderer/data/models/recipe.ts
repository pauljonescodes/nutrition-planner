import * as Yup from "yup";
import { Database } from "../database";
import {
  addNutritionInfo,
  divideNutritionInfo,
  NutritionInfo,
} from "../nutrition-info";
import { IngredientInRecipe } from "./ingredient-in-recipe";
import { RecipeInRecipe } from "./recipe-in-recipe";

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
  recipesInRecipe?: Array<RecipeInRecipe>;

  constructor(
    public id: string,
    public name: string,
    public servingCount: number
  ) {}

  static async load(recipeInterface: RecipeInterface): Promise<Recipe> {
    const gotRecipe = (await Database.shared().getRecipe(recipeInterface.id))!;

    const recipe = new Recipe(
      gotRecipe.id,
      gotRecipe.name,
      gotRecipe.servingCount
    );

    const ingredientsInRecipeInterfaces =
      (await Database.shared().ingredientsInRecipeArray(gotRecipe)) ?? [];
    const loadedIngredientsInRecipe: Array<IngredientInRecipe> = [];

    for (const value of ingredientsInRecipeInterfaces) {
      const ingredientInRecipe = new IngredientInRecipe(
        value.id,
        value.ingredientId,
        value.servingCount,
        value.recipeId
      );

      const loaded = await IngredientInRecipe.loadIngredient(
        ingredientInRecipe
      );
      loadedIngredientsInRecipe.push(loaded);
    }

    recipe.ingredientsInRecipe = loadedIngredientsInRecipe;
    const recipesInRecipeInterfaces =
      (await Database.shared().recipesInRecipeArray(gotRecipe)) ?? [];
    recipe.recipesInRecipe = await Promise.all(
      recipesInRecipeInterfaces.map(async (value) => {
        const recipeInRecipe = new RecipeInRecipe(
          value.id,
          value.sourceRecipeId,
          value.servingCount,
          value.destinationRecipeId
        );

        return await RecipeInRecipe.loadSourceRecipe(recipeInRecipe);
      })
    );

    console.log(recipe.recipesInRecipe);

    return recipe;
  }

  static async save(recipe: Recipe) {
    await Database.shared().putRecipe({
      id: recipe.id,
      name: recipe.name,
      servingCount: recipe.servingCount,
    });
    const savedIngredientsInRecipe =
      (await Database.shared().ingredientsInRecipeArray(recipe)) ?? [];

    const ingredientDeletions = savedIngredientsInRecipe.filter((value1) => {
      return (
        recipe.ingredientsInRecipe?.find((value2) => {
          return value2.id === value1.ingredientId;
        }) === undefined
      );
    });

    const ingredientAdditions =
      recipe.ingredientsInRecipe?.filter((value1) => {
        return (
          savedIngredientsInRecipe.find((value2) => {
            return value1.id === value2.ingredientId;
          }) === undefined
        );
      }) ?? [];

    for (const deletion of ingredientDeletions) {
      await Database.shared().deleteIngredientInRecipe(deletion);
    }

    for (const addition of ingredientAdditions) {
      await Database.shared().putIngredientInRecipe(addition);
    }

    const savedRecipesInRecipe =
      (await Database.shared().recipesInRecipeArray(recipe)) ?? [];

    const recipeDeletions = savedRecipesInRecipe.filter((value1) => {
      return (
        recipe.recipesInRecipe?.find((value2) => {
          return value2.id === value1.sourceRecipeId;
        }) === undefined
      );
    });

    const recipeAdditions =
      recipe.recipesInRecipe?.filter((value1) => {
        return (
          savedRecipesInRecipe.find((value2) => {
            return value1.id === value2.sourceRecipeId;
          }) === undefined
        );
      }) ?? [];

    for (const deletion of recipeDeletions) {
      await Database.shared().deleteRecipeInRecipe(deletion);
    }

    for (const addition of recipeAdditions) {
      await Database.shared().putRecipeInRecipe(addition);
    }

    return recipe;
  }

  static nutritionInfo(recipe?: Recipe, perServing: boolean = false) {
    const recipeNutritionInfo = divideNutritionInfo(
      (recipe?.recipesInRecipe ?? []).reduce(
        (previousValue, currentValue) => {
          return addNutritionInfo(
            previousValue,
            RecipeInRecipe.nutritionInfo(currentValue)
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
      ),
      perServing ? recipe?.servingCount ?? 1 : 1
    );
    return addNutritionInfo(
      recipeNutritionInfo,
      divideNutritionInfo(
        (recipe?.ingredientsInRecipe ?? []).reduce(
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
        ),
        perServing ? recipe?.servingCount ?? 1 : 1
      )
    );
  }
}
