import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import {
  addNutritionInfo,
  divideNutritionInfo,
  multiplyNutritionInfo,
  nutritionInfo,
  NutritionInfo,
  sumNutritionInfo,
} from "../nutrition-info";
import { ItemInferredType } from "../yup/item";

export type ItemDocumentMethods = {
  nutrition: () => NutritionInfo;
  servingPriceCents: () => Promise<number>;
};

export type ItemDocument = RxDocument<ItemInferredType, ItemDocumentMethods>;
export type ItemCollection = RxCollection<ItemDocument, ItemDocumentMethods>;

export const itemDocumentSchema: RxJsonSchema<ItemDocument> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 6,
    },
    type: {
      type: "string",
    },
    createdAt: {
      format: "date-time",
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
    subitems: {
      type: "array",
      ref: "subitem",
      items: {
        type: "string",
      },
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
  servingPriceCents: async function (this: ItemDocument): Promise<number> {
    const thisSubitems = this.subitems ?? [];
    if (thisSubitems.length === 0) {
      return this.priceCents;
    } else {
      var accumulatedServingPriceCents = 0;
      const poppedSubitems = await this.populate("subitems");

      for (const subitem of poppedSubitems) {
        const price = await subitem.servingPriceCents();
        accumulatedServingPriceCents += price;
      }

      return accumulatedServingPriceCents;
    }
  },
};
