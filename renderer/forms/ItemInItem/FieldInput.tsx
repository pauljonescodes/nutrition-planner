import { DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  IconButton,
  NumberInput,
  NumberInputField,
  Text,
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
import { Database } from "../../data/Database";
import {
  Item as ModelItem,
  ItemInterface as ModelItemInterface,
} from "../../data/model/Item";
import { ItemInItem, yupItemInItemSchema } from "../../data/model/ItemInItem";
import { nutritionInfoDescription } from "../../data/NutritionInfo";

interface ItemInItemFieldInputProps {
  value: ItemInItem;
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
  return (
    <VStack key={props.index} align="start" spacing={0} pb={2}>
      <Flex pb={1}>
        <FormControl>
          <NumberInput
            defaultValue={props.value.count}
            precision={2}
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
        </FormControl>
        <FormControl mx={2}>
          <AutoComplete
            openOnFocus
            onChange={async (_value, item) => {
              const modelItem = (item as Item)
                .originalValue as ModelItemInterface;

              props.formikProps.setFieldValue(
                `itemInItems.${props.index}.sourceItemId`,
                modelItem.id
              );
              setSelectedFieldValueName(modelItem.name);

              props.formikProps.setFieldValue(
                `itemInItems.${props.index}.sourceItem`,
                await Database.shared().loadItem(modelItem)
              );
            }}
          >
            <AutoCompleteInput
              placeholder={yupItemInItemSchema.fields.sourceItemId.spec.label}
              value={selectedFieldValueName ?? props.value.sourceItem?.name}
              onChange={async (event) => {
                props.value.sourceItem!.name = event.target.value;
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
        </FormControl>

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Remove item"
          onClick={() => {
            props.fieldArrayHelpers.remove(props.index);
          }}
        />
      </Flex>
      <Text
        color="whiteAlpha.600"
        fontSize="sm"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {Database.shared().formattedTotalItemInItemPrice(props.value)}
        {" / "}
        {nutritionInfoDescription(
          Database.shared().totalItemInItemNutrition(props.value)
        )}
      </Text>
    </VStack>
  );
}
