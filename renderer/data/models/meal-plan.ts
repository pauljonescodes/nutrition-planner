import { AbstractEntity } from "./abstract-entity";

export class MealPlan extends AbstractEntity {
  static schema = "&id";
  constructor(id?: string) {
    super(id);
  }
}
