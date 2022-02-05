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
import { yupIngredientInRecipeSchema } from "../../data/models/ingredient-in-recipe";
import { Recipe, yupRecipeSchema } from "../../data/models/recipe";
import {
  RecipeForm,
  RecipeFormIngredientInRecipe,
  RecipeFormValue,
} from "../../forms/RecipeForm";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[] | undefined>(undefined);
  const [showAdd, setShowAdd] = useState(false);
  const [updateRecipe, setUpdateRecipe] = useState<RecipeFormValue | undefined>(
    undefined
  );

  async function refreshState() {
    setRecipes(await Database.shared().arrayOfRecipes());
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
                          onClick={async () => {
                            const ingredientsInRecipe =
                              await Database.shared().ingredientsInRecipeArray(
                                value.id
                              );
                            [];

                            const recipeFormIngredientsInRecipe: RecipeFormIngredientInRecipe[] =
                              [];

                            for (const ingredientInRecipe of ingredientsInRecipe) {
                              const ingredient =
                                await Database.shared().getIngredient(
                                  ingredientInRecipe.ingredientId
                                );
                              recipeFormIngredientsInRecipe.push({
                                ...ingredientInRecipe,
                                ingredient: ingredient,
                              });
                            }

                            const recipeFormValue: RecipeFormValue = {
                              ...value,
                              ingredientsInRecipe:
                                recipeFormIngredientsInRecipe,
                            };

                            setUpdateRecipe(recipeFormValue);
                          }}
                        >
                          <IconEditCircle />
                        </Button>
                        <Button
                          size="sm"
                          variant="link"
                          className="text-danger p-0 m-0"
                          onClick={async () => {
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
            onSubmit={async (formValue) => {
              for (const ingredientInRecipe of formValue.ingredientsInRecipe) {
                ingredientInRecipe.recipeId = formValue.id;
                ingredientInRecipe.id = nanoid();

                Database.shared().putIngredientInRecipe(
                  await yupIngredientInRecipeSchema.validate(
                    ingredientInRecipe,
                    { stripUnknown: true }
                  )
                );
              }

              await Database.shared().putRecipe(
                await yupRecipeSchema.validate(formValue, {
                  stripUnknown: true,
                })
              );
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
              Database.shared().updateRecipe(recipe).then(refreshState);
              setUpdateRecipe(undefined);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
};

export default RecipesPage;
