import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
import { Pagination } from "../components/Pagination";
import { AppContext } from "../context/AppContext";
import { Database, ItemQueryParameters } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";

const ItemsPage = () => {
  const [data, setData] = useState<Array<Item> | undefined>(undefined);
  const [dataCount, setDataCount] = useState<number | undefined>(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [queryParameters, setQueryParameters] = useState<ItemQueryParameters>({
    type: ItemType.ingredient,
    page: 0,
    limit: 10,
    reverse: false,
  });
  const pages = Math.floor((dataCount ?? 0) / queryParameters.limit);
  if (dataCount !== undefined && queryParameters.page > pages) {
    setQueryParameters({ ...queryParameters, page: pages });
  }

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
            <Pagination
              onSetPage={(page) => {
                setQueryParameters({ ...queryParameters, page });
              }}
              page={queryParameters.page}
              pages={pages}
            />
          </Center>
        </Box>
      )}
    </AppContext.Consumer>
  );
};

export default ItemsPage;
