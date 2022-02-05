import { IconCircleMinus, IconCirclePlus, IconEditCircle } from "@tabler/icons";
import { nanoid } from "nanoid";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Fade,
  Offcanvas,
  Row,
  Table,
} from "react-bootstrap";
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
    <Fragment>
      <Fade in={ingredients !== undefined}>
        <Container fluid className="gx-0">
          <Row className="gx-0">
            <Col>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th className="align-middle">Name</th>
                    <th className="align-middle text-center">Price</th>
                    <th className="align-middle text-center">Servings</th>
                    <th className="align-middle text-center d-none d-md-table-cell">
                      Mass
                    </th>
                    <th className="align-middle text-center d-none d-md-table-cell">
                      Energy
                    </th>
                    <th className="align-middle text-center d-none d-sm-table-cell">
                      Fat
                    </th>
                    <th className="align-middle text-center d-none d-sm-table-cell">
                      Carb
                    </th>
                    <th className="align-middle text-center d-none d-sm-table-cell">
                      Protein
                    </th>
                    <th className="align-middle text-center">
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
                  </tr>
                </thead>

                <tbody>
                  {ingredients &&
                    ingredients.map((value) => {
                      return (
                        <tr key={value.id}>
                          <td className="align-middle">{value.name}</td>
                          <td className="align-middle text-center">
                            {value.priceCents}
                          </td>
                          <td className="align-middle text-center">
                            {value.servingCount}
                          </td>
                          <td className="align-middle text-center d-none d-md-table-cell">
                            {value.servingMassGrams}
                          </td>
                          <td className="align-middle text-center d-none d-md-table-cell">
                            {value.servingEnergyKilocalorie}
                          </td>
                          <td className="align-middle text-center d-none d-sm-table-cell">
                            {value.servingFatGrams}
                          </td>
                          <td className="align-middle text-center d-none d-sm-table-cell">
                            {value.servingCarbohydrateGrams}
                          </td>
                          <td className="align-middle text-center d-none d-sm-table-cell">
                            {value.servingProteinGrams}
                          </td>
                          <td className="align-middle text-center">
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
                              onClick={async () => {
                                await Database.shared().ingredients.delete(
                                  value.id!
                                );
                                await Database.shared()
                                  .ingredientInRecipes.where("ingredientId")
                                  .equals(value.id)
                                  .delete();
                                refreshState();
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
            </Col>
          </Row>
        </Container>
      </Fade>
      <Offcanvas
        show={showAdd}
        placement="end"
        onHide={() => {
          setShowAdd(false);
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Create ingredient</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
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
        placement="end"
        onHide={() => {
          setUpdateIngredient(undefined);
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Update ingredient</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
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
    </Fragment>
  );
};

export default IngredientsPage;
