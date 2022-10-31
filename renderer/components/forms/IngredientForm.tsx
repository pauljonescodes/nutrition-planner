import { Button, Center } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormEvent, RefObject, useState } from "react";
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

  const [initialValuesState, setInitialValuesState] = useState<
    Partial<ItemInferredType>
  >({
    id: thisItemId,
    type: ItemTypeEnum.ingredient,
    name: props.item?.name,
    priceCents: props.item?.priceCents,
    massGrams: props.item?.massGrams,
    count: props.item?.count,
    energyKilocalories: props.item?.energyKilocalories,
    fatGrams: props.item?.fatGrams,
    saturatedFatGrams: props.item?.saturatedFatGrams,
    transFatGrams: props.item?.transFatGrams,
    cholesterolMilligrams: props.item?.cholesterolMilligrams,
    sodiumMilligrams: props.item?.sodiumMilligrams,
    carbohydrateGrams: props.item?.carbohydrateGrams,
    fiberGrams: props.item?.fiberGrams,
    sugarGrams: props.item?.sugarGrams,
    proteinGrams: props.item?.proteinGrams,
    subitems: [],
  });

  return (
    <Formik<Partial<ItemInferredType>>
      enableReinitialize
      initialValues={{
        ...initialValuesState,
      }}
      validationSchema={yupItemSchema}
      onSubmit={async (values, helpers) => {
        props.onSubmit(values);
        helpers.resetForm();
      }}
      validateOnChange={false}
      validateOnBlur={false}
      component={(formikProps) => {
        async function onPaste(text: string) {
          const regExps = [
            /(?:\()(?<massGrams>\d*\.?\d*)(?:g\))/gi,
            /(?:servings.*)(?<count>\d*\.?\d*)/gi,
            /(?<count>\d*\.?\d*)(?:.*servings)/gi,
            /(?:Calories\s*)(?<energyKilocalories>\d*\.?\d*)/gi,
            /(?:Total Fat\s*)(?<fatGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Saturated Fat\s*)(?<saturatedFatGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Trans Fat\s*)(?<transFatGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Cholesterol\s*)(?<cholesterolMilligrams>\d*\.?\d*)(?:mg)/gi,
            /(?:Sodium\s*)(?<sodiumMilligrams>\d*\.?\d*)(?:mg)/gi,
            /(?:Total Carbohydrate\s*)(?<carbohydrateGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Dietary Fiber\s*)(?<fiberGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Sugars\s*)(?<sugarGrams>\d*\.?\d*)(?:g)/gi,
            /(?:Protein\s*)(?<proteinGrams>\d*\.?\d*)(?:g)/gi,
          ];

          const numberedGroups: { [key: string]: number } = {};
          for (const regExp of regExps) {
            const regExpMatchArray = regExp.exec(text);
            const matchedGroup = regExpMatchArray?.groups ?? {};
            Object.keys(matchedGroup).forEach(function (key) {
              numberedGroups[key] = +matchedGroup[key];
            });
          }

          setInitialValuesState({
            ...initialValuesState,
            ...formikProps.values,
            ...numberedGroups,
          });
          formikProps.resetForm({
            values: {
              ...initialValuesState,
              ...formikProps.values,
              ...numberedGroups,
            },
          });
        }

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
              value={formikProps.values.count}
              error={formikProps.errors.count}
              yupSchemaField={yupItemSchema.fields.count}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
              onPaste={onPaste}
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
              value={formikProps.values.massGrams}
              error={formikProps.errors.massGrams}
              yupSchemaField={yupItemSchema.fields.massGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.energyKilocalories}
              error={formikProps.errors.energyKilocalories}
              yupSchemaField={yupItemSchema.fields.energyKilocalories}
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
              value={formikProps.values.saturatedFatGrams}
              error={formikProps.errors.saturatedFatGrams}
              yupSchemaField={yupItemSchema.fields.saturatedFatGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.transFatGrams}
              error={formikProps.errors.transFatGrams}
              yupSchemaField={yupItemSchema.fields.transFatGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.cholesterolMilligrams}
              error={formikProps.errors.cholesterolMilligrams}
              yupSchemaField={yupItemSchema.fields.cholesterolMilligrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.sodiumMilligrams}
              error={formikProps.errors.sodiumMilligrams}
              yupSchemaField={yupItemSchema.fields.sodiumMilligrams}
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
              value={formikProps.values.fiberGrams}
              error={formikProps.errors.fiberGrams}
              yupSchemaField={yupItemSchema.fields.fiberGrams}
              formikProps={formikProps}
              spaceProps={{ pb: 2 }}
            />
            <ValidatedFormikNumberControl
              value={formikProps.values.sugarGrams}
              error={formikProps.errors.sugarGrams}
              yupSchemaField={yupItemSchema.fields.sugarGrams}
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
              <Button type="submit" my={4} isLoading={formikProps.isSubmitting}>
                Submit
              </Button>
            </Center>
          </Form>
        );
      }}
    />
  );
}
