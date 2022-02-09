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
import { Ingredient } from "../data/models/ingredient";
import {
  IngredientInRecipe,
  yupIngredientInRecipeSchema,
} from "../data/models/ingredient-in-recipe";
import { Recipe } from "../data/models/recipe";
import { nutritionInfoDescription } from "../data/nutrition-info";

interface IngredientsInRecipeFieldInputProps {
  value: IngredientInRecipe;
  index: number;
  thisRecipeId: string;
  formikProps: FormikProps<Recipe>;
  fieldArrayHelpers: FieldArrayRenderProps;
  options: Ingredient[];
  autoCompleteOnChange: (value: string) => void;
}

export function IngredientsInRecipeFieldInput(
  props: IngredientsInRecipeFieldInputProps
) {
  const [selectedFieldValueName, setSelectedFieldValueName] = useState<
    string | undefined
  >(undefined);
  return (
    <Box key={props.index} mb={3}>
      <Flex>
        <NumberInput defaultValue={props.value.servingCount}>
          <NumberInputField
            name={`ingredientsInRecipe.${props.index}.servingCount`}
            value={props.value.servingCount}
            onChange={props.formikProps.handleChange}
            onBlur={props.formikProps.handleBlur}
            placeholder={
              yupIngredientInRecipeSchema.fields.servingCount.spec.label
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
              const ingredient = (item as Item).originalValue as Ingredient;
              props.formikProps.setFieldValue(
                `ingredientsInRecipe.${props.index}.ingredientId`,
                ingredient.id
              );
              setSelectedFieldValueName(ingredient.name);
              props.value.ingredient = ingredient;
            }}
          >
            <AutoCompleteInput
              placeholder={
                yupIngredientInRecipeSchema.fields.ingredientId.spec.label
              }
              value={selectedFieldValueName ?? props.value.ingredient?.name}
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
          aria-label="Remove ingredient"
          className="text-danger p-0 m-0"
          onClick={() => {
            props.fieldArrayHelpers.remove(props.index);
          }}
        />
      </Flex>
      <FormHelperText>
        {nutritionInfoDescription(
          IngredientInRecipe.nutritionInfo(props.value)
        )}
      </FormHelperText>
    </Box>
  );
}
