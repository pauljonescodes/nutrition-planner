import * as Yup from "yup";
import { ItemInItem } from "./item-in-item";

export const dexieItemSchema =
  "&id,name,count,priceCents,massGrams,energyKilocalorie,fatGrams,carbohydrateGrams,proteinGrams,itemInItems";

export const yupItemSchema = Yup.object({
  id: Yup.string().label("ID").required(),
  name: Yup.string()
    .label("Name")
    .default("")
    .meta({
      helperText: "The ingredient or recipe's name",
      key: "name",
    })
    .required(),
  count: Yup.number()
    .label("Count")
    .default(0)
    .meta({
      helperText: "Number of servings",
      key: "count",
    })
    .required(),
  priceCents: Yup.number()
    .label("Price")
    .default(0)
    .meta({
      helperText: "Cost of ingredient in lowest denomination (0 for a recipe).",
      key: "priceCents",
    })
    .required(),
  massGrams: Yup.number()
    .label("Mass")
    .default(0)
    .meta({
      helperText: "Mass in grams, or volume in mL (0 for a recipe).",
      key: "massGrams",
    })
    .required(),
  energyKilocalorie: Yup.number()
    .label("Calories")
    .default(0)
    .meta({
      helperText: "Amount of energy in grams (0 for a recipe).",
      key: "energyKilocalorie",
    })
    .required(),
  fatGrams: Yup.number()
    .label("Fat")
    .default(0)
    .meta({
      helperText: "Amount of fat in grams (0 for a recipe).",
      key: "fatGrams",
    })
    .required(),
  carbohydrateGrams: Yup.number()
    .label("Carbohydrate")
    .default(0)
    .meta({
      helperText: "Amount of carbohydrates in grams (0 for a recipe).",
      key: "carbohydrateGrams",
    })
    .required(),
  proteinGrams: Yup.number()
    .label("Protein")
    .default(0)
    .meta({
      helperText: "Amount of protein in grams (0 for a recipe).",
      key: "proteinGrams",
    })
    .required(),
});

export interface ItemInterface extends Yup.InferType<typeof yupItemSchema> {}

export class Item implements ItemInterface {
  id: string;
  name: string;
  count: number;
  priceCents: number;
  massGrams: number;
  energyKilocalorie: number;
  fatGrams: number;
  carbohydrateGrams: number;
  proteinGrams: number;
  itemInItems?: Array<ItemInItem>;

  constructor(itemInterface: ItemInterface) {
    this.id = itemInterface.id;
    this.name = itemInterface.name;
    this.count = Number(itemInterface.count);
    this.priceCents = Number(itemInterface.priceCents);
    this.massGrams = Number(itemInterface.massGrams);
    this.energyKilocalorie = Number(itemInterface.energyKilocalorie);
    this.fatGrams = Number(itemInterface.fatGrams);
    this.carbohydrateGrams = Number(itemInterface.carbohydrateGrams);
    this.proteinGrams = Number(itemInterface.proteinGrams);
  }
}
