import * as Yup from "yup";
import { ItemTypeEnum } from "../ItemTypeEnum";
import { yupSubitemSchema } from "./subitem";

export const yupItemSchema = Yup.object({
  id: Yup.string().label("ID").required(),
  createdAt: Yup.date().optional(),
  type: Yup.mixed<ItemTypeEnum>().oneOf(Object.values(ItemTypeEnum)).required(),
  name: Yup.string()
    .label("Name")
    .meta({
      placeholder: "A description",
      key: "name",
    })
    .required(),
  priceCents: Yup.number()
    .label("Price")
    .meta({
      placeholder: "Price",
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
  count: Yup.number()
    .label("Servings")
    .meta({
      placeholder: "Number of servings in total",
      key: "count",
    })
    .required(),
  energyKilocalories: Yup.number()
    .label("Calories")
    .meta({
      placeholder: "Energy in kilocalories",
      key: "energyKilocalories",
    })
    .required(),
  fatGrams: Yup.number()
    .label("Fat")
    .meta({
      placeholder: "Fat in grams",
      key: "fatGrams",
    })
    .required(),
  saturatedFatGrams: Yup.number()
    .label("Saturated Fat")
    .meta({
      placeholder: "Saturated fat in grams",
      key: "saturatedFatGrams",
    })
    .required(),
  transFatGrams: Yup.number()
    .label("Trans Fat")
    .meta({
      placeholder: "Trans fat in grams",
      key: "transFatGrams",
    })
    .required(),
  cholesterolMilligrams: Yup.number()
    .label("Cholesterol")
    .meta({
      placeholder: "Cholesterol in mg",
      key: "cholesterolMilligrams",
    })
    .required(),
  sodiumMilligrams: Yup.number()
    .label("Sodium")
    .meta({
      placeholder: "Sodium in g",
      key: "sodiumMilligrams",
    })
    .required(),
  carbohydrateGrams: Yup.number()
    .label("Carb")
    .meta({
      placeholder: "Carbohydrates in grams",
      key: "carbohydrateGrams",
    })
    .required(),
  fiberGrams: Yup.number()
    .label("Fiber")
    .meta({
      placeholder: "Fiber in grams",
      key: "fiberGrams",
    })
    .required(),
  sugarGrams: Yup.number()
    .label("Sugar")
    .meta({
      placeholder: "Fiber in grams",
      key: "sugarGrams",
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
    .meta({
      key: "subitems",
    })
    .label("Items")
    .of(yupSubitemSchema),
});

export type ItemInferredType = Yup.InferType<typeof yupItemSchema>;
