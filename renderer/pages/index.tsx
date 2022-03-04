import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Center,
  IconButton,
  Input,
  Show,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Subscription } from "rxjs";
import { Pagination } from "../components/Pagination";
import { AppContext } from "../context/AppContext";
import { ItemInferredType, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";

const ItemsPage = () => {
  const [data, setData] = useState<Array<ItemInferredType> | undefined>(
    undefined
  );
  const [numberOfCellsForUsableHeight, setNumberOfCellsForUsableHeight] =
    useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const context = useContext(AppContext);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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

  useEffect(() => {
    let sub: Subscription | undefined;
    if (context.database && context.database.items) {
      sub = context.database.items
        .find()
        .where("type")
        .equals(ItemType.ingredient)
        .$.subscribe((value) => {
          setData(value);
        });
    }
    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  }, [context.database]);

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Actions</Th>
            <Th>
              <Input
                placeholder={yupItemSchema.fields.name.spec.label}
                value={""}
                onChange={(event) => {}}
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
          {data
            ?.slice(
              page * (numberOfCellsForUsableHeight ?? 0),
              page * (numberOfCellsForUsableHeight ?? 0) +
                (numberOfCellsForUsableHeight ?? 0)
            )
            .map((value) => (
              <Tr key={value.id}>
                <Td>
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
                </Td>
                <Td>
                  <Text noOfLines={2}>{value.name}</Text>
                </Td>
                <Show above="md">
                  <Td isNumeric>{formatter.format(value.priceCents / 100)}</Td>
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
            setPage(page);
          }}
          page={page}
          pages={Math.floor(
            (data?.length ?? 0) / (numberOfCellsForUsableHeight ?? 1)
          )}
        />
      </Center>
    </Box>
  );
};

export default ItemsPage;
