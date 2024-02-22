import { DeleteIcon } from '@chakra-ui/icons';
import {
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  VStack,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from '@choc-ui/chakra-autocomplete';
import { FieldArrayRenderProps, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { useRxCollection, useRxQuery } from 'rxdb-hooks';
import { useTranslation } from 'react-i18next';
import {
  itemMultiplyNutrition,
  itemZeroNutrition,
  itemServingNutrition,
  itemServingPriceCents,
} from '../../data/interfaces/ItemHelpers';
import { ItemInterface } from '../../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../../data/interfaces/ItemTypeEnum';
import { SubitemInterface } from '../../data/interfaces/SubitemInterface';
import { RxNPItemDocument } from '../../data/rxnp/RxNPItemSchema';
import { PriceNutritionGrid } from '../PriceNutritionGrid';

interface SubitemAutoCompleteInputProps {
  value: SubitemInterface;
  index: number;
  formikProps: FormikProps<ItemInterface>;
  fieldArrayHelpers: FieldArrayRenderProps;
  itemTypesIn: Array<ItemTypeEnum>;
}

export function SubitemAutoCompleteInput(props: SubitemAutoCompleteInputProps) {
  const { value, index, formikProps, fieldArrayHelpers, itemTypesIn } = props;

  const { t } = useTranslation();
  const thisSubitem = formikProps.values.subitems![index];

  const [nameSearchState, setNameSearchState] = useState<string | undefined>(
    undefined,
  );
  const [subitemNameState, setSubitemNameState] = useState<string | null>(null);
  const [nutritionAndPriceState, setNutritionAndPriceState] = useState<{
    nutrition: ItemInterface;
    priceCents: number;
  } | null>(null);
  const collection = useRxCollection<RxNPItemDocument>('item');
  const { result } = useRxQuery(
    collection?.find({
      selector: {
        name: { $regex: `\\b${nameSearchState}.*` },
        type: {
          $in: itemTypesIn,
        },
      },
    })!,
    {
      pagination: 'Traditional',
    },
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

      const nutrition = itemServingNutrition(populatedSubitemItem);
      const priceCents = itemServingPriceCents(populatedSubitemItem);
      setNutritionAndPriceState({ nutrition, priceCents });
    }
  }

  useEffect(() => {
    query();
  }, [thisSubitem.count, thisSubitem.itemId, collection]);

  return (
    <VStack key={index} align="stretch" spacing={0} pb={2}>
      <HStack pb={1}>
        <NumberInput
          w="25%"
          defaultValue={value.count}
          min={-9999.99}
          max={9999.99}
        >
          <NumberInputField
            px="8px"
            pr="8px"
            pattern="(-)?[0-9]*(.[0-9]+)?"
            name={`subitems.${index}.count`}
            value={value.count}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            placeholder={t('servings')}
          />
        </NumberInput>
        <AutoComplete
          openOnFocus
          onChange={async (_value, item) => {
            const itemDocument = (item as Item)
              .originalValue as RxNPItemDocument;

            formikProps.setFieldValue(
              `subitems.${index}.itemId`,
              itemDocument.id,
            );
            formikProps.setFieldValue(`subitems.${index}.item`, undefined);
            setNameSearchState(undefined);
          }}
        >
          <AutoCompleteInput
            placeholder={t('name')}
            value={nameSearchState ?? subitemNameState ?? ''}
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
          aria-label={t('delete')}
          onClick={() => {
            fieldArrayHelpers.remove(index);
          }}
        />
      </HStack>
      <PriceNutritionGrid
        priceCents={
          (nutritionAndPriceState?.priceCents ?? 0) * (thisSubitem.count ?? 0)
        }
        nutritionInfo={itemMultiplyNutrition(
          nutritionAndPriceState?.nutrition ?? itemZeroNutrition,
          thisSubitem.count ?? 0,
        )}
      />
    </VStack>
  );
}
