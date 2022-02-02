import Dexie, { Table } from "dexie";
import { Ingredient } from "./models/ingredient";
import { IngredientsToRecipes } from "./models/ingredients-to-recipes";
import { MealPlan } from "./models/meal-plan";
import { Recipe } from "./models/recipe";
import { RecipesToMealPlans } from "./models/recipes-to-meal-plans";

export class Database extends Dexie {
  public ingredients!: Table<Ingredient, string>;
  public recipes!: Table<Recipe, string>;
  public ingredientsToRecipes!: Table<IngredientsToRecipes, string>;
  public mealPlans!: Table<MealPlan, string>;
  public recipesToMealPlans!: Table<RecipesToMealPlans, string>;

  constructor() {
    super("db");

    this.version(9).stores({
      ingredients: Ingredient.schema,
      recipes: Recipe.schema,
      ingredientsToRecipes: IngredientsToRecipes.schema,
      mealPlans: MealPlan.schema,
      recipesToMealPlans: RecipesToMealPlans.schema,
    });

    this.ingredients.mapToClass(Ingredient);
    this.recipes.mapToClass(Recipe);
    this.ingredientsToRecipes.mapToClass(IngredientsToRecipes);
    this.mealPlans.mapToClass(MealPlan);
    this.recipesToMealPlans.mapToClass(RecipesToMealPlans);
  }

  private static database: Database;

  public static shared(): Database {
    if (!Database.database) {
      Database.database = new Database();
    }

    return Database.database;
  }
}
