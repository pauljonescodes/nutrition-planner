import { IconCircleMinus, IconCirclePlus, IconEditCircle } from "@tabler/icons";
import { nanoid } from "nanoid";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Container,
  Fade,
  Offcanvas,
  Spinner,
  Table,
} from "react-bootstrap";
import { Database } from "../../data/database";
import { Recipe } from "../../data/models/recipe";
import { RecipeForm } from "../../forms/RecipeForm";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[] | undefined>(undefined);
  const [showAdd, setShowAdd] = useState(false);
  const [updateRecipe, setUpdateRecipe] = useState<Recipe | undefined>(
    undefined
  );

  function refreshState() {
    Database.shared().recipes.toArray().then(setRecipes);
  }

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <Fragment>
      <Fade in={recipes !== undefined}>
        <Container fluid className="p-0">
          <Table responsive striped>
            <thead>
              <tr>
                <th className="align-middle">Name</th>
                <th className="align-middle text-center">Cost</th>
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
              {recipes &&
                recipes.map((value) => {
                  return (
                    <tr key={value.id}>
                      <td className="align-middle">{value.name}</td>
                      <td className="align-middle text-center">0</td>
                      <td className="align-middle text-center">
                        {value.servingCount}
                      </td>
                      <td className="align-middle text-center d-none d-md-table-cell">
                        0
                      </td>
                      <td className="align-middle text-center d-none d-md-table-cell">
                        0
                      </td>
                      <td className="align-middle text-center d-none d-sm-table-cell">
                        0
                      </td>
                      <td className="align-middle text-center d-none d-sm-table-cell">
                        0
                      </td>
                      <td className="align-middle text-center d-none d-sm-table-cell">
                        0
                      </td>
                      <td className="align-middle text-center">
                        <Button
                          size="sm"
                          variant="link"
                          className="text-info p-0 m-0"
                          onClick={() => {
                            setUpdateRecipe(value);
                          }}
                        >
                          <IconEditCircle />
                        </Button>
                        <Button
                          size="sm"
                          variant="link"
                          className="text-danger p-0 m-0"
                          onClick={() => {
                            Database.shared().recipes.delete(value.id!);
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
          {!recipes && (
            <Spinner
              animation="border"
              size="sm"
              className="position-absolute start-50"
            />
          )}
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
          <Offcanvas.Title>Create recipe</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <RecipeForm
            onSubmit={async (recipe) => {
              recipe.id = nanoid();
              for (const ingredientInRecipe of recipe.ingredientsInRecipe) {
                ingredientInRecipe.recipeId = recipe.id;
                ingredientInRecipe.id = nanoid();
                Database.shared().ingredientInRecipes.put(ingredientInRecipe);
              }
              await Database.shared().recipes.put(recipe);
              refreshState();
              setShowAdd(false);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas
        show={updateRecipe !== undefined}
        placement="end"
        onHide={() => {
          setUpdateRecipe(undefined);
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Update recipe</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <RecipeForm
            recipe={updateRecipe}
            onSubmit={(recipe) => {
              Database.shared()
                .recipes.update(recipe, recipe)
                .then(refreshState);
              setUpdateRecipe(undefined);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
};

export default RecipesPage;
