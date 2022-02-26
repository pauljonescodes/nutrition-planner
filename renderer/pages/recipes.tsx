import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Center,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Database, ItemQueryParameters } from "../data/Database";
import { Item, yupItemSchema } from "../data/model/Item";
import { ItemType } from "../data/model/ItemType";

const RecipesPage = () => {
  const [data, setData] = useState<Array<Item> | undefined>(undefined);
  const [progressPending, setProgressPending] = useState(false);
  const [queryParameters, setQueryParameters] = useState<ItemQueryParameters>({
    type: ItemType.recipe,
    offset: 0,
    limit: 10,
    reverse: false,
  });

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
    <AppContext.Consumer>
      {(appStateValue) => (
        <Table>
          <Thead>
            <Tr>
              <Th>Actions</Th>
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
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((value) => {
              const nutritionInfo = Database.shared().itemNutrition(
                value,
                true
              );
              const price = Database.shared().itemPrice(value, true);
              return (
                <Tr>
                  <Td>
                    <ButtonGroup isAttached>
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit"
                        onClick={() => {
                          appStateValue.setAppState!({
                            updateItem: value,
                            recipeFormDrawerIsOpen: true,
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
                  <Td>{value.name}</Td>
                  <Td isNumeric>{formatter.format(price / 100)}</Td>
                  <Td isNumeric>{value.count}</Td>
                  <Td isNumeric>{nutritionInfo.massGrams}g</Td>
                  <Td isNumeric>{nutritionInfo.energyKilocalorie}</Td>
                  <Td isNumeric>{nutritionInfo.fatGrams}g</Td>
                  <Td isNumeric>{nutritionInfo.carbohydrateGrams}g</Td>
                  <Td isNumeric>{nutritionInfo.proteinGrams}g</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </AppContext.Consumer>
  );
};

export default RecipesPage;
