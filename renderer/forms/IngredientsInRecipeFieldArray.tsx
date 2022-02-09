import { FieldArray, FormikProps } from "formik";
import React from "react";
import { yupIngredientInRecipeSchema } from "../data/models/ingredient-in-recipe";
import { Recipe } from "../data/models/recipe";
import IngredientInRecipeField from "./IngredientInRecipeField";

interface IngredientInRecipeFieldArrayProps {
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
}

export default function IngredientsInRecipeFieldArray(
  props: IngredientInRecipeFieldArrayProps
) {
  return (
    <FieldArray name={yupIngredientInRecipeSchema.spec.meta["key"]}>
      {(fieldArrayHelpers) => (
        <IngredientInRecipeField
          thisRecipeId={props.thisRecipeId}
          formikProps={props.formikProps}
          fieldArrayHelpers={fieldArrayHelpers}
        />
      )}
    </FieldArray>
  );
}
