import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Center,
  IconButton,
  Input,
  Show,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Database, ItemQueryParameters } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";

const ItemsPage = () => {
  const [data, setData] = useState<Array<Item> | undefined>(undefined);
  const [dataCount, setDataCount] = useState<number>(0);
  const [progressPending, setProgressPending] = useState(false);
  const [queryParameters, setQueryParameters] = useState<ItemQueryParameters>({
    type: ItemType.ingredient,
    page: 0,
    limit: 10,
    reverse: false,
  });
  const pages = Math.floor((dataCount ?? 0) / queryParameters.limit);
  console.log(pages);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);

  async function queryData() {
    setProgressPending(data === undefined);
    setData((await Database.shared().arrayOfItems(queryParameters)) ?? []);
    setDataCount(await Database.shared().countOfItems(queryParameters));
    setProgressPending(false);
  }

  function handleResize() {
    const usableHeight = (window.innerHeight ?? 0) - 64 * 2;
    const cellHeight = 73;
    const newNumberOfCellsForUsableHeight =
      Math.round(usableHeight / cellHeight) - 1;
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

  return progressPending || numberOfCellsForUsableHeight === undefined ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <AppContext.Consumer>
      {(appStateValue) => (
        <Box>
          <Table>
            <Thead>
              <Tr>
                <Th>Actions</Th>
                <Th>
                  <Input
                    placeholder={yupItemSchema.fields.name.spec.label}
                    value={queryParameters.name}
                    onChange={(event) => {
                      setQueryParameters({
                        ...queryParameters,
                        name: event.target.value,
                      });
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
              {data?.map((value) => (
                <Tr key={value.id}>
                  <Td>
                    <ButtonGroup isAttached>
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit"
                        onClick={() => {
                          appStateValue.setAppState!({
                            updateItem: value,
                            ingredientFormDrawerIsOpen: true,
                          });
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete"
                        onClick={() => {
                          appStateValue.setAppState!({ deleteItem: value });
                        }}
                      />
                    </ButtonGroup>
                  </Td>
                  <Td>
                    <Text noOfLines={2}>{value.name}</Text>
                  </Td>
                  <Show above="md">
                    <Td isNumeric>
                      {formatter.format(value.priceCents / 100)}
                    </Td>
                  </Show>
                  <Show above="lg">
                    <Td isNumeric>{value.count}</Td>
                    <Td isNumeric>{value.massGrams}g</Td>
                  </Show>
                  <Show above="xl">
                    <Td isNumeric>{value.energyKilocalorie}</Td>
                  </Show>
                  <Show above="2xl">
                    <Td isNumeric>{value.fatGrams}g</Td>
                    <Td isNumeric>{value.carbohydrateGrams}g</Td>
                    <Td isNumeric>{value.proteinGrams}g</Td>
                  </Show>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Center p={3} position="fixed" bottom="0" width="100%">
            <ButtonGroup>
              <IconButton
                icon={<ArrowLeftIcon />}
                aria-label="Go to first page"
                onClick={() => {
                  setQueryParameters({
                    ...queryParameters,
                    page: 0,
                  });
                }}
                disabled={queryParameters.page === 0}
              />
              <IconButton
                icon={<ChevronLeftIcon />}
                aria-label="Go to previous page"
                onClick={() => {
                  setQueryParameters({
                    ...queryParameters,
                    page: queryParameters.page - 1,
                  });
                }}
                disabled={queryParameters.page === 0}
              />
            </ButtonGroup>
            <Text px="3">
              {queryParameters.page + 1} / {pages + 1}
            </Text>
            <ButtonGroup>
              <IconButton
                icon={<ChevronRightIcon />}
                aria-label="Go to next page"
                onClick={() => {
                  setQueryParameters({
                    ...queryParameters,
                    page: queryParameters.page + 1,
                  });
                }}
                disabled={queryParameters.page === pages}
              />
              <IconButton
                icon={<ArrowRightIcon />}
                aria-label="Go to last page"
                onClick={() => {
                  setQueryParameters({
                    ...queryParameters,
                    page: pages,
                  });
                }}
                disabled={queryParameters.page === pages}
              />
            </ButtonGroup>
          </Center>
        </Box>
      )}
    </AppContext.Consumer>
  );
};

export default ItemsPage;
