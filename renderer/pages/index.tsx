import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Center,
  IconButton,
  Input,
  Show,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { Pagination } from "../components/Pagination";
import { AppContext } from "../context/AppContext";
import { databaseCurrencyFormatter, ItemDocument } from "../data/Database";
import { yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";

const ItemsPage = () => {
  const context = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);

  function handleResize() {
    const usableHeight = (window.innerHeight ?? 0) - 64 * 2 - 40;
    const cellHeight = 73;
    const newNumberOfCellsForUsableHeight = Math.floor(
      usableHeight / cellHeight
    );
    setNumberOfCellsForUsableHeight(newNumberOfCellsForUsableHeight);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const { result, fetchPage, pageCount, isFetching } = useRxQuery(
    useRxCollection<ItemDocument>("items")?.find({
      selector: {
        type: ItemType.ingredient,
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
      },
    })!,
    {
      pageSize: numberOfCellsForUsableHeight,
      pagination: "Traditional",
    }
  );

  return (
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
              <Th isNumeric>{yupItemSchema.fields.proteinGrams.spec.label}</Th>
            </Show>
          </Tr>
        </Thead>
        <Tbody>
          {(isFetching
            ? Array(numberOfCellsForUsableHeight).fill(
                yupItemSchema.getDefault()
              )
            : result
          ).map((value) => (
            <Tr key={value.id}>
              <Td>
                <Skeleton isLoaded={!isFetching}>
                  <ButtonGroup isAttached>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Edit"
                      onClick={() => {
                        context.setAppState!({
                          updateItem: value,
                          ingredientFormDrawerIsOpen: true,
                        });
                      }}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete"
                      onClick={() => {
                        context.setAppState!({ deleteItem: value });
                      }}
                    />
                  </ButtonGroup>
                </Skeleton>
              </Td>
              <Td>
                <Skeleton isLoaded={!isFetching}>
                  {value.name.length > 0 ? (
                    <Text noOfLines={2}>{value.name}</Text>
                  ) : (
                    "loading"
                  )}
                </Skeleton>
              </Td>
              <Show above="md">
                <Td isNumeric>
                  <Skeleton isLoaded={!isFetching}>
                    {databaseCurrencyFormatter.format(value.priceCents / 100)}
                  </Skeleton>
                </Td>
              </Show>
              <Show above="lg">
                <Td isNumeric>
                  <Skeleton isLoaded={!isFetching}>{value.count}</Skeleton>
                </Td>
                <Td isNumeric>
                  <Skeleton isLoaded={!isFetching}>{value.massGrams}g</Skeleton>
                </Td>
              </Show>
              <Show above="xl">
                <Td isNumeric>
                  <Skeleton isLoaded={!isFetching}>
                    {value.energyKilocalorie}
                  </Skeleton>
                </Td>
              </Show>
              <Show above="2xl">
                <Td isNumeric>
                  <Skeleton isLoaded={!isFetching}>{value.fatGrams}g</Skeleton>
                </Td>
                <Td isNumeric>
                  <Skeleton isLoaded={!isFetching}>
                    {value.carbohydrateGrams}g
                  </Skeleton>
                </Td>
                <Td isNumeric>
                  <Skeleton isLoaded={!isFetching}>
                    {value.proteinGrams}g
                  </Skeleton>
                </Td>
              </Show>
            </Tr>
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
          pages={pageCount - 1}
        />
      </Center>
    </Box>
  );
};

export default ItemsPage;
