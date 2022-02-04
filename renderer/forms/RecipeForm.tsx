import { IconX } from "@tabler/icons";
import { ErrorMessage, FieldArray, Formik } from "formik";
import React, { FormEvent, Fragment } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Recipe } from "../data/models/recipe";

export interface CreateRecipeFormProps {
  recipe?: Recipe;
  onSubmit: (recipe: Recipe) => void;
}

export function RecipeForm(props: CreateRecipeFormProps) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().label("Recipe name").required(),
    servingCount: Yup.number().label("Servings in recipe").required(),
    ingredientsInRecipe: Yup.array()
      .of(
        Yup.object().shape({
          ingredientId: Yup.string().label("Ingredient").required(),
          servingCount: Yup.number().label("Servings").required(),
        })
      )
      .label("Ingredients"),
  });

  return (
    <Formik<Partial<Recipe>>
      initialValues={{
        name: props.recipe?.name,
        servingCount: props.recipe?.servingCount,
        ingredientsInRecipe: props.recipe?.ingredientsInRecipe ?? [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit(values as Recipe);
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
            <Form.Group className="mb-3">
              <FloatingLabel label={validationSchema.fields.name.spec.label}>
                <Form.Control
                  type="text"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={validationSchema.fields.name.spec.label}
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

            <Form.Group className="mb-3">
              <FloatingLabel
                label={validationSchema.fields.servingCount.spec.label}
              >
                <Form.Control
                  type="number"
                  step={1}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={validationSchema.fields.servingCount.spec.label}
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

            <FieldArray name="ingredientsInRecipe">
              {(fieldArrayHelpers) => (
                <Fragment>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {validationSchema.fields.ingredientsInRecipe.spec.label}
                    </Form.Label>
                    {formikProps.values.ingredientsInRecipe!.length > 0 &&
                      formikProps.values.ingredientsInRecipe!.map(
                        (ingredientInRecipe, index) => (
                          <Row
                            key={index}
                            className="align-items-center text-center gx-1"
                          >
                            <Col xs={3}>
                              <Form.Group>
                                <FloatingLabel
                                  label={
                                    validationSchema.fields.ingredientsInRecipe
                                      .innerType?.fields.servingCount.spec.label
                                  }
                                >
                                  <Form.Control
                                    type="number"
                                    step={1}
                                    defaultValue={1}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    placeholder={
                                      validationSchema.fields
                                        .ingredientsInRecipe.innerType?.fields
                                        .servingCount.spec.label
                                    }
                                    name={`ingredientsInRecipe.${index}.servingCount`}
                                  />
                                </FloatingLabel>
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group>
                                <FloatingLabel
                                  label={
                                    validationSchema.fields.ingredientsInRecipe
                                      .innerType?.fields.ingredientId.spec.label
                                  }
                                >
                                  <Form.Control
                                    type="text"
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    placeholder={
                                      validationSchema.fields
                                        .ingredientsInRecipe.innerType?.fields
                                        .ingredientId.spec.label
                                    }
                                    name={`ingredientsInRecipe.${index}.ingredientId`}
                                  />
                                </FloatingLabel>

                                <ErrorMessage
                                  name={`ingredientsInRecipe.${index}.ingredientId`}
                                  component={Form.Control.Feedback}
                                  className="invalid"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={1}>
                              <Button
                                size="sm"
                                variant="link"
                                className="text-danger p-0 m-0"
                                onClick={() => fieldArrayHelpers.remove(index)}
                              >
                                <IconX />
                              </Button>
                            </Col>
                          </Row>
                        )
                      )}
                  </Form.Group>
                  <Form.Group className="text-center d-grid mb-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-center"
                      onClick={() => {
                        fieldArrayHelpers.push({
                          servingCount: "",
                          ingredientId: "",
                        });
                        console.log(formikProps.values);
                      }}
                    >
                      Add Ingredient
                    </Button>
                  </Form.Group>
                </Fragment>
              )}
            </FieldArray>

            <Form.Group className="text-center d-grid">
              <Button type="submit" size="lg">
                Submit
              </Button>
            </Form.Group>
          </Form>
        );
      }}
    />
  );
}
