import {
  Button,
  Center,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FormEvent, RefObject, useEffect, useState } from "react";
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

  const [initialValuesState, setInitialValuesState] = useState<
    Partial<ItemInferredType>
  >({
    id: thisItemId,
    type: ItemTypeEnum.ingredient,
    name: props.item?.name,
    priceCents: props.item?.priceCents,
    massGrams: props.item?.massGrams,
    count: props.item?.count,
    energyKilocalorie: props.item?.energyKilocalorie,
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

  useEffect(() => {
    console.log(initialValuesState);
  }, [initialValuesState]);

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
        function firstMatchedIntParsed(args: {
          forRegExp: RegExp;
          inString: string;
        }): number | undefined {
          const matches = args.inString.match(args.forRegExp) ?? [];
          if (matches.length > 0) {
            return parseInt(matches[0]);
          }

          return undefined;
        }

        async function onPaste(text: string) {
          const massGrams = firstMatchedIntParsed({
            forRegExp: /(?<=(Serv).+\()(.*)(?=g\))/,
            inString: text,
          });
          const count = firstMatchedIntParsed({
            forRegExp: /(?<=Servings.*)(\d+)/,
            inString: text,
          });
          const energyKilocalorie = firstMatchedIntParsed({
            forRegExp: /(?<=Calories .*)(\d+)/,
            inString: text,
          });
          const fatGrams = firstMatchedIntParsed({
            forRegExp: /(?<=Total Fat .*)(\d+)/,
            inString: text,
          });
          const saturatedFatGrams = firstMatchedIntParsed({
            forRegExp: /(?<=Saturated Fat .*)(\d+)/,
            inString: text,
          });
          const transFatGrams = firstMatchedIntParsed({
            forRegExp: /(?<=Trans Fat .*)(\d+)/,
            inString: text,
          });
          const cholesterolMilligrams = firstMatchedIntParsed({
            forRegExp: /(?<=Cholesterol .*)(\d+)/,
            inString: text,
          });
          const sodiumMilligrams = firstMatchedIntParsed({
            forRegExp: /(?<=Sodium .*)(\d+)/,
            inString: text,
          });
          const carbohydrateGrams = firstMatchedIntParsed({
            forRegExp: /(?<=Total Carbohydrate .*)(\d+)/,
            inString: text,
          });
          const fiberGrams = firstMatchedIntParsed({
            forRegExp: /(?<=Dietary Fiber .*)(\d+)/,
            inString: text,
          });
          const sugarGrams = firstMatchedIntParsed({
            forRegExp: /(?<=Sugars .*)(\d+)/,
            inString: text,
          });
          const proteinGrams = firstMatchedIntParsed({
            forRegExp: /(?<=Protein .*)(\d+)/,
            inString: text,
          });
          setInitialValuesState({
            ...initialValuesState,
            ...formikProps.values,
            massGrams,
            count,
            energyKilocalorie,
            fatGrams,
            saturatedFatGrams,
            transFatGrams,
            cholesterolMilligrams,
            sodiumMilligrams,
            carbohydrateGrams,
            fiberGrams,
            sugarGrams,
            proteinGrams,
          });
          formikProps.resetForm({
            values: {
              ...initialValuesState,
              ...formikProps.values,
              massGrams,
              count,
              energyKilocalorie,
              fatGrams,
              saturatedFatGrams,
              transFatGrams,
              cholesterolMilligrams,
              sodiumMilligrams,
              carbohydrateGrams,
              fiberGrams,
              sugarGrams,
              proteinGrams,
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
