import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
import { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { IngredientDrawer } from "../components/drawers/IngredientDrawer";

import { dataid } from "../data/dataid";
import { ItemTypeEnum } from "../data/ItemTypeEnum";
import { ItemDocument } from "../data/rxdb/item";
import { ItemInferredType, yupItemSchema } from "../data/yup/item";

const ItemsPage = () => {
  const [nameSearch, setNameSearch] = useState<string>("");
  const [drawerItem, setDrawerItem] = useState<ItemDocument | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemDocument | null>(null);
  const collection = useRxCollection<ItemDocument>("item");
  const { result, fetchMore, isExhausted } = useRxQuery(
    collection?.find({
      selector: {
        type: ItemTypeEnum.ingredient,
        name: { $regex: new RegExp("\\b" + nameSearch + ".*", "i") },
      },
    })!,
    {
      pageSize: 6,
      pagination: "Infinite",
    }
  );

  const numberFormatter = new Intl.NumberFormat();

  return (
    <Fragment>
      <Box>
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchMore}
          hasMore={!isExhausted}
          loader={
            <Center pt="3">
              <Spinner />
            </Center>
          }
        >
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
              {result?.map((value: ItemDocument) => (
                <Tr key={value.id}>
                  <Td width={"144px"}>
                    <ButtonGroup isAttached size={"sm"}>
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit"
                        onClick={() => {
                          setDrawerItem(value);
                        }}
                      />
                      <IconButton
                        icon={<CopyIcon />}
                        aria-label="Duplicate"
                        onClick={() => {
                          const newValue =
                            value.toMutableJSON() as ItemInferredType;
                          const id = dataid();
                          newValue.id = id;
                          newValue.createdAt = new Date();
                          newValue.name = `${newValue.name}-copy`;
                          collection?.upsert(newValue);
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete"
                        onClick={() => {
                          setDeleteItem(value);
                        }}
                      />
                    </ButtonGroup>
                  </Td>
                  <Td>
                    {value.name.length > 0 ? (
                      <Text noOfLines={2}>{value.name}</Text>
                    ) : (
                      "a"
                    )}
                  </Td>
                  <Show above="md">
                    <Td isNumeric>
                      {numberFormatter.format(value.priceCents / 100)}
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
        </InfiniteScroll>
      </Box>
      <IngredientDrawer
        item={drawerItem}
        onResult={(item) => {
          setDrawerItem(null);
          if (item) {
            item.createdAt = new Date();
            collection?.upsert(item);
          }
        }}
      />
      <DeleteAlertDialog
        isOpen={deleteItem !== null}
        onResult={function (result: boolean): void {
          if (result) {
            deleteItem?.remove();
          }
          setDeleteItem(null);
        }}
      />
    </Fragment>
  );
};

export default ItemsPage;
