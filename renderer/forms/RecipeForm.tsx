import { IconPlus, IconX } from "@tabler/icons";
import { ErrorMessage, FieldArray, Formik } from "formik";
import React, { FormEvent, Fragment, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import * as Yup from "yup";
import { Database } from "../data/database";
import { Ingredient } from "../data/models/ingredient";
import { Recipe } from "../data/models/recipe";

export interface CreateRecipeFormProps {
  recipe?: Recipe;
  onSubmit: (recipe: Recipe) => void;
}

interface IngredientSearch {
  results?: Ingredient[];
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

  const [ingredientSearchs, setIngredientSearches] = useState<
    IngredientSearch[]
  >([{}]);

  return (
    <Formik<Partial<Recipe>>
      initialValues={{
        name: props.recipe?.name,
        servingCount: props.recipe?.servingCount,
        ingredientsInRecipe: props.recipe?.ingredientsInRecipe,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        props.onSubmit(values as Recipe);
        console.log(values);
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

            <Form.Group className="mb-2">
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
                  <Form.Group className="mb-2">
                    <Form.Label>
                      {validationSchema.fields.ingredientsInRecipe.spec.label}
                    </Form.Label>
                    {(formikProps.values.ingredientsInRecipe?.length ?? 0) >
                      0 &&
                      formikProps.values.ingredientsInRecipe?.map(
                        (_value, index) => {
                          const options =
                            index <= ingredientSearchs.length
                              ? ingredientSearchs[index].results?.map(
                                  (value) => {
                                    return value.name;
                                  }
                                ) ?? []
                              : [];
                          return (
                            <Row
                              key={index}
                              className="align-items-center text-center gx-1 mb-1"
                            >
                              <Col xs={3}>
                                <Form.Group>
                                  <Form.Control
                                    type="number"
                                    step={1}
                                    defaultValue={1}
                                    min={1}
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    placeholder={
                                      validationSchema.fields
                                        .ingredientsInRecipe.innerType?.fields
                                        .servingCount.spec.label
                                    }
                                    name={`ingredientsInRecipe.${index}.servingCount`}
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <AsyncTypeahead
                                    placeholder={
                                      validationSchema.fields
                                        .ingredientsInRecipe.innerType?.fields
                                        .ingredientId.spec.label
                                    }
                                    onBlur={() => {
                                      formikProps.handleBlur(
                                        `ingredientsInRecipe.${index}.ingredientId`
                                      );
                                    }}
                                    id={`ingredientsInRecipe.${index}.ingredientId`}
                                    isLoading={false}
                                    onSearch={async (query) => {
                                      let theIngredientSearchs =
                                        ingredientSearchs;
                                      const results = await Database.shared()
                                        .ingredients.where("name")
                                        .startsWithAnyOfIgnoreCase(query)
                                        .toArray();
                                      theIngredientSearchs[index].results =
                                        results;
                                      setIngredientSearches(
                                        theIngredientSearchs
                                      );
                                    }}
                                    options={options}
                                    filterBy={() => true}
                                    onChange={(e) => {
                                      const ingredient = ingredientSearchs[
                                        index
                                      ].results?.find(
                                        (value) => value.name === e[0]
                                      );
                                      formikProps.setFieldValue(
                                        `ingredientsInRecipe.${index}.ingredientId`,
                                        ingredient?.id
                                      );
                                    }}
                                  />

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
                                  onClick={() => {
                                    fieldArrayHelpers.remove(index);
                                  }}
                                >
                                  <IconX />
                                </Button>
                              </Col>
                            </Row>
                          );
                        }
                      )}
                  </Form.Group>
                  <Form.Group className="text-center mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-success p-0"
                      onClick={() => {
                        fieldArrayHelpers.push({
                          servingCount: 1,
                          ingredientId: "",
                        });
                        let theIngredientSearchs = ingredientSearchs;
                        theIngredientSearchs.push({});
                        setIngredientSearches(theIngredientSearchs);
                        console.log(theIngredientSearchs);
                      }}
                    >
                      <IconPlus />
                    </Button>
                  </Form.Group>
                </Fragment>
              )}
            </FieldArray>

            <Form.Group className="text-center d-grid">
              <Button
                type="submit"
                size="lg"
                onClick={() => {
                  console.log(formikProps.errors);
                }}
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        );
      }}
    />
  );
}
