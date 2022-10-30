import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { CalcTypeEnum } from "../CalcTypeEnum";
import {
  addNutritionInfo,
  divideNutritionInfo,
  multiplyNutritionInfo,
  nutritionInfo,
  NutritionInfo,
} from "../nutrition-info";
import { ItemInferredType } from "../yup/item";

export type ItemDocumentMethods = {
  nutritionInfo: () => NutritionInfo;
  calculatedNutritionInfo: (calcType: CalcTypeEnum) => Promise<NutritionInfo>;
  calculatedPriceCents: (calcType: CalcTypeEnum) => Promise<number>;
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
      items: {
        type: "object",
        properties: {
          count: {
            type: "number",
          },
          item: {
            ref: "item",
            type: "string",
          },
        },
      },
    },
  } as any,
  required: [],
};

export const itemDocumentMethods: ItemDocumentMethods = {
  nutritionInfo: function (this: ItemDocument): NutritionInfo {
    return {
      massGrams: this.massGrams,
      energyKilocalorie: this.energyKilocalorie,
      fatGrams: this.fatGrams,
      carbohydrateGrams: this.carbohydrateGrams,
      proteinGrams: this.proteinGrams,
    };
  },
  calculatedNutritionInfo: async function (
    this: ItemDocument,
    calcType: CalcTypeEnum
  ): Promise<NutritionInfo> {
    const thisSubitems = this.subitems ?? [];
    if (thisSubitems.length === 0) {
      switch (calcType) {
        case CalcTypeEnum.perServing:
          return divideNutritionInfo(this.nutritionInfo(), this.count);
        case CalcTypeEnum.total:
          return this.nutritionInfo();
      }
    } else {
      var accumulatedNutritionInfo: NutritionInfo = nutritionInfo();

      for (const subitem of thisSubitems ?? []) {
        const item = await this.collection.findOne(subitem.itemId).exec();
        const itemNutritionInfo =
          (await item?.calculatedNutritionInfo(calcType)) ?? nutritionInfo();
        accumulatedNutritionInfo = addNutritionInfo(
          accumulatedNutritionInfo,
          divideNutritionInfo(
            multiplyNutritionInfo(itemNutritionInfo, subitem.count ?? 0),
            calcType === CalcTypeEnum.perServing ? this.count : 1
          )
        );
      }

      return accumulatedNutritionInfo;
    }
  },
  calculatedPriceCents: async function (
    this: ItemDocument,
    calcType: CalcTypeEnum
  ): Promise<number> {
    const thisSubitems = this.subitems ?? [];
    if (thisSubitems.length === 0) {
      switch (calcType) {
        case CalcTypeEnum.perServing:
          return this.priceCents / this.count;
        case CalcTypeEnum.total:
          return this.priceCents;
      }
    } else {
      var accumulatedServingPriceCents = 0;

      for (const subitem of thisSubitems ?? []) {
        const item = await this.collection.findOne(subitem.itemId).exec();
        const itemPrice = (await item?.calculatedPriceCents(calcType)) ?? 0;
        accumulatedServingPriceCents +=
          (itemPrice * (subitem.count ?? 0)) /
          (calcType === CalcTypeEnum.perServing ? this.count : 1);
      }

      return accumulatedServingPriceCents;
    }
  },
};
