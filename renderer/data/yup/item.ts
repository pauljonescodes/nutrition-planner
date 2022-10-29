import * as Yup from "yup";
import { ItemTypeEnum } from "../ItemTypeEnum";

export const yupItemSchema = Yup.object({
  id: Yup.string().label("ID").required(),
  type: Yup.mixed<ItemTypeEnum>()
    .oneOf(Object.values(ItemTypeEnum))
    .default(ItemTypeEnum.ingredient)
    .required(),
  name: Yup.string()
    .label("Name")
    .meta({
      placeholder: "A description",
      key: "name",
    })
    .default("")
    .required(),
  count: Yup.number()
    .label("Servings")
    .meta({
      placeholder: "Number of servings in total",
      key: "count",
    })
    .default(0)
    .required(),
  priceCents: Yup.number()
    .label("Price")
    .meta({
      placeholder: "Price of product",
      key: "priceCents",
    })
    .default(0)
    .required(),
  massGrams: Yup.number()
    .label("Mass")
    .meta({
      placeholder: "Mass in grams or volume in mL",
      key: "massGrams",
    })
    .default(0)
    .required(),
  energyKilocalorie: Yup.number()
    .label("Calories")
    .meta({
      placeholder: "Energy in kilocalories",
      key: "energyKilocalorie",
    })
    .default(0)
    .required(),
  fatGrams: Yup.number()
    .label("Fat")
    .meta({
      placeholder: "Fat in grams",
      key: "fatGrams",
    })
    .default(0)
    .required(),
  carbohydrateGrams: Yup.number()
    .label("Carb")
    .meta({
      placeholder: "Carbohydrates in grams",
      key: "carbohydrateGrams",
    })
    .default(0)
    .required(),
  proteinGrams: Yup.number()
    .label("Protein")
    .meta({
      placeholder: "Protein in grams",
      key: "proteinGrams",
    })
    .default(0)
    .required(),
});

export type ItemType = Yup.InferType<typeof yupItemSchema>;
