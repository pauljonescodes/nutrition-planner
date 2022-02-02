import { AbstractEntity } from "./abstract-entity";

export class Recipe extends AbstractEntity {
  static schema = "&id, servingCount";
  constructor(public servingCount: number, id?: string) {
    super(id);
  }
}
