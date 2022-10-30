import * as Yup from "yup";
import { ItemTypeEnum } from "../ItemTypeEnum";

export const yupSubitemSchema = Yup.object({
  item: Yup.string().meta({
    placeholder: "",
    key: "subitems.item",
  }),
  count: Yup.number().label("Servings").meta({
    placeholder: "Number of servings of subitem",
    key: "subitems.count",
  }),
});

export const yupItemSchema = Yup.object({
  id: Yup.string().label("ID").required(),
  type: Yup.mixed<ItemTypeEnum>().oneOf(Object.values(ItemTypeEnum)).required(),
  name: Yup.string()
    .label("Name")
    .meta({
      placeholder: "A description",
      key: "name",
    })
    .required(),
  count: Yup.number()
    .label("Servings")
    .meta({
      placeholder: "Number of servings in total",
      key: "count",
    })
    .required(),
  priceCents: Yup.number()
    .label("Price")
    .meta({
      placeholder: "Price of product",
      key: "priceCents",
    })
    .required(),
  massGrams: Yup.number()
    .label("Mass")
    .meta({
      placeholder: "Mass in grams or volume in mL",
      key: "massGrams",
    })
    .required(),
  energyKilocalorie: Yup.number()
    .label("Calories")
    .meta({
      placeholder: "Energy in kilocalories",
      key: "energyKilocalorie",
    })
    .required(),
  fatGrams: Yup.number()
    .label("Fat")
    .meta({
      placeholder: "Fat in grams",
      key: "fatGrams",
    })
    .required(),
  carbohydrateGrams: Yup.number()
    .label("Carb")
    .meta({
      placeholder: "Carbohydrates in grams",
      key: "carbohydrateGrams",
    })
    .required(),
  proteinGrams: Yup.number()
    .label("Protein")
    .meta({
      placeholder: "Protein in grams",
      key: "proteinGrams",
    })
    .required(),
  subitems: Yup.array()
    .default([])
    .meta({
      key: "subitems",
    })
    .label("Ingredients")
    .of(yupSubitemSchema),
});

export type ItemInferredType = Yup.InferType<typeof yupItemSchema>;
export type SubitemInferredType = Yup.InferType<typeof yupSubitemSchema>;
