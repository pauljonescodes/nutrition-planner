import { Button, Center, useColorModeValue, VStack } from "@chakra-ui/react";
import { Form, FormikProps } from "formik";
import { FormEvent, RefObject, useEffect, useState } from "react";
import { useRxCollection } from "rxdb-hooks";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import {
  baseNutritionInfo,
  CalculationTypeEnum,
  divideNutritionInfo,
  multiplyNutritionInfo,
  NutritionInfo,
  sumNutritionInfo,
} from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { SubitemFieldArray } from "../form-controls/SubitemFieldArray";
import { ValidatedFormikControl } from "../form-controls/ValidatedFormikControl";
import { PriceNutritionGrid } from "../PriceNutritionGrid";

type PlanFormProps = {
  formikProps: FormikProps<Partial<ItemInferredType>>;
  firstInputFieldRef: RefObject<HTMLInputElement> | undefined;
};

export default function PlanForm(props: PlanFormProps) {
  const collection = useRxCollection<ItemDocument>("item");

  const [calculatedNutritionInfoMapState, setCalculatedNutritionInfoMapState] =
    useState<Map<string, NutritionInfo> | null>(null);
  const [calculatedPriceInCentsMapState, setCalculatedPriceInCentsMapState] =
    useState<Map<string, number> | null>(null);
  const [queriedSubitemNameMapState, setQueriedSubitemNameMapState] =
    useState<Map<string, string> | null>(null);
  const subtleTextColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  const subitems = props.formikProps.values.subitems ?? [];

  useEffect(() => {
    calculate();
  }, [props.formikProps.values.subitems, collection]);

  async function calculate() {
    const subitemIds = subitems
      .map((value) => value.itemId)
      .filter((value): value is string => !!value);

    const result = await collection?.findByIds(subitemIds);

    if (result !== undefined) {
      const nutritionEntries = await Promise.all(
        subitems.map(async (value): Promise<[string, NutritionInfo]> => {
          const itemId = value.itemId;
          if (itemId !== undefined) {
            const queriedSubitem = result.get(itemId);
            if (queriedSubitem !== undefined) {
              const queriedSubitemCalculatedNutritionInfo =
                await queriedSubitem.calculatedNutritionInfo(
                  CalculationTypeEnum.perServing
                );
              return [itemId, queriedSubitemCalculatedNutritionInfo];
            }
          }
          return [itemId ?? "", baseNutritionInfo()];
        })
      );
      setCalculatedNutritionInfoMapState(new Map(nutritionEntries));

      const priceCentsEntries = await Promise.all(
        subitems.map(async (value): Promise<[string, number]> => {
          const itemId = value.itemId;
          if (itemId !== undefined) {
            const queriedSubitem = result.get(itemId);
            if (queriedSubitem !== undefined) {
              const queriedPriceCents =
                await queriedSubitem.calculatedPriceCents(
                  CalculationTypeEnum.perServing
                );
              return [itemId, queriedPriceCents];
            }
          }
          return [itemId ?? "", 0];
        })
      );
      setCalculatedPriceInCentsMapState(new Map(priceCentsEntries));

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
      props.formikProps.values.count ?? 1
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
        .reduce((previous, current) => previous + current, 0) /
      (props.formikProps.values.count ?? 1);
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
        yupSchemaField={yupItemSchema.fields.name}
        formikProps={props.formikProps}
        spaceProps={{ pb: 2 }}
        inputFieldRef={props.firstInputFieldRef}
      />

      <SubitemFieldArray
        formikProps={props.formikProps}
        itemTypesIn={[ItemTypeEnum.item, ItemTypeEnum.group]}
        calculatedNutritionInfoMap={calculatedNutritionInfoMapState}
        calculatedPriceInCentsMap={calculatedPriceInCentsMapState}
        queriedSubitemNameMap={queriedSubitemNameMapState}
      />

      <Center>
        <VStack width={"full"}>
          <Button
            type="submit"
            my={4}
            isLoading={props.formikProps.isSubmitting}
          >
            Submit
          </Button>
          <PriceNutritionGrid
            priceCents={totalPriceInCents}
            nutritionInfo={totalNutritionInfo}
          />
        </VStack>
      </Center>
    </Form>
  );
}
