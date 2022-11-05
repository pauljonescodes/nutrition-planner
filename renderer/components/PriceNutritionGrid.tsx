import { Grid, GridItem, Text, useColorModeValue } from "@chakra-ui/react";
import { currencyFormatter } from "../data/number-formatter";
import { NutritionInfo } from "../data/nutrition-info";

type PriceNutritionGridProps = {
  nutritionInfo: NutritionInfo;
  priceCents: number;
  priceLabel?: string;
};

export function PriceNutritionGrid(props: PriceNutritionGridProps) {
  const subtleTextColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Grid templateColumns="repeat(6, 1fr)" pb={2} width={"full"}>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {currencyFormatter.format(props.priceCents / 100)} {props.priceLabel}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo.massGrams}g
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo.energyKilocalories}kcal
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo.fatGrams}g fat
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo.carbohydrateGrams}g carbs
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor}>
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo.proteinGrams}g protein
        </Text>
      </GridItem>
    </Grid>
  );
}
