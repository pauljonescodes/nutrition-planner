import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { FormEvent } from "react";
import { ValidatedFormikControlInput } from "../components/ValidatedFormikControlInput";
import { ValidatedFormikControlNumberInput } from "../components/ValidatedFormikControlNumberInput";
import { Database } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { nutritionInfoDescription } from "../data/NutritionInfo";
import { ItemInItemFieldArray } from "./ItemInItem/FieldArray";

export interface RecipeFormProps {
  item?: Item;
  onSubmit: (item: Item) => Promise<string | undefined>;
}

export function RecipeForm(props: RecipeFormProps) {
  const thisItemId = props.item?.id ?? nanoid();

  return (
    <Formik<Item>
      initialValues={{
        ...yupItemSchema.getDefault(),
        ...props.item,
        type: ItemType.recipe,
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
            <ValidatedFormikControlInput
              value={formikProps.values.name}
              error={formikProps.errors.name}
              yupSchemaField={yupItemSchema.fields.name}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />

            <ValidatedFormikControlNumberInput
              value={formikProps.values.count}
              error={formikProps.errors.count}
              yupSchemaField={yupItemSchema.fields.count}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />

            <ItemInItemFieldArray
              thisItemId={thisItemId}
              formikProps={formikProps}
            />

            <Center>
              <VStack>
                <Button
                  type="submit"
                  my={4}
                  isLoading={formikProps.isSubmitting}
                >
                  Submit
                </Button>
                <Text
                  color="whiteAlpha.600"
                  fontSize="sm"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {nutritionInfoDescription(
                    Database.shared().itemNutrition(formikProps.values, true)
                  )}
                </Text>
                <Text
                  color="whiteAlpha.600"
                  fontSize="sm"
                  pb={3}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {Database.shared().formattedItemPrice(
                    formikProps.values,
                    true
                  )}{" "}
                  per serving /{" "}
                  {Database.shared().formattedItemPrice(
                    formikProps.values,
                    false
                  )}{" "}
                  total
                </Text>
              </VStack>
            </Center>
          </Form>
        );
      }}
    />
  );
}
