import {
  Box,
  Center,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { PlanDrawer } from "../components/drawers/PlanDrawer";
import { ItemTableRow } from "../components/ItemTableRow";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { CalcTypeEnum } from "../data/nutrition-info";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";

export default function PlansPage() {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [drawerItem, setDrawerItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const [priceType, setPriceType] = useState<CalcTypeEnum>(
    CalcTypeEnum.perServing
  );
  const itemCollection = useRxCollection<ItemDocument>("item");
  const { result, fetchMore, isExhausted, resetList } = useRxQuery(
    itemCollection?.find({
      selector: {
        type: ItemTypeEnum.plan,
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
        <InfiniteScroll
          key="infinite-scroll"
          pageStart={0}
          loadMore={fetchMore}
          hasMore={!isExhausted}
          loader={
            <Center pt="3">
              <Spinner />
            </Center>
          }
        >
          <TableContainer className="hide-scrollbar">
            <Table key="table">
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
                    {yupItemSchema.fields.priceCents.spec.label}
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
              <Tbody>
                {result?.map((value) => (
                  <ItemTableRow
                    key={value.id}
                    item={value}
                    priceType={priceType}
                    onEdit={() => {
                      setDrawerItem(value);
                    }}
                    onCopy={() => {
                      const newValue =
                        value.toMutableJSON() as ItemInferredType;
                      newValue.id = dataid();
                      newValue.name = `${newValue.name}-copy`;
                      newValue.createdAt = new Date();
                      itemCollection?.upsert(newValue);
                    }}
                    onDelete={() => {
                      setDeleteItem(value);
                    }}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </InfiniteScroll>
      </Box>
      <PlanDrawer
        item={drawerItem}
        onResult={async (item) => {
          setDrawerItem(null);
          if (item) {
            item.createdAt = new Date();
            itemCollection?.upsert(item as ItemInferredType);
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
