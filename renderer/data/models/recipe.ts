import * as Yup from "yup";

export const dexieRecipeSchema = "&id, name, servingCount";

export const yupRecipeSchema = Yup.object({
  id: Yup.string().required().default(""),
  name: Yup.string().required().default("").label("Recipe name"),
  servingCount: Yup.number().required().default(0).label("Servings in recipe"),
});

export interface RecipeInterface
  extends Yup.InferType<typeof yupRecipeSchema> {}

export class Recipe implements RecipeInterface {
  constructor(
    public id: string,
    public name: string,
    public servingCount: number
  ) {}
}
