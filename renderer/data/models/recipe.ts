import { Database } from "../database";
import { AbstractEntity } from "./abstract-entity";
import { IngredientInRecipe } from "./ingredient-in-recipe";

export class Recipe extends AbstractEntity {
  static dexieSchema = "&id, name, servingCount";

  ingredientsInRecipe: IngredientInRecipe[];

  constructor(public name: string, public servingCount: number, id?: string) {
    super(id);
    this.ingredientsInRecipe = [];
  }

  async getIngredientsInRecipe() {
    return await Database.shared()
      .ingredientInRecipes.where({ recipeId: this.id })
      .toArray();
  }

  async getRecipesInRecipes() {
    return await Database.shared()
      .recipeInRecipes.where({ parentRecipeId: this.id })
      .toArray();
  }
}
