import { Fragment, useEffect, useState } from "react";
import { Database } from "../data/database";
import { Recipe } from "../data/models/recipe";
import { RecipeFormValue } from "../forms/RecipeForm";

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

  return <Fragment></Fragment>;
};

export default RecipesPage;
