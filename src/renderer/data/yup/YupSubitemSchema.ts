import { InferType, lazy, number, object, Schema, string } from 'yup';
import { SubitemInterface } from '../interfaces/SubitemInterface';
import { yupItemSchema } from './YupItemSchema';

export type YupSubitemType = InferType<typeof yupSubitemSchema>;
export const yupSubitemSchema: Schema<SubitemInterface> = object({
  itemId: string(),
  item: lazy(() => yupItemSchema),
  count: number(),
});
