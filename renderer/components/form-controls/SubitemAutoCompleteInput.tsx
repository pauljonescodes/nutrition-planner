import { DeleteIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from "@choc-ui/chakra-autocomplete";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { useState } from "react";
import {
  multiplyNutritionInfo,
  NutritionInfo,
} from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";
import { ItemInferredType } from "../../data/yup/item";
import { SubitemInferredType, yupSubitemSchema } from "../../data/yup/subitem";
import { PriceNutritionGrid } from "../PriceNutritionGrid";

interface SubitemAutoCompleteInputProps {
  value: SubitemInferredType;
  calculatedNutritionInfo: NutritionInfo;
  calculatedPriceInCents: number;
  queriedSubitemName: string;
  index: number;
  formikProps: FormikProps<Partial<ItemInferredType>>;
  fieldArrayHelpers: FieldArrayRenderProps;
  options: Array<ItemDocument>;
  autoCompleteOnChange: (value: string) => void;
}

export function SubitemAutoCompleteInput(props: SubitemAutoCompleteInputProps) {
  const [fieldValueState, setFieldValueState] = useState<string | undefined>(
    undefined
  );
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  const calculatedTotalNutritionInfo = multiplyNutritionInfo(
    props.calculatedNutritionInfo,
    props.value.count ?? 1
  );

  return (
    <VStack key={props.index} align="stretch" spacing={0} pb={2}>
      <HStack pb={1}>
        <NumberInput
          w="30%"
          defaultValue={props.value.count}
          min={-9999.99}
          max={9999.99}
        >
          <NumberInputField
            pattern="(-)?[0-9]*(.[0-9]+)?"
            name={`subitems.${props.index}.count`}
            value={props.value.count}
            onChange={props.formikProps.handleChange}
            onBlur={props.formikProps.handleBlur}
            placeholder={yupSubitemSchema.fields.count.spec.label}
          />
        </NumberInput>
        <AutoComplete
          openOnFocus
          onChange={async (_value, item) => {
            const itemDocument = (item as Item).originalValue as ItemDocument;

            props.formikProps.setFieldValue(
              `subitems.${props.index}.itemId`,
              itemDocument.id
            );
            setFieldValueState(itemDocument.name);
          }}
        >
          <AutoCompleteInput
            placeholder={yupSubitemSchema.fields.itemId.spec.label}
            value={fieldValueState ?? props.queriedSubitemName}
            onChange={async (event) => {
              setFieldValueState(event.target.value);
              props.autoCompleteOnChange(event.target.value);
            }}
          />
          <AutoCompleteList>
            {props.options.map((value) => {
              return (
                <AutoCompleteItem
                  key={value.id}
                  value={value}
                  getValue={(item) => {
                    return item.name;
                  }}
                >
                  {value.name}
                </AutoCompleteItem>
              );
            })}
          </AutoCompleteList>
        </AutoComplete>

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Remove item"
          onClick={() => {
            props.fieldArrayHelpers.remove(props.index);
          }}
        />
      </HStack>
      <PriceNutritionGrid
        priceCents={props.calculatedPriceInCents}
        nutritionInfo={props.calculatedNutritionInfo}
      />
    </VStack>
  );
}
