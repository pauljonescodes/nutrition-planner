import {
  Button,
  Center,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormEvent, RefObject } from "react";
import { dataid } from "../../data/dataid";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { ValidatedFormikNumberControl } from "../form-controls/ValidatedFormikNumberControl";

export interface ItemFormProps {
  item: Partial<ItemInferredType> | null;
  onSubmit: (item: Partial<ItemInferredType>) => void;
  firstInputFieldRef?: RefObject<HTMLInputElement>;
}

export function IngredientForm(props: ItemFormProps) {
  const thisItemId = props.item?.id ?? dataid();
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");
  const numberFormatter = new Intl.NumberFormat();

  return (
    <Formik<Partial<ItemInferredType>>
      initialValues={{
        ...yupItemSchema.getDefault(),
        type: ItemTypeEnum.ingredient,
        subitems: [],
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
            <ValidatedFormikControl
              value={formikProps.values.name}
              error={formikProps.errors.name}
              yupSchemaField={yupItemSchema.fields.name}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
              inputFieldRef={props.firstInputFieldRef}
            />
            <ValidatedFormikNumberControl
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
            <ValidatedFormikNumberControl
              value={formikProps.values.count}
              error={formikProps.errors.count}
              yupSchemaField={yupItemSchema.fields.count}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.massGrams}
              error={formikProps.errors.massGrams}
              yupSchemaField={yupItemSchema.fields.massGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.energyKilocalorie}
              error={formikProps.errors.energyKilocalorie}
              yupSchemaField={yupItemSchema.fields.energyKilocalorie}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />

            <ValidatedFormikNumberControl
              value={formikProps.values.fatGrams}
              error={formikProps.errors.fatGrams}
              yupSchemaField={yupItemSchema.fields.fatGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.carbohydrateGrams}
              error={formikProps.errors.carbohydrateGrams}
              yupSchemaField={yupItemSchema.fields.carbohydrateGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
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
                  {/* {props.item?.nutrition() &&
                    nutritionInfoDescription(props.item?.nutrition())} */}
                </Text>
                <Text
                  color={alphaColor}
                  fontSize="sm"
                  pb={3}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {/* {numberFormatter.format(
                    (props.item?.servingPriceCents() ?? 0) / 100
                  )}{" "}
                  / serving */}
                </Text>
              </VStack>
            </Center>
          </Form>
        );
      }}
    />
  );
}
