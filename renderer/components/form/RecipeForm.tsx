import {
  Button,
  Center,
  Grid,
  GridItem,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, RefObject, useEffect, useState } from "react";
import { useRxCollection } from "rxdb-hooks";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { currencyFormatter } from "../../data/number-formatter";
import {
  baseNutritionInfo,
  CalcTypeEnum,
  divideNutritionInfo,
  multiplyNutritionInfo,
  NutritionInfo,
  sumNutritionInfo,
} from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { ValidatedFormikNumberControl } from "../form-controls/ValidatedFormikNumberControl";

type RecipeFormProps = {
  formikProps: FormikProps<Partial<ItemInferredType>>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function RecipeForm(props: RecipeFormProps) {
  const subitems = props.formikProps.values.subitems ?? [];
  const recipeServings = props.formikProps.values.count ?? 1;
  const collection = useRxCollection<ItemDocument>("item");

  const [queriedSubitemsState, setQueriedSubitemsState] = useState<Map<
    string,
    ItemDocument
  > | null>(null);
  const [calculatedNutritionInfoMapState, setCalculatedNutritionInfoMapState] =
    useState<Map<string, NutritionInfo> | null>(null);
  const [calculatedPriceInCentsMapState, setCalculatedPriceInCentsMapState] =
    useState<Map<string, number> | null>(null);
  const [queriedSubitemNameMapState, setQueriedSubitemNameMapState] =
    useState<Map<string, string> | null>(null);
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  async function calculate() {
    const subitemIds = subitems
      .map((value) => value.itemId)
      .filter((value): value is string => !!value);

    const result = await collection?.findByIds(subitemIds);

    if (result !== undefined) {
      setQueriedSubitemsState(result);

      const nutritionEntries = await Promise.all(
        subitems.map(async (value): Promise<[string, NutritionInfo]> => {
          const itemId = value.itemId;
          if (itemId !== undefined) {
            const queriedSubitem = result.get(itemId);
            if (queriedSubitem !== undefined) {
              const queriedSubitemCalculatedNutritionInfo =
                await queriedSubitem.calculatedNutritionInfo(
                  CalcTypeEnum.perServing
                );
              return [itemId, queriedSubitemCalculatedNutritionInfo];
            }
          }
          return [itemId ?? "", baseNutritionInfo()];
        })
      );
      setCalculatedNutritionInfoMapState(new Map(nutritionEntries));

      const priceInCentsEntries = await Promise.all(
        subitems.map(async (value): Promise<[string, number]> => {
          const itemId = value.itemId;
          if (itemId !== undefined) {
            const queriedSubitem = result.get(itemId);
            if (queriedSubitem !== undefined) {
              const queriedPriceCents =
                await queriedSubitem.calculatedPriceCents(
                  CalcTypeEnum.perServing
                );
              return [itemId, queriedPriceCents];
            }
          }
          return [itemId ?? "", 0];
        })
      );
      setCalculatedPriceInCentsMapState(new Map(priceInCentsEntries));

      const subitemNameEntries = await Promise.all(
        subitems.map(async (value): Promise<[string, string]> => {
          const itemId = value.itemId;
          if (itemId !== undefined) {
            const queriedSubitem = result.get(itemId);
            if (queriedSubitem !== undefined) {
              return [itemId, queriedSubitem.name];
            }
          }
          return [itemId ?? "", ""];
        })
      );
      setQueriedSubitemNameMapState(new Map(subitemNameEntries));
    }
  }

  useEffect(() => {
    calculate();
  }, [props.formikProps.values.subitems, collection]);

  var totalNutritionInfo = baseNutritionInfo();
  if (calculatedNutritionInfoMapState) {
    totalNutritionInfo = divideNutritionInfo(
      sumNutritionInfo(
        subitems.map((value) => {
          if (value.itemId) {
            const perServingNutritionInfo = calculatedNutritionInfoMapState.get(
              value.itemId
            );
            return multiplyNutritionInfo(perServingNutritionInfo, value.count);
          }

          return baseNutritionInfo();
        })
      ),
      recipeServings
    );
  }

  var totalPriceInCents = 0;
  if (calculatedPriceInCentsMapState) {
    totalPriceInCents =
      subitems
        .map((value) => {
          if (value.itemId) {
            const perServingPriceInCents =
              calculatedPriceInCentsMapState.get(value.itemId) ?? 0;
            return perServingPriceInCents * (value.count ?? 0);
          }

          return 0;
        })
        .reduce((previous, current) => previous + current, 0) / recipeServings;
  }

  return (
    <Form
      noValidate={true}
      onSubmit={(e) => {
        e.preventDefault();
        props.formikProps.handleSubmit(e as FormEvent<HTMLFormElement>);
      }}
    >
      <ValidatedFormikControl
        value={props.formikProps.values.name}
        error={props.formikProps.errors.name}
        isRequired={true}
        yupSchemaField={yupItemSchema.fields.name}
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={props.firstInputFieldRef}
      />

      <ValidatedFormikNumberControl
        value={props.formikProps.values.count}
        error={props.formikProps.errors.count}
        isRequired
        yupSchemaField={yupItemSchema.fields.count}
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
      />

      <SubitemFieldArray
        formikProps={props.formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.recipe]}
        calculatedNutritionInfoMap={calculatedNutritionInfoMapState}
        calculatedPriceInCentsMap={calculatedPriceInCentsMapState}
        queriedSubitemNameMap={queriedSubitemNameMapState}
      />

      <Center>
        <VStack>
          <Button
            type="submit"
            my={4}
            isLoading={props.formikProps.isSubmitting}
          >
            Submit
          </Button>
          <Grid templateColumns="repeat(6, 1fr)" pb={2}>
            <GridItem color={alphaColor} fontSize="sm">
              {currencyFormatter.format(totalPriceInCents / 100)}
            </GridItem>
            <GridItem color={alphaColor} fontSize="sm">
              {totalNutritionInfo.massGrams}g
            </GridItem>
            <GridItem color={alphaColor} fontSize="sm">
              {totalNutritionInfo.energyKilocalories}kcal
            </GridItem>
            <GridItem color={alphaColor} fontSize="sm">
              {totalNutritionInfo.fatGrams}g fat
            </GridItem>
            <GridItem color={alphaColor} fontSize="sm">
              {totalNutritionInfo.carbohydrateGrams}g carbs
            </GridItem>
            <GridItem color={alphaColor} fontSize="sm">
              {totalNutritionInfo.proteinGrams}g protein
            </GridItem>
          </Grid>
        </VStack>
      </Center>
    </Form>
  );
}
