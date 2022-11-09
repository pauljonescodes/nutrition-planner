import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { dataid } from "./dataid";
import { ItemInterface } from "./interfaces";
import { ItemTypeEnum } from "./item-type-enum";
import { YupItemType } from "./yup-schema";

export type RxDBItemDocumentMethods = {
  recursivelyPopulateSubitems: () => Promise<ItemInterface>;
  recursivelyUpsertNewSubitems: () => Promise<ItemInterface>;
  recursivelyRemove: () => Promise<boolean>;
};
export type RxDBItemDocument = RxDocument<YupItemType, RxDBItemDocumentMethods>;
export type RxDBItemCollection = RxCollection<
  RxDBItemDocument,
  RxDBItemDocumentMethods
>;
export const rxdbItemSchema: RxJsonSchema<YupItemType> = {
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

export const rxdbItemDocumentMethods: RxDBItemDocumentMethods = {
  recursivelyPopulateSubitems: async function (
    this: RxDBItemDocument
  ): Promise<ItemInterface> {
    const mutableThis = this.toMutableJSON();

    if (mutableThis.subitems && mutableThis.subitems.length > 0) {
      const ids = mutableThis.subitems.map((value) => value.itemId!) ?? [];
      const findByIdsMap = await this.collection.findByIds(ids);
      for (const [subitemId, subitem] of Array.from(findByIdsMap)) {
        const populatedSubitem = await subitem.recursivelyPopulateSubitems();
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
    this: RxDBItemDocument
  ): Promise<ItemInterface> {
    const mutableThis = this.toMutableJSON();

    if (mutableThis.subitems && mutableThis.subitems.length > 0) {
      const originalIds =
        mutableThis.subitems.map((value) => value.itemId!) ?? [];
      const findByOriginalIdsMap = await this.collection.findByIds(originalIds);
      for (const [originalId, originalSubitem] of Array.from(
        findByOriginalIdsMap
      )) {
        const newUpsertedSubitem =
          await originalSubitem.recursivelyUpsertNewSubitems();
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
  recursivelyRemove: async function (this: RxDBItemDocument): Promise<boolean> {
    if (this.subitems && this.subitems.length > 0) {
      const ids = this.subitems.map((value) => value.itemId!) ?? [];
      const findByIdsMap = await this.collection.findByIds(ids);
      for (const [subitemId, subitem] of Array.from(findByIdsMap)) {
        await subitem.recursivelyRemove();
      }
    }

    return this.remove();
  },
};

export async function recursivelyPopulateSubitemsOfItems(
  items: Array<RxDBItemDocument>
): Promise<Array<ItemInterface>> {
  const returning: Array<ItemInterface> = [];

  if (items.length > 0) {
    returning.push(
      ...(await Promise.all(
        items.map((value) => value.recursivelyPopulateSubitems())
      ))
    );
  }

  return returning;
}
