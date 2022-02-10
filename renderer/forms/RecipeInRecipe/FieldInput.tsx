import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
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
import { FieldArrayRenderProps, FormikProps } from "formik";
import { useState } from "react";
import { Recipe } from "../../data/models/recipe";
import {
  RecipeInRecipe,
  yupRecipeInRecipeSchema,
} from "../../data/models/recipe-in-recipe";
import { nutritionInfoDescription } from "../../data/nutrition-info";

interface RecipeInRecipeFieldInputProps {
  value: RecipeInRecipe;
  index: number;
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
  fieldArrayHelpers: FieldArrayRenderProps;
  options: Recipe[];
  autoCompleteOnChange: (value: string) => void;
}

export function RecipeInRecipeFieldInput(props: RecipeInRecipeFieldInputProps) {
  const [selectedFieldValueName, setSelectedFieldValueName] = useState<
    string | undefined
  >(undefined);
  return (
    <Box key={props.index} mb={3}>
      <Flex>
        <NumberInput defaultValue={props.value.servingCount}>
          <NumberInputField
            name={`recipesInRecipe.${props.index}.servingCount`}
            value={props.value.servingCount}
            onChange={props.formikProps.handleChange}
            onBlur={props.formikProps.handleBlur}
            placeholder={yupRecipeInRecipeSchema.fields.servingCount.spec.label}
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
              const recipe = (item as Item).originalValue as Recipe;
              props.formikProps.setFieldValue(
                `recipesInRecipe.${props.index}.sourceRecipeId`,
                recipe.id
              );
              setSelectedFieldValueName(recipe.name);
              props.value.sourceRecipe = recipe;
            }}
          >
            <AutoCompleteInput
              placeholder={
                yupRecipeInRecipeSchema.fields.sourceRecipeId.spec.label
              }
              value={selectedFieldValueName ?? props.value.sourceRecipe?.name}
              onChange={async (event) => {
                props.autoCompleteOnChange(event.target.value);
              }}
            />
            <AutoCompleteList>
              {props.options.map((value) => {
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
          aria-label="Remove recipe"
          className="text-danger p-0 m-0"
          onClick={() => {
            props.fieldArrayHelpers.remove(props.index);
          }}
        />
      </Flex>
      <FormHelperText>
        {nutritionInfoDescription(RecipeInRecipe.nutritionInfo(props.value))}
      </FormHelperText>
    </Box>
  );
}
