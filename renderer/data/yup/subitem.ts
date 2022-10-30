import * as Yup from "yup";

export const yupSubitemSchema = Yup.object({
  id: Yup.string().required().meta({
    key: "id",
  }),
  createdAt: Yup.date().optional(),
  item: Yup.string().meta({
    key: "item",
  }),
  count: Yup.number().label("Servings").meta({
    key: "count",
  }),
});
