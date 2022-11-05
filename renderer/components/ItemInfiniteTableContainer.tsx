import {
  Button,
  Center,
  Input,
  Table,
  TableContainer,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { RxDocument } from "rxdb";
import { CalculationTypeEnum } from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";
import { yupItemSchema } from "../data/yup/item";
import { ItemTableRow } from "./ItemTableRow";

type ItemTableContainerProps = {
  items: RxDocument<ItemDocument>[];
  nameSearch: string;
  emptyStateText?: string;
  onNameSearchChange: (value: string) => void;
  calculationType: CalculationTypeEnum;
  onToggleCalculationType?: () => void;
  queryFetchMore: () => void;
  queryIsExhausted: boolean;
  onEdit: (value: RxDocument<ItemDocument>) => void;
  onCopy: (value: RxDocument<ItemDocument>) => void;
  onDelete: (value: RxDocument<ItemDocument>) => void;
};

export default function ItemInfiniteTableContainer(
  props: ItemTableContainerProps
) {
  const subtleTextColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");
  const normalTextColor = useColorModeValue("gray.100", "gray.400");

  return (
    <Fragment>
      <TableContainer className="hide-scrollbar">
        <Table>
          <Thead>
            <Tr>
              <Th width={"144px"}>Actions</Th>
              <Th width={"496px"}>
                <Input
                  placeholder={yupItemSchema.fields.name.spec.label}
                  value={props.nameSearch}
                  onChange={(e) => {
                    props.onNameSearchChange(e.currentTarget.value);
                  }}
                  size="sm"
                  variant="unstyled"
                />
              </Th>
              <Th isNumeric>
                <Button
                  variant="ghost"
                  textTransform="uppercase"
                  size="xs"
                  color={normalTextColor}
                  onClick={() => {
                    if (props.onToggleCalculationType) {
                      props.onToggleCalculationType();
                    }
                  }}
                >
                  {props.calculationType}
                </Button>
              </Th>
              <Th isNumeric>{yupItemSchema.fields.count.spec.label}</Th>
              <Th isNumeric>{yupItemSchema.fields.massGrams.spec.label}</Th>
              <Th isNumeric>
                {yupItemSchema.fields.energyKilocalories.spec.label}
              </Th>
              <Th isNumeric>{yupItemSchema.fields.fatGrams.spec.label}</Th>
              <Th isNumeric>
                {yupItemSchema.fields.carbohydrateGrams.spec.label}
              </Th>
              <Th isNumeric>{yupItemSchema.fields.proteinGrams.spec.label}</Th>
            </Tr>
          </Thead>
          <InfiniteScroll
            pageStart={0}
            loadMore={props.queryFetchMore}
            hasMore={!props.queryIsExhausted}
            element="tbody"
          >
            {props.items.map((value: RxDocument<ItemDocument>) => (
              <ItemTableRow
                key={`${value.id}-itr`}
                item={value}
                priceType={props.calculationType}
                onEdit={function (): void {
                  props.onEdit(value);
                }}
                onCopy={function (): void {
                  props.onCopy(value);
                }}
                onDelete={function (): void {
                  props.onDelete(value);
                }}
              />
            ))}
          </InfiniteScroll>
        </Table>
      </TableContainer>
      {props.items.length === 0 && props.emptyStateText !== undefined && (
        <Center pt="30vh">
          <Text color={subtleTextColor} align="center" px={3}>
            {props.emptyStateText}
          </Text>
        </Center>
      )}
    </Fragment>
  );
}
