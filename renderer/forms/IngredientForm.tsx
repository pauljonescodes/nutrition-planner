import {
  Button,
  Center,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormEvent, RefObject } from "react";
import { ValidatedFormikControlInput } from "../components/ValidatedFormikControlInput";
import { ValidatedFormikControlNumberInput } from "../components/ValidatedFormikControlNumberInput";
import {
  databaseCurrencyFormatter,
  dataid,
  ItemDocument,
} from "../data/Database";
import { ItemInferredType, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { nutritionInfoDescription } from "../data/NutritionInfo";

export interface ItemFormProps {
  item?: ItemDocument;
  onSubmit: (item: ItemInferredType) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function IngredientForm(props: ItemFormProps) {
  const thisItemId = props.item?.id ?? dataid();
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Formik<Partial<ItemDocument>>
      initialValues={{
        ...yupItemSchema.getDefault(),
        type: ItemType.ingredient,
        name: props.item?.name,
        count: props.item?.count,
        priceCents: props.item?.priceCents,
        massGrams: props.item?.massGrams,
        energyKilocalorie: props.item?.energyKilocalorie,
        fatGrams: props.item?.fatGrams,
        carbohydrateGrams: props.item?.carbohydrateGrams,
        proteinGrams: props.item?.proteinGrams,
        id: thisItemId,
      }}
      validationSchema={yupItemSchema}
      onSubmit={async (values, helpers) => {
        props.onSubmit(values as ItemInferredType);
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
              onPaste={(event) => {
                console.log(event.clipboardData.getData("text"));
              }}
            />
            <ValidatedFormikControlNumberInput
              value={
                formikProps.values.priceCents
                  ? formikProps.values.priceCents / 100
                  : undefined
              }
              error={formikProps.errors.priceCents}
              yupSchemaField={yupItemSchema.fields.priceCents}
              transform={(value) => value * 100}
              format={(value) => (value ?? 0) / 100}
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
                  {props.item?.nutrition() &&
                    nutritionInfoDescription(props.item?.nutrition())}
                </Text>
                <Text
                  color={alphaColor}
                  fontSize="sm"
                  pb={3}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {databaseCurrencyFormatter.format(
                    (props.item?.servingPriceCents() ?? 0) / 100
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
