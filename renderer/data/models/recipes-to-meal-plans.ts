import { AbstractEntity } from "./abstract-entity";

export class RecipesToMealPlans extends AbstractEntity {
  static schema = "&id, recipeId, mealPlanId";
  constructor(
    public recipeId: string,
    public mealPlanId: string,
    public id?: string
  ) {
    super(id);
  }
}
