import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Center,
  IconButton,
  Skeleton,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { currencyFormatter } from "../data/number-formatter";
import { CalculationTypeEnum, NutritionInfo } from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";

type ItemTableRowProps = {
  item: ItemDocument;
  priceType: CalculationTypeEnum;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export function ItemTableRow(props: ItemTableRowProps) {
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(
    null
  );
  const [price, setPrice] = useState<number | null>(null);
  const borderColorValue = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    props.item
      .calculatedPriceCents(props.priceType)
      .then((value) => setPrice(value));
    props.item
      .calculatedNutritionInfo(props.priceType)
      .then((value) => setNutritionInfo(value));
  }, [props.item, props.priceType, props.item.subitems]);

  const isPriceLoaded = price !== null;
  const isNutritionLoaded = nutritionInfo !== null;
  const isLoaded = isPriceLoaded && isNutritionLoaded;
  const borderColor = isLoaded ? borderColorValue : "transparent";

  return (
    <Tr key={props.item.id} height="73px">
      <Td width={"144px"} borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>
          <Center>
            <ButtonGroup isAttached size="sm">
              <IconButton
                icon={<EditIcon />}
                aria-label="Edit"
                onClick={props.onEdit}
              />
              <IconButton
                icon={<CopyIcon />}
                aria-label="Duplicate"
                onClick={props.onCopy}
              />
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete"
                onClick={props.onDelete}
              />
            </ButtonGroup>
          </Center>
        </Skeleton>
      </Td>
      <Td borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>
          <Text
            minW={"176px"}
            maxW={"448px"}
            noOfLines={2}
            whiteSpace={"initial"}
          >
            {props.item.name}
          </Text>
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>
          {currencyFormatter.format((price ?? 999) / 100)}
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>{props.item.count}</Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>{nutritionInfo?.massGrams}g</Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionInfo?.energyKilocalories}kcal
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>{nutritionInfo?.fatGrams}g</Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionInfo?.carbohydrateGrams}g
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColor}>
        <Skeleton isLoaded={isLoaded}>{nutritionInfo?.proteinGrams}g</Skeleton>
      </Td>
    </Tr>
  );
}
