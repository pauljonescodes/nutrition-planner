import { Grid, GridItem, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { ItemInterface } from '../data/interfaces/ItemInterface';
import { LocalStorageKeysEnum } from '../constants';

export function PriceNutritionGrid(props: {
  nutritionInfo?: ItemInterface;
  priceCents?: number;
  priceLabel?: string;
}) {
  const { nutritionInfo, priceCents, priceLabel } = props;
  const { t } = useTranslation();
  const subtleTextColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  const [languageLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.language,
    'en',
  );

  const [currencyLocalStorage] = useLocalStorage(
    LocalStorageKeysEnum.currency,
    'USD',
  );

  const currencyFormatter = new Intl.NumberFormat(languageLocalStorage, {
    style: 'currency',
    currency: currencyLocalStorage,
  });

  const currencyDenominator = currencyLocalStorage === 'JPY' ? 1 : 100;

  return (
    <Grid templateColumns="repeat(6, 1fr)" pb={2} width="full">
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align="center">
          {currencyFormatter.format((priceCents ?? 0) / currencyDenominator)}{' '}
          {priceLabel}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align="center">
          {nutritionInfo?.massGrams ?? 0}g
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align="center">
          {nutritionInfo?.energyKilocalories ?? 0}
          {t('kcal')}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align="center">
          {nutritionInfo?.fatGrams ?? 0}
          {t('massG')} {t('fat')}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align="center">
          {nutritionInfo?.carbohydrateGrams ?? 0}
          {t('massG')} {t('carbs')}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor}>
        <Text fontSize="xs" align="center">
          {nutritionInfo?.proteinGrams ?? 0}
          {t('massG')} {t('protein')}
        </Text>
      </GridItem>
    </Grid>
  );
}
