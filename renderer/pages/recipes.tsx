import {
  Box,
  Center,
  Input,
  Show,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { RecipeDrawer } from "../components/drawers/RecipeDrawer";
import { Pagination } from "../components/Pagination";
import { RecipeTableRow } from "../components/table-rows/RecipeTableRow";
import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";

const RecipesPage = () => {
  const [page, setPage] = useState(0);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);
  const [drawerItem, setDrawerItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const { result, fetchPage, pageCount } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.recipe,
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
      },
    })!,
    {
      pageSize: numberOfCellsForUsableHeight,
      pagination: "Traditional",
    }
  );

  function handleResize() {
    const usableHeight = (window.innerHeight ?? 0) - 64 * 2 - 40;
    const cellHeight = 73;
    const newNumberOfCellsForUsableHeight = Math.floor(
      usableHeight / cellHeight
    );
    if (newNumberOfCellsForUsableHeight !== numberOfCellsForUsableHeight) {
      setNumberOfCellsForUsableHeight(newNumberOfCellsForUsableHeight);
    }
  }

  function buildLoadingResult() {
    return Array(numberOfCellsForUsableHeight).fill({
      ...yupItemSchema.getDefault(),
      id: dataid(),
    });
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <Fragment>
      <Box>
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
                <Th isNumeric>{yupItemSchema.fields.priceCents.spec.label}</Th>
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
        <Center p={3} position="fixed" bottom="0" width="100%">
          <Pagination
            onSetPage={(page) => {
              fetchPage(page + 1);
              setPage(page);
            }}
            page={page}
            pages={pageCount}
          />
        </Center>
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
