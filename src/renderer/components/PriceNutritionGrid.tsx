import { Grid, GridItem, Text, useColorModeValue } from "@chakra-ui/react";
import { ItemInterface } from "../data/interfaces/ItemInterface";
import { currencyFormatter } from "../utilities/currencyFormatter";
import { useTranslation } from "react-i18next";

type PriceNutritionGridProps = {
  nutritionInfo?: ItemInterface;
  priceCents?: number;
  priceLabel?: string;
};

export function PriceNutritionGrid(props: PriceNutritionGridProps) {
  const { t } = useTranslation();
  const subtleTextColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Grid templateColumns="repeat(6, 1fr)" pb={2} width={"full"}>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {currencyFormatter.format((props.priceCents ?? 0) / 100)}{" "}
          {props.priceLabel}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo?.massGrams ?? 0}g
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo?.energyKilocalories ?? 0}{t("kcal")}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo?.fatGrams ?? 0}{t("massG")} {t("fat")}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor} fontSize="xs">
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo?.carbohydrateGrams ?? 0}{t("massG")} {t("carbs")}
        </Text>
      </GridItem>
      <GridItem color={subtleTextColor}>
        <Text fontSize="xs" align={"center"}>
          {props.nutritionInfo?.proteinGrams ?? 0}{t("massG")} {t("protein")}
        </Text>
      </GridItem>
    </Grid>
  );
}
