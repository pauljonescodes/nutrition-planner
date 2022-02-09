import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { nanoid } from "nanoid";
import React, { FormEvent } from "react";
import { Recipe, yupRecipeSchema } from "../data/models/recipe";
import IngredientsInRecipeFieldArray from "./IngredientsInRecipeFieldArray";

export interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (ingredient: Recipe) => Promise<string | undefined>;
}

export function RecipeForm(props: RecipeFormProps) {
  const thisRecipeId = props.recipe?.id ?? nanoid();

  return (
    <Formik<Recipe>
      initialValues={{
        ...yupRecipeSchema.getDefault(),
        ...props.recipe,
        id: thisRecipeId,
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
            <FormControl mb={3} isRequired>
              <FormLabel>{yupRecipeSchema.fields.name.spec.label}</FormLabel>
              <Input
                type="text"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder={yupRecipeSchema.fields.name.spec.label}
                name="name"
                value={formikProps.values.name as string | undefined}
                isInvalid={formikProps.errors.name ? true : false}
              />
              {formikProps.errors.name ? (
                <FormErrorMessage>{formikProps.errors.name}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupRecipeSchema.fields.name.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>
                {yupRecipeSchema.fields.servingCount.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder={yupRecipeSchema.fields.servingCount.spec.label}
                name="servingCount"
                value={formikProps.values.servingCount as number | undefined}
                isInvalid={formikProps.errors.servingCount ? true : false}
              />
              {formikProps.errors.servingCount ? (
                <FormErrorMessage>
                  {formikProps.errors.servingCount}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupRecipeSchema.fields.servingCount.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>

            <IngredientsInRecipeFieldArray
              formikProps={formikProps}
              thisRecipeId={thisRecipeId}
            />

            <Center>
              <Button type="submit" mt={4} isLoading={formikProps.isSubmitting}>
                Submit
              </Button>
            </Center>
          </Form>
        );
      }}
    />
  );
}
