import {
  Box,
  Button,
  Center,
  Input,
  Show,
  Spinner,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { RecipeDrawer } from "../components/drawers/RecipeDrawer";
import { RecipeTableRow } from "../components/table-rows/RecipeTableRow";
import { CalcTypeEnum } from "../data/CalcTypeEnum";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";

const RecipesPage = () => {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [drawerItem, setDrawerItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const [priceType, setPriceType] = useState<CalcTypeEnum>(
    CalcTypeEnum.perServing
  );
  const itemCollection = useRxCollection<ItemDocument>("item");
  const { result, fetchMore, isExhausted } = useRxQuery(
    itemCollection?.find({
      selector: {
        type: ItemTypeEnum.recipe,
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
          <Table key="table">
            <Thead>
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

                <Show above="md">
                  <Th isNumeric>
                    <Button
                      variant="ghost"
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
                </Show>
                <Show above="lg">
                  <Th isNumeric>{yupItemSchema.fields.count.spec.label}</Th>
                  <Th isNumeric>{yupItemSchema.fields.massGrams.spec.label}</Th>
                </Show>
                <Show above="xl">
                  <Th isNumeric>
                    {yupItemSchema.fields.energyKilocalorie.spec.label}
                  </Th>
                </Show>
                <Show above="2xl">
                  <Th isNumeric>{yupItemSchema.fields.fatGrams.spec.label}</Th>
                  <Th isNumeric>
                    {yupItemSchema.fields.carbohydrateGrams.spec.label}
                  </Th>
                  <Th isNumeric>
                    {yupItemSchema.fields.proteinGrams.spec.label}
                  </Th>
                </Show>
              </Tr>
            </Thead>
            <Tbody>
              {result?.map((value) => (
                <RecipeTableRow
                  key={value.id}
                  item={value}
                  priceType={priceType}
                  onEdit={() => {
                    setDrawerItem(value);
                  }}
                  onCopy={() => {
                    const newValue = value.toMutableJSON() as ItemInferredType;
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
        </InfiniteScroll>
      </Box>
      <RecipeDrawer
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
};

export default RecipesPage;
