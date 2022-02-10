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
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DataTable, { Media } from "react-data-table-component";
import useScrollbarSize from "react-scrollbar-size";
import { MainMenu } from "../components/MainMenu";
import { Database, QueryParameters } from "../data/database";
import {
  Ingredient,
  IngredientInterface,
  yupIngredientSchema,
} from "../data/models/ingredient";
import { IngredientForm } from "../forms/IngredientForm";

const IngredientsPage = () => {
  const { colorMode } = useColorMode();
  const { height } = useScrollbarSize();
  const [data, setData] = useState<Array<IngredientInterface> | undefined>(
    undefined
  );
  const [formDrawerIsOpen, setFormDrawerIsOpen] = useState(false);
  const [updateIngredient, setUpdateIngredient] = useState<
    IngredientInterface | undefined
  >(undefined);
  const [deleteIngredient, setDeleteIngredient] = useState<
    IngredientInterface | undefined
  >(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [perServingTotals, setPerServingTotals] = useState(false);
  const [queryParameters, setQueryParameters] = useState<
    QueryParameters<IngredientInterface>
  >({
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

  async function queryData() {
    setProgressPending(true);
    setData(
      (await Database.shared().arrayOfIngredients(queryParameters)) ?? []
    );
    setDataCount(await Database.shared().countOfIngredients());
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

  console.log(Ingredient.name.toString());

  if (numberOfCellsForUsableHeight === undefined) {
    return (
      <Center pt="5">
        <Spinner />
      </Center>
    );
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
            cell: (row: IngredientInterface) => (
              <ButtonGroup>
                <IconButton
                  size={"xs"}
                  icon={<EditIcon />}
                  aria-label="Edit"
                  onClick={() => {
                    setUpdateIngredient(row);
                    setFormDrawerIsOpen(true);
                  }}
                />
                <IconButton
                  size={"xs"}
                  icon={<DeleteIcon />}
                  aria-label="Delete"
                  onClick={() => {
                    setDeleteIngredient(row);
                  }}
                />
              </ButtonGroup>
            ),

            center: true,
          },
          {
            name: yupIngredientSchema.fields.name.spec.label,
            selector: (row: Ingredient) => row.name,
            sortField: Ingredient.name.toString(),
            sortable: true,
            grow: 3,
          },
          {
            name: yupIngredientSchema.fields.totalPriceCents.spec.label,
            selector: (row: Ingredient) =>
              formatter.format(
                row.totalPriceCents /
                  (perServingTotals ? row.servingCount : 1) /
                  100
              ),
            center: true,
            sortField:
              yupIngredientSchema.fields.totalPriceCents.spec.meta["key"],
            sortable: true,
            hide: Media.SM,
          },
          {
            name: yupIngredientSchema.fields.servingCount.spec.label,
            selector: (row: Ingredient) => row.servingCount,
            center: true,
            sortField: yupIngredientSchema.fields.servingCount.spec.meta["key"],
            sortable: true,
            hide: Media.MD,
          },
          {
            name: yupIngredientSchema.fields.servingMassGrams.spec.label,
            selector: (row: Ingredient) => row.servingMassGrams,
            center: true,
            sortField:
              yupIngredientSchema.fields.servingMassGrams.spec.meta["key"],
            sortable: true,
            hide: Media.MD,
          },
          {
            name: yupIngredientSchema.fields.servingEnergyKilocalorie.spec
              .label,
            selector: (row: Ingredient) => row.servingEnergyKilocalorie,
            center: true,
            sortField:
              yupIngredientSchema.fields.servingEnergyKilocalorie.spec.meta[
                "key"
              ],
            sortable: true,
            hide: Media.MD,
          },
          {
            name: yupIngredientSchema.fields.servingFatGrams.spec.label,
            selector: (row: Ingredient) => row.servingFatGrams,
            center: true,
            sortField:
              yupIngredientSchema.fields.servingFatGrams.spec.meta["key"],
            sortable: true,
            hide: Media.LG,
          },
          {
            name: yupIngredientSchema.fields.servingCarbohydrateGrams.spec
              .label,
            selector: (row: Ingredient) => row.servingCarbohydrateGrams,
            center: true,
            sortField:
              yupIngredientSchema.fields.servingCarbohydrateGrams.spec.meta[
                "key"
              ],
            sortable: true,
            hide: Media.LG,
          },
          {
            name: yupIngredientSchema.fields.servingProteinGrams.spec.label,
            selector: (row: Ingredient) => row.servingProteinGrams,
            center: true,
            sortField:
              yupIngredientSchema.fields.servingProteinGrams.spec.meta["key"],
            sortable: true,
            hide: Media.LG,
          },
        ]}
        data={data ?? []}
        progressPending={progressPending}
        progressComponent={<Spinner />}
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
            sortBy: selectedColumn.sortField as keyof IngredientInterface,
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
        onClose={() => setFormDrawerIsOpen(false)}
        finalFocusRef={undefined}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {updateIngredient ? "Update" : "Create"} ingredient
          </DrawerHeader>

          <DrawerBody>
            <IngredientForm
              ingredient={updateIngredient}
              onSubmit={async (ingredient) => {
                var id = await Database.shared().putIngredient(ingredient);
                queryData();
                setUpdateIngredient(undefined);
                setFormDrawerIsOpen(false);
                return id;
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={deleteIngredient !== undefined}
        onClose={() => setDeleteIngredient(undefined)}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Ingredient</AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonGroup>
                <Button onClick={() => setDeleteIngredient(undefined)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await Database.shared().deleteIngredient(
                      deleteIngredient?.id!
                    );
                    setDeleteIngredient(undefined);
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

export default IngredientsPage;
