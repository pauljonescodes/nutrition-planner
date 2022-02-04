import { AbstractEntity } from "./abstract-entity";

export class IngredientInRecipe extends AbstractEntity {
  static dexieSchema = "&id, recipeId, servingCount, ingredientId";
  constructor(
    public ingredientId: string,
    public servingCount: number,
    public recipeId: string,
    public id?: string
  ) {
    super(id);
  }
}
