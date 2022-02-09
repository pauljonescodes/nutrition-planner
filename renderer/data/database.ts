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
    >
  ) {
    super("MealPlannerDatabase");

    this.version(13).stores({
      ingredientsTable: dexieIngredientSchema,
      recipesTable: dexieRecipeSchema,
      ingredientInRecipesTable: dexieIngredientInRecipeSchema,
    });

    this.ingredientsTable?.mapToClass(Ingredient);
    this.recipesTable?.mapToClass(Recipe);
    this.ingredientInRecipesTable?.mapToClass(IngredientInRecipe);
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

  async ingredientsInRecipeArray(recipeId: string) {
    return await this.ingredientInRecipesTable?.where({ recipeId }).toArray();
  }

  async deleteIngredientInRecipe(ingredientInRecipeId: string) {
    await Database.shared().ingredientInRecipesTable?.delete(
      ingredientInRecipeId
    );
  }
}

// async getRecipeMacronutrients(
//   recipeId: string
// ): Promise<MacronutrientInterface> {
//   const ingredientsInRecipe = await this.ingredientsInRecipeArray(recipeId);
//   const ingredients = (await this.ingredientsTable?.bulkGet(
//     ingredientsInRecipe.map((value) => {
//       return value.ingredientId;
//     })
//   )) as Array<Ingredient>;

//   const macros = ingredients.reduce(
//     (previousValue, currentValue) => {
//       return {
//         massGrams: previousValue.massGrams + currentValue.servingMassGrams,
//         energyKilocalorie:
//           previousValue.energyKilocalorie +
//           currentValue.servingEnergyKilocalorie,
//         fatGrams: previousValue.fatGrams + currentValue.servingFatGrams,
//         carbohydrateGrams:
//           previousValue.carbohydrateGrams +
//           currentValue.servingCarbohydrateGrams,
//         proteinGrams:
//           previousValue.proteinGrams + currentValue.servingProteinGrams,
//       };
//     },
//     {
//       massGrams: 0,
//       energyKilocalorie: 0,
//       fatGrams: 0,
//       carbohydrateGrams: 0,
//       proteinGrams: 0,
//     } as MacronutrientInterface
//   );

//   return macros;
// }
