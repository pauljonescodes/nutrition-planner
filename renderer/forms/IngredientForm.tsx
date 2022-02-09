import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { nanoid } from "nanoid";
import React, { FormEvent } from "react";
import {
  IngredientInterface,
  yupIngredientSchema,
} from "../data/models/ingredient";
import { yupIngredientInRecipeSchema } from "../data/models/ingredient-in-recipe";

export interface CreateIngredientFormProps {
  ingredient?: IngredientInterface;
  onSubmit: (ingredient: IngredientInterface) => Promise<string | undefined>;
}

export function IngredientForm(props: CreateIngredientFormProps) {
  return (
    <Formik<IngredientInterface>
      initialValues={{
        ...yupIngredientSchema.getDefault(),
        ...props.ingredient,
        id: props.ingredient?.id ?? nanoid(),
      }}
      validationSchema={yupIngredientSchema}
      onSubmit={async (values, helpers) => {
        await props.onSubmit(values);
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
              <FormLabel
                htmlFor={yupIngredientSchema.fields.name.spec.meta["key"]}
              >
                {yupIngredientSchema.fields.name.spec.label}
              </FormLabel>
              <Input
                autoFocus
                type="text"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name={yupIngredientSchema.fields.name.spec.meta["key"]}
                placeholder={yupIngredientSchema.fields.name.spec.label}
                value={formikProps.values.name as string | undefined}
                isInvalid={formikProps.errors.name ? true : false}
              />
              {formikProps.errors.name ? (
                <FormErrorMessage>{formikProps.errors.name}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupIngredientSchema.fields.name.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel
                htmlFor={
                  yupIngredientSchema.fields.totalPriceCents.spec.meta["key"]
                }
              >
                {yupIngredientSchema.fields.totalPriceCents.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.totalPriceCents}
                isInvalid={formikProps.errors.totalPriceCents ? true : false}
              >
                <NumberInputField
                  name={
                    yupIngredientSchema.fields.totalPriceCents.spec.meta["key"]
                  }
                  value={
                    formikProps.values.totalPriceCents as number | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupIngredientInRecipeSchema.fields.servingCount.spec.label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.totalPriceCents ? (
                <FormErrorMessage>
                  {formikProps.errors.totalPriceCents}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupIngredientSchema.fields.totalPriceCents.spec.meta[
                      "helperText"
                    ]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel
                htmlFor={
                  yupIngredientSchema.fields.servingCount.spec.meta["key"]
                }
              >
                {yupIngredientSchema.fields.servingCount.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.servingCount}
                isInvalid={formikProps.errors.servingCount ? true : false}
              >
                <NumberInputField
                  name={
                    yupIngredientSchema.fields.servingCount.spec.meta["key"]
                  }
                  value={formikProps.values.servingCount as number | undefined}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupIngredientInRecipeSchema.fields.servingCount.spec.label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.servingCount ? (
                <FormErrorMessage>
                  {formikProps.errors.servingCount}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupIngredientSchema.fields.servingCount.spec.meta[
                      "helperText"
                    ]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel
                htmlFor={
                  yupIngredientSchema.fields.servingMassGrams.spec.meta["key"]
                }
              >
                {yupIngredientSchema.fields.servingMassGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.servingMassGrams}
                isInvalid={formikProps.errors.servingMassGrams ? true : false}
              >
                <NumberInputField
                  name={
                    yupIngredientSchema.fields.servingMassGrams.spec.meta["key"]
                  }
                  value={
                    formikProps.values.servingMassGrams as number | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupIngredientSchema.fields.servingMassGrams.spec.label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.servingMassGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.servingMassGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupIngredientSchema.fields.servingMassGrams.spec.meta[
                      "helperText"
                    ]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel
                htmlFor={
                  yupIngredientSchema.fields.servingEnergyKilocalorie.spec.meta[
                    "key"
                  ]
                }
              >
                {yupIngredientSchema.fields.servingEnergyKilocalorie.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.servingEnergyKilocalorie}
                isInvalid={
                  formikProps.errors.servingEnergyKilocalorie ? true : false
                }
              >
                <NumberInputField
                  name={
                    yupIngredientSchema.fields.servingEnergyKilocalorie.spec
                      .meta["key"]
                  }
                  value={
                    formikProps.values.servingEnergyKilocalorie as
                      | number
                      | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupIngredientSchema.fields.servingEnergyKilocalorie.spec
                      .label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.servingEnergyKilocalorie ? (
                <FormErrorMessage>
                  {formikProps.errors.servingEnergyKilocalorie}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupIngredientSchema.fields.servingEnergyKilocalorie.spec
                      .meta["helperText"]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel
                htmlFor={
                  yupIngredientSchema.fields.servingFatGrams.spec.meta["key"]
                }
              >
                {yupIngredientSchema.fields.servingFatGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.servingFatGrams}
                isInvalid={formikProps.errors.servingFatGrams ? true : false}
              >
                <NumberInputField
                  name={
                    yupIngredientSchema.fields.servingFatGrams.spec.meta["key"]
                  }
                  value={
                    formikProps.values.servingFatGrams as number | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupIngredientSchema.fields.servingFatGrams.spec.label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.servingFatGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.servingFatGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupIngredientSchema.fields.servingFatGrams.spec.meta[
                      "helperText"
                    ]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel
                htmlFor={
                  yupIngredientSchema.fields.servingCarbohydrateGrams.spec.meta[
                    "key"
                  ]
                }
              >
                {yupIngredientSchema.fields.servingCarbohydrateGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.servingCarbohydrateGrams}
                isInvalid={
                  formikProps.errors.servingCarbohydrateGrams ? true : false
                }
              >
                <NumberInputField
                  name={
                    yupIngredientSchema.fields.servingCarbohydrateGrams.spec
                      .meta["key"]
                  }
                  value={
                    formikProps.values.servingCarbohydrateGrams as
                      | number
                      | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupIngredientSchema.fields.servingCarbohydrateGrams.spec
                      .label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.servingCarbohydrateGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.servingCarbohydrateGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupIngredientSchema.fields.servingCarbohydrateGrams.spec
                      .meta["helperText"]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel
                htmlFor={
                  yupIngredientSchema.fields.servingProteinGrams.spec.meta[
                    "key"
                  ]
                }
              >
                {yupIngredientSchema.fields.servingProteinGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.servingProteinGrams}
                isInvalid={
                  formikProps.errors.servingProteinGrams ? true : false
                }
              >
                <NumberInputField
                  name={
                    yupIngredientSchema.fields.servingProteinGrams.spec.meta[
                      "key"
                    ]
                  }
                  value={
                    formikProps.values.servingProteinGrams as number | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupIngredientSchema.fields.servingProteinGrams.spec.label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.servingProteinGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.servingProteinGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupIngredientSchema.fields.servingProteinGrams.spec.meta[
                      "helperText"
                    ]
                  }
                </FormHelperText>
              )}
            </FormControl>
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
