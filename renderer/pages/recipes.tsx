import {
  Box,
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
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";

const RecipesPage = () => {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [drawerItem, setDrawerItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const { result, fetchMore, isExhausted } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.recipe,
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
      },
    })!,
    {
      pageSize: 6,
      pagination: "Traditional",
    }
  );

  return (
    <Fragment>
      <Box>
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchMore}
          hasMore={!isExhausted}
          loader={
            <Center pt="3">
              <Spinner />
            </Center>
          }
        >
          <Table>
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
                    {yupItemSchema.fields.priceCents.spec.label}
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
                  item={value}
                  onEdit={() => {
                    setDrawerItem(value);
                  }}
                  onCopy={() => {
                    const newValue = value.toJSON() as ItemInferredType;
                    newValue.id = dataid();
                    newValue.name = `${newValue.name}-copy`;
                    newValue.createdAt = new Date();
                    collection?.upsert(newValue);
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
};

export default RecipesPage;
