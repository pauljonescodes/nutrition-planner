import { ItemInterface } from "./ItemInterface";

export interface SubitemInterface {
  itemId?: string;
  item?: ItemInterface;
  count?: number;
}
