import Dexie, { Table } from "dexie";
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
import { MacronutrientInterface } from "./models/macronutrient-interface";
import { dexieRecipeSchema, Recipe, RecipeInterface } from "./models/recipe";

export class Database extends Dexie {
  private ingredients!: Table<IngredientInterface, string>;
  private recipes!: Table<RecipeInterface, string>;
  private ingredientInRecipes!: Table<IngredientInRecipeInterface, string>;

  constructor() {
    super("MealPlannerDatabase");

    this.version(12).stores({
      ingredients: dexieIngredientSchema,
      recipes: dexieRecipeSchema,
      ingredientInRecipes: dexieIngredientInRecipeSchema,
    });

    this.ingredients.mapToClass(Ingredient);
    this.recipes.mapToClass(Recipe);
    this.ingredientInRecipes.mapToClass(IngredientInRecipe);
  }

  private static database: Database;

  public static shared(): Database {
    if (!Database.database) {
      Database.database = new Database();
    }

    return Database.database;
  }

  async arrayOfRecipes() {
    return (await this.recipes.toArray()) as Array<Recipe>;
  }

  async ingredientsInRecipeArray(recipeId: string) {
    return (await this.ingredientInRecipes
      .where({ recipeId })
      .toArray()) as Array<IngredientInRecipe>;
  }

  async deleteRecipe(recipeId: string) {
    await Database.shared().recipes.delete(recipeId);
    await Database.shared()
      .ingredientInRecipes.where("recipeId")
      .equals(recipeId)
      .delete();
  }

  async arrayOfIngredients() {
    return (await this.ingredients.toArray()) as Array<Ingredient>;
  }

  async getIngredient(ingredientId: string) {
    return (await this.ingredients.get(ingredientId)) as Ingredient;
  }

  async getRecipe(recipeId: string) {
    return (await this.recipes.get(recipeId)) as Recipe;
  }

  async getRecipeMacronutrients(
    recipeId: string
  ): Promise<MacronutrientInterface> {
    const ingredientsInRecipe = await this.ingredientsInRecipeArray(recipeId);
    const ingredients = (await this.ingredients.bulkGet(
      ingredientsInRecipe.map((value) => {
        return value.ingredientId;
      })
    )) as Array<Ingredient>;

    const macros = ingredients.reduce(
      (previousValue, currentValue) => {
        return {
          massGrams: previousValue.massGrams + currentValue.servingMassGrams,
          energyKilocalorie:
            previousValue.energyKilocalorie +
            currentValue.servingEnergyKilocalorie,
          fatGrams: previousValue.fatGrams + currentValue.servingFatGrams,
          carbohydrateGrams:
            previousValue.carbohydrateGrams +
            currentValue.servingCarbohydrateGrams,
          proteinGrams:
            previousValue.proteinGrams + currentValue.servingProteinGrams,
        };
      },
      {
        massGrams: 0,
        energyKilocalorie: 0,
        fatGrams: 0,
        carbohydrateGrams: 0,
        proteinGrams: 0,
      } as MacronutrientInterface
    );

    return macros;
  }

  async deleteIngredient(ingredientId: string) {
    await this.ingredients.delete(ingredientId);
    await this.ingredientInRecipes
      .where("ingredientId")
      .equals(ingredientId)
      .delete();
  }

  async putIngredient(ingredient: IngredientInterface) {
    return await this.ingredients.put(ingredient);
  }

  async putRecipe(recipe: RecipeInterface) {
    return await this.recipes.put(recipe);
  }

  async putIngredientInRecipe(ingredientInRecipe: IngredientInRecipeInterface) {
    return await this.ingredientInRecipes.put(ingredientInRecipe);
  }

  async updateIngredient(ingredient: IngredientInterface) {
    return await this.ingredients.update(ingredient.id, ingredient);
  }

  async updateRecipe(recipe: RecipeInterface) {
    return await this.recipes.update(recipe.id, recipe);
  }

  async filterIngredientsBy(query: string) {
    return this.ingredients
      .filter((obj) => {
        return new RegExp(".*" + query.split("").join(".*") + ".*").test(
          obj.name
        );
      })
      .toArray();
  }
}
