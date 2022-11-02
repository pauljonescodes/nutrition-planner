import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Center,
  IconButton,
  Spinner,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { currencyFormatter } from "../data/number-formatter";
import { CalcTypeEnum, NutritionInfo } from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";

type ItemTableRowProps = {
  item: ItemDocument;
  priceType: CalcTypeEnum;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export function ItemTableRow(props: ItemTableRowProps) {
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(
    null
  );
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    props.item
      .calculatedPriceCents(props.priceType)
      .then((value) => setPrice(value));
    props.item
      .calculatedNutritionInfo(props.priceType)
      .then((value) => setNutritionInfo(value));
  }, [props.item, props.priceType, props.item.subitems]);

  return (
    <Tr key={props.item.id}>
      <Td width={"144px"} key={`${props.item.id}-actions`}>
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
      </Td>
      <Td key={`${props.item.id}-name`}>
        <Text noOfLines={2}>{props.item.name}</Text>
      </Td>

      <Td key={`${props.item.id}-price`} isNumeric>
        {price === null ? <Spinner /> : currencyFormatter.format(price / 100)}
      </Td>
      <Td key={`${props.item.id}-item`} isNumeric>
        {props.item.count}
      </Td>
      <Td key={`${props.item.id}-massGrams`} isNumeric>
        {nutritionInfo?.massGrams}g
      </Td>
      <Td key={`${props.item.id}-energyKilocalories`} isNumeric>
        {nutritionInfo?.energyKilocalories}kcal
      </Td>
      <Td key={`${props.item.id}-fatGrams`} isNumeric>
        {nutritionInfo?.fatGrams}g
      </Td>
      <Td key={`${props.item.id}-carbohydrateGrams`} isNumeric>
        {nutritionInfo?.carbohydrateGrams}g
      </Td>
      <Td key={`${props.item.id}-proteinGrams`} isNumeric>
        {nutritionInfo?.proteinGrams}g
      </Td>
    </Tr>
  );
}
