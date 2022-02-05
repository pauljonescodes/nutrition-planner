import { Formik } from "formik";
import { nanoid } from "nanoid";
import React, { FormEvent } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { IngredientInRecipeInterface } from "../data/models/ingredient-in-recipe";
import { RecipeInterface, yupRecipeSchema } from "../data/models/recipe";
import IngredientsInRecipeFieldArray from "./IngredientsInRecipeFieldArray";

export interface CreateRecipeFormProps {
  recipe?: RecipeInterface;
  onSubmit: (formValue: CreateRecipeFormValue) => void;
}

export interface CreateRecipeFormValue extends RecipeInterface {
  ingredientsInRecipe: Array<IngredientInRecipeInterface>;
}

export function RecipeForm(props: CreateRecipeFormProps) {
  const thisRecipeId = props.recipe?.id ?? nanoid();
  return (
    <Formik<CreateRecipeFormValue>
      initialValues={{
        id: thisRecipeId,
        name: props.recipe?.name ?? "",
        servingCount: props.recipe?.servingCount ?? 1,
        ingredientsInRecipe: [
          {
            servingCount: 1,
            recipeId: thisRecipeId,
            id: nanoid(),
            ingredientId: "",
          },
        ],
      }}
      validationSchema={yupRecipeSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit(values);
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        return (
          <Form
            onSubmit={(e) => {
              formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
            }}
          >
            <Form.Group className="mb-2">
              <FloatingLabel label={yupRecipeSchema.fields.name.spec.label}>
                <Form.Control
                  type="text"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={yupRecipeSchema.fields.name.spec.label}
                  name="name"
                  value={formikProps.values.name as string | undefined}
                  isInvalid={formikProps.errors.name ? true : false}
                  isValid={
                    formikProps.touched.name &&
                    !formikProps.errors.name &&
                    formikProps.values.name !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <FloatingLabel
                label={yupRecipeSchema.fields.servingCount.spec.label}
              >
                <Form.Control
                  type="number"
                  step={1}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={yupRecipeSchema.fields.servingCount.spec.label}
                  name="servingCount"
                  value={formikProps.values.servingCount as number | undefined}
                  isInvalid={formikProps.errors.servingCount ? true : false}
                  isValid={
                    formikProps.touched.servingCount &&
                    !formikProps.errors.servingCount &&
                    formikProps.values.servingCount !== undefined
                  }
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                {formikProps.errors.servingCount}
              </Form.Control.Feedback>
            </Form.Group>

            <IngredientsInRecipeFieldArray
              formikProps={formikProps}
              thisRecipeId={thisRecipeId}
            />

            <Form.Group className="text-center d-grid">
              <Button type="submit" size="lg" onClick={() => {}}>
                Submit
              </Button>
            </Form.Group>
          </Form>
        );
      }}
    />
  );
}
