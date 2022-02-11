import * as Yup from "yup";
import { ItemInItem } from "./ItemInItem";
import { ItemType } from "./ItemType";

export const dexieItemSchema =
  "&id,name,count,priceCents,massGrams,energyKilocalorie,fatGrams,carbohydrateGrams,proteinGrams,itemInItems";

export const yupItemSchema = Yup.object({
  id: Yup.string().label("ID").required(),
  type: Yup.mixed<ItemType>().oneOf(Object.values(ItemType)).required(),
  name: Yup.string()
    .label("Name")
    .default("")
    .meta({
      key: "name",
    })
    .required(),
  count: Yup.number()
    .label("Serving count")
    .default(1)
    .meta({
      key: "count",
    })
    .required(),
  priceCents: Yup.number()
    .label("Price")
    .default(0)
    .meta({
      key: "priceCents",
    })
    .required(),
  massGrams: Yup.number()
    .label("Mass")
    .default(0)
    .positive()
    .meta({
      key: "massGrams",
    })
    .required(),
  energyKilocalorie: Yup.number()
    .label("Calories")
    .default(0)
    .meta({
      key: "energyKilocalorie",
    })
    .required(),
  fatGrams: Yup.number()
    .label("Fat")
    .default(0)
    .meta({
      key: "fatGrams",
    })
    .required(),
  carbohydrateGrams: Yup.number()
    .label("Carbohydrate")
    .default(0)
    .meta({
      key: "carbohydrateGrams",
    })
    .required(),
  proteinGrams: Yup.number()
    .label("Protein")
    .default(0)
    .meta({
      key: "proteinGrams",
    })
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
