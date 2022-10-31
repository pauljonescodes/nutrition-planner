import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ButtonGroup, IconButton, Show, Td, Text, Tr } from "@chakra-ui/react";
import { currencyFormatter } from "../../data/number-formatter";
import { CalcTypeEnum } from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";

type IngredientTableRowProps = {
  item: ItemDocument;
  priceType: CalcTypeEnum;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

function IngredientTableRow(props: IngredientTableRowProps) {
  const value = props.item;
  return (
    <Tr key={value.id}>
      <Td width={"144px"}>
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
      </Td>
      <Td>
        {value.name.length > 0 ? <Text noOfLines={2}>{value.name}</Text> : "a"}
      </Td>
      <Show above="md">
        <Td isNumeric>
          {currencyFormatter.format(
            value.priceCents /
              100 /
              (props.priceType === CalcTypeEnum.perServing ? value.count : 1)
          )}
        </Td>
      </Show>
      <Show above="lg">
        <Td isNumeric>{value.count}</Td>
        <Td isNumeric>{value.massGrams}g</Td>
      </Show>
      <Show above="xl">
        <Td isNumeric>{value.energyKilocalories}</Td>
        <Td isNumeric>{value.fatGrams}g</Td>
        <Td isNumeric>{value.carbohydrateGrams}g</Td>
        <Td isNumeric>{value.proteinGrams}g</Td>
      </Show>
    </Tr>
  );
}

export default IngredientTableRow;
