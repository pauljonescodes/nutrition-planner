import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, RefObject } from "react";
import { ItemInterface, itemMultiplyNutrition } from "../../data/interfaces";
import { yupItemSchema } from "../../data/yup-schema";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { ValidatedFormikNumberControl } from "../form-controls/ValidatedFormikNumberControl";
import { PriceNutritionGrid } from "../PriceNutritionGrid";

type ItemFormProps = {
  formikProps: FormikProps<ItemInterface>;
  onPaste: (text: string) => Promise<void>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function ItemForm(props: ItemFormProps) {
  const formikProps = props.formikProps;
  const onPaste = props.onPaste;
  const servingPriceCents =
    (formikProps.values.priceCents ?? 0) / (formikProps.values.count ?? 1);
  const servingNutritionInfo = itemMultiplyNutrition(
    { ...formikProps.values },
    formikProps.values.count ?? 0
  );
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
        helperText="Paste nutrition info in this field to auto-populate."
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
        <VStack>
          <Button type="submit" my={4} isLoading={formikProps.isSubmitting}>
            Submit
          </Button>
          <PriceNutritionGrid
            priceCents={servingPriceCents}
            priceLabel={"per serving"}
            nutritionInfo={servingNutritionInfo}
          />
        </VStack>
      </Center>
    </Form>
  );
}
