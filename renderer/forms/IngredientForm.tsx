import {
  Button,
  Center,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { FormEvent, RefObject } from "react";
import { ValidatedFormikControlInput } from "../components/ValidatedFormikControlInput";
import { ValidatedFormikControlNumberInput } from "../components/ValidatedFormikControlNumberInput";
import { Database } from "../data/Database";
import { ItemInferredType, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { nutritionInfoDescription } from "../data/NutritionInfo";

export interface ItemFormProps {
  item?: ItemInferredType;
  onSubmit: (item: ItemInferredType) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function IngredientForm(props: ItemFormProps) {
  const thisItemId = props.item?.id ?? nanoid();
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Formik<Partial<ItemInferredType>>
      initialValues={{
        ...yupItemSchema.getDefault(),
        ...props.item,
        type: ItemType.ingredient,
        id: thisItemId,
      }}
      validationSchema={yupItemSchema}
      onSubmit={async (values, helpers) => {
        await props.onSubmit(values as ItemInferredType);
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
              inputFieldRef={props.firstInputFieldRef}
            />
            <ValidatedFormikControlNumberInput
              value={formikProps.values.priceCents}
              error={formikProps.errors.priceCents}
              yupSchemaField={yupItemSchema.fields.priceCents}
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
            <ValidatedFormikControlNumberInput
              value={formikProps.values.massGrams}
              error={formikProps.errors.massGrams}
              yupSchemaField={yupItemSchema.fields.massGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikControlNumberInput
              value={formikProps.values.energyKilocalorie}
              error={formikProps.errors.energyKilocalorie}
              yupSchemaField={yupItemSchema.fields.energyKilocalorie}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />

            <ValidatedFormikControlNumberInput
              value={formikProps.values.fatGrams}
              error={formikProps.errors.fatGrams}
              yupSchemaField={yupItemSchema.fields.fatGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikControlNumberInput
              value={formikProps.values.carbohydrateGrams}
              error={formikProps.errors.carbohydrateGrams}
              yupSchemaField={yupItemSchema.fields.carbohydrateGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikControlNumberInput
              value={formikProps.values.proteinGrams}
              error={formikProps.errors.proteinGrams}
              yupSchemaField={yupItemSchema.fields.proteinGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
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
                  color={alphaColor}
                  fontSize="sm"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {nutritionInfoDescription(
                    Database.shared().itemNutrition(
                      formikProps.values as ItemInferredType,
                      false
                    )
                  )}
                </Text>
                <Text
                  color={alphaColor}
                  fontSize="sm"
                  pb={3}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {Database.shared().formattedItemPrice(
                    formikProps.values as ItemInferredType,
                    true
                  )}{" "}
                  / serving
                </Text>
              </VStack>
            </Center>
          </Form>
        );
      }}
    />
  );
}
