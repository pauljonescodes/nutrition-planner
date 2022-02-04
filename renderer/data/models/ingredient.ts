import { AbstractEntity } from "./abstract-entity";

export class Ingredient extends AbstractEntity {
  static dexieSchema =
    "&id, name, priceCents, servingCount, servingMassGrams, servingEnergyKilocalorie, servingFatGrams, servingCarbohydrateGrams, servingProteinGrams";

  constructor(
    public name: string,
    public priceCents: number,
    public servingCount: number,
    public servingMassGrams: number,
    public servingEnergyKilocalorie: number,
    public servingFatGrams: number,
    public servingCarbohydrateGrams: number,
    public servingProteinGrams: number
  ) {
    super();
  }
}
