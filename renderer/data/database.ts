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
import { dexieRecipeSchema, Recipe, RecipeInterface } from "./models/recipe";

export class Database extends Dexie {
  public ingredients!: Table<IngredientInterface, string>;
  public recipes!: Table<RecipeInterface, string>;
  public ingredientInRecipes!: Table<IngredientInRecipeInterface, string>;

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
}
