import { ItemDocument } from "../data/Database";

export interface AppState {
  ingredientFormDrawerIsOpen?: boolean;
  recipeFormDrawerIsOpen?: boolean;
  updateItem?: ItemDocument;
  deleteItem?: ItemDocument;
  setAppState?: (value: AppState) => void;
}
