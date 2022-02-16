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
import { useEffect, useRef, useState } from "react";
import DataTable, { Media } from "react-data-table-component";
import useScrollbarSize from "react-scrollbar-size";
import { MainMenu } from "../components/MainMenu";
import { Database, ItemQueryParameters } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { RecipeForm } from "../forms/RecipeForm";

const RecipesPage = () => {
  const { colorMode } = useColorMode();
  const { height } = useScrollbarSize();
  const [data, setData] = useState<Array<Item> | undefined>(undefined);
  const [formDrawerIsOpen, setFormDrawerIsOpen] = useState(false);
  const [perServingTotals, setPerServingTotals] = useState(true);
  const [updateEntity, setUpdateEntity] = useState<Item | undefined>(undefined);
  const [deleteEntity, setDeleteEntity] = useState<Item | undefined>(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [queryParameters, setQueryParameters] = useState<ItemQueryParameters>({
    type: ItemType.recipe,
    offset: 0,
    limit: 10,
    reverse: false,
  });
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);
  const formFirstFieldRef = useRef<HTMLInputElement>(null);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  async function queryData() {
    setProgressPending(true);
    setData((await Database.shared().arrayOfItems(queryParameters)) ?? []);
    setDataCount(await Database.shared().countOfItems(ItemType.ingredient));
    setProgressPending(false);
  }

  function handleResize() {
    const usableHeight = (window.innerHeight ?? 0) - 72 - 56;
    const cellHeight = 48;
    const newNumberOfCellsForUsableHeight =
      Math.round(usableHeight / cellHeight) - 2;
    if (newNumberOfCellsForUsableHeight !== numberOfCellsForUsableHeight) {
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
            <Heading size="md">Recipes</Heading>
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
                    setUpdateEntity(row);
                    setFormDrawerIsOpen(true);
                  }}
                />
                <IconButton
                  size={"xs"}
                  icon={<DeleteIcon />}
                  aria-label="Delete"
                  onClick={() => {
                    setDeleteEntity(row);
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
            grow: 4,
          },
          {
            name: yupItemSchema.fields.priceCents.spec.label,
            selector: (row: Item) =>
              Database.shared().formattedItemPrice(row, perServingTotals),
            center: true,
          },
          {
            name: yupItemSchema.fields.massGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                ?.massGrams ?? 0,
            center: true,
            hide: Media.SM,
          },
          {
            name: yupItemSchema.fields.energyKilocalorie.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                ?.energyKilocalorie ?? 0,
            center: true,
            hide: Media.SM,
          },
          {
            name: yupItemSchema.fields.fatGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                ?.fatGrams ?? 0,
            center: true,
            hide: Media.MD,
          },
          {
            name: yupItemSchema.fields.carbohydrateGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                ?.carbohydrateGrams ?? 0,
            center: true,
            hide: Media.MD,
          },
          {
            name: yupItemSchema.fields.proteinGrams.spec.label,
            selector: (row: Item) =>
              Database.shared().itemNutrition(row, perServingTotals)
                ?.proteinGrams ?? 0,
            center: true,
            hide: Media.MD,
          },
        ]}
        data={data ?? []}
        progressPending={progressPending}
        progressComponent={<div />}
        noDataComponent={
          <Text>When added, your recipes will show up here.</Text>
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
          setUpdateEntity(undefined);
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
            {updateEntity ? "Update" : "Create"} recipe
          </DrawerHeader>

          <DrawerBody>
            <RecipeForm
              item={updateEntity}
              firstInputFieldRef={formFirstFieldRef}
              onSubmit={async (item) => {
                const saved = await Database.shared().saveItem(item);
                queryData();
                setUpdateEntity(undefined);
                setFormDrawerIsOpen(false);
                return saved.id;
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={deleteEntity !== undefined}
        onClose={() => setDeleteEntity(undefined)}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Recipe</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup>
                <Button onClick={() => setDeleteEntity(undefined)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await Database.shared().deleteItem(deleteEntity?.id!);
                    setDeleteEntity(undefined);
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

export default RecipesPage;
