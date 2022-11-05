import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import {
  addNutritionInfo,
  baseNutritionInfo,
  CalculationTypeEnum,
  divideNutritionInfo,
  multiplyNutritionInfo,
  NutritionInfo,
} from "../nutrition-info";
import { ItemInferredType } from "../yup/item";

export type ItemDocumentMethods = {
  nutritionInfo: () => NutritionInfo;
  calculatedNutritionInfo: (
    calcType: CalculationTypeEnum
  ) => Promise<NutritionInfo>;
  calculatedPriceCents: (calcType: CalculationTypeEnum) => Promise<number>;
  populateSubitems: () => Promise<RxDocument<ItemInferredType>> | null;
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
    date: {
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
    energyKilocalories: {
      type: "number",
    },
    fatGrams: {
      type: "number",
    },
    saturatedFatGrams: {
      type: "number",
    },
    transFatGrams: {
      type: "number",
    },
    cholesterolMilligrams: {
      type: "number",
    },
    sodiumMilligrams: {
      type: "number",
    },
    carbohydrateGrams: {
      type: "number",
    },
    fiberGrams: {
      type: "number",
    },
    sugarGrams: {
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
          itemId: {
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
      energyKilocalories: this.energyKilocalories,
      fatGrams: this.fatGrams,
      saturatedFatGrams: this.saturatedFatGrams,
      transFatGrams: this.transFatGrams,
      cholesterolMilligrams: this.cholesterolMilligrams,
      sodiumMilligrams: this.sodiumMilligrams,
      carbohydrateGrams: this.carbohydrateGrams,
      fiberGrams: this.fiberGrams,
      sugarGrams: this.sugarGrams,
      proteinGrams: this.proteinGrams,
    };
  },
  calculatedNutritionInfo: async function (
    this: ItemDocument,
    calcType: CalculationTypeEnum
  ): Promise<NutritionInfo> {
    const thisSubitems = this.subitems ?? [];
    if (thisSubitems.length === 0) {
      switch (calcType) {
        case CalculationTypeEnum.perServing:
          return this.nutritionInfo();
        case CalculationTypeEnum.total:
          return multiplyNutritionInfo(this.nutritionInfo(), this.count);
      }
    } else {
      var accumulatedNutritionInfo: NutritionInfo = baseNutritionInfo();

      for (const subitem of thisSubitems ?? []) {
        const item = await this.collection.findOne(subitem.itemId).exec();
        const itemNutritionInfo =
          (await item?.calculatedNutritionInfo(
            CalculationTypeEnum.perServing
          )) ?? baseNutritionInfo();
        accumulatedNutritionInfo = addNutritionInfo(
          accumulatedNutritionInfo,
          divideNutritionInfo(
            multiplyNutritionInfo(itemNutritionInfo, subitem.count ?? 0),
            calcType === CalculationTypeEnum.perServing ? this.count : 1
          )
        );
      }

      return accumulatedNutritionInfo;
    }
  },
  calculatedPriceCents: async function (
    this: ItemDocument,
    calcType: CalculationTypeEnum
  ): Promise<number> {
    const thisSubitems = this.subitems ?? [];
    if (thisSubitems.length === 0) {
      switch (calcType) {
        case CalculationTypeEnum.perServing:
          return this.priceCents / this.count;
        case CalculationTypeEnum.total:
          return this.priceCents;
      }
    } else {
      var accumulatedServingPriceCents = 0;

      for (const subitem of thisSubitems ?? []) {
        const item = await this.collection.findOne(subitem.itemId).exec();
        const itemPrice =
          (await item?.calculatedPriceCents(CalculationTypeEnum.perServing)) ??
          0;
        accumulatedServingPriceCents +=
          (itemPrice * (subitem.count ?? 0)) /
          (calcType === CalculationTypeEnum.perServing ? this.count : 1);
      }

      return accumulatedServingPriceCents;
    }
  },
  async populateSubitems(
    this: ItemDocument
  ): Promise<Promise<RxDocument<ItemInferredType>> | null> {
    if (this.subitems === undefined || this.subitems.length === 0) {
      return null;
    } else {
      const foundByIds = await this.collection.findByIds(
        this.subitems.map((value) => value.itemId!)
      );
      return null;
    }
  },
};
