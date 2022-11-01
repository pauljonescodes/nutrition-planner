import { AddIcon } from "@chakra-ui/icons";
import { Button, Center, FormLabel, VStack } from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { ItemTypeEnum } from "../../data/ItemTypeEnum";
import { baseNutritionInfo, NutritionInfo } from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../../data/yup/item";
import { SubitemAutoCompleteInput } from "./SubitemAutoCompleteInput";

interface SubitemFieldProps {
  formikProps: FormikProps<Partial<ItemInferredType>>;
  fieldArrayHelpers: FieldArrayRenderProps;
  itemTypesIn: Array<ItemTypeEnum>;
  calculatedNutritionInfoMap: Map<string, NutritionInfo> | null;
  calculatedPriceInCentsMap: Map<string, number> | null;
  queriedSubitemNameMap: Map<string, string> | null;
}

export function SubitemField(props: SubitemFieldProps) {
  const [nameSearch, setNameSearch] = useState("");
  const { result } = useRxQuery(
    useRxCollection<ItemDocument>("item")?.find({
      selector: {
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
        type: {
          $in: props.itemTypesIn,
        },
      },
    })!,
    {
      pageSize: 6,
      pagination: "Traditional",
    }
  );

  return (
    <VStack spacing={0} pb={2}>
      <FormLabel>{yupItemSchema.fields.subitems.spec.label}</FormLabel>
      {props.formikProps.values.subitems?.map((value, index) => {
        var calculatedNutritionInfo: NutritionInfo = baseNutritionInfo();
        if (value.itemId) {
          calculatedNutritionInfo =
            props.calculatedNutritionInfoMap?.get(value.itemId) ??
            baseNutritionInfo();
        }
        var calculatedPriceInCents: number = 0;
        if (value.itemId) {
          calculatedPriceInCents =
            props.calculatedPriceInCentsMap?.get(value.itemId) ?? 0;
        }

        var queriedSubitemName: string = "";
        if (value.itemId) {
          queriedSubitemName =
            props.queriedSubitemNameMap?.get(value.itemId) ?? "";
        }

        return (
          <SubitemAutoCompleteInput
            calculatedNutritionInfo={calculatedNutritionInfo}
            calculatedPriceInCents={calculatedPriceInCents}
            queriedSubitemName={queriedSubitemName}
            autoCompleteOnChange={async (value) => {
              setNameSearch(value);
            }}
            value={value!}
            index={index}
            formikProps={props.formikProps}
            fieldArrayHelpers={props.fieldArrayHelpers}
            options={result}
          />
        );
      })}
      <Center>
        <Button
          onClick={async () => {
            props.fieldArrayHelpers.push({
              count: 1,
            });
          }}
        >
          <AddIcon />
        </Button>
      </Center>
    </VStack>
  );
}
