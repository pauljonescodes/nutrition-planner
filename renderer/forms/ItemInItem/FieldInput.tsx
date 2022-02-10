import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
import { Database } from "../../data/database";
import { Item as ModelItem } from "../../data/model/item";
import { ItemInItem, yupItemInItemSchema } from "../../data/model/item-in-item";
import { nutritionInfoDescription } from "../../data/nutrition-info";

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
    <Box key={props.index} mb={3}>
      <Flex>
        <NumberInput defaultValue={props.value.count}>
          <NumberInputField
            name={`itemInItems.${props.index}.count`}
            value={props.value.count}
            onChange={props.formikProps.handleChange}
            onBlur={props.formikProps.handleBlur}
            placeholder={yupItemInItemSchema.fields.count.spec.label}
          />
          <NumberInputStepper>
            <NumberIncrementStepper
              onClick={() => {
                const value = props.value.count + 1;

                props.formikProps.setFieldValue(
                  `itemInItems.${props.index}.count`,
                  value
                );
              }}
            />
            <NumberDecrementStepper
              onClick={() => {
                props.formikProps.setFieldValue(
                  `itemInItems.${props.index}.count`,
                  props.value.count - 1
                );
              }}
            />
          </NumberInputStepper>
        </NumberInput>
        <FormControl mx={2}>
          <AutoComplete
            openOnFocus
            onChange={(_value, item) => {
              const modelItem = (item as Item).originalValue as ModelItem;

              props.formikProps.setFieldValue(
                `itemInItems.${props.index}.sourceItemId`,
                modelItem.id
              );
              setSelectedFieldValueName(modelItem.name);
              props.value.sourceItem = modelItem;
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
          mt={"auto"}
          icon={<DeleteIcon />}
          aria-label="Remove item"
          className="text-danger p-0 m-0"
          onClick={() => {
            props.fieldArrayHelpers.remove(props.index);
          }}
        />
      </Flex>
      <FormHelperText>
        {nutritionInfoDescription(
          Database.shared().itemInItemNutrition(props.value, 1)
        )}
      </FormHelperText>
    </Box>
  );
}
