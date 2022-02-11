import { Button, Center, HStack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { FormEvent } from "react";
import { ValidatedFormikControlInput } from "../components/ValidatedFormikControlInput";
import { ValidatedFormikControlNumberInput } from "../components/ValidatedFormikControlNumberInput";
import { Database } from "../data/database";
import { Item, yupItemSchema } from "../data/model/item";
import { nutritionInfoDescription } from "../data/nutrition-info";
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
            <HStack pb={2}>
              <ValidatedFormikControlInput
                value={formikProps.values.name}
                error={formikProps.errors.name}
                yupSchemaField={yupItemSchema.fields.name}
                formikProps={formikProps}
              />
              <ValidatedFormikControlNumberInput
                value={formikProps.values.priceCents}
                error={formikProps.errors.priceCents}
                yupSchemaField={yupItemSchema.fields.priceCents}
                formikProps={formikProps}
              />
            </HStack>

            <HStack pb={2}>
              <ValidatedFormikControlNumberInput
                value={formikProps.values.count}
                error={formikProps.errors.count}
                yupSchemaField={yupItemSchema.fields.count}
                formikProps={formikProps}
              />
              <ValidatedFormikControlNumberInput
                value={formikProps.values.massGrams}
                error={formikProps.errors.massGrams}
                yupSchemaField={yupItemSchema.fields.massGrams}
                formikProps={formikProps}
              />
              <ValidatedFormikControlNumberInput
                value={formikProps.values.energyKilocalorie}
                error={formikProps.errors.energyKilocalorie}
                yupSchemaField={yupItemSchema.fields.energyKilocalorie}
                formikProps={formikProps}
              />
            </HStack>

            <HStack pb={2}>
              <ValidatedFormikControlNumberInput
                value={formikProps.values.fatGrams}
                error={formikProps.errors.fatGrams}
                yupSchemaField={yupItemSchema.fields.fatGrams}
                formikProps={formikProps}
              />
              <ValidatedFormikControlNumberInput
                value={formikProps.values.carbohydrateGrams}
                error={formikProps.errors.carbohydrateGrams}
                yupSchemaField={yupItemSchema.fields.carbohydrateGrams}
                formikProps={formikProps}
              />
              <ValidatedFormikControlNumberInput
                value={formikProps.values.proteinGrams}
                error={formikProps.errors.proteinGrams}
                yupSchemaField={yupItemSchema.fields.proteinGrams}
                formikProps={formikProps}
              />
            </HStack>
            <Text
              color="whiteAlpha.600"
              fontSize="sm"
              pb={3}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
            >
              {nutritionInfoDescription(
                Database.shared().itemNutrition(formikProps.values, true)
              )}
            </Text>

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
