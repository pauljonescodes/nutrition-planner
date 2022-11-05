import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { dataid } from "../dataid";
import { ItemTypeEnum } from "../ItemTypeEnum";
import {
  addNutritionInfo,
  baseNutritionInfo,
  CalculationTypeEnum,
  divideNutritionInfo,
  multiplyNutritionInfo,
  NutritionInfo,
} from "../nutrition-info";
import { ItemInferredType } from "../yup/item";
import { SubitemInferredType } from "../yup/subitem";

export type ItemDocument = RxDocument<ItemInferredType, ItemDocumentMethods>;
export type ItemCollection = RxCollection<ItemDocument, ItemDocumentMethods>;

export type ItemDocumentMethods = {
  nutritionInfo: () => NutritionInfo;
  calculatedNutritionInfo: (
    calcType: CalculationTypeEnum
  ) => Promise<NutritionInfo>;
  calculatedPriceCents: (calcType: CalculationTypeEnum) => Promise<number>;
  upsertedLogCopy: () => Promise<ItemDocument>;
};

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

  async upsertedLogCopy(this: ItemDocument): Promise<ItemDocument> {
    const thisToJson = this.toMutableJSON();
    thisToJson.id = dataid();
    thisToJson.type = ItemTypeEnum.copy;
    if (this.subitems === undefined || this.subitems.length === 0) {
      return await this.collection.upsert(thisToJson);
    } else {
      const upsertedLogCopySubitems: Array<SubitemInferredType> = [];
      for (const rawSubitem of this.subitems) {
        const foundItem = await this.collection
          .findOne(rawSubitem.itemId!)
          .exec();
        if (foundItem !== null) {
          const upsertedLogCopy = await foundItem.upsertedLogCopy();
          if (upsertedLogCopy !== null) {
            upsertedLogCopySubitems.push({
              count: rawSubitem.count ?? 0,
              itemId: upsertedLogCopy.id,
            });
          }
        }
      }
      thisToJson.subitems = upsertedLogCopySubitems;
      return await this.collection.upsert(thisToJson);
    }
  },
};
