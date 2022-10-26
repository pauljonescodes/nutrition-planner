import * as Yup from "yup";

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

export type ItemInItemInferredType = Yup.InferType<typeof yupItemInItemSchema>;
