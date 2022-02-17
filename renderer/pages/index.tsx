import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import DataTable, { Media } from "react-data-table-component";
import useScrollbarSize from "react-scrollbar-size";
import { MainMenu } from "../components/MainMenu";
import { Database, ItemQueryParameters } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { IngredientForm } from "../forms/IngredientForm";

const ItemsPage = () => {
  const { colorMode } = useColorMode();
  const { height } = useScrollbarSize();
  const [data, setData] = useState<Array<Item> | undefined>(undefined);
  const [formDrawerIsOpen, setFormDrawerIsOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState<Item | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<Item | undefined>(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [perServingTotals, setPerServingTotals] = useState(true);
  const [queryParameters, setQueryParameters] = useState<ItemQueryParameters>({
    type: ItemType.ingredient,
    offset: 0,
    limit: 10,
    reverse: false,
  });
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const formFirstFieldRef = useRef<HTMLInputElement>(null);

  async function queryData() {
    setProgressPending(data === undefined);
    setData((await Database.shared().arrayOfItems(queryParameters)) ?? []);
    setDataCount(await Database.shared().countOfItems(ItemType.ingredient));
    setProgressPending(false);
  }

  function handleResize() {
    const usableHeight = (window.innerHeight ?? 0) - 72 - 56;
    const cellHeight = 48;
    const newNumberOfCellsForUsableHeight =
      Math.round(usableHeight / cellHeight) - 2;
    if (newNumberOfCellsForUsableHeight !== queryParameters.limit) {
      setNumberOfCellsForUsableHeight(newNumberOfCellsForUsableHeight);
      setQueryParameters({
        ...queryParameters,
        limit: newNumberOfCellsForUsableHeight,
      });
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      queryData();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    queryData();
  }, [queryParameters]);

  if (numberOfCellsForUsableHeight === undefined) {
    return <div />;
  }

  return (
    <Box>
      <HStack p="4">
        <Box>
          <MainMenu />
        </Box>
        <Box flex="1">
          <Center>
            <Heading size="md">Ingredients</Heading>
          </Center>
        </Box>
        <Box>
          <ButtonGroup>
            <Button
              onClick={() => {
                setPerServingTotals(!perServingTotals);
              }}
            >
              {perServingTotals ? "Serving" : "Totals"}
            </Button>
            <IconButton
              onClick={() => setFormDrawerIsOpen(true)}
              icon={<AddIcon />}
              aria-label="Add"
            />
          </ButtonGroup>
        </Box>
      </HStack>

      <DataTable
        theme={colorMode === "light" ? "default" : "dark"}
        responsive
        sortServer
        customStyles={{
          table: {
            style: {
              height: `calc(100vh - 72px - 56px - ${height}px)`,
            },
          },
        }}
        columns={[
          {
            cell: (row: Item) => (
              <ButtonGroup>
                <IconButton
                  size={"xs"}
                  icon={<EditIcon />}
                  aria-label="Edit"
                  onClick={() => {
                    setUpdateItem(row);
                    setFormDrawerIsOpen(true);
                  }}
                />
                <IconButton
                  size={"xs"}
                  icon={<DeleteIcon />}
                  aria-label="Delete"
                  onClick={() => {
                    setDeleteItem(row);
                  }}
                />
              </ButtonGroup>
            ),

            center: true,
          },
          {
            name: yupItemSchema.fields.name.spec.label,
            selector: (row: Item) => row.name,
            sortField: yupItemSchema.fields.name.spec.meta["key"],
            sortable: true,
            grow: 3,
          },
          {
            name: yupItemSchema.fields.priceCents.spec.label,
            selector: (row: Item) =>
              formatter.format(
                Database.shared().itemPrice(row, perServingTotals) / 100
              ),
            sortable: !perServingTotals,
            center: true,
            sortField: yupItemSchema.fields.priceCents.spec.meta["key"],

            hide: Media.SM,
          },
          {
            name: yupItemSchema.fields.count.spec.label,
            selector: (row: Item) => row.count,
            center: true,
            sortField: yupItemSchema.fields.count.spec.meta["key"],
            sortable: true,
            hide: Media.MD,
          },
          {
            name: yupItemSchema.fields.massGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals).massGrams,
            sortable: perServingTotals,
            center: true,
            sortField: yupItemSchema.fields.massGrams.spec.meta["key"],
            hide: Media.MD,
          },
          {
            name: yupItemSchema.fields.energyKilocalorie.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                .energyKilocalorie,
            sortable: perServingTotals,
            center: true,
            sortField: yupItemSchema.fields.energyKilocalorie.spec.meta["key"],
            hide: Media.MD,
          },
          {
            name: yupItemSchema.fields.fatGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals).fatGrams,
            sortable: perServingTotals,
            center: true,
            sortField: yupItemSchema.fields.fatGrams.spec.meta["key"],
            hide: Media.LG,
          },
          {
            name: yupItemSchema.fields.carbohydrateGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                .carbohydrateGrams,
            sortable: perServingTotals,
            center: true,
            sortField: yupItemSchema.fields.carbohydrateGrams.spec.meta["key"],
            hide: Media.LG,
          },
          {
            name: yupItemSchema.fields.proteinGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                .proteinGrams,
            sortable: perServingTotals,
            center: true,
            sortField: yupItemSchema.fields.proteinGrams.spec.meta["key"],
            hide: Media.LG,
          },
        ]}
        data={data ?? []}
        progressPending={progressPending}
        progressComponent={<div />}
        noDataComponent={
          <Text>When added, your ingredients will show up here.</Text>
        }
        pagination
        paginationServer
        paginationServerOptions={{
          persistSelectedOnSort: true,
          persistSelectedOnPageChange: true,
        }}
        paginationTotalRows={dataCount}
        onChangeRowsPerPage={async (currentRowsPerPage: number) => {
          setQueryParameters({
            ...queryParameters,
            limit: currentRowsPerPage,
          });
        }}
        paginationPerPage={queryParameters.limit}
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
        paginationRowsPerPageOptions={[numberOfCellsForUsableHeight ?? 1]}
        onSort={(selectedColumn) => {
          setQueryParameters({
            ...queryParameters,
            sortBy: selectedColumn.sortField as keyof Item,
            reverse: !queryParameters.reverse,
          });
        }}
        onChangePage={(page: number) => {
          setQueryParameters({
            ...queryParameters,
            offset: (page - 1) * queryParameters.limit,
          });
        }}
      />
      <Drawer
        isOpen={formDrawerIsOpen}
        placement="right"
        onClose={() => {
          setUpdateItem(undefined);
          setFormDrawerIsOpen(false);
        }}
        finalFocusRef={undefined}
        initialFocusRef={formFirstFieldRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {updateItem ? "Update" : "Create"} ingredient
          </DrawerHeader>

          <DrawerBody>
            <IngredientForm
              item={updateItem}
              firstInputFieldRef={formFirstFieldRef}
              onSubmit={async (item) => {
                setUpdateItem(undefined);
                setFormDrawerIsOpen(false);
                const saved = await Database.shared().saveItem(item);
                queryData();

                return saved.id;
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={deleteItem !== undefined}
        onClose={() => setDeleteItem(undefined)}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Item</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup>
                <Button onClick={() => setDeleteItem(undefined)}>Cancel</Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await Database.shared().deleteItem(deleteItem?.id!);
                    setDeleteItem(undefined);
                    queryData();
                  }}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ItemsPage;
