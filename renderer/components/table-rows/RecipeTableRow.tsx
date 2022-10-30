import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Center,
  IconButton,
  Show,
  Spinner,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CalcTypeEnum } from "../../data/CalcTypeEnum";
import { NutritionInfo } from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";

type RecipeTableRowProps = {
  item: ItemDocument;
  priceType: CalcTypeEnum;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export function RecipeTableRow(props: RecipeTableRowProps) {
  // const value =props.item.servingPriceCents()
  const numberFormatter = new Intl.NumberFormat();
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
  }, [props.item, props.priceType]);

  return (
    <Tr key={props.item.id}>
      <Td width={"144px"}>
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
      <Td>
        <Text noOfLines={2}>{props.item.name}</Text>
      </Td>

      <Show above="md">
        <Td isNumeric>
          {price === null ? <Spinner /> : numberFormatter.format(price / 100)}
        </Td>
      </Show>
      <Show above="lg">
        <Td isNumeric>{props.item.count}</Td>
        <Td isNumeric>{nutritionInfo?.massGrams}g</Td>
      </Show>
      <Show above="xl">
        <Td isNumeric>{nutritionInfo?.energyKilocalorie}</Td>
      </Show>
      <Show above="2xl">
        <Td isNumeric>{nutritionInfo?.fatGrams}g</Td>
        <Td isNumeric>{nutritionInfo?.carbohydrateGrams}g</Td>
        <Td isNumeric>{nutritionInfo?.proteinGrams}g</Td>
      </Show>
    </Tr>
  );
}
