import Dexie, { Table } from "dexie";
import { Ingredient } from "./models/ingredient";
import { IngredientInRecipe } from "./models/ingredient-in-recipe";
import { MealPlan } from "./models/meal-plan";
import { Recipe } from "./models/recipe";
import { RecipeInMealPlan } from "./models/recipe-in-meal-plan";
import { RecipeInRecipe } from "./models/recipe-in-recipe";

export class Database extends Dexie {
  public ingredients!: Table<Ingredient, string>;
  public recipes!: Table<Recipe, string>;
  public ingredientInRecipes!: Table<IngredientInRecipe, string>;
  public mealPlans!: Table<MealPlan, string>;
  public recipesInMealPlans!: Table<RecipeInMealPlan, string>;
  public recipeInRecipes!: Table<RecipeInRecipe, string>;

  constructor() {
    super("MealPlannerDatabase");

    this.version(11).stores({
      ingredients: Ingredient.dexieSchema,
      recipes: Recipe.dexieSchema,
      ingredientInRecipes: IngredientInRecipe.dexieSchema,
      mealPlans: MealPlan.dexieSchema,
      recipesInMealPlans: RecipeInMealPlan.dexieSchema,
      recipeInRecipes: RecipeInRecipe.dexieSchema,
    });

    this.ingredients.mapToClass(Ingredient);
    this.recipes.mapToClass(Recipe);
    this.ingredientInRecipes.mapToClass(IngredientInRecipe);
    this.mealPlans.mapToClass(MealPlan);
    this.recipesInMealPlans.mapToClass(RecipeInMealPlan);
  }

  private static database: Database;

  public static shared(): Database {
    if (!Database.database) {
      Database.database = new Database();
    }

    return Database.database;
  }
}
