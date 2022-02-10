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
import { FormEvent } from "react";
import { Item, yupItemSchema } from "../data/model/item";
import { ItemInItemFieldArray } from "./ItemInItem/FieldArray";

export interface ItemFormProps {
  item?: Item;
  onSubmit: (item: Item) => Promise<string | undefined>;
}

export function ItemForm(props: ItemFormProps) {
  const thisItemId = props.item?.id ?? nanoid();

  return (
    <Formik<Item>
      initialValues={{
        ...yupItemSchema.getDefault(),
        ...props.item,
        id: thisItemId,
      }}
      validationSchema={yupItemSchema}
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
            <FormControl mb={3}>
              <FormLabel>{yupItemSchema.fields.name.spec.label}</FormLabel>
              <Input
                type="text"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder={yupItemSchema.fields.name.spec.label}
                name="name"
                value={formikProps.values.name as string | undefined}
                isInvalid={formikProps.errors.name ? true : false}
              />
              {formikProps.errors.name ? (
                <FormErrorMessage>{formikProps.errors.name}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupItemSchema.fields.name.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>{yupItemSchema.fields.count.spec.label}</FormLabel>
              <Input
                type="number"
                step={1}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                placeholder={yupItemSchema.fields.count.spec.label}
                name="count"
                value={formikProps.values.count as number | undefined}
                isInvalid={formikProps.errors.count ? true : false}
              />
              {formikProps.errors.count ? (
                <FormErrorMessage>{formikProps.errors.count}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupItemSchema.fields.count.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl mb={3}>
              <FormLabel
                htmlFor={yupItemSchema.fields.priceCents.spec.meta["key"]}
              >
                {yupItemSchema.fields.priceCents.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.priceCents}
                isInvalid={formikProps.errors.priceCents ? true : false}
              >
                <NumberInputField
                  name={yupItemSchema.fields.priceCents.spec.meta["key"]}
                  value={formikProps.values.priceCents}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={yupItemSchema.fields.priceCents.spec.label}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.priceCents ? (
                <FormErrorMessage>
                  {formikProps.errors.priceCents}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupItemSchema.fields.priceCents.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl mb={3}>
              <FormLabel
                htmlFor={yupItemSchema.fields.massGrams.spec.meta["key"]}
              >
                {yupItemSchema.fields.massGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.massGrams}
                isInvalid={formikProps.errors.massGrams ? true : false}
              >
                <NumberInputField
                  name={yupItemSchema.fields.massGrams.spec.meta["key"]}
                  value={formikProps.values.massGrams as number | undefined}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={yupItemSchema.fields.massGrams.spec.label}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.massGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.massGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupItemSchema.fields.massGrams.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel
                htmlFor={
                  yupItemSchema.fields.energyKilocalorie.spec.meta["key"]
                }
              >
                {yupItemSchema.fields.energyKilocalorie.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.energyKilocalorie}
                isInvalid={formikProps.errors.energyKilocalorie ? true : false}
              >
                <NumberInputField
                  name={yupItemSchema.fields.energyKilocalorie.spec.meta["key"]}
                  value={
                    formikProps.values.energyKilocalorie as number | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupItemSchema.fields.energyKilocalorie.spec.label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.energyKilocalorie ? (
                <FormErrorMessage>
                  {formikProps.errors.energyKilocalorie}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupItemSchema.fields.energyKilocalorie.spec.meta[
                      "helperText"
                    ]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel
                htmlFor={yupItemSchema.fields.fatGrams.spec.meta["key"]}
              >
                {yupItemSchema.fields.fatGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.fatGrams}
                isInvalid={formikProps.errors.fatGrams ? true : false}
              >
                <NumberInputField
                  name={yupItemSchema.fields.fatGrams.spec.meta["key"]}
                  value={formikProps.values.fatGrams as number | undefined}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={yupItemSchema.fields.fatGrams.spec.label}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.fatGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.fatGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupItemSchema.fields.fatGrams.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel
                htmlFor={
                  yupItemSchema.fields.carbohydrateGrams.spec.meta["key"]
                }
              >
                {yupItemSchema.fields.carbohydrateGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.carbohydrateGrams}
                isInvalid={formikProps.errors.carbohydrateGrams ? true : false}
              >
                <NumberInputField
                  name={yupItemSchema.fields.carbohydrateGrams.spec.meta["key"]}
                  value={
                    formikProps.values.carbohydrateGrams as number | undefined
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={
                    yupItemSchema.fields.carbohydrateGrams.spec.label
                  }
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.carbohydrateGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.carbohydrateGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {
                    yupItemSchema.fields.carbohydrateGrams.spec.meta[
                      "helperText"
                    ]
                  }
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb={3}>
              <FormLabel
                htmlFor={yupItemSchema.fields.proteinGrams.spec.meta["key"]}
              >
                {yupItemSchema.fields.proteinGrams.spec.label}
              </FormLabel>
              <NumberInput
                defaultValue={formikProps.values.proteinGrams}
                isInvalid={formikProps.errors.proteinGrams ? true : false}
              >
                <NumberInputField
                  name={yupItemSchema.fields.proteinGrams.spec.meta["key"]}
                  value={formikProps.values.proteinGrams as number | undefined}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  placeholder={yupItemSchema.fields.proteinGrams.spec.label}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formikProps.errors.proteinGrams ? (
                <FormErrorMessage>
                  {formikProps.errors.proteinGrams}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  {yupItemSchema.fields.proteinGrams.spec.meta["helperText"]}
                </FormHelperText>
              )}
            </FormControl>

            <ItemInItemFieldArray
              formikProps={formikProps}
              thisItemId={thisItemId}
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
