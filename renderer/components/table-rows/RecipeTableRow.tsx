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
import { nutritionInfo } from "../../data/nutrition-info";
import { ItemDocument } from "../../data/rxdb/item";

type RecipeTableRowProps = {
  item: ItemDocument;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export function RecipeTableRow(props: RecipeTableRowProps) {
  // const value =props.item.servingPriceCents()
  const numberFormatter = new Intl.NumberFormat();
  const info = nutritionInfo();
  const [servicePriceCents, setServingPriceCents] = useState<number | null>(
    null
  );

  useEffect(() => {
    props.item.servingPriceCents().then((value) => setServingPriceCents(value));
  }, [props.item]);

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
          {servicePriceCents === null ? (
            <Spinner />
          ) : (
            numberFormatter.format(servicePriceCents / 100)
          )}
        </Td>
      </Show>
      <Show above="lg">
        <Td isNumeric>{props.item.count}</Td>
        <Td isNumeric>{info.massGrams}g</Td>
      </Show>
      <Show above="xl">
        <Td isNumeric>{info.energyKilocalorie}</Td>
      </Show>
      <Show above="2xl">
        <Td isNumeric>{info.fatGrams}g</Td>
        <Td isNumeric>{info.carbohydrateGrams}g</Td>
        <Td isNumeric>{info.proteinGrams}g</Td>
      </Show>
    </Tr>
  );
}
