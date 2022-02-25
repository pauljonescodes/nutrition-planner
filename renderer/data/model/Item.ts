import * as Yup from "yup";
import { ItemInItem } from "./ItemInItem";
import { ItemType } from "./ItemType";

export const dexieItemSchema =
  "&id,type,name,count,priceCents,massGrams,energyKilocalorie,fatGrams,carbohydrateGrams,proteinGrams,itemInItems";

export const yupItemSchema = Yup.object({
  id: Yup.string().label("ID").required(),
  type: Yup.mixed<ItemType>().oneOf(Object.values(ItemType)).required(),
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

export interface ItemInterface extends Yup.InferType<typeof yupItemSchema> {}

export class Item implements ItemInterface {
  id: string;
  type: ItemType;
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
    this.type = itemInterface.type;
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
