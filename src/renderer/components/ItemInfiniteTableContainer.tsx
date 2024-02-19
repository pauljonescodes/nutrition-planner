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
import { RxDBItemDocument } from "../data/rxdb";
import { ServingOrTotalEnum } from "../data/serving-or-total-enum";
import { ItemTableRow } from "./ItemTableRow";

type ItemTableContainerProps = {
  nameSearch: string;
  emptyStateText?: string;
  onNameSearchChange: (value: string) => void;
  servingOrTotal: ServingOrTotalEnum;
  onToggleServingOrTotal?: () => void;
  documents?: RxDBItemDocument[] | undefined;
  isFetching: boolean;
  isExhausted: boolean;
  fetchMore: () => void;
  onEdit: (value: RxDBItemDocument) => void;
  onCopy: (value: RxDBItemDocument) => void;
  onDelete: (value: RxDBItemDocument) => void;
};

export function ItemInfiniteTableContainer(
  props: ItemTableContainerProps
) {
  const subtleTextColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");

  return (
    <Fragment>
      <TableContainer className="hide-scrollbar">
        <Table>
          <Thead>
            <Tr>
              <Th width={"144px"}>Actions</Th>
              <Th width={"496px"}>
                <Input
                  placeholder={"Name"}
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
                  onClick={() => {
                    if (props.onToggleServingOrTotal) {
                      props.onToggleServingOrTotal();
                    }
                  }}
                >
                  {props.servingOrTotal}
                </Button>
              </Th>
              <Th isNumeric>{"Count"}</Th>
              <Th isNumeric>{"Mass (g)"}</Th>
              <Th isNumeric>{"Energy (kcal)"}</Th>
              <Th isNumeric>{"Fat (g)"}</Th>
              <Th isNumeric>{"Carbohydrates (g)"}</Th>
              <Th isNumeric>{"Protein (g)"}</Th>
            </Tr>
          </Thead>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => props.fetchMore()}
            hasMore={!props.isExhausted}
            element="tbody"
          >
            {props.documents?.map((value: RxDBItemDocument) => (
              <ItemTableRow
                key={`${value.id}-itr`}
                document={value}
                priceType={props.servingOrTotal}
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
      {props.documents?.length === 0 &&
        props.emptyStateText !== undefined &&
        !props.isFetching && (
          <Center pt="30vh">
            <Text color={subtleTextColor} align="center" px={3}>
              {props.emptyStateText}
            </Text>
          </Center>
        )}
    </Fragment>
  );
}
