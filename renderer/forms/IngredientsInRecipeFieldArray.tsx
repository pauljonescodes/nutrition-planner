import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from "@choc-ui/chakra-autocomplete";
import { FieldArray, FormikProps } from "formik";
import { nanoid } from "nanoid";
import React, { Fragment, useEffect, useState } from "react";
import { Database } from "../data/database";
import { Ingredient } from "../data/models/ingredient";
import { yupIngredientInRecipeSchema } from "../data/models/ingredient-in-recipe";
import { Recipe } from "../data/models/recipe";

interface IngredientSearch {
  results: Ingredient[];
}

interface IngredientInRecipeFieldArrayProps {
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
}

export default function IngredientsInRecipeFieldArray(
  props: IngredientInRecipeFieldArrayProps
) {
  const formikProps = props.formikProps;
  const [ingredientSearchsState, setIngredientSearchesState] = useState<
    IngredientSearch[]
  >([{ results: [] }]);

  const ingredientsInRecipe = formikProps.values.ingredientsInRecipe ?? [];

  useEffect(() => {
    const initialSearches: Array<IngredientSearch> = [];
    for (const ingredientInRecipe of ingredientsInRecipe) {
      initialSearches.push({ results: [] });
    }
    setIngredientSearchesState(initialSearches);
  }, []);

  return (
    <FieldArray name="ingredientsInRecipe">
      {(fieldArrayHelpers) => (
        <Fragment>
          <FormControl mb={3} isRequired>
            <FormLabel>{yupIngredientInRecipeSchema.spec.label}</FormLabel>
            {ingredientsInRecipe.map((value, index) => {
              const options =
                index < ingredientSearchsState.length
                  ? ingredientSearchsState[index].results?.map((value) => {
                      return value!;
                    }) ?? []
                  : [];
              return (
                <Flex key={index} mb={3}>
                  <NumberInput defaultValue={value.servingCount}>
                    <NumberInputField
                      name={`ingredientsInRecipe.${index}.servingCount`}
                      value={value.servingCount}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      placeholder={
                        yupIngredientInRecipeSchema.fields.servingCount.spec
                          .label
                      }
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormControl mx={2}>
                    <AutoComplete
                      openOnFocus
                      onChange={(_value, item) => {
                        const ingredient = (item as Item)
                          .originalValue as Ingredient;
                        formikProps.setFieldValue(
                          `ingredientsInRecipe.${index}.ingredientId`,
                          ingredient.id
                        );
                        value.ingredient = ingredient;
                      }}
                    >
                      <AutoCompleteInput
                        placeholder={
                          yupIngredientInRecipeSchema.fields.ingredientId.spec
                            .label
                        }
                        value={value.ingredient?.name}
                        onChange={async (event) => {
                          let theIngredientSearchs = ingredientSearchsState;
                          console.log(`length ${theIngredientSearchs.length}`);
                          theIngredientSearchs[index].results =
                            (await Database.shared().filteredIngredients(
                              event.target.value
                            )) ?? [];
                          setIngredientSearchesState([...theIngredientSearchs]);
                        }}
                      />
                      <AutoCompleteList>
                        {options.map((value) => {
                          return (
                            <AutoCompleteItem
                              key={value.id}
                              value={value}
                              getValue={(item) => {
                                return item.name;
                              }}
                            >
                              {value.name}
                            </AutoCompleteItem>
                          );
                        })}
                      </AutoCompleteList>
                    </AutoComplete>
                  </FormControl>

                  <IconButton
                    mt={"auto"}
                    icon={<DeleteIcon />}
                    aria-label="Remove ingredient"
                    className="text-danger p-0 m-0"
                    onClick={() => {
                      fieldArrayHelpers.remove(index);
                    }}
                  />
                </Flex>
              );
            })}
          </FormControl>
          <FormControl>
            <Center>
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
                  theIngredientSearchs.push({
                    results: [],
                  });
                  setIngredientSearchesState([...theIngredientSearchs]);
                }}
              >
                <AddIcon />
              </Button>
            </Center>
          </FormControl>
        </Fragment>
      )}
    </FieldArray>
  );
}

{
  /* <AsyncTypeahead
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
                        /> */
}
