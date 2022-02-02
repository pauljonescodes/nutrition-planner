import { nanoid } from "nanoid";
/**
 * Abstract entity model with `id` property initialization
 * and `equals` method for entity comparisons.
 */
export abstract class AbstractEntity {
  constructor(public id?: string) {
    id ? (this.id = id) : (this.id = nanoid());
  }
}
