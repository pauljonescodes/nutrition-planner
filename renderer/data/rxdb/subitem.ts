import { RxCollection, RxDocument, RxJsonSchema } from "rxdb";
import { ItemInferredType } from "../yup/item";

export type SubitemDocumentMethods = {};

export type SubitemDocument = RxDocument<
  ItemInferredType,
  SubitemDocumentMethods
>;
export type SubitemCollection = RxCollection<
  SubitemDocument,
  SubitemDocumentMethods
>;

export const subitemDocumentSchema: RxJsonSchema<SubitemDocument> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 6,
    },
    count: {
      type: "number",
    },
    item: {
      ref: "item",
      type: "string",
    },
    createdAt: {
      format: "date-time",
      type: "string",
    },
  } as any,
  required: [],
};

export const subitemDocumentMethods: SubitemDocumentMethods = {};
