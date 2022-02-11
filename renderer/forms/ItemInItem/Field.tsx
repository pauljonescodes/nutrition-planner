import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { FieldArrayRenderProps, FormikProps } from "formik";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Database } from "../../data/Database";
import { Item } from "../../data/model/Item";
import {
  ItemInItemInterface,
  yupItemInItemSchema,
} from "../../data/model/ItemInItem";
import { ItemInItemFieldInput } from "./FieldInput";

interface ItemSearchResults {
  results: Array<Item>;
}

interface ItemInItemFieldProps {
  thisItemId: string;
  formikProps: FormikProps<Item>;
  fieldArrayHelpers: FieldArrayRenderProps;
}

export function ItemInItemField(props: ItemInItemFieldProps) {
  const [recipeSearchsState, setItemSearchesState] = useState<
    ItemSearchResults[]
  >([]);

  const itemsInItem = props.formikProps.values.itemInItems ?? [];

  useEffect(() => {
    setItemSearchesState(itemsInItem.map(() => ({ results: [] })));
  }, []);
  return (
    <VStack>
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
                theItemSearchs[index].results =
                  (await Database.shared().filteredItems(value)) ?? [];
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
      <FormControl>
        <Center>
          <Button
            type="button"
            onClick={() => {
              props.fieldArrayHelpers.push({
                id: nanoid(),
                destinationItemId: props.thisItemId,
                count: 1,
                sourceItemId: "",
                sourceItem: {
                  name: "",
                },
              } as ItemInItemInterface);
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
      </FormControl>
    </VStack>
  );
}
