import { AbstractEntity } from "./abstract-entity";

export class IngredientsToRecipes extends AbstractEntity {
  static schema = "&id, recipeId, ingredientId";
  constructor(
    public ingredientId: string,
    public recipeId: string,
    public id?: string
  ) {
    super(id);
  }
}
