import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { dataid } from "../../data/Database";
import { ItemInferredType } from "../../data/model/Item";
import {
  ItemInItemInferredType,
  yupItemInItemSchema,
} from "../../data/model/ItemInItem";
import { ItemInItemFieldInput } from "./FieldInput";

interface ItemSearchResults {
  results: Array<ItemInferredType>;
}

interface ItemInItemFieldProps {
  thisItemId: string;
  formikProps: FormikProps<ItemInferredType>;
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
      <FormControl>
        <FormLabel>{yupItemInItemSchema.spec.label}</FormLabel>
        {itemsInItem.map((value, index) => {
          const options =
            index < recipeSearchsState.length
              ? recipeSearchsState[index].results?.map((value) => {
                  return value!;
                }) ?? []
              : [];
          return (
            <ItemInItemFieldInput
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
      </FormControl>
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
