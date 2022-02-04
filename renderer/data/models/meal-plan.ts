import { AbstractEntity } from "./abstract-entity";

export class MealPlan extends AbstractEntity {
  static dexieSchema = "&id";
  constructor(id?: string) {
    super(id);
  }
}
