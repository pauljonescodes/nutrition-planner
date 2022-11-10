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
import {
  ItemInterface,
  populatedItemServingNutrition,
  populatedItemServingPriceCents,
} from "../data/interfaces";
import { ItemTypeEnum } from "../data/item-type-enum";
import { RxDBItemDocument } from "../data/rxdb";
import { ServingOrTotalEnum } from "../data/serving-or-total-enum";
import { currencyFormatter } from "../utilities/currency-formatter";

type ItemTableRowProps = {
  document: RxDBItemDocument;
  priceType: ServingOrTotalEnum;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export function ItemTableRow(props: ItemTableRowProps) {
  const [nutritionState, setNutritionState] = useState<ItemInterface | null>(
    null
  );
  const [priceCentsState, setPriceCentsState] = useState<number | null>(null);
  const borderColorValue = useColorModeValue("gray.100", "gray.700");

  async function populate(document: RxDBItemDocument) {
    const populatedItem = await document.recursivelyPopulateSubitems();
    setNutritionState(populatedItemServingNutrition(populatedItem));
    setPriceCentsState(populatedItemServingPriceCents(populatedItem));
  }

  useEffect(() => {
    populate(props.document);
    return;
  }, [props.document.revision]);

  const isLoaded = nutritionState !== null && priceCentsState !== null;
  var priceDenominator = 1;
  var priceMultiple = 1;

  if (props.document.type === ItemTypeEnum.item) {
    if (props.priceType === ServingOrTotalEnum.total) {
      priceMultiple = props.document.count ?? 1;
    }
  } else {
    if (props.priceType === ServingOrTotalEnum.serving) {
      priceDenominator = props.document.count ?? 1;
    }
  }

  return (
    <Tr key={props.document.id} height="73px">
      <Td width={"144px"} borderColor={borderColorValue}>
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
      <Td borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          <Text
            minW={"176px"}
            maxW={"448px"}
            noOfLines={2}
            whiteSpace={"initial"}
          >
            {props.document.name}
          </Text>
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {currencyFormatter.format(
            ((priceCentsState ?? 999) / 100 / priceDenominator) * priceMultiple
          )}
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>{props.document.count}</Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>{nutritionState?.massGrams}g</Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionState?.energyKilocalories}kcal
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>{nutritionState?.fatGrams}g</Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>
          {nutritionState?.carbohydrateGrams}g
        </Skeleton>
      </Td>
      <Td isNumeric borderColor={borderColorValue}>
        <Skeleton isLoaded={isLoaded}>{nutritionState?.proteinGrams}g</Skeleton>
      </Td>
    </Tr>
  );
}
