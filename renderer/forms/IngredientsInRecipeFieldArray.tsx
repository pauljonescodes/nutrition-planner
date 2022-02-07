import { IconPlus, IconX } from "@tabler/icons";
import { ErrorMessage, FieldArray, FormikProps } from "formik";
import { nanoid } from "nanoid";
import React, { Fragment, useState } from "react";
import { Database } from "../data/database";
import { Ingredient } from "../data/models/ingredient";
import { yupIngredientInRecipeSchema } from "../data/models/ingredient-in-recipe";
import { RecipeFormValue } from "./RecipeForm";

interface IngredientSearch {
  results?: Ingredient[];
}

interface IngredientInRecipeFieldArrayProps {
  thisRecipeId: string;
  formikProps: FormikProps<RecipeFormValue>;
}

export default function IngredientsInRecipeFieldArray(
  props: IngredientInRecipeFieldArrayProps
) {
  const formikProps = props.formikProps;
  const [ingredientSearchsState, setIngredientSearchesState] = useState<
    IngredientSearch[]
  >([{ results: [] }]);

  return (
    <FieldArray name="ingredientsInRecipe">
      {(fieldArrayHelpers) => (
        <Fragment>
          <Form.Group className="mb-2">
            <Form.Label>{yupIngredientInRecipeSchema.spec.label}</Form.Label>
            {(formikProps.values.ingredientsInRecipe?.length ?? 0) > 0 &&
              formikProps.values.ingredientsInRecipe?.map((_value, index) => {
                const options =
                  index < ingredientSearchsState.length
                    ? ingredientSearchsState[index].results?.map((value) => {
                        return value.name ?? "";
                      }) ?? []
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
                          min={1}
                          onChange={formikProps.handleChange}
                          onBlur={formikProps.handleBlur}
                          placeholder={
                            yupIngredientInRecipeSchema.fields.servingCount.spec
                              .label
                          }
                          value={
                            formikProps.values.ingredientsInRecipe[index]
                              .servingCount
                          }
                          name={`ingredientsInRecipe.${index}.servingCount`}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <AsyncTypeahead
                          placeholder={
                            yupIngredientInRecipeSchema.fields.ingredientId.spec
                              .label
                          }
                          defaultInputValue={
                            formikProps.values.ingredientsInRecipe[index]
                              .ingredient.name
                          }
                          onBlur={() => {
                            formikProps.handleBlur(
                              `ingredientsInRecipe.${index}.ingredientId`
                            );
                          }}
                          id={`ingredientsInRecipe.${index}.ingredientId`}
                          isLoading={false}
                          onSearch={async (query) => {
                            let theIngredientSearchs = ingredientSearchsState;
                            theIngredientSearchs[index].results =
                              await Database.shared().filteredIngredients(
                                query
                              );
                            setIngredientSearchesState([
                              ...theIngredientSearchs,
                            ]);
                          }}
                          options={options}
                          filterBy={() => true}
                          onChange={(e) => {
                            const ingredient = ingredientSearchsState[
                              index
                            ].results?.find((value) => value.name === e[0]);
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
              })}
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
                  id: nanoid(),
                  ingredientId: "",
                  recipeId: props.thisRecipeId,
                });
                let theIngredientSearchs = ingredientSearchsState;
                theIngredientSearchs.push({});
                setIngredientSearchesState([...theIngredientSearchs]);
              }}
            >
              <IconPlus />
            </Button>
          </Form.Group>
        </Fragment>
      )}
    </FieldArray>
  );
}
