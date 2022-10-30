import * as Yup from "yup";

export const yupSubitemSchema = Yup.object({
  itemId: Yup.string().meta({
    key: "itemId",
  }),
  count: Yup.number().label("Servings").meta({
    key: "count",
  }),
});

export type SubitemInferredType = Yup.InferType<typeof yupSubitemSchema>;
