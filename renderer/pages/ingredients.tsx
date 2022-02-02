import { IconCircleMinus, IconCirclePlus, IconEditCircle } from "@tabler/icons";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Button, Container, Offcanvas, Spinner, Table } from "react-bootstrap";
import { Database } from "../data/database";
import { Ingredient } from "../data/models/ingredient";
import { IngredientForm } from "../forms/IngredientForm";

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[] | undefined>(
    undefined
  );
  const [showAdd, setShowAdd] = useState(false);
  const [updateIngredient, setUpdateIngredient] = useState<
    Ingredient | undefined
  >(undefined);

  function refreshState() {
    Database.shared().ingredients.toArray().then(setIngredients);
  }

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <Container fluid className="p-0">
      <Table responsive striped>
        <thead>
          <tr>
            <th className="align-middle text-end ">
              <Button
                size="sm"
                variant="link"
                className="p-0 m-0"
                onClick={() => {
                  setShowAdd(true);
                }}
              >
                <IconCirclePlus />
              </Button>
            </th>
            <th className="align-middle">Name</th>
            <th className="align-middle text-center">Price</th>
            <th className="align-middle text-center">Servings</th>
            <th className="align-middle text-center">Mass</th>
            <th className="align-middle text-center">Energy</th>
            <th className="align-middle text-center">Fat</th>
            <th className="align-middle text-center">Carb</th>
            <th className="align-middle text-center">Protein</th>
          </tr>
        </thead>
        <tbody>
          {ingredients &&
            ingredients.map((value) => {
              return (
                <tr key={value.id}>
                  <td className="align-middle text-end">
                    <Button
                      size="sm"
                      variant="link"
                      className="text-info p-0 m-0"
                      onClick={() => {
                        setUpdateIngredient(value);
                      }}
                    >
                      <IconEditCircle />
                    </Button>
                    <Button
                      size="sm"
                      variant="link"
                      className="text-danger p-0 m-0"
                      onClick={() => {
                        Database.shared().ingredients.delete(value.id!);
                        refreshState();
                      }}
                    >
                      <IconCircleMinus />
                    </Button>
                  </td>
                  <td className="align-middle">{value.name}</td>
                  <td className="align-middle text-center">
                    {value.priceCents}
                  </td>
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
                </tr>
              );
            })}
        </tbody>
      </Table>
      {!ingredients && (
        <Spinner
          animation="border"
          size="sm"
          className="position-absolute top-50 start-50"
        />
      )}
      <Offcanvas
        show={showAdd}
        onHide={() => {
          setShowAdd(false);
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Create ingredient</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <IngredientForm
            onSubmit={(ingredient) => {
              ingredient.id = nanoid();
              Database.shared().ingredients.put(ingredient).then(refreshState);
              setShowAdd(false);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas
        show={updateIngredient !== undefined}
        onHide={() => {
          setUpdateIngredient(undefined);
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Update ingredient</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <IngredientForm
            ingredient={updateIngredient}
            onSubmit={(ingredient) => {
              Database.shared()
                .ingredients.update(ingredient, ingredient)
                .then(refreshState);
              setUpdateIngredient(undefined);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default IngredientsPage;
