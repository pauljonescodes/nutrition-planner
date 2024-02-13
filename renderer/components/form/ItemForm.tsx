import { Button, Center, VStack } from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, RefObject } from "react";
import { ItemInterface, itemMultiplyNutrition } from "../../data/interfaces";
import { PriceNutritionGrid } from "../PriceNutritionGrid";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { ValidatedFormikNumberControl } from "../form-controls/ValidatedFormikNumberControl";

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
        isRequired={true}
        value={formikProps.values.name}
        error={formikProps.errors.name}
        name="name"
        placeholder="Name"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={props.firstInputFieldRef}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={
          formikProps.values.priceCents
            ? formikProps.values.priceCents / 100
            : undefined
        }
        error={formikProps.errors.priceCents}
        name="priceCents"
        placeholder="Price"
        transform={(value) => value * 100}
        format={(value) => (value ?? 0) / 100}
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.count}
        error={formikProps.errors.count}
        name="count"
        placeholder="Servings"
        helperText="Paste nutrition info in this field to auto-populate."
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
        onPaste={onPaste}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.massGrams}
        error={formikProps.errors.massGrams}
        name="massGrams"
        placeholder="Mass"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.energyKilocalories}
        error={formikProps.errors.energyKilocalories}
        name="energyKilocalories"
        placeholder="Energy (kcal)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.fatGrams}
        error={formikProps.errors.fatGrams}
        name="fatGrams"
        placeholder="Fat (g)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.saturatedFatGrams}
        error={formikProps.errors.saturatedFatGrams}
        name="saturatedFatGrams"
        placeholder="Saturated Fat (g)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.transFatGrams}
        error={formikProps.errors.transFatGrams}
        name="transFatGrams"
        placeholder="Trans Fat (g)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.cholesterolMilligrams}
        error={formikProps.errors.cholesterolMilligrams}
        name="cholesterolMilligrams"
        placeholder="Cholesterol (mg)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.sodiumMilligrams}
        error={formikProps.errors.sodiumMilligrams}
        name="sodiumMilligrams"
        placeholder="Sodium (mg)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.carbohydrateGrams}
        error={formikProps.errors.carbohydrateGrams}
        name="carbohydrateGrams"
        placeholder="Carbohydrates (g)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.fiberGrams}
        error={formikProps.errors.fiberGrams}
        name="fiberGrams"
        placeholder="Fiber (g)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.sugarGrams}
        error={formikProps.errors.sugarGrams}
        name="sugarGrams"
        placeholder="Sugar (g)"
        formikProps={formikProps}
        spaceProps={{ pb: 2 }}
      />
      <ValidatedFormikNumberControl
        isRequired={true}
        value={formikProps.values.proteinGrams}
        error={formikProps.errors.proteinGrams}
        name="proteinGrams"
        placeholder="Protein (g)"
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
