import { AbstractEntity } from "./abstract-entity";

export class RecipeInMealPlan extends AbstractEntity {
  static dexieSchema = "&id, recipeId, mealPlanId";
  constructor(
    public recipeId: string,
    public mealPlanId: string,
    public id?: string
  ) {
    super(id);
  }
}
