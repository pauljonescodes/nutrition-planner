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
import { RxNPItemDocument } from "../data/rxnp/RxNPItemSchema";
import { ServingOrTotalEnum } from "../data/interfaces/ServingOrTotalEnum";
import { ItemTableRow } from "./ItemTableRow";
import { useTranslation } from "react-i18next";

type ItemTableContainerProps = {
  nameSearch: string;
  emptyStateText?: string;
  onNameSearchChange: (value: string) => void;
  servingOrTotal: ServingOrTotalEnum;
  onToggleServingOrTotal?: () => void;
  documents?: RxNPItemDocument[] | undefined;
  isFetching: boolean;
  isExhausted: boolean;
  fetchMore: () => void;
  onEdit: (value: RxNPItemDocument) => void;
  onCopy: (value: RxNPItemDocument) => void;
  onDelete: (value: RxNPItemDocument) => void;
};

export function ItemInfiniteTableContainer(
  props: ItemTableContainerProps
) {
  const subtleTextColor = useColorModeValue("blackAlpha.600", "whiteAlpha.600");
  const { t } = useTranslation();

  return (
    <Fragment>
      <TableContainer className="hide-scrollbar">
        <Table>
          <Thead>
            <Tr>
              <Th width={"144px"}>{t("actions")}</Th>
              <Th width={"496px"}>
                <Input
                  placeholder={t("name")}
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
                  {t(props.servingOrTotal)}
                </Button>
              </Th>
              <Th isNumeric>{t("count")}</Th>
              <Th isNumeric>{t("mass")}</Th>
              <Th isNumeric>{t("energy")}</Th>
              <Th isNumeric>{t("fat")}</Th>
              <Th isNumeric>{t("carb")}</Th>
              <Th isNumeric>{t("protein")}</Th>
            </Tr>
          </Thead>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => props.fetchMore()}
            hasMore={!props.isExhausted}
            element="tbody"
          >
            {props.documents?.map((value: RxNPItemDocument) => (
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
