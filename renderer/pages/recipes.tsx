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
import { useEffect, useState } from "react";
import DataTable, { Media } from "react-data-table-component";
import useScrollbarSize from "react-scrollbar-size";
import { MainMenu } from "../components/MainMenu";
import { Database, QueryParameters } from "../data/database";
import { IngredientInRecipe } from "../data/models/ingredient-in-recipe";
import { Recipe, yupRecipeSchema } from "../data/models/recipe";
import { RecipeForm } from "../forms/RecipeForm";

const RecipesPage = () => {
  const { colorMode } = useColorMode();
  const { height } = useScrollbarSize();
  const [data, setData] = useState<Array<Recipe> | undefined>(undefined);
  const [formDrawerIsOpen, setFormDrawerIsOpen] = useState(false);
  const [perServingTotals, setPerServingTotals] = useState(false);
  const [updateEntity, setUpdateEntity] = useState<Recipe | undefined>(
    undefined
  );
  const [deleteEntity, setDeleteEntity] = useState<Recipe | undefined>(
    undefined
  );
  const [progressPending, setProgressPending] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [queryParameters, setQueryParameters] = useState<
    QueryParameters<Recipe>
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
    const interfaces =
      (await Database.shared().arrayOfRecipes(queryParameters)) ?? [];
    const classes: Array<Recipe> = [];

    for (const theInterface of interfaces) {
      const loaded = await Recipe.load(theInterface.id);
      if (loaded !== undefined) {
        const wLoaded: Array<IngredientInRecipe> = [];
        for (const ingredientInRecipe of loaded.ingredientsInRecipe ?? []) {
          wLoaded.push(
            await IngredientInRecipe.loadIngredient(ingredientInRecipe)
          );
        }
        loaded.ingredientsInRecipe = wLoaded;
        classes.push(loaded);
      }
    }

    setData(classes);
    setDataCount(await Database.shared().countOfRecipes());
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
            cell: (row: Recipe) => (
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
            name: yupRecipeSchema.fields.name.spec.label,
            selector: (row: Recipe) => row.name,
            sortField: yupRecipeSchema.fields.name.spec.meta["key"],
            sortable: true,
            grow: 4,
          },
          {
            name: "Price",
            selector: (row: Recipe) =>
              formatter.format(
                (Recipe.nutritionInfo(row, perServingTotals)?.priceCents ?? 0) /
                  100
              ),
            center: true,
          },
          {
            name: "Mass",
            selector: (row: Recipe) =>
              Recipe.nutritionInfo(row, perServingTotals)?.massGrams ?? 0,
            center: true,
            hide: Media.SM,
          },
          {
            name: "Calories",
            selector: (row: Recipe) =>
              Recipe.nutritionInfo(row, perServingTotals)?.energyKilocalorie ??
              0,
            center: true,
            hide: Media.SM,
          },
          {
            name: "Fat",
            selector: (row: Recipe) =>
              Recipe.nutritionInfo(row, perServingTotals)?.fatGrams ?? 0,
            center: true,
            hide: Media.MD,
          },
          {
            name: "Carb",
            selector: (row: Recipe) =>
              Recipe.nutritionInfo(row, perServingTotals)?.carbohydrateGrams ??
              0,
            center: true,
            hide: Media.MD,
          },
          {
            name: "Protein",
            selector: (row: Recipe) =>
              Recipe.nutritionInfo(row, perServingTotals)?.proteinGrams ?? 0,
            center: true,
            hide: Media.MD,
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
            sortBy: selectedColumn.sortField as keyof Recipe,
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
              recipe={updateEntity}
              onSubmit={async (recipe) => {
                const saved = await Recipe.save(recipe);
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
                    await Database.shared().deleteRecipe(deleteEntity?.id!);
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
