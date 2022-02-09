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
import {
  IngredientInterface,
  yupIngredientSchema,
} from "../data/models/ingredient";

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
              <FormLabel htmlFor="name">
                {yupIngredientSchema.fields.name.spec.label}
              </FormLabel>
              <Input
                autoFocus
                type="text"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="name"
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
              <FormLabel htmlFor="priceCents">
                {yupIngredientSchema.fields.totalPriceCents.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="priceCents"
                placeholder={
                  yupIngredientSchema.fields.totalPriceCents.spec.label
                }
                value={formikProps.values.totalPriceCents as number | undefined}
                isInvalid={formikProps.errors.totalPriceCents ? true : false}
              />
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
              <FormLabel htmlFor="servingCount">
                {yupIngredientSchema.fields.servingCount.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingCount"
                placeholder={yupIngredientSchema.fields.servingCount.spec.label}
                value={formikProps.values.servingCount as number | undefined}
                isInvalid={formikProps.errors.servingCount ? true : false}
              />
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
              <FormLabel htmlFor="servingMassGrams">
                {yupIngredientSchema.fields.servingMassGrams.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingMassGrams"
                placeholder={
                  yupIngredientSchema.fields.servingMassGrams.spec.label
                }
                value={
                  formikProps.values.servingMassGrams as number | undefined
                }
                isInvalid={formikProps.errors.servingMassGrams ? true : false}
              />
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
              <FormLabel htmlFor="servingEnergyKilocalorie">
                {yupIngredientSchema.fields.servingEnergyKilocalorie.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                placeholder={
                  yupIngredientSchema.fields.servingEnergyKilocalorie.spec.label
                }
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingEnergyKilocalorie"
                value={
                  formikProps.values.servingEnergyKilocalorie as
                    | number
                    | undefined
                }
                isInvalid={
                  formikProps.errors.servingEnergyKilocalorie ? true : false
                }
              />
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
              <FormLabel htmlFor="servingFatGrams">
                {yupIngredientSchema.fields.servingFatGrams.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                placeholder={
                  yupIngredientSchema.fields.servingFatGrams.spec.label
                }
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingFatGrams"
                value={formikProps.values.servingFatGrams as number | undefined}
                isInvalid={formikProps.errors.servingFatGrams ? true : false}
              />
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
              <FormLabel htmlFor="servingCarbohydrateGrams">
                {yupIngredientSchema.fields.servingCarbohydrateGrams.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name="servingCarbohydrateGrams"
                placeholder={
                  yupIngredientSchema.fields.servingCarbohydrateGrams.spec.label
                }
                value={
                  formikProps.values.servingCarbohydrateGrams as
                    | number
                    | undefined
                }
                isInvalid={
                  formikProps.errors.servingCarbohydrateGrams ? true : false
                }
              />
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
              <FormLabel htmlFor="servingProteinGrams">
                {yupIngredientSchema.fields.servingProteinGrams.spec.label}
              </FormLabel>
              <Input
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder={
                  yupIngredientSchema.fields.servingProteinGrams.spec.label
                }
                name="servingProteinGrams"
                value={
                  formikProps.values.servingProteinGrams as number | undefined
                }
                isInvalid={
                  formikProps.errors.servingProteinGrams ? true : false
                }
              />
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
