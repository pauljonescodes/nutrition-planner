import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Center, FormControl, FormLabel } from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Database } from "../../data/database";
import { Recipe } from "../../data/models/recipe";
import {
  RecipeInRecipeInterface,
  yupRecipeInRecipeSchema,
} from "../../data/models/recipe-in-recipe";
import { RecipeInRecipeFieldInput } from "./FieldInput";

interface RecipeSearchResults {
  results: Array<Recipe>;
}

interface RecipeInRecipeFieldProps {
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
  fieldArrayHelpers: FieldArrayRenderProps;
}

export function RecipeInRecipeField(props: RecipeInRecipeFieldProps) {
  const [recipeSearchsState, setRecipeSearchesState] = useState<
    RecipeSearchResults[]
  >([]);

  const recipesInRecipe = props.formikProps.values.recipesInRecipe ?? [];

  useEffect(() => {
    setRecipeSearchesState(recipesInRecipe.map(() => ({ results: [] })));
  }, []);
  return (
    <Box>
      <FormControl mb={3}>
        <FormLabel>{yupRecipeInRecipeSchema.spec.label}</FormLabel>
        {recipesInRecipe.map((value, index) => {
          const options =
            index < recipeSearchsState.length
              ? recipeSearchsState[index].results?.map((value) => {
                  return value!;
                }) ?? []
              : [];
          return (
            <RecipeInRecipeFieldInput
              autoCompleteOnChange={async (value) => {
                let theRecipeSearchs = recipeSearchsState;
                theRecipeSearchs[index].results =
                  (await Database.shared().filteredRecipes(value)) ?? [];
                setRecipeSearchesState([...theRecipeSearchs]);
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
                destinationRecipeId: props.thisRecipeId,
              } as RecipeInRecipeInterface);
              let theRecipeSearchs = recipeSearchsState;
              theRecipeSearchs.push({
                results: [],
              });
              setRecipeSearchesState([...theRecipeSearchs]);
            }}
          >
            <AddIcon />
          </Button>
        </Center>
      </FormControl>
    </Box>
  );
}
