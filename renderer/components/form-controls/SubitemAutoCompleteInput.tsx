import { DeleteIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
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
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import {
  ItemInterface,
  SubitemInterface,
  itemMultiplyNutrition,
  itemZeroNutrition,
  populatedItemServingNutrition,
  populatedItemServingPriceCents,
} from "../../data/interfaces";
import { ItemTypeEnum } from "../../data/item-type-enum";
import { RxDBItemDocument } from "../../data/rxdb";
import { PriceNutritionGrid } from "../PriceNutritionGrid";

interface SubitemAutoCompleteInputProps {
  value: SubitemInterface;
  index: number;
  formikProps: FormikProps<ItemInterface>;
  fieldArrayHelpers: FieldArrayRenderProps;
  itemTypesIn: Array<ItemTypeEnum>;
}

export function SubitemAutoCompleteInput(props: SubitemAutoCompleteInputProps) {
  const thisSubitem = props.formikProps.values.subitems![props.index];

  const [nameSearchState, setNameSearchState] = useState<string | undefined>(
    undefined
  );
  const [subitemNameState, setSubitemNameState] = useState<string | null>(null);
  const [nutritionAndPriceState, setNutritionAndPriceState] = useState<{
    nutrition: ItemInterface;
    priceCents: number;
  } | null>(null);
  const collection = useRxCollection<RxDBItemDocument>("item");
  const { result } = useRxQuery(
    collection?.find({
      selector: {
        name: { $regex: `\\b${nameSearchState}.*` },
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

  async function query() {
    if (thisSubitem.itemId !== undefined) {
      const thisSubitemItemDocument = await collection
        ?.findOne(thisSubitem.itemId)
        .exec();
      if (thisSubitemItemDocument === undefined) {
        return;
      }
      setSubitemNameState(thisSubitemItemDocument?.name ?? null);

      const populatedSubitemItem =
        await thisSubitemItemDocument?.recursivelyPopulateSubitems();
      if (populatedSubitemItem === undefined) {
        return;
      }

      const nutrition = populatedItemServingNutrition(populatedSubitemItem);
      const priceCents = populatedItemServingPriceCents(populatedSubitemItem);
      setNutritionAndPriceState({ nutrition, priceCents });
    }
  }

  useEffect(() => {
    query();

    return;
  }, [thisSubitem.count, thisSubitem.itemId, collection]);

  return (
    <VStack key={props.index} align="stretch" spacing={0} pb={2}>
      <HStack pb={1}>
        <NumberInput
          w="25%"
          defaultValue={props.value.count}
          min={-9999.99}
          max={9999.99}
        >
          <NumberInputField
            px={"8px"}
            pr={"8px"}
            pattern="(-)?[0-9]*(.[0-9]+)?"
            name={`subitems.${props.index}.count`}
            value={props.value.count}
            onChange={props.formikProps.handleChange}
            onBlur={props.formikProps.handleBlur}
            placeholder={"Servings"}
          />
        </NumberInput>
        <AutoComplete
          openOnFocus
          onChange={async (_value, item) => {
            const itemDocument = (item as Item)
              .originalValue as RxDBItemDocument;

            props.formikProps.setFieldValue(
              `subitems.${props.index}.itemId`,
              itemDocument.id
            );
            props.formikProps.setFieldValue(
              `subitems.${props.index}.item`,
              undefined
            );
            setNameSearchState(undefined);
          }}
        >
          <AutoCompleteInput
            placeholder={"Name"}
            value={nameSearchState ?? subitemNameState ?? ""}
            onChange={async (event) => {
              setNameSearchState(event.target.value);
            }}
          />
          <AutoCompleteList>
            {result.map((value) => {
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
        priceCents={
          (nutritionAndPriceState?.priceCents ?? 0) * (thisSubitem.count ?? 0)
        }
        nutritionInfo={itemMultiplyNutrition(
          nutritionAndPriceState?.nutrition ?? itemZeroNutrition(),
          thisSubitem.count ?? 0
        )}
      />
    </VStack>
  );
}
