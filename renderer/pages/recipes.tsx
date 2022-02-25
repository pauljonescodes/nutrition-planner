import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Database, ItemQueryParameters } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { RecipeForm } from "../forms/RecipeForm";

const RecipesPage = () => {
  const [data, setData] = useState<Array<Item> | undefined>(undefined);
  const [formDrawerIsOpen, setFormDrawerIsOpen] = useState(false);
  const [perServingTotals, setPerServingTotals] = useState(true);
  const [updateEntity, setUpdateEntity] = useState<Item | undefined>(undefined);
  const [deleteEntity, setDeleteEntity] = useState<Item | undefined>(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [queryParameters, setQueryParameters] = useState<ItemQueryParameters>({
    type: ItemType.recipe,
    offset: 0,
    limit: 10,
    reverse: false,
  });

  const formFirstFieldRef = useRef<HTMLInputElement>(null);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  async function queryData() {
    setProgressPending(data === undefined);
    setData((await Database.shared().arrayOfItems(queryParameters)) ?? []);
    setProgressPending(false);
  }

  useEffect(() => {
    queryData();
  }, [queryParameters]);

  return progressPending ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>{yupItemSchema.fields.name.spec.label}</Th>
            <Th isNumeric>{yupItemSchema.fields.priceCents.spec.label}</Th>
            <Th isNumeric>{yupItemSchema.fields.count.spec.label}</Th>
            <Th isNumeric>{yupItemSchema.fields.massGrams.spec.label}</Th>
            <Th isNumeric>
              {yupItemSchema.fields.energyKilocalorie.spec.label}
            </Th>
            <Th isNumeric>{yupItemSchema.fields.fatGrams.spec.label}</Th>
            <Th isNumeric>
              {yupItemSchema.fields.carbohydrateGrams.spec.label}
            </Th>
            <Th isNumeric>{yupItemSchema.fields.proteinGrams.spec.label}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((value) => {
            const nutritionInfo = Database.shared().itemNutrition(
              value,
              perServingTotals
            );
            const price = Database.shared().itemPrice(value, perServingTotals);
            return (
              <Tr>
                <Td>{value.name}</Td>
                <Td isNumeric>{formatter.format(price / 100)}</Td>
                <Td isNumeric>{value.count}</Td>
                <Td isNumeric>{nutritionInfo.massGrams}g</Td>
                <Td isNumeric>{nutritionInfo.energyKilocalorie}</Td>
                <Td isNumeric>{nutritionInfo.fatGrams}g</Td>
                <Td isNumeric>{nutritionInfo.carbohydrateGrams}g</Td>
                <Td isNumeric>{nutritionInfo.proteinGrams}g</Td>
                <Td>
                  <ButtonGroup isAttached>
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete"
                      onClick={() => {
                        setDeleteEntity(value);
                      }}
                    />
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Edit"
                      onClick={() => {
                        setUpdateEntity(value);
                        setFormDrawerIsOpen(true);
                      }}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

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
              onSubmit={async (item) => {
                setUpdateEntity(undefined);
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
