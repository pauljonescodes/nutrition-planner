import { AddIcon } from "@chakra-ui/icons";
import { Box, Center, Heading, HStack, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MainMenu } from "../components/main-menu";
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

  return (
    <Box>
      <HStack p="4">
        <Box>
          <MainMenu />
        </Box>
        <Box flex="1">
          <Center>
            <Heading size="md">Recipes</Heading>
          </Center>
        </Box>
        <Box>
          <IconButton onClick={() => {}} icon={<AddIcon />} aria-label="Add" />
        </Box>
      </HStack>
    </Box>
  );
};

export default RecipesPage;
