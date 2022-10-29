import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import {
  addNutritionInfo,
  divideNutritionInfo,
  multiplyNutritionInfo,
  nutritionInfo,
  NutritionInfo,
  sumNutritionInfo,
} from "../nutrition-info";
import { ItemType } from "../yup/item";

export type ItemDocumentMethods = {
  nutrition: () => NutritionInfo;
  servingPriceCents: () => number;
};

export type ItemDocument = RxDocument<ItemType, ItemDocumentMethods>;
export type ItemCollection = RxCollection<ItemDocument, ItemDocumentMethods>;

export const itemDocumentSchema: RxJsonSchema<ItemDocument> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    type: {
      type: "string",
    },
    name: {
      type: "string",
    },
    count: {
      type: "number",
    },
    priceCents: {
      type: "number",
    },
    massGrams: {
      type: "number",
    },
    energyKilocalorie: {
      type: "number",
    },
    fatGrams: {
      type: "number",
    },
    carbohydrateGrams: {
      type: "number",
    },
    proteinGrams: {
      type: "number",
    },
  } as any,
  required: [],
};

export const itemDocumentMethods: ItemDocumentMethods = {
  nutrition: function (this: ItemDocument): NutritionInfo {
    if (this.count === undefined) {
      return nutritionInfo();
    }

    const base = multiplyNutritionInfo(this, this.count);
    const sub = divideNutritionInfo(
      sumNutritionInfo(
        [].map(
          (
            value // this.itemInItems
          ) => nutritionInfo() // totalItemInItemNutrition(value)
        )
      ),
      this.count
    );
    return addNutritionInfo(base, sub);
  },
  servingPriceCents: function (this: ItemDocument): number {
    return this.priceCents / this.count;
  },
};
