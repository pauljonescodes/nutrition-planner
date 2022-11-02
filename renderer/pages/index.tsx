import {
  Box,
  Button,
  Input,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { ItemDrawer } from "../components/drawers/ItemDrawer";
import { ItemTableRow } from "../components/ItemTableRow";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { CalcTypeEnum } from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";

export default function ItemsPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [drawerItem, setDrawerItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const [priceType, setPriceType] = useState<CalcTypeEnum>(
    CalcTypeEnum.perServing
  );
  const { result, fetchMore, isExhausted } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.item,
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
      },
    })!,
    {
      pageSize: 6,
      pagination: "Infinite",
    }
  );

  return (
    <Fragment>
      <Box>
        <TableContainer className="hide-scrollbar">
          <Table>
            <Thead height={"50px"}>
              <Tr>
                <Th>Actions</Th>
                <Th>
                  <Input
                    placeholder={yupItemSchema.fields.name.spec.label}
                    value={nameSearch}
                    onChange={(e) => {
                      setNameSearch(e.currentTarget.value);
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
                      setPriceType(
                        priceType === CalcTypeEnum.perServing
                          ? CalcTypeEnum.total
                          : CalcTypeEnum.perServing
                      );
                    }}
                  >
                    {priceType}
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
                <Th isNumeric>
                  {yupItemSchema.fields.proteinGrams.spec.label}
                </Th>
              </Tr>
            </Thead>
            <InfiniteScroll
              pageStart={0}
              loadMore={fetchMore}
              hasMore={!isExhausted}
              element="tbody"
            >
              {result?.map((value: ItemDocument) => (
                <ItemTableRow
                  key={`${value.id}-itr`}
                  item={value}
                  priceType={priceType}
                  onEdit={function (): void {
                    setDrawerItem(value);
                  }}
                  onCopy={function (): void {
                    const newValue = value.toMutableJSON() as ItemInferredType;
                    const id = dataid();
                    newValue.id = id;
                    newValue.createdAt = new Date();
                    newValue.name = `${newValue.name}-copy`;
                    collection?.upsert(newValue);
                  }}
                  onDelete={function (): void {
                    setDeleteItem(value);
                  }}
                />
              ))}
            </InfiniteScroll>
          </Table>
        </TableContainer>
      </Box>
      <ItemDrawer
        item={drawerItem}
        onResult={(item) => {
          setDrawerItem(null);
          if (item) {
            item.createdAt = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <DeleteAlertDialog
        isOpen={deleteItem !== null}
        onResult={function (result: boolean): void {
          if (result) {
            deleteItem?.remove();
          }
          setDeleteItem(null);
        }}
      />
    </Fragment>
  );
}
