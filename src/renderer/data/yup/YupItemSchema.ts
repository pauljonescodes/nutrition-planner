import {
  array,
  date,
  InferType,
  mixed,
  number,
  object,
  Schema,
  string,
} from 'yup';
import { ItemInterface } from '../interfaces/ItemInterface';
import { ItemTypeEnum } from '../interfaces/ItemTypeEnum';
import { yupSubitemSchema } from './YupSubitemSchema';

export type YupItemType = InferType<typeof yupItemSchema>;
export const yupItemSchema: Schema<ItemInterface> = object({
  id: string().label('ID'),
  date: string().label('Date').meta({
    placeholder: 'Date & time',
    key: 'date',
  }),
  type: mixed<ItemTypeEnum>().oneOf(Object.values(ItemTypeEnum)),
  name: string(),
  priceCents: number(),
  count: number(),
  massGrams: number(),
  energyKilocalories: number(),
  fatGrams: number(),
  saturatedFatGrams: number(),
  transFatGrams: number(),
  cholesterolMilligrams: number(),
  sodiumMilligrams: number(),
  carbohydrateGrams: number(),
  fiberGrams: number(),
  sugarGrams: number(),
  proteinGrams: number(),
  subitems: array().of(yupSubitemSchema).default([]),
});
