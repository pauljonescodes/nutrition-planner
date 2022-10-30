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
import { useEffect, useState } from "react";
import { useRxCollection } from "rxdb-hooks";
import { ItemDocument } from "../../../data/rxdb/item";
import { ItemInferredType } from "../../../data/yup/item";
import {
  SubitemInferredType,
  yupSubitemSchema,
} from "../../../data/yup/subitem";

interface ItemInItemAutoCompleteInputProps {
  value: SubitemInferredType;
  index: number;
  formikProps: FormikProps<Partial<ItemInferredType>>;
  fieldArrayHelpers: FieldArrayRenderProps;
  options: ItemInferredType[];
  autoCompleteOnChange: (value: string) => void;
}

export function ItemInItemAutoCompleteInput(
  props: ItemInItemAutoCompleteInputProps
) {
  const [selectedFieldValueName, setSelectedFieldValueName] = useState<
    string | undefined
  >(undefined);
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  const collection = useRxCollection<ItemDocument>("item");

  async function querySelectedFieldValueName() {
    if (props.value) {
      const query = collection?.findOne({ selector: { name: props.value } });
      const value = await query?.exec();
      setSelectedFieldValueName(value?.name);
    }
  }

  useEffect(() => {
    querySelectedFieldValueName();
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
            const modelItem = (item as Item).originalValue as ItemInferredType;

            props.formikProps.setFieldValue(
              `subitems.${props.index}.itemId`,
              modelItem.id
            );
            setSelectedFieldValueName(modelItem.name);
          }}
        >
          <AutoCompleteInput
            placeholder={yupSubitemSchema.fields.itemId.spec.label}
            value={selectedFieldValueName ?? props.value.itemId}
            onChange={async (event) => {
              setSelectedFieldValueName(event.target.value);
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
    </VStack>
  );
}
