import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  Center,
  IconButton,
  Skeleton,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildList,
  prettyPrintItems,
  itemServingNutrition,
  itemServingPriceCents,
} from '../data/interfaces/ItemHelpers';
import { ItemInterface } from '../data/interfaces/ItemInterface';
import { ItemTypeEnum } from '../data/interfaces/ItemTypeEnum';
import { ServingOrTotalEnum } from '../data/interfaces/ServingOrTotalEnum';
import { RxNPItemDocument } from '../data/rxnp/RxNPItemSchema';
import {
  useCurrencyLocalStorage,
  useLanguageLocalStorage,
} from '../utilities/useLocalStorageKey';

export function ItemTableRow(props: {
  document: RxNPItemDocument;
  priceType: ServingOrTotalEnum;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { document, priceType, onEdit, onDelete } = props;
  const { t } = useTranslation();
  const [nutritionState, setNutritionState] = useState<ItemInterface | null>(
    null,
  );
  const [priceCentsState, setPriceCentsState] = useState<number | null>(null);
  const borderColorValue = useColorModeValue('gray.100', 'gray.700');
  const toast = useToast();

  async function populate(aDocument: RxNPItemDocument) {
    const populatedItem = await aDocument.recursivelyPopulateSubitems();
    setNutritionState(itemServingNutrition(populatedItem));
    setPriceCentsState(itemServingPriceCents(populatedItem));
  }

  const [languageLocalStorage] = useLanguageLocalStorage();

  const [currencyLocalStorage] = useCurrencyLocalStorage();

  const currencyDenominator = currencyLocalStorage === 'JPY' ? 1 : 100;

  const currencyFormatter = new Intl.NumberFormat(languageLocalStorage, {
    style: 'currency',
    currency: currencyLocalStorage,
  });

  useEffect(() => {
    populate(document);
  }, [document]);

  const isLoaded = nutritionState !== null && priceCentsState !== null;
  let priceDenominator = 1;
  let priceMultiple = 1;

  if (document.type === ItemTypeEnum.item) {
    if (priceType === ServingOrTotalEnum.total) {
      priceMultiple = document.count ?? 1;
    }
  } else {
    priceMultiple = document.count ?? 1;
    if (priceType === ServingOrTotalEnum.serving) {
      priceDenominator = document.count ?? 1;
    }
  }

  return (
    <Tr key={document.id} height="73px">
      <Td width="144px" borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          <Center>
            <ButtonGroup isAttached size="sm">
              <IconButton
                icon={<EditIcon />}
                aria-label={t('edit')}
                onClick={onEdit}
              />
              <IconButton
                icon={<CopyIcon />}
                aria-label={t('copy')}
                onClick={async () => {
                  const items = prettyPrintItems(
                    buildList(await document.recursivelyPopulateSubitems()),
                  );
                  navigator.clipboard.writeText(items);
                  toast({
                    title: t('copied'),
                    status: 'success',
                  });
                }}
              />
              <IconButton
                icon={<DeleteIcon />}
                aria-label={t('delete')}
                onClick={onDelete}
              />
            </ButtonGroup>
          </Center>
        </Skeleton>
      </Td>
      <Td borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          <Text minW="176px" maxW="448px" noOfLines={2} whiteSpace="initial">
            {document.name}
          </Text>
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {currencyFormatter.format(
            ((priceCentsState ?? 999) /
              currencyDenominator /
              priceDenominator) *
              priceMultiple,
          )}
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>{document.count}</Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionState?.massGrams}
          {t('massG')}
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionState?.energyKilocalories}
          {t('kcal')}
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionState?.fatGrams}
          {t('massG')}
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionState?.carbohydrateGrams}
          {t('massG')}
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionState?.proteinGrams}
          {t('massG')}
        </Skeleton>
      </Td>
    </Tr>
  );
}
