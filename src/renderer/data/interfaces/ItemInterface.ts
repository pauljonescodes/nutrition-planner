import { ItemTypeEnum } from "./ItemTypeEnum";
import { SubitemInterface } from "./SubitemInterface";

export interface ItemInterface {
  id?: string;
  date?: string;
  type?: ItemTypeEnum;
  name?: string;
  priceCents?: number;
  massGrams?: number;
  energyKilocalories?: number;
  fatGrams?: number;
  saturatedFatGrams?: number;
  transFatGrams?: number;
  cholesterolMilligrams?: number;
  sodiumMilligrams?: number;
  carbohydrateGrams?: number;
  fiberGrams?: number;
  sugarGrams?: number;
  proteinGrams?: number;
  count?: number;
  subitems?: SubitemInterface[];
}
