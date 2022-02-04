import { AbstractEntity } from "./abstract-entity";

export class RecipeInRecipe extends AbstractEntity {
  static dexieSchema = "&id, parentRecipeId, servingCount, childRecipeId";
  constructor(
    public parentRecipeId: string,
    public servingCount: number,
    public childRecipeId: string,
    public id?: string
  ) {
    super(id);
  }
}
