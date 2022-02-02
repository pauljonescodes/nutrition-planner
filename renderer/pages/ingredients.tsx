import { IconCircleMinus, IconCirclePlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Database } from "../data/database";
import { Ingredient } from "../data/models/ingredient";

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  function refreshState() {
    Database.shared().ingredients.toArray().then(setIngredients);
  }

  useEffect(() => {
    refreshState();
  });

  return (
    <Container fluid>
      <Table responsive>
        <thead>
          <tr>
            <th className="align-middle text-center">Name</th>
            <th className="align-middle text-center">Price</th>
            <th className="align-middle text-center">Servings</th>
            <th className="align-middle text-center">Mass (g)</th>
            <th className="align-middle text-center">Energy (kcal)</th>
            <th className="align-middle text-center">Fat (g)</th>
            <th className="align-middle text-center">Carb (g)</th>
            <th className="align-middle text-center">Protein (g)</th>
            <th className="align-middle text-center">
              <Button
                size="sm"
                variant="link"
                className="p-0 m-0"
                onClick={() => {
                  Database.shared().ingredients.put(
                    new Ingredient("Seeds", 699, 11, 30, 180, 13, 3, 10)
                  );
                }}
              >
                <IconCirclePlus />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((value) => {
            return (
              <tr key={value.id}>
                <td className="align-middle text-center">{value.name}</td>
                <td className="align-middle text-center">{value.priceCents}</td>
                <td className="align-middle text-center">
                  {value.servingCount}
                </td>
                <td className="align-middle text-center">
                  {value.servingMassGrams}
                </td>
                <td className="align-middle text-center">
                  {value.servingEnergyKilocalorie}
                </td>
                <td className="align-middle text-center">
                  {value.servingFatGrams}
                </td>
                <td className="align-middle text-center">
                  {value.servingCarbohydrateGrams}
                </td>
                <td className="align-middle text-center">
                  {value.servingProteinGrams}
                </td>
                <td className="align-middle text-center">
                  <Button
                    size="sm"
                    variant="link"
                    className="text-danger p-0 m-0"
                    onClick={() => {
                      Database.shared().ingredients.delete(value.id!);
                    }}
                  >
                    <IconCircleMinus />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default IngredientsPage;
