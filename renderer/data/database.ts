import Dexie, { Collection, Table } from "dexie";
import {
  dexieIngredientSchema,
  Ingredient,
  IngredientInterface,
} from "./models/ingredient";
import {
  dexieIngredientInRecipeSchema,
  IngredientInRecipe,
  IngredientInRecipeInterface,
} from "./models/ingredient-in-recipe";
import { dexieRecipeSchema, Recipe, RecipeInterface } from "./models/recipe";
import {
  dexieRecipeInRecipeSchema,
  RecipeInRecipe,
  RecipeInRecipeInterface,
} from "./models/recipe-in-recipe";

export interface QueryParameters<T> {
  limit: number;
  offset: number;
  sortBy?: keyof T;
  reverse?: boolean;
}

export class Database extends Dexie {
  private static database: Database;

  public static shared(): Database {
    if (!Database.database) {
      Database.database = new Database();
    }

    return Database.database;
  }

  constructor(
    private ingredientsTable?: Table<IngredientInterface, string>,
    private recipesTable?: Table<RecipeInterface, string>,
    private ingredientInRecipesTable?: Table<
      IngredientInRecipeInterface,
      string
    >,
    private recipeInRecipesTable?: Table<RecipeInRecipeInterface, string>
  ) {
    super("MealPlannerDatabase");

    this.version(14).stores({
      ingredientsTable: dexieIngredientSchema,
      recipesTable: dexieRecipeSchema,
      ingredientInRecipesTable: dexieIngredientInRecipeSchema,
      recipeInRecipesTable: dexieRecipeInRecipeSchema,
    });

    this.ingredientsTable?.mapToClass(Ingredient);
    this.recipesTable?.mapToClass(Recipe);
    this.ingredientInRecipesTable?.mapToClass(IngredientInRecipe);
    this.recipeInRecipesTable?.mapToClass(RecipeInRecipe);
  }

  /* Ingredients CRUD */

  async putIngredient(ingredient: IngredientInterface) {
    return await this.ingredientsTable?.put({
      id: ingredient.id,
      name: ingredient.name,
      totalPriceCents: ingredient.totalPriceCents,
      servingCount: ingredient.servingCount,
      servingMassGrams: ingredient.servingMassGrams,
      servingEnergyKilocalorie: ingredient.servingEnergyKilocalorie,
      servingFatGrams: ingredient.servingFatGrams,
      servingCarbohydrateGrams: ingredient.servingCarbohydrateGrams,
      servingProteinGrams: ingredient.servingProteinGrams,
    });
  }

  async getIngredient(ingredientId: string) {
    return await this.ingredientsTable?.get(ingredientId);
  }

  async getIngredients(keys: string[]) {
    return (await this.ingredientsTable?.bulkGet(keys))?.filter((value) => {
      return value !== undefined;
    }) as Array<IngredientInterface>;
  }

  async countOfIngredients() {
    return (await this.ingredientsTable?.count()) ?? 0;
  }

  async arrayOfIngredients(parameters: QueryParameters<IngredientInterface>) {
    var collection: Collection<IngredientInterface, string> | undefined;
    if (parameters.sortBy) {
      collection = this.ingredientsTable?.orderBy(parameters.sortBy);
      if (parameters.reverse) {
        collection = collection?.reverse();
      }
    } else {
      collection = this.ingredientsTable?.toCollection();
    }

    return await collection
      ?.offset(parameters.offset)
      .limit(parameters.limit)
      .toArray();
  }

  async filteredIngredients(query: string) {
    return this.ingredientsTable
      ?.filter((obj) => {
        return new RegExp(".*" + query.split("").join(".*") + ".*").test(
          obj.name
        );
      })
      .toArray();
  }

  async deleteIngredient(ingredientId: string) {
    await this.ingredientsTable?.delete(ingredientId);
    await this.ingredientInRecipesTable
      ?.where("ingredientId")
      .equals(ingredientId)
      .delete();
  }

  /* Recipes CRUD */

  async putRecipe(recipe: RecipeInterface) {
    return await this.recipesTable?.put({
      id: recipe.id,
      name: recipe.name,
      servingCount: recipe.servingCount,
    });
  }

  async getRecipe(recipeId: string) {
    return await this.recipesTable?.get(recipeId);
  }

  async arrayOfRecipes(parameters: QueryParameters<RecipeInterface>) {
    var collection: Collection<RecipeInterface, string> | undefined;
    if (parameters.sortBy) {
      collection = this.recipesTable?.orderBy(parameters.sortBy);
      if (parameters.reverse) {
        collection = collection?.reverse();
      }
    } else {
      collection = this.recipesTable?.toCollection();
    }

    return await collection
      ?.offset(parameters.offset)
      .limit(parameters.limit)
      .toArray();
  }

  async countOfRecipes() {
    return (await this.recipesTable?.count()) ?? 0;
  }

  async filteredRecipes(query: string) {
    return this.recipesTable
      ?.filter((obj) => {
        return new RegExp(".*" + query.split("").join(".*") + ".*").test(
          obj.name
        );
      })
      .toArray();
  }

  async deleteRecipe(recipeId: string) {
    await Database.shared().recipesTable?.delete(recipeId);
    await Database.shared()
      .ingredientInRecipesTable?.where("recipeId")
      .equals(recipeId)
      .delete();
  }

  /* Ingredient in recipe CRUD */

  async putIngredientInRecipe(ingredientInRecipe: IngredientInRecipeInterface) {
    return await this.ingredientInRecipesTable?.put({
      id: ingredientInRecipe.id,
      ingredientId: ingredientInRecipe.ingredientId,
      servingCount: ingredientInRecipe.servingCount,
      recipeId: ingredientInRecipe.recipeId,
    });
  }

  async ingredientsInRecipeArray(recipe: RecipeInterface) {
    return await this.ingredientInRecipesTable
      ?.where({ recipeId: recipe.id })
      .toArray();
  }

  async deleteIngredientInRecipe(value: IngredientInRecipeInterface) {
    await Database.shared().ingredientInRecipesTable?.delete(value.id);
  }

  /* Recipe in recipe CRUD */

  async putRecipeInRecipe(value: RecipeInRecipeInterface) {
    return await this.recipeInRecipesTable?.put({
      id: value.id,
      sourceRecipeId: value.sourceRecipeId,
      servingCount: value.servingCount,
      destinationRecipeId: value.destinationRecipeId,
    });
  }

  async recipesInRecipeArray(recipe: RecipeInterface) {
    return await this.recipeInRecipesTable
      ?.where({ destinationRecipeId: recipe.id })
      .toArray();
  }

  async deleteRecipeInRecipe(value: RecipeInRecipeInterface) {
    await Database.shared().recipeInRecipesTable?.delete(value.id);
  }
}
