import { DeleteIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  Text,
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
import { useEffect, useState } from "react";
import { useRxCollection } from "rxdb-hooks";
import { currencyFormatter } from "../../data/number-formatter";
import {
  CalcTypeEnum,
  multiplyNutritionInfo,
  NutritionInfo,
  nutritionInfoDescription,
} from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";
import { ItemInferredType } from "../../data/yup/item";
import { SubitemInferredType, yupSubitemSchema } from "../../data/yup/subitem";

interface SubitemAutoCompleteInputProps {
  value: SubitemInferredType;
  index: number;
  formikProps: FormikProps<Partial<ItemInferredType>>;
  fieldArrayHelpers: FieldArrayRenderProps;
  options: Array<ItemDocument>;
  autoCompleteOnChange: (value: string) => void;
}

export function SubitemAutoCompleteInput(props: SubitemAutoCompleteInputProps) {
  const [fieldValueDocumentState, setFieldValueDocumentState] = useState<
    ItemDocument | undefined | null
  >(null);
  const [
    fieldValueServingNutritionInfoState,
    setFieldValueServingNutritionInfoState,
  ] = useState<NutritionInfo | undefined>(undefined);
  const [
    fieldValueServingPriceCentsState,
    setFieldValueServingPriceCentsState,
  ] = useState<number | undefined>(undefined);
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  const collection = useRxCollection<ItemDocument>("item");

  async function queryFieldValueDocument() {
    if (props.value) {
      const query = collection?.findOne({
        selector: { id: props.value.itemId },
      });
      const value = await query?.exec();
      setFieldValueDocumentState(value);

      const nutritionInfo = await value?.calculatedNutritionInfo(
        CalcTypeEnum.perServing
      );
      setFieldValueServingNutritionInfoState(nutritionInfo);

      const priceCentsPerServing = await value?.calculatedPriceCents(
        CalcTypeEnum.perServing
      );
      setFieldValueServingPriceCentsState(priceCentsPerServing);
    }
  }

  useEffect(() => {
    queryFieldValueDocument();
  }, [props.value, collection]);

  return (
    <VStack key={props.index} align="stretch" spacing={0} pb={2}>
      <HStack pb={1}>
        <NumberInput
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
            setFieldValueDocumentState(itemDocument);
          }}
        >
          <AutoCompleteInput
            placeholder={yupSubitemSchema.fields.itemId.spec.label}
            value={fieldValueDocumentState?.name}
            onChange={async (event) => {
              // setFieldValueDocumentState(event.target.value);
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
      <Text
        color={alphaColor}
        fontSize="sm"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {fieldValueServingPriceCentsState
          ? currencyFormatter.format(
              (fieldValueServingPriceCentsState / 100) *
                (props.value.count ?? 0)
            )
          : ""}
        {" / "}
        {fieldValueServingNutritionInfoState
          ? nutritionInfoDescription(
              multiplyNutritionInfo(
                fieldValueServingNutritionInfoState,
                props.value.count ?? 0
              )
            )
          : ""}
      </Text>
    </VStack>
  );
}
