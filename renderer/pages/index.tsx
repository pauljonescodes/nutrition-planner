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
import React, { useEffect, useRef, useState } from "react";
import { Database, ItemQueryParameters } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";
import { IngredientForm } from "../forms/IngredientForm";

const ItemsPage = () => {
  const [data, setData] = useState<Array<Item> | undefined>(undefined);
  const [formDrawerIsOpen, setFormDrawerIsOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState<Item | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<Item | undefined>(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [dataCount, setDataCount] = useState(0);
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
          {data?.map((value) => (
            <Tr>
              <Td>{value.name}</Td>
              <Td isNumeric>{formatter.format(value.priceCents / 100)}</Td>
              <Td isNumeric>{value.count}</Td>
              <Td isNumeric>{value.massGrams}g</Td>
              <Td isNumeric>{value.energyKilocalorie}</Td>
              <Td isNumeric>{value.fatGrams}g</Td>
              <Td isNumeric>{value.carbohydrateGrams}g</Td>
              <Td isNumeric>{value.proteinGrams}g</Td>
              <Td>
                <ButtonGroup isAttached>
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete"
                    onClick={() => {
                      setDeleteItem(value);
                    }}
                  />
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit"
                    onClick={() => {
                      setUpdateItem(value);
                      setFormDrawerIsOpen(true);
                    }}
                  />
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

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
