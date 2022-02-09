import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Center, FormControl, FormLabel } from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Database } from "../data/database";
import { Ingredient } from "../data/models/ingredient";
import { yupIngredientInRecipeSchema } from "../data/models/ingredient-in-recipe";
import { Recipe } from "../data/models/recipe";
import IngredientInRecipeInput from "./IngredientInRecipeInput";

interface IngredientSearchResults {
  results: Array<Ingredient>;
}

interface IngredientInRecipeFieldProps {
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
  fieldArrayHelpers: FieldArrayRenderProps;
}

export default function IngredientInRecipeField(
  props: IngredientInRecipeFieldProps
) {
  const [ingredientSearchsState, setIngredientSearchesState] = useState<
    IngredientSearchResults[]
  >([]);

  const ingredientsInRecipe =
    props.formikProps.values.ingredientsInRecipe ?? [];

  useEffect(() => {
    setIngredientSearchesState(
      ingredientsInRecipe.map(() => ({ results: [] }))
    );
  }, []);
  return (
    <Box>
      <FormControl mb={3}>
        <FormLabel>{yupIngredientInRecipeSchema.spec.label}</FormLabel>
        {ingredientsInRecipe.map((value, index) => {
          const options =
            index < ingredientSearchsState.length
              ? ingredientSearchsState[index].results?.map((value) => {
                  return value!;
                }) ?? []
              : [];
          return (
            <IngredientInRecipeInput
              autoCompleteOnChange={async (value) => {
                let theIngredientSearchs = ingredientSearchsState;
                theIngredientSearchs[index].results =
                  (await Database.shared().filteredIngredients(value)) ?? [];
                setIngredientSearchesState([...theIngredientSearchs]);
              }}
              value={value}
              index={index}
              thisRecipeId={props.thisRecipeId}
              formikProps={props.formikProps}
              fieldArrayHelpers={props.fieldArrayHelpers}
              options={options}
            />
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
              props.fieldArrayHelpers.push({
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
    </Box>
  );
}
