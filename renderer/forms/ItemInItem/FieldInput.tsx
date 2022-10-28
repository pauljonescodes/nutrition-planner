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
import { useState } from "react";
import { ItemInferredType as ModelItem } from "../../data/model/Item";
import {
  ItemInItemInferredType,
  yupItemInItemSchema,
} from "../../data/model/ItemInItem";

interface ItemInItemFieldInputProps {
  value: ItemInItemInferredType;
  index: number;
  thisItemId: string;
  formikProps: FormikProps<ModelItem>;
  fieldArrayHelpers: FieldArrayRenderProps;
  options: ModelItem[];
  autoCompleteOnChange: (value: string) => void;
}

export function ItemInItemFieldInput(props: ItemInItemFieldInputProps) {
  const [selectedFieldValueName, setSelectedFieldValueName] = useState<
    string | undefined
  >(undefined);
  const alphaColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");
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
            name={`itemInItems.${props.index}.count`}
            value={props.value.count}
            onChange={props.formikProps.handleChange}
            onBlur={props.formikProps.handleBlur}
            placeholder={yupItemInItemSchema.fields.count.spec.label}
          />
        </NumberInput>
        <AutoComplete
          openOnFocus
          onChange={async (_value, item) => {
            const modelItem = (item as Item).originalValue as ModelItem;

            props.formikProps.setFieldValue(
              `itemInItems.${props.index}.sourceItemId`,
              modelItem.id
            );
            setSelectedFieldValueName(modelItem.name);

            // props.formikProps.setFieldValue(
            //   `itemInItems.${props.index}.sourceItem`,
            //   await Database.shared().loadItem(modelItem)
            // );
          }}
        >
          <AutoCompleteInput
            placeholder={yupItemInItemSchema.fields.sourceItemId.spec.label}
            // value={selectedFieldValueName ?? props.value.sourceItem?.name}
            // onChange={async (event) => {
            //   props.value.sourceItem!.name = event.target.value;
            //   props.autoCompleteOnChange(event.target.value);
            // }}
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
        XX
        {" / "}
        YY
      </Text>
    </VStack>
  );
}
