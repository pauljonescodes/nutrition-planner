import {
  array,
  date,
  InferType,
  mixed,
  number,
  object,
  Schema,
  string,
} from "yup";
import { ItemInterface } from "../interfaces/ItemInterface";
import { ItemTypeEnum } from "../interfaces/ItemTypeEnum";
import { yupSubitemSchema } from "./YupSubitemSchema";

export type YupItemType = InferType<typeof yupItemSchema>;
export const yupItemSchema: Schema<ItemInterface> = object({
  id: string().label("ID"),
  date: string().label("Date").meta({
    placeholder: "Date & time",
    key: "date",
  }),
  type: mixed<ItemTypeEnum>().oneOf(Object.values(ItemTypeEnum)),
  name: string().label("Name").meta({
    placeholder: "A description",
    key: "name",
  }),
  priceCents: number().label("Price").meta({
    placeholder: "Price",
    key: "priceCents",
  }),
  count: number().label("Servings").meta({
    placeholder: "Number of servings in total",
    key: "count",
  }),
  massGrams: number().label("Mass").meta({
    placeholder: "Mass in grams or volume in mL",
    key: "massGrams",
  }),
  energyKilocalories: number().label("Calories").meta({
    placeholder: "Energy in kilocalories",
    key: "energyKilocalories",
  }),
  fatGrams: number().label("Fat").meta({
    placeholder: "Fat in grams",
    key: "fatGrams",
  }),
  saturatedFatGrams: number().label("Saturated Fat").meta({
    placeholder: "Saturated fat in grams",
    key: "saturatedFatGrams",
  }),
  transFatGrams: number().label("Trans Fat").meta({
    placeholder: "Trans fat in grams",
    key: "transFatGrams",
  }),
  cholesterolMilligrams: number().label("Cholesterol").meta({
    placeholder: "Cholesterol in mg",
    key: "cholesterolMilligrams",
  }),
  sodiumMilligrams: number().label("Sodium").meta({
    placeholder: "Sodium in g",
    key: "sodiumMilligrams",
  }),
  carbohydrateGrams: number().label("Carb").meta({
    placeholder: "Carbohydrates in grams",
    key: "carbohydrateGrams",
  }),
  fiberGrams: number().label("Fiber").meta({
    placeholder: "Fiber in grams",
    key: "fiberGrams",
  }),
  sugarGrams: number().label("Sugar").meta({
    placeholder: "Fiber in grams",
    key: "sugarGrams",
  }),
  proteinGrams: number().label("Protein").meta({
    placeholder: "Protein in grams",
    key: "proteinGrams",
  }),
  subitems: array()
    .meta({
      key: "subitems",
    })
    .label("Subitems")
    .of(yupSubitemSchema)
    .default([]),
});
