import { InferType, lazy, number, object, Schema, string } from 'yup';
import { SubitemInterface } from '../interfaces/SubitemInterface';
import { yupItemSchema } from './YupItemSchema';

export const yupSubitemSchema: Schema<SubitemInterface> = object({
  itemId: string(),
  item: lazy(() => yupItemSchema),
  count: number(),
});
export type YupSubitemType = InferType<typeof yupSubitemSchema>;
