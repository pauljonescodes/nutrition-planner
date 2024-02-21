import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { dataid } from "../../utilities/dataid";
import { itemZeroNutrition } from "../interfaces/ItemHelpers";
import { ItemInterface } from "../interfaces/ItemInterface";
import { ItemTypeEnum } from "../interfaces/ItemTypeEnum";
import { YupItemType } from "../yup/YupItemSchema";

export type RxNPItemDocumentMethods = {
  recursivelyPopulateSubitems: (depth?: number) => Promise<ItemInterface>;
  recursivelyUpsertNewSubitems: (depth?: number) => Promise<ItemInterface>;
  recursivelyRemove: (depth?: number) => Promise<boolean>;
};
export type RxNPItemDocument = RxDocument<YupItemType, RxNPItemDocumentMethods>;
export type RxNPItemCollection = RxCollection<
  RxNPItemDocument,
  RxNPItemDocumentMethods,
  any,
  any
>;
export const rxnpItemSchema: RxJsonSchema<YupItemType> = {
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
  },
  required: [],
};

export const rxnpItemDocumentMethods: RxNPItemDocumentMethods = {
  recursivelyPopulateSubitems: async function (
    this: RxNPItemDocument,
    depth?: number
  ): Promise<ItemInterface> {
    const theDepth = depth ?? 0;

    if (theDepth === 32) {
      return itemZeroNutrition;
    }

    const mutableThis = this.toMutableJSON();

    if (mutableThis.subitems && mutableThis.subitems.length > 0) {
      const ids = mutableThis.subitems.map((value) => value.itemId!) ?? [];
      const findByIdsMap = await (this.collection.findByIds(ids).exec());
      for (const [subitemId, subitem] of Array.from(findByIdsMap)) {
        const populatedSubitem = await subitem.recursivelyPopulateSubitems(
          theDepth + 1
        );
        mutableThis.subitems.forEach(function (value, index) {
          if (value.itemId == subitemId) {
            mutableThis.subitems![index].item = populatedSubitem;
          }
        });
      }
    }


    return mutableThis;
  },
  recursivelyUpsertNewSubitems: async function (
    this: RxNPItemDocument,
    depth?: number
  ): Promise<ItemInterface> {
    const theDepth = depth ?? 0;

    if (theDepth === 32) {
      return itemZeroNutrition;
    }
    const mutableThis = this.toMutableJSON();

    if (mutableThis.subitems && mutableThis.subitems.length > 0) {
      const originalIds =
        mutableThis.subitems.map((value) => value.itemId!) ?? [];
      const findByOriginalIdsMap = await this.collection.findByIds(originalIds).exec();
      for (const [originalId, originalSubitem] of Array.from(
        findByOriginalIdsMap
      )) {
        const newUpsertedSubitem =
          await originalSubitem.recursivelyUpsertNewSubitems(theDepth + 1);
        mutableThis.subitems.forEach(function (value, index) {
          if (value.itemId == originalId) {
            mutableThis.subitems![index].itemId = newUpsertedSubitem.id;
            mutableThis.subitems![index].item = undefined;
          }
        });
      }
    }

    return this.collection.upsert({
      ...mutableThis,
      id: dataid(),
      type: ItemTypeEnum.copy,
    });
  },
  recursivelyRemove: async function (
    this: RxNPItemDocument,
    depth?: number
  ): Promise<boolean> {
    const theDepth = depth ?? 0;

    if (theDepth === 32) {
      return false;
    }
    if (this.subitems && this.subitems.length > 0) {
      const ids = this.subitems.map((value) => value.itemId!) ?? [];
      const findByIdsMap = await (this.collection.findByIds(ids).exec());
      for (const [subitemId, subitem] of Array.from(findByIdsMap)) {
        await subitem.recursivelyRemove(theDepth + 1);
      }
    }

    return this.remove() != undefined;
  },
};

export async function recursivelyPopulateSubitemsOfItems(
  items: Array<RxNPItemDocument>
): Promise<Array<ItemInterface>> {
  const returning: Array<ItemInterface> = [];

  if (items.length > 0) {
    const populatedSubitems = (await Promise.all(
      items.map(async (value) => {
        return await value.recursivelyPopulateSubitems();
      })
    ));

    returning.push(
      ...populatedSubitems
    );
  }

  return returning;
}
