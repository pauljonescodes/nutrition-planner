import { AddIcon } from "@chakra-ui/icons";
import { Button, Center, FormLabel, VStack } from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { dataid } from "../../../data/dataid";
import { ItemType } from "../../../data/yup/item";
import {
  ItemInItemInferredType,
  yupItemInItemSchema,
} from "../../../data/yup/item-in-item";
import { ItemInItemAutoCompleteInput } from "./ItemInItemAutoCompleteInput";

interface ItemSearchResults {
  results: Array<ItemType>;
}

interface ItemInItemFieldProps {
  thisItemId: string;
  formikProps: FormikProps<ItemType>;
  fieldArrayHelpers: FieldArrayRenderProps;
}

export function ItemInItemField(props: ItemInItemFieldProps) {
  const [recipeSearchsState, setItemSearchesState] = useState<
    ItemSearchResults[]
  >([]);

  const itemsInItem: Array<ItemInItemInferredType> = [];

  useEffect(() => {
    setItemSearchesState(itemsInItem.map(() => ({ results: [] })));
  }, []);
  return (
    <VStack spacing={0} pb={2}>
      <FormLabel>{yupItemInItemSchema.spec.label}</FormLabel>
      {itemsInItem.map((value, index) => {
        const options =
          index < recipeSearchsState.length
            ? recipeSearchsState[index].results?.map((value) => {
                return value!;
              }) ?? []
            : [];
        return (
          <ItemInItemAutoCompleteInput
            autoCompleteOnChange={async (value) => {
              let theItemSearchs = recipeSearchsState;
              // theItemSearchs[index].results =
              //   (await Database.shared().filteredItems(value)) ?? [];
              setItemSearchesState([...theItemSearchs]);
            }}
            value={value}
            index={index}
            thisItemId={props.thisItemId}
            formikProps={props.formikProps}
            fieldArrayHelpers={props.fieldArrayHelpers}
            options={options}
          />
        );
      })}
      <Center>
        <Button
          onClick={() => {
            props.fieldArrayHelpers.push({
              id: dataid(),
              destinationItemId: props.thisItemId,
              count: 1,
              sourceItemId: "",
              sourceItem: {
                // this needs to be populated
                id: "",
                name: "",
              },
            } as ItemInItemInferredType);
            let theItemSearchs = recipeSearchsState;
            theItemSearchs.push({
              results: [],
            });
            setItemSearchesState([...theItemSearchs]);
          }}
        >
          <AddIcon />
        </Button>
      </Center>
    </VStack>
  );
}
