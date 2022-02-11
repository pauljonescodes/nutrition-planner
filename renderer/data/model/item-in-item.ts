import * as Yup from "yup";
import { Item } from "./item";

export const dexieItemInItemSchema = "&id,sourceItemId,count,destinationItemId";

export const yupItemInItemSchema = Yup.object({
  id: Yup.string().required(),
  sourceItemId: Yup.string().required(),
  count: Yup.number().default(0).required(),
  destinationItemId: Yup.string().required(),
})
  .label("Ingredients")
  .meta({
    helperText: "",
    key: "itemInItems",
  });

export interface ItemInItemInterface
  extends Yup.InferType<typeof yupItemInItemSchema> {}

export class ItemInItem implements ItemInItemInterface {
  id: string;
  sourceItemId: string;
  count: number;
  destinationItemId: string;
  destinationItem?: Item;
  sourceItem?: Item;

  constructor(itemInItem: ItemInItemInterface) {
    this.id = itemInItem.id;
    this.sourceItemId = itemInItem.sourceItemId;
    this.count = Number(itemInItem.count);
    this.destinationItemId = itemInItem.destinationItemId;
  }
}
