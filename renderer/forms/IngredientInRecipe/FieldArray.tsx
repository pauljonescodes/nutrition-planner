import { FieldArray, FormikProps } from "formik";
import { yupIngredientInRecipeSchema } from "../../data/models/ingredient-in-recipe";
import { Recipe } from "../../data/models/recipe";
import { IngredientsInRecipeField } from "./Field";

interface IngredientInRecipeFieldArrayProps {
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
}

export function IngredientsInRecipeFieldArray(
  props: IngredientInRecipeFieldArrayProps
) {
  return (
    <FieldArray name={yupIngredientInRecipeSchema.spec.meta["key"]}>
      {(fieldArrayHelpers) => (
        <IngredientsInRecipeField
          thisRecipeId={props.thisRecipeId}
          formikProps={props.formikProps}
          fieldArrayHelpers={fieldArrayHelpers}
        />
      )}
    </FieldArray>
  );
}
