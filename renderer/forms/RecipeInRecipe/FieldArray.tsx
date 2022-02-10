import { FieldArray, FormikProps } from "formik";
import { Recipe } from "../../data/models/recipe";
import { yupRecipeInRecipeSchema } from "../../data/models/recipe-in-recipe";
import { RecipeInRecipeField } from "./Field";

interface RecipeInRecipeFieldArrayProps {
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
}

export function RecipeInRecipeFieldArray(props: RecipeInRecipeFieldArrayProps) {
  return (
    <FieldArray name={yupRecipeInRecipeSchema.spec.meta["key"]}>
      {(fieldArrayHelpers) => (
        <RecipeInRecipeField
          thisRecipeId={props.thisRecipeId}
          formikProps={props.formikProps}
          fieldArrayHelpers={fieldArrayHelpers}
        />
      )}
    </FieldArray>
  );
}
